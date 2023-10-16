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

  // 해시태그 정보 가져오기
  async function fetchHashTag(bookreviewId) {
    const response = await fetch(backend + `/bookreview/${bookreviewId}/hashtag/`, {method: 'GET'})
    const hashTagData = await response.json();
    return hashTagData;
  }

  // 해시태그 데이터
  let hashTags = await fetchHashTag(bookreviewData.id);
  console.log(hashTags)

  let hashtagDiv = document.getElementsByClassName("bookreview-hashtag")[0];

  for(let i=0; i<hashTags.length; i++){
    let p=document.createElement('p');
    let aTag=document.createElement('a');
    aTag.textContent=`#${hashTags[i].tagname}`;
    p.appendChild(aTag);
    hashtagDiv.appendChild(p);
  }

  // bookreview content data
  const bookReviewContent = document.getElementsByClassName('bookreview-content-bookinfo')[0];

  bookReviewContent.innerHTML = `
    <h3>책  제목 : ${bookreviewData.book_title}</h3>
    <h3>책  저자 : ${bookreviewData.book_author}</h3>
    <h3>출 판 사 : ${bookreviewData.book_publisher}</h3>
    <h3>평    점 : ${bookreviewData.rating}</h3>
    <p>${bookreviewData.review}</p>
  `

  // 수정 버튼
  document.getElementById('bookreview-update-btn').addEventListener('click', (e) => {
    e.preventDefault();

    if (username === bookreviewData.review_writer) {
      window.location.replace(frontend + `/assets/html/bookReviewUpdate.html?id=${bookreviewData.id}`)
    } else {
      alert("해당 기능은 작성자만 가능합니다.")
    }
  })

  // 삭제 버튼
  document.getElementById('bookreview-delete-btn').addEventListener('click', (e) => {
    if (username === bookreviewData.review_writer) {
      const response = fetch(backend + `/bookreview/${bookreviewData.id}/delete/`, {
        headers: {
            'Authorization': `Bearer ${access_token}` 
        },
        method: 'DELETE',
    })
    .then((res) => {
        console.log(res)
        if (res.ok) {
            alert('해당 도서정보가 삭제되었습니다.')
            window.location.replace(frontend + '/assets/html/bookReviewList.html')
        } else {
            alert('해당 정보를 삭제할 수 없습니다!');
        }
    })
    .catch((err) => {
        alert(err);
    })
    }
  })
}