#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.dotnet:$PATH"

dotnet restore backend/backend.csproj
dotnet run --project backend/backend.csproj --urls http://localhost:5080
