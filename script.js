const apiKey = 'test_851246cc844528a3ae6e5b63f57aba17fa1d33810a475c7bf148917be2056f88efe8d04e6d233bd35cf2fabdeb93fb0d';

async function getCharacterInfo() {
    const characterName = document.getElementById('characterName').value;
    const resultDiv = document.getElementById('result');

    if (!characterName) {
        resultDiv.innerHTML = '캐릭터명을 입력하세요.';
        return;
    }

    // 1. 캐릭터명을 사용하여 식별자 요청
    const idUrl = `http://open.api.nexon.com/heroes/v2/id?character_name=${characterName}`;
    
    try {
        const idResponse = await fetch(idUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });
        
        if (!idResponse.ok) {
            throw new Error('캐릭터 식별자를 찾을 수 없습니다.');
        }

        const idData = await idResponse.json();
        const ocid = idData.ocid;

        // 2. 식별자를 사용하여 캐릭터 기본 정보 요청
        const infoUrl = `http://open.api.nexon.com/heroes/v2/character/basic?ocid=${ocid}`;
        const infoResponse = await fetch(infoUrl, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });

        if (!infoResponse.ok) {
            throw new Error('캐릭터 정보를 찾을 수 없습니다.');
        }

        const characterData = await infoResponse.json();

        // 3. 캐릭터 정보를 화면에 표시 (URL과 식별자 포함)
        resultDiv.innerHTML = `
            <h2>캐릭터 조회 결과</h2>
            <p><strong>캐릭터명 요청 URL:</strong> ${idUrl}</p>
            <p><strong>받은 식별자 (ocid):</strong> ${ocid}</p>
            <p><strong>캐릭터 정보 요청 URL:</strong> ${infoUrl}</p>
            <h2>캐릭터 정보</h2>
            <p><strong>이름:</strong> ${characterData.character_name}</p>
            <p><strong>생성일:</strong> ${new Date(characterData.character_date_create).toLocaleString()}</p>
            <p><strong>마지막 로그인:</strong> ${new Date(characterData.character_last_login).toLocaleString()}</p>
            <p><strong>마지막 로그아웃:</strong> ${new Date(characterData.character_last_logout).toLocaleString()}</p>
            <p><strong>클래스:</strong> ${characterData.character_class_name}</p>
            <p><strong>성별:</strong> ${characterData.character_gender}</p>
            <p><strong>경험치:</strong> ${characterData.character_exp}</p>
            <p><strong>레벨:</strong> ${characterData.character_level}</p>
            <p><strong>길드:</strong> ${characterData.cairde_name || '없음'}</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">에러: ${error.message}</p>`;
    }
}
