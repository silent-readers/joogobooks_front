import { backend } from "./url.js";

// refresh token으로 access token 발급
export function refreshToken() {
    const payload = JSON.parse(localStorage.getItem('payload'));
    
    // 아직 access token의 인가 유효시간이 남은 경우
    if (payload.exp > (Date.now() / 1000)) {
        return;
    } else {
        // 인증시간이 지났기 때문에 다시 refresh token으로 access token 요청
        const requestRefreshToken = async (url) => {
            const response = await fetch(url ,{
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
                },
                method:'POST',
                body:JSON.stringify({}),
            });
            return response.json();
        };

        // 다시 인증받은 accessToken을 localStorage에 저장
        requestRefreshToken(`${backend}/api/user/auth/refresh/`).then((data) => {
            // 새롭게 발급 받은 accessToken을 localStorage에 저장
            const accessToken = data.access;
            const refreshToken = data.refresh;

            if (accessToken && refreshToken) {
                localStorage.setItem('access_token', accessToken);
                lacalStorage.setItem('refresh_token', refreshToken);

                const base64Url = accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                localStorage.setItem("payload", jsonPayload);
            } else {
                // refresh token이 없으면 로그인 페이지로 이동
                location.href="../html/login.html";
            }
        });
    }
};


export const forTokenWhenClosing = () => {
    // 브라우저 종료 시 로그인한 유저의 토큰값 로컬 스토리지에서 삭제
    // 유저가 window 사용 시에는 window가 닫힌 것이 아니다.
    let closingWindow = false;

    window.addEventListener('focus', function () {
        closingWindow = false;
    });

    window.addEventListener('blur', function () {
        closingWindow = true;
        
        if (!document.hidden) { // window가 최소화된 것은 닫힌 것이 아니다.
            closingWindow = false;
        }

        function resizeHandler(e) { // window가 최대화된 것은 닫힌 것이 아니다.
            closingWindow = false;
        }
        
        window.addEventListener('resize', resizeHandler);
        window.removeEventListener('resize', resizeHandler); // multiple listening 회피
    });

    // 유저가 html을 나간다면 window가 닫힌 것으로 간주
    document.querySelector('html').addEventListener('mouseleave', function () {
        closingWindow = true;
    });

    // 유저의 마우스가 window 안에 있다면 토큰들을 삭제하지 않음
    document.querySelector('html').addEventListener('mouseenter', function () {
        closingWindow = false;
    });

    document.addEventListener('keydown', function (e) {
        const key = e.key || e.keyCode
        if (key === 'Alt' || key === 'Tab' || key === 9 || key === 18) {
            closingWindow = false; // 단축키 ALT+TAB (창 변경)
        }
        
        if (key === 'F5' || (key === 'Ctrl' && key === 'r') || key === 116 || (key === 17  && key === 82)) {
            closingWindow = false; // 단축키 F5, CTRL+F5, CTRL+R (새로고침)
        }
    });

    // a 링크를 눌렀을 때 토큰값 삭제 방지
    document.addEventListener("click", function (e) {
        if (e.target.tagName === 'A') {
            closingWindow = false;
        }
    });

    // 버튼이 다른 페이지로 redirect한다면 토큰값 삭제 방지
    document.addEventListener("click", function (e) {
        if (e.target.tagName === 'BUTTON') {
            closingWindow = false;
        }
    });

    // submit이나 form 사용 시 토큰값 삭제 방지
    document.addEventListener("submit", function (e) {
        if (e.target.tagName === 'FORM') {
            closingWindow = false;
    }
    });

    // toDoWhenClosing 함수를 통해 window가 닫히면 토큰 관련 값 전부 삭제
    const toDoWhenClosing = function () {
        localStorage.removeItem("payload")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        return;
    };

    // unload(window가 닫히는 이벤트)가 감지되면 closingWindow가 true가 되고 토큰 관련 값들 전부 삭제
    window.addEventListener("unload", function (e) {
        if (closingWindow) {
            toDoWhenClosing();
        }
    });
};