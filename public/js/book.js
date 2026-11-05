// ==================================================
// 그림책 〈꿈〉
//  · 가로로 보기: 한 줄로 쭉 놓고 옆으로 밀어서 (버튼·키보드·마우스 끌기·손가락)
//  · 전체보기: 1~24쪽을 순서대로 한 페이지에 (그림 누르면 가로 보기의 그 쪽으로)
//  · 쪽 이미지: img/book/p01.webp ~ p24.webp / TEXT = 화면읽기용 설명
// ==================================================
(function () {
    const TEXT = [
        "표지 — 꿈",
        "우리 집에는 AI가 함께 살고 있다.",
        "궁금한 게 생기면 나는 묻는다.",
        "막막한 날에도 나는 묻는다.",
        "“아이와 갈 여행을 계획해 줘.”",
        "“오늘 저녁 뭘 먹을지 알려줘.”",
        "“아이가 좋아할 놀이 말해줘.”",
        "“준비물 리스트로 보여줘.”",
        "AI는 모든 걸 알고 있다.",
        "힘든 날에는 내 이야기를 들어준다.",
        "AI가 건네는 위로에 나는 정말 괜찮아진다.",
        "아이의 숙제도,",
        "우리 가족의 하루도,",
        "나의 일도,",
        "내일 할 일도,",
        "그리고 내가 앞으로 하고 싶은 것들과",
        "어느 길로 가야 하는지도 AI가 정해준다.",
        "생각하지 않아도 괜찮다. AI가 생각해 주니까.",
        "고민하지 않아도 괜찮다. AI가 골라주니까.",
        "어느 날,",
        "AI가 아무 대답도 하지 않았다.",
        "내 꿈이.. 사라졌다..",
        "“내 꿈이 이루어졌다..!”",
        "어둠 속에 홀로 앉아 있는 뒷모습"
    ];
    const TOTAL = TEXT.length;
    const file = function (i) { return "img/book/p" + String(i + 1).padStart(2, "0") + ".webp"; };
    const page = function (i, lazy) {
        return '<figure class="bk-page"><img src="' + file(i) + '" alt="' + TEXT[i].replace(/"/g, "&quot;") +
            '" decoding="async"' + (lazy ? ' loading="lazy"' : "") + ' draggable="false">' +
            '<figcaption class="bk-no" aria-hidden="true">' + (i === 0 ? "표지" : i + 1) + "</figcaption></figure>";
    };

    const strip = document.getElementById("strip");
    const grid = document.getElementById("grid");
    const stripWrap = document.getElementById("stripWrap");
    const allView = document.getElementById("allView");
    const endCard = document.getElementById("bkEnd");
    const prevBtn = document.getElementById("bkPrev");
    const nextBtn = document.getElementById("bkNext");
    const count = document.getElementById("bkCount");
    const bar = document.getElementById("bkBar");
    const btnStrip = document.getElementById("viewStrip");
    const btnAll = document.getElementById("viewAll");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- 채우기 ----------
    let s = "";
    for (let i = 0; i < TOTAL; i++) s += page(i, i > 3);
    strip.innerHTML = s;
    strip.appendChild(endCard);

    let g = "";
    for (let i = 0; i < TOTAL; i++) g += '<li><button type="button" data-i="' + i + '" aria-label="' + (i + 1) + '쪽 크게 보기">' + page(i, true) + "</button></li>";
    grid.innerHTML = g;
    const endCopy = endCard.cloneNode(true);
    endCopy.removeAttribute("id");
    const li = document.createElement("li");
    li.appendChild(endCopy);
    grid.appendChild(li);

    // ---------- 가로로 보기 ----------
    const cards = strip.children;
    function step() { return cards[1].offsetLeft - cards[0].offsetLeft; }        // 카드 1장 + 간격
    function perView() { return Math.max(1, Math.floor(strip.clientWidth / step())); }
    function first() { return Math.round(strip.scrollLeft / step()); }
    let scrollToCard = function (i) {
        i = Math.max(0, Math.min(cards.length - 1, i));
        strip.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
    };
    function update() {
        const max = strip.scrollWidth - strip.clientWidth;
        const f = first();
        const last = Math.min(TOTAL, f + perView());
        count.textContent = (f >= TOTAL ? "끝" : (f + 1 === last ? (f + 1) : (f + 1) + "–" + last) + " / " + TOTAL);
        prevBtn.disabled = strip.scrollLeft <= 2;
        nextBtn.disabled = strip.scrollLeft >= max - 2;
        bar.style.width = (max > 0 ? strip.scrollLeft / max * 100 : 100) + "%";
    }
    prevBtn.addEventListener("click", function () { scrollToCard(first() - perView()); });
    nextBtn.addEventListener("click", function () { scrollToCard(first() + perView()); });
    strip.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("keydown", function (e) {
        if (stripWrap.hidden || e.target.closest("input, textarea")) return;
        if (e.key === "ArrowRight") { e.preventDefault(); scrollToCard(first() + 1); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); scrollToCard(first() - 1); }
    });

    // ---------- 부드럽게 움직이기 (버튼·끌기 공통) ----------
    let anim = null;
    function stopAnim() { if (anim) { cancelAnimationFrame(anim); anim = null; } strip.classList.remove("anim"); }
    function animateTo(left, dur) {
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        strip.classList.add("anim");
        const max = strip.scrollWidth - strip.clientWidth;
        const from = strip.scrollLeft, to = Math.max(0, Math.min(max, left)), dist = to - from;
        if (reduce || Math.abs(dist) < 1) { strip.scrollLeft = to; strip.classList.remove("anim"); update(); return; }
        // 움직이는 동안은 카드 맞춤(스냅)을 잠시 끈 상태(anim)
        const t0 = performance.now();
        dur = dur || Math.min(700, 320 + Math.abs(dist) * 0.25);
        (function frame(now) {
            const t = Math.min(1, (now - t0) / dur);
            const e = 1 - Math.pow(1 - t, 3);   // 처음엔 빠르게, 끝에서 사뿐히
            strip.scrollLeft = from + dist * e;
            if (t < 1) anim = requestAnimationFrame(frame);
            else { anim = null; strip.classList.remove("anim"); update(); }
        })(t0);
    }
    function cardLeft(i) { i = Math.max(0, Math.min(cards.length - 1, i)); return cards[i].offsetLeft - cards[0].offsetLeft; }
    scrollToCard = function (i) { animateTo(cardLeft(i)); };

    // 마우스로 끌기: 손에 붙어 따라오고, 놓으면 관성으로 미끄러진 뒤 끈 방향 카드에 붙음
    // (휴대폰 손가락은 브라우저 기본 스크롤이 이미 부드러움)
    let down = false, moved = false, sx = 0, sl = 0, lastX = 0, raf = null, samples = [];
    strip.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        stopAnim();
        down = true; moved = false;
        sx = lastX = e.clientX; sl = strip.scrollLeft;
        samples = [{ x: e.clientX, t: performance.now() }];
        e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
        if (!down) return;
        lastX = e.clientX;
        const now = performance.now();
        samples.push({ x: e.clientX, t: now });
        while (samples.length > 2 && now - samples[0].t > 100) samples.shift();   // 최근 0.1초만
        if (!moved && Math.abs(lastX - sx) > 4) { moved = true; strip.classList.add("dragging"); }
        if (moved && !raf) raf = requestAnimationFrame(function () { raf = null; strip.scrollLeft = sl - (lastX - sx); });
    });
    window.addEventListener("mouseup", function () {
        if (!down) return;
        down = false;
        if (!moved) return;
        if (raf) { cancelAnimationFrame(raf); raf = null; strip.scrollLeft = sl - (lastX - sx); }
        strip.classList.add("anim");          // 스냅이 다시 켜져 제자리로 튀지 않게 먼저
        strip.classList.remove("dragging");
        // 놓는 순간 속도(px/ms) → 관성으로 더 갈 거리
        const s0 = samples[0], s1 = samples[samples.length - 1];
        const v = (s1.t - s0.t) > 0 ? (s1.x - s0.x) / (s1.t - s0.t) : 0;
        const projected = strip.scrollLeft - v * 260;
        const st = step(), startIdx = Math.round(sl / st);
        let target = Math.round(projected / st);
        const moveBy = strip.scrollLeft - sl;   // + = 오른쪽(다음)으로 끌림
        if (Math.abs(moveBy) > st * 0.15) {
            if (moveBy > 0) target = Math.max(target, startIdx + 1);
            else target = Math.min(target, startIdx - 1);
        } else if (Math.abs(v) < 0.3) target = startIdx;
        animateTo(cardLeft(target));
        setTimeout(function () { moved = false; }, 0);
    });
    // 끌고 난 뒤 손을 뗄 때 그림이 클릭으로 처리되지 않게
    strip.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    // 손가락·트랙패드로 직접 밀기 시작하면 진행 중인 애니메이션 멈춤
    strip.addEventListener("touchstart", stopAnim, { passive: true });

    // 마우스 휠(세로)도 가로로
    strip.addEventListener("wheel", function (e) {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        const max = strip.scrollWidth - strip.clientWidth;
        if ((e.deltaY > 0 && strip.scrollLeft >= max - 2) || (e.deltaY < 0 && strip.scrollLeft <= 2)) return;   // 끝에선 페이지 스크롤
        e.preventDefault();
        stopAnim();
        strip.scrollLeft += e.deltaY;
    }, { passive: false });

    // ---------- 보기 전환 ----------
    function show(mode, i) {
        const all = mode === "all";
        allView.hidden = !all;
        stripWrap.hidden = all;
        btnAll.classList.toggle("on", all);
        btnStrip.classList.toggle("on", !all);
        btnAll.setAttribute("aria-pressed", all ? "true" : "false");
        btnStrip.setAttribute("aria-pressed", all ? "false" : "true");
        if (!all) {
            const html = document.documentElement, prev = strip.style.scrollBehavior;
            strip.style.scrollBehavior = "auto";
            strip.scrollLeft = cards[i || 0].offsetLeft - cards[0].offsetLeft;
            strip.style.scrollBehavior = prev;
            update();
        }
    }
    btnStrip.addEventListener("click", function () { show("strip", first()); });
    btnAll.addEventListener("click", function () { show("all"); });
    grid.addEventListener("click", function (e) {
        const b = e.target.closest("button[data-i]");
        if (!b) return;
        show("strip", +b.dataset.i);
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        strip.focus({ preventScroll: true });
    });

    update();
})();
