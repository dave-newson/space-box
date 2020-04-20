# Microdot pHat

Installation instructions: https://learn.pimoroni.com/tutorial/sandyj/getting-started-with-micro-dot-phat

## Test MicroDot pHat

Run `python`

Enter:

```
from microdotphat import fill, clear, show, WIDTH, HEIGHT
fill(1)
show()
```

All the microdot LEDs should illuminate!

## MicroDot pHat Adapter Script

Copy `microdot-udp.py` to your home directory (`/home/pi`)

## Test MicroDot Adapter

Run `python ~/microdot-udp.py &`

Test by sending a UDP packet with "HelloWorld":

`printf 'HelloWorld' | nc space-box 12344 -u -w 1`

Kill the python script with Control-C

## Daemon-ising the MicroDot pHat

Run `sudo nano /lib/systemd/system/microdot.service`

```
[Unit]
Description=MicroDot pHat Display
After=network-online.target

[Service]
ExecStart=/usr/bin/python /home/pi/microdot-udp.py
User=pi

[Install]
WantedBy=multi-user.target
```

Run `sudo systemctl daemon-reload`

Run `sudo systemctl enable microdot.service`

The service should come online automatically each time the rpi is rebooted.

Start the service NOW with `sudo systemctl start microdot.service`

