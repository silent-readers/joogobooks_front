import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = function () {
    const payload = localStorage.getItem('payload')
    const parsed_payload = JSON.parse(payload)
    const userId = parsed_payload.user_id
  
    const profile_createbtn = document.getElementById("profile-btn");
  
    // 프로필 이미지 불러오기
    const profileImg = document.getElementById('my_profile_img')
  
  
    // 서버에서 프로필 이미지 URL 가져오기
    fetch(backend + `/api/user/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const mediaUrl = backend;
      const imageUrl = mediaUrl + data.profile_img;
      profileImg.src = imageUrl
  
      document.getElementById('profile-id').innerHTML = data.nickname
  
      if (data.about_me) {
        // about_me가 작성된 경우
        document.getElementById('aboutme').innerHTML = data.about_me
  
      } else {
        // about_me가 작성되지 않은 경우
        document.getElementById('aboutme').innerText = '한줄로 나를 소개해주세요!'
  
      }
    })
    .catch(error => {
      alert("프로필을 확인할 수 없습니다!");
    });
    
    // 프로필 변경버튼
    profile_createbtn.addEventListener("click", () => {
      
      window.location.href=`${frontend}/assets/html/mypage.html?id=${userId}`
    });
  

    const changepassword_btn = document.getElementById('changepassword-btn');

    changepassword_btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const access_token = localStorage.getItem('access_token');
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
            const response = await fetch(backend + `/api/user/auth/${user_id}/changepassword/`, {
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
}