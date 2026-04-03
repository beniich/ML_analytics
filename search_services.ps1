$services = Get-Service | Where-Object { $_.Status -eq 'Running' } | Select-Object Name, DisplayName, Status
$suspicious = $services | Where-Object { $_.DisplayName -notmatch "Microsoft|Windows|Intel|Dell|Realtek|NVIDIA|Service|Driver|Host" }
$suspicious | Format-Table -AutoSize
