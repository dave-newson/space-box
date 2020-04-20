# Rasbian OS Setup

This guide will get you through the basics of setting up Rasbian.

## OS Image

 - [Download Rasbian Lite](https://www.raspberrypi.org/downloads/raspbian/)
 - Use [Etcher](https://www.balena.io/etcher/) to write the image to the rpi SD Card.
 
## OS Customisation

 - Add `wpa_supplicant.conf`

```
 country=AU
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="YOUR_WIFI_SSID"
    psk="YOUR_WIFI_PASS"
}
```

 - Add empty `ssh` file, to enable SSH
 
## First boot - shell in

 - Plug the bugger in
 - From a remote machine, run `ssh pi@raspberrypi.local`
 - Password: `raspberry`

## First Boot - Customise

 - `sudo raspi-config`
 - Change the user login details
 - Change the hostname: Networking > Host name (eg. to `space-box`)
 - Enable I2C: Interfaces > I2C Enable
 - Enable SPI: Interfaces > SPI Enable
 - `sudo reboot`

## Second boot - GUI

 - SSH to `ssh pi@space-box` (new hostname) 

## You're ready!

Now you can continue with the Microdot or LED Matrix
