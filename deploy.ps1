param(
  [string]$Message = "Deploy website update"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if ((git branch --show-current) -ne "main") {
  throw "Chỉ deploy từ nhánh main."
}

npm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npx tsc --noEmit --incremental false
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git add --all
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "Không có thay đổi để deploy."
  exit 0
}

git commit -m $Message
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git push origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Đã push lên GitHub. Cloudflare đang tự động deploy: https://itstrung.dpdns.org"
