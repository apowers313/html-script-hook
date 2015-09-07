var PEG = require("pegjs");
var fs = require("fs");
var parserFile = __dirname + "/../parser/htmlScriptParser.pegjs";
var swpeg = fs.readFileSync(parserFile, {encoding: "utf8"});
var parser = PEG.buildParser(swpeg);


module.exports = htmlParser;

function htmlParser (html, options) {
	if (html === undefined) {
		return;
	}

	if (options === undefined) {
		options = {};
	}

	var ret = parser.parse (html, options);

	// console.log ("Returned: " + ret);

	if (options.htmlCallback !== undefined) {
		options.htmlCallback (ret);
	}

	return ret;
}