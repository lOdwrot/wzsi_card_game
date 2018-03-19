import {getPossibleTurns} from './Simulation.js'
import {Game} from '../game/Table.js'
import _ from 'lodash'

const cParam = 1
const randomSimulationRepeats = 5
const timeLilit = 3 * 1000

export default class MonteCarloSimulation {
    constructor(player) {
        this.player = player;
    }

    playTurn(game) {
        if (game.isGameOver()) return console.log('MonteCarlo boot finished')
        console.log('# turn start #')
        let mRoot = new Node(_.cloneDeep(game), null)


        let startTime = (new Date()).getTime()
        while((new Date()).getTime() - startTime < timeLilit) {
            console.log('* tree policy *')
            let mNode = this.treePolicy(mRoot)
            console.log('* default policy *')
            this.defaultPolicy(mNode)
        }

        let selectedState = mRoot.getBestChild(true)
        console.log('selectedState')
        console.log(selectedState)
        if(selectedState) {
            selectedState.moves.forEach(v => {
                console.log('* simulate move *')
                game.findAndPlay(v.source, v.target)
            })
        }

        console.log('# end turn #')
        game.changePlayerTurn()
    }

    treePolicy(node) {
        let mNode = node

        while (!mNode.isTerminal()) {
            if(!mNode.isFullyExpanded()) return mNode.expandChild()
            else mNode = mNode.getBestChild(mNode.gameState.currentPlayer.name == this.player.name)
        }
        return mNode
    }

    defaultPolicy(node) {
        node.simulateRandomAndPropagate(this.player, randomSimulationRepeats)
    }
}

class Node {
    constructor(game, parent) {
        this.gameState = game
        this.moves = []
        this.wins = 0
        this.lost = 0
        this.childs = []
        this.toExpandStates = []
        this.parent = parent
        if(game.winner) this.finalWinner = game.winner
        if(parent) parent.childs.push(this)
        this.createStatesToExpand()
    }

    isTerminal() {
        return _.isEmpty(this.childs) && _.isEmpty(this.toExpandStates)
    }

    isFullyExpanded() {
        return _.isEmpty(this.toExpandStates)
    }

    createStatesToExpand() {
        if(this.finalWinner || (!_.isEmpty(this.childs) && !_.isEmpty(this.toExpandStates))) return
        console.log('* creating states for node *')
        let possibleTurns = getPossibleTurns(this.gameState)
        console.log(possibleTurns)
        possibleTurns.forEach(nGame => {
            this.toExpandStates.push(nGame)
        })
        this.toExpandStates.push(this.gameState)
        this.toExpandStates = _.shuffle(this.toExpandStates)
        console.log('* created states for node *')
    }

    expandChild() {
        let nState = this.toExpandStates.pop()
        let nNode = new Node(nState, this)
        nNode.moves = nState.gameHistory.slice(-1)[0].moves
        nState.changePlayerTurn(true)
        return nNode
    }

    simulateRandomAndPropagate(player, repeats) {
        let mWins = 0
        let mLost = 0
        for(let i = 0; i < repeats; i++) {
            // console.log('@@@ Random game started @@@')
            let winnerName = getRandomPlayoutWinner(this.gameState).name
            // console.log('@@@ Random game finished @@@')

            if(winnerName == player.name) mWins++
            else mLost++
        }
        this.addWinsLost(mWins, mLost)
    }

    getBestChild(optimizeWins) {
        let bestChild
        let bestChildResult = -1

        this.childs.forEach(v => {
            let mResult = optimizeWins ?
                v.wins/(v.wins + v.lost) + cParam * Math.sqrt(2*Math.log(this.wins + this.lost) / (v.wins + v.lost)) :
                v.lost/(v.wins + v.lost) + cParam * Math.sqrt(2*Math.log(this.wins + this.lost) / (v.wins + v.lost))
            if(mResult > bestChildResult) {
                bestChild = v
                bestChildResult = mResult
            }
        })

        return bestChild
    }

    addWinsLost(wins, lost) {
        this.wins += wins
        this.lost += lost
        if(this.parent) this.parent.addWinsLost(wins, lost)
    }
}

export const getRandomPlayoutWinner = (game) => {
    let simulatedGame = _.cloneDeep(game)
    simulatedGame.playRandom()
    return simulatedGame.winner
}
