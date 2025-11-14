package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

func sleep() {
	cmd := exec.Command("cmd", "/C", "shutdown", "/s", "/t", "0")
	cmd.Run()
}

func executePowershellExe(file_name string) {
	cmd := exec.Command(file_name)
	cmd.Run()
}

func main() {
	godotenv.Load()
	url := os.Getenv("WEBSOCKET_URL")

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	log.Printf("Connecting to %s...", url)
	c, _, _ := websocket.DefaultDialer.Dial(url, nil)
	log.Println("Connected successfully!")

	done := make(chan struct{})

	go func() {
		defer close(done)
		for {
			_, message, _ := c.ReadMessage()
			var op string
			json.Unmarshal(message, &op)

			fmt.Printf("[%s] Received: %s\n", time.Now().Format("15:04:05"), op)
			if op == "POWER" {
				sleep()
			} else if op == "VOLDOWN" {
				executePowershellExe("./VolumeDown.exe")
			} else if op == string("VOLUP") {
				executePowershellExe("./VolumeUp.exe")
			} else if op == "VOLDOWNTEN" {
				executePowershellExe("./VolumeDownTen.exe")
			} else if op == string("VOLUPTEN") {
				executePowershellExe("./VolumeUpTen.exe")
			} else {
				fmt.Println("Command not recognized.")
			}
		}
	}()

	select {
	case <-done:
		log.Println("Connection closed")
	case <-interrupt:
		log.Println("\nInterrupt received, closing connection...")
		c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))

		select {
		case <-done:
		case <-time.After(5 * time.Second):
		}
	}
}
