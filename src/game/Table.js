import _ from 'lodash'
import * as cards from './Cards.js'
import Player from "./Player";

const INITIAL_CARDS = 4;
const MAX_MANA = 10;

export const TARGET_TABLE = 'TARGET_TABLE';
export const TARGET_HERO = 'TARGET_HERO';
export const TARGET_CARD = 'TARGET_CARD';

var visualizedGameInstance = null;

export const getVisualizedGameInstance = () => {
  if(visualizedGameInstance === null) {
    visualizedGameInstance = new Game();
    visualizedGameInstance.player1 = new Player('P1', 'random');
    visualizedGameInstance.player2 = new Player('P2', 'manual');
  }

  return visualizedGameInstance
};

export const forceChangeVisualizedGameInstance = (nGame) => {
  visualizedGameInstance = {...visualizedGameInstance, ...nGame}
};

export class Game {
  //Outside methods
    constructor() {
        this.manaCounter = 0;
    }

  initGame() {
    if(this.player1 === null) {
      this.player1 = new Player('P1', 'random');
    }
    if(this.player2 === null) {
      this.player2 = new Player('P2', 'manual');
    }

    this.manaCounter = 0;
    let players = [this.player1 , this.player2];
    players.forEach((player, index) => {
      player.hero.resetHero();
      for(let i = 0; i < INITIAL_CARDS; i++) player.hero.getCard()
    });

    this.startPlayerName = this.player1.name;
    this.setPlayerTurn(this.player1);
    this.currentPlayer.playTurn();
  }

  changePlayerTurn() {
    if(this.player1.hero.hp <= 0 || this.player2.hero.hp <= 0) {
      return console.log('Game finished');
    }

    this.setPlayerTurn(this.currentPlayer.name === this.player1.name ? this.player2 : this.player1);
    this.currentPlayer.initTurn();
    this.currentPlayer.playTurn();
  }

  playCard(source, target) {
    if(this.player1.hero.hp <= 0 || this.player2.hero.hp <= 0) {
      return console.log('Game finished');
    }

    //validate move
    //check move is valid when play spell
    if(source.type === cards.TYPE_SPELL) {
      if(
        (source.availablePlace === cards.PLACE_TABLE && target !== cards.PLACE_TABLE) ||
        (source.availablePlace === cards.PLACE_MY_SUPPORTER && target.ownerName !== this.currentPlayer.name) ||
        (source.availablePlace === cards.PLACE_ENEMY_SUPPORTET && target.ownerName === this.currentPlayer.name)
      )  {
        return console.log(`Invalid place type, expected: ${source.availablePlace}`);
      }
    }

    if(target === cards.PLACE_TABLE && source.cost > this.currentPlayer.hero.mana) {
      return console.log(`Not enough mana points ${source.cost} / ${this.currentPlayer.hero.mana}`)
    }

    if(source.state === cards.STATE_IN_HAND) {
      this.currentPlayer.hero.playCardOnTable(source);
      if(target === cards.PLACE_TABLE) {
        if(source.type === cards.TYPE_SPELL) {
          this.useSpell(source.special, target, source)
        } else if(source.type === cards.TYPE_SPECIAL_SUPPORTER && source.appearEffect) {
          this.useSpell(source.appearEffect, source.appearEffect.target)
        }
      } else if(source.type === cards.TYPE_SPELL) {
        this.useSpell(source.special, target, source)
      }
      return
    }


    if(typeof source !== 'object' ||  typeof target !== 'object') return console.log('Invalid target');

    if(source.state === cards.STATE_ON_TABLE &&
      [cards.TYPE_COMMON_SUPPORTER, cards.TYPE_SPECIAL_SUPPORTER].includes(source.type) &&
      target.ownerName !== this.currentPlayer.name
    ) {
      if(source.attackReady) this.fight(source, target);
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

  getSyncData() {
    return this
  }

  //inner methods
  setPlayerTurn(player) {
    this.currentPlayer = player;
    console.log("Player " + player.name + " turn starts");
    if(this.currentPlayer.name === this.startPlayerName && this.manaCounter < MAX_MANA) {
      this.manaCounter++
    }
    this.currentPlayer.hero.mana = this.manaCounter
  }



  useSpell(special, target, source) {
    let targets;
    let specification = special.specification;
    if(special.target === cards.ALL_IN_HAND_SUPPORTERS) targets = this.currentPlayer.hero.hand;
    if(special.target === cards.ALL_ENEMY_SUPPORTERS) targets = this.currentPlayer.name !== this.player1.name ? this.player1.hero.tableCard : this.player2.hero.tableCard;
    if(special.target === cards.SELECTED_ALLY_SUPPORTER) targets = [target];
    if(special.target === cards.ENEMY_HERO) targets = this.currentPlayer.name !== this.player1.name ? [this.player1.hero] : [this.player2.hero];

    targets.forEach(v => {
      if(special.type === cards.MODIFY_STATS) {
        if(specification.type === cards.INCREASE) {
          if(specification.hp && specification.hp > 0) v.hp += specification.hp;
          else this.damage(v, -specification.hp);
          if(specification.attack) v.attack += specification.attack
        }
      } else if(special.type === cards.GIVE_EFFECT) {
        target.effects.push(specification.effect)
      }
    });

    this.player1.hero.refreshHand();
    this.player2.hero.refreshHand()
  }

  fight(source, target) {
    if(target.attack !== 0) this.damage(source, target.attack);
    if(source.attack !== 0) this.damage(target, source.attack);
    source.attackReady = false;
    this.player1.hero.refreshHand();
    this.player2.hero.refreshHand()
  }

  damage(target, value) {
    if(_.isEmpty(target.effects) || !target.effects.includes(cards.ONE_TIME_SHIELD)) {
      if(target.hurt) target.hurt(value);
      else target.hp -= value
    } else {
      target.effects.splice(target.effects.indexOf(cards.ONE_TIME_SHIELD), 1)
    }
  }

}
