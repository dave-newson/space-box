const axios = require('axios');
const moment = require('moment');
const udp = require('dgram');
const fs = require('fs');
const config = require('./config.json');

// UDP4 Client
const client = udp.createSocket('udp4');

// Holds launch data
let launch = null;

/**
 * Send the text to the display
 */
const dispatch = (text) => {

	console.log(`> ${text}`);
	
	// creating a client socket
	client.send(text, config.port, config.host, (error) => {
	  if (error) {
		console.error(error);
	  }
	});
};

const checkSuppress = (text, duration) => {

    // If "show" file exists, or config says "always show",
    // then always display the text
    if (fs.existsSync('show') || config.alwaysShow) {
        return text;
    }

    // More than 30 minutes into the mission?
    // Don't display
    if (duration < -60*30) {
        return ' ';
    }

    // Always show in the last hour
    if (duration < 60*60) {
        return text;
    }

    const now = moment();
    
    // > 4 days, only display once every 4 hours
    if (duration > 4*24*60*60) {
        if ([10, 14, 18, 22].indexOf(now.hour()) !== -1) {
            if (now.minute() === 0 && now.seconds() < 60) {
                return text;
            }
        }
    }

    // > 1 hour, only display once an hour, for 60 seconds
    if (duration > 60*60) {
        if (now.minute() === 0 && now.seconds() < 60) {
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
        text = launch.mission_name.substr(12, 6);
    } else if (modSec === 16 || modSec === 15) {
        text = `${duration.days()}d ${duration.hours()}h`;
    } else {
        text = `${sign}${String(Math.abs(duration.minutes())).padStart(2, '0')}:${String(Math.abs(duration.seconds())).padStart(2, '0')}`;
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

            // Find the latest launch, less than 30 minutes old.
            launch = response.data
                .sort((a, b) => {
                    if (a.launch_date_unix > b.launch_date_unix) return 1;
                    if (a.launch_date_unix < b.launch_date_unix) return -1;
                    return 0;
                })
                .find((item) => {
                    const date = moment(item.launch_date_utc);
                    return moment().diff(date, 'minutes') < 30;
                });
            });
};

dispatch('UPLINK');

setInterval(display, 200);
setInterval(getLaunch, 10000);
getLaunch();


