import Hero from "./Hero";
import RandomSimulation from '../bots/RandomSimulation'
import AggressiveSimulation from '../bots/AggressiveSimulation'
import TableControlSimulation from '../bots/TableControlSimulation'
import MonteCarlo from '../bots/MonteCarlo'

export const MANUAL_PLAYER = 'manual';
export const RANDOM_PLAYER = 'random';
export const MONTE_CARLO = 'monteCarlo';
export const AGGRESSIVE_PLAYER = 'aggressive';
export const TABLE_CONTROL_PLAYER = 'control';

let cardsStats = (cards) => {
    let hp = 0, attack = 0, count = 0;
    cards.forEach(card => {
        hp += card.hp;
        attack += card.attack;
        count++;
    });
    return {hp: hp, attack: attack, count: count};
};


class Player {
    constructor(name, type) {
        this.hero = new Hero(name);
        this.name = this.hero.name;
        this.setType(type)
    }

    setType(type) {
      this.type = type;
      this.simulation = this.getSimulation();
    }

    countIdentyfire() {
      let result = this.hero.hp * 10
      this.hero.tableCards.forEach((val, index) => {
        let multiplayer = Math.pow(4, index + 2)
        result += (val.hp * multiplayer + val.attack * multiplayer)
      })
      result += this.hero.handCards.length
      return parseInt(result)
    }

    getSimulation() {
        switch (this.type) {
            case MANUAL_PLAYER:
                return null;
            case RANDOM_PLAYER:
                return new RandomSimulation(this);
            case AGGRESSIVE_PLAYER:
                return new AggressiveSimulation(this);
            case TABLE_CONTROL_PLAYER:
                return new TableControlSimulation(this);
            case MONTE_CARLO:
                return new MonteCarlo(this);
            default:
                console.error("No such player type: " + this.type);
                return null;
        }
    }

    playTurn(game) {
        if (this.simulation !== null) {
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

    countStats(heroHealthMp, cardAttackMp, cardHealthMp, cardQuantityMp) {
        let resultStats = 0
        resultStats += heroHealthMp * this.hero.hp
        this.hero.tableCards.forEach(v =>{
            resultStats += v.hp * cardHealthMp
            resultStats += v.attack * cardAttackMp
        })
        resultStats += this.hero.tableCards.length * cardQuantityMp
        return resultStats
    };
}

export default Player
