import * as cards from './Cards.js'
import _ from 'lodash'

class Hero {
  constructor(heroName, controlType = 'player') {
    this.name = heroName
    this.setControlType(controlType)
    this.resetHero()
  }

  setControlType(controlType) {
    this.controlType = controlType
  }

  resetHero() {
    this.deck = cards.getDeck(this)
    this.initialHp = 20
    this.hp = this.initialHp
    this.mana = 0
    this.hand = []
    this.tableCard = []
    this.endGameTiredPoints = 1
  }

  getCard() {
    if(!_.isEmpty(this.deck)) {
      this.hand.push({...this.deck.splice(-1, 1)[0], state: cards.STATE_IN_HAND})
    } else {
      this.hurt(this.endGameTiredPoints++)
    }
  }

  hurt(damage) {
    this.hp -= damage
  }

  playCardOnTable(card) {
    this.hand = this.hand.filter(v => v.id != card.id)
    this.mana -= card.cost
    if(card.type == cards.TYPE_COMMON_SUPPORTER || card.type == cards.TYPE_SPECIAL_SUPPORTER) {
      this.tableCard.push({...card, state: cards.STATE_ON_TABLE})
    }

    if(card.type == cards.TYPE_SPECIAL_SUPPORTER || card.type == cards.TYPE_SPELL) {

    }
  }
}

export default Hero
