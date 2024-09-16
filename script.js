async function getCharacterInfo() {
    const characterName = document.getElementById('characterName').value;
    const resultDiv = document.getElementById('result');

    if (!characterName) {
        resultDiv.innerHTML = '캐릭터명을 입력하세요.';
        return;
    }

    try {
        const encodedApiKey = 'bGl2ZV84NTEyNDZjYzg0NDUyOGEzYWU2ZTViNjNmNTdhYmExN2ZhYWVkNTJkMmJlMjU3MmY1OGE2MmYzZDBmMjg5NjVmZWZlOGQwNGU2ZDIzM2JkMzVjZjJmYWJkZWI5M2ZiMGQ=';
        const apiKey = atob(encodedApiKey);

        // 첫 번째 API 호출: 캐릭터 식별자 가져오기
        const idResponse = await fetch(`https://open.api.nexon.com/heroes/v2/id?character_name=${characterName}`, {
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

        if (!ocid) {
            throw new Error('식별자가 없습니다.');
        }

        // 두 번째 API 호출: 캐릭터 기본 정보 가져오기
        const infoResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/basic?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });

        if (!infoResponse.ok) {
            throw new Error('캐릭터 기본 정보를 가져올 수 없습니다.');
        }
        const infoData = await infoResponse.json();

        // 세 번째 API 호출: 캐릭터 능력치 정보 가져오기
        const statResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/stat?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });

        if (!statResponse.ok) {
            throw new Error('캐릭터 능력치 정보를 가져올 수 없습니다.');
        }

        const statData = await statResponse.json();

        // 능력치 데이터를 정리하여 원하는 형식으로 출력
        const statMap = {};
        statData.stat.forEach(stat => {
            statMap[stat.stat_name] = stat.stat_value;
        });

        // 포맷에 맞게 능력치 정리
        let formattedStats = `
            힘: ${statMap['힘']} 공격력: ${statMap['공격력']}<br>
            민첩: ${statMap['민첩']} 방어력: ${statMap['방어력']}<br>
            지능: ${statMap['지능']} 크리티컬: ${statMap['크리티컬']}<br>
            의지: ${statMap['의지']} 크리티컬 피해량: ${statMap['크리티컬 피해량']}<br>
            행운: ${statMap['행운']} 크리티컬 저항: ${statMap['크리티컬 저항']}<br>
            최대 생명력: ${statMap['최대 생명력']} 추가 피해: ${statMap['추가피해']}<br>
            최대 스태미나: ${statMap['최대 스태미나']} 대항력: ${statMap['대항력']}<br>
            밸런스: ${statMap['밸런스']}<br>
            공격속도: ${statMap['공격속도']}<br>
            공격력 제한 해제: ${statMap['공격력 제한 해제']}<br><br>
        `;

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
                return `<div class="skill-item"><div>${skill.skill_name}</div>${itemName}</div>`;
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
            능력치 정보:<br><br>
            ${formattedStats}<br>
            스킬 각성:<br><br>
            ${skillAwakening}<br><br>
        `;

        resultDiv.innerHTML = formattedResult;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">에러: ${error.message}</p>`;
    }
}
