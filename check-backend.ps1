for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri 'http://localhost:3000/auth/signin' -Method POST -ContentType 'application/json' -Body '{"username":"test","password":"password"}' -ErrorAction Stop
        $code = $r.StatusCode
        Write-Host ('Attempt {0}: {1}' -f ($i+1), $code)
        if ($code -eq 200) { break }
    } catch {
        Write-Host ('Attempt {0}: failed' -f ($i+1))
    }
}
