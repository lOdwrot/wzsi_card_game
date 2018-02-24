import React, { Component } from 'react'
import CardComponent from './Card'
import * as table from '../game/Table.js'
import * as cards from '../game/Cards.js'
import _ from 'lodash'

const rowContainer = {
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  minHeight: '150px'
}

export default class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {...table.getSyncData(), selectedCard: {}}
    this.refreshTableState = this.refreshTableState.bind(this)
    this.clickCard = this.clickCard.bind(this)
    this.clickTable = this.clickTable.bind(this)
    this.endTurn = this.endTurn.bind(this)
    this.clickHero = this.clickHero.bind(this)
  }

  refreshTableState(additionalChanges = {}) {
    this.setState({...this.state, ...table.getSyncData(), ...additionalChanges})
  }

  render() {
    return(
      <div>
        {this.renderTopControl()}
        {this.renderPlayerInfo(this.state.player1)}
        {this.renderPlayerHand(this.state.player1)}
        {this.renderTableCards(this.state.player1)}
        <button onClick={() =>this.clickTable()}>Put on table</button>
        <button onClick={() =>this.endTurn()}>End Turn</button>
        {this.renderTableCards(this.state.player2)}
        {this.renderPlayerHand(this.state.player2)}
        {this.renderPlayerInfo(this.state.player2)}
      </div>
    )
  }

  renderTopControl() {
    return(
      <div>
        <button onClick={() => {
          table.initGame()
          this.refreshTableState()
        }}>
          Init game
        </button>
        <button onClick={() => console.log(this.state)}>
          show state
        </button>
      </div>
    )
  }

  renderPlayerHand(player) {
    return (
      <div>
        {`Player hand: ${player.name}`}
        <div style={rowContainer}>
          {player.hand.map(v =>
            <CardComponent
              card={v}
              key={v.id}
              selected={this.state.selectedCard.id == v.id}
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
          {player.tableCard.map(v =>
            <CardComponent
              card={v}
              key={v.id}
              selected={this.state.selectedCard.id == v.id}
              clickAction={() => this.clickCard(v)}/>)}
        </div>
      </div>
    )
  }

  renderPlayerInfo(player) {
    if(!player) return 'No player'
    let resultStr = this.state.currentPlayer && this.state.currentPlayer.name == player.name ? '=> ' : ''
    return (
      <div>
        {this.state.currentPlayer && this.state.currentPlayer.name == player.name ? '=> ' : ''}
        <button onClick={() => this.clickHero(player)}>
          {`Hero: ${player.name}`}
        </button>
        { `Hp: ${player.hp} Mana: ${player.mana}`}
      </div>
    )
  }

  clickCard(card) {
    if(_.isEmpty(this.state.selectedCard) && card.ownerName == this.state.currentPlayer.name) {
      this.setState({...this.state, selectedCard: card})
    } else if(!_.isEmpty(this.state.selectedCard) &&
              card.ownerName == this.state.currentPlayer.name &&
              card.state == cards.STATE_IN_HAND
            ) {
      this.setState({...this.state, selectedCard: card})
    }else if(!_.isEmpty(this.state.selectedCard) && this.state.selectedCard.id == card.id) {
      this.setState({...this.state, selectedCard: {}})
    }else if(!_.isEmpty(this.state.selectedCard) && card.state == cards.STATE_ON_TABLE) {
      table.playCard(this.state.selectedCard, card)
      this.refreshTableState({selectedCard: {}})
    }
  }

  clickTable() {
    if(!_.isEmpty(this.state.selectedCard) && this.state.selectedCard.state == cards.STATE_IN_HAND) {
      table.playCard(this.state.selectedCard, 'TABLE')
      this.refreshTableState({selectedCard: {}})
    }
  }

  clickHero(player) {
    if(!_.isEmpty(this.state.selectedCard) && this.state.selectedCard.state == cards.STATE_ON_TABLE) {
      table.playCard(this.state.selectedCard, player)
      this.refreshTableState({selectedCard: {}})
    }
  }

  endTurn() {
    table.changePlayerTurn()
    this.refreshTableState({selectedCard: {}})
  }
}
