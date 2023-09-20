import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = async function bookList() {
  let currentPage = 1;
  const payload = localStorage.getItem('payload')
  const parsed_payload = JSON.parse(payload)


  async function fetchBooks(page) {
    const response = await fetch(backend + '/book/list/?page=' + page, { method: 'GET' })
    const response_json = await response.json()
    console.log(response_json);

    // book-list는 하나라고 가정하고 [0]으로 첫 번째 요소를 선택합니다.
    const book_list = document.getElementsByClassName('book-list')[0];
    book_list.innerHTML = "";

    for (let bookData of response_json.results) {
      let book = document.createElement('div');
      book.className = 'book'; // 클래스 이름을 'book'으로 설정합니다.

      const mediaUrl = backend;
      const imageUrl = mediaUrl + bookData.image;

      book.innerHTML = `
      <p class="book-index">${bookData.id}</p>
      <p class="book-sale-condition">${bookData.sale_condition_display}</p>
      <img src="${imageUrl}" alt="Book Cover" />
      <div class="book-details">
        <p class="book-name">${bookData.title}</p>
        <ul class="book-info">
          <li class="book2">${bookData.author} 저</li>
          <li class="book2">${bookData.publisher}</li>
          <li class="upload-date">등록일 : ${bookData.uploaded_at}</li>
        </ul>
        <ul class="book-status">
          <li class="book3">상태 : ${bookData.condition}</li>
          <li class="book3">원가 : ${bookData.original_price}원</li>
          <li>판매가 : ${bookData.selling_price}원</li>
        </ul>
      </div>
      <ul class="info">
        <li class="saler">판매자 : ${bookData.writer_nickname}</li>
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
    console.log(totalPageCount);

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
}