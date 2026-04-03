$p = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'" | Select-Object -First 1
Write-Output "CommandLine for rundll32:"
if ($p) {
    Write-Output $p.CommandLine
} else {
    Write-Output "No rundll32 found!"
}
