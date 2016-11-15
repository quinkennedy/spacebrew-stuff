/* global Spacebrew */

$(document).ready( function() {
  setup();
  setupsb();
});

var sb;
var index = 0;
var pubs = [
  'W','A','S','D',
  'F','G','H','J',
  '[SPACE]',
  '[UP]','[DOWN]','[RIGHT]','[LEFT]',
  '[MOUSE_LEFT]','[MOUSE_RIGHT]'];
var isKeyDown = {};

/**
 * Add all the publishers appropriate for the Makey-Makey
 */
function addPublishers(){
  for(var i = 0; i < pubs.length; i++){
    sb.addPublish(pubs[i], 'boolean', 'false');
    isKeyDown[pubs[i]] = false;
  }
}

/**
 * Configure this Spacebrew Client and connect to the Spacebrew server
 */
function setupsb(){
  sb = new Spacebrew.Client(
      undefined,
      'makeymakey_to_bang ' + 
        Math.floor(Math.random() * 1000),
      'This turns makeymakey inputs into boolean messages.',
      {debug: true});
  window.document.title = sb._name;
  addPublishers();

  sb.onOpen = function onOpen(){
    console.log('WebSockets connection opened');
    document.getElementById('output').innerHTML = 
      'Type to send bangs!';
  };
  sb.onClose = function onClose(){
    console.log('WebSockets connection closed');
    document.getElementById('output').innerHTML = 
      'no longer connected to spacebrew :(';
  };

  sb.connect();
}

/**
 * Setup UI events
 */
function setup (){
  window.onkeydown = onKeyDown;
  window.onkeyup = onKeyUp;
  window.onmousedown = onMouseDown;
  window.onmouseup = onMouseUp;
}

/**
 * increments the variable tracking how many messages have been sent
 */
function incrementIndex() {
  index += 1;
  //console.log(index);
}

/**
 * sends a message via Spacebrew
 * @param {string} c - 'Character' to send message for
 * @param {boolean} val - value to send
 */
function sendMessage(c, val){
    //don't send a repeat message
  if (!isKeyDown.hasOwnProperty(c) || isKeyDown[c] == val){
    return;
  }
  isKeyDown[c] = val;
  sb.send(c, 'boolean', val.toString());

  incrementIndex();
  updateOutput();
}

/**
 * updates the UI to display how many messages have been sent
 */
function updateOutput(){
  document.getElementById('output').innerHTML = 'sent ' + index + ' bangs';
}

/**
 * sends a message via Spacebrew
 * @param {Event} evt - A key event
 */
function onKeyDown(evt){
  sendMessage(getKeyIdent(evt), true);
}

/**
 * sends a message via Spacebrew
 * @param {Event} evt - A key event
 */
function onKeyUp(evt){
  sendMessage(getKeyIdent(evt), false);
}

/**
 * sends a message via Spacebrew
 * @param {Event} evt - A mouse event
 */
function onMouseDown(evt){
  sendMessage(getMouseButtonIdent(evt), true);
}

/**
 * sends a message via Spacebrew
 * @param {Event} evt - A mouse event
 */
function onMouseUp(evt){
  sendMessage(getMouseButtonIdent(evt), false);
}

/**
 * returns a string version of the mouse event
 * @param {Event} evt - Source mouse event
 * @returns {string} a string reperesentation of the mouse event
 */
function getMouseButtonIdent(evt){
  if (evt.which == 1){
    return '[MOUSE_LEFT]';
  } else if (evt.which == 3){
    return '[MOUSE_RIGHT]';
  } else {
    return undefined;
  }
}

/**
 * returns a string version of the triggered key
 * @param {Event} evt - Source key down/up event
 * @returns {string} A string reperesentation of the event's keyCode
 */
function getKeyIdent(evt){
  switch (evt.keyCode){
    case 38:
      return '[UP]';
    case 40:
      return '[DOWN]';
    case 37:
      return '[LEFT]';
    case 39:
      return '[RIGHT]';
    case 32:
      return '[SPACE]';
  }
  return String.fromCharCode(evt.keyCode);
}
