$procs = Get-CimInstance Win32_Process -Filter "Name = 'rundll32.exe'" | Select-Object -First 10
foreach ($p in $procs) {
    try {
        $owner = Invoke-CimMethod -InputObject $p -MethodName GetOwner
        Write-Output "PID: $($p.ProcessId), Owner: $($owner.User), Domain: $($owner.Domain)"
    } catch {
        Write-Output "PID: $($p.ProcessId), Owner: UNKNOWN"
    }
}
