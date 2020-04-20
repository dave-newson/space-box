/**
 * UDP Packet generator
 * Seconds a payload every x milliseconds, used for testing UDP things.
 */
 
var udp = require('dgram');

// Send here
var addr = "192.168.1.201";
var port = 12344;

// Send this
var payload = () => String(Math.round(1000000 * Math.random(), 0));
var freq = 100;

// Send packet
const send = function(data) {
	
	console.log(`> ${data}`);
	
	// creating a client socket
	var client = udp.createSocket('udp4');
	client.send(data, port, addr, function(error){
	  if (error) {
		console.error(error);
//		return process.exit(1);
	  }
	  client.close();
	});
}

// Loop sending packets
const loop = async function() {
	
	let data = "";
	
	while (true) {
		
		// Wait 100ms
		await new Promise((resolve) => setTimeout(resolve, freq));

		// send
		send(payload());
		
	}
	
};

// Go!
return loop();
