/* global Spacebrew */
/* exported onMouseUp, onMouseDown */

// Spacebrew Object
var sb;

// Vars for example
var buttonText = '';

$(document).ready( function() {
  setup();
});

/**
 * handles incoming range messages from Spacebrew
 * @param {string} name - the name of the route this message was received on
 * @param {number} value - the value received
 */
function onRangeMessage( name, value ){
  if (name == 'color') {
    console.log('received color message');
    changeBGC(value);
  }
}

/**
 * Handles incoming string messages.
 * @param {string} name - the route this message was received on
 * @param {string} value - the value received
 */
function onStringMessage( name, value ){
  //for 'text' messages, we set the displayed message to the received string
  if (name == 'text') {
    console.log('received text message'); 
    buttonText = value; 
    document.getElementById('buttonMsg').innerHTML = value;        
  } 
}

/**
 * Setup the Spacebrew Client and connect to the Spacebrew server
 */
function setup (){
  // setup spacebrew
  sb = new Spacebrew.Client(undefined,
                            'doorbell ' + Math.floor(Math.random() + 1000),
                            undefined,
                            {debug:true});
  window.document.title = sb._name;
  sb.description = 
    'This is an example client which has a button you can push to send a ' +
    'message. It also listens for range and string input which will change ' +
    'the background color and text on the webpage respectively.';

  sb.addPublish( 'buttonPress', 'boolean', 'false' );
  sb.addPublish( 'randomRange', 'range', '0' );
  sb.addSubscribe( 'color', 'range' );
  sb.addSubscribe( 'text', 'string' );

  // Override Spacebrew events
  // - this is how you catch events coming from Spacebrew
  sb.onRangeMessage = onRangeMessage;
  sb.onStringMessage = onStringMessage;

  sb.connect();
}

/**
 * changes the pages background color
 * @param {number} pColor - 
 *   a number that is used to set the new background color
 */
function changeBGC(pColor){
  var tColor = 
    'rgb('+Math.floor(pColor/4)+','+
           Math.floor(pColor/4)+','+
           Math.floor(pColor/4)+')';
  document.body.style.background = tColor; //color;
  console.log(tColor);
  console.log('Changed color');
}

/**
 * sends a button begin event (true} and a random number via Spacebrew
 */
function onMouseDown (/*evt*/){
  console.log('Sending message'); 
  sb.send('buttonPress', 'boolean', 'true');
  sb.send('randomRange', 'range', 1023);
}

/**
 * sends a button end event (false) and random number via Spacebrew
 */
function onMouseUp (/*evt*/){
  console.log('Sending message'); 
  sb.send('buttonPress', 'boolean', 'false');
  sb.send('randomRange', 'range', Math.floor(Math.random()*1024) );
}
