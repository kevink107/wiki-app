import React, { Component } from 'react'
import "./searchbar.css"

export default class Searchbar extends Component {

  constructor(props){
    super(props);

    this.state = {
      searchterm: '',
    };
  }

  onInputChange = (event) => {
    this.setState({searchterm: event.target.value});
  }

  onEnter = (event)=> {
    if (event.key === ("Enter")) {
      this.props.searchInput(this.state.searchterm);
      this.setState({searchterm: ""});
    }
  }

  render() {
    return (
      <div className="searchbar">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/OOjs_UI_icon_search-ltr.svg" alt =""/>
        <input id = "search" placeholder = "Enter your search here" onChange = {this.onInputChange} value = {this.state.searchterm} onKeyPress = {this.onEnter}></input>
      </div>
    );
  }
}
