netstat -ano | findstr 9005 > processes.txt

(Get-Content -Path .\processes.txt) | ForEach-Object { 
    $foundpid = ($_ -split '\s+')[-1];
    Write-Host "Attempting to kill process with PID: $foundpid...";
    taskkill /PID $foundpid /F /T 2>$null
}