const axios = require('axios');
const moment = require('moment');
const udp = require('dgram');

// Config
const addr = "192.168.1.201";
const port = 12344;
const client = udp.createSocket('udp4');

// Holds launch data
let launch = null;

/**
 * Send the text to the display
 */
const dispatch = (text) => {

	console.log(`> ${text}`);
	
	// creating a client socket
	client.send(text, port, addr, (error) => {
	  if (error) {
		console.error(error);
	  }
	});
};

const checkSuppress = (text, duration) => {

    // Always show in the last hour
    if (duration < 60*60) {
        return text;
    }

    const now = moment();
    
    // > 24 hours, only display once every 4 hours
    if (duration > 24*60*60) {
        if ([10, 14, 18, 22].indexOf(now.hour()) !== -1) {
            if (now.minute() === 0 && now.seconds() < 20) {
                return text;
            }
        }
    }

    // > 1 hour, only display once an hour, for 20 seconds
    if (duration > 60*60) {
        if (now.minute() === 0 && now.seconds() < 20) {
            return text;
        }
    }

    // Suppress text
    return ' ';
};

/**
 * Generate something to display
 */
const display = () => {
    if (!launch) return;

    let date = moment(launch.launch_date_utc);
    let now = moment();
    let durationSeconds = date.diff(now, 'seconds');
    let duration = moment.duration(durationSeconds, 'seconds');
    let sign = durationSeconds > 0 ? '+' : '-';

    // Modulo 20 second chunk
    let modSec = durationSeconds % 20; 

    let text = "";
    if (modSec === 19) {
        text = launch.mission_name.substr(0, 6);
    } else if (modSec === 18) {
        text = launch.mission_name.substr(6, 6);
    } else if (modSec === 17) {
        text = `${duration.days()}d ${duration.hours()}h`;
    } else {
        text = `${sign}${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`;
    }

    text = checkSuppress(text, durationSeconds);

    // Dispatch
    dispatch(text);
};

/**
 * Ask SpaceX when the next launch is
 */
const getLaunch = () => {
    
    // Request upcoming
    axios
        .get('https://api.spacexdata.com/v3/launches/upcoming')
        .then(function (response) {
            launch = response.data[0];
        });
};

dispatch('UPLINK');

setInterval(display, 200);
setInterval(getLaunch, 10000);
getLaunch();

