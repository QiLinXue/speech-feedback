import React, { Component } from "react";
import "./app.css";

export default class App extends Component {
  state = {
    inputText: null,
    transcribed: null,
    positivity: null,
    keyPhrases: null,
    audioLength: null,
    WPM: null,
    test: [1, 2, 3, 4, 5, 6]
  };

  componentDidMount() {
    // LOL
    // runs at the beginning
  }

  //Call API (user inputted text)
  ///////////////////////////////////////////////////////////

  getAudioText() {
    fetch("/api/transcribeSample")
      .then(res => res.json())
      .then(user => this.setState({ transcribed: user.transcribed }));
  }

  getPositivity() {
    fetch(`/api/getPositivity/${this.state.inputText}`)
      .then(res => res.json())
      .then(user => this.setState({ positivity: user.positivity }));
  }

  getKeyPhrases() {
    fetch(`/api/getKeyPhrases/${this.state.inputText}`)
      .then(res => res.json())
      .then(user => this.setState({ keyPhrases: user.keyPhrases }));
  }

  getAudioLength() {
    fetch("/api/getAudioLength")
      .then(res => res.json())
      .then(user => this.setState({ audioLength: user.audioLength }));
  }

  //Call API (audio transcription text)
  ///////////////////////////////////////////////////////////

  getPositivity2() {
    fetch(`/api/getPositivity/${this.state.transcribed}`)
      .then(res => res.json())
      .then(user => this.setState({ positivity: user.positivity }));
  }

  getKeyPhrases2() {
    fetch(`/api/getKeyPhrases/${this.state.transcribed}`)
      .then(res => res.json())
      .then(user => this.setState({ keyPhrases: user.keyPhrases }));
  }

  getWPM2() {
    fetch(`/api/getWPM/${this.state.transcribed}`)
      .then(res => res.json())
      .then(user => this.setState({ WPM: user.WPM }));
  }

  //Submit Button
  ///////////////////////////////////////////////////////////

  handleSubmitTextAnalyze = event => {
    event.preventDefault(); //weird thing with react so states don't revert to original

    this.getPositivity();
    this.getKeyPhrases();
  };

  handleSubmitTranscriptionAnalyze = event => {
    event.preventDefault();

    this.getPositivity2();
    this.getKeyPhrases2();
    this.getWPM2();
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
    const { test } = this.state;

    return (
      <div>
        <h1>Transcribed: {transcribed}</h1>
        <h1>Text: {inputText}</h1>
        <h1>Positivity: {positivity}</h1>
        <h1>Key Words: {keyPhrases} </h1>
        <h1>WPM: {WPM}</h1>
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
        {test.map(test => (
          <li key={test}>{test}</li>
        ))}
      </div>
    );
  }

  //FUNCTIONS
  ///////////////////////////////////////////////////////////
}
