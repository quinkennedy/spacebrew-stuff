/* global Spacebrew */

$(document).ready( function() {
  setup();
});

var sb;

/**
 * initialize the Spacebrew Client and connect to the Spacebrew server
 */
function setup(){
  sb = new Spacebrew.Client(undefined,
                            'filter ' + Math.floor(Math.random() * 1000),
                            'This only passes true values',
                            {debug: true});
  window.document.title = sb._name;
  sb.addPublish('true', 'boolean', 'true');
  sb.addSubscribe('value', 'boolean');
  sb.onBooleanMessage = function onBoolean(name, value){
    if (value){
      sb.send('true', 'boolean', 'true');
    }
  };
  sb.onOpen = function onOpen(){
    console.log('WebSockets connection opened');
    document.getElementById('output').innerHTML = 
      'Send a boolean to be filtered.';
  };
  sb.onClose = function onClose(){
    console.log('WebSockets connection closed');
    document.getElementById('output').innerHTML = 
      'no longer connected to spacebrew :(';
  };

  sb.connect();
}
