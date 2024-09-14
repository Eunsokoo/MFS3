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

        // 결과 형식화
        let formattedResult = `
            캐릭터: ${infoData.character_name} (${infoData.character_class_name})<br>
            카르제: ${infoData.cairde_name}<br>
            타이틀 수: ${infoData.total_title_count}<br><br>
            생성 일자: ${infoData.character_date_create}<br>
            마지막 로그인: ${infoData.character_last_login}<br>
            마지막 로그아웃: ${infoData.character_last_logout}<br><br>
            스킬 각성:<br>
        `;

        // 스킬 각성 데이터 형식화
        const skillAwakening = infoData.skill_awakening.map(skill => `    ${skill.skill_name} : ${skill.item_name}`).join('<br>');
        formattedResult += skillAwakening + `<br><br>`;

        // 원문 결과 추가
        formattedResult += `<br><br>원문 결과:<br><pre>${JSON.stringify(infoData, null, 2)}</pre>`;

        resultDiv.innerHTML = formattedResult;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">에러: ${error.message}</p>`;
    }
}
