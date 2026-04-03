Get-Process | Where-Object { $_.Name -match "powershell|cmd|cscript|wscript|python|git-bash|rundll32" } | Group-Object Name | Select-Object Name, Count | Sort-Object Count -Descending
Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'" | Select-Object -First 5 CommandLine, CreationDate, ParentProcessId
