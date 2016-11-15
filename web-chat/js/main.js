$(document).ready( function() {
	setup();
});

var sb;

//-------------------------------------------------------
function setup (){

  document.getElementById("btnSend").addEventListener('click',sendMessage);
  setupSB();
}

function setupSB(){
  sb = new Spacebrew.Client(undefined, 
                            "chat " + Math.floor(Math.random() * 1000), 
                            "A simple and whimsical chat client", 
                            {debug: true});
  window.document.title = sb._name;
  sb.addPublish("send", "string", "hello");
  sb.addSubscribe("receive", "string");
  sb.onStringMessage = 
    function onString(name, value){
      addText("them", value);
    };
  sb.onOpen = function onOpen(){
    console.log("WebSockets connection opened");
  };
  sb.onClose = function onClose(){
    console.log("WebSockets connection closed");
  };
  
  sb.connect();
}

function addText(from, text){
  var wrapper = document.createElement("div");
  wrapper.classList.add("text");

  var user = document.createElement("div");
  user.classList.add("from");
  user.innerText = from;
  //wrapper.appendChild(user);

  var content = document.createElement("div");
  content.classList.add("content");
  if (text.length > 0){
    var upper = text[0].toUpperCase();
    if ('A' <= upper && upper <= 'Z'){
      content.innerHTML = "<div class='from'>"+from+":</div><span class='drop "+upper+Math.floor(Math.random()*13)+"'>"+upper+"</span>"+text.substring(1); 
    } else {
      content.innerHTML = "<div class='from'>"+from+":</div>"+text;
    }
  }
  if (text.toUpperCase)
  
  wrapper.appendChild(content);

  var all = document.querySelector("#txtReceive");
  all.insertBefore(wrapper, all.firstChild);
}

function sendMessage(e){
  e = e || window.event;
  if (e)e.preventDefault();
  var toSend = document.getElementById("txtSend").value;
  addText("me", toSend);
  console.log("sending");
  sb.send("send", "string", toSend);
  return false;
};
