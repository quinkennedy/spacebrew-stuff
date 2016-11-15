$(document).ready( function() {
  setup();
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

var index = 0;
var chars = gup('chars') || '';

var maxCharCode = '~'.charCodeAt(0);
var minCharCode = ' '.charCodeAt(0);

function addPublishers(){
  if (chars.length == 0){//add everything
    for (var i = minCharCode; i <= maxCharCode; i++){
      var c = String.fromCharCode(i);
      sb.addPublish(c, 'boolean', 'false');
    };
  } else {
    chars = unescape(chars);
    for (var i = 0; i < chars.length; i++){
      sb.addPublish(chars[i], 'boolean', 'false');
    }
  }
}

var sb;
function setupsb(){
  sb = new Spacebrew.Client(undefined,
                            "key-to-bang " + Math.floor(Math.random() * 1000),
                            "This turns keystrokes into boolean messages.",
                            {debug: true});
  window.document.title = sb._name;
  addPublishers();
  sb.addSubscribe("text", "string");

  sb.onStringMessage = function onString(name, value){
    //for each character, send a message
    console.log("received text message"); 
    buttonText = value;
    var textLength = value.length;
    for(var i = 0; i < textLength; i++){
      var c = value.charCodeAt(i);
      if (minCharCode <= c && c <= maxCharCode){
        sb.send(String.fromCharCode(c), 'boolean', 'true');
        incrementIndex();
      }
    }
  };

  sb.onOpen = function onOpen(){
    console.log("WebSockets connection opened");
    document.getElementById("output").innerHTML = 
      "Type to send bangs!";
  };
  sb.onClose = function onClose(){
    console.log("WebSockets connection closed");
    document.getElementById("output").innerHTML = 
      "no longer connected to spacebrew :(";
  };

  sb.connect();
}

//-------------------------------------------------------
function setup (){
	window.onkeypress = onKeyPress;
}

function incrementIndex() {
    index += 1;
    //console.log(index);
}

function updateOutput(){
  document.getElementById("output").innerHTML = "sent " + index + " bangs";
}

//-------------------------------------------------------
function onKeyPress (evt){
  var charCode = evt.charCode;
  if (minCharCode <= charCode && maxCharCode >= charCode){
    sb.send(String.fromCharCode(charCode), 'boolean', 'true');
    incrementIndex();
    updateOutput();
  }
}
