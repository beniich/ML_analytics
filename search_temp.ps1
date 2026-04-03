$paths = @($env:TEMP, "C:\Windows\Temp")
foreach ($p in $paths) {
    Write-Output "--- PATH: $p ---"
    Get-ChildItem -Path $p -File | Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-24) } | Sort-Object LastWriteTime -Descending | Select-Object Name, LastWriteTime, Length -First 20
}
