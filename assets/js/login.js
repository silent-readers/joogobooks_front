const btn_login = document.querySelector('.btn-login');
btn_login.addEventListener('click', async function() {

    const loginData = {
        "username" : document.getElementById('id').value,
        "password" : document.getElementById('password').value,
    }

    const response = await fetch('http://127.0.0.1:8000/api/user/auth/', {
        headers: {
            'Content-type' : 'application/json',
        },
        method:'POST',
        body:JSON.stringify(loginData),
    })
    .then((res) => console.log("response:", response))
    .catch((err) => console.log("error:", err));

    // 로그인 성공 여부
    // if (response.status === 200) {
    //     const data = await response.json();
    //     const access_token = data.token.access;

    //     // access token을 Authorization header에 추가하여 요청
    //     const response = await fetch(`http://127.0.0.1:8000/api/user/auth/`, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${access_token}`,
    //         },
    //     });

    //     // 인증 성공 여부
    //     if (response.status === 200) {
    //         alert('로그인 인증에 성공했습니다.');
    //     } else {
    //         alert('로그인 인증에 실패했습니다.');
    //     }
    // } else {
    //     alert('로그인에 실패했습니다.');
    // };

});
