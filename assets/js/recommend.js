import { apiResponse } from "../js/chatapi.js"

export const $chatInput = document.querySelector('.prompt_input')
export const $chatUl = document.querySelector('.chat_list')
const prompt_btn = document.querySelector('.prompt_btn')
prompt_btn.addEventListener('click', (e) => {
    e.preventDefault();

    const prompt = $chatInput.value.trim();
    console.log(prompt);
    if (prompt === 0) {
        return;
    }
    const $promptLi = document.createElement('li')
    $promptLi.classList.add('prompt_content')
    $promptLi.innerHTML = `
        <div class="prompt_text">
            <div class="prompt_sender">
                <span>User</span>
            </div>
            <div class="prompt_content">
                ${prompt}
            </div>
        </div>
    `
    $chatUl.appendChild($promptLi);
    apiResponse(prompt);

    $chatInput.value = '';

})