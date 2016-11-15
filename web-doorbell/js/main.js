
// Spacebrew Object
var sb;

// Vars for example
var index = 0;
var buttonPress = false;
var buttonText = "";

$(document).ready( function() {
  setup();
});

function onRangeMessage( name, value ){
  if (name == "color") {
    console.log("received color message");
    changeBGC(value);
  }
  incrementIndex();
}

function onStringMessage( name, value ){
  // if it’s text
  if (name == "text") {
    console.log("received text message"); 
    buttonText = value; 
    document.getElementById("buttonMsg").innerHTML = value;        
  } 
  incrementIndex();
}

//-------------------------------------------------------
function setup (){
  // setup spacebrew
  sb = new Spacebrew.Client(undefined,
                            "doorbell " + Math.floor(Math.random() + 1000),
                            undefined,
                            {debug:true});
  window.document.title = sb._name;
  sb.description = "This is an example client which has a button you can push to send a message. It also listens for range and string input which will change the background color and text on the webpage respectively.";

  sb.addPublish( "buttonPress", "boolean", "false" );
  sb.addPublish( "randomRange", "range", "0" );
  sb.addSubscribe( "color", "range" );
  sb.addSubscribe( "text", "string" );

  // Override Spacebrew events
  // - this is how you catch events coming from Spacebrew
  sb.onRangeMessage = onRangeMessage;
  sb.onStringMessage = onStringMessage;

  sb.connect();

  // listen to the mouse
	//window.addEventListener("mousedown", onMouseDown);
	//window.addEventListener("mouseup", onMouseUp);
}

//-------------------------------------------------------
function incrementIndex() {
    index += 1;
}

//-------------------------------------------------------
function changeBGC(pColor){
  var tColor = "rgb("+Math.floor(pColor/4)+","+Math.floor(pColor/4)+","+Math.floor(pColor/4)+")";
  document.body.style.background = tColor; //color;
  console.log(tColor);
  console.log("Changed color");
}

//-------------------------------------------------------
function onMouseDown (evt){
	console.log("Sending message"); 
  sb.send("buttonPress", "boolean", "true");
  sb.send("randomRange", "range", 1023);
}
function onMouseUp (evt){
	console.log("Sending message"); 
  sb.send("buttonPress", "boolean", "false");
  sb.send("randomRange", "range", Math.floor(Math.random()*1024) );
}
