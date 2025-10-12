Write-Host "Importing cinema database..."

# Define variables
$containerName = "cinema_app_mysql"
$sqlFilePath = ".\demo\src\main\resources\database_export.sql"
$remotePath = "/tmp/database_export.sql"
$dbUser = "user"
$dbPassword = "userpassword"
$dbName = "cinemadb"

# Check if file exists
if (-Not (Test-Path $sqlFilePath)) {
    Write-Host "SQL file not found at: $sqlFilePath"
    exit 1
}

# Copy file into container
Write-Host "Copying SQL file into Docker container..."
docker cp $sqlFilePath "${containerName}:${remotePath}"

# Import database
Write-Host "Importing data into MySQL..."
Get-Content $sqlFilePath | docker exec -i $containerName mysql -u $dbUser -p$dbPassword $dbName

# Done
Write-Host "Database import complete. Your cinema data has been loaded."
