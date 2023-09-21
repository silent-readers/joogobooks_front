import { backend } from "./url.js";
import { frontend } from "./url.js";

const searchSelect = document.getElementById('header_searchSelect');
const searchInput = document.querySelector('.header_searchInput');
const searchButton = document.querySelector('.search-button');
const bookList = document.querySelector('.book-list');

let currentPage = 1; 

// 검색 함수
async function searchBooks() {
    const condition = searchSelect.value;
    const query = searchInput.value;
    const conditionQuery = condition === '전체' ? '' : `&sale_condition=${condition}`;

    try {
        const response = await fetch(backend + `/book/search/?title__icontains=${query}${conditionQuery}&page=${currentPage}`);

        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
            displayBooks(data.results, data.count);
        } else {
            console.error('Invalid data format:', data);
            alert('검색 결과를 가져올 수 없습니다.');
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 검색 결과 표시 함수
function displayBooks(books, totalCount) {
    const payload = localStorage.getItem('payload')
    const parsed_payload = JSON.parse(payload)

    bookList.innerHTML = ''; 
    
    const itemsPerPage = 5;
    const startNumber = (currentPage - 1) * itemsPerPage + 1;

    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';

        // 현재 글 번호 계산
        const currentNumber = startNumber + i;

        bookDiv.innerHTML = `
            <ul class="number_list">
                <li class="number_item">${currentNumber}</li>
            </ul>
            <img src="${book.image}" alt="Book Cover" /> 
            <div class="book-details">
                <p class="book-name">${book.title}</p>
                <ul class="book-info">
                  <li class="book2">${book.author} 저</li>
                  <li class="book2">${book.publisher}</li>
                </ul>
                <ul class="book-status">
                  <li class="book3">상태 : ${book.condition}</li>
                  <li class="book3">원가 : ${book.original_price}원</li>
                  <li>판매가 : ${book.selling_price}원</li>
                </ul>
            </div>
            <ul class="info">
            <li class="saler">판매자 : ${book.writer_nickname}</li>
          </ul>
          <a class="check-item" href="${frontend}/assets/html/bookdetail.html?id=${book.id}/">상품 확인하기</a>
        `;

        bookList.appendChild(bookDiv);
    };

    displayPagination(totalCount);
}

function displayPagination(totalCount) {
    // Pagination btn 처리하기
    const paginationDiv = document.getElementsByClassName('page_nation')[0];
    paginationDiv.innerHTML = "";

    // p-previous button
    const pprevBtn = document.createElement('button');
    pprevBtn.classList.add('pprev');
    pprevBtn.onclick = () => { currentPage = 1; searchBooks(); };
    paginationDiv.appendChild(pprevBtn);

    // previous button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('prev');
    prevBtn.onclick = () => { currentPage--; searchBooks(currentPage); };
    paginationDiv.appendChild(prevBtn);

    // 페이지 번호 버튼
    const totalPageCount = Math.ceil(totalCount / 5);
    console.log(totalPageCount);

    for (let i = 1; i <= totalPageCount; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.classList.add('page-btn');
      pageBtn.innerText = i;
      pageBtn.onclick = () => { currentPage = i; searchBooks(currentPage); };
      paginationDiv.appendChild(pageBtn);
    }

    // next button
    const nextBtn = document.createElement('button');
      nextBtn.classList.add('next');
      nextBtn.onclick = () => { currentPage++; searchBooks(currentPage); };
      paginationDiv.appendChild(nextBtn);

    // n-next button
    const nnextBtn = document.createElement('button');
    nnextBtn.classList.add('nnext');
    nnextBtn.onclick = () => { currentPage = totalPageCount; searchBooks(); };
    paginationDiv.appendChild(nnextBtn);
}


// 검색 버튼 이벤트 리스너
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 1;
    searchBooks();
});
