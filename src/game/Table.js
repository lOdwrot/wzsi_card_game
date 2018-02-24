import Hero from './Hero.js'

const INITIAL_CARDS = 4
const MAX_MANA = 10

export const TARGET_TABLE = 'TARGET_TABLE'
export const TARGET_HERO = 'TARGET_HERO'
export const TARGET_CARD = 'TARGET_CARD'

export const player1 = new Hero('Zbyszek')
export const player2 = new Hero('Bogdan')

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
  setPlayerTurn(currentPlayer.name == player1.name ? player1 : player2)
}

export const playCard = (card) => {

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
