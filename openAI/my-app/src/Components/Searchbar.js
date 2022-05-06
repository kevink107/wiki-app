import React, { Component } from 'react'

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
      <div>
        <input onChange = {this.onInputChange} value = {this.state.searchterm} onKeyPress = {this.onEnter}></input>
      </div>
    );
  }
}
