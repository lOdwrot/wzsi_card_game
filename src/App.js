import React, { Component } from 'react'
import AvailableCards from './components/AvailableCards.js'
import {getDeck} from './game/Cards.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <button onClick={() => console.log(getDeck())}>shuffle deck</button>
        <AvailableCards/>
      </div>
    )
  }
}

export default App;
