import './App.css';
import React, { Component } from 'react';
import Searchbar from './Components/Searchbar';
import wikiSearch from './Wikisearch';
import Synopsis from './Components/Synopsis';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchterm: '',
      synopsis: '',
      results: null,
      articleName: "",
      extract: null
    }
  }
  updateResults = (text) => {
    this.setState({searchterm: text});
    this.getTitle(text);
    setTimeout(() => {
      this.getSynopsis(this.state.articleName)
    }, 1000);
  }

  returnTitle = () =>{
    return(this.state.articleName);
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
  }

  getSynopsis = async(text) => {
    const url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=" + text;
    const response = await fetch(url);
    if (!response.ok) {
       throw Error(response.statusText)
    }
    const json = await response.json();
    const pages = json.query.pages;
    const pageIds = Object.keys(pages);
    const firstPageId = pageIds.length ? pageIds[0] : null;
    const extraction = firstPageId ? pages[firstPageId].extract : null;
    const strippedHtml = extraction.replace(/<[^>]+>/g, '');
    this.setState({extract: strippedHtml});

    //OpenAI part
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: "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",
    });

    const finalPrompt = "What are some key points from this text\n\n\"\"\""+strippedHtml+"\"\"\""
    const openai = new OpenAIApi(configuration);
    const synopsisResponse = await openai.createCompletion("text-curie-001", {
      prompt: finalPrompt,
      temperature: 0.5,
      max_tokens: 233,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\"\"\""],
    });
    
    const finalSynopsis = synopsisResponse.data.choices[0].text;
    console.log(finalSynopsis);
    this.setState({synopsis: finalSynopsis});
  }

  render() {
    return (
      <div className="App">
        <div className = "Content">
          <h1>What would you like to learn about?</h1>
          <Searchbar searchInput = {this.updateResults}/>
          <Synopsis article = {this.state.articleName} text = {this.state.synopsis}></Synopsis>
        </div>
        
      </div>
    );
  } 
}

export default App;
