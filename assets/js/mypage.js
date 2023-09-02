window.onload = async function() {
  // URL에서 id 값을 추출합니다.

  const access_token = localStorage.getItem('access_token')
  const payload = localStorage.getItem('payload');
  const parsed_payload = JSON.parse(payload)
  const userId = parsed_payload.user_id;

  document.getElementById("profile-id").innerText = parsed_payload.nickname;

  // 프로필 이미지 불러오기
  const profileImg = document.getElementById('my_img')

  // 서버에서 프로필 이미지 URL 가져오기
  fetch(`http://127.0.0.1:8000/api/user/profile/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.profile_img)
    if (data.profile_img) {
      // 이미지 URL이 있는 경우
      const mediaUrl = 'http://127.0.0.1:8000';
      const imageUrl = mediaUrl + data.profile_img;
      console.log(imageUrl)
      profileImg.src = imageUrl
    } else {
      // 이미지 URL이 없는 경우 기본 이미지 사용
      profileImg.src = "../img/user.png";
    }
  })
  .catch(error => {
  });


  // 이미지 첨부하기 버튼 이벤트
  const attachImageBtn = document.getElementById('attachImageButton');
  const imageInput = document.getElementById('imageInput');
  const CovermyImg = document.getElementById('my_img');

  attachImageBtn.addEventListener('click', () => {
    imageInput.click();
  })

  // 이미지 선택 시 미리보기 업데이트
  imageInput.addEventListener('change', () => {
      const reader = new FileReader();
      reader.onload = function(e) {
        CovermyImg.src =  e.target.result;
      }
      reader.readAsDataURL(imageInput.files[0]);

    }
  )

  const profile_btn = document.getElementById('profile-putbtn');
 
  profile_btn.addEventListener('click', async function(e) {
      e.preventDefault();

      const formData = new FormData();

      if (imageInput.files[0]) {
          formData.append('profile_img', imageInput.files[0]);
      }
      formData.append('nickname', document.getElementById('nickname').value);
      formData.append('about_me', document.getElementById('aboutme').value);

      try {
          const response = await fetch(`http://127.0.0.1:8000/api/user/profile/${userId}/create`, {
              headers: {
                  'Authorization': `Bearer ${access_token}`
              },
              method: 'POST',
              body: formData
          });

          if (!response.ok) {
            const responseData = await response.json(); // 서버에서 반환한 오류 메시지 파싱
            throw new Error(responseData.detail || '프로필 생성이 실패했습니다.');
          }

          alert("프로필이 생성되었습니다.");
          window.location.replace('http://127.0.0.1:5500/assets/html/mypage_main.html');
      } catch (error) {
          alert(error.message || "오류가 발생했습니다.");
          console.error(error);
      }
  });
}
