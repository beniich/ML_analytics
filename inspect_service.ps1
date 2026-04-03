$svc = Get-CimInstance Win32_Service -Filter "Name = 'WSAIFabricSvc'"
if ($svc) {
    Write-Output "Service Path: $($svc.PathName)"
    Write-Output "User: $($svc.StartName)"
} else {
    Write-Output "Service not found."
}
