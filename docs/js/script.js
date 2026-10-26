// =========================================
// 다시, 나 - 기능 파일 (script.js)
// =========================================

console.log('다시, 나: script.js 연결 완료');

// =========================================
// 1. 휴대폰 메뉴 접기·펼치기
// =========================================
const menuBtn = document.querySelector('#menu-btn');
const mainNav = document.querySelector('#main-nav');

if (menuBtn && mainNav) {
  function closeMenu() {
    mainNav.classList.remove('open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '메뉴 열기');
  }

  menuBtn.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    menuBtn.textContent = isOpen ? '✕' : '☰';
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

// =========================================
// 2. 맨 위로 가기 버튼 (TOP 버튼)
// =========================================
const topBtn = document.querySelector('#top-btn');

if (topBtn) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  });

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =========================================
// 3. 문의 폼 입력 확인
// =========================================
const contactForm = document.querySelector('#contact-form');
const formMsg = document.querySelector('#form-msg');

if (contactForm && formMsg) {
  function showMessage(text, type) {
    formMsg.textContent = text;
    formMsg.className = type;
  }

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const message = document.querySelector('#message').value.trim();
    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === '') {
      showMessage('이름을 입력해 주세요.', 'error');
      return;
    }
    if (!emailRule.test(email)) {
      showMessage('올바른 이메일 주소를 입력해 주세요.', 'error');
      return;
    }
    if (message.length < 10) {
      showMessage('문의 내용을 10자 이상 입력해 주세요.', 'error');
      return;
    }

    showMessage('문의가 접수되었습니다. 감사합니다!', 'success');
    contactForm.reset();
  });
}

// =========================================
// 4. 네비게이션 스크롤 스파이 및 동적 활성화
// =========================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('#main-nav a');

if (sections.length > 0 && navLinks.length > 0) {
  let isScrollingByClick = false; // 👈 [추가] 클릭으로 이동 중인지 확인하는 잠금 변수
  let clickTimeout = null;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    // 👈 [추가] 클릭으로 이동하는 동안에는 스크롤 감지가 작동하지 않도록 차단
    if (isScrollingByClick) return;

    entries.forEach(entry => {
      if (window.scrollY < 150) {
        navLinks.forEach(link => link.classList.remove('active'));
        return;
      }

      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href').substring(1);
          if (href === currentId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // 상단 Top(150px 미만)에 있을 때 전체 메뉴 비활성화
  window.addEventListener('scroll', () => {
    if (!isScrollingByClick && window.scrollY < 150) {
      navLinks.forEach(link => link.classList.remove('active'));
    }
  });

  // 메뉴를 직접 클릭했을 때의 동작
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      // 1. 클릭한 메뉴 즉시 활성화
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // 2. 스크롤 이동 중 스파이 기능 일시 정지 선언
      isScrollingByClick = true;

      // 3. 부드러운 스크롤 이동이 끝날 대쯤(약 800ms 뒤) 잠금 해제
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        isScrollingByClick = false;
      }, 800);
    });
  });
}

// ==================================================
// 타임라인 이미지 확대/축소 모달 제어 (안전한 이벤트 방식)
// ==================================================

