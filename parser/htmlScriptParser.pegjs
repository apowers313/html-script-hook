{
	var codeBlock = "";
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

		if (options.scriptCallback !== undefined) {
			return options.scriptCallback (codeBlock, loc);
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
	tag
	/ chars:ch+ { return chars.join("");}

tag =
	scriptBlock
	/ "<"
		{return "<";}

scriptBlock =
	openTag:localScriptTag code:scriptCode* closeTag:endScriptTag
		{	
			// console.log ("Doing script block");
			// xlat(location(), function (newCode) {
				var ret = openTag + xlat(location()) + closeTag;
				codeBlock = "";
				return ret;
			// });
		}

localScriptTag =
	tag:"<script"i attrs1:[^>]* /*!("src=") attrs2:[^>]* */ ">"
		{
			var ret = tag + attrs1.join("") /* + attrs2.join("") */ + ">";
			// console.log ("Local script tag:", ret);
			return ret;
		}

scriptCode =
	str:string
		{
			codeBlock = codeBlock + str;
		}
	/*/ block
	/ expression*/
	/ comment:comment
		{
			codeBlock = codeBlock + comment;
		}
	/ match:[^<]+
		{
			codeBlock = codeBlock + match.join("");
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

//TODO
/*block =
	"{" [^]] "}"*/
/* expression = */
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

endScriptTag =
	tag:("</script"i whitespace* ">")
		{
			return tag.join("");
		}

ch =
	foo:[^<]
		//{ console.log (foo)}

whitespace =
	[ \r\n\t]