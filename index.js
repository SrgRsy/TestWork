const express = require('express');
const app = express(); 
const http = require('http');
const axios = require('axios');
// const mutex = require('async-mutex').Mutex;

const { PORT = 3000 } = process.env;



function rand(max) {
    return Math.floor(Math.random() * max);
}


app.get("/ssp", function(req, res) {
    const loop = []

    for (let i = 0; i < rand(5) + 3; i++) {
        loop.push(new Promise((resolve, reject) => {(
            async () => {
                try {
                    const response = await axios.post('http://localhost:3000/rtb');
                    //console.log(i, response.data);
                    resolve(response.data);
                    //console.log(response.data.explanation);
                } catch (error) {
                    reject(error);
                }
            })();
        }));
    }

    let result = {};
    //const resultMutex = new mutex();

    Promise.all(loop).then(data => {
        //console.log(data)
        data.filter((item) => {
            return Object.keys(item).length !== 0
        }).forEach((item) => {
            if (Object.keys(result).length === 0) {
                result = item
                return
            }
            if (result.price < item.price) {
                result = item
            }
        });
        //console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.json(result);
    }).catch(error => {
        res.setHeader('Content-Type', 'application/json');
        res.status(500);
        console.log(error);
    });
});

app.post("/rtb", function(req, res) {
    const eatShitAndDie = rand(2);
    res.setHeader('Content-Type', 'application/json');
    if (eatShitAndDie) {
        res.status(200);
        res.json({
            "ad": "Реклама",
            "price": rand(91) + 10
        });
        return
    }
    res.status(204);
    res.json({});
});

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${rand(5) + 3}`)
}) 

