/* global Spacebrew */

$(document).ready( function() {
  setup();
});

var sb;
var index = 0;
var buttonText = '';
var partyModeOn = false;

/**
 * Handles all initialization
 */
function setup (){
// 	// listen to the mouse
  window.addEventListener('mousedown', onMouseDown);
  setupSB();
}

/**
 * Updates the text to display how many times 
 *  the button has been remotely "clicked"
 */
function updateButton(){
  incrementIndex();
  document.getElementById('numclicks').innerHTML=
    buttonText + 
    ' has been virtually clicked ' + 
    index + 
    ' times and PARTY MODE IS: ' +
    partyModeOn;
}

/**
 * Initialize the Spacebrew client and set up all callbacks
 */
function setupSB(){
  var description = 
    'This is an example client which has a big red button you can push ' +
    'to send a message. It also listens for color events and will change ' +
    'it\'s color based on those messages.';
  sb = new Spacebrew.Client(undefined,
                            'button ' + Math.floor(Math.random() * 1000),
                            description,
                            {debug: true});
  window.document.title = sb._name;
  sb.addPublish('buttonPress', 'boolean', 'false');
  sb.addPublish('currentColor', 'number', '1023');
  sb.addPublish('currentMessage', 'string', 'not-updated');
  sb.addSubscribe('partyMode', 'boolean');
  sb.addSubscribe('color', 'number');
  sb.addSubscribe('text', 'string');
  sb.onStringMessage = function onString(name, value){
    buttonText = value;         
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
  sb.onCustomMessage = function onCustom(name, value/*, type*/){
    changeBGC(value);
    updateButton();
  };

  sb.onOpen = function onOpen(){
    console.log('WebSockets connection opened');
  };
  sb.onClose = function onClose(){
    console.log('WebSockets connection closed');
  };

  sb.connect();
}

/**
 * Increments the number of remote "clicks"
 */
function incrementIndex() {
  index += 1;
}

/**
 * Changes the background color
 * @param {string} color - The color to set the background to
 */
function changeBGC(color){
  document.body.style.background = color;
  console.log('Changed color');
}

/**
 * Sends a boolean message out to Spacebrew
 */
function onMouseDown (/*evt*/){
	//ecs.sendMessage('packet', 255);
  console.log('Sending message');
  sb.send('buttonPress', 'boolean', 'true');
}
