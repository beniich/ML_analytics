$procs = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'"
$groups = $procs | Group-Object ParentProcessId | Select-Object Count, Name | Sort-Object Count -Descending
Write-Output "Top Parent Process IDs for rundll32:"
foreach ($g in $groups) {
    if ($g.Name) {
        try {
            $parent = Get-CimInstance Win32_Process -Filter "ProcessId = $($g.Name)" -ErrorAction SilentlyContinue
            Write-Output "Parent PID: $($g.Name), Count: $($g.Count), Name: $($parent.Name), CommandLine: $($parent.CommandLine)"
        } catch {
            Write-Output "Parent PID: $($g.Name), Count: $($g.Count), Name: [DEAD]"
        }
    }
}
