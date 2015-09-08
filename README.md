# html-script-hook
[![Build Status](https://travis-ci.org/apowers313/html-script-hook.svg?branch=master)](https://travis-ci.org/apowers313/html-script-hook)

## About
Calls a callback function with the code for each `<script>` tag found in a HTML file. Whatever the callback returns becomes the new code in the `<script>` section. To leave the code exactly the same, simply callback with the same argument that was passed in.

Originally this was created to help [Istanbul](https://gotwarlost.github.io/istanbul/) instrument JavaScript in a HTML file so that it can be recognized for code coverage. But it can also support other tools that would want to have access to or modify the `<script>` tag. For example: [documentation generators](http://usejsdoc.org/), [code analysis tools](https://codeclimate.com), [style analysis](https://github.com/feross/standard), [linters](http://jshint.com/about/), [obfuscation](https://javascriptobfuscator.com/), etc.

## Install

	npm install html-script-hook

## Usage

Start with a HTML file:

``` html
<!-- test.html -->
<!DOCTYPE html>
<html>
	<title>Just a test file</title>
	<script>
	console.log ("This is a test");
	</script>
</html>
<body>
This is a test.
</body>
```

Run the parser on `test.html`:

``` javascript
var fs = require("fs");
var testParser = require("html-script-hook");

var html = fs.readFileSync("test.html", {
    encoding: "utf8"
});

// the `ret` variable will contain the new HTML
var ret = testParser(testhtml, {
	// tell the parser to call the gotScript() function for each <script> section
    scriptCallback: gotScript
});

// callback receives code from <script> section and replaces it with return value
function gotScript(code) {
	// prints: "\nconsole.log (\"this is a test.\\n\");\n"
	// which is the line from between the script tags in the HTML
	console.log (code);

	// replace the current code with a single comment
    return "// no more console log";
}
```

End up with a modified `<script>` section:

``` html
<!-- test.html -->
<!DOCTYPE html>
<html>
	<title>Just a test file</title>
	<script>// no more console log</script>
</html>
<body>
This is a test.
</body>
```

## Usage With Istanbul

As a bit more of a real world example, here's how to instrument a HTML file for Istanbul code coverage:

``` javascript
var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();
var scriptHook = require('html-script-hook');
var fs = require("fs");

html = fs.readFileSync(htmlFilePath, 'utf8');

html = scriptHook (html, {scriptCallback: gotScript});

function gotScript(code, loc) {
	return instrumenter.instrumentSync(code, htmlFilePath);
}
```

For the complete example, see the [example code](https://github.com/thedeeno/web-component-tester-istanbul/pull/14) from [web-component-tester-istanbul](https://github.com/thedeeno/web-component-tester-istanbul), which instruments the files on the server as the files are being requested by the browser.

## Options

The parser that is returned by `require('html-script-hook')` takes the following arguments:
* `parser (html, options)`
	* `html`[required] : the string containing the HTML file
	* `options` [optional] : an object with the configuration options for the parser. Those options include the following properties:
		* `scriptCallback (code, details)` [function, default=undefined] : if defined, this function will be called with the code from inside each `<script>` section. It takes the form of `scriptCallback (code, details)` and the return value from `scriptCallback` replaces the code for the `<script>` section. Assuming `padLineNo` is not set, simply return the `code` argument to leave the code unchanged. The `details` argument is experimental, and contains an object describing the location of the code, an object describing start location of the `<script>` tag, an object describing start location of the `</script>` tag, and a `unexpectedEof` flag that indicates that the `scriptCallback` was called even though a final `</script>` tag wasn't found.
		* `padLineNo` [boolean, default=true] : whether the JavaScript passed to the script callback should start with a number of newlines ("\n") so that it matches the line numbers of the code in the HTML file. Useful for making sure that tools that pick up line numbers use the same line numbers.
		* `htmlCallback (html)` [function, default=undefined] : if defined, this function will be called with a single argument that is the final HTML with any modified JavaScript. It is the exact same as the return value from `parser` and rather silly, since the `parser` is synchronous.

The `parser` returns the HTML that was modified by `scriptCallback`.

## Tests

	npm test

