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
let accessKey = process.env.AZURE_API_TEXT_ANALYTICS;
let uri = "canadacentral.api.cognitive.microsoft.com";
let path = "/text/analytics/v2.0/";

///////////////////////////////////////////////

let response_handler = function(response) {};

app.get("/api/languageDetection/:text", (req, res) => {
  var documents = {
    documents: [{ id: "1", text: req.params.text }]
  };

  let body = JSON.stringify(documents);

  //Params
  let request_params = {
    method: "POST",
    hostname: uri,
    path: path + "languages",
    headers: {
      "Ocp-Apim-Subscription-Key": accessKey
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
      res.send({ lang: body_.documents[0].detectedLanguages[0].name }); //Send Data
    });
  });

  reqq.write(body);
  reqq.end();
});

app.get("/api/test", (req, res) => {
  const speechService = require("ms-bing-speech-service");

  const options = {
    language: "en-US",
    subscriptionKey: "1f7e738aa49a4270937366dfe045b3fd"
  };

  const recognizer = new speechService(options);

  recognizer
    .start()
    .then(_ => {
      recognizer.on("recognition", e => {
        if (e.RecognitionStatus === "Success") res.send({ transcribed: e });
      });

      recognizer
        .sendFile("speak.wav")
        .then(_ => console.log("file sent."))
        .catch(console.error);
    })
    .catch(console.error);
});

////

// const speechService = require("ms-bing-speech-service");

// const options = {
//   language: "en-US",
//   subscriptionKey: "1f7e738aa49a4270937366dfe045b3fd"
// };

// const recognizer = new speechService(options);

// recognizer
//   .start()
//   .then(_ => {
//     recognizer.on("recognition", e => {
//       if (e.RecognitionStatus === "Success") console.log(e);
//     });

//     recognizer
//       .sendFile("speak.wav")
//       .then(_ => console.log("file sent."))
//       .catch(console.error);
//   })
//   .catch(console.error);

////
app.listen(8080, () => console.log("Listening on port 8080!!"));