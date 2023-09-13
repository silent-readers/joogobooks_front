import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = async function() {
    // URL에서 id 값을 추출합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    const access_token = localStorage.getItem('access_token')
    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload)
    const username = parsed_payload.user_id

    // 해당 id로 API를 호출하여 책 정보를 가져옵니다.
    const response = await fetch(backend+ `/book/${bookId}`, { method: 'GET' });
    const bookData = await response.json();

    const mediaUrl = backend;
    const imageUrl = mediaUrl + bookData.image;

    const imgChange = document.getElementById('bookdetail-img');
    imgChange.setAttribute('src', `${imageUrl}`)

    const bookDetailDiv = document.getElementsByClassName('bookdetail-info-text')[0];
    
    let innerHTMLContent = `
        <ul class="bookdetail-category">
            <p>판매중</p>
        </ul>
        <div class="bookdetail-title">
            <h2>${bookData.title}</h2>
        </div>
        <ul class="bookdetail-publish">
            <li>${bookData.author} 저</li>
            <li>${bookData.publisher}</li>
        </ul>
        <ul class="bookdetail-status">
            <li>상태 : ${bookData.condition}</li>
            <li>판매가 : ${bookData.selling_price}원 (정가 : ${bookData.original_price}원)</li>
        </ul>
        <ul class="bookdetail-sailer">
            <li>판매자 : ${parsed_payload.nickname}</li>
        </ul>
        <ul class="bookdetail-about">
            <li>${bookData.detail_info}</li>
        </ul>
    `;

    if (bookData.writer == username) {
        innerHTMLContent += `
        <div class="bookdetail-btn">
            <a href="./updatePost.html?id=${bookData.id}">정보수정</a>
            <button id="book_deletebtn" class="delete-btn-book">정보 삭제하기</button>
        </div>
        `
    } else {
        innerHTMLContent += `
        <div class="bookdetail-btn">
            <button id="chat-btn" class="chat-btn">채팅하기</button>
        </div>
        `
    }

    bookDetailDiv.innerHTML = innerHTMLContent;

    const del_btn = document.getElementById('book_deletebtn');
    if (del_btn) {
        del_btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const response = await fetch(backend + `/book/${bookData.id}/delete/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}` 
                },
                method: 'DELETE',
            })
            .then((res) => {
                console.log(res)
                if (res.ok) {
                    alert('해당 도서정보가 삭제되었습니다.')
                    window.location.replace(frontend + '/assets/html/shop.html')
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
                const response = await fetch(backend + '/api/chat/new/', {
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
                const chatUrl = frontend + `/assets/html/chat.html?room_id=${chatRoomData.id}&guest_id=${bookData.writer}`;
                
                window.location.replace(chatUrl);
            
            } catch (error) {
                alert(error.message || "오류가 발생했습니다.");
                console.error(error);
            }
        });
    }
}
