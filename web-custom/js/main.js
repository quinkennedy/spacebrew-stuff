$(document).ready( function() {
	setupsb();
});

function gup( name, defaultValue ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return defaultValue;
  else
    return results[1];
}

var index = 0;

var stringInputs = unescape(gup('stringIns', "string"));
var booleanInputs = unescape(gup('booleanIns', "boolean"));
var rangeInputs = unescape(gup('rangeIns', "range"));
var stringOutputs = unescape(gup('stringOuts', "string"));
var booleanOutputs = unescape(gup('booleanOuts', "boolean"));
var rangeOutputs = unescape(gup("rangeOuts", "range"));
var prev = {string:undefined,boolean:undefined,range:undefined};
var data = {};

console.log(name);

function strip(s){
  return s.replace(/(^\s*)|(\s*$)/gi,'');
}

function populatePubSubs(){
  var looping = [{type:'string',publish:stringOutputs, subscribe:stringInputs},
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
};

var sb;
function setupsb(){
  try{
    init();
  } catch(e){
    console.log(e);
  }
  sb = new Spacebrew.Client(undefined, 
                            "custom " + Math.floor(Math.random() * 1000), 
                            undefined,
                            {debug: true});
  window.document.title = sb._name;
  populatePubSubs();
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
    previousBoolean = value;
  };
  sb.onStringMessage = function(name, value){
    try{
      var output = onString(value, name);
      handleOutput(output);
    } catch (e){
      console.log(e);
    }
    previousString = value;
  };
  sb.onRangeMessage = function(name, value){
    try{
      var output = onRange(value, name);
      handleOutput(output);
    } catch (e){
      console.log(e);
    }
    previousRange = value;
  };

  sb.onOpen = function onOpen(){
    console.log("WebSockets connection opened");
    display(document.getElementById("introText").text);
  };
  sb.onClose = function onClose(){
    console.log("WebSockets connection closed");
  };

  sb.connect();
}

function getLink(){
  var href = window.location.href;
  var qsIndex = href.indexOf("?");
  if (qsIndex >= 0){
    href = href.substring(0,qsIndex);
  }
  return href + "?name=" + escape(sb._name) + "&server=" + escape(sb._server) + "&description=" + escape(sb._description) + "&stringIns=" + escape(stringInputs) + "&stringOuts=" + escape(stringOutputs) + "&booleanIns=" + escape(booleanInputs) + "&booleanOuts=" + escape(booleanOutputs) + "&rangeIns=" + escape(rangeInputs) + "&rangeOuts=" + escape(rangeOutputs) + "&code=" + escape("onRange = " + onRange + ";onString = " + onString + ";onBoolean = " + onBoolean + ";init = " + init + ";");
};

function sendMessage(publisher, value, type){
  if (type == "number") type = 'range';
  if (type != "string" && type != "boolean" && type != "range"){
    //TODO: glean type from publisher name
  }
  var message = {message:
       {
           clientName:name,
           name:publisher,
           type:type,
           value:value
       }
    }

  //console.log(message);
  ws.send(JSON.stringify(message));
};

function display(s){
  document.body.innerHTML = s;
};

var onString = function(s,n){
  console.log("received in onString function on subscriber " + n + ": " + s);
  console.log("opportunity to return {string:_ ,boolean:_ ,range:_}");
}, onBoolean = function(b,n){
  console.log("received in onBoolean function on subscriber " + n + ": " + b);
  console.log("opportunity to return {string:_ ,boolean:_ ,range:_}");
}, onRange = function(r,n){
  console.log("received in onRange function on subscriber " + n + ": " + r);
  console.log("opportunity to return {string:_ ,boolean:_ ,range:_}");
}, init = function(){};

var qsCode = gup('code');
if (qsCode){
  eval(unescape(qsCode));
}
