import React, { Component } from "react";
import "./app.css";

export default class App extends Component {
  state = {
    lang: null,
    inputText: null,
    transcribed: "null"
  };

  getLanguage() {
    fetch(`/api/languageDetection/${this.state.inputText}`)
      .then(res => res.json())
      .then(user => this.setState({ lang: user.lang }));
  }

  getAudioText() {
    //Test Only
    fetch("/api/test")
      .then(res => res.json())
      .then(user => this.setState({ transcribed: user.transcribed }));
  }

  componentDidMount() {
    //Get Language
    this.getLanguage();
    this.getAudioText();
  }

  handleSubmit = event => {
    event.preventDefault(); //weird thing with react so states don't revert to original

    //Get Language
    this.getLanguage();
  };

  handleInputUpdate = evt => {
    this.setState({
      inputText: evt.target.value
    });
  };

  render() {
    const { lang } = (this.state);
    const { inputText } = this.state;
    const { transcribed } = this.state;

    return (
      <div>
<<<<<<< HEAD
        <h1>Text: {inputText} </h1>
=======
        <h1>Transliteration: {transcribed}</h1>
        <h1>Text: {inputText}</h1>
>>>>>>> afc4d636e8486998f97aa8e1eeb78ee60d20ea97
        <h1>Language: {lang}</h1>

        <form>
          <label>
            Text:
            <input
              type="text"
              name="name"
              value={inputText}
              onChange={evt => this.handleInputUpdate(evt)}
            />
          </label>

          <input onClick={this.handleSubmit} type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
