$p = Get-Process rundll32 | Select-Object -First 1
if ($p.Parent) {
    Write-Output "Parent Name: $($p.Parent.Name), Parent PID: $($p.Parent.Id)"
} else {
    Write-Output "No parent process found (Orphaned?)"
}
