/* global Spacebrew */
/* exported 
 * index, prevString, prevBoolean, prevRange, data, getLink, sendMessage */

$(document).ready( function() {
  setupsb();
});

/**
 * Get User Parameter: fetches data from the querystring
 * @param {string} name - key to look up in querystring
 * @param {anything} defaultValue - value to return if the provided key 
 *   is not found in the querystring
 * @returns {anything} The value associated with the provided key, 
 *   or the default value if the key is not found.
 */
function gup( name, defaultValue ) {
  name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
  var regexS = '[\\?&]'+name+'=([^&#]*)';
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return defaultValue;
  else
    return results[1];
}

var index = 0;
var sb;

var stringInputs = unescape(gup('stringIns', 'string'));
var booleanInputs = unescape(gup('booleanIns', 'boolean'));
var rangeInputs = unescape(gup('rangeIns', 'range'));
var stringOutputs = unescape(gup('stringOuts', 'string'));
var booleanOutputs = unescape(gup('booleanOuts', 'boolean'));
var rangeOutputs = unescape(gup('rangeOuts', 'range'));
var prevString, prevBoolean, prevRange;
var data = {};

console.log(name);

/**
 * Strip leading and trailing spaces from a string
 * @param {string} s - string to strip
 * @returns {string} stripped string
 */
function strip(s){
  return s.replace(/(^\s*)|(\s*$)/gi,'');
}

var onString = 
    function(s,n){
      console.log(
        'received in onString function on subscriber ' + n + ': ' + s);
      console.log('opportunity to return {string:_ ,boolean:_ ,range:_}');
    };
var onBoolean = 
    function(b,n){
      console.log(
        'received in onBoolean function on subscriber ' + n + ': ' + b);
      console.log('opportunity to return {string:_ ,boolean:_ ,range:_}');
    };
var onRange = 
    function(r,n){
      console.log(
        'received in onRange function on subscriber ' + n + ': ' + r);
      console.log('opportunity to return {string:_ ,boolean:_ ,range:_}');
    };
var init = function(){};

/**
 * Populate the routes of this client based on query string variables
 */
function populatePubSubs(){
  var looping = 
      [{type:'string',publish:stringOutputs, subscribe:stringInputs},
       {type:'boolean',publish:booleanOutputs, subscribe:booleanInputs},
       {type:'range',publish:rangeOutputs, subscribe:rangeInputs}];
  var currLooping;
  var types = [{key:'subscribe', func:'addSubscribe'},
               {key:'publish', func:'addPublish'}];
  var currType;
  for(var i = 0; i < looping.length; i++){
    for(var j = 0; j < types.length; j++){
      currType = types[j];
      if (looping[i][currType.key]){
        currLooping = looping[i][currType.key].split(',').map(strip);
        for(var k = 0; k < currLooping.length; k++){
          sb[currType.func](currLooping[k], looping[i].type);
        }
      }
    }
  }
}

/**
 * initialize the Spacebrew Client
 */
function setupsb(){
  try{
    init();
  } catch(e){
    console.log(e);
  }
  sb = new Spacebrew.Client(undefined, 
                            'custom ' + Math.floor(Math.random() * 1000), 
                            undefined,
                            {debug: true});
  window.document.title = sb._name;
  populatePubSubs();
  /**
   * sends output via the appropriate publisher
   * @param {Object} output - The output to publish
   */
  function handleOutput(output){
    if (output){
      if (output.string && stringOutputs){
        sb.send(stringOutputs.split(',')[0], 'string', output.string);
      }
      if (output.range && rangeOutputs){
        sb.send(rangeOutputs.split(',')[0], 'range', output.range);
      }
      if (output.boolean && booleanOutputs){
        sb.send(booleanOutputs.split(',')[0], 'boolean', output.boolean);
      }
    }
  }
  sb.onBooleanMessage = function(name, value){
    try{
      var output = onBoolean(value, name);
      handleOutput(output);
    } catch (e){
      console.log(e);
    }
    prevBoolean = value;
  };
  sb.onStringMessage = function(name, value){
    try{
      var output = onString(value, name);
      handleOutput(output);
    } catch (e){
      console.log(e);
    }
    prevString = value;
  };
  sb.onRangeMessage = function(name, value){
    try{
      var output = onRange(value, name);
      handleOutput(output);
    } catch (e){
      console.log(e);
    }
    prevRange = value;
  };

  sb.onOpen = function onOpen(){
    console.log('WebSockets connection opened');
    display(document.getElementById('introText').text);
  };
  sb.onClose = function onClose(){
    console.log('WebSockets connection closed');
  };

  sb.connect();
}

/**
 * Get a link to re-create this custom client
 * @returns {string} a link to re-create this client
 */
function getLink(){
  var href = window.location.href;
  var qsIndex = href.indexOf('?');
  if (qsIndex >= 0){
    href = href.substring(0,qsIndex);
  }
  return href + 
    '?name=' + escape(sb._name) + 
    '&server=' + escape(sb._server) + 
    '&description=' + escape(sb._description) + 
    '&stringIns=' + escape(stringInputs) + 
    '&stringOuts=' + escape(stringOutputs) + 
    '&booleanIns=' + escape(booleanInputs) + 
    '&booleanOuts=' + escape(booleanOutputs) + 
    '&rangeIns=' + escape(rangeInputs) + 
    '&rangeOuts=' + escape(rangeOutputs) + 
    '&code=' + escape('onRange = ' + onRange + 
                      ';onString = ' + onString + 
                      ';onBoolean = ' + onBoolean + 
                      ';init = ' + init + ';');
}

/**
 * Send the provided message via Spacebrew
 * @param {string} publisher - name of publishing route
 * @param {string} value - value to publish
 * @param {string} type - data type of publishing route
 */
function sendMessage(publisher, value, type){
  if (type == 'number') type = 'range';
  if (type != 'string' && type != 'boolean' && type != 'range'){
    //TODO: glean type from publisher name
  }
  sb.send(publisher, type, value);
}

/**
 * Display the provided string
 * @param {string} s - String to display
 */
function display(s){
  document.body.innerHTML = s;
}

var qsCode = gup('code');
if (qsCode){
  eval(unescape(qsCode));
}
