// =========================================
// 다시, 나 - 관리자 화면 기능 (4일차)
// =========================================
const loginArea = document.querySelector('#login-area');
const listArea = document.querySelector('#list-area');
const loginForm = document.querySelector('#login-form');
const loginMsg = document.querySelector('#login-msg');
const messageList = document.querySelector('#message-list');
const countText = document.querySelector('#count');

// 1. 문의 목록 불러오기
async function loadMessages() {
    const res = await fetch('/api/messages');
    
    // 로그인이 안 되어 있으면 로그인 화면 보이기
    if (res.status === 401) {
        loginArea.hidden = false;
        listArea.hidden = true;
        return;
    }
    
    const messages = await res.json();
    loginArea.hidden = true;
    listArea.hidden = false;
    countText.textContent = `(${messages.length}건)`;
    messageList.innerHTML = '';
    
    if (messages.length === 0) {
        messageList.innerHTML = '<p class="empty">아직 받은 문의가 없습니다.</p>';
        return;
    }
    
    // 문의 하나마다 카드 만들기
    messages.forEach(function (item) {
        const card = document.createElement('article');
        card.className = 'message-card';
        
        // 1. 날짜를 맨 위에 독립적으로 표시할 요소
        const dateEl = document.createElement('p');
        dateEl.className = 'card-date'; // 필요하면 CSS로 스타일 지정 가능
        dateEl.textContent = new Date(item.created_at).toLocaleString('ko-KR');
        
        // 2. 작성자 이름
        const title = document.createElement('h3');
        title.textContent = item.name;
        
        // 3. 이메일 정보
        const meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = item.email;
        
        // 4. 문의 내용
        const content = document.createElement('p');
        content.className = 'content';
        content.textContent = item.message; // textContent: 글자 그대로 표시 (해킹 방지)
        
        // 5. 삭제 버튼
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'delete-btn';
        delBtn.textContent = '삭제';
        delBtn.addEventListener('click', function () {
            deleteMessage(item.id);
        });
        
        // 💡 card.append 순서대로 위에서 아래로 배치됩니다. (dateEl이 맨 위!)
        card.append(dateEl, title, meta, content, delBtn);
        messageList.append(card);
    });
}

// 2. 로그인
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const res = await fetch('https://dasi-na-server.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.querySelector('#username').value.trim(),
            password: document.querySelector('#password').value
        })
    });
    
    const data = await res.json();
    if (res.ok) {
        loginMsg.textContent = '';
        loginForm.reset();
        loadMessages();
    } else {
        loginMsg.textContent = data.message;
    }
});

// 3. 로그아웃
document.querySelector('#logout-btn').addEventListener('click', async function () {
    await fetch('https://dasi-na-server.onrender.com/api/logout', { method: 'POST' });
    loadMessages();
});

// 4. 문의 삭제
async function deleteMessage(id) {
    // 실수로 지우지 않도록 한 번 더 물어봄
    if (!confirm('이 문의를 삭제할까요?')) {
        return;
    }
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    loadMessages();
}

// 5. 화면이 열리면 바로 목록 불러오기 시도
loadMessages();