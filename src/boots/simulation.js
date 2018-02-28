import * as cards from '../game/Cards.js'
import _ from 'lodash'

export const getPossibleTurns = (game) => {
    let nTurns = getPossibleMoves(game.getCurrentPlayer(), game.getNotCurrentPlayer())
    let allTurns = nTurns
    let nStates = []

    let digPossibilities = (startState, possibleMoves) => {
        [...possibleMoves.attacks, ...possibleMoves.onTable].forEach(move => {
            let nGame = _.cloneDeep(startState)
            nGame.playCard(move.source, move.target)
            nStates.push(nGame)
            digPossibilities(nGame, getPossibleMoves(nGame.getCurrentPlayer(), nGame.getNotCurrentPlayer()))
        })
    }
    digPossibilities(game, getPossibleMoves(game.getCurrentPlayer(), game.getNotCurrentPlayer()))

    return nStates
}


export const getPossibleMoves = (player, oponent) => {
    let result = {
        attacks: [],
        onTable: []
    }
    //check all possible puting card
    player.hand.forEach(v => {
        if(v.cost <= player.mana) {
            if(v.type == cards.TYPE_COMMON_SUPPORTER || v.type == cards.TYPE_SPECIAL_SUPPORTER) {
                result.onTable.push({
                    source: v,
                    target: cards.PLACE_TABLE,
                })
            }
            else if(v.type == cards.TYPE_SPELL) {
                if(v.availablePlace == cards.PLACE_TABLE) {
                    result.onTable.push({
                        source: v,
                        target: cards.PLACE_TABLE,
                    })
                }else if(v.special.target == cards.PLACE_MY_SUPPORTER) {
                    player.tableCard.forEach(tCard => {
                        result.onTable.push({
                            source: v,
                            target: tCard
                        })
                    })
                }
            }
        }
    })

    //check all possible attacks
    player.tableCard.forEach(v => {
        if(v.attackReady) {
            result.attacks.push({
                source: v,
                target: oponent
            })
            oponent.tableCard.forEach(oppCard => {
                result.attacks.push({
                    source: v,
                    target: oppCard
                })
            })
        }
    })

    return result
}
