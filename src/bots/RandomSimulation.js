import {getPossibleMoves} from "./Simulation";
import * as cards from "../game/Cards";
import _ from 'lodash'

export default class RandomSimulation {
    constructor(player) {
        this.player = player;
    }

    playTurn(game) {
        while(true) {
            if (game.isGameOver()) return
            let possibleMoves = _.flatten(_.toArray(getPossibleMoves(this.player, game.getNotCurrentPlayer())))
            if(_.isEmpty(possibleMoves)) break
            let selectedMove = _.shuffle(possibleMoves)[0]
            game.findAndPlay(selectedMove.source, selectedMove.target)
        }
        game.changePlayerTurn()
    }

}
