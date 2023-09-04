const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// HTML 요소들을 가져옵니다.
const commentForm = document.querySelector('.comment-form');
const commentInput = document.querySelector('.comment-input');
const commentList = document.querySelector('.comment-list');

// 새 댓글을 생성하고 화면에 추가하는 함수
function createCommentElement(comment) {
  const commentDetail = document.createElement('div');
  commentDetail.classList.add('comment-detail');

  const img = document.createElement('img');
  img.src = '../img/send.png';
  img.alt = 'User Avatar';
  commentDetail.appendChild(img);

  const username = document.createElement('p');
  username.classList.add('comment-username');
  username.textContent = comment.user.username;  // 댓글 작성자의 이름
  commentDetail.appendChild(username);

  const ul = document.createElement('ul');
  const content = document.createElement('li');
  content.textContent = comment.content;  // 댓글 내용
  ul.appendChild(content);

  const createdAt = document.createElement('li');
  createdAt.textContent = comment.created_at;  // 댓글 작성 시간
  ul.appendChild(createdAt);

  commentDetail.appendChild(ul);

  if (comment.user.id === userId) {  // 현재 로그인한 사용자의 댓글인 경우 삭제 버튼 추가
    const deleteBtnDiv = document.createElement('div');
    deleteBtnDiv.classList.add('delete-btn-div');

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('comment-delete-btn');
    deleteBtn.textContent = '삭제';
    deleteBtnDiv.appendChild(deleteBtn);

    commentDetail.appendChild(deleteBtnDiv);

    deleteBtn.addEventListener('click', () => {
      // 댓글 삭제 로직 추가
      deleteComment(comment.id);
    });
  }

  commentList.appendChild(commentDetail);
}

// 댓글 생성 함수
async function createComment(bookId, content) {
  const response = await fetch(`http://backend.joongobooks.com/api/book/${bookId}/comment/create/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: content
    })
  });

  if (response.ok) {
    const comment = await response.json();
    createCommentElement(comment);
  } else {
    console.error('댓글 생성 실패');
  }
}

// 댓글 폼 제출 이벤트 처리
commentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = commentInput.value;
  if (content) {
    createComment(bookId, content);
    commentInput.value = '';
  }
});
