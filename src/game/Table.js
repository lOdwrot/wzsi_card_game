import _ from 'lodash'
import * as cards from './Cards.js'
import Player, {AGGRESSIVE_PLAYER, RANDOM_PLAYER, TABLE_CONTROL_PLAYER, MANUAL_PLAYER} from "./Player";

const INITIAL_CARDS = 4;
const MAX_MANA = 10;

export const TARGET_TABLE = 'TARGET_TABLE';
export const TARGET_HERO = 'TARGET_HERO';
export const TARGET_CARD = 'TARGET_CARD';

const PLAYER1_TYPE = TABLE_CONTROL_PLAYER;
const PLAYER2_TYPE = AGGRESSIVE_PLAYER;

let visualizedGameInstance = null;

export const getVisualizedGameInstance = () => {
    if (visualizedGameInstance === null) {
        visualizedGameInstance = new Game(['P1', 'P2'], [MANUAL_PLAYER, MANUAL_PLAYER]);
    }

    return visualizedGameInstance
};

export const forceChangeVisualizedGameInstance = (nGame) => {
    visualizedGameInstance = {...visualizedGameInstance, ...nGame}
};

export class Game {
    //Outside methods
    constructor(names, types) {
        this.player1 = new Player(names[0], types[0]);
        this.player2 = new Player(names[1], types[1]);
        this.manaCounter = 0;
    }

    initGame(names, types) {
        if (names && names.length === 2 && types && types.length === 2) {
            this.player1 = new Player(names[0], types[0]);
            this.player2 = new Player(names[1], types[1]);
        }

        this.manaCounter = 0;
        let players = [this.player1, this.player2];
        players.forEach((player, index) => {
            player.hero.resetHero();
            for (let i = 0; i < INITIAL_CARDS; i++) player.hero.getCard()
        });

        this.startPlayerName = this.player1.name;
        this.setPlayerTurn(this.player1);
        this.currentPlayer.playTurn(this);
    }

    isGameOver() {
        return (this.player1.hero.hp <= 0 || this.player2.hero.hp <= 0)
    }


    changePlayerTurn() {
        if (this.isGameOver()) {
            return console.log('Game finished');
        }

        this.setPlayerTurn(this.currentPlayer.name === this.player1.name ? this.player2 : this.player1);
        this.currentPlayer.initTurn();
        this.currentPlayer.playTurn(this);
    }

    findAndPlay(source, traget) {
        this.playCard(
            this.findRef(source),
            this.findRef(traget)
        )
    }

    findRef(obj) {
        if(typeof obj == 'string') return obj
        if(obj.type == 'hero') return obj.name == this.player1.name ? this.player2 : this.player1
        return this.player1.hero.findCardById(obj.id) || this.player2.hero.findCardById(obj.id)
    }

    playCard(source, target) {
        if (this.isGameOver()) {
            return console.log('Game finished');
        }

        //validate move
        //check move is valid when play spell
        if (source.type === cards.TYPE_SPELL) {
            if (
                (source.availablePlace === cards.PLACE_TABLE && target !== cards.PLACE_TABLE) ||
                (source.availablePlace === cards.PLACE_MY_SUPPORTER && target.ownerName !== this.currentPlayer.name) ||
                (source.availablePlace === cards.PLACE_ENEMY_SUPPORTER && target.ownerName === this.currentPlayer.name)
            ) {
                return console.log(`Invalid place type, expected: ${source.availablePlace}`);
            }
        }

        if (target === cards.PLACE_TABLE && source.cost > this.currentPlayer.hero.mana) {
            return console.log(`Not enough mana points ${source.cost} / ${this.currentPlayer.hero.mana}`)
        }

        if (source.state === cards.STATE_IN_HAND) {
            this.currentPlayer.hero.playCardOnTable(source);
            if (target === cards.PLACE_TABLE) {
                if (source.type === cards.TYPE_SPELL) {
                    this.useSpell(source.special, target, source)
                } else if (source.type === cards.TYPE_SPECIAL_SUPPORTER && source.appearEffect) {
                    this.useSpell(source.appearEffect, source.appearEffect.target)
                }
            } else if (source.type === cards.TYPE_SPELL) {
                this.useSpell(source.special, target, source)
            }
            return
        }


        if (typeof source !== 'object' || typeof target !== 'object') return console.log('Invalid target');

        if (source.state === cards.STATE_ON_TABLE &&
            [cards.TYPE_COMMON_SUPPORTER, cards.TYPE_SPECIAL_SUPPORTER].includes(source.type) &&
            target.ownerName !== this.currentPlayer.name
        ) {
            if (source.attackReady) this.fight(source, target);
            else console.log('Not ready for attack')
        }
    }

    getCurrentPlayer() {
        return this.currentPlayer
    }

    getNotCurrentPlayer() {
        return this.currentPlayer.name === this.player1.name ?
            this.player2 : this.player1
    }

    getStatsCurrent() {
        return {
            currentPlayer: this.currentPlayer.getStats(),
            opponent: this.getNotCurrentPlayer().getStats()
        }
    }

    getStatsAfter(move) {
        let nextGame = _.cloneDeep(this);
        nextGame.playCard(move.source, move.target);
        return nextGame.getStatsCurrent();
    }

    getSyncData() {
        return this
    }

    //inner methods
    setPlayerTurn(player) {
        this.currentPlayer = player;
        console.log("Player " + player.name + " turn starts");
        if (this.currentPlayer.name === this.startPlayerName && this.manaCounter < MAX_MANA) {
            this.manaCounter++
        }
        this.currentPlayer.hero.mana = this.manaCounter
    }


    useSpell(special, target, source) {
        let targets;
        let specification = special.specification;
        if (special.target === cards.ALL_IN_HAND_SUPPORTERS) targets = this.currentPlayer.hero.handCards;
        if (special.target === cards.ALL_ENEMY_SUPPORTERS) targets = this.getNotCurrentPlayer().hero.tableCards;
        if (special.target === cards.SELECTED_ALLY_SUPPORTER) targets = [target];
        if (special.target === cards.ENEMY_HERO) targets = [this.getNotCurrentPlayer().hero];

        targets.forEach(v => {
            if (special.type === cards.MODIFY_STATS) {
                if (specification.type === cards.INCREASE) {
                    if (specification.hp && specification.hp > 0) v.hp += specification.hp;
                    else this.damage(v, -specification.hp);
                    if (specification.attack) v.attack += specification.attack
                }
            } else if (special.type === cards.GIVE_EFFECT) {
                target.effects.push(specification.effect)
            }
        });

        this.player1.hero.refreshHand();
        this.player2.hero.refreshHand()
    }

    fight(source, target) {
        if (target.attack !== 0) this.damage(source, target.attack);
        if (source.attack !== 0) this.damage(target, source.attack);
        source.attackReady = false;
        this.player1.hero.refreshHand();
        this.player2.hero.refreshHand()
    }

    damage(target, value) {
        if (_.isEmpty(target.effects) || !target.effects.includes(cards.ONE_TIME_SHIELD)) {
            if (target.hurt) target.hurt(value);
            else target.hp -= value
        } else {
            target.effects.splice(target.effects.indexOf(cards.ONE_TIME_SHIELD), 1)
        }
    }

}
