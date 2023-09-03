window.onload = async function bookList() {
  const payload = localStorage.getItem('payload')
  const parsed_payload = JSON.parse(payload)


  const response = await fetch('http://127.0.0.1:8000/book/list/', { method: 'GET' })
  const response_json = await response.json()

  const book_list = document.getElementsByClassName('book-list')[0]; // book-list는 하나라고 가정하고 [0]으로 첫 번째 요소를 선택합니다.

  for (let bookData of response_json.results) {
      let book = document.createElement('div');
      book.className = 'book'; // 클래스 이름을 'book'으로 설정합니다.

      const mediaUrl = 'http://127.0.0.1:8000';
      const imageUrl = mediaUrl + bookData.image;

      book.innerHTML = `
      <input type="checkbox" class="checkbox">
      <img src="${imageUrl}" alt="Book Cover" />
      <div class="book-details">
        <p class="book-name">${bookData.title}</p>
        <ul class="book-info">
          <li class="book2">${bookData.author} 저</li>
          <li class="book2">${bookData.publisher}</li>
          <li>EST Soft</li>
        </ul>
        <ul class="book-status">
          <li class="book3">상태 : ${bookData.condition}</li>
          <li class="book3">원가 : ${bookData.original_price}원</li>
          <li>판매가 : ${bookData.selling_price}원</li>
        </ul>
      </div>
      <ul class="info">
        <li class="saler">판매자 : ${parsed_payload.nickname} <!-- 판매자 별명 정보가 없어서 그대로 두었습니다. --></li>
      </ul>
      <a class="check-item" href="http://127.0.0.1:5500/assets/html/bookdetail.html?id=${bookData.id}/">상품 확인하기</a>
      </div>
      `;

      book_list.appendChild(book);
  }
}