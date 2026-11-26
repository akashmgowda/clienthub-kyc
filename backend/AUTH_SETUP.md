# Local authentication

Apply V2__create_app_users.sql in the clienthub database as its owner. Migrations are manual for now.

In PowerShell, with the existing DB environment variables configured:

```powershell
$key = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($key)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($key)
$env:DEMO_PASSWORD = Read-Host "Choose a demo password (at least 12 characters)"
$env:SPRING_PROFILES_ACTIVE = "local"
mvn spring-boot:run
```

The local profile creates analyst@example.com once, with a BCrypt hash. Subsequent runs do not change the existing password. Do not use real client information. Never commit secrets. Tokens expire in 15 minutes and a new signing key invalidates earlier tokens.

POST /api/auth/login accepts JSON email and password. GET /api/auth/me requires Authorization: Bearer <accessToken>. Other application routes remain denied. React integration, account management, rate limiting, token revocation and production provisioning are not implemented.
