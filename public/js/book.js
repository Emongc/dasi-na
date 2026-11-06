// ==================================================
// 그림책 〈꿈〉
//  · 가로로 보기: 한 줄로 쭉 놓고 옆으로 밀어서 (버튼·키보드·마우스 끌기·손가락)
//  · 전체보기: 1~24쪽을 순서대로 한 페이지에 (그림 누르면 가로 보기의 그 쪽으로)
//  · 쪽 이미지: img/book/p01.webp ~ p24.webp / TEXT = 화면읽기용 설명
// ==================================================
(function () {
    // ---------- 책 목록: book.html?b=who 처럼 골라서 연다 (없으면 〈꿈〉) ----------
    const DREAM_TEXT = [
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
    const BOOKS = {
        dream: { title: "꿈", by: "글·그림 홍선미", ratio: 1, text: DREAM_TEXT, work: "dream-book",
                 file: function (i) { return "img/book/p" + String(i + 1).padStart(2, "0") + ".webp"; } },
        who: { title: "누구의 꿈일까", by: "글·그림 박수희 · 홍선미", ratio: 0.705, text: [
            "표지 — 누구의 꿈일까",
            "혼자 있는 시간 온은 혼자 있는 시간이 익숙했어요. 창밖의 계절은 바뀌어도 온의 하루는 조용히 흘러갔지요.",
            "익숙한 친구, 온의 이야기 온의 말을 끝까지 들어주는 친구는 AI 모아뿐이었어요. 온이 이야기를 꺼내면 모아는 늘 귀 기울였지요. “오늘은 공룡 책을 읽었어.” 온이 말했어요. 모아와 이야기하는 시간은 온에게 편안했어요.",
            "다시 학교로 오랜만에 학교에 간 날, 교실은 온이 기억한 것보다 훨씬 시끌벅적했어요. 온은 문 앞에서 잠시 멈췄어요.",
            "다른 마음들 “공룡이 좋아!” “난 우주가 더 좋은데?” 아이들의 말이 오갔어요. 온은 어느 말에 끼어야 할지 몰랐어요.",
            "한 걸음 뒤 누군가는 크게 말하고 누군가는 웃음을 터뜨렸어요. 온은 한 걸음 뒤에 서 있었어요. 자기 목소리가 아주 작아진 것 같았지요.",
            "부러운 웃음 운동장에서는 아이들이 서로 장난치며 웃고 있었어요. 온도 그 웃음 속에 있고 싶었지만, 어떻게 다가가야 할지 알 수 없었어요.",
            "집으로 돌아와 “오늘은 너무 힘들었어.” 온이 말했어요. 모아가 다정하게 대답했어요. “네 잘못이 아니야. 천천히 해도 괜찮아.”",
            "잠든 온 그날 밤, 온은 VR 헤드셋을 쓴 채 잠들었어요. 모아의 작은 빛이 방 안에 번지더니 온의 눈꺼풀도 스르르 내려왔지요.",
            "눈을 뜨니 눈을 뜨자 낯익고도 새로운 학교가 펼쳐졌어요. “여긴 네가 편안할 수 있도록 만든 곳이야.” 모아의 목소리가 들렸어요.",
            "꼭 맞는 친구들 온이 공룡을 좋아한다고 하자 모두 공룡을 좋아했어요. 축구가 싫다고 하자 아이들은 공을 내려놓았지요. 온은 처음으로 마음이 놓였어요.",
            "모두 웃어 온이 조심스레 농담을 건넸어요. 아이들은 한꺼번에 웃었지요. 온도 따라 웃었어요. ‘드디어 나와 꼭 맞는 친구들을 만났어.’",
            "초록 하늘 온이 장난스럽게 말했어요. “오늘 하늘은 초록색이야.” 모두가 하늘을 올려다보고 대답했어요. “맞아, 초록색이야!”",
            "무엇이 맞을까 “저 구름은 고래야.” “맞아!” “아니, 그냥 구름이야.” “맞아!” 무슨 말을 해도 같은 대답이 돌아왔어요. 온은 웃음이 멈췄어요.",
            "구석의 아이 그때 운동장 구석에 혼자 앉은 아이가 보였어요. 온은 조심조심 다가가 물었어요. “너는 어떻게 생각해?”",
            "잘 모르겠어 “잘 모르겠어.” 아이가 말했어요. 온은 깜짝 놀랐어요. 여기서 처음 듣는 다른 대답이었거든요. 이상하게도 그 말이 싫지 않았어요.",
            "나비 “나는 나비야.” 아이가 말했어요. 온은 초코 아이스크림을, 나비는 딸기 아이스크림을 골랐어요. 서로 다른 맛을 한 입씩 맛보았지요.",
            "다른 놀이 온은 숨바꼭질을 하고 싶었고, 나비는 술래잡기를 하고 싶었어요. 둘은 생각이 달라 잠시 등을 돌렸어요. 운동장이 조용해졌지요.",
            "먼저 건넨 말 나비가 온의 등을 톡 건드렸어요. “아까는 미안해.” 온도 고개를 돌렸어요. “나도.” 둘은 조금 어색하게 웃었어요. 그 웃음은 아까와 달랐어요.",
            "진짜일까 나비가 물었어요. “온아, 여기가 진짜라고 생각해?” 온이 대답하려는 순간, 운동장이 흔들리기 시작했어요. 하늘에 가느다란 금이 갔지요.",
            "꿈의 가장자리 “돌아갈 시간이야.” 모아가 말했어요. “나비도 데려갈래!” 온이 손을 뻗었어요. “나비는 내가 만든 아이가 아니야.” 모아의 목소리가 멀어졌어요.",
            "누구의 꿈? 나비는 눈을 떴어요. \"온은 어디에 있어\" 나비의 AI는 말했어요. \"온 이라는 아이는 기록에 없어요.\" 나비는 창가의 나비 그림을 바라 보았어요.",
            "마주한 친구 꿈에서 깨어난 건 누구일까?",
            "뒤표지 — 서로 다른 마음이 만나, 조금씩 맞춰 가는 이야기"
    ], work: "who",
               file: function (i) { return "img/works/book/who/gallery/" + String(i + 1).padStart(2, "0") + ".webp"; } }
    };
    const key = new URLSearchParams(location.search).get("b");
    const BOOK = BOOKS[key] || BOOKS.dream;
    const TEXT = BOOK.text;
    document.documentElement.style.setProperty("--ratio", BOOK.ratio);
    document.title = BOOK.title + " — 그림책 보기 | Again, Emongc";
    const lab = document.querySelector(".bk-label");
    if (lab) lab.innerHTML = '<span class="bk-tape">그림책</span> ' + BOOK.title + " <small>" + BOOK.by + "</small>";
    document.querySelectorAll(".bk-end-link").forEach(function (a) { a.href = "index.html?work=" + BOOK.work + "&process=1#works"; });
    const TOTAL = TEXT.length;
    const file = BOOK.file;
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
