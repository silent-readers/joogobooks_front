import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = async function () {
  // URL에서 id 값을 추출합니다.
  const urlParams = new URLSearchParams(window.location.search);
  const bookreviewId = urlParams.get('id');

  const access_token = localStorage.getItem('access_token')
  const payload = localStorage.getItem('payload');
  const parsed_payload = JSON.parse(payload)
  const username = parsed_payload.user_id

  // 해당 id로 API를 호출하여 책 정보를 가져옵니다.
  const response = await fetch(backend + `/bookreview/${bookreviewId}/`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }, 
    method: 'GET' 
  });
  const bookreviewData = await response.json();
  console.log(bookreviewData)

  // bookreview title content data
  const bookReviewTitleContent = document.getElementsByClassName('bookreview-title-info')[0];

  bookReviewTitleContent.innerHTML = `
    <h2>${bookreviewData.review_title}</h2>
    <div class="bookreview-content-info">
      <p>조회수 : ${bookreviewData.view_count}</p>
      <p>작성일자 : ${bookreviewData.created_at}</p>
      <p>작성자 : ${bookreviewData.writer_nickname}</p>
    </div>
  `

  // bookreview content data
  const bookReviewContent = document.getElementsByClassName('bookreview-content-bookinfo')[0];

  bookReviewContent.innerHTML = `
    <h3>책  제목 : ${bookreviewData.book_title}</h3>
    <h3>책  저자 : ${bookreviewData.book_author}</h3>
    <h3>출 판 사 : ${bookreviewData.book_publisher}</h3>
    <h3>평    점 : ${bookreviewData.rating}</h3>
    <p>${bookreviewData.review}</p>
  `
}