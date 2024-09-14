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

        // 날짜 형식 변경 함수
        function formatDate(dateString) {
            const date = new Date(dateString);
            if (isNaN(date.getTime()) || !dateString) {
                return '정보 없음 (혹은 오래전)';
            }
            return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`;
        }

        // 스킬 각성 정보 처리
        const skillAwakening = infoData.skill_awakening.length > 0
            ? infoData.skill_awakening.map(skill => {
                const itemName = skill.item_name.replace('각성의 돌: ', '').trim();
                return `    <div class="skill-item"><div>${skill.skill_name}</div><div>${itemName}</div></div>`;
            }).join('<br>')
            : '정보 없음';

        // 결과 형식화
        let formattedResult = `
            캐릭터: ${infoData.character_name} (${infoData.character_class_name})<br>
            카르제: ${infoData.cairde_name}<br>
            타이틀 수: ${infoData.total_title_count}<br><br>
            생성 일자: ${formatDate(infoData.character_date_create)}<br>
            마지막 로그인: ${formatDate(infoData.character_date_last_login)}<br>
            마지막 로그아웃: ${formatDate(infoData.character_date_last_logout)}<br><br>
            스킬 각성:<br>
            ${skillAwakening}<br><br>
            원문 결과:<br><pre>${JSON.stringify(infoData, null, 2)}</pre>
        `;

        resultDiv.innerHTML = formattedResult;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">에러: ${error.message}</p>`;
    }
}
