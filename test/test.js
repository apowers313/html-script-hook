assert = require("chai").assert;
sinon = require("sinon");
fs = require("fs");
testParser = require("../index");

var simpleHtml = fs.readFileSync(__dirname + "/testHtml/simpleHtml.html", {
    encoding: "utf8"
});
var simpleScript = fs.readFileSync(__dirname + "/testHtml/simpleScript.html", {
    encoding: "utf8"
});
var simplePolymer = fs.readFileSync(__dirname + "/testHtml/simplePolymer.html", {
    encoding: "utf8"
});
var complexPolymer = fs.readFileSync(__dirname + "/testHtml/complexPolymer.html", {
    encoding: "utf8"
});
var realWebsite = fs.readFileSync(__dirname + "/testHtml/realWebsite.html", {
    encoding: "utf8"
});
var extremeHtml = fs.readFileSync(__dirname + "/testHtml/extremeHtml.html", {
    encoding: "utf8"
});

suite("Parser conditions :: ", function () {
    test("Empty HTML should not throw", function () {
        function gotScript(code) {
            return code;
        }

        assert.doesNotThrow(testParser, Error, "Empty HTML should not throw error");
        testParser("", {
            scriptCallback: gotScript
        });
    });

    test("Just angle bracket (<)", function () {
        function gotScript(code) {
            return code;
        }

        assert.doesNotThrow(testParser, Error, "Empty HTML should not throw error");
        testParser("<", {
            scriptCallback: gotScript
        });
    });

    test("Extra whitespace after HTML should not throw", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>\n\n\n\n";

        function gotScript(code) {
            return code;
        }

        assert.doesNotThrow(testParser, Error, "Empty HTML should not throw error");
        testParser(testhtml, {
            scriptCallback: gotScript
        });
    });

    test("No whitespace after HTML should not throw", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }

        assert.doesNotThrow(testParser, Error, "Empty HTML should not throw error");
        testParser(testhtml, {
            scriptCallback: gotScript
        });
    });

    test("Missing script tag should not throw", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n";
        // missing </script>
        function gotScript(code, details) {
            assert.isTrue(details.unexpectedEof, "Should have unexpected EOF flag set");
            return code;
        }
        var callback = sinon.spy(gotScript);

        // var regex = /but\ end\ of\ input\ found\.$/
        // var regex = /./g;
        // assert.throws(testParser, 'SyntaxError: Expected "\'", "/*", "//", "</script", "\\"" or [^<] but end of input found.');
        // assert.throws(testParser, regex, "Missing end script should not throw error");

        // try {
        testParser(testhtml, {
            scriptCallback: callback
        });
        // } catch (e) {
        // 	console.log ("Caught:", e);
        // }

        assert.isTrue(callback.calledOnce, "Should not call scriptCallback with broken <script>");
    });

    test("Missing closing block comment");
    test("EOF on single line comment");
    test("Missing closing double quote");
    test("Missing closing single quote");
});

