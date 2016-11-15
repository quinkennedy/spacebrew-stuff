$(document).ready( function() {
	setup();
});

var sb;
function setupSB(){
  sb = new Spacebrew.Client(undefined,
                            "send-url " + Math.floor(Math.random() * 1000),
                            'A simple image viewer',
                            {debug: true});
  window.document.title = sb._name;
  sb.addPublish('image', 
                'url', 
                'http://thissongissick.com/blog/wp-content/uploads/2011/05/Hall-and-Oates-Dj-Kue-Remix.jpg');
  sb.addPublish('cover', 'boolean', 'true');

  sb.onOpen = function onOpen(){
    console.log("WebSockets connection opened");
  };
  sb.onClose = function onClose(){
    console.log("WebSockets connection closed");
  };
  
  sb.connect();
}


//-------------------------------------------------------
var ddl, txt, chk;
function setup (){
  ddl = document.getElementById("ddlImg");
  txt = document.getElementById("txtImg");
  document.getElementById("btnImg").addEventListener('click',function(e){
    if (e){e.preventDefault();} sendImg();});
  ddl.onchange = function(){
    txt.value = ddl.options[ddl.selectedIndex].value;
    sendImg();
  }
  txt.onchange = sendImg;
  chk = document.getElementById("chkCover");
  chk.addEventListener('click', sendCover);
  setupSB();
}

function sendCover(){
  sb.send('cover', 'boolean', chk.checked.toString());
};

function sendImg(){
  sb.send('image', 'url', txt.value);
};
