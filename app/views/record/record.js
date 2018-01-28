var observable = require("data/observable");
var fs = require('file-system');
var audio = require("nativescript-audio");
var permissions = require('nativescript-permissions');

var data = new observable.Observable({});
var recorder,player;

function onNavigatingTo(args) {
   var page = args.object;
   page.bindingContext = data;

   data.set('isRecording', false);
}
exports.onNavigatingTo = onNavigatingTo;

/* START RECORDING */

function start(args) {

   permissions.requestPermission(android.Manifest.permission.RECORD_AUDIO, "Let me hear your thoughts...")
 .then(function () {

   // you should check if the device has recording capabilities
   if (audio.TNSRecorder.CAN_RECORD()) {

     recorder = new audio.TNSRecorder();

     var audioFolder = fs.knownFolders.currentApp().getFolder("audio");

     var recorderOptions = {

       filename: audioFolder.path + '/recording.mp3',
       infoCallback: function () {
          console.log('infoCallback');
        },
       errorCallback: function () {
          console.log('errorCallback');
          alert('Error recording.');
        }
     };

    console.log('RECORDER OPTIONS: ' + recorderOptions);

    recorder.start(recorderOptions).then(function (res) {
       data.set('isRecording', true);
    }, function (err) {
        data.set('isRecording', false);
        console.log('ERROR: ' + err);
    });

   } else {
     alert('This device cannot record audio.');
   }

  })
   .catch(function () {
      console.log("Uh oh, no permissions - plan B time!");
   });
}
exports.start = start;

/* STOP RECORDING */

function stop(args) {
   if (recorder != undefined) {
     recorder.stop().then(function () {
     data.set('isRecording', false);
     alert('Audio Recorded Successfully.');
   }, function (err) {
     console.log(err);
     data.set('isRecording', false);
   });
  }
}
exports.stop = stop;

function getFile(args) {
 try {
    var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
    var recordedFile = audioFolder.getFile('recording.mp3');
    data.set("recordedAudioFile", recordedFile.path);
    return recordedFile.path;
  } catch (ex) {
    console.log(ex);
  }
}
exports.getFile = getFile;

function playAudio(){
  player = new audio.TNSPlayer();

  var rdata = data.get("recordedAudioFile") || getFile();

  var playerOptions = {
    audioFile: rdata,
    loop: false,
    completeCallback: function() {
      console.log("finished playing");
    },
    errorCallback: function(errorObject) {
      console.log(JSON.stringify(errorObject));
    },
    infoCallback: function(args) {
      console.log(JSON.stringify(args));
    }
  };

  player
    .playFromFile(playerOptions)
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      console.log("something went wrong...", err);
    });
}
exports.playAudio = playAudio;
