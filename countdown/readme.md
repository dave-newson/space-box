## Install

Run: `sudo apt-get install node npm -y`

Install: `npm i`

Test: `node index.js`

Quit at any time with Ctrl-C

## Daemon-ising the Countdown

Run `sudo nano /lib/systemd/system/countdown.service`

```
[Unit]
Description=SpaceX Countdown
After=network-online.target

[Service]
ExecStart=/usr/bin/node /home/pi/countdown/index.js
User=pi

[Install]
WantedBy=multi-user.target
```

Run `sudo systemctl daemon-reload`

Run `sudo systemctl enable countdown.service`

Start the service NOW with `sudo systemctl start countdown.service`
