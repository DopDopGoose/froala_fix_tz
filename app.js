const http = require("http");
const fs = require("fs");

var server = http.createServer((request, response) =>
{
    response.writeHead(200, { 'Content-Type': 'text/javascript' });
    var js_to_edit = null;
    js_to_edit = fs.readFileSync("fixFroalaTest.js", "utf8");
    js_to_edit = js_to_edit.replace("%INSERT_POPUP_FIX%", fs.readFileSync("froalaFix.js", "utf8"));
    // fs.readFileSync("fixFroalaTest.js", (_, data) => { js_to_edit = data; });
    // fs.readFileSync("froalaFix.js", (_, data) => { js_to_edit = js_to_edit.replace("%INSERT_POPUP_FIX%", data); });
    response.end(js_to_edit);
});
server.listen(8888);