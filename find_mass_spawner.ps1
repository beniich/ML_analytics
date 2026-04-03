$procs = Get-CimInstance Win32_Process
$spawners = $procs | Group-Object ParentProcessId | Select-Object Count, Name | Sort-Object Count -Descending | Select-Object -First 10
foreach ($s in $spawners) {
    $parent = Get-CimInstance Win32_Process -Filter "ProcessId = $($s.Name)" -ErrorAction SilentlyContinue
    if ($parent) {
        Write-Output "Parent PID: $($s.Name), Child Count: $($s.Count), Name: $($parent.Name), CommandLine: $($parent.CommandLine)"
    } else {
        Write-Output "Parent PID: $($s.Name), Child Count: $($s.Count), Name: [ALREADY EXITED]"
    }
}
