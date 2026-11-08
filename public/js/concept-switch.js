/* ==================================================
   컨셉 토글 (STUDIO ⇄ GALLERY) — index.html · works-gallery.html 공통
   - [data-cs-go] 를 누르면: ① 두 페이지의 "보던 자리" 기록을 지워서 도착하면 항상 맨 위부터 열리게 하고
                           ② 손잡이를 반대쪽으로 넘긴 뒤(0.14초) 이동 — 화면 전환(크로스 페이드)은 css/cswitch.css
   - 움직임 줄이기 설정이면 손잡이 애니메이션 없이 바로 이동 / Ctrl·Shift·휠 클릭(새 탭)은 그대로
   - 새로고침·뒤로가기는 지금처럼 보던 자리를 유지함 (이 토글로 갈 때만 맨 위)
   ================================================== */
(function () {
    var KEYS = ["scrollSpot", "gScroll", "gDetailScroll"];   // script.js · gallery.js 가 저장하는 "보던 자리"
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var busy = false;
    window.addEventListener("pageshow", function () {   // 뒤로가기로 돌아왔을 때 상태 정리
        busy = false;
        document.querySelectorAll(".tg.go").forEach(function (t) { t.classList.remove("go"); });
    });
    document.addEventListener("click", function (e) {
        var a = e.target.closest ? e.target.closest("[data-cs-go]") : null;
        if (a && a.hasAttribute("aria-current")) { e.preventDefault(); return; }   // 지금 보는 쪽을 누르면 아무 일 없음
        if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        try { KEYS.forEach(function (k) { sessionStorage.removeItem(k); }); } catch (x) {}
        if (reduce) return;
        e.preventDefault();
        if (busy) return;
        busy = true;
        a.closest(".tg").classList.add("go");
        setTimeout(function () { location.href = a.getAttribute("href"); }, 140);
    });
})();
