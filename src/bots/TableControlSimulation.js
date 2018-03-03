import {getPossibleMoves} from "./Simulation";
import * as cards from "../game/Cards";

export default class TableControlSimulation {
    constructor(player) {
        this.player = player;
    }

    getNextMove(game) {
        let opponent = game.getNotCurrentPlayer();
        let moves = getPossibleMoves(this.player, opponent);
        let currentStats = game.getStatsCurrent();

        // Select best card to play on table
        // Control - play the lowest cost supporter with highest HP,
        let bestOnTable = {move: null, hp: 0, cost: Number.MAX_SAFE_INTEGER};
        moves.onTable.forEach(move => {
            if (move.source !== cards.TYPE_SPELL && (
                    move.source.cost < bestOnTable.cost
                    || (move.source.cost === bestOnTable.cost && move.source.hp > bestOnTable.hp)
                )
            ) {
                bestOnTable.move = move;
                bestOnTable.hp = move.source.hp;
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

        // Select best controlling attack from possible attacks
        // Control - minimize number of cards on opponent's table and then their summary HP
        let bestAttack = {move: null, damage: 0, count: Number.MAX_SAFE_INTEGER, hp: Number.MAX_SAFE_INTEGER};
        moves.attacks.forEach(move => {
            let afterStats = game.getStatsAfter(move);
            if (afterStats.opponent.table.count <= currentStats.opponent.table.count) {
                let count = currentStats.opponent.table.count;
                let hp = currentStats.opponent.table.hp;
                if (
                    count < bestAttack.count
                    || (count === bestAttack.count && hp < bestAttack.hp)
                ) {
                    bestAttack.move = move;
                    bestAttack.count = count;
                    bestAttack.hp = hp;
                }
            }
        });
        // If no controlling attack exists, attack opponent's hero if he has no cards on table
        if (bestAttack.move === null && currentStats.opponent.table.count === 0) {
            moves.attacks.forEach(move => {
                let afterStats = game.getStatsAfter(move);
                if (afterStats.opponent.hero.hp < currentStats.opponent.hero.hp) {
                    let damage = currentStats.opponent.hero.hp - afterStats.opponent.hero.hp;
                    if (damage > bestAttack.damage) {
                        bestAttack.move = move;
                        bestAttack.damage = damage;
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
        if (game.getCurrentPlayer() !== this.player) return;

        let playMove = (move) => {
            game.playCard(move.source, move.target);
            if (move.target === cards.PLACE_TABLE) {
                console.log("Player " + this.player.name + " places " + move.source.name + " on table");
            } else {
                console.log("Player " + this.player.name + " attacks " + move.target.name + " with " + move.source.name);
            }
        };

        let playMoves = (possibleMoves) => {
            if (game.isGameOver()) return;
            if (possibleMoves.onTable !== null) {
                playMove(possibleMoves.onTable);
                playMoves(this.getNextMove(game));
            }
            if (possibleMoves.attack !== null) {
                playMove(possibleMoves.attack);
                playMoves(this.getNextMove(game));
            }
        };
        playMoves(this.getNextMove(game));
        game.changePlayerTurn();
    }
}