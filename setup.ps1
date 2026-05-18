Write-Host "Installing dependencies..."
pip install pre-commit
pre-commit install
pre-commit install --hook-type pre-push --config .pre-push-config.yaml
Write-Host "Done! Hooks are active."
