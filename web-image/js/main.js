/* global Spacebrew */

$(document).ready( function() {
  setup();
});

var sb;
/**
 * Configure the Spacebrew Client and connect to the Spacebrew server
 */
function setup(){
  sb = new Spacebrew.Client(undefined,
                            'image ' + Math.floor(Math.random() * 1000),
                            'A simple image viewer',
                            {debug: true});
  window.document.title = sb._name;
  sb.addPublish('current image', 
                'url', 
                'http://thissongissick.com/blog/wp-content/uploads/' +
                  '2011/05/Hall-and-Oates-Dj-Kue-Remix.jpg');
  sb.addSubscribe('image', 'url');
  sb.addSubscribe('cover', 'boolean');

  sb.onBooleanMessage = function onBoolean(name, value){
    $('body').css('background-size', (value ? 'cover' : 'contain'));
  };
  sb.onCustomMessage = function onCustom(name, value/*, type*/){
    $('body').css('background-image', 'url('+value+')');
    sb.send('current image', 'url', value);
  };

  sb.onOpen = function onOpen(){
    console.log('WebSockets connection opened');
    document.getElementById('output').style.display = 'none';
  };
  sb.onClose = function onClose(){
    console.log('WebSockets connection closed');
    document.getElementById('output').style.display = '';
  };
  
  sb.connect();
}
