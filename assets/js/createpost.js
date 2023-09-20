import { backend } from "./url.js";
import { frontend } from "./url.js";

const access_token = localStorage.getItem('access_token')

document.addEventListener("DOMContentLoaded", () => {
  // 이미지 첨부하기 버튼 이벤트
  const attachImageBtn = document.getElementById('attachImageButton');
  const imageInput = document.getElementById('imageInput');
  const bookCoverImg = document.getElementById('book-cover');

  attachImageBtn.addEventListener('click', () => {
    imageInput.click();
  })

  // 이미지 선택 시 미리보기 업데이트
  imageInput.addEventListener('change', () => {
      const reader = new FileReader();
      reader.onload = function(e) {
        bookCoverImg.src =  e.target.result;
      }
      reader.readAsDataURL(imageInput.files[0]);

    }
  )

  // 이미지 파일을 포함한 데이터 전송
  const createPostBtn = document.getElementById('register');
  createPostBtn.addEventListener('click', async function(e) {
    e.preventDefault();

    const formData = new FormData();

    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload)
    const writer = parsed_payload.user_id;
    const date = new Date().toISOString();

    formData.append('image', imageInput.files[0]);
    formData.append('title', document.getElementById('titleInput').value);
    formData.append('writer', writer);
    formData.append('author', document.getElementById('authorInput').value);
    formData.append('publisher', document.getElementById('publisherInput').value);
    formData.append('condition', document.getElementById('actionSelect').value);
    formData.append('original_price', document.getElementById('regularPriceInput').value);
    formData.append('selling_price', document.getElementById('salePriceInput').value);
    formData.append('detail_info', document.getElementById('detailInfo').value);
    formData.append('sale_condition', '판매중');
    formData.append('uploaded_at', date);

    console.log(formData);

    const response = await fetch(backend + '/book/create/', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        },
        method: 'POST',
        body: formData
      })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => { throw err });
        }
        return res;
      })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        if (data) {
          alert("도서 정보 등록이 완료되었습니다.");
          console.log("성공적으로 데이터가 전송되었습니다.");
          window.location.replace(frontend + '/assets/html/shop.html')
        } else {
          alert("도서 정보 등록에 실패했습니다.");
          console.log("데이터 전송 중 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        alert(error.message || "오류가 발생했습니다.");
        console.error(error)
      })
  })

})



