Calls back a function with each <script> tag found in a HTML file. To leave the code exactly the same, simply callback with the same argument that was passed in.

Originally for Code Coverage with Istanbul.

Can also support other tools that would want to have access to or modify the <script> tag, including documentation generators, code analysis, style analysis, obfuscation, etc.

Options:
debug -- log messages
saveLineNo -- prepend whitespace before <script> to make sure the line number matches up with the html