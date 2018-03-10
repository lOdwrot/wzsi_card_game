import * as cards from './Cards.js'
import _ from 'lodash'

class Hero {
    constructor(heroName, controlType = 'player') {
        this.type = 'hero'
        this.name = heroName;
        this.setControlType(controlType);
        this.resetHero()
    }

    setControlType(controlType) {
        this.controlType = controlType
    }

    resetHero() {
        this.deck = cards.getDeck(this);
        this.initialHp = 20;
        this.hp = this.initialHp;
        this.attack = 0;
        this.mana = 0;
        this.handCards = [];
        this.tableCards = [];
        this.endGameTiredPoints = 1
    }

    findCardById(cardId) {
        return this.handCards.find(v => v.id == cardId) || this.tableCards.find(v => v.id == cardId)
    }

    getCard() {
        if (!_.isEmpty(this.deck)) {
            //every time get random card (to simulation)
            this.deck = _.shuffle(this.deck)
            this.handCards.push({...this.deck.splice(-1, 1)[0], state: cards.STATE_IN_HAND})
            this.handCards = this.handCards.sort((a1,a2) => a1.name < a2.name ? 1 : -1)
        } else {
            // this.hurt(this.endGameTiredPoints++)
            this.hurt(this.endGameTiredPoints++)
        }
    }

    hurt(damage) {
        this.hp = Math.max(0, this.hp - damage);
        if (this.hp <= 0) console.log(this.name + ' defeated!')
    }

    playCardOnTable(card) {
        this.handCards = this.handCards.filter(v => v.id !== card.id);
        this.mana -= card.cost;
        if (card.type === cards.TYPE_COMMON_SUPPORTER || card.type === cards.TYPE_SPECIAL_SUPPORTER) {
            this.tableCards.push({...card, state: cards.STATE_ON_TABLE})
            this.tableCards = this.tableCards.sort((a1,a2) => a1.name < a2.name ? 1 : -1)
        }
    }

    refreshHand() {
        this.tableCards = this.tableCards.filter(v => v.hp > 0)
    }

    initTurn() {
        this.getCard();
        this.tableCards.forEach(v => v.attackReady = true)
    }
}

export default Hero
