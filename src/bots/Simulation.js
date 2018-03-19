import * as cards from '../game/Cards.js'
import deepDiff from 'deep-diff'
import _ from 'lodash'

const maxStates = 5000

export const getPossibleTurns = (game) => {
    let movesHashSet = new Set()
    let nTurns = getPossibleMoves(game.getCurrentPlayer(), game.getNotCurrentPlayer());
    let allTurns = nTurns;
    let nStates = [];

    let digPossibilities = (startState, possibleMoves) => {
        let mergedMoves = [...possibleMoves.attacks, ...possibleMoves.onTable]
        mergedMoves.forEach(move => {
            let nGame = _.cloneDeep(startState);
            nGame.findAndPlay(move.source, move.target)

            // filter equal states
            if(isNewState(nStates, nGame)) {
                if(nStates.length > maxStates) return
                nStates.push(nGame)
                if(!nGame.isGameOver(false)){
                    digPossibilities(nGame, getPossibleMoves(nGame.getCurrentPlayer(), nGame.getNotCurrentPlayer()))
                }
            }
        })
    };
    digPossibilities(game, getPossibleMoves(game.getCurrentPlayer(), game.getNotCurrentPlayer()))
    // console.log('* possible states: ' + nStates.length)
    return nStates
};

const isNewState = (stateTabs, nState) => {

    for(let i in stateTabs) {
        let comparedState = stateTabs[i]
        if(
            herosIdentical(nState.player1.hero, comparedState.player1.hero) &&
            herosIdentical(nState.player2.hero, comparedState.player2.hero)
        ) return false
    }
    return true
}

const herosIdentical = (h1, h2) => {
    if(
        h1.hp != h2.hp ||
        h1.mana != h2.mana ||
        h1.handCards.length != h2.handCards.length ||
        h1.tableCards.length != h2.tableCards.length
    ) return false
    for (let i in h1.handCards) {
        if(!cardsIdentical(h1.handCards[i], h2.handCards[i], false)) return false
    }
    for (let i in h1.tableCards) {
        if(!cardsIdentical(h1.tableCards[i], h2.tableCards[i], true)) return false
    }

    return true
}

const cardsIdentical = (c1, c2, deepCompare) => {
    if(c1.name != c2.name) return false
    if(deepCompare) {
        if(
            c1.hp != c2.hp ||
            c1.attackReady != c2.attackReady
        ) {
            return false
        }
    }
    return true
}


export const getPossibleMoves = (player, opponent) => {
    let result = {
        attacks: [],
        onTable: []
    };
    //check all possible putting card
    player.hero.handCards.forEach(v => {
        if (v.cost <= player.hero.mana) {
            if (v.type === cards.TYPE_COMMON_SUPPORTER || v.type === cards.TYPE_SPECIAL_SUPPORTER) {
                result.onTable.push({
                    source: v,
                    target: cards.PLACE_TABLE,
                })
            }
            else if (v.type === cards.TYPE_SPELL) {
                if (v.availablePlace === cards.PLACE_TABLE) {
                    result.onTable.push({
                        source: v,
                        target: cards.PLACE_TABLE,
                    })
                } else if (v.special.target === cards.PLACE_MY_SUPPORTER) {
                    player.hero.tableCards.forEach(tCard => {
                        result.onTable.push({
                            source: v,
                            target: tCard
                        })
                    })
                }
            }
        }
    });

    //check all possible attacks
    player.hero.tableCards.forEach(v => {
        if (v.attackReady) {
            result.attacks.push({
                source: v,
                target: opponent.hero
            });
            opponent.hero.tableCards.forEach(oppCard => {
                result.attacks.push({
                    source: v,
                    target: oppCard
                })
            })
        }
    });

    return result
};
