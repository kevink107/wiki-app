import './App.css';
import React, { Component } from 'react';
import Searchbar from './Components/Searchbar';
import Synopsis from './Components/Synopsis';
import Topbar from './Components/Topbar';
import SlidingMenu from './Components/SlidingMenu';
import Button from './Components/Button';
import Home from './Home.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchterm: '',
      synopsis: "",
      synopsisArray: [],
      results: null,
      articleName: "",
      extract: null,
      searched: new Set(["Dartmouth College", "Artificial Intelligence"]),
      otherLinks: ["Dartmouth College", "Artificial Intelligence"],
      searches: 0,
    }
  }

  updateResults = (text) => {
    if(text.length==0){
      this.setState({synopsisArray: "Empty search"});
      return;
    }
    
    this.setState({searches: this.state.searches+1});
    this.setState({synopsisArray: "Loading..."});
    this.setState({searchterm: text});
    // set article title and synopsis to loading here...
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
    this.setState({results: "loading..."}); 
    const json = await response.json();
    console.log(json);

    var x = Math.floor(Math.random()*19);

    //to avoid having the same article in the button
    if(x==0){
      x = 1;
    }

    console.log(x);
    const title = json.query.search[0].title
    const title1 = json.query.search[x].title
    const title2 = json.query.search[x+1].title
    this.setState({results: json.query.search}); 
    this.setState({articleName: title});
    this.setState({otherLinks: [title1, title2]});
    this.setState({searched: this.state.searched.add(title, title1, title2)});
  }


  getSynopsis = async(text) => {
    const url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=" + text;
    const response = await fetch(url);
    if (!response.ok) {
       throw Error(response.statusText)
    }
    const json = await response.json();
    console.log(json);
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
      if((numbers.has(finalSynopsis[i])) && (finalSynopsis[i+1]==".") && (finalSynopsis[i+2]==" ") && !(numbers.has(finalSynopsis[i-1]))){
        synopArray.push(tempString);
        tempString = finalSynopsis[i];
      } 
      else{
        tempString = tempString+finalSynopsis[i];
      }
    }
    //last 2 characters
    synopArray.push(tempString+finalSynopsis[finalSynopsis.length-2]+finalSynopsis[finalSynopsis.length-1]);

    var lastItem = synopArray[synopArray.length-1];
    if(lastItem[lastItem.length-1]!="."){
      console.log(lastItem);
      synopArray.pop();
    }

    if(synopArray.length==0){
      this.setState({synopsisArray: "Please be more specific. Your entry could refer to multiple entities."});
      return;
    }
    //checks if articles points to multiple other articles (can maybe add some buttom options here at some point)
    if(synopArray[0].includes("may refer to")){
      this.setState({synopsisArray: "Please be more specific. Your entry could refer to multiple entities."});
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
          <div className = "innerContent">
            <h1>What would you like to learn about?</h1>
            <Searchbar searchInput = {this.updateResults}/>
            <Synopsis article = {this.state.articleName} text = {this.state.synopsisArray}></Synopsis>
            <h2 id = "header2">{this.state.searches>0 ? "Dig Deeper into the Rabbit Hole:" : "You Can Also Start Here"}</h2>
            <div id = "buttons">
              <Button text = {this.state.otherLinks[0]} buttonClick = {this.updateResults}></Button>
              <Button text = {this.state.otherLinks[1]} buttonClick = {this.updateResults}></Button>
            </div>
          </div>
          
        </div>
        
      </div>
    );
  } 
}

export default App;
