import { backend } from "./url.js";
import { frontend } from "./url.js";

window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    const access_token = localStorage.getItem('access_token')
    const payload = localStorage.getItem('payload');
    const parsed_payload = JSON.parse(payload)
    const writer = parsed_payload.user_id;

    // 서평 정보
    const response = await fetch(backend + `/bookreview/${bookId}`,{
        method:'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            "Content-type": "application/json",
        }
    });

    const bookData = await response.json();

    // 해시태그 정보
    async function fetchHashTag(bookId) {
        const response = await fetch(backend + `/bookreview/${bookId}/hashtag/`, {method: 'GET'})
        const hashTagData = await response.json();
        console.log(hashTagData);
        return hashTagData;
    }

    // 해시태그 데이터
    let hashTags = await fetchHashTag(bookData.id);

    

    function createHashTagElement(tagname) {
        let hashtagLi = document.createElement('li');
        hashtagLi.classList.add('hashtag-li');
        hashtagLi.textContent=`#${tagname}`;
    
        let removeButton = document.createElement("button");
        removeButton.classList.add('hashtag-del-btn');
        removeButton.textContent = "x";
        
        removeButton.addEventListener("click", function(e) {
            e.preventDefault();
            this.parentNode.remove();
        });
    
        hashtagLi.appendChild(removeButton);
        
        return hashtagLi;
    }
    
    

    
    const bookDetailsession = document.querySelector('section');

    let innerHTMLContent = `
        <div class="bookreview-title-content">
          <h1>Review</h1>
          <p>가장 기억에 남은 책에 대한 서평을 남겨주세요.</p>
        </div>
        <div class="bookreview-create-content">
          <form>
            <ul class="bookreview-title">
              <li for="bookreview-title">서평 제목</li>
              <li><input type="text" id="bookreview-title" value="${bookData.review_title}"></li>
            </ul>
            <ul>
              <li for="bookreview-textarea">내용</li>
              <li><textarea name="bookreview-textarea" id="bookreview-textarea">${bookData.review}</textarea></li>
            </ul>
            <ul class="bookreview-category">
              <li for="bookreview-category">카테고리</li>
              <li>
                <select name="bookreview-category" id="bookreview-category">
                  <option>${bookData.category}</option>
                  <option value="사회/정치">사회/정치</option>
                  <option value="소설/시/희곡">소설/시/희곡</option>
                  <option value="어린이">어린이</option>
                  <option value="여행">여행</option>
                  <option value="역사">역사</option>
                  <option value="예술">예술</option>
                  <option value="인문">인문</option>
                  <option value="인물">인물</option>
                  <option value="자기계발">자기계발</option>
                  <option value="자연과학">자연과학</option>
                  <option value="잡지">잡지</option>
                  <option value="종교">종교</option>
                  <option value="청소년">청소년</option>
                </select>
              </li>
            </ul>
            <ul class="bookreview-booktitle">
              <li for="bookreview-booktitle">책 제목</li>
              <li><input type="text" id="bookreview-booktitle" value="${bookData.book_title}"></li>
            </ul>
            <ul class="bookreview-author">
              <li class="bookreview-author">책 저자</li>
              <li><input type="text" id="bookreview-author" value="${bookData.book_author}"></li>
            </ul>
            <ul class="bookreview-publisher">
              <li for="bookreview-publisher">출판사</li>
              <li><input type="text" id="bookreview-publisher" value="${bookData.book_publisher}"></li>
            </ul>
            <ul class="bookreview-rating">
              <li for="bookreview-rating">평점</li>
              <li><input type="number" id="bookreview-rating" value="${bookData.rating}"></li>
            </ul>
            <ul id="hashtag-ul" class="hashtag-ul">
                <li for="bookreview-hashtag">해시태그</li>
                <li><input class="bookreview-hashtag-text" type="text" id="bookreview-hashtag-text"></li>
                <li><button class="bookreview-hashtag-btn" id="bookreview-hashtag-btn">추가</button></li>   
            </ul>
            <div class="bookreview-button">
              <p>▲ 해시태그는 책 제목, 저자, 출판사명을 태그해주세요.</p>
              <div class="create-button">
                <button id="update-ReviewBtn">수정</button>
              </div>
            </div>
          </form>
        </div>
    `

    bookDetailsession.innerHTML = innerHTMLContent;

    const hashtagUl = document.getElementById('hashtag-ul');

    for(let i=0; i<hashTags.length; i++){
        const tagElement = createHashTagElement(hashTags[i].tagname);
        hashtagUl.appendChild(tagElement);
     }
}