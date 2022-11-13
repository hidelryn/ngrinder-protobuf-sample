const express = require("express");
const bodyParser = require("body-parser");
const protobuf = require("protobufjs");
const path = require("path");

const app = express();
app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}))
const pb = path.join(__dirname, "../proto/post.proto");

app.post("/save-post", (req, res) => {
  protobuf.load(pb, (err, root) => {
    if (err) return res.end(err);

    let save = root.lookupType("testpackage.SavePost");
    let message = save.decode(req.body);
    console.log("message", message);

    let read = root.lookupType("testpackage.ReadPost");
    let payload = {
      id: 10,
      nickname: "delryn",
      title: message.title,
      content: message.content,
      tag: message.tag,
    };
    let verifyErr = read.verify(payload);
    if (verifyErr) return res.end(err);

    let readMsg = read.create(payload);
    console.log('readMsg', readMsg)
    let buf = read.encode(readMsg).finish();
    
    return res.send(buf);
  });
});

app.listen(3000, () => console.log("node server run"));
