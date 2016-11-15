$(document).ready( function() {
	setup();
});

var sb;
var index = 0;
var buttonPress = false;
var buttonText = "";

//-------------------------------------------------------
function setup (){
// 	// listen to the mouse
	window.addEventListener("mousedown", onMouseDown);
  setupSB();
}

function updateButton(){
  incrementIndex();
  document.getElementById("numclicks").innerHTML=buttonText+" has been virtually clicked "+index+" times and PARTY MODE IS: "+partyModeOn;
}

function setupSB(){
  sb = new Spacebrew.Client(undefined,
                            "button " + Math.floor(Math.random() * 1000),
                            "This is an example client which has a big red button you can push to send a message. It also listens for color events and will change it's color based on those messages.",
                            {debug: true});
  window.document.title = sb._name;
  sb.addPublish("buttonPress", "boolean", "false");
  sb.addPublish("currentColor", "number", "1023");
  sb.addPublish("currentMessage", "string", "not-updated");
  sb.addSubscribe("partyMode", "boolean");
  sb.addSubscribe("color", "number");
  sb.addSubscribe("text", "string");
  sb.onStringMessage = function onString(name, value){
    buttonText = currValue;         
    updateButton();
  };
  sb.onBooleanMessage = function onBoolean(name, value){
    if (value == true) {
       partyModeOn = true;
       console.log(partyModeOn);
    } else {
      partyModeOn = false;
    }
    updateButton();
  };
  sb.onCustomMessage = function onCustom(name, value, type){
    changeBGC(value);
    updateButton();
  }
    
  sb.onOpen = function onOpen(){
    console.log("WebSockets connection opened");
  };
  sb.onClose = function onClose(){
    console.log("WebSockets connection closed");
  };

  sb.connect();
}

function incrementIndex() {
    index += 1;
}

function changeBGC(color){
  document.body.style.background = color;
  console.log("Changed color");
}

//-------------------------------------------------------
function onMouseDown (evt){
	//ecs.sendMessage("packet", 255);
	console.log("Sending message");
  sb.send("buttonPress", "boolean", "true");
}

