import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = async function bookReviewList() {
  const access = localStorage.getItem('access_token');
  let curPage = 1;
  let response_json;

  async function fetchBookReviewList(page) {
    const response = await fetch(backend + '/bookreview/list/?page=' + page, {method: 'GET'})
    response_json = await response.json()

    const bookreview_list = document.querySelector('tbody');
    bookreview_list.innerHTML = '';

    // 데이터가 존재하지 않을 때 보여줄 메세지
    if (response_json.results.length === 0) {
      const noDataMessage = document.createElement('p');
      noDataMessage.innerText = '데이터가 존재하지 않습니다.'
      bookreview_list.appendChild(noDataMessage);
      return;
    }

    // 리스트에 데이터 출력
    for (let bookData of response_json.results) {
      let bookreview = document.createElement('tr');

      bookreview.innerHTML = `
        <td>${bookData.id}</td>
        <td>${bookData.category}</td>
        <td>
            <p class="review-book-title"><a href="${frontend}/assets/html/bookReviewDetail.html?id=${bookData.id}">${bookData.review_title}</a></p>
            <div class="review-book-hashtag">
              <p>#Django</p>
              <p>#Django</p>
              <p>#Django</p>
            </div>
        </td>
        <td>${bookData.writer_nickname}</td>
        <td>${bookData.created_at}</td>
        <td>${bookData.view_count}</td>
      `
      bookreview_list.appendChild(bookreview);
    }

    // Pagination btn 처리하기
    const paginationDiv = document.getElementsByClassName('pagination')[0];
    paginationDiv.innerHTML = '';

    // previous button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('prev');
    prevBtn.onclick = () => { curPage--; fetchBookReviewList(curPage); };
    paginationDiv.appendChild(prevBtn);

    // 페이지 번호 버튼
    const totalPageCount = Math.ceil(response_json / 5);

    for (let i = 1; i <= totalPageCount; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.classList.add('pagination-btn');
      pageBtn.innerText = i;
      pageBtn.onclick = () => { curPage = i; fetchBookReviewList(curPage); };
      paginationDiv.appendChild(pageBtn);
    }

    // next button
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('next');
    nextBtn.onclick = () => { curPage++; fetchBookReviewList(curPage); };
    paginationDiv.appendChild(nextBtn);
  }

  fetchBookReviewList(curPage);

  // 서평등록 button event
  const createReviewButton = document.querySelector('.review-create-btn');

  if (!access) {
    createReviewButton.addEventListener('click', () => {
      location.href="../html/login.html";
    });
  } else {
    createReviewButton.addEventListener('click', () => {
      location.href="../html/createBookReview.html";
    });
  };

  // filter-btn 전체
  document.querySelector('.all').addEventListener('click', () => {
    fetchBookReviewList(curPage);
  })

  // filter-btn 사회 정치
  document.querySelector('.social').addEventListener('click', () => {
    filterByCategory('사회/정치');
  })

  // filter-btn 소설/시/희곡
  document.querySelector('.poetry').addEventListener('click', () => {
    filterByCategory('소설/시/희곡');
  })

  // filter-btn 어린이
  document.querySelector('.children').addEventListener('click', () => {
    filterByCategory('어린이');
  })

  // filter-btn 여행
  document.querySelector('.trip').addEventListener('click', () => {
    filterByCategory('여행');
  })

  // filter-btn 역사
  document.querySelector('.history').addEventListener('click', () => {
    filterByCategory('역사');
  })

  // filter-btn 예술
  document.querySelector('.art').addEventListener('click', () => {
    filterByCategory('예술');
  })
  
  // filter-btn 인문
  document.querySelector('.liberal').addEventListener('click', () => {
    filterByCategory('인문');
  })
  
  // filter-btn 인물
  document.querySelector('.human').addEventListener('click', () => {
    filterByCategory('인물');
  })
  
  // filter-btn 자기계발
  document.querySelector('.self-improvement').addEventListener('click', () => {
    filterByCategory('자기계발');
  })
  
  // filter-btn 자연과학
  document.querySelector('.natural').addEventListener('click', () => {
    filterByCategory('자연과학');
  })
  
  // filter-btn 잡지
  document.querySelector('.magazine').addEventListener('click', () => {
    filterByCategory('잡지');
  })
  
  // filter-btn 종교
  document.querySelector('.religion').addEventListener('click', () => {
    filterByCategory('종교');
  })

  // filter-btn 청소년
  document.querySelector('.teenager').addEventListener('click', () => {
    filterByCategory('청소년');
  })




  // 카테고리 조건 필터링 함수
  function filterByCategory(category) {
    const filterBooks = response_json.results.filter((bookData) => {
      return bookData.category === category;
    });

    // filtering 결과가 없을 때 메세지 표시하기
    if (filterBooks.length === 0) {
      const bookreview_list = document.querySelector('tbody');
      bookreview_list.innerHTML = '';
      const noDataMessage = document.createElement('p');
      noDataMessage.innerText = '데이터가 존재하지 않습니다.'
      bookreview_list.appendChild(noDataMessage);
      return;
    }

    // filtering 화면 출력
    const bookreview_list = document.querySelector('tbody');
    bookreview_list.innerHTML = '';

    for (let bookData of filterBooks) {
      let bookreview = document.createElement('tr');

      bookreview.innerHTML = `
        <td>${bookData.id}</td>
        <td>${bookData.category}</td>
        <td>
            <p class="review-book-title"><a href="#">${bookData.review_title}</a></p>
            <div class="review-book-hashtag">
              <p>#Django</p>
              <p>#Django</p>
              <p>#Django</p>
            </div>
        </td>
        <td>${bookData.writer_nickname}</td>
        <td>${bookData.created_at}</td>
        <td>${bookData.view_count}</td>
      `
      bookreview_list.appendChild(bookreview);
    }
  }
}