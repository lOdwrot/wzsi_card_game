import React, { Component } from 'react'


export default class CardComponent extends Component {

  constructor() {
    this.state = {haveFocus: false}
  }

  render() {
    return (
      <div
        style={width: '200px'}
        onMouseEnter={this.setState({...this.state, haveFocus: true})}
        onMouseLeave={this.setState({...this.state, haveFocus: false})}>
        {this.renderImage(this.props.card.imgUrl, this.state.haveFocus)}
      </div>
    )
  }

  renderImage(imgUrl, haveFocus) {
    return (
        <div
          style={{
            backgroundImage: `url(${imgUrl})`,
            width: '100%',
            height: '100%',
            minHeight: '250px',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            opacity: haveFocus ? 1 : 0.75}}>
        </div>
    )
  }
}
