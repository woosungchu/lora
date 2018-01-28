var frameModule = require("ui/frame");

exports.pageLoaded = function() {

};

exports.goRecord = function(){
  var topmost = frameModule.topmost();
  topmost.navigate('views/record/record');
}
