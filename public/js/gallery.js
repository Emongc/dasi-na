/* ==================================================
   WORKS 갤러리 뷰 (works-gallery.html 전용)
   - 작품 목록: js/works-data.js 의 WORKS / WORK_CATS 를 읽기만 함 (고치지 않음)
   - 목록: 분야별 "펼침면" — 목차 / 영상(커버+순위표) / 음악(플레이리스트) / 출판(BOOKS + 춤추는 캐릭터)
     / 홍보·광고(포스터 줄 + 광고 줄) / 강의(슬라이드) / 기획 — 모두 같은 12칸 그리드, 줄마다 높이·끝선 맞춤
   - 상세: 누르면 바로 열림 (거대한 제목 → 정보 3단 → why. → works. → process. → 다음 작품)
   - 상세 주소: works-gallery.html?w=작품id (이력서·메일에 작품 하나만 링크 가능)
   ================================================== */
(function () {
    "use strict";
    const WORKS = (window.WORKS || []).filter(function (w) { return !w.hidden && w.type !== "mascot"; });
    const CATS = (window.WORK_CATS || []).filter(function (c) { return WORKS.some(function (w) { return w.cat === c.key; }); });
    const catLabel = {};
    CATS.forEach(function (c) { catLabel[c.key] = c.label; });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // 작품마다 큰 글자로 얹는 영문 한 줄 (초안 — 마음대로 고치기)
    const HEAD = {
        "school": "Skip → Speak",
        "dream-video": "My dream is gone.",
        "teen": "Fourteen, and restless.",
        "couple": "Said too much. Again.",
        "rap": "Different is the point.",
        "today": "It's okay not to be okay.",
        "notbad": "Bad day, not me.",
        "teacher": "Got the message?",
        "dream-book": "Who holds your dream?",
        "jamong": "Say what you feel.",
        "diary": "One character. Every day.",
        "sticker": "Stick to your day.",
        "moon": "Walk together under the moon.",
        "seminar": "Pretending to be fine.",
        "starbucks": "One more cup. One more tap.",
        "costa": "The warmest choice.",
        "fashion": "Same words. Louder.",
        "cosme": "From product to possibility.",
        "battery": "How charged are you today?",
        "talk": "Listen first.",
        "youthcamp": "Not a center. A base.",
        "goods": "A stop for your heart."
    };
    function head(w) { return HEAD[w.id] || w.sub || w.title; }
    // 큰 글자: 한 줄에 한 문장씩 (". " 뒤에서 줄바꿈)
    function lines(t) { return esc(t).replace(/([.?!]) (?=\S)/g, "$1<br>"); }
    // 브랜드 작업: 번호 옆에 브랜드 이름 (개인 콘셉트 작업은 CONCEPT 표기)
    const BRAND = { "starbucks": "Starbucks — Concept Ad" };
    function kick(w) { return esc(BRAND[w.id] || catLabel[w.cat] || ""); }

    function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function src(w, f) { return /^(img\/|https?:)/.test(f) ? f : "img/works/" + w.dir + "/" + f; }
    function nn(n) { return n < 10 ? "0" + n : String(n); }
    function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function clean(t) { return String(t || "").replace(/\s*\[확인 필요[^\]]*\]/g, "").replace(/^\s*·\s*|\s*·\s*$/g, "").trim(); }

    // 격자 칸에 쓸 그림과 실제 비율 (가로÷세로) — 포스터가 잘리지 않도록 비율 그대로
    // 영상 작품은 갤러리용 고화질 영상(gallery.mp4 · gallery.jpg, 1280×720)
    const TILE = {
        "school": ["gallery.jpg", 1.778], "dream-video": ["gallery.jpg", 1.778], "teen": ["gallery.jpg", 1.778],
        "couple": ["gallery.jpg", 1.778], "rap": ["gallery.jpg", 1.778],
        "today": ["cover.webp", 1], "notbad": ["cover.webp", 1], "teacher": ["cover.webp", 1],
        "dream-book": ["img/book/p01.webp", 1], "jamong": ["gallery/01.webp", 0.667], "diary": ["gallery/01f.webp", 0.792],
        "sticker": ["gallery/01.webp", 1.03], "moon": ["gallery/01.webp", 0.708], "seminar": ["gallery/01.webp", 0.708],
        "starbucks": ["gallery/00.webp", 1.778], "costa": ["gallery/01b.webp", 0.642], "fashion": ["gallery/01.webp", 0.5625],
        "cosme": ["gallery/01.webp", 1.406], "battery": ["gallery/01.webp", 1.778], "talk": ["gallery/01.webp", 1.778],
        "youthcamp": ["gallery/02.webp", 1.5], "goods": ["gallery/08.webp", 1.771]
    };
    // 작품별로 상세에서 보여줄 것 조정 (스타벅스: 폰 화면 대신 토끼·말 캐릭터 광고 위주)
    const OVR = {
        "starbucks": { hero: "gallery/00.webp", shots: ["gallery/00.webp", "gallery/10.webp", "gallery/11.webp", "gallery/12.webp", "gallery/13.webp", "gallery/02.webp", "gallery/03.webp"], noBA: true },
        // 목록 썸네일을 고친 그림은 상세에서도 같은 그림을 씀
        "costa": { hero: "gallery/01b.webp", shots: [] },   // 한 장뿐이라 대표 그림으로만
        "sticker": { hero: "img/works/book/covers/sticker.webp" },
        "goods": { hero: "gallery/08.webp" },
        "dream-book": { hero: "img/works/book/covers/dream.webp", shots: ["img/book/p09.webp", "img/book/p03.webp", "img/book/p17.webp", "img/book/p22.webp"] },   // 첫 장은 거의 빈 종이라 장면이 있는 쪽으로
        // 다이어리: 검은 배경 스티커 그림은 흰 배경으로 정리한 파일(…w.webp)로, 어두운 배경 시트는 뺌
        "diary": {
            hero: "gallery/01c.webp",
            shots: ["gallery/01f.webp", "gallery/02.webp", "gallery/04w.webp", "gallery/05w.webp", "gallery/06w.webp", "gallery/07.webp", "gallery/08.webp"],
            rows: [2, 3, 2],   // 한 줄에 놓을 장수 — 같은 비율끼리 나란히
            caps: ["다이어리 속지 · 나의 9월 하루", "스티커 시트", "캐릭터 · 기본 포즈", "캐릭터 · 바이올린", "캐릭터 · 기타", "다이어리 쓰는 장면", "다이어리 쓰는 장면 2"]
        }
    };
    function tileImg(w) {
        if (TILE[w.id]) return src(w, TILE[w.id][0]);
        if (w.type === "video") return src(w, w.thumb || w.show);
        if (w.type === "music") return src(w, w.cover);
        return src(w, (w.gallery && w.gallery.files && w.gallery.files[0]) || w.show);
    }
    function ratio(w) { return TILE[w.id] ? TILE[w.id][1] : (w.type === "video" ? 1.778 : (w.ratio || 1)); }
    function heroImg(w) {
        if (OVR[w.id] && OVR[w.id].hero) return src(w, OVR[w.id].hero);
        if (w.type === "ba") return src(w, (w.gallery && w.gallery.files && w.gallery.files[0]) || w.after);
        if (w.type === "music") return src(w, w.cover);
        if (w.id === "youthcamp" && w.cover) return src(w, w.cover);
        if (w.gallery && w.gallery.files && w.gallery.files.length) return src(w, w.gallery.files[0]);
        return tileImg(w);
    }
    function videoSrc(w) {
        if (w.versions && w.versions.length) return src(w, w.versions[w.versions.length - 1].src);
        return w.src ? src(w, w.src) : "";
    }

    // ---------- 목록: 분야별 펼침면 ----------
    // 펼침면 구성 (분야 key → 모양). 여기 없는 분야는 "row"(같은 높이 한 줄) 로 자동
    const SPREADS = [
        { id: "film", cats: ["video"], no: "AI Film", ko: "AI 영상", unit: "Films", kind: "film" },
        { id: "music", cats: ["music"], no: "Music", ko: "AI 음악", unit: "Tracks", kind: "music", big: "Playlist" },
        { id: "book", cats: ["book"], no: "Book", ko: "출판 · 일러스트", unit: "Books", kind: "book", big: "Books",
          lead: "직접 만든 캐릭터와 이야기로<br>책 · 다이어리 · 스티커를 만들었습니다." },
        { id: "campaign", cats: ["promo", "ad"], no: "Campaign", ko: "홍보물 · 광고", unit: "Works", kind: "campaign", big: "Make them<br>look twice",
          lead: "포스터 · 브랜드 광고 · 리디자인.<br>한 번 더 보게 만드는 장면을 설계했습니다.",
          rows: [{ label: "Poster", ids: ["moon", "seminar", "costa"] }, { label: "Advertising", ids: ["starbucks", "cosme", "fashion"] }] },
        { id: "lecture", cats: ["edu"], no: "Lecture", ko: "강의 · 교육", unit: "Lectures", kind: "lecture", big: "Lecture",
          lead: "말로 끝나지 않도록,<br>강의안과 슬라이드까지 직접 만들었습니다." },
        { id: "plan", cats: ["plan"], no: "Planning", ko: "기획 · 행사", unit: "Plans", kind: "row", big: "Planning",
          lead: "공간 · 캠페인 · 굿즈.<br>아이디어를 실제로 쓰이는 모양으로 기획했습니다." }
    ];
    // 책 카드 그림 (빈 첫 장 대신 장면이 있는 쪽)
    // [수정] 책 4권: 같은 3:4 "제목이 보이는 표지" (img/works/book/covers/)
    const BOOKCOVER = { "dream-book": "img/works/book/covers/dream.webp", "jamong": "img/works/book/covers/jamong.webp",
        "diary": "img/works/book/covers/diary.webp", "sticker": "img/works/book/covers/sticker.webp" };
    const DANCER = "img/mini/emongc-dance.mp4";

    const grid = document.getElementById("gGrid");
    const isVid = function (w) { return w.type === "video" && !!(w.preview || w.src || w.versions); };
    const gVid = function (w) { return src(w, "gallery.mp4"); };
    // 분야 → 펼침면, 남은 분야는 맨 뒤에 하나씩
    const spreads = SPREADS.map(function (sp) {
        return Object.assign({}, sp, { works: WORKS.filter(function (w) { return sp.cats.indexOf(w.cat) >= 0; }) });
    }).filter(function (sp) { return sp.works.length; });
    CATS.forEach(function (c) {
        if (!SPREADS.some(function (sp) { return sp.cats.indexOf(c.key) >= 0; })) {
            spreads.push({ id: c.key, cats: [c.key], no: c.key, ko: c.label, unit: "Works", kind: "row", big: c.label, works: WORKS.filter(function (w) { return w.cat === c.key; }) });
        }
    });
    // 펼침면 안의 순서 (홍보·광고는 줄 구성 순서) → 전체 번호
    spreads.forEach(function (sp) {
        if (sp.rows) {
            const seen = {};
            const rows = sp.rows.map(function (r) {
                return { label: r.label, works: r.ids.map(function (id) { return sp.works.filter(function (w) { return w.id === id; })[0]; }).filter(function (w) { if (w) seen[w.id] = 1; return !!w; }) };
            });
            const rest = sp.works.filter(function (w) { return !seen[w.id]; });
            if (rest.length) rows.push({ label: "More", works: rest });
            sp.rowList = rows.filter(function (r) { return r.works.length; });
            sp.works = [].concat.apply([], sp.rowList.map(function (r) { return r.works; }));
        }
    });
    const order = [].concat.apply([], spreads.map(function (sp) { return sp.works; }));
    order.forEach(function (w, i) { w._no = nn(i + 1); });

    function files(w) {
        const f = (OVR[w.id] && OVR[w.id].shots) || (w.gallery && w.gallery.files) || [];
        return w.id === "sticker" ? f.map(function (x) { return x === "gallery/01.webp" ? "img/works/book/diary/gallery/s01c.webp" : x; }) : f;
    }
    // 음악 상세: 원래 표지를 CD 로 (상세에서만)
    function disc(img, cls) {
        return '<span class="g-disc' + (cls ? " " + cls : "") + '" aria-hidden="true"><img src="' + esc(img) + '" alt="" loading="lazy" decoding="async"><i></i></span>';
    }
    // 목록: 직접 디자인한 CD (검정 원판 + 미색 라벨 + 머스타드 트랙 번호)
    function cd(n, t) {
        return '<span class="g-cd" aria-hidden="true"><span class="g-cd-lab"><b>' + nn(n) + "</b><em>" + esc(t) + "</em></span></span>";
    }
    function link(w, inner, cls) {
        return '<a class="g-link' + (cls ? " " + cls : "") + '" href="?w=' + encodeURIComponent(w.id) + '" data-open="' + esc(w.id) + '" aria-label="' + esc(w.title) + ' 자세히 보기">' + inner + "</a>";
    }
    function img(f, cls) { return '<img' + (cls ? ' class="' + cls + '"' : "") + ' src="' + esc(f) + '" alt="" loading="lazy" decoding="async">'; }
    function cap(w, extra) {
        return '<p class="g-cap"><span class="g-n">' + w._no + "</span><b>" + esc(w.title) + '</b><span class="g-f">' + esc(extra || catLabel[w.cat] || "") + "</span></p>";
    }
    function bar(sp, i) {
        return '<div class="g-bar"><b><u>' + nn(i + 1) + " — " + esc(sp.no) + "</u></b><span>" + esc(sp.ko) + "</span><span>" + sp.works.length + " " + esc(sp.unit) + "</span></div>";
    }
    // [수정] 한글 중심: 진한 한글 섹션 이름 + 크게 깔리는 연한 영문 (영문은 그래픽 역할)
    function bigT(t, ko) { return (ko ? '<p class="g-ko-t">' + esc(ko) + '</p>' : '') + '<h2 class="g-big">' + t + '<span class="g-dot">.</span></h2>'; }
    function shortRole(w) { const r = clean(w.role).split("·").map(function (x) { return x.trim(); }).filter(Boolean); return r.slice(0, 3).join(" · "); }

    // ---- 펼침면 모양별 ----
    const KIND = {
        film: function (sp) {
            const c = sp.works[0], rest = sp.works.slice(1);
            return '<div class="g-12 g-film-head"><div class="g-c8"><span class="g-k g-m">대표작 · Cover Story</span><p class="g-ko-t">' + esc(c.title) + '</p><h2 class="g-big g-big-s">' + lines(head(c)) + '</h2></div>' +
                (rest.length ? '<div class="g-c4 g-end"><span class="g-k">다른 영상 · More Films</span></div>' : "") + "</div>" +
                '<div class="g-12 g-al"><div class="g-c8">' + link(c, '<span class="g-pic g-vid">' + img(tileImg(c)) +
                '<video muted loop playsinline preload="none" data-src="' + esc(gVid(c)) + '"></video><span class="g-badge">▶ 영상</span></span>') + cap(c, shortRole(c)) + "</div>" +
                (rest.length ? '<ol class="g-c4 g-rank">' + rest.map(function (w) {
                    return "<li>" + link(w, '<span class="g-rn">' + w._no + '</span><span class="g-pic g-hov">' + img(tileImg(w)) + '<video muted loop playsinline preload="none" data-src="' + esc(gVid(w)) + '"></video></span><span class="g-rt"><b>' + esc(w.title) + "</b><small>" + esc(head(w)) + "</small><em>▶ 영상 보기</em></span>") + "</li>";
                }).join("") + "</ol>" : "") + "</div>";
        },
        music: function (sp) {
            return bigT(esc(sp.big), sp.ko) + '<div class="g-12 g-al">' + sp.works.map(function (w, i) {
                const span = 12 / Math.min(sp.works.length, 3);
                return '<div class="g-track" style="grid-column:span ' + span + '">' + link(w, cd(i + 1, w.title), "g-cd-link") +
                    '<div class="g-trk"><span class="g-k g-m">Track ' + nn(i + 1) + "</span>" + link(w, '<h3 class="g-mid">' + esc(w.title) + "</h3>") +
                    '<p class="g-en-s">' + esc(head(w)) + "</p><p>" + esc(w.sub || "") + "</p>" +
                    (w.audio ? '<button type="button" class="g-play" data-audio="' + esc(src(w, w.audio)) + '" aria-pressed="false">▶ 듣기</button>' : "") + "</div></div>";
            }).join("") + "</div>";
        },
        book: function (sp) {
            const n = sp.works.length, span = n >= 4 ? 3 : 12 / n;
            return '<div class="g-bookhead"><p class="g-ko-t">' + esc(sp.ko) + '</p><h2 class="g-big g-huge">' + esc(sp.big) + '<span class="g-dot">.</span>' +
                '<span class="g-dancer" aria-hidden="true"><video muted loop playsinline preload="none" poster="img/mini/emongc-dance-poster.webp" data-src="' + DANCER + '"></video></span></h2>' +
                '<p class="g-lead">' + sp.lead + "</p></div>" +
                '<div class="g-12 g-al">' + sp.works.map(function (w) {
                    const f = BOOKCOVER[w.id] || tileImg(w);
                    return '<div style="grid-column:span ' + span + '">' + link(w, '<span class="g-card">' + img(f) + "</span>") + cap(w, shortRole(w)) + "</div>";
                }).join("") + "</div>";
        },
        campaign: function (sp) {
            return '<div class="g-12 g-headrow"><div class="g-c8">' + bigT(sp.big, sp.ko) + '</div><p class="g-c4 g-lead g-end">' + sp.lead + "</p></div>" +
                sp.rowList.map(function (r, i) {
                    return '<span class="g-k g-rowlab' + (i ? " g-rule" : "") + '">' + esc(r.label) + '</span><div class="g-jrow" data-row>' + r.works.map(function (w) {
                        return '<figure style="--r:' + ratio(w) + '">' + link(w, '<span class="g-pic">' + img(tileImg(w)) + "</span>") + cap(w, BRAND[w.id] ? "Concept" : (catLabel[w.cat] || "")) + "</figure>";
                    }).join("") + "</div>";
                }).join("");
        },
        lecture: function (sp) {
            return '<div class="g-12 g-headrow"><div class="g-c8">' + bigT(esc(sp.big), sp.ko) + '</div><p class="g-c4 g-lead g-end">' + sp.lead + "</p></div>" +
                sp.works.map(function (w, i) {
                    const sl = files(w).slice(0, 4);
                    return '<div class="g-12 g-al g-lec' + (i ? " g-rule" : "") + '"><div class="g-c4">' + '<span class="g-n g-n-big">' + w._no + "</span>" +
                        link(w, '<h3 class="g-mid">' + esc(w.title) + "</h3>") + '<p class="g-en-s">' + esc(head(w)) + '</p><p class="g-sm">' + esc(w.sub || "") + "</p></div>" +
                        '<div class="g-c8">' + link(w, '<span class="g-slides">' + sl.map(function (f) { return '<span class="g-pic">' + img(src(w, f)) + "</span>"; }).join("") + "</span>") + "</div></div>";
                }).join("");
        },
        row: function (sp) {
            return '<div class="g-12 g-headrow"><div class="g-c8">' + bigT(esc(sp.big), sp.ko) + "</div>" + (sp.lead ? '<p class="g-c4 g-lead g-end">' + sp.lead + "</p>" : "") + "</div>" +
                '<div class="g-jrow" data-row>' + sp.works.map(function (w) {
                    return '<figure style="--r:' + ratio(w) + '">' + link(w, '<span class="g-pic">' + img(tileImg(w)) + "</span>") + cap(w, shortRole(w)) +
                        '<p class="g-en-s g-under">' + esc(head(w)) + "</p>" + "</figure>";
                }).join("") + "</div>";
        }
    };

    // 휴대폰: 한 줄(같은 높이) 묶음은 최대 2개씩으로 나눔
    const mq = window.matchMedia("(max-width: 767px)");
    // 휴대폰: 같은 높이 줄이 너무 납작해지면(비율 합이 크면) 첫 그림을 따로 크게, 나머지를 한 줄로
    function splitRows() {
        if (!mq.matches) return;
        grid.querySelectorAll("[data-row]").forEach(function (row) {
            let after = row;
            (function cut(r) {
                const figs = Array.prototype.slice.call(r.children);
                const sum = figs.reduce(function (t, f) { return t + parseFloat(f.style.getPropertyValue("--r") || 1); }, 0);
                if (figs.length < 2 || sum <= 2.6) return;
                const nr = el("div", "g-jrow");
                figs.slice(1).forEach(function (f) { nr.appendChild(f); });
                after.parentNode.insertBefore(nr, after.nextSibling);
                after = nr;
                cut(nr);
            })(row);
        });
    }
    let io = null;
    function render() {
        let h = '<section class="g-sp g-toc" id="sp-contents"><div class="g-bar"><b><u>Contents</u></b><span>Vol.01 — Emongc Works</span><span>' + order.length + ' Works</span></div>' +
            '<div class="g-12"><div class="g-c5"><p class="g-ko-t">목차</p><h2 class="g-big g-toc-t">Con<br>tents<span class="g-dot">.</span></h2>' +
            '<p class="g-lead">기획부터 완성까지 직접 만든 작업을<br>분야별로 묶었습니다.</p></div><ol class="g-toc-list">' +
            spreads.map(function (sp, i) {
                return '<li><a href="#sp-' + sp.id + '"><span class="g-tn">' + nn(i + 1) + '</span><span class="g-tt">' + esc(sp.ko) + "</span><span>" + esc(sp.no) + " · " + sp.works.length + '</span><span class="g-ta">→</span></a></li>';
            }).join("") + "</ol></div></section>";
        spreads.forEach(function (sp, i) {
            h += '<section class="g-sp g-sp-' + sp.kind + '" id="sp-' + sp.id + '">' + bar(sp, i) + (KIND[sp.kind] || KIND.row)(sp) + "</section>";
        });
        grid.innerHTML = h;
        splitRows();
        grid.querySelectorAll("[data-open]").forEach(function (a) {
            a.addEventListener("click", function (e) {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;   // 새 탭 열기는 그대로
                e.preventDefault();
                open(a.dataset.open, a);
            });
        });
        wirePlay();
        wireCdReturn();
        watchVideos();
        // 순위표 영상: 마우스를 올렸을 때만 불러와 재생 (처음엔 영상을 받지 않아 가벼움)
        if (!reduce) grid.querySelectorAll(".g-hov").forEach(function (b) {
            const v = b.querySelector("video"), li = b.closest("li") || b;
            li.addEventListener("mouseenter", function () {
                if (!v.src) v.src = v.dataset.src;
                const pr = v.play();
                if (pr && pr.then) pr.then(function () { b.classList.add("playing"); }).catch(function () {});
            });
            li.addEventListener("mouseleave", function () { v.pause(); b.classList.remove("playing"); });
        });
    }

    // CD: 마우스를 떼면 멈춘 각도에서 가장 가까운 바른 각도로 부드럽게 돌아옴
    function wireCdReturn() {
        grid.querySelectorAll(".g-track").forEach(function (t) {
            const c = t.querySelector(".g-cd");
            if (!c) return;
            t.addEventListener("mouseleave", function () {
                if (t.classList.contains("spin")) return;
                const m = new DOMMatrixReadOnly(getComputedStyle(c).transform);
                const ang = Math.atan2(m.b, m.a) * 180 / Math.PI;   // 지금 각도 (-180 ~ 180)
                c.classList.remove("back");
                c.style.animation = "none";
                c.style.transform = "rotate(" + ang + "deg)";
                void c.offsetWidth;
                c.classList.add("back");
                c.style.transform = "rotate(0deg)";
                setTimeout(function () { c.classList.remove("back"); c.style.animation = ""; c.style.transform = ""; }, 950);
            });
            t.addEventListener("mouseenter", function () { c.classList.remove("back"); c.style.animation = ""; c.style.transform = ""; });
        });
    }
    // 플레이리스트: 목록에서 바로 듣기 (한 번에 한 곡, 재생 중엔 CD 가 돎)
    let curAudio = null, curBtn = null;
    function stopAudio() {
        if (curAudio) curAudio.pause();
        if (curBtn) { curBtn.setAttribute("aria-pressed", "false"); curBtn.textContent = "▶ 듣기"; curBtn.closest(".g-track").classList.remove("spin"); }
        curBtn = null;
    }
    function wirePlay() {
        grid.querySelectorAll(".g-play").forEach(function (b) {
            b.addEventListener("click", function () {
                if (curBtn === b) { stopAudio(); return; }
                stopAudio();
                curAudio = curAudio || new Audio();
                curAudio.src = b.dataset.audio;
                curAudio.onended = stopAudio;
                curAudio.play().catch(function () {});
                curBtn = b;
                b.setAttribute("aria-pressed", "true");
                b.textContent = "❚❚ 멈춤";
                b.closest(".g-track").classList.add("spin");
            });
        });
    }

    // 목록 영상 · 춤추는 캐릭터: 화면에 보일 때만 재생
    function watchVideos() {
        if (reduce || !("IntersectionObserver" in window)) return;
        if (io) io.disconnect();
        io = new IntersectionObserver(function (ents) {
            ents.forEach(function (en) {
                const v = en.target.querySelector("video");
                if (en.isIntersecting) {
                    if (!v.src) v.src = v.dataset.src;
                    const pr = v.play();
                    if (pr && pr.then) pr.then(function () { en.target.classList.add("playing"); }).catch(function () {});
                } else { v.pause(); }
            });
        }, { threshold: 0.3 });
        grid.querySelectorAll(".g-vid, .g-dancer").forEach(function (b) { io.observe(b); });
    }
    render();
    if (mq.addEventListener) mq.addEventListener("change", render); else mq.addListener(render);

    // 상세창을 닫거나 다른 페이지에 다녀온 뒤, 화면에 보이는 영상이 멈춰 있으면 다시 재생
    function resumeVideos() {
        if (reduce || document.hidden || !detail.hidden) return;
        grid.querySelectorAll(".g-vid, .g-dancer").forEach(function (b) {
            const v = b.querySelector("video"), r = b.getBoundingClientRect();
            const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
            if (v && v.src && v.paused && r.width > 0 && seen > r.height * 0.3) v.play().catch(function () {});
        });
    }
    window.addEventListener("pageshow", resumeVideos);
    document.addEventListener("visibilitychange", resumeVideos);

    // ---------- 첫 화면 연출: 글자가 차례로 올라오고, E · M · O · NG 가 빈자리에 떨어져 EMONG ----------
    // ① 흰 글자가 한 글자씩 아래에서 올라옴 (E·M·O·NG 자리는 비어 있음)  ② E → M → O → NG 가 위에서 하나씩 빈자리에 떨어짐
    // ③ 맨 아래 줄 옆에 "= EMONG" 이 올라오고 그대로 멈춤.  약 2.1초, 한 번만. (스크롤·마우스와 무관, 되감기 없음)
    // 움직임은 위치(transform)만 사용 → 그래픽 칩이 처리. 끝나면 모든 연출 흔적(가리개·will-change)을 걷어냄.
    (function () {
        const hero = document.querySelector(".g-hero"), title = document.getElementById("gIntroTitle");
        if (!hero || !title) return;
        const lines = Array.prototype.slice.call(title.querySelectorAll(":scope > span"));
        const keys = title.querySelectorAll(".g-hl, .g-olm");   // E, M, O, NG
        if (lines.length < 4 || keys.length < 4) { title.classList.remove("g-pre"); return; }
        const sub = hero.querySelector(".g-intro-sub"), down = hero.querySelector(".g-hero-down");
        const stamp = el("div", "g-stamp", '<span class="g-stamp-t">= EMONG</span>');
        stamp.setAttribute("aria-hidden", "true");
        hero.appendChild(stamp);
        const stampT = stamp.firstChild;

        // 글자를 칸(가리개) + 글자로 나눔. 속이 빈 글자(CA, PAIGN.)는 덩어리째, E·M·O·NG 는 따로 모음.
        // 글자를 나누면 글자 사이 간격(커닝)이 풀리므로, 나누기 전 위치를 재 두었다가 끝 모습이 원래와 똑같도록 em 단위로 맞춤.
        const rise = [], drop = [], units = [], orig = [];
        const rg0 = document.createRange();
        lines.forEach(function (line) {
            Array.prototype.slice.call(line.childNodes).forEach(function (n) {
                if (n.nodeType === 3) {
                    for (let k = 0; k < n.textContent.length; k++) {
                        if (n.textContent.charAt(k).trim() === "") continue;
                        rg0.setStart(n, k); rg0.setEnd(n, k + 1);
                        orig.push(rg0.getBoundingClientRect().left);
                    }
                } else if (n.nodeType === 1) orig.push(n.getBoundingClientRect().left);
            });
        });
        function wrap(node) { const w = document.createElement("span"); w.className = "g-ch"; node.parentNode.insertBefore(w, node); w.appendChild(node); return w; }
        lines.forEach(function (line, li) {
            let ci = 0;
            Array.prototype.slice.call(line.childNodes).forEach(function (n) {
                if (n.nodeType === 3) {
                    const f = document.createDocumentFragment();
                    n.textContent.split("").forEach(function (c) {
                        if (c.trim() === "") { f.appendChild(document.createTextNode(c)); return; }
                        const o = document.createElement("span"); o.className = "g-ch";
                        const i = document.createElement("span"); i.className = "g-chi"; i.textContent = c;
                        o.appendChild(i); f.appendChild(o); units.push(o);
                        rise.push({ n: i, d: li * 80 + ci * 18 }); ci++;
                    });
                    line.replaceChild(f, n);
                } else if (n.nodeType === 1) {
                    if (n.classList.contains("g-hl") || n.classList.contains("g-olm")) { units.push(wrap(n)); drop.push(n); ci++; }
                    else { units.push(wrap(n)); rise.push({ n: n, d: li * 80 + ci * 18 }); ci += n.textContent.length; }
                }
            });
        });
        (function fixKerning() {
            const fs = parseFloat(getComputedStyle(title).fontSize);
            units.forEach(function (u, i) {
                const d = (orig[i] - u.getBoundingClientRect().left) / fs;
                if (Math.abs(d) > 0.0005) { u.style.position = "relative"; u.style.left = d.toFixed(4) + "em"; }
            });
        })();

        // "= EMONG": 마지막 줄(마침표 끝) 오른쪽 / 자리가 모자라면(폰) 그 줄 아래
        function place() {
            const H = hero.getBoundingClientRect(), L = lines[3].getBoundingClientRect();
            const rg = document.createRange(); rg.selectNodeContents(lines[3]);
            const R = rg.getBoundingClientRect();
            const fs = parseFloat(getComputedStyle(title).fontSize), sw = stamp.offsetWidth, sh = stamp.offsetHeight;
            let left = R.right - H.left + fs * 0.14, top = L.bottom - H.top - sh - fs * 0.1;
            if (left + sw > H.width - 16) { left = L.left - H.left + fs * 0.04; top = L.bottom - H.top + 6; }
            stamp.style.left = left + "px"; stamp.style.top = top + "px";
        }

        const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";   // 빠르게 튀어나와 부드럽게 멈춤
        const KS = 720, KG = 140;                        // 첫 머스타드 글자 시작 · 글자 사이 간격(ms)
        function start() {
            place();
            if (reduce || !("animate" in Element.prototype)) { title.classList.remove("g-pre"); return; }
            const anims = [];
            function A(node, kf, delay, dur, ease) { anims.push(node.animate(kf, { duration: dur, delay: delay, easing: ease, fill: "both" })); }
            rise.forEach(function (r) { A(r.n, [{ transform: "translateY(115%)" }, { transform: "translateY(0)" }], r.d, 650, EASE); });
            Array.prototype.forEach.call(drop, function (k, i) { A(k, [{ transform: "translateY(-125%)" }, { transform: "translateY(0)" }], KS + i * KG, 620, EASE); });
            A(stampT, [{ transform: "translateY(115%)" }, { transform: "translateY(0)" }], KS + (drop.length - 1) * KG + 380, 600, EASE);
            [sub, down].forEach(function (e) { if (e) A(e, [{ opacity: 0 }, { opacity: 1 }], 350, 700, "ease-out"); });
            title.classList.remove("g-pre");   // 첫 모습(글자 숨김)이 정해진 뒤에 보이게
            Promise.all(anims.map(function (a) { return a.finished; })).then(function () {
                anims.forEach(function (a) { a.cancel(); });   // 끝 모습 = 원래 모습이므로 연출 흔적 제거
                hero.classList.add("g-intro-done");
            }, function () {});
        }
        let ready = false;
        function go() { if (ready) return; ready = true; start(); }
        if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); setTimeout(go, 1800); } else go();
        let rt = null;
        window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (ready) place(); }, 150); });
    })();

    // ---------- 위쪽 띠: 내려가면 숨고, 위로 올리면 나타남 + 지금 보는 분야 표시 ----------
    (function () {
        const top = document.querySelector(".g-top"), now = document.getElementById("gNow"), hero = document.getElementById("gStage") || document.querySelector(".g-hero");
        if (!top) return;
        let lastY = window.scrollY, ticking = false;
        function update() {
            ticking = false;
            const y = window.scrollY, past = hero ? y > hero.offsetHeight - 70 : y > 200;
            top.classList.toggle("band", past);
            if (!past) top.classList.remove("hide");
            else if (Math.abs(y - lastY) > 6) top.classList.toggle("hide", y > lastY);
            lastY = y;
            let cur = null;
            grid.querySelectorAll(".g-sp").forEach(function (sec) { if (sec.getBoundingClientRect().top <= 90) cur = sec; });
            const t = cur ? cur.querySelector(".g-bar b") : null;
            now.innerHTML = t ? t.innerHTML : "";
        }
        window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        update();
    })();

    // ---------- 새로고침해도 보던 자리 그대로 ----------
    // 목록은 스크립트가 그린 뒤 그림이 늦게 들어와 높이가 바뀌므로, 브라우저 자동 복원 대신
    // "어느 펼침면의 몇 px 아래를 보고 있었는지"를 저장했다가 그 자리로 돌려놓음
    const SKEY = "gScroll";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    function anchorNow() {
        const secs = grid.querySelectorAll(".g-sp");
        let best = null;
        secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= 1) best = sec; });
        return best ? { id: best.id, off: Math.round(-best.getBoundingClientRect().top) } : { id: null, off: Math.round(window.scrollY) };
    }
    function saveScroll() { try { sessionStorage.setItem(SKEY, JSON.stringify(anchorNow())); } catch (e) {} }
    let st = null;
    window.addEventListener("scroll", function () { clearTimeout(st); st = setTimeout(saveScroll, 150); }, { passive: true });
    window.addEventListener("pagehide", saveScroll);
    (function restore() {
        let a = null;
        try { a = JSON.parse(sessionStorage.getItem(SKEY) || "null"); } catch (e) {}
        if (!a || new URLSearchParams(location.search).get("w") || location.hash) {
            if (!new URLSearchParams(location.search).get("w")) document.documentElement.classList.remove("g-restoring");
            return;
        }
        let userMoved = false;
        const stop = function () { userMoved = true; };
        ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) { window.addEventListener(ev, stop, { once: true, passive: true }); });
        const go = function () {
            if (userMoved) return;
            const sec = a.id && document.getElementById(a.id);
            const y = sec ? sec.getBoundingClientRect().top + window.scrollY + a.off : a.off;
            window.scrollTo({ top: y, behavior: "instant" });
        };
        go();
        requestAnimationFrame(function () { go(); document.documentElement.classList.remove("g-restoring"); });
        // 그림이 들어오며 높이가 바뀌는 동안(약 2.5초) 자리를 다시 맞춤
        if ("ResizeObserver" in window) {
            const ro = new ResizeObserver(go);
            ro.observe(document.body);
            setTimeout(function () { ro.disconnect(); }, 2500);
        }
        window.addEventListener("load", go);
    })();

    // 맨 위 배경: 영상 작품들을 번갈아 (흑백)
    (function () {
        const box = document.getElementById("gHeroMedia");
        if (!box) return;
        const vids = WORKS.filter(isVid);
        if (vids[0]) box.style.backgroundImage = 'url("' + tileImg(vids[0]) + '")';
        if (reduce || !vids.length) return;
        const v = el("video");
        v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute("playsinline", "");
        box.appendChild(v);
        let k = 0;
        function play() {
            v.classList.remove("on");
            setTimeout(function () {
                v.src = gVid(vids[k]);
                const p = v.play();
                if (p && p.then) p.then(function () { v.classList.add("on"); }).catch(function () {});
                k = (k + 1) % vids.length;
            }, 500);
        }
        play();
        if (vids.length > 1) setInterval(function () { if (!document.hidden && detail.hidden && !document.body.classList.contains("g-anim")) play(); }, 5200);
    })();

    // ---------- 상세 ----------
    const detail = document.getElementById("gDetail");
    const body = document.getElementById("gDetailBody");
    const closeBtn = document.getElementById("gClose");
    const byId = {};
    WORKS.forEach(function (w) { byId[w.id] = w; });
    let lastTile = null, pushed = false;
    let curId = null;   // 지금(또는 마지막으로) 보고 있는 작품

    function sec(title, sub, inner) {
        return '<section class="gd-sec"><div class="gd-sec-head"><h3>' + esc(title) + "</h3>" + (sub ? "<span>" + esc(sub) + "</span>" : "") + "</div>" + inner + "</section>";
    }
    function shots(w, files, caps, rows) {
        const fig = function (f, i) {
            return '<figure class="gd-shot"><img src="' + esc(src(w, f)) + '" alt="' + esc(w.title + (caps && caps[i] ? " — " + caps[i] : "")) + '" loading="lazy" decoding="async">' +
                (caps && caps[i] ? "<figcaption>" + esc(caps[i]) + "</figcaption>" : "") + "</figure>";
        };
        if (rows) {   // 줄마다 정해진 장수로 나란히
            let k = 0, h = "";
            rows.forEach(function (n) {
                const part = files.slice(k, k + n);
                h += '<div class="gd-shots" style="--n:' + n + '">' + part.map(function (f, j) { return fig(f, k + j); }).join("") + "</div>";
                k += n;
            });
            if (k < files.length) h += '<div class="gd-shots">' + files.slice(k).map(function (f, j) { return fig(f, k + j); }).join("") + "</div>";
            return '<div class="gd-rows">' + h + "</div>";
        }
        const two = files.length >= 4 && (w.ratio || 1) < 1.2;
        return '<div class="gd-shots' + (two ? " two" : "") + '">' + files.map(fig).join("") + "</div>";
    }
    function words(t) {
        return esc(t).split(" ").map(function (x, i) {
            const br = /[.?!]$/.test(x) ? "<br>" : " ";   // 문장이 끝나면 줄바꿈
            return '<span class="w" style="animation-delay:' + (0.15 + i * 0.06).toFixed(2) + 's">' + x + "</span>" + br;
        }).join("");
    }

    function label(t) { return '<span class="gd-lab">' + esc(t) + "</span>"; }
    function part(t, inner, cls) { return '<section class="gd-part' + (cls ? " " + cls : "") + '">' + label(t) + '<div class="gd-cont">' + inner + "</div></section>"; }
    function build(w) {
        const idx = order.indexOf(w);
        const next = order[(idx + 1) % order.length];
        const o = OVR[w.id] || {};
        let h = "";
        // 1) 머리: 번호 · 분야 → 거대한 제목 → 한글 이름 + 정보 3단
        h += '<header class="gd-head-wrap"><p class="gd-kicker"><b>' + w._no + "</b> — " + kick(w) + "</p>" +
            '<h2 class="gd-ktitle" id="gdTitle">' + esc(w.title) + "</h2>" + (w.sub ? '<p class="gd-ksub">' + esc(w.sub) + "</p>" : "") +
            '<p class="gd-head" aria-hidden="true">' + lines(head(w)) + "</p>" +
            '<div class="gd-sub"><div class="gd-name"></div>' +
            '<dl class="gd-info"><div><dt>역할</dt><dd>' + esc(clean(w.role) || "—") + "</dd></div>" +
            "<div><dt>사용 도구</dt><dd>" + esc(clean(w.tools) || "—") + "</dd></div>" +
            "<div><dt>분야</dt><dd>" + esc(w.tags || catLabel[w.cat] || "") + "</dd></div></dl></div></header>";
        // 2) 대표: 영상은 플레이어, 음악은 CD + 재생, 나머지는 대표 그림 — 옆에 why.
        const why = w.why ? '<div class="gd-why"><span class="gd-big">기획 의도</span><p>' + esc(w.why) + "</p>" + (w.note ? '<p class="gd-note">※ ' + esc(w.note) + "</p>" : "") + "</div>" : "";
        let gf = files(w).slice();
        if (w.type === "video") {
            const vers = w.versions || [];
            let v = "";
            if (vers.length > 1) v += '<div class="gd-vers">' + vers.map(function (x, i) { return '<button type="button" data-src="' + esc(src(w, x.src)) + '" aria-pressed="' + (i === vers.length - 1) + '">' + esc(x.label) + "</button>"; }).join("") + "</div>";
            v += '<div class="gd-player"><video src="' + esc(videoSrc(w)) + '" poster="' + esc(tileImg(w)) + '" controls playsinline preload="metadata"></video></div>';
            h += '<div class="gd-lead gd-lead-film"><div class="gd-lead-media">' + v + "</div>" + why + "</div>";
        } else if (w.type === "music") {
            h += '<div class="gd-lead gd-lead-music"><div class="gd-lead-media"><div class="gd-disc-wrap"><span class="gd-disc">' + cd(order.filter(function (x) { return x.type === "music"; }).indexOf(w) + 1, w.title) + "</span></div></div>" +
                '<div class="gd-why"><span class="gd-big">듣기</span>' + (w.why ? "<p>" + esc(w.why) + "</p>" : "") +
                '<audio src="' + esc(src(w, w.audio)) + '" controls preload="metadata"></audio></div></div>';
            if (w.lyrics) h += part("가사", '<pre class="gd-lyrics">' + esc(w.lyrics) + "</pre>");
        } else {
            const hf = o.hero ? o.hero : (gf[0] || null);
            const hsrc = hf ? src(w, hf) : heroImg(w);
            if (!o.rows && hf && gf.length > 1) gf = gf.filter(function (f) { return f !== hf; });   // 대표 그림은 works. 에서 반복하지 않음
            h += '<div class="gd-lead"><figure class="gd-lead-media"><button type="button" data-zoom="' + esc(hsrc) + '" aria-label="크게 보기"><img src="' + esc(hsrc) + '" alt="' + esc(w.title) + '"></button></figure>' + why + "</div>";
        }
        // 3) 결과물
        if (w.type === "ba" && !o.noBA && w.before && w.after) {
            h += part("전과 후", '<div class="gd-ba"><figure><b>BEFORE</b><img src="' + esc(src(w, w.before)) + '" alt="' + esc(w.title) + ' 이전" loading="lazy"></figure>' +
                '<figure><b>AFTER</b><img src="' + esc(src(w, w.after)) + '" alt="' + esc(w.title) + ' 이후" loading="lazy"></figure></div>');
        }
        if (gf.length && w.type !== "music") {
            const caps = o.shots ? (o.caps || null) : (w.gallery && w.gallery.caps);
            const capsF = caps ? gf.map(function (f) { const i = files(w).indexOf(f); return caps[i]; }) : null;
            h += part("작업물", shots(w, gf, capsF, o.rows));
        }
        if (w.change) {
            h += part("바꾼 점", '<div class="gd-change"><div><span class="gd-mini">FIRST</span><p>' + esc(w.change.v1) + "</p></div>" +
                '<div><span class="gd-mini">AND THEN</span><p>' + esc(w.change.v2) + "</p></div></div>");
        }
        if (w.brand) {
            const b = w.brand;
            let inner = (b.title ? '<p class="gd-mini">' + esc(b.title) + "</p>" : "") + '<p class="gd-motto">' + esc(b.motto || "") + "</p>";
            if (b.values) inner += '<div class="gd-values">' + b.values.map(function (v) { return "<div><b>" + esc(v[0]) + "</b><span>" + esc(v[1]) + " · " + esc(v[2]) + "</span></div>"; }).join("") + "</div>";
            if (b.compare) {
                inner += '<table class="gd-compare"><thead><tr><th>' + esc(b.compare.from) + "</th><th>" + esc(b.compare.to) + "</th></tr></thead><tbody>" +
                    b.compare.rows.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td></tr>"; }).join("") + "</tbody></table>";
            }
            h += part("브랜드", inner);
        }
        if (w.plan) {
            h += part("기획안", (w.plan.title ? '<p class="gd-mini">' + esc(w.plan.title) + "</p>" : "") + (w.plan.lead ? '<p class="gd-text">' + esc(w.plan.lead) + "</p>" : "") +
                '<ol class="gd-list">' + (w.plan.items || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>");
        }
        // 4) 과정
        if (w.process && w.process.items && w.process.items.length) {
            h += part("제작 과정", (w.process.title ? '<p class="gd-mini">' + esc(w.process.title) + "</p>" : "") + '<div class="gd-proc">' + w.process.items.map(function (cap, i) {
                const f = src(w, "process/" + nn(i + 1) + ".webp");
                return '<figure><button type="button" data-zoom="' + esc(f) + '" aria-label="' + esc(cap) + ' 크게 보기"><img src="' + esc(f) + '" alt="" loading="lazy"></button>' +
                    "<figcaption><b>" + nn(i + 1) + "</b>" + esc(cap) + "</figcaption></figure>";
            }).join("") + "</div>");
        }
        // 5) 링크
        const links = (w.links || []).map(function (l) {
            if (l.href) return '<a href="' + esc(l.href) + '"' + (l.main ? ' class="main"' : "") + (/\.pdf$/.test(l.href) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(l.label) + " ↗</a>";
            if (l.work && byId[l.work]) return '<a href="?w=' + encodeURIComponent(l.work) + '" data-go="' + esc(l.work) + '">' + esc(l.label) + " →</a>";
            return "";
        }).join("");
        if (links) h += part("더 보기", '<div class="gd-links">' + links + "</div>");
        // 6) 다음 작품
        if (next && next !== w) {
            h += '<a class="gd-next" href="?w=' + encodeURIComponent(next.id) + '" data-go="' + esc(next.id) + '">' +
                "<small>다음 작품 — " + next._no + "</small><strong>" + esc(next.title) + ' <em aria-hidden="true">→</em></strong><span class="gd-next-en">' + esc(head(next)) + "</span></a>";
        }
        return h;
    }

    // ---------- 상세 이미지 정렬: 그림 비율대로 줄을 나눠, 줄마다 높이를 맞추고 가로를 꽉 채움 ----------
    // · 잘리는 그림 없음 · 한두 장만 아래로 떨어지는 줄 없음 (줄 나누기를 전체적으로 가장 고르게 계산)
    function ratioOf(img) {
        return new Promise(function (res) {
            const go = function () { res(img.naturalWidth ? img.naturalWidth / img.naturalHeight : 1); };
            if (img.complete && img.naturalWidth) return go();
            const t = new Image();
            t.onload = function () { res(t.naturalWidth / t.naturalHeight); };
            t.onerror = function () { res(1); };
            t.src = img.currentSrc || img.src;
        });
    }
    function justify(box) {
        const figs = Array.prototype.slice.call(box.querySelectorAll(":scope > figure, :scope > .gd-jrow > figure"));
        if (!figs.length) return;
        Promise.all(figs.map(function (f) { return ratioOf(f.querySelector("img")); })).then(function (rs) {
            if (!box.isConnected) return;
            const W = box.clientWidth;
            if (!W) return;
            const gap = parseFloat(getComputedStyle(box).getPropertyValue("--jg")) || 4;
            const mobile = W < 600;
            const one = box.classList.contains("gd-ba");             // 전후 비교: 항상 한 줄
            const T = box.classList.contains("gd-proc") ? (mobile ? W / 1.6 : Math.min(320, W / 3.2))   // 과정: 작게
                                                        : (mobile ? W / 1.25 : Math.min(560, W / 2.1)); // 작업물: 크게
            const maxN = one ? figs.length : (mobile ? 2 : 4);
            const n = figs.length;
            const rowH = function (i, j) {   // i..j-1 을 한 줄에 놓을 때 높이
                let sr = 0; for (let k = i; k < j; k++) sr += rs[k];
                return (W - gap * (j - i - 1)) / sr;
            };
            // 줄 나누기: 각 줄 높이가 목표(T)에 가장 가깝도록 (전체 최적)
            const best = [0], from = [0];
            for (let j = 1; j <= n; j++) {
                best[j] = Infinity;
                for (let i = Math.max(0, j - maxN); i < j; i++) {
                    const h = rowH(i, j);
                    let c = Math.pow(Math.log(h / T), 2);
                    if (j - i === 1 && n > 1) c += 0.25;     // 한 장만 따로 떨어지는 줄은 되도록 피함
                    if (best[i] + c < best[j]) { best[j] = best[i] + c; from[j] = i; }
                }
            }
            const cuts = [];
            if (one) cuts.push([0, n]);
            else { let j = n; while (j > 0) { cuts.unshift([from[j], j]); j = from[j]; } }
            const capH = window.innerHeight * 0.86;
            box.innerHTML = "";
            box.classList.add("gd-just");
            cuts.forEach(function (c) {
                const row = el("div", "gd-jrow");
                const h = rowH(c[0], c[1]);
                for (let k = c[0]; k < c[1]; k++) {
                    figs[k].style.setProperty("--r", rs[k]);
                    figs[k].style.maxWidth = h > capH ? (capH * rs[k]) + "px" : "";
                    row.appendChild(figs[k]);
                }
                box.appendChild(row);
            });
        });
    }
    let jt = null;
    window.addEventListener("resize", function () {
        clearTimeout(jt);
        jt = setTimeout(function () { if (!detail.hidden) body.querySelectorAll(".gd-just").forEach(justify); }, 200);
    });

    function wire() {
        body.querySelectorAll("[data-go]").forEach(function (a) {
            a.addEventListener("click", function (e) { e.preventDefault(); show(a.dataset.go, "replace"); });
        });
        body.querySelectorAll(".gd-vers button").forEach(function (b) {
            b.addEventListener("click", function () {
                body.querySelectorAll(".gd-vers button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
                const v = body.querySelector(".gd-player video");
                v.src = b.dataset.src;
                v.play().catch(function () {});
            });
        });
        body.querySelectorAll("[data-zoom]").forEach(function (b) {
            b.addEventListener("click", function () { zoom(b.dataset.zoom); });
        });
        // 음악: 재생하는 동안만 CD 가 돎
        const au = body.querySelector(".gd-audio audio"), dk = body.querySelector(".gd-disc");
        if (au && dk) {
            au.addEventListener("play", function () { dk.classList.add("spin"); });
            au.addEventListener("pause", function () { dk.classList.remove("spin"); });
            au.addEventListener("ended", function () { dk.classList.remove("spin"); });
        }
        // 이미지 묶음 정렬 (줄 수를 직접 정한 다이어리는 제외)
        body.querySelectorAll(".gd-shots:not([style*='--n']), .gd-proc, .gd-ba").forEach(justify);
    }

    // 상세 내용 채우고 보이기
    // mode: "push"(목록에서 열 때 기록 1칸) · "replace"(상세 안에서 다음 작품 — 기록 안 쌓음) · 없음
    function show(id, mode) {
        const w = byId[id];
        if (!w) return;
        curId = id;
        body.innerHTML = build(w);
        wire();
        detail.hidden = false;
        detail.classList.remove("show");
        void detail.offsetWidth;
        detail.classList.add("show");
        detail.scrollTop = 0;
        document.body.classList.add("g-lock");
        document.title = w.title + " — Emongc Works";
        document.getElementById("gdCount").textContent = w._no + " / " + nn(order.length);
        const url = "?w=" + encodeURIComponent(id);
        if (mode === "push") { history.pushState({ w: id }, "", url); pushed = true; }
        else if (mode === "replace") { history.replaceState({ w: id }, "", url); }
        detail.focus({ preventScroll: true });
    }

    // 누르면 바로 상세
    function open(id, item) {
        lastTile = item || null;
        stopAudio();
        show(id, "push");
    }

    function hide() {
        body.querySelectorAll("video, audio").forEach(function (m) { m.pause(); });
        detail.hidden = true;
        body.innerHTML = "";
        document.body.classList.remove("g-lock");
        document.title = "Works — Emongc";
        setTimeout(resumeVideos, 60);
        // 마지막으로 본 작품 칸이 화면 가운데 오도록
        const t = curId && grid.querySelector('[data-open="' + curId + '"]');
        if (t) {
            t.scrollIntoView({ block: "center" });
            t.focus({ preventScroll: true });
        } else if (lastTile) { lastTile.focus({ preventScroll: false }); }
    }
    // X: 몇 작품을 넘겨 봤든 한 번에 목록으로
    function close() {
        if (pushed) { history.back(); }   // 목록에서 열었으면 기록이 1칸뿐 → 한 번 뒤로 = 목록
        else { history.replaceState(null, "", location.pathname); hide(); }
    }
    closeBtn.addEventListener("click", close);
    window.addEventListener("popstate", function () {
        const id = new URLSearchParams(location.search).get("w");
        if (id && byId[id]) show(id, false); else { pushed = false; hide(); }
    });
    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        const z = document.querySelector(".g-zoom");
        if (z) { z.remove(); return; }
        if (!detail.hidden) close();
    });

    function zoom(f) {
        const z = el("div", "g-zoom", '<img src="' + esc(f) + '" alt="">');
        z.setAttribute("role", "dialog");
        z.setAttribute("aria-label", "크게 보기 — 누르면 닫힘");
        z.addEventListener("click", function () { z.remove(); });
        document.body.appendChild(z);
    }

    // ---------- 위로 가기 · 목차로 ----------
    // TOP 버튼: 첫 화면을 조금만 지나도 늘 오른쪽 아래에 보임 (상세 화면에서도 → 상세 맨 위로)
    // 위쪽 띠: 로고 = 맨 위로, 가운데 분야 이름 = 목차로
    (function () {
        const btn = document.getElementById("gTop");
        if (!btn) return;
        const smooth = reduce ? "auto" : "smooth";
        function sync() {
            const inDetail = !detail.hidden;
            const y = inDetail ? detail.scrollTop : window.scrollY;
            btn.classList.toggle("show", y > window.innerHeight * 0.6);
            btn.setAttribute("aria-label", inDetail ? "이 작품 맨 위로" : "맨 위로");
        }
        window.addEventListener("scroll", sync, { passive: true });
        detail.addEventListener("scroll", sync, { passive: true });
        new MutationObserver(sync).observe(detail, { attributes: true, attributeFilter: ["hidden"] });
        btn.addEventListener("click", function () {
            if (!detail.hidden) { detail.scrollTo({ top: 0, behavior: smooth }); detail.focus({ preventScroll: true }); return; }
            window.scrollTo({ top: 0, behavior: smooth });
        });
        const brand = document.querySelector(".g-brand");
        if (brand) brand.addEventListener("click", function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: smooth });
        });
        const now = document.getElementById("gNow");
        if (now) {
            now.setAttribute("role", "link"); now.setAttribute("tabindex", "0"); now.title = "목차로";
            const toc = function () { const t = document.getElementById("sp-contents"); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 10, behavior: smooth }); };
            now.addEventListener("click", toc);
            now.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toc(); } });
        }
        sync();
    })();

    // ---------- 끝: 메일 주소 (조립 · 복사) + 스크롤하면 EMONG 이 모임 ----------
    (function () {
        const addr = document.getElementById("gMailAddr"), cta = document.getElementById("gMailCta");
        const copyBtn = document.getElementById("gCopy"), copied = document.getElementById("gCopied");
        if (addr) {
            const mail = addr.dataset.u + "@" + addr.dataset.d;
            const href = "mailto:" + mail + "?subject=" + encodeURIComponent("[포트폴리오 보고 연락드립니다]");
            addr.textContent = mail; addr.href = href;
            if (cta) cta.href = href;
            if (copyBtn) copyBtn.addEventListener("click", function () {
                const done = function () {
                    copied.textContent = "복사됐어요 ✓"; copyBtn.classList.add("ok");
                    setTimeout(function () { copied.textContent = ""; copyBtn.classList.remove("ok"); }, 2200);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(mail).then(done, function () { fallback(); });
                else fallback();
                function fallback() {
                    const t = document.createElement("textarea"); t.value = mail; t.style.position = "fixed"; t.style.opacity = "0";
                    document.body.appendChild(t); t.select();
                    try { document.execCommand("copy"); done(); } catch (e) { copied.textContent = mail; }
                    t.remove();
                }
            });
        }
        // EMONG: 끝 부분이 화면에 들어오면서 흩어진 글자가 제자리로 (스크롤을 막지 않음)
        const foot = document.getElementById("gFoot"), em = foot && foot.querySelector(".g-emong");
        if (!em) return;
        const ls = Array.prototype.slice.call(em.querySelectorAll("span, i"));
        const sc = [[-260, -140, -18], [-60, 120, 14], [140, -170, -10], [300, 90, 20], [420, -60, -24], [520, 60, 0]];
        if (reduce) return;
        let ticking = false;
        function upd() {
            ticking = false;
            const r = foot.getBoundingClientRect(), vh = window.innerHeight;
            let p = (vh - r.top) / (vh * 0.75);   // 끝 부분 윗선이 화면 아래에 닿을 때 0 → 화면 25% 지점에서 1
            p = Math.max(0, Math.min(1, p));
            const e = 1 - Math.pow(1 - p, 3);
            const k = em.offsetWidth / 900;
            ls.forEach(function (l, i) {
                const s = sc[i] || [0, 0, 0], q = 1 - e;
                l.style.transform = "translate(" + (s[0] * k * q).toFixed(1) + "px," + (s[1] * k * q).toFixed(1) + "px) rotate(" + (s[2] * q).toFixed(1) + "deg)";
                l.style.opacity = (0.25 + 0.75 * e).toFixed(2);
            });
        }
        window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
        window.addEventListener("resize", upd);
        upd();
    })();

    // 주소에 ?w=작품id 가 있으면 바로 그 작품 열기
    // [수정] 상세에서 새로고침: 같은 작품을 보던 높이 그대로 다시 엶
    const DKEY = "gDetailScroll";
    let dt = null;
    detail.addEventListener("scroll", function () {
        clearTimeout(dt);
        dt = setTimeout(function () { try { sessionStorage.setItem(DKEY, JSON.stringify({ id: curId, top: Math.round(detail.scrollTop) })); } catch (e) {} }, 150);
    }, { passive: true });
    window.addEventListener("pagehide", function () {
        if (!detail.hidden) try { sessionStorage.setItem(DKEY, JSON.stringify({ id: curId, top: Math.round(detail.scrollTop) })); } catch (e) {}
    });
    const first = new URLSearchParams(location.search).get("w");
    if (first && byId[first]) {
        show(first, false);
        let d = null;
        try { d = JSON.parse(sessionStorage.getItem(DKEY) || "null"); } catch (e) {}
        const back = d && d.id === first ? d.top : 0;
        let moved = false;
        ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) { detail.addEventListener(ev, function () { moved = true; }, { once: true, passive: true }); });
        const go = function () { if (!moved && back) detail.scrollTop = back; };
        go();
        requestAnimationFrame(function () { go(); document.documentElement.classList.remove("g-restoring"); });
        if (back && "ResizeObserver" in window) {
            const ro = new ResizeObserver(go);
            ro.observe(body);
            setTimeout(function () { ro.disconnect(); }, 2500);
        }
    } else if (first) {
        document.documentElement.classList.remove("g-restoring");
    }
})();
