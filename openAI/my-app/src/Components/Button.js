import React, { Component } from 'react'
import "./button.css"

export default class Button extends Component {


  onClick = () => {
    this.props.buttonClick(this.props.text);
  }


  render() {
    return (
        <button onClick = {this.onClick} className = "button">{this.props.text}</button>
    )
  }
}
