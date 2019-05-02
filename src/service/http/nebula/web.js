import {
    NebulaClient
} from "./dist/web/main.js";

var serviceAddr = "http://dev-shawncao:8080";
var client = new NebulaClient.EchoClient(serviceAddr);
// simple unary call 
var request = new NebulaClient.EchoRequest();
request.setName('Trends On Nebula');
client.echoBack(request, {}, (err, response) => {
    var display = document.getElementById("output");
    if (err !== null) {
        display.innerText = "Error code: " + err;
    } else {
        display.innerText = (response == null) ? "Failed to get reply" : response.getMessage();
    }
});

var v1Client = new NebulaClient.V1Client(serviceAddr);
var req = new NebulaClient.TableStateRequest();
req.setTable("pin.trends");
// call the service 
v1Client.state(req, {}, (err, reply) => {
    var result = document.getElementById("result");
    if (err !== null) {
        result.innerText = "Error code: " + err;
    } else if (reply == null) {
        result.innerText = "Failed to get reply";
    } else {
        let bc = reply.getBlockcount();
        let rc = reply.getRowcount();
        let ms = reply.getMemsize();
        let mit = reply.getMintime();
        let mat = reply.getMaxtime();
        result.innerText = `[Blocks: ${bc}, Rows: ${rc}, Mem: ${ms}, Min T: ${mit}, Max T: ${mat}`;
    }
});

// make another query, with time[1548979200 = 02/01/2019, 1556668800 = 05/01/2019] 
var execute = () => {
    var term = document.getElementById('term').value;
    console.log("start query...: " + term);
    var q = new NebulaClient.QueryRequest();
    q.setTable("pin.trends");

    // new Date('2012.08.10').getTime() / 1000
    var start = document.getElementById('start').value;
    console.log("start box: " + start);
    var end = document.getElementById('end').value;
    if (!start) {
        alert('please enter start and end time');
        return;
    }

    var utStart = new Date(start).getTime() / 1000;
    var utEnd = new Date(end).getTime() / 1000;;
    console.log("start: " + utStart + ", end: " + utEnd);
    q.setStart(utStart);
    q.setEnd(utEnd);
    // set constraints 
    // var p1 = new NebulaClient.Predicate();
    // p1.setColumn("count");
    // p1.setOp(NebulaClient.Operation.MORE);
    // p1.setValueList(["2"]);
    var p2 = new NebulaClient.Predicate();
    p2.setColumn("query");
    p2.setOp(NebulaClient.Operation.LIKE);
    p2.setValueList([term + "%"]);
    var filter = new NebulaClient.PredicateAnd();
    filter.setExpressionList([p2]);
    q.setFiltera(filter);

    // set dimensions 
    q.setDimensionList(["query"]);
    // set metric 
    var m = new NebulaClient.Metric();
    m.setColumn("count");
    m.setMethod(NebulaClient.Rollup.SUM);
    q.setMetricList([m]);

    // set order and limit
    var o = new NebulaClient.Order();
    o.setColumn("count.sum");
    o.setDesc(document.getElementById('ob').value);
    q.setOrder(o);
    q.setTop(document.getElementById('limit').value);

    // do the query 
    v1Client.query(q, {}, (err, reply) => {
        document.getElementById('table_head').innerHTML = "";
        document.getElementById('table_content').innerHTML = "";
        var result = document.getElementById('qr');
        if (err !== null) {
            result.innerText += "Error code: " + err;
        } else if (reply == null) {
            result.innerText += "Failed to get reply";
        } else {
            var stats = reply.getStats();
            var json = JSON.parse(NebulaClient.bytes2utf8(reply.getData()));
            result.innerText = "query: " + term + ", error: " + stats.getError() + ", latency: " + stats.getQuerytimems() + " ms " + ", results: " + json.length;

            // Get Table headers and print 
            if (json.length > 0) {
                var h = $('#table_head');
                var keys = Object.keys(json[0]);
                var columns = keys.length;
                for (var k = 0; k < columns; k++) {
                    h.append('<td>' + keys[k] + '</td>');
                }

                // Get table body and print 
                var c = $('#table_content');
                for (var i = 0; i < json.length; i++) {
                    c.append('<tr>');
                    var row = json[i];
                    for (var j = 0; j < columns; j++) {
                        c.append('<td>' + row[keys[j]] + '</td>');
                    }
                    c.append('</tr>');
                }
            }
        }
    });
};

document.getElementById('btn').onclick = execute;
document.getElementById('term').onkeyup = (e) => {
    if (e.keyCode === 13) {
        execute();
    }
}