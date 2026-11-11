/* ==========================================================
   히어로 · 모자 갈아쓰기 (캐릭터를 누르면 모자가 바뀌고 두 줄 문구가 써짐)
   ----------------------------------------------------------
   ★ 문구를 바꾸려면 아래 HATS 목록의 글자만 고치세요. ["윗줄", "아랫줄"] 두 칸이에요. (따옴표 "" 안쪽만)
   ★ 순서를 바꾸려면 줄 단위로 위아래로 옮기세요. 1번과 10번은 영상 속 머스타드 비니 그대로예요.
   ========================================================== */
(function () {
  "use strict";
  var HATS = [
    { key: "mustard", line: ["안녕하세요,", "에몽씨예요!"] },                          // 1  머스타드 비니 (영상 속 모자)
    { key: "fedora",  line: ["디자인하는 날.", "한 화면에 질서를 넣어요."] },            // 2  페도라
    { key: "red",     line: ["홍보물 만드는 날.", "눈길 가는 한 줄을 찾아요."] },         // 3  빨강 비니
    { key: "cap",     line: ["영상 만드는 날.", "상상을 움직이게 해요."] },              // 4  야구 모자
    { key: "barista", line: ["커피 내리는 날.", "디자인도 한 방울씩 내려요."] },          // 5  바리스타 캡
    { key: "heart",   line: ["챙기는 날.", "사람 먼저 보는 눈이 있어요."] },             // 6  하트 벙거지
    { key: "straw",   line: ["행사하는 날.", "시작부터 끝까지 챙겨요."] },               // 7  밀짚모자
    { key: "bowler",  line: ["정리하는 날.", "서류도 일정도 깔끔하게요."] },             // 8  중산모
    { key: "bag",     line: ["가끔은 이런 날도 있어요.", "장난기는 덤!"] },              // 9  종이봉투
    { key: "mustard", line: ["그래도 저는 에몽씨.", "모자는 바뀌어도 일은 끝까지."] }     // 10 다시 머스타드 비니
  ];
  var HINT = "캐릭터를 톡 눌러보세요";
  var LAST = "img/mini/emongc-intro-last.webp?v=1";

  /* 모자 그림 (영상 640×420 기준 좌표). #hc = 영상 속 비니 윤곽(부드럽게 다듬은 것) — 모든 모자가 이 위를 완전히 덮음 */
  function ln(c, w) { return 'stroke="' + c + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round" stroke-linecap="round"'; }
  function shade(cx, cy, rx, ry, o) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#3b2a22" opacity="' + (o || 0.22) + '" filter="url(#hat-blur)"/>'; }
  function ribs(c, y0, y1) { var s = ""; for (var x = 285; x < 424; x += 7) s += "M" + x + " " + y0 + " L" + (x + 1.5) + " " + y1 + " "; return '<path d="' + s + '" fill="none" stroke="' + c + '" stroke-width="1.5" opacity=".75"/>'; }
  function crown(fill, line, extra) { return '<g clip-path="url(#hclip)"><use href="#hc" fill="url(#' + fill + ')" ' + ln(line) + '/>' + (extra || "") + '</g><path d="M281 110 Q350 121 421 108" fill="none" ' + ln(line) + '/>'; }
  var ART = {
    fedora: shade(350, 134, 82, 8) +
      '<ellipse cx="350" cy="113" rx="113" ry="23" fill="url(#g-fb)" ' + ln("#4a3d30") + '/>' +
      '<ellipse cx="350" cy="113" rx="100" ry="17" fill="none" stroke="#5c4c3b" stroke-width="1" opacity=".55"/>' +
 crown("g-f", "#4a3d30") +
      '<path d="M322 46 Q352 68 388 46" fill="none" stroke="#5c4c3b" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M316 64 Q326 50 344 45" fill="none" stroke="#c5b199" stroke-width="3.5" opacity=".5" stroke-linecap="round"/>' +
      '<path d="M281 96 Q350 86 421 94 L421 108 Q350 121 281 110Z" fill="#2e2622"/>' +
      '<path d="M290 102 Q350 95 412 101" fill="none" stroke="#5a4c43" stroke-width="1.4"/>',
    red: shade(350, 134, 70, 7) +
      '<path d="M281 118 C273 74 297 42 350 31 C403 40 427 72 420 110 L420 130 Q350 122 281 119Z" fill="url(#g-r)" ' + ln("#7d2520") + '/>' +
      '<g clip-path="url(#hcc2)">' + ribs("#8f2b26", 64, 124) + '</g>' +
      '<path d="M281 98 Q350 102 420 112 L420 130 Q350 122 281 119Z" fill="#b8382f" ' + ln("#7d2520", 2) + '/>' +
      '<path d="M285 104 Q350 108 417 118" fill="none" stroke="#e8837b" stroke-width="1.4" opacity=".6"/>' +
      '<path d="M300 66 Q322 44 352 38" fill="none" stroke="#f3978f" stroke-width="5" opacity=".45" stroke-linecap="round"/>' +
      '<circle cx="350" cy="28" r="17" fill="url(#g-p)" ' + ln("#a8987f", 1.6) + '/>' +
      '<path d="M337 22 L341 17 M349 14 L351 10 M360 17 L365 14 M365 28 L370 29 M336 33 L331 35 M356 41 L357 45 M343 40 L341 44" stroke="#c9b99f" stroke-width="1.6" stroke-linecap="round"/>',
    cap: shade(350, 132, 66, 6) +
      '<use href="#hc" fill="url(#g-c)" ' + ln("#16263f") + '/>' +
      '<path d="M352 32 Q356 68 352 100 M352 32 Q318 56 303 102 M352 32 Q388 54 405 102" fill="none" stroke="#1d304a" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M310 52 Q330 40 348 37" fill="none" stroke="#7ea0cc" stroke-width="4" opacity=".4" stroke-linecap="round"/>' +
      '<circle cx="352" cy="33" r="5" fill="#2a4569" ' + ln("#16263f", 1.6) + '/>' +
      '<circle cx="391" cy="70" r="8.5" fill="#f4f4f1" ' + ln("#16263f", 1.4) + '/><circle cx="391" cy="70" r="5.2" fill="#e23b3b"/>' +
      '<path d="M283 106 Q350 119 419 103 Q414 125 350 127 Q291 125 283 106Z" fill="url(#g-cb)" ' + ln("#101c2e") + '/>' +
      '<path d="M298 113 Q350 123 406 109" fill="none" stroke="#5b7fae" stroke-width="1.4" opacity=".7"/>',
    barista: shade(350, 133, 66, 6) +
      '<use href="#hc" fill="url(#g-b)" ' + ln("#33200f") + '/><use href="#hc" fill="url(#tw)"/>' +
      '<path d="M292 72 Q352 40 410 66" fill="none" stroke="#3d2816" stroke-width="1.8"/>' +
      '<path d="M303 76 L318 108 M402 72 L395 108" fill="none" stroke="#3d2816" stroke-width="1.4"/>' +
      '<path d="M306 56 Q326 44 346 40" fill="none" stroke="#c19a70" stroke-width="4" opacity=".35" stroke-linecap="round"/>' +
      '<circle cx="352" cy="38" r="4.5" fill="#5f4129" ' + ln("#33200f", 1.4) + '/>' +
      '<path d="M288 108 Q350 122 416 105 Q412 125 350 129 Q295 125 288 108Z" fill="#4a321f" ' + ln("#2a1a0d") + '/>' +
      '<path d="M300 114 Q350 124 406 111" fill="none" stroke="#7d5a3a" stroke-width="1.3" opacity=".7"/>' +
      '<g class="hat-drip"><path d="M352 -4 C345 9 341 15 352 22 C363 15 359 9 352 -4Z" fill="#5a3b26" ' + ln("#33200f", 1.6) + '/><ellipse cx="349" cy="14" rx="2" ry="3" fill="#a77c58" opacity=".7"/></g>',
    heart: shade(350, 134, 82, 8) +
      '<ellipse cx="350" cy="113" rx="110" ry="22" fill="url(#g-hb)" ' + ln("#b9566f") + '/>' +
      '<ellipse cx="350" cy="113" rx="96" ry="16" fill="none" stroke="#cf6f88" stroke-width="1.3" stroke-dasharray="3 3"/>' +
 crown("g-h", "#b9566f") +
      '<path d="M296 80 Q350 68 408 82" fill="none" stroke="#cf6f88" stroke-width="1.3" stroke-dasharray="3 3"/>' +
      '<path d="M352 78 C339 60 322 72 336 84 L352 98 L368 84 C382 72 365 60 352 78Z" fill="#fff5f7" ' + ln("#d9627f", 1.8) + '/>' +
      '<path d="M334 70 Q338 66 343 68" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>' +
      '<path d="M306 58 Q328 44 350 40" fill="none" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/>',
    straw: shade(350, 136, 90, 8) +
      '<ellipse cx="350" cy="114" rx="130" ry="27" fill="url(#g-sb)" ' + ln("#8f6a2f") + '/>' +
      '<ellipse cx="350" cy="114" rx="114" ry="21" fill="none" stroke="#b48a46" stroke-width="1.2" opacity=".7"/><ellipse cx="350" cy="114" rx="98" ry="16" fill="none" stroke="#b48a46" stroke-width="1.2" opacity=".7"/>' +
 crown("g-s", "#8f6a2f", '<use href="#hc" fill="url(#wv)"/>') +
      '<path d="M281 96 Q350 86 421 94 L421 108 Q350 121 281 110Z" fill="#d4493f" ' + ln("#a02f27", 1.4) + '/>' +
      '<path d="M396 100 Q414 82 424 98 Q414 108 398 102Z M398 102 Q408 118 394 126 Q392 112 398 102Z" fill="#e2564c" ' + ln("#a02f27", 1.4) + '/><circle cx="398" cy="101" r="4.5" fill="#c23d34" ' + ln("#a02f27", 1.2) + '/>' +
      '<path d="M306 58 Q328 42 350 39" fill="none" stroke="#fbe8b6" stroke-width="4" opacity=".4" stroke-linecap="round"/>',
    bowler: shade(350, 133, 76, 7, .3) +
      '<ellipse cx="350" cy="113" rx="106" ry="17" fill="#2a2725" ' + ln("#0f0e0d") + '/>' +
 crown("g-w", "#0f0e0d") +
      '<path d="M281 96 Q350 86 421 94 L421 108 Q350 121 281 110Z" fill="#54606f" ' + ln("#2d3540", 1.2) + '/>' +
      '<path d="M304 62 Q324 44 352 40" fill="none" stroke="#b5aea6" stroke-width="6" opacity=".35" stroke-linecap="round"/>' +
      '<path d="M254 117 Q350 134 446 117" fill="none" stroke="#6d6761" stroke-width="1.3" opacity=".7"/>',
    bag: '<path d="M280 74 L424 74 L426 206 L278 206Z" fill="url(#g-bg)" ' + ln("#8f6a3a", 2.2) + '/>' +
      '<path d="M280 74 L306 46 L398 46 L424 74Z" fill="#e6c48f" ' + ln("#8f6a3a", 2.2) + '/>' +
      '<path d="M306 46 L398 46 M338 46 L336 74 M366 46 L368 74" fill="none" stroke="#a8814c" stroke-width="1.3" opacity=".6"/>' +
      '<path d="M336 44 L368 44 L371 76 L334 76Z" fill="#f4e7c8" opacity=".85" ' + ln("#c9b27d", 1.2) + '/>' +
      '<path d="M410 76 L426 206 L412 206 L400 80Z" fill="#8f6a3a" opacity=".2"/>' +
      '<path d="M290 84 Q330 78 360 84" fill="none" stroke="#f0d3a0" stroke-width="4" opacity=".5" stroke-linecap="round"/>' +
      '<path d="M308 124 L334 150 M334 124 L308 150 M368 124 L394 150 M394 124 L368 150" fill="none" stroke="#231a15" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="300" cy="166" rx="9" ry="5" fill="#e79a9a" opacity=".5"/><ellipse cx="402" cy="166" rx="9" ry="5" fill="#e79a9a" opacity=".5"/>' +
      '<path d="M336 172 L366 172" fill="none" stroke="#3b2a1f" stroke-width="3.2" stroke-linecap="round"/>' +
      '<g transform="rotate(-5 350 194)"><rect x="296" y="182" width="108" height="22" rx="4" fill="#fffaf0" ' + ln("#c0392b", 1.6) + '/>' +
      '<text x="350" y="198" text-anchor="middle" font-size="14" font-weight="700" fill="#c0392b" font-family="Gaegu, cursive">취급주의 ↑</text></g>'
  };
  function lg(id, a, b) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  var DEFS = '<path id="hc" d="' + "M354.6 31.3 C350.5 32.4 345.3 35.1 340.6 37.3 C336.0 39.4 331.4 41.7 326.8 44.1 C322.2 46.5 317.4 48.4 313.0 51.4 C308.7 54.5 304.2 58.6 300.4 62.6 C296.7 66.7 293.4 71.3 290.7 75.9 C287.9 80.4 285.5 85.0 283.8 89.7 C282.0 94.4 280.2 99.8 280.2 104.1 C280.2 108.3 281.5 113.1 283.7 115.0 C285.8 116.9 290.3 117.0 293.3 115.7 C296.2 114.3 298.3 109.7 301.2 106.7 C304.1 103.8 307.0 100.0 310.7 98.0 C314.5 95.9 319.2 94.9 323.9 94.3 C328.6 93.8 333.6 94.0 338.9 94.4 C344.2 94.9 350.4 95.8 355.6 96.8 C360.8 97.9 365.6 98.8 369.9 100.6 C374.3 102.3 378.0 104.7 381.7 107.3 C385.4 109.9 389.0 113.0 392.2 116.0 C395.5 119.1 398.0 123.2 401.1 125.6 C404.2 128.1 407.9 131.0 410.8 130.8 C413.6 130.5 416.6 127.7 418.2 124.3 C419.8 120.9 420.0 115.3 420.1 110.5 C420.3 105.7 420.0 100.5 419.2 95.4 C418.4 90.3 417.1 85.0 415.3 80.0 C413.6 75.0 411.0 70.2 409.0 65.5 C407.0 60.9 405.5 56.0 403.1 51.9 C400.7 47.7 398.2 43.6 394.5 40.6 C390.8 37.6 385.9 35.5 381.0 33.8 C376.2 32.2 370.0 31.1 365.6 30.7 C361.2 30.3 358.8 30.3 354.6 31.3Z" + '"/><clipPath id="hclip"><path d="M240 -20 L460 -20 L460 108 Q350 121 240 110Z"/></clipPath><clipPath id="hcc"><use href="#hc"/></clipPath>' +
    '<clipPath id="hcc2"><path d="M281 118 C273 74 297 42 350 31 C403 40 427 72 420 110 L420 130 Q350 122 281 119Z"/></clipPath><filter id="hat-blur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>' +
    lg("g-f", "#a08c75", "#6c5a47") + lg("g-fb", "#85715b", "#5c4c3b") + lg("g-r", "#df5a52", "#a9322c") +
    '<radialGradient id="g-p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fbf3e4"/><stop offset="1" stop-color="#d6c6ad"/></radialGradient>' +
    lg("g-c", "#4570a1", "#27405f") + lg("g-cb", "#26426a", "#16263f") + lg("g-b", "#8d6742", "#5a3d26") +
    lg("g-h", "#f9bfcc", "#e4889f") + lg("g-hb", "#f1a0b3", "#d77a93") + lg("g-s", "#ebcc8d", "#c39b57") + lg("g-sb", "#e2bd78", "#b98f4b") +
    lg("g-w", "#47423f", "#1f1c1a") + lg("g-bg", "#dcb67f", "#b78a4f") +
    '<pattern id="tw" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="#3d2816" stroke-width="1" opacity=".3"/><path d="M0 0 L6 6" stroke="#c7a27a" stroke-width=".6" opacity=".25"/></pattern>' +
    '<pattern id="wv" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 2.5 L5 2.5 M2.5 0 L2.5 5" stroke="#b48a46" stroke-width=".8" opacity=".45"/></pattern>';
  var SVG = '<svg class="hat-svg" viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs>' + DEFS + "</defs></svg>";

  function init() {
    var wrap = document.getElementById("charWrap"), say = document.getElementById("hatSay");
    var stage = wrap && wrap.querySelector(".hv-stage");
    if (!wrap || !stage || !say) return;
    var vid = stage.querySelector("video"), poster = stage.querySelector("img");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.insertAdjacentHTML("beforeend", SVG);
    var svg = stage.querySelector(".hat-svg");
    var nEl = say.querySelector(".hs-n"), t1 = say.querySelector(".hs-t1"), t2 = say.querySelector(".hs-t2"), hEl = say.querySelector(".hs-hint");
    var idx = 0, ready = false, ended = false, busy = false, typer = 0, cur = null, clicked = false;
    new Image().src = LAST;

    function type(lines) {
      clearInterval(typer);
      var a = lines[0], b = lines[1] || "";
      if (reduce) { t1.textContent = a; t2.textContent = b; return; }
      var i = 0; t1.textContent = ""; t2.textContent = "";
      typer = setInterval(function () {
        i++; t1.textContent = a.slice(0, Math.min(i, a.length)); t2.textContent = b.slice(0, Math.max(0, i - a.length));
        if (i >= a.length + b.length) clearInterval(typer);
      }, 32);
    }
    function setHat(key) {
      if (cur) { var old = cur; old.classList.add("out"); setTimeout(function () { old.remove(); }, 260); cur = null; }
      if (key === "mustard" || !ART[key]) return;
      svg.insertAdjacentHTML("beforeend", '<g class="hat-g">' + ART[key] + "</g>");
      cur = svg.lastElementChild;
    }
    function show(i) {
      idx = i;
      // nEl.textContent = (i + 1) + " / " + HATS.length;// 
      type(HATS[i].line);
      setHat(HATS[i].key);
      wrap.classList.remove("bob"); void wrap.offsetWidth; wrap.classList.add("bob");
    }
    // 인사 영상을 기다리지 않고 누르면 → 영상을 마지막 장면(인사 끝난 자세)으로 건너뜀
    function skipIntro() {
      if (ended) return; ended = true;
      if (vid) { try { vid.pause(); } catch (e) {} vid.style.transition = "none"; vid.style.opacity = "0"; }
      if (poster) poster.src = LAST;
    }
    function next() {
      if (!ready || busy) return;
      busy = true; setTimeout(function () { busy = false; }, 420);
      skipIntro();
      if (!clicked) { clicked = true; hEl.textContent = ""; say.classList.add("clicked"); }
      show((idx + 1) % HATS.length);
    }
    function start() {
      if (ready) return;
      ready = true;
      wrap.classList.add("hat-ready");
      wrap.setAttribute("role", "button"); wrap.setAttribute("tabindex", "0");
      wrap.setAttribute("aria-label", "캐릭터를 눌러 모자 바꾸기");
      say.hidden = false; void say.offsetWidth; say.classList.add("on");
      nEl.textContent = "1 / " + HATS.length; type(HATS[0].line);
      hEl.textContent = HINT;
    }
    wrap.addEventListener("click", next);
    wrap.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } });
    if (vid) vid.addEventListener("ended", function () { ended = true; });

    // 캐릭터가 올라오는 시점(글꼴 도착 + 약 2초)에 문구와 안내를 바로 보여줌
    function afterFonts(cb) { if (window.__fontsReady !== false) cb(); else document.addEventListener("fontsready", cb, { once: true }); }
    afterFonts(function () { setTimeout(start, reduce ? 0 : 1900); });
    // 영상이 안 나오는 폰(저전력 모드 등): 마지막 장면 그림으로 바꿔서 같은 방식으로 동작
    if (vid && !reduce) setTimeout(function () { if (!ended && (vid.paused || vid.currentTime < 0.3)) { ended = true; vid.style.opacity = "0"; if (poster) poster.src = LAST; } }, 7000);
    if (reduce) { ended = true; if (poster) poster.src = LAST; }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
