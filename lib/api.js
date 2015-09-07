var PEG = require("pegjs");
var fs = require("fs");
var parserFile = __dirname + "/../parser/htmlScriptParser.pegjs";
var swpeg = fs.readFileSync(parserFile, {encoding: "utf8"});
var parser = PEG.buildParser(swpeg);


module.exports = htmlParser;

function htmlParser (html, scriptCallback, finalCallback) {
	var options = {
		scriptCallback: scriptCallback,
	};
	var ret = parser.parse (html, options);

	console.log ("Returned: " + ret);

	if (finalCallback !== undefined) {
		finalCallback (ret);
	}

	return ret;
}