import Hero from './Hero.js'
import _ from 'lodash'
import * as cards from './Cards.js'

const INITIAL_CARDS = 4
const MAX_MANA = 10

export const TARGET_TABLE = 'TARGET_TABLE'
export const TARGET_HERO = 'TARGET_HERO'
export const TARGET_CARD = 'TARGET_CARD'

var visualizedGameInstane

export const getVisualizedGameInstance = () => {
  if(visualizedGameInstane == null) visualizedGameInstane = new Game()
  visualizedGameInstane.player1 = new Hero('P1')
  visualizedGameInstane.player2 = new Hero('P2')


  return visualizedGameInstane
}

export const forceChangeVisualizedGameInstance = (nGame) => {
  visualizedGameInstane = {...visualizedGameInstane, ...nGame}
}

export class Game {
  //Outside methods

  initGame() {
    this.player1 = new Hero('P1')
    this.player2 = new Hero('P2')

    this.manaCounter = 0
    let players = [this.player1 , this.player2]
    players.forEach((player, index) => {
      player.resetHero()
      for(let i = 0; i < INITIAL_CARDS; i++) player.getCard()
    })

    this.startPlayerName = this.player1.name
    this.setPlayerTurn(this.player1)
  }

  changePlayerTurn() {
    if(this.player1.hp <= 0 || this.player2.hp <= 0) {
      return console.log('Game finised')
    }

    this.setPlayerTurn(this.currentPlayer.name == this.player1.name ? this.player2 : this.player1)
    this.currentPlayer.initTurn()
  }

  playCard(source, target) {
    if(this.player1.hp <= 0 || this.player2.hp <= 0) {
      return console.log('Game finised')
    }

    //validate move
    //check move is valid when play spell
    if(source.type == cards.TYPE_SPELL) {
      if(
        (source.availablePlace == cards.PLACE_TABLE && target != cards.PLACE_TABLE) ||
        (source.availablePlace == cards.PLACE_MY_SUPPORTER && target.ownerName != this.currentPlayer.name) ||
        (source.availablePlace == cards.PLACE_ENEMY_SUPPORTET && target.ownerName == this.currentPlayer.name)
      )  {
        return console.log(`Invalid place type, expected: ${source.availablePlace}`)
      }
    }

    if(source.cost > this.currentPlayer.mana) {
      return console.log(`Not enough mana points ${source.cost} / ${this.currentPlayer.mana}`)
    }

    if(source.state == cards.STATE_IN_HAND) {
      this.currentPlayer.playCardOnTable(source)
      if(target == cards.PLACE_TABLE) {
        if(source.type == cards.TYPE_SPELL) {
          this.useSpell(source.special, target, source)
        } else if(source.type == cards.TYPE_SPECIAL_SUPPORTER && source.appearEffect) {
          this.useSpell(source.appearEffect, source.appearEffect.target)
        }
      } else if(source.type == cards.TYPE_SPELL) {
        this.useSpell(source.special, target, source)
      }
      return
    }


    if(typeof source != 'object' ||  typeof target != 'object') return console.log('Invalid target')

    if(source.state == cards.STATE_ON_TABLE &&
      [cards.TYPE_COMMON_SUPPORTER, cards.TYPE_SPECIAL_SUPPORTER].includes(source.type) &&
      target.ownerName != this.currentPlayer.name
    ) {
      if(source.attackReady) this.fight(source, target)
      else console.log('Not ready for attack')
    }
  }

  getCurrentPlayer() {
    return this.currentPlayer
  }

  getNotCurrentPlayer() {
    return this.currentPlayer == this.player1.name ?
            this.player2 : this.player1
  }

  getSyncData() {
    return this
  }

  //inner methods
  setPlayerTurn(player) {
    this.currentPlayer = player
    if(this.currentPlayer.name == this.startPlayerName && this.manaCounter < MAX_MANA) {
      this.manaCounter++
    }
    this.currentPlayer.mana = this.manaCounter
  }



  useSpell(special, target, source) {
    let targets
    let specyfication = special.specyfication
    if(special.target == cards.ALL_IN_HAND_SUPPORTERS) targets = this.currentPlayer.hand
    if(special.target == cards.ALL_ENEMY_SUPPORTERS) targets = this.currentPlayer.name != this.player1.name ? this.player1.tableCard : this.player2.tableCard
    if(special.target == cards.SELECTED_ALLIE_SUPPORTER) targets = [target]
    if(special.target == cards.ENEMY_HERO) targets = this.currentPlayer.name != this.player1.name ? [this.player1] : [this.player2]

    targets.forEach(v => {
      if(special.type == cards.MODIFIE_STATS) {
        if(specyfication.type == cards.INCREASE) {
          if(specyfication.hp && specyfication.hp > 0) v.hp += specyfication.hp
          else this.damage(v, -specyfication.hp)
          if(specyfication.attack) v.attack += specyfication.attack
        }
      } else if(special.type == cards.GIVE_EFFECT) {
        target.effects.push(specyfication.effect)
      }
    })

    this.player1.refreshHand()
    this.player2.refreshHand()
  }

  fight(source, target) {
    if(target.attack != 0) this.damage(source, target.attack)
    if(source.attack != 0) this.damage(target, source.attack)
    source.attackReady = false
    this.player1.refreshHand()
    this.player2.refreshHand()
  }

  damage(target, value) {
    if(_.isEmpty(target.effects) || !target.effects.includes(cards.ONE_TIME_SHIELD)) {
      if(target.hurt)target.hurt(value)
      else target.hp -= value
    } else {
      target.effects.splice(target.effects.indexOf(cards.ONE_TIME_SHIELD), 1)
    }
  }

}
