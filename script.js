async function getCharacterInfo() {
    const characterName = document.getElementById('characterName').value;
    const resultDiv = document.getElementById('result');

    if (!characterName) {
        resultDiv.innerHTML = '캐릭터명을 입력하세요.';
        return;
    }

    try {
        // 첫 번째 API 호출: 캐릭터 식별자 가져오기
        const idResponse = await fetch(`https://open.api.nexon.com/heroes/v2/id?character_name=${characterName}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': 'test_851246cc844528a3ae6e5b63f57aba17fa1d33810a475c7bf148917be2056f88efe8d04e6d233bd35cf2fabdeb93fb0d'
            }
        });

        if (!idResponse.ok) {
            throw new Error('캐릭터 식별자를 찾을 수 없습니다.');
        }

        const idData = await idResponse.json();
        const ocid = idData.ocid;
        resultDiv.innerHTML = `식별자: ${ocid}<br><br>`;

        if (!ocid) {
            throw new Error('식별자가 없습니다.');
        }

        // 두 번째 API 호출: 캐릭터 기본 정보 가져오기
        const infoResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/basic?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': 'test_851246cc844528a3ae6e5b63f57aba17fa1d33810a475c7bf148917be2056f88efe8d04e6d233bd35cf2fabdeb93fb0d'
            }
        });

        if (!infoResponse.ok) {
            throw new Error('캐릭터 기본 정보를 가져올 수 없습니다.');
        }

        const infoData = await infoResponse.json();
        resultDiv.innerHTML += `<pre>${JSON.stringify(infoData, null, 2)}</pre>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">에러: ${error.message}</p>`;
    }
}
