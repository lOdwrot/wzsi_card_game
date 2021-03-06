import React, {Component} from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Tooltip from 'material-ui/Tooltip'
import {TYPE_COMMON_SUPPORTER, TYPE_SPECIAL_SUPPORTER} from '../game/Cards.js'

export default class CardComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {haveFocus: false}
    }

    render() {
        return (
            <div
                onClick={() => {
                    console.log(this.props.card);
                    this.props.clickAction ? this.props.clickAction() : console.log('No on click action defined')
                }}
                style={{
                    width: '200px',
                    border: this.props.selected ? 'solid green' : 'unset'
                }}
                onMouseEnter={() => this.setState({...this.state, haveFocus: true})}
                onMouseLeave={() => this.setState({...this.state, haveFocus: false})}>
                {this.renderImage(this.props.card.imgUrl, this.state.haveFocus)}
                {this.renderInfo(this.props.card)}
            </div>
        )
    }

    renderImage(imgUrl, haveFocus) {
        return (
            <div style={{marginLeft: '10%', marginRight: '10%'}}>
                <div
                    style={{
                        backgroundImage: `url(${imgUrl})`,
                        width: '100%',
                        minHeight: '135px',
                        backgroundPosition: 'center top',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        opacity: haveFocus ? 1 : 0.85
                    }}>
                </div>
            </div>
        )
    }

    renderInfo(card) {
        return (
            <div>
                <Table>
                    <TableBody>
                        {['hp', 'attack', 'cost'].map(v =>
                            card[v] ?
                                (<TableRow key={v} style={{height: 'unset'}}>
                                    <TableCell>{v}</TableCell>
                                    <TableCell>{card[v]}</TableCell>
                                </TableRow>) :
                                null
                        )}
                        {[TYPE_COMMON_SUPPORTER, TYPE_SPECIAL_SUPPORTER].includes(card.type) &&
                        <TableRow style={{height: 'unset'}}>
                            <TableCell>
                                {'Ready for attack: ' + card.attackReady}
                            </TableCell>
                        </TableRow>
                        }
                        {card.special &&
                        <TableRow style={{height: 'unset'}}>
                            <TableCell>
                                <Tooltip id="tooltip-special" title={`special ${JSON.stringify(card.special)}`}>
                                    <a>special info</a>
                                </Tooltip>
                            </TableCell>
                        </TableRow>}
                        <TableRow style={{height: 'unset'}}>
                            <TableCell>
                                <a href={card.infoLink}>Additional Info</a>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    }
}
