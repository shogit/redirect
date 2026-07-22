#!/bin/bash
url="$1"
path="${url#openfinder://}"
path=$(python3 -c "import urllib.parse,sys; print(urllib.parse.unquote(sys.argv[1]))" "$path")
[[ "$path" != /* ]] && path="/$path"
open -R "$path" 2>/dev/null || open "$path"
