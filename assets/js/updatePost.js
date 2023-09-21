import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = async function() {
    // URL에서 id 값을 추출합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    const access_token = localStorage.getItem('access_token')
    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload)
    const writer = parsed_payload.user_id;

    // 해당 id로 API를 호출하여 책 정보를 가져옵니다.
    const response = await fetch(backend + `/book/${bookId}`, { 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            "Content-type": "application/json",
        },
     });

    const bookData = await response.json();
    const bookDetailsession = document.querySelector('section');

    const mediaUrl = backend;
    const imageUrl = mediaUrl + bookData.image;
    
    let innerHTMLContent = `
    <div class="createbook_title">
      <h1>책 정보 수정하기</h1>
    </div>
    <div class="book-content">
      <div class="left-section">
        <div class="img-group">
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            class="fileInput"
          />
          <img id="book-cover" class=book-cover src="${imageUrl}">
          <div class="input-group">
            <button id="attachImageButton">사진 첨부하기</button>
          </div>
        </div>
      </div>
      <div class="right-section">
        <form class="form-group">
          <ul>
            <li class="input-group">책 제목</li>
            <li>
              <input type="text" id="titleInput" value='${bookData.title}'/>
            </li>
          </ul>
          <ul>
            <li class="input-group">저자</li>
            <li>
              <input type="text" id="authorInput" value='${bookData.author}'/>
            </li>
          </ul>
          <ul>
            <li class="input-group">출판사</li>
            <li>
              <input type="text" id="publisherInput" value='${bookData.publisher}'/>
            </li>
          </ul>
          <ul>
            <li class="select-group">책 상태</li>
            <li>
              <select id="actionSelect" >
                <option value="최상">최상</option>
                <option value="상">상</option>
                <option value="중">중</option>
                <option value="하">하</option>
                <option value="최하">최하</option>
              </select>
            </li>
          </ul>
          <ul>
            <li class="input-group">정가</li>
            <li>
              <input type="text" id="regularPriceInput" value='${bookData.original_price}'/>
            </li>
          </ul>
          <ul>
            <li class="input-group">판매가</li>
            <li>
              <input type="text" id="salePriceInput" value='${bookData.selling_price}'/>
            </li>
          </ul>
          <ul>
            <li class="input-group">책 상태</li>
            <li>
                <p>
                    <textarea id="detailInfo" placeholder="예) 첫장에 낙서가 있지만, 그 외에는 다 괜찮습니다.">${bookData.detail_info}</textarea>
                </p>
            </li>
        </ul>
        <div class="button-group">
            <button id="register">수정하기</button>
        </div>
        </form>
      </div>
    </div>
    `;

    bookDetailsession.innerHTML = innerHTMLContent;
    
    const attachImageBtn = document.getElementById('attachImageButton');
    const imageInput = document.getElementById('imageInput'); // 이미지 선택 input 요소
    
    attachImageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        imageInput.click();
    });

    imageInput.addEventListener('change', () => {
        const bookCoverImg = document.getElementById('book-cover');
        const reader = new FileReader();

        reader.onload = function(e) {
            bookCoverImg.src = e.target.result;
        };

        if (imageInput.files[0]) {
            reader.readAsDataURL(imageInput.files[0]);
        }
    });

    const register = document.getElementById('register');

    const date = new Date().toISOString();
   
    register.addEventListener('click', async function(e) {
        e.preventDefault();

        const formData = new FormData();
        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }
        formData.append('title', document.getElementById('titleInput').value);
        formData.append('writer', writer);
        formData.append('author', document.getElementById('authorInput').value);
        formData.append('publisher', document.getElementById('publisherInput').value);
        formData.append('condition', document.getElementById('actionSelect').value);
        formData.append('original_price', document.getElementById('regularPriceInput').value);
        formData.append('selling_price', document.getElementById('salePriceInput').value);
        formData.append('detail_info', document.getElementById('detailInfo').value);
        formData.append('sale_condition', '판매중');
        formData.append('uploaded_at', date);

        try {
            const response = await fetch(backend + `/book/${bookData.id}/update/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('도서 정보 수정에 실패했습니다.');
            }

            alert("도서 정보가 수정되었습니다.");
            window.location.replace(frontend + '/assets/html/shop.html');
        } catch (error) {
            alert(error.message || "오류가 발생했습니다.");
            console.error(error);
        }
    });
}
