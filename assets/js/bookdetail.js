window.onload = async function() {
    // URL에서 id 값을 추출합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    const access_token = localStorage.getItem('access_token')
    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload)
    const username = parsed_payload.user_id

    // 해당 id로 API를 호출하여 책 정보를 가져옵니다.
    const response = await fetch(`http://127.0.0.1:8000/book/${bookId}`, { method: 'GET' });
    const bookData = await response.json();

    console.log(bookData)

    const bookDetailDiv = document.getElementsByClassName('book-list')[0];
    const bookDetail = document.createElement('div');
    bookDetail.classList.add('book');

    let innerHTMLContent = `
        <div class="book-img">
            <img src="${bookData.image}" alt="Book Cover">
        </div>
        <div class="book-detail">
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
        innerHTMLContent += `
        <a class="chat" href="./updatePost.html?id=${bookData.id}">정보 수정하기</a>
        <button id="book_deletebtn" class="chat">정보 삭제하기</button>
        `
    } else {
        innerHTMLContent += `
        <button id="chat-btn" class="chat">채팅하기</button>
        `
    }
    bookDetail.innerHTML = innerHTMLContent;
    bookDetailDiv.appendChild(bookDetail);

    const del_btn = document.getElementById('book_deletebtn');
    if (del_btn) {
        del_btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const response = await fetch(`http://127.0.0.1:8000/book/${bookData.id}/delete/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}` 
                },
                method: 'DELETE',
            })
            .then((res) => {
                console.log(res)
                if (res.status === 204) {
                    alert('해당 도서정보가 삭제되었습니다.')
                    window.location.replace('http://127.0.0.1:5500/assets/html/shop.html')
                } else {
                    alert('해당 정보를 삭제할 수 없습니다!');
                }
            })
            .catch((err) => {
                alert(err);
            })
        });
    }

    const chat_btn = document.getElementById('chat-btn');
    if (chat_btn) {
        chat_btn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch('http://127.0.0.1:8000/api/chat/new/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        room_id: bookData.id,
                        host: username,
                        guest: bookData.writer,
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail);
                }

                const chatRoomData = await response.json();
                const chatUrl = `http://127.0.0.1:5500/assets/html/chat.html?room_id=${chatRoomData.id}&guest_id=${bookData.writer}`;
                
                window.location.replace(chatUrl);
            
            } catch (error) {
                alert(error.message || "오류가 발생했습니다.");
                console.error(error);
            }
        });
    }
}
