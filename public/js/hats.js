/* ==========================================================
   히어로 · 대사 순환하기 (캐릭터를 누르면 두 줄 문구가 바뀜)
   ----------------------------------------------------------
   ★ 문구를 바꾸려면 아래 HATS 목록의 글자만 고치세요. ["윗줄", "아랫줄"] 두 칸이에요.
   ========================================================== */
(function () {
  "use strict";

  var HATS = [
    { line: ["다시, 나를 그리는 시간.", "Welcome to 에몽씨 작업실."] },
    { line: ["픽셀 하나에도 온도를.", "감각과 질서를 함께 다듬어요."] },
    { line: ["눈길을 사로잡는 한 줄.", "기획부터 시선 강탈 포스터까지."] },
    { line: ["상상이 움직이는 순간.", "숏폼 영상으로 기분 좋게 톡톡."] },
    { line: ["정성스레 내린 커피 한 잔.", "꼼꼼하게 내리는 디테일."] },
    { line: ["사람을 먼저 담는 마음.", "따뜻한 시선으로 채워갑니다."] },
    { line: ["행사 준비 완료.", "시작부터 끝까지 빈틈없이 챙겨요."] },
    { line: ["정리와 자동화는 제게 맡겨주세요.", "서류도 코드도 깔끔하게."] },
    { line: ["가끔은 엉뚱한 상상도 덤으로,", "장난기 가득한 일상 스케치."] },
    { line: ["진심을 담아서.", "끝까지 책임지는 에몽씨입니다."] }
  ];

  var HINT = "캐릭터를 톡 눌러보세요";
  var LAST = "img/mini/emongc-intro-last.webp?v=1";

  function init() {
    var wrap = document.getElementById("charWrap"), say = document.getElementById("hatSay");
    var stage = wrap && wrap.querySelector(".hv-stage");
    if (!wrap || !stage || !say) return;

    var vid = stage.querySelector("video"), poster = stage.querySelector("img");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var t1 = say.querySelector(".hs-t1"), t2 = say.querySelector(".hs-t2"), hEl = say.querySelector(".hs-hint");
    var idx = 0, ready = false, ended = false, busy = false, typer = 0, clicked = false;
    new Image().src = LAST;

    // 안정적인 타이핑 함수
    function type(lines) {
      clearInterval(typer);
      var a = lines[0], b = lines[1] || "";
      if (reduce) { t1.textContent = a; t2.textContent = b; return; }
      
      // 💡 [핵심] 타이핑을 시작하기 전, 박스 높이가 숨 쉬지 못하도록 
      // 윗줄과 아랫줄에 빈 공백(또는 온전한 텍스트)을 미리 렌더링하여 레이아웃 공간을 완벽히 선점합니다.
      t1.textContent = a;
      t2.textContent = b;
      
      // 공간을 미리 확보한 뒤, 곧바로 투명도를 0으로 숨겼다가 타이핑 효과를 시작합니다.
      t1.style.opacity = "0";
      t2.style.opacity = "0";
      
      setTimeout(function() {
        t1.textContent = ""; 
        t2.textContent = "";
        t1.style.opacity = "1";
        t2.style.opacity = "1";
        
        var i = 0;
        var totalLength = a.length + b.length;
        
        typer = setInterval(function () {
          i++; 
          t1.textContent = a.slice(0, Math.min(i, a.length)); 
          t2.textContent = b.slice(0, Math.max(0, i - a.length));
          
          if (i > totalLength + 2) {
            clearInterval(typer);
            t1.textContent = a;
            t2.textContent = b;
          }
        }, 22);
      }, 30);
    }

    // 대사 전환 함수 (모자 변경 로직 제거됨)
    function show(i) {
      idx = i;
      type(HATS[i].line);
    }

    // 인사 영상 스킵
    function skipIntro() {
      if (ended) return; ended = true;
      if (vid) { try { vid.pause(); } catch (e) {} vid.style.transition = "none"; vid.style.opacity = "0"; }
      if (poster) poster.src = LAST;
    }

    // 다음 대사로 넘기기
    function next() {
      if (!ready || busy) return;
      busy = true; setTimeout(function () { busy = false; }, 420);
      skipIntro();
      if (!clicked) { clicked = true; hEl.textContent = ""; say.classList.add("clicked"); }
      show((idx + 1) % HATS.length);
    }

    // 초기화 및 시작
    function start() {
      if (ready) return;
      ready = true;
      wrap.classList.add("hat-ready");
      wrap.setAttribute("role", "button"); wrap.setAttribute("tabindex", "0");
      wrap.setAttribute("aria-label", "캐릭터를 눌러 다음 대사 보기");
      say.hidden = false; void say.offsetWidth; say.classList.add("on");
      type(HATS[0].line);
      hEl.textContent = HINT;
    }

    wrap.addEventListener("click", next);
    wrap.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } });
    if (vid) vid.addEventListener("ended", function () { ended = true; });

    function afterFonts(cb) { if (window.__fontsReady !== false) cb(); else document.addEventListener("fontsready", cb, { once: true }); }
    afterFonts(function () { setTimeout(start, reduce ? 0 : 1900); });

    if (vid && !reduce) setTimeout(function () { if (!ended && (vid.paused || vid.currentTime < 0.3)) { ended = true; vid.style.opacity = "0"; if (poster) poster.src = LAST; } }, 7000);
    if (reduce) { ended = true; if (poster) poster.src = LAST; }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();