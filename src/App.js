import React, { Component } from 'react'
import AvailableCards from './components/AvailableCards.js'
import Table from './components/Table.js'
import {getDeck} from './game/Cards.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state={activeCmp: 'TABLE'}
  }
  render() {
    return (
      <div className="App">
        <button onClick={() => console.log(getDeck())}>shuffle deck</button>
        {this.state.activeCmp == 'AVAILABLE_CARDS' && <AvailableCards/>}
        {this.state.activeCmp == 'TABLE' && <Table/>}
      </div>
    )
  }
}

export default App;
