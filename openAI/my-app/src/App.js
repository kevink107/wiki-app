import './App.css';
import React, { Component } from 'react';
import Searchbar from './Components/Searchbar';
import Synopsis from './Components/Synopsis';
import Topbar from './Components/Topbar';
import Button from './Components/Button';

const apiKey = "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";

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
      suggested: new Set(["Dartmouth College", "Artificial Intelligence"]),
      otherLinks: ["Dartmouth College", "Artificial Intelligence"],
      searches: 0,
    }
  }

  //prompts the wiki search for articles and openAI call to build synopsis
  updateResults = (text) => {
    if(text.length===0){
      this.setState({synopsisArray: "Empty search"});
      return;
    }
    
    this.setState({searches: this.state.searches+1});
    this.setState({synopsisArray: [
      <img className = "animated-gif" src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif" alt=""/>
    ]});
    this.setState({searchterm: text});
    // set article title and synopsis to loading here...
    this.getTitle(text);

    //timesout to ensure state is set
    setTimeout(() => {
      this.getSynopsis(this.state.articleName)
    }, 500);
  }

  //gets the title of the article as well as rabbit hole suggestions
  getTitle = async(text) => {
    const api = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=` + text;
    const response = await fetch(api);
    if (!response.ok) {
       throw Error(response.statusText)
    }
    
    this.setState({results: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"}); 
    const json = await response.json();
    console.log(json);

    var x = Math.floor(Math.random()*19);

    //to avoid having the same article in the button
    if(x===0){
      x = 1;
    }


    
    console.log(x);

    //sets the title article
    const title = json.query.search[0].title

    //sets rabbit hole suggestions based on random articles with similar keywoards to the top choice
    const title1 = json.query.search[x].title
    const title2 = json.query.search[x+1].title

    while(this.state.suggested.has(title1) || this.state.suggested.has(title2)){
      x = Math.floor(Math.random()*19);
      if(x===0){
        x = 1;
      };
      const title1 = json.query.search[x].title;
      const title2 = json.query.search[x+1].title;
    }

    this.setState({results: json.query.search}); 
    this.setState({articleName: title});
    this.setState({otherLinks: [title1, title2]});
    this.setState({searched: this.state.searched.add(title, title1, title2)});
  }


  //gets wiki HTML and uses openAI api to create synopsis
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

    //gets rid of HTML syntex
    const strippedHtml = extraction.replace(/<[^>]+>/g, '');


    this.setState({extract: strippedHtml});

    //OpenAI
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: apiKey,
    });

    //This prompt tells openAI to gather key points from the Wiki page
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

    //parses the response to create a new item in an array every time a " {number}. " sequence is found
    for(let i = 2; i<finalSynopsis.length-2; i++){
      if((numbers.has(finalSynopsis[i])) && (finalSynopsis[i+1]===".") && (finalSynopsis[i+2]===" ") && !(numbers.has(finalSynopsis[i-1]))){
        synopArray.push(tempString);
        tempString = finalSynopsis[i];
      } 
      else{
        tempString = tempString+finalSynopsis[i];
      }
    }

    //last 2 characters must be included
    synopArray.push(tempString+finalSynopsis[finalSynopsis.length-2]+finalSynopsis[finalSynopsis.length-1]);

    //removes last item if openAI cut it off due to max-tokens parameter
    var lastItem = synopArray[synopArray.length-1];
    if(lastItem[lastItem.length-1]!=="."){
      console.log(lastItem);
      synopArray.pop();
    }

    //If nothing comes up, return an error message
    if(synopArray.length===0){
      this.setState({synopsisArray: "Please be more specific. Your entry could refer to multiple entities."});
      return;
    }
    //checks if articles points to multiple other articles (can maybe add some buttom options here at some point)
    if(synopArray[0].includes("may refer to")){
      this.setState({synopsisArray: "Please be more specific. Your entry could refer to multiple entities."});
    } else{

      var domRender = [];
      for(let i = 0; i<synopArray.length; i++){
        if(synopArray[i]!==''){
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
