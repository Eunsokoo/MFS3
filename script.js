// script.js

// DOMContentLoaded 이벤트로 DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 입력칸과 버튼 요소를 가져옵니다.
    const inputField = document.getElementById('userInput');
    const submitButton = document.getElementById('submitButton');
    const output = document.getElementById('output');

    // 버튼 클릭 시 입력값을 처리하는 함수
    submitButton.addEventListener('click', () => {
        // 입력값 가져오기
        const userInput = inputField.value;

        // 결과를 출력 영역에 표시
        output.textContent = `입력된 값은: ${userInput}`;
    });
});
