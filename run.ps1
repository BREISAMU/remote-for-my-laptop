cd .\server

./ProcessCleanup.ps1

Start-Process -FilePath "node" -ArgumentList "main.js" -NoNewWindow
Start-Process -FilePath "ngrok" -ArgumentList "http 9005" -NoNewWindow

cd ../listener

Write-Host "Waiting to initialize go service.."
Start-Sleep -Seconds 5

Start-Process -FilePath "go" -ArgumentList "run main.go" -NoNewWindow