# Grouped process RAM
Write-Output "--- GROUPED PROCESS RAM (MB) ---"
Get-Process | Group-Object Name | Select-Object Name, @{Name='Total_RAM_MB'; Expression={([math]::Round(($_.Group | Measure-Object WorkingSet64 -Sum).Sum / 1MB, 2))}} | Sort-Object Total_RAM_MB -Descending | Select-Object -First 20 | Format-Table -AutoSize

# Overall System Stats
$os = Get-CimInstance Win32_OperatingSystem
$total = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
$free = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
$used = $total - $free
Write-Output "--- SUMMARY ---"
Write-Output "Physical Total: $total GB"
Write-Output "Physical Free:  $free GB"
Write-Output "Usage:          $([math]::Round(($used/$total)*100, 2))%"

# Kernel & Commit stats
$perf = Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory
Write-Output "`n--- KERNEL MEMORY ---"
Write-Output "Pool Non-Paged: $([math]::Round($perf.PoolNonpagedBytes / 1MB, 2)) MB"
Write-Output "Pool Paged:     $([math]::Round($perf.PoolPagedBytes / 1MB, 2)) MB"
Write-Output "Commit Charge:  $([math]::Round($perf.CommittedBytes / 1MB, 2)) / $([math]::Round($perf.CommitLimit / 1MB, 2)) MB"

# Diagnostic check for common hogs
Write-Output "`n--- DIAGNOSTIC ---"
if ($perf.PoolNonpagedBytes -gt 800MB) { Write-Output "[!] High Non-Paged Pool detected. Possible driver leak." }
if ($used -gt ($total * 0.8)) { Write-Output "[!] High RAM usage detected (>80%). Windows may start swapping." }
