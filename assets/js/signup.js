const signup_btn = document.querySelector('.join-button');

signup_btn.addEventListener('click', (e) => {
    e.preventDefault();

    let password = "";
    const pwd1 = document.getElementById('password').value;
    const pwd2 = document.getElementById('confirm-password').value;

    if (pwd1 == pwd2 ) {
        password = pwd1;
    } else {
        alert({'message': '비밀번호를 잘못 입력하셨습니다.'})
    }

    const response = fetch('http://127.0.0.1:8000/api/user/register/', {
        headers: {
            'Content-type': 'application/json',
        },
        method:'POST',
        body:JSON.stringify({
            'username' : document.getElementById('id').value,
            'email' : document.getElementById('email').value,
            'password' : password,
        }),
    })
    .then((res) => res.json())
    .then((res) => {
        window.location.replace('http://127.0.0.1:5500/assets/html/login.html')
    })
    .catch((err) => {
        alert(response.status)
    });
});