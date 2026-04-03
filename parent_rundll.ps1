$procs = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'" | Select-Object -First 10
$results = foreach ($p in $procs) {
    if ($p.ParentProcessId) {
        $parent = Get-CimInstance Win32_Process -Filter "ProcessId = $($p.ParentProcessId)"
        [PSCustomObject]@{
            Id = $p.ProcessId
            ParentId = $p.ParentProcessId
            ParentName = $parent.Name
            CommandLine = $p.CommandLine
        }
    }
}
$results | Format-Table -AutoSize
