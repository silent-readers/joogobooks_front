// JavaScript 파일
import { backend } from "./url.js";
import { frontend } from "./url.js";

// HTML 요소들을 가져옵니다.
const imageInput = document.getElementById('imageInput');
const profileImg = document.getElementById('my_img');
const userImg = document.getElementById('my_profile_img');
const nicknameInput = document.getElementById('nickname');
const nickname = document.getElementById('profile-id');
const aboutMeInput = document.getElementById('aboutme2');
const aboutMe = document.getElementById('aboutme');
const profileUpdateButton = document.getElementById('profile-putbtn');
const attachImageButton = document.getElementById('attachImageButton'); // 이미지 변경 버튼 추가

// 이미지 변경 버튼 클릭 시 파일 업로드 창 열기
attachImageButton.addEventListener('click', () => {
  imageInput.click();
});

// 이미지 선택 시 미리보기 업데이트
imageInput.addEventListener('change', () => {
  if (imageInput.files.length > 0) {
    const selectedFile = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      profileImg.src = e.target.result;
    };

    reader.readAsDataURL(selectedFile);

  } else {
    console.log('파일이 선택되지 않았습니다.');
  }
});

console.log(imageInput.files);

// 사용자 정보를 불러오는 함수
async function loadUserProfile() {
  try {
    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload);
    const userId = parsed_payload.user_id;

    // 사용자 정보를 서버에서 가져옵니다.
    const response = await fetch(backend + `/api/user/profile/${userId}/`, { method: 'GET' });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.detail || '사용자 정보를 불러올 수 없습니다.');
    }

    const userData = await response.json();

    // 가져온 사용자 정보를 화면에 표시합니다.
    profileImg.src = backend + userData.profile_img;
    userImg.src = backend + userData.profile_img;

    nicknameInput.value = userData.nickname;
    nickname.innerHTML = userData.nickname;

    aboutMeInput.value = userData.about_me || '본인에 대한 한줄 소개를 작성해주세요.';
    aboutMe.innerHTML = userData.about_me || '본인에 대한 한줄 소개를 작성해주세요.';

  } catch (error) {
    alert(error.message || "오류가 발생했습니다.");
    console.error(error);
  }
}

// 페이지 로드 시 사용자 정보를 불러옵니다.
window.onload = loadUserProfile;

// 프로필 수정 버튼 클릭 시
profileUpdateButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const formData = new FormData();

  if (imageInput.files[0]) {
    formData.append('profile_img', imageInput.files[0]);
  }
  formData.append('nickname', nicknameInput.value);
  formData.append('about_me', aboutMeInput.value);

  try {
    const access_token = localStorage.getItem('access_token');
    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload);
    const userId = parsed_payload.user_id;

    // 프로필 정보를 서버로 업데이트합니다.
    const response = await fetch(`${backend}/api/user/profile/${userId}/update/`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.detail || '프로필 수정이 실패했습니다.');
    }

    alert("프로필이 수정되었습니다.");
    window.location.replace(frontend + '/assets/html/mypage_main.html');
  } catch (error) {
    alert(error.message || "오류가 발생했습니다.");
    console.error(error);
  }
});
