import Hero from "./Hero";
import RandomSimulation from "../bots/RandomSimulation";
import {getVisualizedGameInstance} from "./Table";

class Player {
    constructor(name, type) {
        this.hero = new Hero(name);
        this.name = this.hero.name;
        this.type = type;
        this.simulation = this.getSimulation();
    }

    getSimulation() {
        switch(this.type) {
            case 'manual':
                return null;
            case 'random':
                return new RandomSimulation(this);
            default:
                console.error("No such player type: " + this.type);
                return null;
        }
    }

    playTurn() {
        if(this.simulation !== null) {
            this.simulation.playTurn(getVisualizedGameInstance());
        }
    }

    initTurn() {
        this.hero.initTurn();
    }
}

export default Player