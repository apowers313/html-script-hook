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

suite("Parser conditions", function () {
    test("Empty HTML should not throw", function () {
        function gotScript(code) {
            return code;
        }

        assert.doesNotThrow(testParser, Error, "Empty HTML should not throw error");
        testParser("", {
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
        function gotScript(code) {
            return code;
        }
        var callback = sinon.spy(gotScript);

        assert.doesNotThrow(testParser, Error, "Empty HTML should not throw error");

        testParser(testhtml, {
            scriptCallback: callback
        });

        assert.isFalse(callback.called, "Should not call scriptCallback with broken <script>");
    });
});

suite("Script variants", function () {
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

    test("Right line number for script tags");
    test("Right padding for script callback");
    test("Single line HTML");
    test("Single line HTML with multiple script tags");
    test("End on <script> without whitespace");
    test("End on <script> with whitespace");
    test("Start with script tag");
    test("Non JavaScript script");
    test("Two script tags");

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

        assert.strictEqual (callback.callCount, 5, "Should call scriptCallback");
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

    test("Script tag in string");
    test("Script tag in comment");
    test("Missing closing script tag");
});

suite("API tests", function () {
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

        function gotScript(code, loc) {
            assert.strictEqual(code, "\nconsole.log (\"this is a test.\\n\");\n", "Should get correct code");
            assert.isObject(loc, "Script callback should receive object for location");
            assert.deepEqual(loc, {
                start: {
                    offset: 57,
                    line: 6,
                    column: 1
                },
                end: {
                    offset: 110,
                    line: 8,
                    column: 10
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

suite("HTML should not be modified", function () {
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

    test.skip("Complex Polymer should not be modified", function () {
        var rethtml = testParser(complexPolymer, {
            scriptCallback: callback,
            padLineNo: false
        });
        assert.strictEqual(rethtml, complexPolymer, "HTML in and out should match");
    });

    test.skip("Real Website should not be modified", function () {
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

suite("HTML should be modified", function () {
    function gotScript(code) {
        return "console.log ('THIS IS A TEST');";
    }

    test("Simple HTML -- should replace script");
    test("Simple Script -- should replace script");
    test("Simple Polymer - should replace script");
    test("Complex Polymer - should replace script");
    test("Real Website - should replace script");
    test("Extreme Script Placement - should replace script");
});