document.addEventListener("DOMContentLoaded", function() {
    const timelineContainer = document.getElementById("timelineContainer");
    const imageModal = document.getElementById("imageModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    // 1. 타임라인 박스를 클릭했을 때 팝업 열기
    if (timelineContainer && imageModal) {
        timelineContainer.addEventListener("click", function() {
            imageModal.style.display = "flex";
        });
    }

    // 2. 닫기 버튼(×)을 클릭했을 때 팝업 닫기
    if (modalCloseBtn && imageModal) {
        modalCloseBtn.addEventListener("click", function() {
            imageModal.style.display = "none";
        });
    }

    // 3. 팝업 검은 배경을 클릭했을 때도 팝업 닫기
    if (imageModal) {
        imageModal.addEventListener("click", function(event) {
            if (event.target === imageModal) {
                imageModal.style.display = "none";
            }
        });
    }
});

// ==================================================
// 타임라인 이미지 확대/축소 모달 제어 (클릭 이벤트 복구 완료)
// ==================================================
document.addEventListener("DOMContentLoaded", function() {
    const timelineContainer = document.getElementById("timelineContainer");
    const imageModal = document.getElementById("imageModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    // 1. 타임라인 이미지 박스를 클릭했을 때 팝업 열기
    if (timelineContainer && imageModal) {
        timelineContainer.addEventListener("click", function(e) {
            // 혹시 모를 안전장치: 혹시라도 푸터 영역이 안쪽에 있다면 예외 처리
            if (e.target.closest(".timeline-footer-text") || e.target.closest(".contact-line-box")) {
                return; 
            }
            imageModal.style.display = "flex";
        });
    }

    // 2. 닫기 버튼(×)을 클릭했을 때 팝업 닫기
    if (modalCloseBtn && imageModal) {
        modalCloseBtn.addEventListener("click", function() {
            imageModal.style.display = "none";
        });
    }

    // 3. 팝업 검은 배경을 클릭했을 때도 팝업 닫기
    if (imageModal) {
        imageModal.addEventListener("click", function(event) {
            if (event.target === imageModal) {
                imageModal.style.display = "none";
            }
        });
    }
});

// =========================================
// CONTACT 글자 자동 한 글자씩 쪼개기 (떨림 효과용)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const contactTextEl = document.getElementById("animatedContactText");
    
    if (contactTextEl) {
        const text = contactTextEl.textContent;
        contactTextEl.innerHTML = ""; // 기존 텍스트 초기화
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement("span");
            if (text[i] === " ") {
                span.innerHTML = "&nbsp;";
            } else {
                span.textContent = text[i];
            }
            contactTextEl.appendChild(span);
        }
    }
});

// ==================================================
// HERO 캐릭터 클릭 시 위트 있는 멘트 순차 출력 제어
// ==================================================
// ==================================================
// HERO 캐릭터 클릭 시 위트 있는 멘트 + 좌우 위치 교차 출력
// ==================================================
document.addEventListener("DOMContentLoaded", function() {
    const heroClickBox = document.getElementById("heroClickBox");
    const speechBubble = document.getElementById("speechBubble");
    const quoteText = document.getElementById("quoteText");

    const characterQuotes = [
        "어? 저 누르신 거예요? (안 누른 척 시선 회피 👀)",
        "제 포트폴리오 보러 오셨군요? 후회 안 하시게 될걸요? 😎",
        "궁금한 게 많으시군요? 저에 대해 하나씩 파헤쳐 볼까요? 🕵️‍♀️",
        "참고로 저는 커피와 AI만 있으면 야근도 즐기는 사람입니다 ☕🤖",
        "이력서보다 이 캐릭터를 더 오래 보고 계신 것 같은데요? ㅋㅋ",
        "일단 스크롤 내리기 전에 WORKS 섹션은 꼭 구경하고 가셔야 합니다? (진지)",
        "저랑 일하고 싶어지셨다구요? 눈빛만 봐도 다 압니다 하하",
        "계속 누르다 보면 비밀이... 나올 리가 없잖아요, 빨리 아래로 내려가서 경력 보세오! 👇",
        "개발과 디자인, 그리고 AI 활용까지 섭렵한 인재가 바로 여기 있습니다 ✨",
        "끝까지 저를 눌러주셨군요! 자, 이제 망설이지 말고 CONTACT 버튼을 눌러볼까요? 💌"
    ];

    let currentIndex = 0;

    if (heroClickBox && speechBubble && quoteText) {
        heroClickBox.addEventListener("click", function() {
            // 1. 대화 내용 변경
            quoteText.textContent = characterQuotes[currentIndex];

            // 2. 짝수 번째는 왼쪽(pos-left), 홀수 번째는 오른쪽(pos-right) 번갈아 적용
            if (currentIndex % 2 === 0) {
                speechBubble.classList.remove("pos-right");
                speechBubble.classList.add("pos-left");
            } else {
                speechBubble.classList.remove("pos-left");
                speechBubble.classList.add("pos-right");
            }

            // 3. 말풍선 등장 애니메이션 실행
            speechBubble.classList.add("show");

            // 4. 다음 인덱스로 순환
            currentIndex = (currentIndex + 1) % characterQuotes.length;
        });
    }
});

