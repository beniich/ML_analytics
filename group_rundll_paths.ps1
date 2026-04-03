$procs = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'"
$procs | Group-Object ExecutablePath | Select-Object Count, Name | Sort-Object Count -Descending
