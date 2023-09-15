import { backend } from "./url.js";

const main_btn = document.querySelector('.enter-button');
const active_ul = document.getElementsByClassName('menu');

const payload = localStorage.getItem('payload');
const parsed_payload = JSON.parse(payload);

if (!parsed_payload) {
    main_btn.addEventListener('click', (e) => {
        e.preventDefault();
        location.href="../assets/html/login.html";
    })
} else {
    const response = await fetch(backend+`/api/user/profile/${parsed_payload.user_id}/`, { method:'GET' })

    const res = await response.json();
    
    const mediaUrl = backend;
    const imageUrl = mediaUrl + res.profile_img;

    active_ul[0].classList.add('before')
    active_ul[1].classList.remove('before')
    active_ul[1].innerHTML = `
        <li><img class="user" src="${imageUrl}" alt="user"></li>
        <ul class="menu1">
            <li>${res.nickname}님, 환영합니다.</li>
            <li>
                <a href="../assets/html/mypage_main.html?id=${res.user_id}">My Page</a>
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

    main_btn.addEventListener('click', (e) => {
        e.preventDefault();
        location.href="../assets/html/shop.html"
    })
}