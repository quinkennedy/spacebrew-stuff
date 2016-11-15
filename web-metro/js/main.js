$(document).ready( function() {
	setupsb();
});

function gup( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

var delay = parseInt(gup('delay'));
var currInterval;

var sb;
var setupsb = function(){
  sb = new Spacebrew.Client(undefined,
                            'metronome ' + Math.floor(Math.random() * 1000),
                            'This outputs a boolean every so often.',
                            {debug: true});
  window.document.title = sb._name;
  sb.addPublish('bang', 'boolean', 'false');
  sb.addSubscribe('delay', 'number');
  sb.addSubscribe('sync', 'boolean');

  sb.onBooleanMessage = function onBoolean(name, value){
    setDelay(delay);
    sendBang();
  };
  sb.onCustomMessage = function onCustom(name, value, type){
    var v = parseInt(currValue);
    if (v == v) {
      delay = v;
      setDelay(delay);
    }
  };

  sb.onOpen = function onOpen(){
    console.log("WebSockets connection opened");
    if (delay == delay){
      setDelay(delay);
    } else {
      //NaN
      document.getElementById("output").innerHTML = 
        "Send a number message to set metro delay.";
    }
  };
  sb.onClose = function onClose(){
    console.log("WebSockets connection closed");
    document.getElementById("output").innerHTML = 
      "no longer connected to spacebrew :(";
  };
  
  sb.connect();
};

function setDelay(d){
  clearInterval(currInterval);
  currInterval = setInterval(sendBang, d);
  document.getElementById('output').innerHTML = "sending bang every " + d + " milliseconds";
}

function sendBang(){
  sb.send('bang', 'boolean', 'true');
};
