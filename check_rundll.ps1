$procs = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'"
$results = foreach ($p in $procs) {
    [PSCustomObject]@{
        Name = $p.Name
        CommandLine = $p.CommandLine
        WorkingSetMB = [math]::Round($p.WorkingSetSize / 1MB, 2)
    }
}
$results | Sort-Object WorkingSetMB -Descending | Format-Table -AutoSize
