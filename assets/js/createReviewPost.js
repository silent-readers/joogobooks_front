import { backend } from "./url.js";
import { frontend } from "./url.js";

const access_token = localStorage.getItem('access_token')

let createHashTagData =[];

// 해시태그 등록
const hashtagBtn = document.getElementById('bookreview-hashtag-btn');
hashtagBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const hashtagtext = document.getElementById('bookreview-hashtag-text').value;
    
    const hashtagUl = document.getElementById('hashtag-ul');
    const hashtagLi = document.createElement('li');
    hashtagLi.classList.add('hashtag-li');
    
    let removeButton = document.createElement("button");
    removeButton.classList.add('hashtag-del-btn');
    removeButton.textContent = "x";
    removeButton.addEventListener("click", function(e) {
        e.preventDefault();

        let index = createHashTagData.indexOf(hashtagtext);
        if (index !== -1) createHashTagData.splice(index, 1);
        
        this.parentNode.remove();
    });

    createHashTagData.push(hashtagtext);

    hashtagLi.appendChild(document.createTextNode(hashtagtext));
    hashtagLi.appendChild(removeButton);
    hashtagUl.appendChild(hashtagLi);
})

// 해시태그를 포함한 서평정보 등록
const createReviewBtn = document.getElementById('create-ReviewBtn');
createReviewBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const date = new Date().toISOString();

    const createBookreviewData = {
        "review_title" : document.getElementById('bookreview-title').value,
        "review" : document.getElementById('bookreview-textarea').value,
        "category" : document.getElementById('bookreview-category').value,
        "book_title" : document.getElementById('bookreview-booktitle').value,
        "book_author" : document.getElementById('bookreview-author').value,
        "book_publisher" : document.getElementById('bookreview-publisher').value,
        "rating" : document.getElementById('bookreview-rating').value,
        "created_at" : date,
    }
    
    const response = await fetch(backend + '/bookreview/create/', {
        headers: {
            "Content-type": "application/json",
            'Authorization': `Bearer ${access_token}`
        },
        method: 'POST',
        body:JSON.stringify(createBookreviewData)
    }).then((res) => {
        if (!res.ok) {
        return res.json().then(err => { throw err });
        }
        return res;
    })
    .then((res) => {
        console.log(res.status);
        return res.json();
    })
    .then((data) => {
        if (data) {
        alert("서평 정보 등록이 완료되었습니다.");
        console.log("성공적으로 데이터가 전송되었습니다.");

        // Create hashtags for this review.
        for(let i=0; i<createHashTagData.length; i++){
            let hash_tag_data={
                "tagname":createHashTagData[i]
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
