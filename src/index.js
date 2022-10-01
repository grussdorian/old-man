const express = require('express')
const app = express()
const { exec } = require("child_process");
const bodyParser = require("body-parser")
const fs = require('fs')
const axios = require('axios')
var chokidar = require('chokidar')
var watcher = chokidar.watch('./audio', { ignored: /^\./, persistent: true })
const port = process.env.PORT || 8085
const dotenv = require('dotenv').config()
const { MessagingResponse } = require('twilio').twiml
const dest = './audio/'
const whatsappNumber = 'whatsapp:+14155238886'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

var queue = []

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});


var eventify = function (arr, callback) {
  arr.push = function (e) {
    Array.prototype.push.call(arr, e);
    callback(arr);
  };
};


eventify(queue, function (updatedQueue) {

  voice = updatedQueue.shift(1)
  console.log('got here')
  console.log(voice)
  var link = voice.url
  var to = voice.from
  var uuid = voice.uuid
  var path = dest + uuid + "_" + to + ".ogg"
  axios({
    method: "get",
    url: link,
    responseType: "stream"
  }).then(function (response) {
    response.data.pipe(fs.createWriteStream(path));
  }).then((data, err) => {
    if (!err) {


      // method 1
      // Template: whisper audio/test.ogg --model small.en -o ../out --language English
      var audio_file_name = path
      var model = "small.en"
      var language = "English"
      var out_directory = dest + "out"
      var template = `whisper ${audio_file_name} --model ${model} -o ${out_directory} --language ${language}`

      exec("ls -la", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });


    }
  });

});


app.post('/message', function (req, res, next) {
  const twiml = new MessagingResponse();
  console.log(req.body)

  if (req.body['MediaContentType0'] === "audio/ogg") {
    const url = req.body['MediaUrl0']
    const from = req.body['From']
    const uuid = req.body['SmsSid']
    const voice = { url: url, from: from, uuid: uuid }
    console.log(voice)
    queue.push(voice)

    twiml.message('*Thank you for your message!* Audio sent. You will get a reply soon');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } else {
    twiml.message('*Thank you for your message!* Please send a voice sms to transcribe!');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    console.log(req.body)
  }
});


watcher
  .on('add', function (path) {
    if (path.endsWith(".ogg")) {
      console.log('Audio File', path, 'has been added');
    }
    if (path.endsWith(".txt")) {
      console.log('Transcript (txt) File', path, 'has been added');

      fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        var transcription = `*Here's your transcription*: \n\n` + data
        console.log(transcription);
        const match = path.match(/whatsapp:\+[\d]+/g);
        client.messages
          .create({
            from: whatsappNumber,
            body: transcription,
            to: match
          })
          .then(message => console.log(message.sid));
      });
    }

  })
  .on('change', function (path) { console.log('File', path, 'has been changed'); })
  .on('unlink', function (path) { console.log('File', path, 'has been removed'); })
  .on('error', function (error) { console.error('Error happened', error); })


setInterval(() => {
  remove_command = `rm -rf ` + dest + "out/*"
  exec(remove_command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    //console.log(`temp files removed! stdout: ${stdout}`);
  });
}, 10000);