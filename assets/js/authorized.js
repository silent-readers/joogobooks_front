const active_ul = document.getElementsByClassName('menu');

const payload = localStorage.getItem('payload');
const parsed_payload = JSON.parse(payload);

if (!parsed_payload) {
    main_btn.addEventListener('click', (e) => {
        e.preventDefault();
        location.href="../assets/html/login.html";
    })
} else {
    active_ul[0].classList.add('before')
    active_ul[1].classList.remove('before')
    active_ul[1].innerHTML = `
        <li><img class="user" src="../img/user.png" alt="user"></li>
        <ul class="menu1">
            <li>[별명]님, 환영합니다.</li>
            <li class="menu1-1">
                <a href="../html/mypage.html">My Page</a>
            </li>
            <li><button type="button" id="logout-btn">Logout</button></li>
        </ul>
    `

    const logout_btn = document.getElementById('logout-btn');
    logout_btn.addEventListener('click', () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('payload');
        alert("로그아웃 되었습니다.");
        location.href="/index.html";
    })
}