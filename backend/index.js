const path = require("path");
const express = require("express");
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const RobotsService = require("./robotService/service");
const addRequestId = require('express-request-id')();

const app = express();

app.use(cors(), bodyParser.json(), addRequestId);

app.post("/getFile", (req, res) => {
    const buff = new Buffer.from(req.body.url.split(",")[1], 'base64');
    const text = buff.toString('utf8');
    const payload = text.split(/(?:\r\n|\r|\n)/g).filter(line => line.length);
    if (payload.length) {
        try {
            const service = new RobotsService(payload);
            const results = service.getResults();
            const dir = path.join(__dirname, "results");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            const file = path.join(dir, `robots_${req.id}.txt`);
            fs.writeFile(file, results.toString().replace(/,/g, "\n"), () => {
                res.json({ results, path: file });
            });
        } catch(err) {
            res.error(err);
        }
    } else {
       res.end();
    }
});

app.listen(3000);