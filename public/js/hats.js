/* ==========================================================
   히어로 · 모자 갈아쓰기 (인사 영상이 끝난 뒤 캐릭터를 누르면 모자가 바뀌고 한 줄이 써짐)
   ----------------------------------------------------------
   ★ 문구를 바꾸고 싶으면 아래 HATS 목록의 line 글자만 고치세요. (따옴표 "" 안쪽만)
   ★ 순서를 바꾸려면 줄 단위로 위아래로 옮기면 됩니다. 1번과 10번은 처음 머스타드 비니(영상 속 모자) 그대로예요.
   ========================================================== */
(function () {
  "use strict";
  var HATS = [
    { key: "mustard", line: "안녕하세요, 에몽씨예요!" },                       // 1  머스타드 비니 (영상 속 모자)
    { key: "fedora",  line: "디자인하는 날. 한 화면에 질서를 넣어요." },        // 2  페도라
    { key: "red",     line: "홍보물 만드는 날. 눈길 가는 한 줄을 찾아요." },     // 3  빨강 비니
    { key: "cap",     line: "영상 만드는 날. 상상을 움직이게 해요." },          // 4  카메라맨 캡
    { key: "barista", line: "커피 내리는 날. 디자인도 한 방울씩 내려요." },      // 5  바리스타 모자
    { key: "heart",   line: "챙기는 날. 사람 먼저 보는 눈이 있어요." },         // 6  하트 달린 챙모자
    { key: "party",   line: "행사하는 날. 시작부터 끝까지 챙겨요." },           // 7  파티 고깔
    { key: "visor",   line: "정리하는 날. 서류도 일정도 깔끔하게요." },         // 8  선바이저
    { key: "bag",     line: "가끔은 이런 날도 있어요. 장난기는 덤!" },          // 9  종이봉투
    { key: "mustard", line: "그래도 저는 에몽씨. 모자는 바뀌어도 일은 끝까지." } // 10 다시 머스타드 비니
  ];
  var HINT = "캐릭터를 톡 눌러보세요";

  /* 모자 그림 (영상 속 비니 윤곽 #hc 에 맞춰 덮음 — 좌표는 영상 640×420 기준) */
  var OUT = 'stroke="#3b2f2a" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"';
  function ribs(c) { var s = ""; for (var x = 284; x < 424; x += 9) s += '<path d="M' + x + ' 66 L' + (x + 2) + ' 126" stroke="' + c + '" stroke-width="2" fill="none"/>'; return s; }
  var ART = {
    fedora: '<ellipse cx="350" cy="113" rx="98" ry="15" fill="#7a6853" ' + OUT + '/>' +
      '<use href="#hc" fill="#8d7b66" ' + OUT + '/>' +
      '<path d="M322 40 Q350 60 384 42" fill="none" stroke="#3b2f2a" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M281 90 Q350 104 420 88 L420 100 Q350 116 281 104Z" fill="#3b2f2a"/>',
    red: '<use href="#hc" fill="#c9473f" ' + OUT + '/><g clip-path="url(#hcc)">' + ribs("#9e332d") + '</g>' +
      '<path d="M281 88 Q350 74 420 84" fill="none" stroke="#3b2f2a" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="340" cy="30" r="15" fill="#efe3d3" ' + OUT + '/><path d="M330 24 L334 20 M342 18 L346 22 M336 34 L342 36" stroke="#b9a58f" stroke-width="2" stroke-linecap="round"/>',
    cap: '<use href="#hc" fill="#35567d" ' + OUT + '/>' +
      '<path d="M350 33 Q354 72 350 100" fill="none" stroke="#1f3550" stroke-width="2.2" stroke-linecap="round"/><circle cx="350" cy="33" r="4.5" fill="#1f3550"/>' +
      '<circle cx="388" cy="66" r="7" fill="#e23b3b" stroke="#3b2f2a" stroke-width="2"/>' +
      '<path d="M284 102 Q350 124 418 100 Q412 124 350 130 Q290 126 284 102Z" fill="#28425f" ' + OUT + '/>',
    barista: '<use href="#hc" fill="#7a5238" ' + OUT + '/>' +
      '<path d="M300 50 Q350 38 402 54 M292 74 Q350 62 412 78" fill="none" stroke="#5d3d29" stroke-width="2.4" stroke-linecap="round"/>' +
      '<g transform="rotate(-28 386 66)"><ellipse cx="386" cy="66" rx="11" ry="7.5" fill="#3b2f2a"/><path d="M376 66 Q386 62 396 66" fill="none" stroke="#e8d2b8" stroke-width="2" stroke-linecap="round"/></g>' +
      '<path d="M286 104 Q350 124 416 102 Q414 118 350 126 Q290 122 286 104Z" fill="#5d3d29" ' + OUT + '/>' +
      '<g class="hat-drip"><path d="M350 -8 C343 4 339 10 350 17 C361 10 357 4 350 -8Z" fill="#6b4a36" stroke="#3b2f2a" stroke-width="2"/></g>',
    heart: '<use href="#hc" fill="#f4a9ba" ' + OUT + '/>' +
      '<path d="M350 74 C337 57 321 70 336 82 L350 94 L364 82 C379 70 363 57 350 74Z" fill="#fff4f6" ' + OUT + ' stroke-width="2.6"/>' +
      '<path d="M262 112 Q350 142 438 112 Q430 100 420 98 L280 98 Q268 100 262 112Z" fill="#ec8aa1" ' + OUT + '/>',
    party: '<use href="#hc" fill="#86bfe0" ' + OUT + '/>' +
      '<path d="M306 60 L352 0 L400 60 Q352 72 306 60Z" fill="#f3c04a" ' + OUT + '/>' +
      '<path d="M318 47 Q352 56 391 45 M330 30 Q352 38 379 29" fill="none" stroke="#e2574c" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="352" cy="-3" r="8" fill="#e2574c" ' + OUT + ' stroke-width="2.6"/>',
    visor: '<use href="#hc" fill="#3a2c2c" ' + OUT + '/>' +
      '<path d="M300 50 Q350 38 398 52 M292 70 Q350 58 410 74" fill="none" stroke="#5a4343" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M281 84 Q350 68 420 82 L420 98 Q350 84 281 100Z" fill="#fffaf0" ' + OUT + '/>' +
      '<path d="M286 100 Q350 90 416 98 Q408 124 350 130 Q292 124 286 100Z" fill="#3f9a74" ' + OUT + '/>',
    bag: '<path d="M282 46 Q283 36 300 34 L400 34 Q418 36 420 46 L422 182 Q420 198 404 200 L298 200 Q282 198 282 184Z" fill="#c9a066" ' + OUT + '/>' +
      '<path d="M285 56 L419 56" stroke="#a8814c" stroke-width="2.4" fill="none"/><path d="M300 78 L312 72 M396 92 L408 100 M298 168 L310 176" stroke="#a8814c" stroke-width="2.4" stroke-linecap="round"/>' +
      '<ellipse cx="323" cy="136" rx="9" ry="6" fill="#2a211d"/><ellipse cx="372" cy="134" rx="9" ry="6" fill="#2a211d"/>' +
      '<path d="M334 166 Q349 177 366 164" fill="none" stroke="#2a211d" stroke-width="3" stroke-linecap="round"/>'
  };
  var SVG = '<svg class="hat-svg" viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' +
    '<defs><path id="hc" d="' + "%COVER%" + '"/><clipPath id="hcc"><use href="#hc"/></clipPath>' +
    '<filter id="hat-wob" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>';

  function init() {
    var wrap = document.getElementById("charWrap"), say = document.getElementById("hatSay");
    var stage = wrap && wrap.querySelector(".hv-stage");
    if (!wrap || !stage || !say) return;
    var vid = stage.querySelector("video"), poster = stage.querySelector("img");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.insertAdjacentHTML("beforeend", SVG.replace("%COVER%", COVER));
    var svg = stage.querySelector(".hat-svg");
    var nEl = say.querySelector(".hs-n"), tEl = say.querySelector(".hs-t"), hEl = say.querySelector(".hs-hint");
    var idx = 0, ready = false, busy = false, typer = 0, cur = null, clicked = false;
    new Image().src = "img/mini/emongc-intro-last.webp?v=1";

    function type(text) {
      clearInterval(typer);
      if (reduce) { tEl.textContent = text; return; }
      var i = 0; tEl.textContent = "";
      typer = setInterval(function () { i++; tEl.textContent = text.slice(0, i); if (i >= text.length) clearInterval(typer); }, 34);
    }
    function setHat(key) {
      if (cur) { var old = cur; old.classList.add("out"); setTimeout(function () { old.remove(); }, 260); cur = null; }
      if (key === "mustard" || !ART[key]) return;
      svg.insertAdjacentHTML("beforeend", '<g class="hat-g" filter="url(#hat-wob)">' + ART[key] + "</g>");
      cur = svg.lastElementChild;
    }
    function show(i) {
      idx = i;
      nEl.textContent = (i + 1) + " / " + HATS.length;
      type(HATS[i].line);
      setHat(HATS[i].key);
      wrap.classList.remove("bob"); void wrap.offsetWidth; wrap.classList.add("bob");
    }
    function next() {
      if (!ready || busy) return;
      busy = true; setTimeout(function () { busy = false; }, 420);
      if (!clicked) { clicked = true; hEl.textContent = ""; say.classList.add("clicked"); }
      show((idx + 1) % HATS.length);
    }
    function start() {
      if (ready) return;
      ready = true;
      wrap.classList.add("hat-ready");
      wrap.setAttribute("role", "button"); wrap.setAttribute("tabindex", "0");
      wrap.setAttribute("aria-label", "캐릭터를 눌러 모자 바꾸기");
      say.hidden = false; say.classList.add("on");
      nEl.textContent = "1 / " + HATS.length; type(HATS[0].line);
      setTimeout(function () { if (!clicked) hEl.textContent = HINT; }, 1400);
    }
    wrap.addEventListener("click", next);
    wrap.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } });

    // 영상이 끝나면 시작. 영상이 안 나오는 폰(저전력 모드 등)은 마지막 장면 그림으로 바꿔서 시작
    function fallback() { if (ready) return; if (poster) poster.src = "img/mini/emongc-intro-last.webp?v=1"; start(); }
    if (vid) {
      vid.addEventListener("ended", start);
      if (reduce) setTimeout(fallback, 800);
      else setTimeout(function () { if (!ready && (vid.paused || vid.currentTime < 0.5)) fallback(); }, 7000);
    } else fallback();
  }
  var COVER = "M279 107 L279 113 L283 118 L297 120 L300 116 L300 109 L304 108 L313 96 L320 96 L321 94 L356 94 L362 96 L365 100 L372 100 L379 108 L387 112 L391 118 L397 121 L397 126 L401 129 L401 132 L418 132 L418 114 L420 113 L418 88 L414 76 L406 66 L404 53 L398 43 L391 37 L369 31 L347 33 L337 43 L325 45 L310 53 L301 61 L295 73 L287 80 L281 98 L281 106Z";
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