// ==================================================
// 화면 크기가 작아지면 무조건 데스크톱 권장 경고창 표시
// ==================================================
document.addEventListener("DOMContentLoaded", function() {
    const warningModal = document.getElementById("desktopWarningModal");
    const dontCareBtn = document.getElementById("dontCareBtn");

    function checkScreenSize() {
        // 창 가로 폭이 768px 이하로 줄어들면 무조건 활성화
        if (window.innerWidth <= 767) {
            if (warningModal) warningModal.classList.add("active");
        } else {
            if (warningModal) warningModal.classList.remove("active");
        }
    }

    // 1. 페이지가 처음 열릴 때 체크
    checkScreenSize();

    // 2. PC에서 브라우저 창 크기를 강제로 줄일 때도 실시간으로 체크
    window.addEventListener("resize", checkScreenSize);

    // 3. "I DON'T CARE" 버튼을 누르면 잠시 창을 숨김 (현재 세션 동안만)
    if (dontCareBtn && warningModal) {
        dontCareBtn.addEventListener("click", function() {
            warningModal.classList.remove("active");
        });
    }
});

// ==================================================
// WORKS 카드 클릭 시 모달창 열기 및 닫기 함수
// ==================================================
function openWorkModal(workId) {
    const modal = document.getElementById("workModal");
    const modalContent = document.getElementById("modalContent");

    if (!modal || !modalContent) {
        console.error("모달 요소를 찾을 수 없습니다!");
        return;
    }

    // 📍 Work 1
    if (workId === 'work1') {
        modalContent.innerHTML = `
            <h3>학교폭력 1</h3>
            <video src="img/work1.mp4" controls autoplay muted playsinline></video>
            <p>학폭은 건너뛰기 할 수 없습니다.</p>
        `;
    } 
    // 📍 Work 2
    else if (workId === 'work2') {
        modalContent.innerHTML = `
            <h3>학교폭력 2</h3>
            <video src="img/work2.mp4" controls autoplay muted playsinline></video>
            <p>학폭은 건너뛰기 할 수 없습니다.</p>
        `;
    } 
    // 📍 Work 3
    else if (workId === 'work3') {
        modalContent.innerHTML = `
            <h3>내 꿈이 사라졌다 1</h3>
            <video src="img/work3.mp4" controls autoplay muted playsinline></video>
            <p>AI의 꿈이 이루어졌다..</p>
        `;
    } 
    // 📍 Work 4 (파일명 work4.mp4로 수정)
    else if (workId === 'work4') {
        modalContent.innerHTML = `
            <h3>내 꿈이 사라졌다 2</h3>
            <video src="img/work4.mp4" controls autoplay muted playsinline></video>
            <p>AI의 꿈이 이루어졌다..</p>
        `;
    } 
    // 📍 Work 5 (중괄호 누락 수정 완료)
    else if (workId === 'work5') {
        modalContent.innerHTML = `
            <h3>나는 중2</h3>
            <video src="img/work5.mp4" controls autoplay muted playsinline></video>
            <p>사춘기 여중생은..</p>
        `;
    } 
    // 📍 Work 6
    else if (workId === 'work6') {
        modalContent.innerHTML = `
            <h3>부부의 대화</h3>
            <video src="img/work6.mp4" controls autoplay muted playsinline></video>
            <p>심통이 아내와 버럭이 남편</p>
        `;
    } 
    // 📍 Work 7
    else if (workId === 'work7') {
        modalContent.innerHTML = `
            <h3>랩배틀</h3>
            <video src="img/work7.mp4" controls autoplay muted playsinline></video>
            <p>고양이와 개의 디스랩</p>
        `;
    } 
    // 📍 Work 8
    else if (workId === 'work8') {
        modalContent.innerHTML = `
            <h3>달빛걷기 포스터 4</h3>
            <img src="img/work8.jpg" alt="작업물 8 이미지">
            <p>생명존중 걷기 캠페인</p>
        `;
    } 
    // 기본값
    else {
        modalContent.innerHTML = `
            <h3>${workId} 상세 내용</h3>
            <p>준비 중인 작업물입니다.</p>
        `;
    }

    modal.classList.add("active");
}

function closeModal() {
    const modal = document.getElementById("workModal");
    if (modal) {
        modal.classList.remove("active");
    }
}