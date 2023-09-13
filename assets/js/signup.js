import { backend } from "./url.js";
import { frontend } from "./url.js";

const signup_btn = document.querySelector('.join-button');

signup_btn.addEventListener('click', async (e) => {
    e.preventDefault();

    let password = "";
    const pwd1 = document.getElementById('password').value;
    const pwd2 = document.getElementById('confirm-password').value;

    if (pwd1 == pwd2 ) {
        password = pwd1;
    } else {
        alert('비밀번호를 잘못 입력하셨습니다.');
        return;
    }

    try {
        const response = await fetch(backend + '/api/user/register/', {
            headers: {
                'Content-type': 'application/json',
            },
            method:'POST',
            body:JSON.stringify({
                'username' : document.getElementById('id').value,
                'email' : document.getElementById('email').value,
                'nickname' : document.getElementById('user-nickname').value,
                'password' : password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.detail || '회원가입에 실패했습니다.');
            return;
        }

        const res = await response.json();
        console.log("response:", res.message);
        
        window.location.replace(frontend + '/assets/html/login.html');
    } catch (error) {
        console.error(error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
});
