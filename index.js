const express  = require('express');
const app = express();
const fs = require('fs');

app.get("/",(req,res) => {
    fs.readFile('index.html',(err,data) => {
        if(err) console.error(err.message);
        res.send(data.toString());
    })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => (console.log(`Listening on port ${PORT}`)));