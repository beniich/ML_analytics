$procs = Get-Process rundll32 -ErrorAction SilentlyContinue
if ($procs) {
    Write-Output "Attempting to stop $($procs.Count) rundll32 processes..."
    $procs | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    $left = (Get-Process rundll32 -ErrorAction SilentlyContinue).Count
    Write-Output "Memory cleanup: $left processes remaining."
} else {
    Write-Output "No rundll32 processes found."
}