suite("Script variants :: ", function () {
    test("Empty script tags", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script></script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with broken <script>");
    });

    test("Just one space between script tags", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script> </script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Just mixed whitespace between script tags", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n\t  \r\n  \t \n  </script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Script with src=", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script src=\"./test.js\"></script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Script with src = ", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script src = \"./test.js\"></script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Script with src", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script src=></script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Script with no attributes and whitespace: <script  >", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script   ></script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Script with no attributes and newline in tag: <script\\n>", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script   \n></script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Closing script tag with space: </script >", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script></script   >\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback with empty <script>");
    });

    test("Empty script with all attributes", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script async src=\"./test.js\" type=\"text/x-csrc\" defer></script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not call scriptCallback");
    });

    test("Non-empty script with all attributes", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script async src=\"./test.js\" type=\"text/x-csrc\" defer>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Right line number for script tags", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<script src=\"test.js\"></script>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code, details) {
            assert.isObject(details, "Should get location object in callback");
            assert.deepProperty(details, "location.start.line", "Location should have property 'start.line'");
            assert.strictEqual(details.location.start.line, 7, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Right padding for script callback", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<script src=\"test.js\"></script>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            var paddingCount = code.split("<")[0].match(/\n/g).length;
            // is one more than the <script> location above because of the script tag
            assert.strictEqual(paddingCount, 8, "Should have 8 newlines before code");
            // a little hacky...
            return "\n" + code.trimLeft();
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Right padding for script callback when code is on the same line", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<script src=\"test.js\"></script>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            var paddingCount = code.split("<")[0].match(/\n/g).length;
            // is one more than the <script> location above because of the script tag
            assert.strictEqual(paddingCount, 7, "Should have 7 newlines before code");
            return code.trimLeft();
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script on one line with no trailing whitespace", function () {
        var testhtml = "<script>console.log (\"this is a test.\\n\");</script>";

        function gotScript(code) {
            assert.strictEqual(code, "console.log (\"this is a test.\\n\");", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script on same line as opening tag", function () {
        var testhtml = "<script>console.log (\"this is a test.\\n\");\n" +
            "</script>";

        function gotScript(code) {
            assert.strictEqual(code, "console.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script on same line as closing tag", function () {
        var testhtml = "<script>\n" +
            "console.log (\"this is a test.\\n\");</script>";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Single line HTML", function () {
        var testhtml = "<html><title>This is a test</title><body><script>console.log (\"this is a test.\\n\");</script></body>";

        function gotScript(code) {
            assert.strictEqual(code, "console.log (\"this is a test.\\n\");", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Single line HTML with multiple script tags", function () {
        var testhtml = "<html><script>console.log (\"this is a test.\\n\");</script><title>This is a test</title><body><script>console.log (\"this is a test.\\n\");</script></body>";

        function gotScript(code) {
            assert.strictEqual(code, "console.log (\"this is a test.\\n\");", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledTwice, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("End on <script> without whitespace", function () {
        var testhtml = "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("End on <script> with whitespace", function () {
        var testhtml = "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>  ";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("End on <script> with newline", function () {
        var testhtml = "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n\n";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Start with script tag", function () {
        var testhtml = "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Two script tags", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<script src=\"test.js\"></script>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Two script tags, two callbacks", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<script>\n" +
            "console.log (\"loading\");\n" +
            "</script>" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledTwice, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Five script tags, five callbacks", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<script>\n" +
            "console.log (\"1\");\n" +
            "</script>" +
            "<script>\n" +
            "console.log (\"2\");\n" +
            "</script>" +
            "<body>\n" +
            "<script>\n" +
            "console.log (\"3\");\n" +
            "</script>" +
            "This is a test\n" +
            "<script>\n" +
            "console.log (\"4\");\n" +
            "</script>" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"5\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.strictEqual(callback.callCount, 5, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Case insensitive script tags", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<ScRiPt>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</SCRIPT>\n" +
            "</html>";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty Script should not throw error");
        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script tag in double quote string", function () {
        var testhtml = "<script>\"</script>\"</script>";

        function gotScript(code) {
            assert.strictEqual(code, "\"</script>\"", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script tag in single quote string", function () {
        var testhtml = "<script>'</script>'</script>";

        function gotScript(code) {
            assert.strictEqual(code, "'</script>'", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script tag in double quote string with escaped double quote", function () {
        var testhtml = "<script>\"</script>\\\"This is a test\\\"\"</script>";

        function gotScript(code) {
            assert.strictEqual(code, "\"</script>\\\"This is a test\\\"\"", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script tag in double quote string with escaped double quote", function () {
        var testhtml = "<script>'</script>Adam\\'s Test'</script>";

        function gotScript(code) {
            assert.strictEqual(code, "'</script>Adam\\'s Test'", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script tag in block comment", function () {
        var testhtml = "<script>/*</script>*/</script>";

        function gotScript(code) {
            assert.strictEqual(code, "/*</script>*/", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Empty block comment", function () {
        var testhtml = "<script>/**/</script>";

        function gotScript(code) {
            assert.strictEqual(code, "/**/", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script tag in line comment", function () {
        var testhtml = "<script>//</script>\n</script>";

        function gotScript(code) {
            assert.strictEqual(code, "//</script>\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Empty line comment", function () {
        var testhtml = "<script>//\n</script>";

        function gotScript(code) {
            assert.strictEqual(code, "//\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Angle bracket (<) in code", function () {
        var testhtml = "<script>a = !b < c * d / e > f</script>";

        function gotScript(code) {
            assert.strictEqual(code, "a = !b < c * d / e > f", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });

        assert.isTrue(callback.calledOnce, "Should call scriptCallback");
        assert.strictEqual(ret, testhtml, "Should get original HTML");
    });

    test("Script tag in HTML comment");
    test("Script tag in CDATA block");
});

suite("API tests :: ", function () {
    test("Missing html and options", function () {
        assert.doesNotThrow(testParser, Error, "Empty argument should not throw error");
        var ret = testParser();
        assert.strictEqual(ret, undefined, "No arguments should return undefined");
    });

    test("Empty options object", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        assert.doesNotThrow(testParser, Error, "Empty argument should not throw error");
        var ret = testParser(testhtml, {});
    });

    test("Should not receive scriptCallback if no <script>", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "</html>";

        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty argument should not throw error");
        var ret = testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isFalse(callback.called, "Should not have received callback");
    });

    test("Should receive scriptCallback if <script>", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code, details) {
            assert.isFalse(details.unexpectedEof, "Should not have unexpected EOF flag set");
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.isTrue(callback.calledOnce, "Should have received callback");
    });

    test("Should modify <script>", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";
        var rethtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>" +
            "TEST" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            return "TEST";
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty argument should not throw error");
        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.isTrue(callback.calledOnce, "Should have received callback");
        assert.strictEqual(ret, rethtml, "Returned HTML should match");
    });

    test("Callback should have correct location", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code, details) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            assert.isObject(details, "Script callback should receive object for location");
            assert.deepEqual(details.location, {
                start: {
                    offset: 65,
                    line: 6,
                    column: 9
                },
                end: {
                    offset: 101,
                    line: 8,
                    column: 1
                }
            }, "Should get right location");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.isTrue(callback.calledOnce, "Should have received callback");
    });

    test("Should have padding", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            assert.strictEqual(code, "\n\n\n\n\n\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
        });
        assert.isTrue(callback.calledOnce, "Should have received callback");
    });

    test("Shouldn't have padding", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotScript(code) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            return code;
        }
        var callback = sinon.spy(gotScript);

        var ret = testParser(testhtml, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.isTrue(callback.calledOnce, "Should have received callback");
    });

    test("Should recieve HTML callback", function () {
        var testhtml = "<html>\n" +
            "<title>Test</title>\n" +
            "<body>\n" +
            "This is a test\n" +
            "</body>\n" +
            "<script>\n" +
            "console.log (\"this is a test.\\n\");\n" +
            "</script>\n" +
            "</html>";

        function gotHtml(code) {
            assert.strictEqual(code, testhtml, "Should receive HTML callback");
            return code;
        }
        var callback = sinon.spy(gotHtml);

        testParser(testhtml, {
            htmlCallback: callback,
            padLineNo: false
        });
        assert.isTrue(callback.calledOnce, "Should have received callback");
    });
});

suite ("Locations of Script Tags and Code :: ", function () {
    test("Script on first line", function () {
        var testhtml =
            "<script>\n" +
            "console.log('testing');\n" +
            "</script>\n";

        function gotScript(code, loc) {
            assert.isObject (loc, "Should receive location object");

            assert.strictEqual (loc.startLocation.start.line, 1, "First script tag starts on line 1");
            assert.strictEqual (loc.startLocation.start.column, 1, "First script tag starts on column 1");
            assert.strictEqual (loc.startLocation.start.offset, 0, "First script tag starts at byte offset 0");
            assert.strictEqual (loc.startLocation.end.line, 1, "First script tag ends on line 1");
            assert.strictEqual (loc.startLocation.end.column, 9, "First script tag ends on column 9");
            assert.strictEqual (loc.startLocation.end.offset, 8, "First script tag ends at byte offset 8");

            assert.strictEqual (loc.location.start.line, 1, "Code location starts with the newline following the script tag");
            assert.strictEqual (loc.location.start.column, 9, "Code location starts on column 10");
            assert.strictEqual (loc.location.start.offset, 8, "Code location starts at byte offset 9");
            assert.strictEqual (loc.location.end.line, 3, "Code ends on line 3");
            assert.strictEqual (loc.location.end.column, 1, "Code ends on column 0");
            assert.strictEqual (loc.location.end.offset, 33, "Code ends at byte offset 33");

            assert.strictEqual (loc.endLocation.start.line, 3, "Closing script tag starts on line 3");
            assert.strictEqual (loc.endLocation.start.column, 1, "Closing script tag starts on column 1");
            assert.strictEqual (loc.endLocation.start.offset, 33, "Closing script tag starts at byte offset 33");
            assert.strictEqual (loc.endLocation.end.line, 3, "Closing script tag ends on line 3");
            assert.strictEqual (loc.endLocation.end.column, 10, "Closing script tag ends on column 10");
            assert.strictEqual (loc.endLocation.end.offset, 42, "Closing script tag ends at byte offset 43");
        }
        var callback = sinon.spy(gotScript);

        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isTrue(callback.calledOnce, "Should receive script callback");
    });
        
    test("Script on second line and indented", function () {
        var testhtml =
            "\n" +
            "    <script>\n" +
            "    console.log('testing');\n" +
            "    </script>\n";

        function gotScript(code, loc) {
            assert.isObject (loc, "Should receive location object");

            assert.strictEqual (loc.startLocation.start.line, 2, "First script tag starts on line 1");
            assert.strictEqual (loc.startLocation.start.column, 5, "First script tag starts on column 1");
            assert.strictEqual (loc.startLocation.start.offset, 5, "First script tag starts at byte offset 0");
            assert.strictEqual (loc.startLocation.end.line, 2, "First script tag ends on line 1");
            assert.strictEqual (loc.startLocation.end.column, 13, "First script tag ends on column 9");
            assert.strictEqual (loc.startLocation.end.offset, 13, "First script tag ends at byte offset 8");

            assert.strictEqual (loc.location.start.line, 2, "Code location starts with the newline following the script tag");
            assert.strictEqual (loc.location.start.column, 13, "Code location starts on column 10");
            assert.strictEqual (loc.location.start.offset, 13, "Code location starts at byte offset 9");
            assert.strictEqual (loc.location.end.line, 4, "Code ends on line 3");
            assert.strictEqual (loc.location.end.column, 5, "Code ends on column 0");
            assert.strictEqual (loc.location.end.offset, 46, "Code ends at byte offset 33");

            assert.strictEqual (loc.endLocation.start.line, 4, "Closing script tag starts on line 3");
            assert.strictEqual (loc.endLocation.start.column, 5, "Closing script tag starts on column 1");
            assert.strictEqual (loc.endLocation.start.offset, 46, "Closing script tag starts at byte offset 33");
            assert.strictEqual (loc.endLocation.end.line, 4, "Closing script tag ends on line 3");
            assert.strictEqual (loc.endLocation.end.column, 14, "Closing script tag ends on column 10");
            assert.strictEqual (loc.endLocation.end.offset, 55, "Closing script tag ends at byte offset 43");
        }
        var callback = sinon.spy(gotScript);

        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isTrue(callback.calledOnce, "Should receive script callback");
    });

    test("Code on same line as opening script tag", function () {
        var testhtml =
            "<script>console.log('testing');\n" +
            "</script>\n";

        function gotScript(code, loc) {
            assert.isObject (loc, "Should receive location object");

            assert.strictEqual (loc.startLocation.start.line, 1, "First script tag starts on line 1");
            assert.strictEqual (loc.startLocation.start.column, 1, "First script tag starts on column 1");
            assert.strictEqual (loc.startLocation.start.offset, 0, "First script tag starts at byte offset 0");
            assert.strictEqual (loc.startLocation.end.line, 1, "First script tag ends on line 1");
            assert.strictEqual (loc.startLocation.end.column, 9, "First script tag ends on column 9");
            assert.strictEqual (loc.startLocation.end.offset, 8, "First script tag ends at byte offset 8");

            assert.strictEqual (loc.location.start.line, 1, "Code location starts with the newline following the script tag");
            assert.strictEqual (loc.location.start.column, 9, "Code location starts on column 10");
            assert.strictEqual (loc.location.start.offset, 8, "Code location starts at byte offset 9");
            assert.strictEqual (loc.location.end.line, 2, "Code ends on line 3");
            assert.strictEqual (loc.location.end.column, 1, "Code ends on column 0");
            assert.strictEqual (loc.location.end.offset, 32, "Code ends at byte offset 33");

            assert.strictEqual (loc.endLocation.start.line, 2, "Closing script tag starts on line 3");
            assert.strictEqual (loc.endLocation.start.column, 1, "Closing script tag starts on column 1");
            assert.strictEqual (loc.endLocation.start.offset, 32, "Closing script tag starts at byte offset 33");
            assert.strictEqual (loc.endLocation.end.line, 2, "Closing script tag ends on line 3");
            assert.strictEqual (loc.endLocation.end.column, 10, "Closing script tag ends on column 10");
            assert.strictEqual (loc.endLocation.end.offset, 41, "Closing script tag ends at byte offset 43");
        }
        var callback = sinon.spy(gotScript);

        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isTrue(callback.calledOnce, "Should receive script callback");
    });

    test("Code on same line as closing script tag", function () {
        var testhtml =
            "<script>\n" +
            "console.log('testing');</script>\n";

        function gotScript(code, loc) {
            assert.isObject (loc, "Should receive location object");

            assert.strictEqual (loc.startLocation.start.line, 1, "First script tag starts on line 1");
            assert.strictEqual (loc.startLocation.start.column, 1, "First script tag starts on column 1");
            assert.strictEqual (loc.startLocation.start.offset, 0, "First script tag starts at byte offset 0");
            assert.strictEqual (loc.startLocation.end.line, 1, "First script tag ends on line 1");
            assert.strictEqual (loc.startLocation.end.column, 9, "First script tag ends on column 9");
            assert.strictEqual (loc.startLocation.end.offset, 8, "First script tag ends at byte offset 8");

            assert.strictEqual (loc.location.start.line, 1, "Code location starts with the newline following the script tag");
            assert.strictEqual (loc.location.start.column, 9, "Code location starts on column 10");
            assert.strictEqual (loc.location.start.offset, 8, "Code location starts at byte offset 9");
            assert.strictEqual (loc.location.end.line, 2, "Code ends on line 3");
            assert.strictEqual (loc.location.end.column, 24, "Code ends on column 0");
            assert.strictEqual (loc.location.end.offset, 32, "Code ends at byte offset 33");

            assert.strictEqual (loc.endLocation.start.line, 2, "Closing script tag starts on line 3");
            assert.strictEqual (loc.endLocation.start.column, 24, "Closing script tag starts on column 1");
            assert.strictEqual (loc.endLocation.start.offset, 32, "Closing script tag starts at byte offset 33");
            assert.strictEqual (loc.endLocation.end.line, 2, "Closing script tag ends on line 3");
            assert.strictEqual (loc.endLocation.end.column, 33, "Closing script tag ends on column 10");
            assert.strictEqual (loc.endLocation.end.offset, 41, "Closing script tag ends at byte offset 43");
        }
        var callback = sinon.spy(gotScript);

        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isTrue(callback.calledOnce, "Should receive script callback");
    });

    test("Everything on one line", function () {
        var testhtml =
            "<script>console.log('testing');</script>\n";

        function gotScript(code, loc) {
            assert.isObject (loc, "Should receive location object");

            assert.strictEqual (loc.startLocation.start.line, 1, "First script tag starts on line 1");
            assert.strictEqual (loc.startLocation.start.column, 1, "First script tag starts on column 1");
            assert.strictEqual (loc.startLocation.start.offset, 0, "First script tag starts at byte offset 0");
            assert.strictEqual (loc.startLocation.end.line, 1, "First script tag ends on line 1");
            assert.strictEqual (loc.startLocation.end.column, 9, "First script tag ends on column 9");
            assert.strictEqual (loc.startLocation.end.offset, 8, "First script tag ends at byte offset 8");

            assert.strictEqual (loc.location.start.line, 1, "Code location starts with the newline following the script tag");
            assert.strictEqual (loc.location.start.column, 9, "Code location starts on column 10");
            assert.strictEqual (loc.location.start.offset, 8, "Code location starts at byte offset 9");
            assert.strictEqual (loc.location.end.line, 1, "Code ends on line 3");
            assert.strictEqual (loc.location.end.column, 32, "Code ends on column 0");
            assert.strictEqual (loc.location.end.offset, 31, "Code ends at byte offset 33");

            assert.strictEqual (loc.endLocation.start.line, 1, "Closing script tag starts on line 3");
            assert.strictEqual (loc.endLocation.start.column, 32, "Closing script tag starts on column 1");
            assert.strictEqual (loc.endLocation.start.offset, 31, "Closing script tag starts at byte offset 33");
            assert.strictEqual (loc.endLocation.end.line, 1, "Closing script tag ends on line 3");
            assert.strictEqual (loc.endLocation.end.column, 41, "Closing script tag ends on column 10");
            assert.strictEqual (loc.endLocation.end.offset, 40, "Closing script tag ends at byte offset 43");
        }
        var callback = sinon.spy(gotScript);

        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isTrue(callback.calledOnce, "Should receive script callback");
    });

    test("Complex script tags", function () {
        var testhtml =
            "    <script \n" + 
            "    type=\"text/javascript\"\n" + 
            "    >\n" +
            "         console.log('testing');\n" + 
            "         console.log('test2');\n" +
            "         var a = 1 + 2;\n" +
            "    </script\n" +
            "    >\n" +
            "</body>";

        function gotScript(code, loc) {
            assert.isObject (loc, "Should receive location object");

            assert.strictEqual (loc.startLocation.start.line, 1, "First script tag starts on line 1");
            assert.strictEqual (loc.startLocation.start.column, 5, "First script tag starts on column 1");
            assert.strictEqual (loc.startLocation.start.offset, 4, "First script tag starts at byte offset 0");
            assert.strictEqual (loc.startLocation.end.line, 3, "First script tag ends on line 1");
            assert.strictEqual (loc.startLocation.end.column, 6, "First script tag ends on column 9");
            assert.strictEqual (loc.startLocation.end.offset, 45, "First script tag ends at byte offset 8");

            assert.strictEqual (loc.location.start.line, 3, "Code location starts with the newline following the script tag");
            assert.strictEqual (loc.location.start.column, 6, "Code location starts on column 10");
            assert.strictEqual (loc.location.start.offset, 45, "Code location starts at byte offset 9");
            assert.strictEqual (loc.location.end.line, 7, "Code ends on line 3");
            assert.strictEqual (loc.location.end.column, 5, "Code ends on column 0");
            assert.strictEqual (loc.location.end.offset, 138, "Code ends at byte offset 33");

            assert.strictEqual (loc.endLocation.start.line, 7, "Closing script tag starts on line 3");
            assert.strictEqual (loc.endLocation.start.column, 5, "Closing script tag starts on column 1");
            assert.strictEqual (loc.endLocation.start.offset, 138, "Closing script tag starts at byte offset 33");
            assert.strictEqual (loc.endLocation.end.line, 8, "Closing script tag ends on line 3");
            assert.strictEqual (loc.endLocation.end.column, 6, "Closing script tag ends on column 10");
            assert.strictEqual (loc.endLocation.end.offset, 152, "Closing script tag ends at byte offset 43");
        }
        var callback = sinon.spy(gotScript);

        testParser(testhtml, {
            scriptCallback: callback
        });
        assert.isTrue(callback.calledOnce, "Should receive script callback");
    });
});

suite("HTML should not be modified :: ", function () {
    function gotScript(code) {
        return code;
    }
    var callback = sinon.spy(gotScript);

    test("Simple HTMl should not be modified", function () {
        var rethtml = testParser(simpleHtml, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.strictEqual(rethtml, simpleHtml, "HTML in and out should match");
    });

    test("Simple Script should not be modified", function () {
        var rethtml = testParser(simpleScript, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.strictEqual(rethtml, simpleScript, "HTML in and out should match");
    });

    test("Simple Polymer should not be modified", function () {
        var rethtml = testParser(simplePolymer, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.strictEqual(rethtml, simplePolymer, "HTML in and out should match");
    });

    test("Complex Polymer should not be modified", function () {
        var rethtml = testParser(complexPolymer, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.strictEqual(rethtml, complexPolymer, "HTML in and out should match");
    });

    test("Real Website should not be modified", function () {
        var rethtml = testParser(realWebsite, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.strictEqual(rethtml, realWebsite, "HTML in and out should match");
    });

    test.skip("Extreme Script Placement should not be modified", function () {
        var rethtml = testParser(extremeHtml, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.strictEqual(rethtml, extremeHtml, "HTML in and out should match");
    });

    test("Windows HTML with \\r\\n newlines");
});

suite("HTML should be modified :: ", function () {
    function gotScript(code) {
        return "TESTING";
    }

    test("Simple HTML has no script tags and should not change", function () {
        var rethtml = testParser(simpleHtml, {
            scriptCallback: gotScript,
            padLineNo: false
        });
        assert.strictEqual(rethtml, simpleHtml, "HTML in and out should match");
    });

    test("Simple Script -- should replace script", function () {
        var simpleScriptResult = fs.readFileSync(__dirname + "/testHtml/simpleScript-result.html", {
            encoding: "utf8"
        });
        var rethtml = testParser(simpleScript, {
            scriptCallback: gotScript,
            padLineNo: false
        });
        assert.strictEqual(rethtml, simpleScriptResult, "HTML in and out should match");
    });

    test("Simple Polymer - should replace script", function () {
        var simplePolymerResult = fs.readFileSync(__dirname + "/testHtml/simplePolymer-result.html", {
            encoding: "utf8"
        });
        var rethtml = testParser(simplePolymer, {
            scriptCallback: gotScript,
            padLineNo: false
        });
        assert.strictEqual(rethtml, simplePolymerResult, "HTML in and out should match");
    });

    test("Complex Polymer - should replace script", function () {
        var complexPolymerResult = fs.readFileSync(__dirname + "/testHtml/complexPolymer-result.html", {
            encoding: "utf8"
        });
        var rethtml = testParser(complexPolymer, {
            scriptCallback: gotScript,
            padLineNo: false
        });
        assert.strictEqual(rethtml, complexPolymerResult, "HTML in and out should match");
    });

    test("Real Website - should replace script", function () {
        var realWebsiteResult = fs.readFileSync(__dirname + "/testHtml/realWebsite-result.html", {
            encoding: "utf8"
        });
        var rethtml = testParser(realWebsite, {
            scriptCallback: gotScript,
            padLineNo: false
        });
        assert.strictEqual(rethtml, realWebsiteResult, "HTML in and out should match");
    });

    test("Extreme Script Placement - should replace script");
});