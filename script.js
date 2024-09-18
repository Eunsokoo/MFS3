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
        const infoData = await infoResponse.json();

        // 세 번째 API 호출: 캐릭터 능력치 정보 가져오기
        const statResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/stat?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });
        const statData = await statResponse.json();

        // 네 번째 API 호출: 길드 정보 가져오기
        const guildResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/guild?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });
        const guildData = await guildResponse.json();

        // 다섯 번째 API 호출: 장착 타이틀 가져오기
        const titleResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/title-equipment?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });
        const titleData = await titleResponse.json();

        // 여섯 번째 API 호출: 캐릭터 능력치 정보 가져오기
        const itemResponse = await fetch(`https://open.api.nexon.com/heroes/v2/character/stat?ocid=${ocid}`, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });
        const itemData = await itemResponse.json();



        

        // 능력치 데이터를 정리하여 원하는 형식으로 출력
        const statMap = {};
        statData.stat.forEach(stat => {
            statMap[stat.stat_name] = stat.stat_value;
        });

        // 포맷에 맞게 능력치 정리
        let formattedStats = `
            힘: ${statMap['힘']}     공격력: ${statMap['공격력']}<br>
            민첩: ${statMap['민첩']}     방어력: ${statMap['방어력']}<br>
            지능: ${statMap['지능']}     크리티컬: ${statMap['크리티컬']}<br>
            의지: ${statMap['의지']}     크리티컬 피해량: ${statMap['크리티컬 피해량']}<br>
            행운: ${statMap['행운']}     크리티컬 저항: ${statMap['크리티컬 저항']}<br>
            최대 생명력: ${statMap['최대 생명력']}     추가 피해: ${statMap['추가피해']}<br>
            최대 스태미나: ${statMap['최대 스태미나']}     대항력: ${statMap['대항력']}<br>
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
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}. ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }

        // 스킬 각성 정보 처리
        const skillAwakening = infoData.skill_awakening.length > 0
            ? infoData.skill_awakening.map(skill => {
                const itemName = skill.item_name.replace('각성의 돌:', '').trim();
                return `<div class="flex">
                         <span class="ll">${skill.skill_name}</span>
                         <div class="dot"></div>
                         <span class="rr">${itemName}</span>
                    </div>`;
            }).join('<br>')
            : '정보 없음';

        // 결과 형식화
        let formattedResult = `
            <div class="inner_border">
            <div class="title1">=&nbsp;&nbsp;&nbsp;기본정보&nbsp;&nbsp;&nbsp;=</div><br>
            <div class="flex"><span class="ll">캐릭터</span><div class="dot"></div><span class="rr">${infoData.character_name} (${infoData.character_class_name})</span></div><br>
            <div class="flex"><span class="ll">카르제</span><div class="dot"></div><span class="rr">${infoData.cairde_name}</span></div><br>
            <div class="flex"><span class="ll">길드명</span><div class="dot"></div><span class="rr">${guildData.guild_name}</span></div><br>
            <div class="flex"><span class="ll">타이틀 수</span><div class="dot"></div><span class="rr">${infoData.total_title_count}</span></div><br>
            <div class="flex"><span class="ll">장착 타이틀</span><div class="dot"></div><span class="rr">${titleData.title_equipment[0]?.title_name??'없음'}</span></div><br>
            <div class="flex"><span class="ll">생성 일자</span><div class="dot"></div><span class="rr">${formatDate(infoData.character_date_create)}</span></div><br>
            <div class="flex"><span class="ll">마지막 로그인</span><div class="dot"></div><span class="rr">${formatDate(infoData.character_date_last_login)}</span></div><br>
            <div class="flex"><span class="ll">마지막 로그아웃</span><div class="dot"></div><span class="rr">${formatDate(infoData.character_date_last_logout)}</span></div><br></div>
            <br>

            <div class="inner_border border2">
            <div class="title1">=&nbsp;&nbsp;&nbsp;능력치 정보&nbsp;&nbsp;&nbsp;=</div><br>
            <div class="flex"><span class="ll">힘: ${statMap['힘']}</span><span class="rr">공격력: ${statMap['공격력']}</span></div><br>
            <div class="flex"><span class="ll">민첩: ${statMap['민첩']}</span><span class="rr">마법공격력: ${statMap['마법공격력']}</span></div><br>
            <div class="flex"><span class="ll">지능: ${statMap['지능']}</span><span class="rr">방어력: ${statMap['방어력']}</span></div><br>
            <div class="flex"><span class="ll">의지: ${statMap['의지']}</span><span class="rr">크리티컬: ${statMap['크리티컬']}</span></div><br>
            <div class="flex"><span class="ll">행운: ${statMap['행운']}</span><span class="rr">크리티컬 피해량: ${statMap['크리티컬 피해량']}</span></div><br>
            <div class="flex"><span class="ll">최대 생명력: ${statMap['최대 생명력']}</span><span class="rr">크리티컬 저항: ${statMap['크리티컬 저항']}</span></div><br>
            <div class="flex"><span class="ll">최대 스태미나: ${statMap['최대 스태미나']}</span><span class="rr">추가피해: ${statMap['추가피해']}</span></div><br>
            <div class="flex"><span class="ll">밸런스: ${statMap['밸런스']}</span><span class="rr">대항력: ${statMap['대항력']}</span></div><br>
            <div class="flex"><span class="ll">공격속도: ${statMap['공격속도']}</span></div><br>
            <div class="flex"><span class="ll">공격력 제한 해제: ${statMap['공격력 제한 해제']}</span></div><br></div>
            <br>

            <div class="inner_border border3">
            <div class="title1">=&nbsp;&nbsp;&nbsp;스킬 각성&nbsp;&nbsp;&nbsp;=</div><br>
            ${skillAwakening}<br></div>
           
        `;

        resultDiv.innerHTML = formattedResult;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">에러: ${error.message}</p>`;
    }
}
