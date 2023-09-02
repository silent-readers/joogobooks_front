window.onload = function () {
  const payload = localStorage.getItem('payload')
  const parsed_payload = JSON.parse(payload)
  const userId = parsed_payload.user_id

  document.getElementById("profile-id").innerText = parsed_payload.nickname;
  document.getElementById("profile-email").innerText = parsed_payload.email;
    
  const profile_createbtn = document.getElementById("profile-btn");

  // 프로필 이미지 불러오기
  const profileImg = document.getElementById('my_profile_img')

  // 서버에서 프로필 이미지 URL 가져오기
  fetch(`http://127.0.0.1:8000/api/user/profile/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.profile_img) {
      // 이미지 URL이 있는 경우
      const mediaUrl = 'http://127.0.0.1:8000';
      const imageUrl = mediaUrl + data.profile_img;
      profileImg.src = imageUrl
    } else {
      // 이미지 URL이 없는 경우 기본 이미지 사용
      profileImg.src = "../img/user.png";
    }
  })
  .catch(error => {
  });
  
  // 프로필 생성버튼
  profile_createbtn.addEventListener("click", () => {
    
    window.location.href=`http://127.0.0.1:5500/assets/html/mypage.html?id=${userId}`
  });

}
  