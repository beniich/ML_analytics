$p = Get-Process rundll32 -IncludeUserName -ErrorAction SilentlyContinue | Select-Object -First 1
if ($p) {
    Write-Output "User: $($p.UserName)"
} else {
    Write-Output "No rundll32 found!"
}
