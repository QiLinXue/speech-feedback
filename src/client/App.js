import React, { Component } from "react";
import "./app.css";

export default class App extends Component {
  state = {
    inputText: null,
    transcribed:
      "I used to be a happy kid. I would always go to the park and play with my friends. But now i have grown up to become a serial killer. I have killed both my parents and i live in sorrow and guilt everyday. My sins are far too great for my existence on this planet. I want to kill myself!",
    positivity: null,
    keyPhrases: null,
    audioLength: null,
    WPM: null,
    positivityA: null,
    positivityB: null,
    positivityC: null
  };

  componentDidMount() {
    // LOL
    // runs at the beginning
  }

  //Call API (user inputted text)
  ///////////////////////////////////////////////////////

  //Transcribe Audio
  getAudioText() {
    fetch("/api/transcribeSample")
      .then(res => res.json())
      .then(user => this.setState({ transcribed: user.transcribed }));
  }

  //Get Audio Length
  getAudioLength() {
    fetch("/api/getAudioLength")
      .then(res => res.json())
      .then(user => this.setState({ audioLength: user.audioLength }));
  }

  //Get WPM
  getWPM(text) {
    fetch(`/api/getWPM/${text}`)
      .then(res => res.json())
      .then(user => this.setState({ WPM: user.WPM }));
  }

  //Get Key Phrases
  getKeyPhrases(text) {
    fetch(`/api/getKeyPhrases/${text}`)
      .then(res => res.json())
      .then(user => this.setState({ keyPhrases: user.keyPhrases }));
  }

  //Get Sentiment Analysis
  getPositivity(text) {
    fetch(`/api/getPositivity/${text}`)
      .then(res => res.json())
      .then(user => this.setState({ positivity: user.positivity }));
  }

  //Call mini API (segmental sentiment)
  getMiniPositivity(text) {
    var temp = text;
    var length = Math.floor(temp.length / 3);

    var a = temp.substring(length * 0, length * 1);
    var b = temp.substring(length, length * 2);
    var c = temp.substring(length * 2, length * 3);

    fetch(`/api/getPositivity/${b}`)
      .then(res => res.json())
      .then(user => this.setState({ positivityB: user.positivity }));
    fetch(`/api/getPositivity/${c}`)
      .then(res => res.json())
      .then(user => this.setState({ positivityC: user.positivity }));
    fetch(`/api/getPositivity/${a}`)
      .then(res => res.json())
      .then(user => this.setState({ positivityA: user.positivity }));
  }

  //Submit Button
  ///////////////////////////////////////////////////////////

  handleSubmitTextAnalyze = event => {
    event.preventDefault(); //weird thing with react so states don't revert to original

    this.getPositivity(this.state.inputText);
    this.getKeyPhrases(this.state.inputText);
    this.getWPM(this.state.inputText);
    this.getMiniPositivity(this.state.inputText);
  };

  handleSubmitTranscriptionAnalyze = event => {
    event.preventDefault();

    this.getPositivity(this.state.transcribed, this.state.positivity);
    this.getKeyPhrases(this.state.transcribed);
    this.getWPM(this.state.transcribed);
    this.getMiniPositivity(this.state.transcribed);
  };

  //Transcribes speak.wav
  ///////////////////////////////////////////////////////////
  handleSubmitTranscribe = event => {
    event.preventDefault();

    //Transcribe speak.wav
    this.getAudioText();
  };

  //Updates State when user text input changes (won't be needed for final version)
  ///////////////////////////////////////////////////////////
  handleInputUpdate = evt => {
    this.setState({
      inputText: evt.target.value
    });
  };

  //Code written by Alex to seperate String
  seperateString(variable, length) {
    console.log(variable);

    var seperate = variable.split(" ");
    var out = new Array(Math.round(seperate.length / length - 0.1));

    console.log(out.length);
    var index = 0;
    var pos = 0;
    while (true) {
      var each = "";
      for (var count = 0; count < length && index < seperate.length; count++) {
        seperate[index] = seperate[index].replace(".", "");
        each = each + seperate[index] + " ";
        index++;
      }
      console.log(each);
      out[pos] = each;
      pos++;
      if (index == seperate.length) {
        break;
      }
    }
    // for(var count=0;count<out.length;count++){
    //   console.log(out[count]);
    // }
    //return out;
    this.setState({ transcribedList: out });
  }

  //What it actually returns - JSX code (combination of html and javascript)
  ///////////////////////////////////////////////////////////
  render() {
    //Define the prefix ahead of time. Usually we have to call this.state.inputText
    //but if we call it at the beggining, it saves a lot of space
    const { inputText } = this.state;
    const { transcribed } = this.state;
    const { positivity } = this.state;
    const { keyPhrases } = this.state;
    const { WPM } = this.state;
    const { transcribedList } = this.state;
    const { positivityA } = this.state;
    const { positivityB } = this.state;
    const { positivityC } = this.state;

    // if(this.state.transcribed!=null){
    //   this.function(this.state.transcribed,2);
    // }
    return (
      <div>
        <h1>Transcribed: {transcribed}</h1>
        <h1>Text: {inputText}</h1>
        <h1>Key Words: {keyPhrases} </h1>
        <h1>WPM: {WPM}</h1>
        <h1>Overall Positivity: {positivity}</h1>
        <ul>
          <li>Beginning Positivity: {positivityA}</li>
          <li>Middle Positivity: {positivityB}</li>
          <li>End Positivity: {positivityC}</li>
        </ul>

        <form>
          <label>
            Input Sentence:
            <input
              type="text"
              name="name"
              value={inputText}
              onChange={evt => this.handleInputUpdate(evt)}
            />
          </label>

          <input
            onClick={this.handleSubmitTextAnalyze}
            type="submit"
            value="Analyze Input Text"
          />
        </form>

        <input
          onClick={this.handleSubmitTranscribe}
          type="submit"
          value="Transcribe Audio"
        />
        <input
          onClick={this.handleSubmitTranscriptionAnalyze}
          type="submit"
          value="Analyze Audio Transcriptions"
        />
      </div>
    );
  }

  //FUNCTIONS
  ///////////////////////////////////////////////////////////
}
