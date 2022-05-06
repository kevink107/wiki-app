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
      synopsis: "",
      synopsisArray: [],
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

    const finalPrompt = "What are some key points from this text: \n\n\"\"\""+strippedHtml+"\"\"\"\nStart here\n1."
    const openai = new OpenAIApi(configuration);
    const synopsisResponse = await openai.createCompletion("text-curie-001", {
      prompt: finalPrompt,
      temperature: 0.5,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\"\"\""],
    });
    
    const synopArray = [];
    const finalSynopsis = "1." +synopsisResponse.data.choices[0].text;
    const numbers = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    let tempString = "1.";

    //some parsing
    for(let i = 2; i<finalSynopsis.length-2; i++){
      if((numbers.has(finalSynopsis[i])) && (finalSynopsis[i+1]==".") && (finalSynopsis[i+2]==" ")){
        synopArray.push(tempString);
        tempString = finalSynopsis[i];
      } else if((tempString.length>60) && (finalSynopsis[i]==" ")){
        synopArray.push(tempString);
        tempString = "";
      }
      else{
        tempString = tempString+finalSynopsis[i];
      }
    }

    if(synopArray[0].includes("may refer to")){
      console.log("yes");
      this.setState({synopsisArray: "Please be more specific. Your entry could refer to multiple entities."})
    } else{

      var domRender = [];
      for(let i = 0; i<synopArray.length; i++){
        if(synopArray[i]!=''){
          domRender.push(<div className = "synopsisPoint">{synopArray[i]}</div>);
        }
      }
      this.setState({synopsisArray: domRender});
    }

    this.setState({synopsis: finalSynopsis});
    
  }

  render() {

    return (
      <div className="App">
        <Topbar/>
        <div className = "Content">
          <h1>What would you like to learn about?</h1>
          <Searchbar searchInput = {this.updateResults}/>
          <Synopsis article = {this.state.articleName} text = {this.state.synopsisArray}></Synopsis>
        </div>
        
      </div>
    );
  } 
}

export default App;
