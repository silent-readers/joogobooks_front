import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = async function bookList() {
  let currentPage = 1;
  let response_json;

  async function fetchBooks(page) {
    const response = await fetch(backend + '/book/list/?page=' + page, { method: 'GET' })
    response_json = await response.json()
    console.log(response_json);

    // book-list는 하나라고 가정하고 [0]으로 첫 번째 요소를 선택합니다.
    const book_list = document.getElementsByClassName('book-list')[0];
    book_list.innerHTML = "";

    if (response_json.results.length === 0) {
      const noDataMessage = document.createElement('p');
      noDataMessage.innerText = "데이터가 존재하지 않습니다.";
      book_list.appendChild(noDataMessage);
      return;
    }

    for (let bookData of response_json.results) {
      let book = document.createElement('div');
      book.className = 'book'; // 클래스 이름을 'book'으로 설정합니다.

      const mediaUrl = backend;
      const imageUrl = mediaUrl + bookData.image;

      let saleConditionClass = ''; // 판매 조건에 따른 클래스 이름을 저장하기 위한 변수

      // 판매 조건에 따라 클래스 이름 설정
      switch (bookData.sale_condition_display) {
        case '판매중':
          saleConditionClass = 'sale-green';
          break;
        case '판매진행중':
          saleConditionClass = 'sale-orange';
          break;
        case '판매완료':
          saleConditionClass = 'sale-red';
          break;
        default:
          break;
      }

      book.innerHTML = `
      <p class="book-index">${bookData.id}</p>
      <p id="book-sale-condition" class="book-sale-condition ${saleConditionClass}">${bookData.sale_condition_display}</p>
      <img src="${imageUrl}" alt="Book Cover" />
      <div class="book-details">
        <p class="book-name">${bookData.title}</p>
        <ul class="book-info">
          <li class="book2">${bookData.author} 저</li>
          <li class="book2">${bookData.publisher}</li>
          <li class="upload-date">판매등록일 : ${bookData.uploaded_at}</li>
        </ul>
        <ul class="book-status">
          <li class="book3">상태 : ${bookData.condition}</li>
          <li class="book3">원가 : ${bookData.original_price}원</li>
          <li class="book3">판매자 : ${bookData.writer_nickname}</li>
        </ul>
      </div>
      <ul class="info">
        <li class="selling-price">판매가 : ${bookData.selling_price}원</li>
        
      </ul>
      <a class="check-item" href="${frontend}/assets/html/bookdetail.html?id=${bookData.id}/">상품 확인하기</a>
      </div>
      `;

      book_list.appendChild(book);
    }

    // Pagination btn 처리하기
    const paginationDiv = document.getElementsByClassName('page_nation')[0];
    paginationDiv.innerHTML = "";

    // p-previous button
    const pprevBtn = document.createElement('button');
    pprevBtn.classList.add('pprev');
    pprevBtn.onclick = () => { fetchBooks(1); };
    paginationDiv.appendChild(pprevBtn);

    // previous button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('prev');
    prevBtn.onclick = () => { currentPage--; fetchBooks(currentPage); };
    paginationDiv.appendChild(prevBtn);

    // 페이지 번호 버튼
    const totalPageCount = Math.ceil(response_json.count / 5);

    for (let i = 1; i <= totalPageCount; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.classList.add('page-btn');
      pageBtn.innerText = i;
      pageBtn.onclick = () => { currentPage = i; fetchBooks(currentPage); };
      paginationDiv.appendChild(pageBtn);
    }

    // next button
    const nextBtn = document.createElement('button');
      nextBtn.classList.add('next');
      nextBtn.onclick = () => { currentPage++; fetchBooks(currentPage); };
      paginationDiv.appendChild(nextBtn);

    // n-next button
    const nnextBtn = document.createElement('button');
    nnextBtn.classList.add('nnext');
    nnextBtn.onclick = () => { fetchBooks(totalPageCount); };
    paginationDiv.appendChild(nnextBtn);

  }

  // 초기 로드에서 첫번째 페이지 불러오기
  fetchBooks(currentPage);

  // filter-btn 전체
  document.querySelector('.filter-button-all').addEventListener('click', () => {
    fetchBooks(currentPage);
  })

  // filter-btn 판매중
  document.querySelector('.filter-button-sale').addEventListener('click', () => {
    filterBySaleCondition('판매중');
  })

  // filter-btn 판매진행중
  document.querySelector('.filter-button-in-progress').addEventListener('click', () => {
    filterBySaleCondition('판매진행중');
  })

  // filter-btn 판매완료
  document.querySelector('.filter-button-sold-out').addEventListener('click', () => {
    filterBySaleCondition('판매완료');
  })

  // 판매 조건 필터링 함수
  function filterBySaleCondition(saleCondition) {
    const filterBooks = response_json.results.filter((bookData) => {
      return bookData.sale_condition_display === saleCondition;
    });

    // 필터링된 결과가 없을 때 "데이터가 존재하지 않습니다." 메시지를 표시합니다.
    if (filterBooks.length === 0) {
      const book_list = document.getElementsByClassName('book-list')[0];
      book_list.innerHTML = "";
      const noDataMessage = document.createElement('p');
      noDataMessage.classList.add('nodata-text');
      noDataMessage.innerText = "데이터가 존재하지 않습니다.";
      book_list.appendChild(noDataMessage);
      return;
    }

    // 필터링된 결과를 화면에 출력합니다.
    const book_list = document.getElementsByClassName('book-list')[0];
    book_list.innerHTML = "";

    for (let bookData of filterBooks) {
      let book = document.createElement('div');
      book.className = 'book'; // 클래스 이름을 'book'으로 설정합니다.

      const mediaUrl = backend;
      const imageUrl = mediaUrl + bookData.image;

      let saleConditionClass = ''; // 판매 조건에 따른 클래스 이름을 저장하기 위한 변수

      // 판매 조건에 따라 클래스 이름 설정
      switch (bookData.sale_condition_display) {
        case '판매중':
          saleConditionClass = 'sale-green';
          break;
        case '판매진행중':
          saleConditionClass = 'sale-orange';
          break;
        case '판매완료':
          saleConditionClass = 'sale-red';
          break;
        default:
          break;
      }

      book.innerHTML = `
      <p class="book-index">${bookData.id}</p>
      <p id="book-sale-condition" class="book-sale-condition ${saleConditionClass}">${bookData.sale_condition_display}</p>
      <img src="${imageUrl}" alt="Book Cover" />
      <div class="book-details">
        <p class="book-name">${bookData.title}</p>
        <ul class="book-info">
          <li class="book2">${bookData.author} 저</li>
          <li class="book2">${bookData.publisher}</li>
          <li class="upload-date">판매등록일 : ${bookData.uploaded_at}</li>
        </ul>
        <ul class="book-status">
          <li class="book3">상태 : ${bookData.condition}</li>
          <li class="book3">원가 : ${bookData.original_price}원</li>
          <li class="book3">판매자 : ${bookData.writer_nickname}</li>
        </ul>
      </div>
      <ul class="info">
        <li class="selling-price">판매가 : ${bookData.selling_price}원</li>
        
      </ul>
      <a class="check-item" href="${frontend}/assets/html/bookdetail.html?id=${bookData.id}/">상품 확인하기</a>
      </div>
      `;

      book_list.appendChild(book);
    }
  }
}