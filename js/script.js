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