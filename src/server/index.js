require("dotenv").load(); //Env variables

const express = require("express");
const os = require("os");
const app = express();
app.use(express.static("dist"));

////

///////////////////////////////////////////////
//Azure
("use strict");

let https = require("https");
let accessKeyTextAPI = process.env.AZURE_API_TEXT_ANALYTICS;
let uri = "canadacentral.api.cognitive.microsoft.com";
let path = "/text/analytics/v2.0/";

///////////////////////////////////////////////

let response_handler = function(response) {};

app.get("/api/transcribeSample", (req, res) => {
  const speechService = require("ms-bing-speech-service");

  (async function() {
    const options = {
      language: "en-US",
      subscriptionKey: "1f7e738aa49a4270937366dfe045b3fd"
    };

    const recognizer = new speechService(options);
    await recognizer.start();

    recognizer.on("recognition", e => {
      if (e.RecognitionStatus === "Success")
        res.send({ transcribed: e.DisplayText });
    });

    recognizer.on("turn.end", async e => {
      console.log("recognizer is finished.");

      await recognizer.stop();
      console.log("recognizer is stopped.");
    });

    await recognizer.sendFile("speak1.wav");
    console.log("file sent.");
  })();
});

app.get("/api/getPositivity/:text", (req, res) => {
  var documents = {
    documents: [{ id: "1", text: req.params.text }]
  };

  let body = JSON.stringify(documents);

  //Params
  let request_params = {
    method: "POST",
    hostname: uri,
    path: path + "sentiment",
    headers: {
      "Ocp-Apim-Subscription-Key": accessKeyTextAPI
    }
  };

  //Request
  let reqq = https.request(request_params, function(azureResponse) {
    let body = "";

    azureResponse.on("data", function(d) {
      body += d;
    });

    azureResponse.on("end", function() {
      let body_ = JSON.parse(body);
      // res.send({ lang: body_.documents[0].detectedLanguages[0].name }); //Send Data
      // res.send(JSON.stringify(body_.documents[0].score));
      res.send({ positivity: body_.documents[0].score });
    });
  });

  reqq.write(body);
  reqq.end();
});

app.get("/api/getKeyPhrases/:text", (req, res) => {
  var documents = {
    documents: [{ id: "1", language: "en", text: req.params.text }]
  };

  let body = JSON.stringify(documents);

  //Params
  let request_params = {
    method: "POST",
    hostname: uri,
    path: path + "keyPhrases",
    headers: {
      "Ocp-Apim-Subscription-Key": accessKeyTextAPI
    }
  };

  //Request
  let reqq = https.request(request_params, function(azureResponse) {
    let body = "";

    azureResponse.on("data", function(d) {
      body += d;
    });

    azureResponse.on("end", function() {
      let body_ = JSON.parse(body);
      // res.send({ lang: body_.documents[0].detectedLanguages[0].name }); //Send Data
      // res.send(JSON.stringify(body_.documents[0].score));
      res.send({ keyPhrases: body_.documents[0].keyPhrases[0] });
      // res.send(body_);
    });
  });

  reqq.write(body);
  reqq.end();
});

app.get("/api/getEmotions", (req, res) => {
  var DeepAffects = require("deep-affects");
  var defaultClient = DeepAffects.ApiClient.instance;

  // Configure API key authorization: UserSecurity
  var UserSecurity = defaultClient.authentications["UserSecurity"];
  UserSecurity.apiKey = "0CNCwu1cyDy7UJg2K4i6HRU70DTz3xrF";

  var apiInstance = new DeepAffects.EmotionApi();

  var body = {
    content: "I'm so disgusted by the incest"
  };

  var callback = function(error, data, response) {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  };
  // sync request
  //apiInstance.syncRecogniseTextEmotion(body, callback);
});

app.get("/api/getAudioLength", (req, res) => {
  var wavFileInfo = require("wav-file-info");

  wavFileInfo.infoByFilename("speak.wav", function(err, info) {
    if (err) throw err;
    res.send({ audioLength: info.duration });
  });
});

app.get("/api/getWPM/:text", (req, res) => {
  var length = 0;
  var inputText = req.params.text;
  console.log(inputText);

  var wavFileInfo = require("wav-file-info");

  wavFileInfo.infoByFilename("speak.wav", function(err, info) {
    if (err) throw err;
    length = info.duration;
    words = inputText.split(" ").length;
    var WPM = words / (length / 60);
    var WPM = Math.round(WPM);
    //console.log(length);
    res.send({ WPM: WPM });
  });

  //var WPM = inputText / length;
  //res.send(WPM);
});

app.listen(8080, () => console.log("Listening on port 8080!"));
