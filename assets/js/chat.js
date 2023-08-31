const payload = localStorage.getItem('payload');
const parsed_payload = JSON.parse(payload);
const user_id = parsed_payload.user_id;

const handlers = {
  chat_messages_tag: null,
  ws: null,
  retry: 0,
 
  init() {
    this.chat_messages_tag = document.querySelector("#chat_messages");
    document.querySelector("#message_form").addEventListener("submit", this.onsubmit.bind(this));
  },

  connect(ws_url) {
    if(this.ws) {this.ws.close()} // 웹소켓 재연결 시에 명시적으로 연결을 닫음.

    // 지정 주소로 웹소켓 연결시도
    this.ws = new WebSocket(ws_url || this.ws?.url);

    this.ws.onopen = this.onopen.bind(this);
    this.ws.onclose = this.onclose.bind(this);
    this.ws.onerror = this.onerror.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
  },

  reconnect() {
    this.connect(); 
  },
 
  append_message(message) {
    const element = document.createElement("div");
    element.className = "chat-message";

    let footer = "";
    if (sender === user_id) {
      element.className += " me";
    } else if (sender) {
      footer = ` from ${sender}`;
    }

    const wrapper = document.createElement("div");
    wrapper.textContent = message + footer;
    element.appendChild(wrapper);
  
    this.chat_messages_tag.appendChild(element);
    this.chat_messages_tag.scrollTop = this.chat_messages_tag.scrollHeight;
  },

  onsubmit(event) {
    event.preventDefault();
  
    const form_data = new FormData(event.target);
    const props = Object.fromEntries(form_data)
    event.target.reset();

    const { message } = props;
    console.log("웹소켓으로 전송할 메세지 :", message);
    
    // 유저가 입력한 채팅 메세지를 channels로 전달
    this.ws.send(JSON.stringify({
      type: "chat.message",
      message: message,
    }))
  },

  onopen() {
    console.log("웹소켓 서버와 접속");
    this.retry = 0;
  },

  onclose(event) {
    const close_code = event.code;

    if(!event.wasClean) {
      console.error("웹소켓 서버가 죽었거나, 네트워크 장애입니다.");
      if(this.retry < 3) {
        this.retry += 1;
        setTimeout(() => {
          this.reconnect();
          console.log((`[${this.retry}] 접속 재시도 ...`));
        }, 1000 * this.retry);
      } else {
        console.log("웹소켓 서버에 접속할 수 없습니다. 채팅 리스트로 이동합니다.");
        window.location.replace('http://127.0.0.1:5500/assets/html/chatlist.html');
      }
    }
  },

  onerror() {
    console.log("웹소켓 서버에 접속할 수 없습니다. 채팅 리스트로 이동합니다.");
    window.location.replace('http://127.0.0.1:5500/assets/html/chatlist.html');
  },

  onmessage(event) {
    const message_json = event.data;
    console.log("메세지 수신 :", message_json);

    const {type, message} = JSON.parse(message_json);

    // type에 따른 메세지 분기
    switch(type) {
      case "chat.message": 
        {
          const { message, sender } = message_obj;
          this.append_message(message, sender);
        }
        break;
      default:
        console.errer(`Invalid message type : ${type}`)
    }
  },
};

handlers.init();

const protocol = location.protocol === "http:" ? "ws:" : "wss:";
const ws_url = protocol + "//127.0.0.1:8000/ws/chat/" + location.pathname;
handlers.connect(ws_url);