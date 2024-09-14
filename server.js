const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// API Key 설정
const apiKey = 'test_851246cc844528a3ae6e5b63f57aba17fa1d33810a475c7bf148917be2056f88efe8d04e6d233bd35cf2fabdeb93fb0d';

// 정적 파일 제공 (index.html, script.js, style.css)
app.use(express.static('public'));

// 캐릭터 식별자 조회 엔드포인트
app.get('/character/id/:name', async (req, res) => {
    const characterName = req.params.name;
    const idUrl = `http://open.api.nexon.com/heroes/v2/id?character_name=${characterName}`;
debugger;
    try {
        const idResponse = await fetch(idUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });
debugger;
        // 응답을 로그에 출력
        const idData = await idResponse.json();
        console.log('API 응답 데이터:', idData);

        if (!idResponse.ok) {
            return res.status(404).send('캐릭터 식별자를 찾을 수 없습니다.');
        }

        res.json(idData);
    } catch (error) {
        res.status(500).send('서버 오류: ' + error.message);
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 실행 중입니다: http://localhost:${port}`);
});
