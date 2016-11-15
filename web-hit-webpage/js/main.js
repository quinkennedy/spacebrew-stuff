$(document).ready( function() {
	setup();
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

var address = unescape(gup('address'));//the address of the website you want to hit

var sb;
var setup = function(){
  sb = new Spacebrew.Client(undefined,
                            "hit-webpage " + Math.floor(Math.random() * 1000),
                            "This is a client which goes to some wepage when it receives a bang.",
                            {debug: true});
  window.document.title = sb._name;
  sb.addSubscribe("Bang!", "boolean");
  sb.onBooleanMessage = function onBoolean(name, value){
    $.get(address);
    incrementIndex();
    document.getElementById("output").innerHTML =
      address+" has been visited "+index+" times";
  };
    
  sb.onOpen = function onOpen(){
    console.log("WebSockets connection opened");
    document.getElementById("output").innerHTML = 
      "send a bang to visit " + address;
  };
  sb.onClose = function onClose(){
    console.log("WebSockets connection closed");
    document.getElementById("output").innerHTML = 
      "no longer connected to spacebrew :(";
  };

  sb.connect();
};

function incrementIndex() {
    index += 1;
    //console.log(index);
}
