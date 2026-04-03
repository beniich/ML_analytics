# Try to get more info on a few rundll32 processes
$procs = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'" | Select-Object -First 20
$results = foreach ($p in $procs) {
    try {
        $parent = Get-CimInstance Win32_Process -Filter "ProcessId = $($p.ParentProcessId)" -ErrorAction SilentlyContinue
        [PSCustomObject]@{
            Id = $p.ProcessId
            ParentId = $p.ParentProcessId
            ParentName = if ($parent) { $parent.Name } else { "N/A (Dead?)" }
            CommandLine = $p.CommandLine
            CreationDate = $p.CreationDate
            ExecutablePath = $p.ExecutablePath
        }
    } catch {
        # ignore errors
    }
}
$results | Format-Table -AutoSize
