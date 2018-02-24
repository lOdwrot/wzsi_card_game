import Hero from './Hero.js'
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
  setPlayerTurn(currentPlayer.name == player1.name ? player2 : player1)
  currentPlayer.initTurn()
}

export const playCard = (source, target) => {

  if(target == 'TABLE' && source.state == cards.STATE_IN_HAND && currentPlayer.mana >= source.cost) {
    currentPlayer.playCardOnTable(source)
  }

  if(typeof source != 'object' ||  typeof target != 'object') return

  if(source.state == cards.STATE_ON_TABLE &&
    [cards.TYPE_COMMON_SUPPORTER, cards.TYPE_SPECIAL_SUPPORTER].includes(source.type) &&
    target.ownerName != currentPlayer.name
  ) {
    if(source.attackReady) fight(source, target)
    else console.log('Not ready for attack')
  }
}

const fight = (source, target) => {
  source.hp -= target.attack
  target.hp -= source.attack
  source.attackReady = false
  cardFlow(source)
  cardFlow(target)
  player1.refreshHand()
  player2.refreshHand()
}

const cardFlow = (card) => {

}

export const getSyncData = () => {
  return {
    player1: player1,
    player2: player2,
    currentPlayer: currentPlayer
  }
}
