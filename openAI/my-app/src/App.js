import './App.css';
import React, { Component } from 'react';
import Searchbar from './Components/Searchbar';
import wikiSearch from './Wikisearch';
import Synopsis from './Components/Synopsis';
import Topbar from './Components/Topbar/Topbar.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchterm: '',
      synopsis: '',
      results: null,
      articleName: ""
    }
  }

  

  updateResults = (text) => {
    this.setState({searchterm: text});
    this.getTitle(text);
    setTimeout(() => {
      this.getHTML(this.state.articleName)
    }, 1000);
  }

  getTitle = async(text) => {
    const api = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=` + text;
    const response = await fetch(api);
    if (!response.ok) {
       throw Error(response.statusText)
    }
    const json = await response.json();
    const title = json.query.search[0].title
    this.setState({results: json.query.search});
    this.setState({articleName: title});
    return json;
  }

  getHTML = async(text) => {
    console.log(text);
  }


  
  render() {

    return (
      <div className="App">
        <Topbar/>
        <div className = "Content">
          <h1>What would you like to learn about?</h1>
          <Searchbar searchInput = {this.updateResults}/>
          <Synopsis article = {this.state.articleName} />
        </div>
        
      </div>
    );
  } 
}

export default App;
