/*
html -
plain HTML (no script): should be exact match
various newlines (\n, \r\n)
sudden EOF
extra newlines at end of file
all on one line
whitespaces at end of line
empty file

script -
start with script tag
end with script tag (with newline, without)
tag with src=, src = , src
tag with src= and </script>
other attributes in tag
simple tag, no attributes
local non-javascript
file ends without closing tag
open script and close script with nothing inbetween (or just whitespace)
multiple local script tags
case insensitve strings
just whitespaces of various flavors between script tags

api -
missing finalCallback
missing scriptCallback
no args
*/