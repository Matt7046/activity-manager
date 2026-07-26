#!/bin/sh
set -e
echo '=== unique colorsdev URLs in .next ==='
grep -Roh 'https://activity-manager\.colorsdev\.tech[^"[:space:]]*' /app/.next 2>/dev/null | sort -u | head -n 40 || true
echo '=== baseURL snippets ==='
grep -Roh 'baseURL[^,]\{0,120\}' /app/.next/static 2>/dev/null | head -n 40 || true
echo '=== /api occurrences near axios ==='
grep -Roh 'https://activity-manager\.colorsdev\.tech/api' /app/.next 2>/dev/null | wc -l || true
echo '=== empty string after SERVICE ==='
grep -R 'activity-manager.colorsdev.tech/api' /app/.next/static >/dev/null 2>&1 && echo 'HAS_API_BASE=yes' || echo 'HAS_API_BASE=no'
