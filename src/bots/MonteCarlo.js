import {getPossibleTurns} from './Simulation.js'
import {Game} from '../game/Table.js'
import _ from 'lodash'

const cParam = 0.5
const randomSimulationRepeats = 1

export default class MonteCarloSimulation {
    constructor(player) {
        this.player = player
        this.timeLilit = 5 * 1000
        this.isLocked = false

        window.setLock = (lock) => this.isLocked = lock
        window.setTimeLimit = (secs) => this.timeLilit = secs * 1000
        window.forceMove = () => this.forceGame()
        window.countTreeLevel = (node) => {
            let root = node ? node : window.toAnaliseRoot
            let deepNodes = []

            let dive = (v) => {
                if(!_.isEmpty(v.childs)) v.childs.forEach(c => dive(c))
                else deepNodes.push(v)
            }
            dive(node)

            let restult = 0
            deepNodes.forEach(v => {
                let lvlCounter = 0
                let mNode = v
                let startNode = v
                while(!!mNode.parent) {
                    lvlCounter++
                    mNode = mNode.parent
                }
                if(restult < lvlCounter) {
                    restult = lvlCounter
                    window.deepestNode = startNode
                }
            })
            return restult
        }

        window.countLifts = (node, counter = 0) => {
            node.childs.forEach(v => {
                if(!_.isEmpty(v.childs)) counter += window.countLifts(v, counter)
                else counter += _.isEmpty(v.toExpandStates) && _.isEmpty(v.childs) ? 1 : 0
            })

            return counter
        }
    }

    forceGame() {
        this.playTurn(this.lastGame)
        this.showStats()
    }

    showStats() {
        console.log(window.toAnaliseRoot)
        console.log(window.countTreeLevel(window.toAnaliseRoot))
        console.log(window.countLifts(window.toAnaliseRoot, 0))
    }

    playTurn(game) {
        this.lastGame = game
        if (game.isGameOver(false)) return console.log('MonteCarlo boot finished')
        // console.log('# turn start #')
        let mRoot = new Node(_.cloneDeep(game), null)


        let startTime = (new Date()).getTime()
        while((new Date()).getTime() - startTime < this.timeLilit) {
            // console.log('* tree policy *')
            let mNode = this.treePolicy(mRoot)
            // console.log('* default policy *')
            this.defaultPolicy(mNode)
        }

        let selectedState = mRoot.getBestChild(true)
        // console.log('selectedState')
        // console.log(selectedState)
        if(selectedState && !this.isLocked) {
            selectedState.moves.forEach(v => {
                // console.log('* simulate move *')
                game.findAndPlay(v.source, v.target)
            })
        }

        window.toAnaliseRoot = mRoot
        // console.log('# end turn #')
        if(!this.isLocked) {
            game.changePlayerTurn()
            this.showStats()
        }

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
        // console.log('* creating states for node *')
        let possibleTurns = getPossibleTurns(this.gameState)
        // console.log(possibleTurns)
        possibleTurns.forEach(nGame => {
            this.toExpandStates.push(nGame)
        })
        this.toExpandStates.push(this.gameState)
        this.toExpandStates = _.shuffle(this.toExpandStates)
        // console.log('* created states for node *')
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
