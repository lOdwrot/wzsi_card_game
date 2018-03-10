import React, {Component} from 'react'
import CardComponent from './Card'
import * as table from '../game/Table.js'
import * as cards from '../game/Cards.js'
import {getPossibleTurns, getPossibleMoves} from '../bots/Simulation.js'
import {getRandomPlayoutWinner} from '../bots/MonteCarlo.js'
import _ from 'lodash'

const rowContainer = {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    minHeight: '150px'
};

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.game = table.getVisualizedGameInstance();


        this.state = {...this.game.getSyncData(), selectedCard: {}};
        this.refreshTableState = this.refreshTableState.bind(this);
        this.clickCard = this.clickCard.bind(this);
        this.clickTable = this.clickTable.bind(this);
        this.endTurn = this.endTurn.bind(this);
        this.clickHero = this.clickHero.bind(this)

        table.setVisualizationListener(this.refreshTableState)
    }

    refreshTableState(additionalChanges = {}) {
        this.setState({...this.state, ...this.game.getSyncData(), ...additionalChanges})
    }

    render() {
        return (
            <div>
                {this.renderTopControl()}
                {this.renderPlayerInfo(this.state.player1)}
                {this.renderPlayerHand(this.state.player1)}
                {this.renderTableCards(this.state.player1)}
                <button onClick={() => this.clickTable()}>Put on table</button>
                <button onClick={() => this.endTurn()}>End Turn</button>
                <button onClick={() => console.log(getRandomPlayoutWinner(_.cloneDeep(this.game)))}>Check random playout</button>
                {this.renderTableCards(this.state.player2)}
                {this.renderPlayerHand(this.state.player2)}
                {this.renderPlayerInfo(this.state.player2)}
            </div>
        )
    }

    renderTopControl() {
        return (
            <div>
                <button onClick={() => {
                    this.game.initGame();
                    this.refreshTableState({selectedCard: {}})
                }}>
                    Init game
                </button>
                <button onClick={() => console.log(this.state)}>
                    show state
                </button>
                <button
                    onClick={() => console.log(getPossibleMoves(this.game.getCurrentPlayer(), this.game.getNotCurrentPlayer()))}>
                    Get Possible Moves
                </button>
                <button onClick={() => console.log(getPossibleTurns(this.game))}>
                    Get Possible Turns
                </button>
            </div>
        )
    }

    renderPlayerHand(player) {
        return (
            <div>
                {`Player hand: ${player.name}`}
                <div style={rowContainer}>
                    {player.hero.handCards.map(v =>
                        <CardComponent
                            card={v}
                            key={v.id}
                            selected={this.state.selectedCard.id === v.id}
                            clickAction={() => this.clickCard(v)}/>)}
                </div>
            </div>
        )
    }

    renderTableCards(player) {
        return (
            <div>
                {`Player Table: ${player.name}`}
                <div style={rowContainer}>
                    {player.hero.tableCards.map(v =>
                        <CardComponent
                            card={v}
                            key={v.id}
                            selected={this.state.selectedCard.id === v.id}
                            clickAction={() => this.clickCard(v)}/>)}
                </div>
            </div>
        )
    }

    renderPlayerInfo(player) {
        if (!player) return 'No player';
        let resultStr = this.state.currentPlayer && this.state.currentPlayer.name === player.name ? '=> ' : '';
        return (
            <div>
                {this.state.currentPlayer && this.state.currentPlayer.name === player.name ? '=> ' : ''}
                <button onClick={() => this.clickHero(player.hero)}>
                    {`Hero: ${player.name}, ${player.type}`}
                </button>
                {`Hp: ${player.hero.hp} Mana: ${player.hero.mana}/${this.state.manaCounter}`}
            </div>
        )
    }

    clickCard(card) {
        if (_.isEmpty(this.state.selectedCard) && card.ownerName === this.state.currentPlayer.name) {
            this.setState({...this.state, selectedCard: card})
        } else if (!_.isEmpty(this.state.selectedCard) &&
            card.ownerName === this.state.currentPlayer.name &&
            card.state === cards.STATE_IN_HAND
        ) {
            this.setState({...this.state, selectedCard: card})
        } else if (!_.isEmpty(this.state.selectedCard) && this.state.selectedCard.id === card.id) {
            this.setState({...this.state, selectedCard: {}})
        } else if (!_.isEmpty(this.state.selectedCard) && card.state === cards.STATE_ON_TABLE) {
            this.game.playCard(this.state.selectedCard, card);
            this.refreshTableState({selectedCard: {}})
        }
    }

    clickTable() {
        if (!_.isEmpty(this.state.selectedCard) && this.state.selectedCard.state === cards.STATE_IN_HAND) {
            this.game.playCard(this.state.selectedCard, cards.PLACE_TABLE);
            this.refreshTableState({selectedCard: {}})
        }
    }

    clickHero(hero) {
        if (!_.isEmpty(this.state.selectedCard) && this.state.selectedCard.state === cards.STATE_ON_TABLE) {
            this.game.playCard(this.state.selectedCard, hero);
            this.refreshTableState({selectedCard: {}})
        }
    }

    endTurn() {
        this.game.changePlayerTurn();
        this.refreshTableState({selectedCard: {}})
    }
}
