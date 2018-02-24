import Hero from './Hero.js'
import _ from 'lodash'
import * as cards from './Cards.js'

const INITIAL_CARDS = 4
const MAX_MANA = 10

export const TARGET_TABLE = 'TARGET_TABLE'
export const TARGET_HERO = 'TARGET_HERO'
export const TARGET_CARD = 'TARGET_CARD'

export const player1 = new Hero('P1')
export const player2 = new Hero('P2')

export const playersMap = {
  [player1.name]: player1,
  [player2.name]: player2
}

var manaCounter = 0
var startPlayerName
var currentPlayer

export const initGame = () => {
  [player1, player2].forEach((player, index) => {
    player.resetHero()
    for(let i = 0; i < INITIAL_CARDS; i++) player.getCard()
  })

  startPlayerName = player1.name
  setPlayerTurn(player1)

}

const setPlayerTurn = (player) => {
  currentPlayer = player
  if(currentPlayer.name == startPlayerName && manaCounter < MAX_MANA) {
    manaCounter++
  }
  currentPlayer.mana = manaCounter
}

export const changePlayerTurn = () => {
  if(player1.hp <= 0 || player2.hp <= 0) {
    return console.log('Game finised')
  }

  setPlayerTurn(currentPlayer.name == player1.name ? player2 : player1)
  currentPlayer.initTurn()
}

export const playCard = (source, target) => {
  if(player1.hp <= 0 || player2.hp <= 0) {
    return console.log('Game finised')
  }

  //validate move
  //check move is valid when play spell
  if(source.type == cards.TYPE_SPELL) {
    if(
      (source.availablePlace == cards.PLACE_TABLE && target != cards.PLACE_TABLE) ||
      (source.availablePlace == cards.PLACE_MY_SUPPORTER && target.ownerName != currentPlayer.name) ||
      (source.availablePlace == cards.PLACE_ENEMY_SUPPORTET && target.ownerName == currentPlayer.name)
    )  {
      return console.log(`Invalid place type, expected: ${source.availablePlace}`)
    }
  }

  if(source.cost > currentPlayer.mana) {
    return console.log(`Not enough mana points ${source.cost} / ${currentPlayer.mana}`)
  }

  if(source.state == cards.STATE_IN_HAND) {
    currentPlayer.playCardOnTable(source)
    if(target == cards.PLACE_TABLE) {
      if(source.type == cards.TYPE_SPELL) {
          useSpell(source.special, target, source)
      } else if(source.type == cards.TYPE_SPECIAL_SUPPORTER && source.appearEffect) {
          useSpell(source.appearEffect, source.appearEffect.target)
      }
    } else if(source.type == cards.TYPE_SPELL) {
        useSpell(source.special, target, source)
    }
    return
  }


  if(typeof source != 'object' ||  typeof target != 'object') return console.log('Invalid target')

  if(source.state == cards.STATE_ON_TABLE &&
    [cards.TYPE_COMMON_SUPPORTER, cards.TYPE_SPECIAL_SUPPORTER].includes(source.type) &&
    target.ownerName != currentPlayer.name
  ) {
    if(source.attackReady) fight(source, target)
    else console.log('Not ready for attack')
  }
}

const useSpell = (special, target, source) => {
  let targets
  let specyfication = special.specyfication
  if(special.target == cards.ALL_IN_HAND_SUPPORTERS) targets = currentPlayer.hand
  if(special.target == cards.ALL_ENEMY_SUPPORTERS) targets = currentPlayer.name != player1.name ? player1.tableCard : player2.tableCard
  if(special.target == cards.SELECTED_ALLIE_SUPPORTER) targets = [target]
  if(special.target == cards.ENEMY_HERO) targets = currentPlayer.name != player1.name ? [player1] : [player2]

  targets.forEach(v => {
    if(special.type == cards.MODIFIE_STATS) {
      if(specyfication.type == cards.INCREASE) {
        if(specyfication.hp && specyfication.hp > 0) v.hp += specyfication.hp
        else damage(v, specyfication.hp)
        if(specyfication.attack) v.attack += specyfication.attack
      }
    } else if(special.type == cards.GIVE_EFFECT) {
      target.effects.push(specyfication.effect)
    }
  })

  player1.refreshHand()
  player2.refreshHand()
}

const fight = (source, target) => {
  damage(source, target.attack)
  damage(target, source.attack)
  source.attackReady = false
  player1.refreshHand()
  player2.refreshHand()
}

const damage = (target, value) => {
    if(_.isEmpty(target.effects) || !target.effects.includes(cards.ONE_TIME_SHIELD)) {
      if(target.hurt)target.hurt(value)
      else target.hp -= value
    } else {
      target.effects.splice(target.effects.indexOf(cards.ONE_TIME_SHIELD), 1)
    }
}

export const getSyncData = () => {
  return {
    player1: player1,
    player2: player2,
    currentPlayer: currentPlayer
  }
}
