const express = require('express');
const app = express();
const axios = require('axios');
const { setOptions1, setOptions2 } = require('./utils');

app.get('/', async (req, res) => {
    const firstAPI = setOptions1();
    const secondAPI = setOptions2();

    const players = await axios.request(firstAPI).then(function (response) {
        console.log('First API');
        return response.data.players['playing XI'];
    });

    const matchDetails = await axios.request(secondAPI).then(function (response) {
        console.log('Second API');
        response.data.scoreCard.push(players)
        return response.data.scoreCard;
    });
    
    res.json({ matchDetails });
});

app.listen(5000, (req, res) => {
    console.log('Web Mashup experiment active on port 5000');
});
