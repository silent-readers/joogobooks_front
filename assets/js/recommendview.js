import { backend } from "./url.js";

window.onload = async function() {
  const access_token = localStorage.getItem('access_token')
  const payload = localStorage.getItem('payload')
  const parsed_payload = JSON.parse(payload)
  const userid = parsed_payload.user_id

  const response = await fetch(backend + `/api/recommend/chatbot/${userid}/conversations/`, 
  { 
    headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
    },
    method: 'GET' 
  })

  const response_json = await response.json()
  console.log(response_json);
  const $chatDiv = document.getElementsByClassName('chat_wrap')[0]
  const $chatUl = document.querySelector('.chat_list')

  for (let conversation of response_json) {
    const promptLi = document.createElement('li');
    promptLi.className = 'prompt_content';
    promptLi.innerHTML = `
      <div class="prompt_text">
        <div class="prompt_sender">
            <span>User</span>
        </div>
        <div class="prompt_content">
            ${conversation.prompt}
        </div>
      </div>
    `;
    
    const responseLi = document.createElement('li');
    responseLi.className = 'response_content';
    responseLi.innerHTML = `
      <div class="response_text">
        <div class="response_sender">
          <span>AI-Recommendbot</span>
        </div>
        <div class="response_content">
          ${conversation.response}
        </div>
      </div>
    `;

    $chatUl.appendChild(promptLi);
    $chatUl.appendChild(responseLi);
    $chatDiv.appendChild($chatUl);
  }
}