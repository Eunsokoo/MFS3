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
            throw new Error('캐릭터 식별자 요청 실패');
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
            throw new Error('캐릭터 정보 요청 실패');
        }

        const characterData = await infoResponse.json();

        // 3. 캐릭터 정보를 화면에 표시
        resultDiv.innerHTML = `
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
            <h3>칭호 정보</h3>
            <p><strong>획득 칭호 개수:</strong> ${characterData.title_count}</p>
            <p><strong>고유 칭호 개수:</strong> ${characterData.id_title_count}</p>
            <p><strong>전체 칭호 개수:</strong> ${characterData.total_title_count}</p>
            <h3>칭호 스탯</h3>
            <ul>
                ${characterData.title_stat.map(stat => `<li>${stat.stat_name}: ${stat.stat_value}</li>`).join('')}
            </ul>
            <h3>스킬 각성</h3>
            <ul>
                ${characterData.skill_awakening.map(skill => `<li>${skill.skill_name}: ${skill.item_name}</li>`).join('')}
            </ul>
            <h3>드레스 포인트</h3>
            <p><strong>총 포인트:</strong> ${characterData.dress_point.total_point}</p>
            <p><strong>아바타 포인트:</strong> ${characterData.dress_point.avatar_point}</p>
            <p><strong>등 포인트:</strong> ${characterData.dress_point.back_point}</p>
            <p><strong>꼬리 포인트:</strong> ${characterData.dress_point.tail_point}</p>
            <p><strong>오브젝트 포인트:</strong> ${characterData.dress_point.object_point}</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">에러: ${error.message}</p>`;
    }
}
