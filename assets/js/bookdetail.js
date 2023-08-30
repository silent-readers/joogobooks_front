window.onload = async function() {
    // URL에서 id 값을 추출합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload)
    const username = parsed_payload.user_id

    // 해당 id로 API를 호출하여 책 정보를 가져옵니다.
    const response = await fetch(`http://127.0.0.1:8000/book/${bookId}`, { method: 'GET' });
    const bookData = await response.json();

    const bookDetailDiv = document.getElementsByClassName('book-list')[0];
    const bookDetail = document.createElement('div');
    bookDetail.classList.add('book');
    bookDetail.innerHTML = `
        <img src="${bookData.image}" alt="Book Cover"> 
        <div class="book-details">
            <h5>${bookData.sale_condition}</h5>
            <p class="book-name">${bookData.title}</p>
            <ul class="book-info">
                <li class="book2">${bookData.author}</li>
                <li class="book2">${bookData.publisher}</li>
            </ul>
            <ul class="book-status">
                <li class="book3">상태 : ${bookData.condition}</li>
                <li class="book3">판매가 : ${bookData.selling_price}원</li>
                <li>(정가 : ${bookData.original_price}원)</li>
            </ul>
            <ul class="info">
                <li class="saler">판매자 : [별명]</li>
            </ul>
            <ul class="exp">
                <p>${bookData.detail_info}</p>
            </ul>
        </div>
    `;
    if (bookData.writer == username) {
        bookDetail.innerHTML += `
        <button class="chat"><a href="./updatePost.html?id=${bookData.id}">정보 수정하기</a></button>
        `
    } else {
        bookDetail.innerHTML += `
        <button class="chat"><a href="./Chat.html">채팅하기</a></button>
        `
    }
    bookDetailDiv.appendChild(bookDetail);
}
