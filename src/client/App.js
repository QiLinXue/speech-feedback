import React, { Component } from "react";
import "./app.css";

export default class App extends Component {
  state = {
    inputText: null,
    transcribed: "I am um an adult um yeah.",
    positivity: null,
    keyPhrases: [],
    audioLength: null,
    WPM: null,
    positivityA: null,
    positivityB: null,
    positivityC: null,
    fillNum: 0
  };

  componentDidMount() {
    // LOL
    // runs at the beginning
  }

  //Call API (user inputted text)
  ///////////////////////////////////////////////////////

  //Transcribe Audio
  getAudioText() {
    console.log(3);
    fetch("/api/transcribeSample")
      .then(res => res.json())
      .then(user => this.setState({ transcribed: user.transcribed }))
      .then(console.log("ah"));
    console.log(4);
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
    fetch(`/api/getKeyPhrases2/${text}`)
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

  handleSubmitTranscriptionAnalyze = event => {
    event.preventDefault();

    this.getPositivity(this.state.transcribed, this.state.positivity);
    this.getKeyPhrases(this.state.transcribed);
    this.getWPM(this.state.transcribed);
    this.getMiniPositivity(this.state.transcribed);
    this.countFillers();
  };

  //Transcribes speak.wav
  ///////////////////////////////////////////////////////////
  handleSubmitTranscribe = event => {
    event.preventDefault();
    console.log("transcript submition");
    //Transcribe speak.wav
    this.getAudioText();
    console.log("2");
  };

  //Count the filler words
  countFillers = event => {
    var temp = this.state.transcribed;
    var tempArray = temp.split(" ");
    var num = 0;
    for (var i = 0; i < tempArray.length; i++) {
      if (tempArray[i] == "um" || tempArray[i] == "uh") {
        num++;
      }
    }
    console.log(num);
    this.setState({ fillNum: num });
  };

  // test(event) {
  //   console.log("hello world!!!!");

  //   var file = event.target.files[0];
  //   // Do something with the audio file.
  //   var url = URL.createObjectURL(file);
  //   var au = document.createElement("audio");
  //   var li = document.createElement("li");
  //   au.src = url;

  //   li.appendChild(au);

  //   var filename = new Date().toISOString();
  //   var upload = document.createElement("a");

  //   console.log(file.name);

  //   fetch("/api/audio", {
  //     method: "POST", // or 'PUT'
  //     body: file, // data can be `string` or {object}!
  //     headers: {
  //       "Content-Type": "audio/wav"
  //     }
  //   });
  // }
  ////

  ////
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
    const { positivityA } = this.state;
    const { positivityB } = this.state;
    const { positivityC } = this.state;
    const { fillNum } = this.state;

    return (
      <div>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="display-4">Speech Teech</h1>
            <p className="lead">
              This is a modified jumbotron that occupies the entire horizontal
              space of its parent.
            </p>
          </div>
        </div>
        <span className="badge badge-primary m-2">
          Transcribed: {transcribed}
        </span>
        <h1>Key Words: {keyPhrases} </h1>
        <h1>WPM: {WPM}</h1>
        <h1>Overall Positivity: {positivity}</h1>
        <ul>
          <li>Beginning Positivity: {positivityA}</li>
          <li>Middle Positivity: {positivityB}</li>
          <li>End Positivity: {positivityC}</li>
        </ul>
        <h1>Filler Words: {fillNum}</h1>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Words Per Minute</h5>
            <span className="btn btn-primary">{WPM} WPM</span>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Overall Positivity</h5>
            <span className="btn btn-primary">{positivity}% Positive</span>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Filler Words</h5>
            <span className="btn btn-primary">{fillNum} Studders</span>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Major Topics</h5>
            <span className="btn btn-primary">
              {keyPhrases.length} main topics
            </span>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <ul>
              {this.state.keyPhrases.map(keyPhrases => (
                <li key={keyPhrases}>{keyPhrases}</li>
              ))}
            </ul>
          </div>
        </div>

        <input
          onClick={this.handleSubmitTranscribe}
          type="submit"
          className="btn btn-primary btn-lg btn-block"
          value="Transcribe Audio"
        />
        <input
          onClick={this.handleSubmitTranscriptionAnalyze}
          type="submit"
          className="btn btn-success btn-lg btn-block"
          value="Analyze Audio Transcriptions"
        />
        <input
          type="file"
          accept="audio/*"
          capture
          id="recorder"
          onChange={this.test}
        />
      </div>
    );
  }

  //FUNCTIONS
  ///////////////////////////////////////////////////////////
}
