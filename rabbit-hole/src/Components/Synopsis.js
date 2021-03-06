import React, { Component } from 'react'

export default class Synopsis extends Component {

  render() {
    return (
      <div className = "findings">
        <div className = "title">
          <div className = "bold">Article Title: </div>
          <div id = "article">{this.props.article}</div>
        </div>
        <div className = "synopsis">
          <div className = "bold">Article Synopsis: </div>
          <div id = "breakdown">{this.props.text}</div>
        </div>
      </div>
    );
  }
}
