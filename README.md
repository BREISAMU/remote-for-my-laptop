I made this because I got sick of getting out to bed to turn off my computer or adjust the volume while watching Netflix.

This is a small self-hosted application to shut down my computer (DELL XPS) and turn the volume up/down from my phone. It includes a frontend / websocket server that I run through [ngrok](https://ngrok.com/) and a Go service that runs locally. When volume and power buttons are clicked on the frontend, a websocket message is sent to the Go service, which executes some powershell commands. Because of this, the primary bottleneck in this program is powershell command execution via Go. It is a fairly slow process that can be sped up by pre-compiling the Powershell files into .exe. To do this I used [ps2exe](https://www.powershellgallery.com/packages/ps2exe/1.0.13).

This is just for my own computer, but if anyone gets it going on a different device let me know!
