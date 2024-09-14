async function getCharacterInfo() {
    const characterName = document.getElementById('characterName').value;
    const resultDiv = document.getElementById('result');

    if (!characterName) {
        resultDiv.innerHTML = '캐릭터명을 입력하세요.';
        return;
    }

    try {
        const response = await fetch(`/character/${characterName}`);
        
        if (!response.ok) {
            throw new Error('캐릭터 정보를 찾을 수 없습니다.');
        }

        const characterData = await response.json();

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
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">에러: ${error.message}</p>`;
    }
}
