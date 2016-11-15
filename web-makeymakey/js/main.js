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
var pubs = ["W","A","S","D","F","G","H","J","[SPACE]","[UP]","[DOWN]","[RIGHT]","[LEFT]","[MOUSE_LEFT]","[MOUSE_RIGHT]"];
var isKeyDown = {};

function addPublishers(){
  for(var i = 0; i < pubs.length; i++){
    sb.addPublish(pubs[i], 'boolean', 'false');
    isKeyDown[pubs[i]] = false;
  }
}

var sb;
function setupsb(){
  sb = new Spacebrew.Client(undefined,
                            "makeymakey_to_bang " + 
                              Math.floor(Math.random() * 1000),
                            "This turns makeymakey inputs into boolean messages.",
                            {debug: true});
  window.document.title = sb._name;
  addPublishers();

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
};

//-------------------------------------------------------
function setup (){
	window.onkeydown = onKeyDown;
	window.onkeyup = onKeyUp;
	window.onmousedown = onMouseDown;
	window.onmouseup = onMouseUp;
};

function incrementIndex() {
    index += 1;
    //console.log(index);
};

function sendMessage(c, val){
    //don't send a repeat message
  if (!isKeyDown.hasOwnProperty(c) || isKeyDown[c] == val){
    return;
  }
  isKeyDown[c] = val;
  sb.send(c, 'boolean', val.toString());

  incrementIndex();
  updateOutput();
};

function updateOutput(){
  document.getElementById("output").innerHTML = "sent " + index + " bangs";
}

//-------------------------------------------------------
function onKeyDown(evt){
  sendMessage(getKeyIdent(evt), true);
}

function onKeyUp(evt){
  sendMessage(getKeyIdent(evt), false);
}

function onMouseDown(evt){
  sendMessage(getMouseButtonIdent(evt), true);
}

function onMouseUp(evt){
  sendMessage(getMouseButtonIdent(evt), false);
}

function getMouseButtonIdent(evt){
  if (evt.which == 1){
    return "[MOUSE_LEFT]";
  } else if (evt.which == 3){
    return "[MOUSE_RIGHT]";
  } else {
    return undefined;
  }
}

function getKeyIdent(evt){
    switch (evt.keyCode){
        case 38:
            return "[UP]";
        case 40:
            return "[DOWN]";
        case 37:
            return "[LEFT]";
        case 39:
            return "[RIGHT]";
        case 32:
            return "[SPACE]";
    }
    return String.fromCharCode(evt.keyCode);
}
