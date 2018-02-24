import React, { Component } from 'react'
import CardComponent from './Card'
import * as table from '../game/Table.js'

const rowContainer = {
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap'
}

export default class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {...table.getSyncData()}
    this.refreshTableState = this.refreshTableState.bind(this)
  }

  refreshTableState() {
    this.setState({...this.state, ...table.getSyncData()})
  }

  render() {
    return(
      <div>
        {this.renderTopControl()}
        {this.renderPlayerHand(this.state.player1)}
        {this.renderPlayerHand(this.state.player2)}
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
        Player
        <div style={rowContainer}>
          {player.hand.map(v => <CardComponent card={v} key={v.id} clickAction={() => console.log(v)}/>)}
        </div>
      </div>
    )
  }
}
