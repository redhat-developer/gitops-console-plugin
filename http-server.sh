#!/usr/bin/env bash

set -u

PUBLIC_PATH="$1"
shift
SERVER_OPTS="$@"

KEY="${SEGMENT_KEY:=}"

# replace %SEGMENT_KEY_PLACEHOLDER% with real key
pattern="s/%SEGMENT_KEY_PLACEHOLDER%/$KEY/g"
sed -i $pattern ./dist/*.min.js

echo Using segment key: $KEY

./node_modules/.bin/http-server $PUBLIC_PATH -p 9001 -c-1 --cors $SERVER_OPTS
