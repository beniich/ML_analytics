$procs = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'"
$parents = $procs | Group-Object ParentProcessId | Select-Object Count, Name | Sort-Object Count -Descending
foreach ($p in $parents) {
    $parentObj = Get-CimInstance Win32_Process -Filter "ProcessId = $($p.Name)" -ErrorAction SilentlyContinue
    if ($parentObj) {
        Write-Output "Parent: $($parentObj.Name) (PID: $($p.Name)) Spawned: $($p.Count) instances - CommandLine: $($parentObj.CommandLine)"
    } else {
        Write-Output "Parent PID: $($p.Name) Spawned: $($p.Count) instances - [Parent process already exited]"
    }
}
