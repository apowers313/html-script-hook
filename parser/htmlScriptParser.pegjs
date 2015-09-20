{
	var codeBlock = "";
	var codeLocation, startLocation, endLocation;
	var unexpectedEof = false;

	function xlat (loc)
	{
		if (codeBlock.trim() == "") {
			// console.log ("Script is empty, skipping translation...");
			return codeBlock;
		}

		if (options.padLineNo != false) {
			var prepend = "";
			for (var i = 0; i < (loc.start.line - 1); i++) {
				prepend = prepend + "\n";
			}
			codeBlock = prepend + codeBlock;
		}
		//console.log ("Doing callback with:\n========\n" + codeBlock + "\n========\n");

		var details = {
			location: codeLocation,
			startLocation: startLocation,
			endLocation: endLocation,
			unexpectedEof: unexpectedEof
		}

		if (options.scriptCallback !== undefined) {
			return options.scriptCallback (codeBlock, details);
		} else {
			return codeBlock;
		}
	}
}

start =
	html:html*
		{ 
			return html.join(""); 
		}

html =
	scriptBlock
	/ chars:ch+ { return chars.join("");}

scriptBlock =
	openTag:localScriptTag code:scriptCode closeTag:endScriptTag
		{	
			var ret = openTag + xlat(location()) + closeTag;
			codeBlock = "";
			return ret;
		}

localScriptTag =
	tag:"<script"i attrs1:[^>]* /*!("src=") attrs2:[^>]* */ ">"
		{
			startLocation = location();
			var ret = tag + attrs1.join("") /* + attrs2.join("") */ + ">";
			// console.log ("Local script tag:", ret);
			return ret;
		}

scriptCode =
	scriptParts*
		{
			codeLocation = location();
		}

scriptParts = 
	str:string
		{
			codeBlock = codeBlock + str;
		}
	/ comment:comment
		{
			codeBlock = codeBlock + comment;
		}
	// XXX: if we get something like "<script></script" this is all going to fall apart...
	/ !"</script"i match:.
		{
			codeBlock = codeBlock + match;
		}

endScriptTag =
	tag:("</script"i whitespace* ">")
		{
			endLocation = location();
			return tag.join("");
		}
	/ EOF

EOF =
	!.
		{
			unexpectedEof = true;
		}

notClosingScript =
	ch:.
		{
			return ch.join("")
		}

string =
	singleQuoteString
	/ doubleQuoteString

singleQuoteString =
	"'" str:notSingleEndQuote* "'"
		{
			return "'" + str.join("") + "'";
		}

doubleQuoteString =
	"\"" str:notDoubleEndQuote* "\""
		{
			return "\"" + str.join("") + "\"";
		}

notSingleEndQuote =
	"\\'"
	/ [^']

notDoubleEndQuote =
	'\\"'
	/ [^"]

comment =
	blockComment
	/ lineComment

blockComment =
	"/*" comment:notEndBlock* "*/"
		{
			return "/*" + comment.join("") + "*/"
		}

notEndBlock =
	!("*/") ch:.
		{
			return ch;
		}

lineComment =
	"//" str:[^\n]* "\n"
		{
			return "//" + str.join("") + "\n";
		}

ch =
	// XXX: what if we get "<script" without the closing angle bracket?
	!("<script"i) ch:.
		{
			return ch;
		//{ console.log (foo)}
		}

whitespace =
	[ \r\n\t]