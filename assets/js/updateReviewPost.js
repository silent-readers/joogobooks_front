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

        // 해시태그 ID 추출
        const hashTagIds = hashTagData.map(tag => tag.id);

        return hashTagIds && hashTagData;
    }

    // 해시태그 데이터
    let hashTagIds = await fetchHashTag(bookData.id);
    let hashTags = await fetchHashTag(bookData.id);

    function createHashTagElement(tagname, tagId) {
        let hashtagLi = document.createElement('li');
        hashtagLi.classList.add('hashtag-li');
        hashtagLi.textContent = `#${tagname}`;
    
        let removeButton = document.createElement("button");
        removeButton.classList.add('hashtag-del-btn');
        removeButton.textContent = "x";
        
        // 데이터 속성을 통해 해시태그의 id 저장
        removeButton.setAttribute("data-id", tagId);

        removeButton.addEventListener("click", async function(e) {
            e.preventDefault();

            // 데이터 속성에서 해시태그의 id 가져오기
            const hashTagId = this.getAttribute("data-id");

            // 서버에 삭제 요청 보내기
            const deleteResponse = await fetch(backend + `/bookreview/hashtag/${hashTagId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-type": "application/json",
                }
            });

            if (deleteResponse.ok) {
                // 삭제가 성공하면 해당 해시태그를 화면에서 삭제
                this.parentNode.remove();
                alert("해시태그가 삭제되었습니다.");
            } else {
                // 삭제에 실패한 경우에 대한 처리
                alert("해시태그 삭제에 실패했습니다.");
            }
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
        const tagElement = createHashTagElement(hashTags[i].tagname, hashTags[i].id);
        hashtagUl.appendChild(tagElement);
    }

    
    // bookreview update하기
    let updateHashTagData =[];

    // 해시태그 등록
    const hashtagBtn = document.getElementById('bookreview-hashtag-btn');
    hashtagBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const hashtagtext = document.getElementById('bookreview-hashtag-text').value;

        // 중복된 해시태그 체크
        if (updateHashTagData.includes(hashtagtext)) {
            alert('이미 추가된 해시태그입니다.');
            return;
        }

        const hashtagUl = document.getElementById('hashtag-ul');
        const hashtagLi = document.createElement('li');
        hashtagLi.classList.add('hashtag-li');

        let removeButton = document.createElement("button");
        removeButton.classList.add('hashtag-del-btn');
        removeButton.textContent = "x";
        removeButton.addEventListener("click", function(e) {
            e.preventDefault();

            let index = updateHashTagData.indexOf(hashtagtext);
            if (index !== -1) updateHashTagData.splice(index, 1);
            
            this.parentNode.remove();
        });

        updateHashTagData.push(hashtagtext);

        hashtagLi.appendChild(document.createTextNode(hashtagtext));
        hashtagLi.appendChild(removeButton);
        hashtagUl.appendChild(hashtagLi);
    })

    // 해시태그를 포함한 서평정보 등록
    const updateReviewBtn = document.getElementById('update-ReviewBtn');

    updateReviewBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const date = new Date().toISOString();

        const updateBookreviewData = {
            "review_title" : document.getElementById('bookreview-title').value,
            "review" : document.getElementById('bookreview-textarea').value,
            "category" : document.getElementById('bookreview-category').value,
            "book_title" : document.getElementById('bookreview-booktitle').value,
            "book_author" : document.getElementById('bookreview-author').value,
            "book_publisher" : document.getElementById('bookreview-publisher').value,
            "rating" : document.getElementById('bookreview-rating').value,
            "created_at" : date,
        }

        const response = await fetch(backend + `/bookreview/${bookId}/update/`, {
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${access_token}`
            },
            method: 'PUT',
            body:JSON.stringify(updateBookreviewData)
        }).then((res) => {
            if (!res.ok) {
            return res.json().then(err => { throw err });
            }
            return res;
        })
        .then((res) => {
            console.log(res.status);
            return res;
        })
        .then((data) => {
            if (data) {
            alert("서평 정보 수정이 완료되었습니다.");
            console.log("성공적으로 데이터가 전송되었습니다.");

            // Create hashtags for this review.
            for(let i=0; i<updateHashTagData.length; i++){
                let hash_tag_data={
                    "tagname":updateHashTagData[i]
                }
                fetch(backend + `/bookreview/${data.id}/hashtag/create/`,{
                    headers:{
                        "Content-type": "application/json",
                        'Authorization': `Bearer ${access_token}`
                    },
                    method:'POST',
                    body:JSON.stringify(hash_tag_data)
                })
            }

            window.location.replace(frontend + '/assets/html/bookReviewList.html')
            } else {
            alert("서평 등록에 실패했습니다.");
            console.log("데이터 전송 중 오류가 발생했습니다.");
            }
        })
        .catch((error) => {
            alert(error.message || "오류가 발생했습니다.");
            console.error(error)
        });

    })

}