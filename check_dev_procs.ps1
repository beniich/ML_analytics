$procs = Get-CimInstance Win32_Process | Where-Object { $_.Name -match "node|python|py|java|docker" }
foreach ($p in $procs) {
    Write-Output "Name: $($p.Name), PID: $($p.ProcessId), CommandLine: $($p.CommandLine)"
}
