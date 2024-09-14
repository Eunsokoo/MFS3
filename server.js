const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const apiKey = 'test_851246cc844528a3ae6e5b63f57aba17fa1d33810a475c7bf148917be2056f88efe8d04e6d233bd35cf2fabdeb93fb0d';

app.use(express.static('public'));

app.get('/character/:name', async (req, res) => {
    const characterName = req.params.name;
    const idUrl = `http://open.api.nexon.com/heroes/v2/id?character_name=${characterName}`;

    try {
        const idResponse = await fetch(idUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });

        if (!idResponse.ok) {
            return res.status(400).send('Character not found');
        }

        const idData = await idResponse.json();
        const ocid = idData.ocid;

        const infoUrl = `http://open.api.nexon.com/heroes/v2/character/basic?ocid=${ocid}`;
        const infoResponse = await fetch(infoUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });

        if (!infoResponse.ok) {
            return res.status(400).send('Character info not found');
        }

        const characterData = await infoResponse.json();
        res.json(characterData);
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
