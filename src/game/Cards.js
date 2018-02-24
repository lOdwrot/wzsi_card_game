import _ from 'lodash'

export const TYPE_SPELL = 'TYPE_SPELL'
export const TYPE_COMMON_SUPPORTER = 'TYPE_COMMON_SUPPORTER'
export const TYPE_SPECIAL_SUPPORTER = 'TYPE_SPECIAL_SUPPORTER'
export const TYPE_SECRET = 'TYPE_SECRET' //maybe will be implemented later

//special abilities names
export const ONE_TIME_SHIELD = 'oneTimeShield'
export const MODIFIE_STATS = 'modifieStats'
export const MULTIPLAY_ATTACK = 'multiplayAttack'
export const GET_CARD = 'getCard'

//modifie stats types
export const INCREASE = 'increase'
export const SET = 'set'

//target
export const SELECTED_ALLIE_SUPPORTER = 'SELECTED_ALLIE_SUPPORTER'
export const SELECTED_ENEMY_SUPPORTER = 'SELECTED_ENEMY_SUPPORTER'
export const ALL_ALLIE_SUPPORTERS = 'ALL_ALLIE_SUPPORTERS'
export const ALL_IN_HAND_SUPPORTERS = 'ALL_IN_HAND_SUPPORTERS'
export const ALL_ENEMY_SUPPORTERS = 'ALL_ENEMY_SUPPORTERS'
export const MY_HERO = 'MY_HERO'
export const ENEMY_HERO = 'ENEMY_HERO'


const commonSupproters = {
    murlocScout : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Murloc Scout',
        hp: 1,
        attack: 1,
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/330/920/486.png',
        infoLink: 'https://www.hearthpwn.com/cards/486-murloc-scout'
    },
    flameofAzzinoth : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Flame of Azzinoth',
        hp: 1,
        attack: 2,
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/334/794/455.png',
        infoLink: 'https://www.hearthpwn.com/cards/455-flame-of-azzinoth'
    },
    spiderTank : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Spider Tank',
        hp: 4,
        attack: 3,
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/331/448/12184.png',
        infoLink: 'https://www.hearthpwn.com/cards/12184-spider-tank'
    },
    carrionGrub : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Carrion Grub',
        hp: 5,
        attack: 2,
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/334/17/35218.png',
        infoLink: 'https://www.hearthpwn.com/cards/35218-carrion-grub'
    },
    brewmaster : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Brewmaster',
        hp: 4,
        attack: 4,
        cost: 4,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/334/821/397.png',
        infoLink: 'https://www.hearthpwn.com/cards/397-brewmaster'
    }
}

const specialSupproters = {
    scarletCrusader : {
        type: TYPE_SPECIAL_SUPPORTER,
        name: 'Scarlet Crusader',
        hp: 1,
        attack: 3,
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/330/390/475.png',
        infoLink: 'https://www.hearthpwn.com/cards/475-scarlet-crusader',
        special: {
            [ONE_TIME_SHIELD]: 1
        }
    },
    flyingMachine : {
        type: TYPE_SPECIAL_SUPPORTER,
        name: 'Flying Machine',
        hp: 4,
        attack: 1,
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/331/577/12247.png',
        infoLink: 'https://www.hearthpwn.com/cards/12247-flying-machine',
        special: {
            [MULTIPLAY_ATTACK]: 1
        }
    }
}

const spells = {
    sealofChampions : {
        type: TYPE_SPELL,
        name: 'Seal of Champions',
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/328/22/22373.png',
        infoLink: 'https://www.hearthpwn.com/cards/22373-seal-of-champions',
        special: {
            target: SELECTED_ALLIE_SUPPORTER,
            [ONE_TIME_SHIELD]: 1
        }
    },
    sugglerRun : {
        type: TYPE_SPELL,
        name: 'Smuggler Run',
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/329/1/49676.png',
        infoLink: 'https://www.hearthpwn.com/cards/49676-smugglers-run',
        special: {
            target: ALL_IN_HAND_SUPPORTERS,
            [MODIFIE_STATS]: {
                type: INCREASE,
                hp: 1,
                attack: 1
            }
        }
    },
    peruse : {
        type: TYPE_SPELL,
        name: 'Peruse',
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/334/275/49902.png',
        infoLink: 'https://www.hearthpwn.com/cards/49902-peruse',
        special: {
            [GET_CARD]: 1
        }
    }
}

const deck = {
  murlocScout: 2,
  flameofAzzinoth: 2,
  spiderTank: 2,
  carrionGrub: 2,
  brewmaster: 2,
  scarletCrusader: 2,
  flyingMachine: 2,
  sealofChampions: 2,
  sugglerRun: 2,
  peruse: 2
}

export const getAllCards = () => ({...commonSupproters, ...specialSupproters, ...spells})
export const getSpells = () => ({...spells})
export const getSupporters = () => ({...commonSupproters})
export const getSpecialSupproters = () => ({...specialSupproters})

var idIterator = 1

export const getDeck = () => {
  let result = []
  let availableCards = getAllCards()
  _.forOwn(deck , (v, key) => {
    for(let i = 0; i < v; i++) result.push({...availableCards[key], id: idIterator++})
  })

  return _.shuffle(result)
}
