import {getPossibleTurns} from "./Simulation";
import * as cards from "../game/Cards";
import _ from 'lodash'

const enemyHeroHealthMultiplayer = 4
const enemyCardsAttackMultiplayer = 6
const enemyCardsHealthMultiplayer = 4
const enemyCardsQuantityMultiplayer = 3
const myHeroHpMultiplayer = 1
const myCardsAttackMultiplayer = 2
const myCardsHelthMultiplayer = 2
const myCardsQuantityMultiplayer = 1

export default class TableControlSimulation {
  constructor(player) {
        this.player = player;
    }

    getMoves(game) {
        let gameStats = []

        let possibleTurns = getPossibleTurns(game)
        let winState = possibleTurns.find(v => v.isGameOver(false))
        if(winState) return winState.gameHistory.slice(-1)[0].moves

        possibleTurns.forEach(v => {
            gameStats.push({
                countStats: this.calculateStats(v),
                moves: v.gameHistory.slice(-1)[0].moves
            })
        })
        return _.isEmpty(gameStats) ? [] : gameStats.sort((a1, a2) => a2.countStats - a1.countStats)[0].moves
    }

    calculateStats(game) {
        let myPlayer = game.getCurrentPlayer()
        let enemyPlayer = game.getNotCurrentPlayer()
        let myStats = myPlayer.countStats(
                        myHeroHpMultiplayer,
                        myCardsAttackMultiplayer,
                        myCardsHelthMultiplayer,
                        myCardsQuantityMultiplayer
                    )
        let enemyStats = enemyPlayer.countStats(
                enemyHeroHealthMultiplayer,
                enemyCardsAttackMultiplayer,
                enemyCardsHealthMultiplayer,
                enemyCardsQuantityMultiplayer
            )
        return myStats - enemyStats
    }

    playTurn(game) {
        if (game.getCurrentPlayer() !== this.player) return;

        this.getMoves(game).forEach(v => {
            game.findAndPlay(v.source, v.target)
        })

        game.changePlayerTurn();
    }
}
