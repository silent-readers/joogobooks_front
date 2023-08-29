document.addEventListener("DOMContentLoaded", function () {
  const attachImageButton = document.getElementById("attachImageButton");
  const imageInput = document.getElementById("imageInput");

  attachImageButton.addEventListener("click", function () {
    imageInput.click(); // 클릭 이벤트 발생
  });
});
