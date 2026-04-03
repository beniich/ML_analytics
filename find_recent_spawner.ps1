$now = Get-Date
$recent = Get-Process | Where-Object { $now - $_.StartTime -lt (New-TimeSpan -Minutes 10) }
$recent | Group-Object Name | Select-Object Count, Name | Sort-Object Count -Descending
