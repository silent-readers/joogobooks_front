document.getElementById("confirm-button").addEventListener("click", function () {
  var username = document.getElementById("ID").value;

  // 아이디가 비어있는지 확인
  if (!username) {
    alert("아이디를 입력하세요.");
    return;
  }

  // API 요청
  fetch("http://127.0.0.1:8000/api/user/resetpassword/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.message === "해당 유저는 존재하지 않습니다.") {
        alert("해당 아이디로 등록된 사용자를 찾을 수 없습니다.");
      } else {
        // 비밀번호 변경 폼을 표시하고, 아이디 입력란을 비활성화
        document.getElementById("password-change-form").style.display = "block";
        document.getElementById("input-id-form").style.display = "none";
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
});

document.getElementById("change-password-button").addEventListener("click", function () {
  var new_password = document.getElementById("new-password").value;
  var confirm_password = document.getElementById("confirm-password").value;

  // 비밀번호와 비밀번호 확인이 일치하는지 검사
  if (new_password !== confirm_password) {
    alert("비밀번호가 서로 일치하지 않습니다.");
    return;
  }

  // API 요청
  fetch("http://127.0.0.1:8000/api/user/resetpassword/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: document.getElementById("ID").value,
      new_password: new_password,
      confirm_password: confirm_password,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.message === "비밀번호가 성공적으로 변경되었습니다.") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        window.location.href = "/assets/html/login.html";
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
});