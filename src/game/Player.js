import Hero from "./Hero";
import RandomSimulation from '../bots/RandomSimulation'
import AggressiveSimulation from '../bots/AggressiveSimulation'

export const MANUAL_PLAYER = 'manual';
export const RANDOM_PLAYER = 'random';
export const AGGRESSIVE_PLAYER = 'aggressive';

let cardsStats = (cards) => {
    let hp = 0, attack = 0, count = 0;
    cards.forEach(card => {
        hp += card.hp;
        attack += card.attack;
        count++;
    });
    return { hp: hp, attack: attack, count: count };
};

class Player {
    constructor(name, type) {
        this.hero = new Hero(name);
        this.name = this.hero.name;
        this.type = type;
        this.simulation = this.getSimulation();
    }

    getSimulation() {
        switch(this.type) {
            case MANUAL_PLAYER:
                return null;
            case RANDOM_PLAYER:
                return new RandomSimulation(this);
            case AGGRESSIVE_PLAYER:
                return new AggressiveSimulation(this);
            default:
                console.error("No such player type: " + this.type);
                return null;
        }
    }

    playTurn(game) {
        if(this.simulation !== null) {
            this.simulation.playTurn(game);
        }
    }

    initTurn() {
        this.hero.initTurn();
    }

    getStats() {
        return {
            table: cardsStats(this.hero.tableCards),
            hero: {
                hp: this.hero.hp,
                attack: this.hero.attack,
            }
        }
    }
}

export default Player