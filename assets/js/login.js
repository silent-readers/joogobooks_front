const btn_login = document.querySelector('.btn-login');
btn_login.addEventListener('click', async function(e) {
    e.preventDefault();

    const loginData = {
        "username" : document.getElementById('id').value,
        "password" : document.getElementById('password').value,
    }

    const response = await fetch('http://backend.joongobooks.com/api/user/auth/', {
        headers: {
            'Content-type' : 'application/json',
        },
        method:'POST',
        body:JSON.stringify(loginData),
    })
    .then((res) => res.json())
    .then((res) => {
        console.log("response:", res.message)

        const access_token = res.token.access
        localStorage.setItem('access_token', access_token)

        const base64Url = access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        localStorage.setItem("payload", jsonPayload);

        window.location.replace('http://joongobooks.com/')
    })
    .catch((err) => {
        alert(res.status);
        console.log(err);
    });

});
