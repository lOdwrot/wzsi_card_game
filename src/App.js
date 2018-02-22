import React, { Component } from 'react'
import React, { Component } from 'react'
import {getSpells, getSupporters, getSpecialSupproters} from './game/Cards.js'
import {CardComponent} from './components/Cards.js'
import _ from 'lodash'

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.renderAvailableCards()}
      </div>
    )
  }

  renderAvailableCards() {
    return (
      <div>
        <p>Avilable Cards</p>
        <p>Supporters</p>
        <div>
          {_.toArray(getSupporters()).map(v => (<CardComponent card={v}/>))}
        </div>
        <p>Special Supporters</p>
        <div>
          {_.toArray(getSpecialSupproters()).map(v => (<CardComponent card={v}/>))}
        </div>
        <p>Spells</p>
        <div>
          {_.toArray(getSpells()).map(v => (<CardComponent card={v}/>))}
        </div>
      </div>
    )
  }
}

export default App;
