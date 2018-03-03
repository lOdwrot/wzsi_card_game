import {getPossibleMoves} from "./Simulation";
import * as cards from "../game/Cards";

export default class RandomSimulation {
    constructor(player) {
        this.player = player;
    }

    getNextMove(game) {
        let moves = getPossibleMoves(this.player, game.getNotCurrentPlayer());
        return {
            onTable: moves.onTable[Math.floor(Math.random()*moves.onTable.length)] || null,
            attack: moves.attacks[Math.floor(Math.random()*moves.attacks.length)] || null
        }
    }

    playTurn(game) {
        if(game.getCurrentPlayer() !== this.player) return;

        let playMove = (move) => {
            game.playCard(move.source, move.target);
            if(move.target === cards.PLACE_TABLE) {
                console.log("Player " + this.player.name + " places " + move.source.name + " on table");
            } else {
                console.log("Player " + this.player.name + " attacks " + move.target.name + " with " + move.source.name);
            }
        };

        let playMoves = (possibleMoves) => {
            if (game.isGameOver()) return;
            if(possibleMoves.onTable !== null) {
                playMove(possibleMoves.onTable);
                playMoves(this.getNextMove(game));
            }
            if(possibleMoves.attack !== null) {
                playMove(possibleMoves.attack);
                playMoves(this.getNextMove(game));
            }
        };
        playMoves(this.getNextMove(game));
        game.changePlayerTurn();
    }
}
