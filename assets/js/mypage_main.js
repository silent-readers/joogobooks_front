document.addEventListener("DOMContentLoaded", function () {
    const nicknameInput = document.getElementById("nickname");
    const aboutMeInput = document.getElementById("aboutme");
    const profileForm = document.querySelector(".profile-container");
    const profileBtn = document.getElementById("profile-btn");
    const userProfile = document.getElementById("user-profile");
    const usernameElem = document.querySelector(".username");
    const emailElem = document.querySelector(".email");
  
    // JWT 토큰에서 payload 정보 가져오기
    function getPayloadFromToken() {
      const token = localStorage.getItem("access_token");
      if (token) {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        return payload;
      }
      return null;
    }
  
    // 현재 로그인한 유저 ID 가져오기
    function getCurrentUserId() {
      const payload = getPayloadFromToken();
      if (payload) {
        return payload.user_id;
      }
      return null;
    }
  
    // 프로필 조회 및 표시
    async function viewProfile() {
      const userId = getCurrentUserId();
  
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/profile/${userId}`,
          {
            method: "GET",
          }
        );
  
        if (response.ok) {
          const profileData = await response.json();
          nicknameInput.value = profileData.nickname;
          aboutMeInput.value = profileData.about_me;
        } else {
          console.error("프로필 조회에 실패했습니다.");
        }
      } catch (error) {
        console.error("프로필 조회 중 오류 발생:", error);
      }
    }
  
    // 프로필 수정 처리
    async function updateProfile(event) {
      event.preventDefault();
      const userId = getCurrentUserId();
      const nickname = nicknameInput.value;
      const aboutMe = aboutMeInput.value;
  
      const access_token = localStorage.getItem("access_token");
  
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("about_me", aboutMe);
  
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/profile/${userId}/update`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            method: "PUT",
            body: formData,
          }
        );
  
        if (response.ok) {
          console.log("프로필이 수정되었습니다.");
          viewProfile();
        } else {
          console.error("프로필 수정에 실패했습니다.");
        }
      } catch (error) {
        console.error("프로필 수정 중 오류 발생:", error);
      }
    }
  
    // 프로필 조회 및 수정 동작
    viewProfile();
  
    // 프로필 변경 버튼 클릭 시
    profileForm.addEventListener("submit", updateProfile);
  });
  