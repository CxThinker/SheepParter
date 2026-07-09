$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")

function Get-PythonCommand {
  $python = Get-Command python -ErrorAction SilentlyContinue
  if ($python) {
    & python --version *> $null
    if ($LASTEXITCODE -eq 0) {
      return @("python")
    }
  }

  $py = Get-Command py -ErrorAction SilentlyContinue
  if ($py) {
    & py -3.12 --version *> $null
    if ($LASTEXITCODE -eq 0) {
      return @("py", "-3.12")
    }
  }

  throw "Python 3.12 was not found. Install Python or make 'py -3.12' available."
}

$PythonCommand = @(Get-PythonCommand)
$PythonExecutable = $PythonCommand[0]
$PythonArguments = @()
if ($PythonCommand.Length -gt 1) {
  $PythonArguments = $PythonCommand[1..($PythonCommand.Length - 1)]
}

Write-Host "Checking backend Python syntax..."
Push-Location (Join-Path $Root "backend")
& $PythonExecutable @PythonArguments -m compileall src tests
Pop-Location

Write-Host "Checking frontend TypeScript when dependencies are installed..."
Push-Location (Join-Path $Root "frontend")
if (Test-Path "node_modules") {
  npm run typecheck
} else {
  Write-Host "frontend/node_modules not found; run 'cd frontend && npm install' before TypeScript checks."
}
Pop-Location

Write-Host "Done."
