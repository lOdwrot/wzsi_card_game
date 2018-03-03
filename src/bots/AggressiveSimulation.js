import {getPossibleMoves} from "./Simulation";
import * as cards from "../game/Cards";

export default class AggressiveSimulation{
    constructor(player) {
        this.player = player;
    }

    getNextMove(game) {
        let opponent = game.getNotCurrentPlayer();
        let moves = getPossibleMoves(this.player, opponent);
        let currentStats = game.getStatsCurrent();

        // Select best card to play on table
        // Aggressive - play the highest damage supporter with the lowest cost,
        let bestOnTable = {move: null, attack: 0, cost: Number.MAX_SAFE_INTEGER};
        moves.onTable.forEach(move => {
            if (move.source.attack && (
                    move.source.attack > bestOnTable.attack
                    || (move.source.attack === bestOnTable.attack && move.source.cost < bestOnTable.cost)
                )
            ){
                bestOnTable.move = move;
                bestOnTable.attack = move.source.attack;
                bestOnTable.cost = move.source.cost;
            }
        });
        // If only spells available then select cheapest one
        if (bestOnTable.move === null) {
            moves.onTable.forEach(move => {
                if (move.source.cost < bestOnTable.cost) {
                    bestOnTable.move = move;
                    bestOnTable.cost = move.source.cost;
                }
            });
        }

        // Select best aggressive attack from possible attacks
        // Aggressive - minimize opponent's hero HP
        let bestAttack = {move: null, damage: 0, count: Number.MAX_SAFE_INTEGER, hp: Number.MAX_SAFE_INTEGER};
        moves.attacks.forEach(move => {
            let afterStats = game.getStatsAfter(move);
            if (afterStats.opponent.hero.hp < currentStats.opponent.hero.hp){
                let damage = currentStats.opponent.hero.hp - afterStats.opponent.hero.hp;
                if (damage > bestAttack.damage){
                    bestAttack.move = move;
                    bestAttack.damage = damage;
                }
            }
        });
        // If no aggressive attack exists, select best control attack
        // Control - minimize number of cards on opponent's table and then their summary HP
        if (bestAttack.move === null){
            moves.attacks.forEach(move => {
                let afterStats = game.getStatsAfter(move);
                if (afterStats.opponent.table.count <= currentStats.opponent.table.count){
                    let count = currentStats.opponent.table.count;
                    let hp = currentStats.opponent.table.hp;
                    if (
                        count < bestAttack.count
                        || (count === bestAttack.count && hp < bestAttack.hp)
                    ){
                        bestAttack.move = move;
                        bestAttack.count = count;
                        bestAttack.hp = hp;
                    }
                }
            });
        }

        return {
            onTable: bestOnTable.move,
            attack: bestAttack.move
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