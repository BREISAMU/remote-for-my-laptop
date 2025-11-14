$wshShell = New-Object -ComObject WScript.Shell
for ($i = 1; $i -le 5; $i++) {
    $wshShell.SendKeys([char]175)
}