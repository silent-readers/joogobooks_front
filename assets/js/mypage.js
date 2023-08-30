window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    const access_token = localStorage.getItem('access_token')
    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload);
    const username = parsed_payload.user_id;

    const profile_content = document.getElementById('user-profile');

    // 프로필 조회하기
    const response = await fetch(`http://127.0.0.1:8000/api/user/profile/${profileId}`, {method: 'GET'});
    const profileData = await response.json();

    console.log(profileData);

    if (profileData.user != username) {
        profile_content.innerHTML = `
        <img class="profile img" src="../img/user.png" alt="profile" />
        <div class="userinfo">
            <h2 class="username">${profileData.nickname}</h2>
            <h4 class="email">${profileData.user}</h4>
        </div>
        <form class="profile-container">
            <div class="form-group">
                <ul>
                    <li>nickname</li>
                    <li>
                        <input type="text" id="nickname" name="nickname" value="${profileData.nickname}">
                    </li>
                </ul>
                <ul>
                    <li>About Me</li>
                    <li>
                        <input type="text" id="aboutme" name="aboutme" value="${profileData.about_me}">
                    </li>
                </ul>
            </div>
        </form>
        `
    } else if (!profileData.nickname && !profileData.about_me) {
        profile_content.innerHTML = `
        <img class="profile img" src="../img/user.png" alt="profile" />
        <div class="userinfo">
            <h2 class="username">${profileData.user}</h2>
            <h4 class="email">${profileData.user}</h4>
        </div>
        <form class="profile-container">
            <div class="form-group">
                <ul>
                    <li>nickname</li>
                    <li>
                        <input type="text" id="nickname" name="nickname" placeholder="  닉네임" required>
                    </li>
                </ul>
                <ul>
                    <li>About Me</li>
                    <li>
                        <input type="text" id="aboutme" name="aboutme" placeholder="  본인 정보"
                        required>
                    </li>
                </ul>
                <button id="profile-btn">프로필 생성</button>
            </div>
        </form>
        `

        const profile_btn = document.getElementById('profile-btn');

        profile_btn.addEventListener('click', (e) => {
            e.preventDefault();
        
            const response = fetch(`http://127.0.0.1:8000/api/user/profile/${profileId}/create`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-type": "application/json",
                },
                method: 'POST',
                body:JSON.stringify({
                    'nickname' : document.getElementById('nickname').value,
                    'about_me' : document.getElementById('aboutme').value,
                })
            })
            .then((res) => res.json())
            .then((res) => {
                window.location.replace(`http://127.0.0.1:5500/asserts/html/mypage.html?id=${profileId}`)
            })
            .catch((err) => {
                alert(err)
            })
        })
    } else {
        profile_content.innerHTML = `
        <img class="profile img" src="../img/user.png" alt="profile" />
        <div class="userinfo">
            <h2 class="username">${profileData.nickname}</h2>
            <h4 class="email">${profileData.user}</h4>
        </div>
        <form class="profile-container">
            <div class="form-group">
                <ul>
                    <li>nickname</li>
                    <li>
                        <input type="text" id="nickname" name="nickname" value="${profileData.nickname}">
                    </li>
                </ul>
                <ul>
                    <li>About Me</li>
                    <li>
                        <input type="text" id="aboutme" name="aboutme" value="${profileData.about_me}">
                    </li>
                </ul>
            </div>
            <button id="profile-btn">프로필 변경</button>
        </form>
        `

        const profile_btn = document.getElementById('profile-btn');

        profile_btn.addEventListener('click', (e) => {
            e.preventDefault();
        
            const response = fetch(`http://127.0.0.1:8000/api/user/profile/${profileId}/update`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-type": "application/json",
                },
                method: 'PUT',
                body:JSON.stringify({
                    'user': profileData.user,
                    'nickname' : document.getElementById('nickname').value,
                    'about_me' : document.getElementById('aboutme').value,
                })
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then((res) => {
                alert("프로필이 업데이트 되었습니다.")
                window.location.reload();
            })
            .catch((err) => {
                console.error(err); 
                alert('프로필 업데이트에 실패했습니다.');
            });
        });
    }
}