#!/usr/bin/env bash
# Seed leaderboard data via internal user-module endpoints
# Run AFTER merging to main and deploying the internal endpoints
# Usage: bash scripts/seed-leaderboard.sh

BASE="https://4.165.174.62.nip.io/api/users/internal"

echo "Setting points and streaks for test users..."

# Maria - top user
curl -sk -X PATCH "$BASE/01526843-6090-43fb-9a46-71c4e1e86c6a/points?points=2450" && echo ""
curl -sk -X PATCH "$BASE/01526843-6090-43fb-9a46-71c4e1e86c6a/streak?streak=12" && echo ""

# Georgi
curl -sk -X PATCH "$BASE/e11e8f95-7dd0-406d-adde-e7c5d4e85591/points?points=1820" && echo ""
curl -sk -X PATCH "$BASE/e11e8f95-7dd0-406d-adde-e7c5d4e85591/streak?streak=7" && echo ""

# Elena
curl -sk -X PATCH "$BASE/1163f268-1250-433d-9f3f-bafbd63b37b4/points?points=1340" && echo ""
curl -sk -X PATCH "$BASE/1163f268-1250-433d-9f3f-bafbd63b37b4/streak?streak=5" && echo ""

# Ivan
curl -sk -X PATCH "$BASE/0f9ee133-b777-44c6-9c36-54a6ff3bdea9/points?points=890" && echo ""
curl -sk -X PATCH "$BASE/0f9ee133-b777-44c6-9c36-54a6ff3bdea9/streak?streak=3" && echo ""

# Sofia
curl -sk -X PATCH "$BASE/bed13d9e-eaa5-4c8a-9e54-0ce26f692f2c/points?points=670" && echo ""
curl -sk -X PATCH "$BASE/bed13d9e-eaa5-4c8a-9e54-0ce26f692f2c/streak?streak=4" && echo ""

# Alex (existing user)
curl -sk -X PATCH "$BASE/65cda1be-42b4-486f-a39a-60122df5e997/points?points=520" && echo ""
curl -sk -X PATCH "$BASE/65cda1be-42b4-486f-a39a-60122df5e997/streak?streak=2" && echo ""

# yoshiboshi (existing user)
curl -sk -X PATCH "$BASE/6809dc89-4ed1-463c-8206-f35d18b15348/points?points=380" && echo ""
curl -sk -X PATCH "$BASE/6809dc89-4ed1-463c-8206-f35d18b15348/streak?streak=1" && echo ""

# toncho (existing user)
curl -sk -X PATCH "$BASE/4b21f81b-3f3c-4a22-a2ec-a4c6df6aff65/points?points=210" && echo ""

# iskren (existing user)
curl -sk -X PATCH "$BASE/3915195a-30f3-45be-8c46-eeefe1196b98/points?points=150" && echo ""

echo "Done! Check the leaderboard at https://4.165.174.62.nip.io"
