import _ from 'lodash'

export const TYPE_SPELL = 'TYPE_SPELL';
export const TYPE_COMMON_SUPPORTER = 'TYPE_COMMON_SUPPORTER';
export const TYPE_SPECIAL_SUPPORTER = 'TYPE_SPECIAL_SUPPORTER';
export const TYPE_SECRET = 'TYPE_SECRET'; //maybe will be implemented later

//Card states
export const STATE_IN_DECK = 'STATE_IN_DECK';
export const STATE_IN_HAND = 'STATE_IN_HAND';
export const STATE_ON_TABLE = 'STATE_ON_TABLE';
export const STATE_END = 'STATE_END';

//special abilities names
export const ONE_TIME_SHIELD = 'oneTimeShield';
export const MODIFY_STATS = 'modifyStats';
export const GIVE_EFFECT = 'giveEffect';
export const ATTACK_TWICE = 'attackTwice';

//modifie stats types
export const INCREASE = 'increase';
export const SET = 'set';

//target
export const SELECTED_ALLY_SUPPORTER = 'SELECTED_ALLY_SUPPORTER';
export const SELECTED_ENEMY_SUPPORTER = 'SELECTED_ENEMY_SUPPORTER';
export const ALL_ALLIE_SUPPORTERS = 'ALL_ALLIE_SUPPORTERS';
export const ALL_IN_HAND_SUPPORTERS = 'ALL_IN_HAND_SUPPORTERS';
export const ALL_ENEMY_SUPPORTERS = 'ALL_ENEMY_SUPPORTERS';
export const MY_HERO = 'MY_HERO';
export const ENEMY_HERO = 'ENEMY_HERO';

//put places
export const PLACE_TABLE = 'PLACE_TABLE';
export const PLACE_MY_SUPPORTER = 'PLACE_MY_SUPPORTER';
export const PLACE_ENEMY_SUPPORTET = 'PLACE_ENEMY_SUPPORTET';


const commonSupporters = {
    murlocScout : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Murloc Scout',
        hp: 1,
        attack: 1,
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/330/920/486.png',
        infoLink: 'https://www.hearthpwn.com/cards/486-murloc-scout',
        effects: []
    },
    flameofAzzinoth : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Flame of Azzinoth',
        hp: 1,
        attack: 2,
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/334/794/455.png',
        infoLink: 'https://www.hearthpwn.com/cards/455-flame-of-azzinoth',
        effects: []
    },
    spiderTank : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Spider Tank',
        hp: 4,
        attack: 3,
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/331/448/12184.png',
        infoLink: 'https://www.hearthpwn.com/cards/12184-spider-tank',
        effects: []
    },
    carrionGrub : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Carrion Grub',
        hp: 5,
        attack: 2,
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/334/17/35218.png',
        infoLink: 'https://www.hearthpwn.com/cards/35218-carrion-grub',
        effects: []
    },
    brewmaster : {
        type: TYPE_COMMON_SUPPORTER,
        name: 'Brewmaster',
        hp: 4,
        attack: 4,
        cost: 4,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/334/821/397.png',
        infoLink: 'https://www.hearthpwn.com/cards/397-brewmaster',
        effects: []
    }
};

const specialSupporters = {
    scarletCrusader : {
        type: TYPE_SPECIAL_SUPPORTER,
        name: 'Scarlet Crusader',
        hp: 1,
        attack: 3,
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/330/390/475.png',
        infoLink: 'https://www.hearthpwn.com/cards/475-scarlet-crusader',
        effects: [ONE_TIME_SHIELD]
    },
    nightblade : {
        type: TYPE_SPECIAL_SUPPORTER,
        name: 'Nightblade',
        hp: 4,
        attack: 4,
        cost: 5,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/331/64/184.png',
        infoLink: 'https://www.hearthpwn.com/cards/184-nightblade',
        appearEffect: {
            target: ENEMY_HERO,
            type: MODIFY_STATS,
            specification: {
                type: INCREASE,
                hp: -3
            }
        }
    }
};

const spells = {
    sealofChampions : {
        type: TYPE_SPELL,
        availablePlace: PLACE_MY_SUPPORTER,
        name: 'Seal of Champions',
        cost: 3,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/328/22/22373.png',
        infoLink: 'https://www.hearthpwn.com/cards/22373-seal-of-champions',
        special: {
            target: SELECTED_ALLY_SUPPORTER,
            type: GIVE_EFFECT,
            specification: {
                effect: ONE_TIME_SHIELD
            }
        }
    },
    sugglerRun : {
        type: TYPE_SPELL,
        availablePlace: PLACE_TABLE,
        name: 'Smuggler Run',
        cost: 1,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/329/1/49676.png',
        infoLink: 'https://www.hearthpwn.com/cards/49676-smugglers-run',
        special: {
            target: ALL_IN_HAND_SUPPORTERS,
            type: MODIFY_STATS,
            specification: {
                type: INCREASE,
                hp: 1,
                attack: 1
            }
        }
    },
    arcaneExplosion : {
        type: TYPE_SPELL,
        availablePlace: PLACE_TABLE,
        name: 'Arcane Explosion',
        cost: 2,
        imgUrl: 'https://media-hearth.cursecdn.com/avatars/329/922/56.png',
        infoLink: 'https://www.hearthpwn.com/cards/56-arcane-explosion',
        special: {
            target: ALL_ENEMY_SUPPORTERS,
            type: MODIFY_STATS,
            specification: {
                type: INCREASE,
                hp: -1
            }
        }
    }
};

const deck = {
  murlocScout: 2,
  flameofAzzinoth: 2,
  spiderTank: 2,
  carrionGrub: 2,
  brewmaster: 2,
  scarletCrusader: 2,
  nightblade: 2,
  sealofChampions: 2,
  sugglerRun: 2,
  arcaneExplosion: 2
};

export const getAllCards = () => ({...commonSupporters, ...specialSupporters, ...spells});
export const getSpells = () => ({...spells});
export const getSupporters = () => ({...commonSupporters});
export const getSpecialSupporters = () => ({...specialSupporters});

var idIterator = 1;

export const getDeck = (player = {}) => {
  let result = [];
  let availableCards = getAllCards();
  _.forOwn(deck , (v, key) => {
    for(let i = 0; i < v; i++) result.push({...availableCards[key], id: idIterator++, ownerName: player.name, state: STATE_IN_DECK, attackReady: false})
  });

  return _.shuffle(result)
};
