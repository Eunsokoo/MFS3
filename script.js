async function getCharacterInfo() {
    const characterName = document.getElementById('characterName').value;
    const resultDiv = document.getElementById('result');

    if (!characterName) {
        resultDiv.innerHTML = '캐릭터명을 입력하세요.';
        return;
    }
debugger;
    try {
        // 첫 번째 통신 요청
        const response = await fetch(`/character/id/${characterName}`);
        
        if (!response.ok) {
            throw new Error('캐릭터 식별자를 찾을 수 없습니다.');
        }

        const data = await response.json();

        // API 응답을 그대로 출력
        resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">에러: ${error.message}</p>`;
    }
}
