import React, {Component} from 'react'
import {getSpells, getSupporters, getSpecialSupporters} from '../game/Cards.js'
import CardComponent from './Card.js'
import _ from 'lodash'

const rowContainer = {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
};

export default () => (
    <div>
        <p>Available Cards</p>
        <p>Supporters</p>
        <div style={rowContainer}>
            {_.toArray(getSupporters()).map(v => (
                <CardComponent card={v} key={v.name} clickAction={() => console.log(v)}/>))}
        </div>
        <p>Special Supporters</p>
        <div style={rowContainer}>
            {_.toArray(getSpecialSupporters()).map(v => (
                <CardComponent card={v} key={v.name} clickAction={() => console.log(v)}/>))}
        </div>
        <p>Spells</p>
        <div style={rowContainer}>
            {_.toArray(getSpells()).map(v => (
                <CardComponent card={v} key={v.name} clickAction={() => console.log(v)}/>))}
        </div>
    </div>
)
