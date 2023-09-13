import { backend } from "./url.js";
import { frontend } from "./url.js";

const access_token = localStorage.getItem('access_token');

const changepassword_btn = document.getElementById('changepassword-btn');

changepassword_btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload);
    const user_id = parsed_payload.user_id;

    const userpassword = document.getElementById('user-password').value;
    const newpassword = document.getElementById('new-password').value;
    const newpassword_check = document.getElementById('check-password').value;

    if (newpassword !== newpassword_check) {
        alert('새로운 비밀번호와 비밀번호 확인 값이 일치하지 않습니다.');
        return;
    }

    const passwordData = {
        "password": userpassword,
        "new_password": newpassword
    };

    try {
        const response = await fetch(`${backend}/api/user/auth/${user_id}/changepassword/`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                "Content-type": "application/json",
            },
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });

        if (!response.ok) {
            throw new Error('비밀번호 변경 중 오류 발생');
        }

        const res = await response.json();
        alert("비밀번호가 변경되었습니다.");
        location.reload();
    } catch (err) {
        console.error(err);
        alert('비밀번호 변경에 실패했습니다.');
    }
});
