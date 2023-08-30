const searchSelect = document.getElementById('header_searchSelect');
const searchInput = document.querySelector('.header_searchInput');
const searchButton = document.querySelector('.search-button');
const bookList = document.querySelector('.book-list');

// 검색 함수
async function searchBooks() {
    const condition = searchSelect.value;
    const query = searchInput.value;

    try {
        const response = await fetch(`http://127.0.0.1:8000/book/search/?title=${query}&sale_condition=${condition}`);
        const data = await response.json();

        // results 키가 존재하고, 해당 키의 값이 배열인지 확인
        if (data.results && Array.isArray(data.results)) {
            displayBooks(data.results);
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
function displayBooks(books) {
    bookList.innerHTML = ''; 
    
    for (const book of books) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        

        bookDiv.innerHTML = `
            <ul class="number_list">
                <li class="number_item">${book.sale_condition}</li>
            </ul>
            <img src="${book.cover_image}" alt="Book Cover" /> 
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
                <div class="book-exp">
                    <p>${book.detail_info}</p>
                </div>
            </div>
            <ul class="info">
            <li class="saler">판매자 : ${book.writer}</li>
          </ul>
          <button class="check-item"><a href="./Book Detail.html">상품 확인하기</a></button>
        `;

        bookList.appendChild(bookDiv);
    };
}

// 검색 버튼 이벤트 리스너
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchBooks();
});
