import { backend } from "./url.js";
import { frontend } from "./url.js";

const token = localStorage.getItem("access_token");
export const apiResponse = (prompt) => {
  fetch(backend + `/api/recommend/chatbot/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      'prompt': prompt
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 429) {
        alert('하루에 2번만 AI chatbot recommend를 이용할 수 있습니다.');
        throw new Error('요청 제한 초과');
      } else {
        throw new Error(`API 요청에 실패했습니다. statusCode: ${res.status}`);
      }
    })
    .then(res => {
      console.log(res);
      const response = res.conversations[0].response;
      const $chatUl = document.querySelector('.chat_list');
      const $responseLi = document.createElement('li');
      $responseLi.classList.add('response_content');
      $responseLi.innerHTML = `
        <div class="response_text">
          <div class="response_sender">
            <span>AI-Recommendbot</span>
          </div>
          <div class="response_content">
            ${response}
          </div>
        </div>
      `;
      $chatUl.appendChild($responseLi);
    })
    .catch((err) => {
      console.error(err);
    });
};