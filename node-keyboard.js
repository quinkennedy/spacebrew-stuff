var sys = require("sys");
var exec = require("child_process").exec;
var child;
var WebSocketClient = require("ws");

/**
 * The port of the spacebrew server. defaults to 9000. 
 * Can be overridden by a first argument when starting up the admin.
 * node node_persistent_admin.js 9011
 * @type {Number}
 */
var commandPort = 9000;
if (process.argv[2]) {
    var tempPort = parseInt(process.argv[2]);
    //check that tempPort != NaN
    //and that the port is in the valid port range
    if (tempPort == tempPort &&
        tempPort >= 1 && tempPort <= 65535){
        commandPort = tempPort;
    }
}

// create the wsclient and register as a client
wsClient = new WebSocketClient("ws://localhost:9000");
wsClient.on("open", function(conn){
    console.log("connected");
    var configMsg = {"config":{"name":"node keyboard output", 
    				"description":"A process that receives bangs on one of many character-associated routes, which triggers a system-level actuation of that key.",
    				"subscribe":{"messages":[]}}};
    configMsg.config.subscribe.messages.push({"name":"[SPACE]", "type":"boolean"});
    for(var i = '!'.charCodeAt(0); i < '~'.charCodeAt(0); i++){
    	configMsg.config.subscribe.messages.push({"name":String.fromCharCode(i), "type":"boolean"});
    }
    wsClient.send(JSON.stringify(configMsg));
});
wsClient.on("message", function(data){
	var parsed = JSON.parse(data).message;
	if (Boolean(parsed.value)){
        exec('osascript -e "tell application \\\"System Events\\\" to keystroke \\\"'+parsed.name+'\\\""'); 
        /* weird stuff if we want to have the keyboard catcher and keyboard sender on one computer
        exec('osascript -e "tell application \\\"System Events\\\"\nkey down command\nkeystroke tab\nkey up command\nend tell"');
        setTimeout(function(){
                        exec('osascript -e "tell application \\\"System Events\\\" to keystroke \\\"'+parsed.name+'\\\""'); 
                        setTimeout(function(){
                                        exec('osascript -e "tell application \\\"System Events\\\"\nkey down command\nkeystroke tab\nkey up command\nend tell"');
                                    }, 50);
                        }, 50);
*/
	}
});


