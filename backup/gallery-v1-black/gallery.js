/* ==================================================
   WORKS 갤러리 뷰 (works-gallery.html 전용)
   - 작품 목록: js/works-data.js 의 WORKS / WORK_CATS 를 읽기만 함 (고치지 않음)
   - 각진 정사각형 격자 → 칸을 누르면 그 칸이 화면 가득 펼쳐지며 상세로
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
        "starbucks": ["gallery/01.webp", 1.778], "costa": ["gallery/01.webp", 0.684], "fashion": ["gallery/01.webp", 0.5625],
        "cosme": ["gallery/01.webp", 1.406], "battery": ["gallery/01.webp", 1.778], "talk": ["gallery/01.webp", 1.778],
        "youthcamp": ["gallery/02.webp", 1.5], "goods": ["gallery/01.webp", 1.766]
    };
    // 작품별로 상세에서 보여줄 것 조정 (스타벅스: 폰 화면 대신 토끼·말 캐릭터 광고 위주)
    const OVR = {
        "starbucks": { hero: "gallery/02.webp", shots: ["gallery/02.webp", "gallery/03.webp"], noBA: true },
        // 다이어리: 검은 배경 스티커 그림은 흰 배경으로 정리한 파일(…w.webp)로, 어두운 배경 시트는 뺌
        "diary": {
            hero: "gallery/01f.webp",
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

    // ---------- 첫 화면: 줄마다 다른 구성의 격자 ----------
    // 한 줄에 놓을 작품들 — 칸 너비는 그림 비율대로 자동 (그래서 잘리지 않음)
    // 여기 없는 새 작품은 맨 뒤에 3개씩 자동으로 붙음
    const LAYOUT = [
        ["school"],
        ["moon", "seminar", "costa", "fashion"],
        ["rap", "today"],
        ["jamong", "starbucks"],
        ["notbad", "teacher", "teen"],
        ["diary", "sticker", "cosme"],
        ["couple"],
        ["battery", "talk"],
        ["dream-book", "dream-video"],
        ["goods", "youthcamp"]
    ];
    const grid = document.getElementById("gGrid");
    const isVid = function (w) { return w.type === "video" && !!(w.preview || w.src || w.versions); };
    const gVid = function (w) { return src(w, "gallery.mp4"); };
    const byId0 = {};
    WORKS.forEach(function (w) { byId0[w.id] = w; });
    const used = {};
    let rows = LAYOUT.map(function (r) {
        return r.map(function (id) { return byId0[id]; }).filter(function (w) { if (w) used[w.id] = 1; return !!w; });
    }).filter(function (r) { return r.length; });
    const rest = WORKS.filter(function (w) { return !used[w.id]; });
    for (let k = 0; k < rest.length; k += 3) rows.push(rest.slice(k, k + 3));
    const order = [];   // 화면에 놓이는 순서 (번호 · 상세의 "다음 작업"도 이 순서)
    rows.forEach(function (r) { r.forEach(function (w) { order.push(w); w._no = nn(order.length); }); });

    // 음악 작품: 표지를 CD 로 — 돌아가는 원판
    function disc(img, cls) {
        return '<span class="g-disc' + (cls ? " " + cls : "") + '" aria-hidden="true"><img src="' + esc(img) + '" alt="" loading="lazy" decoding="async"><i></i></span>';
    }
    function makeTile(w, frac) {
        const size = frac > 0.9 ? "xl" : frac >= 0.45 ? "l" : frac >= 0.3 ? "m" : "s";
        const a = el("a", "g-tile g-" + size);
        a.href = "?w=" + encodeURIComponent(w.id);
        a.dataset.id = w.id;
        a.style.setProperty("--r", ratio(w));
        a.setAttribute("aria-label", w.title + " — " + (catLabel[w.cat] || "") + " 자세히 보기");
        let h = w.type === "music" ? disc(tileImg(w), "") : '<img src="' + esc(tileImg(w)) + '" alt="" loading="lazy" decoding="async">';
        if (w.type === "music") a.classList.add("g-music");
        if (isVid(w)) h += '<video muted loop playsinline preload="none" data-src="' + esc(gVid(w)) + '"></video><span class="g-tile-play" aria-hidden="true">▶ FILM</span>';
        h += '<div class="g-tile-cap"><span class="g-tile-no">' + w._no + " — " + kick(w) + "</span>" +
            '<p class="g-tile-head">' + lines(head(w)) + "</p>" +
            '<p class="g-tile-meta"><strong>' + esc(w.title) + "</strong><span>" + esc(clean(w.role)) + "</span></p></div>";
        a.innerHTML = h;
        a.addEventListener("click", function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;   // 새 탭 열기는 그대로
            e.preventDefault();
            open(w.id, a);
        });
        return a;
    }
    // 휴대폰에서는 한 줄에 최대 2개
    const mq = window.matchMedia("(max-width: 767px)");
    let io = null;
    function render() {
        grid.innerHTML = "";
        const list = [];
        rows.forEach(function (r) {
            if (mq.matches && r.length > 2) { for (let k = 0; k < r.length; k += 2) list.push(r.slice(k, k + 2)); }
            else list.push(r);
        });
        list.forEach(function (r) {
            const sum = r.reduce(function (t, w) { return t + ratio(w); }, 0);
            const row = el("div", "g-row");
            r.forEach(function (w) { row.appendChild(makeTile(w, ratio(w) / sum)); });
            grid.appendChild(row);
        });
        watchVideos();
    }

    // 칸 안의 영상: 화면에 보일 때만 재생 (흑백 → 마우스 올리면 컬러)
    function watchVideos() {
        if (reduce || !("IntersectionObserver" in window)) return;
        if (io) io.disconnect();
        io = new IntersectionObserver(function (ents) {
            ents.forEach(function (en) {
                const v = en.target.querySelector("video");
                if (en.isIntersecting) {
                    if (!v.src) v.src = v.dataset.src;
                    const p = v.play();
                    if (p && p.then) p.then(function () { en.target.classList.add("playing"); }).catch(function () {});
                } else { v.pause(); }
            });
        }, { threshold: 0.35 });
        grid.querySelectorAll(".g-tile video").forEach(function (v) { io.observe(v.parentNode); });
    }
    render();
    if (mq.addEventListener) mq.addEventListener("change", render); else mq.addListener(render);

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
        if (vids.length > 1) setInterval(function () { if (!document.hidden && detail.hidden) play(); }, 5200);
    })();
    function visibleList() { return order; }

    // ---------- 상세 ----------
    const detail = document.getElementById("gDetail");
    const body = document.getElementById("gDetailBody");
    const fly = document.getElementById("gFly");
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

    function build(w) {
        const list = visibleList();
        const idx = list.indexOf(w);
        const next = list[(idx + 1) % list.length] || WORKS[(WORKS.indexOf(w) + 1) % WORKS.length];
        let h = "";
        // 1) 첫 장면
        let media;
        if (w.type === "video" && videoSrc(w)) {
            media = '<video src="' + esc(gVid(w)) + '" poster="' + esc(tileImg(w)) + '" muted loop playsinline autoplay></video>';
        } else {
            media = '<img src="' + esc(heroImg(w)) + '" alt="">';
        }
        h += '<header class="gd-hero"><div class="gd-hero-media">' + media + "</div>" +
            '<div class="gd-hero-text"><p class="gd-kicker"><b>' + w._no + "</b> — " + kick(w) + "</p>" +
            '<h2 class="gd-head" id="gdTitle">' + words(head(w)) + "</h2>" +
            '<p class="gd-title">' + esc(w.title) + (w.sub ? " <span>— " + esc(w.sub) + "</span>" : "") + "</p></div>" +
            '<span class="gd-scroll" aria-hidden="true">SCROLL ↓</span></header>';
        // 2) 한눈에
        h += '<div class="gd-facts">' +
            '<div class="gd-fact"><span class="gd-label">ROLE · 내 역할</span><p>' + esc(clean(w.role) || "—") + "</p></div>" +
            '<div class="gd-fact"><span class="gd-label">TOOLS · 사용 도구</span><p>' + esc(clean(w.tools) || "—") + "</p></div>" +
            '<div class="gd-fact"><span class="gd-label">FIELD · 분야</span><p>' + esc(w.tags || catLabel[w.cat] || "") + "</p></div></div>";
        // 3) 기획 의도
        if (w.why) {
            h += '<div class="gd-why"><span class="gd-label">WHY · 기획 의도</span><div><p>' + esc(w.why) + "</p>" +
                (w.note ? '<p class="gd-note">※ ' + esc(w.note) + "</p>" : "") + "</div></div>";
        }
        // 4) 결과물
        if (w.type === "video") {
            const vers = w.versions || [];
            let v = "";
            if (vers.length > 1) {
                v += '<div class="gd-vers">' + vers.map(function (x, i) { return '<button type="button" data-src="' + esc(src(w, x.src)) + '" aria-pressed="' + (i === vers.length - 1) + '">' + esc(x.label) + "</button>"; }).join("") + "</div>";
            }
            v += '<div class="gd-player"><video src="' + esc(videoSrc(w)) + '" poster="' + esc(tileImg(w)) + '" controls playsinline preload="metadata"></video></div>';
            h += sec("Film", "소리와 함께 보기", v);
        } else if (w.type === "music") {
            h += sec("Listen", w.label || "", '<div class="gd-audio"><div class="gd-disc-wrap">' + disc(src(w, w.cover), "gd-disc") + '</div><div>' +
                '<audio src="' + esc(src(w, w.audio)) + '" controls preload="metadata"></audio>' +
                (w.lyrics ? '<pre class="gd-lyrics">' + esc(w.lyrics) + "</pre>" : "") + "</div></div>");
        } else if (w.type === "ba" && !(OVR[w.id] && OVR[w.id].noBA)) {
            h += sec("Before / After", w.baNote || "", '<div class="gd-ba"><figure><b>BEFORE</b><img src="' + esc(src(w, w.before)) + '" alt="' + esc(w.title) + ' 이전" loading="lazy"></figure>' +
                '<figure><b>AFTER</b><img src="' + esc(src(w, w.after)) + '" alt="' + esc(w.title) + ' 이후" loading="lazy"></figure></div>');
        }
        const gfiles = (OVR[w.id] && OVR[w.id].shots) || (w.gallery && w.gallery.files) || [];
        if (gfiles.length) {
            const gcaps = OVR[w.id] && OVR[w.id].shots ? (OVR[w.id].caps || null) : (w.gallery && w.gallery.caps);
            h += sec("Works", gfiles.length + "장", shots(w, gfiles, gcaps, OVR[w.id] && OVR[w.id].rows));
        }
        if (w.change) {
            h += sec("Before → After", "무엇을 바꿨나", '<div class="gd-change"><div><span class="gd-label">FIRST</span><p>' + esc(w.change.v1) + "</p></div>" +
                '<div><span class="gd-label">AND THEN</span><p>' + esc(w.change.v2) + "</p></div></div>");
        }
        if (w.brand) {
            const b = w.brand;
            let inner = '<p class="gd-motto">' + esc(b.motto || "") + "</p>";
            if (b.values) inner += '<div class="gd-values">' + b.values.map(function (v) { return "<div><b>" + esc(v[0]) + "</b><span>" + esc(v[1]) + " · " + esc(v[2]) + "</span></div>"; }).join("") + "</div>";
            if (b.compare) {
                inner += '<table class="gd-compare"><thead><tr><th>' + esc(b.compare.from) + "</th><th>" + esc(b.compare.to) + "</th></tr></thead><tbody>" +
                    b.compare.rows.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td></tr>"; }).join("") + "</tbody></table>";
            }
            h += sec("Brand", b.title || "", inner);
        }
        if (w.plan) {
            h += sec("Plan", w.plan.title || "", (w.plan.lead ? '<p class="gd-lead">' + esc(w.plan.lead) + "</p>" : "") +
                '<ul class="gd-list">' + (w.plan.items || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>");
        }
        // 5) 과정
        if (w.process && w.process.items && w.process.items.length) {
            h += sec("Process", w.process.title || "만든 과정", '<div class="gd-proc">' + w.process.items.map(function (cap, i) {
                const f = src(w, "process/" + nn(i + 1) + ".webp");
                return '<figure><button type="button" data-zoom="' + esc(f) + '" aria-label="' + esc(cap) + ' 크게 보기"><img src="' + esc(f) + '" alt="" loading="lazy"></button>' +
                    "<figcaption><b>" + nn(i + 1) + "</b>" + esc(cap) + "</figcaption></figure>";
            }).join("") + "</div>");
        }
        // 6) 링크 (PDF · 책 보기 등 — 다른 작품으로 가는 링크는 이 페이지 안에서)
        const links = (w.links || []).map(function (l) {
            if (l.href) return '<a href="' + esc(l.href) + '"' + (l.main ? ' class="main"' : "") + (/\.pdf$/.test(l.href) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(l.label) + "</a>";
            if (l.work && byId[l.work]) return '<a href="?w=' + encodeURIComponent(l.work) + '" data-go="' + esc(l.work) + '">' + esc(l.label) + "</a>";
            return "";
        }).join("");
        if (links) h += sec("More", "", '<div class="gd-links">' + links + "</div>");
        // 7) 다음 작업
        if (next && next !== w) {
            // 배경 그림 없이 큰 글자만 — 마우스를 올리면 오른쪽에 작은 그림
            h += '<a class="gd-next" href="?w=' + encodeURIComponent(next.id) + '" data-go="' + esc(next.id) + '">' +
                "<div><small>NEXT PROJECT — " + esc(next.title) + "</small><strong>" + lines(head(next)) + ' <em aria-hidden="true">→</em></strong></div>' +
                '<span class="gd-next-pic" aria-hidden="true">' + (next.type === "music" ? disc(tileImg(next), "") : '<img src="' + esc(tileImg(next)) + '" alt="" loading="lazy">') + "</span></a>";
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
        // 첫 장면 영상: 움직임 줄이기 설정이면 멈춤
        // 음악: 재생하는 동안만 CD 가 돎
        const au = body.querySelector(".gd-audio audio"), dk = body.querySelector(".gd-disc");
        if (au && dk) {
            au.addEventListener("play", function () { dk.classList.add("spin"); });
            au.addEventListener("pause", function () { dk.classList.remove("spin"); });
            au.addEventListener("ended", function () { dk.classList.remove("spin"); });
        }
        // 첫 장면 그림과 화면 비율이 많이 다르면 → 잘리지 않는 배치(.fit)
        const hi = body.querySelector(".gd-hero-media img");
        if (hi) {
            const fit = function () {
                if (!hi.naturalWidth) return;
                const r = hi.naturalWidth / hi.naturalHeight, vr = window.innerWidth / window.innerHeight;
                body.querySelector(".gd-hero").classList.toggle("fit", Math.abs(Math.log(r / vr)) > Math.log(1.25));
            };
            if (hi.complete) fit(); else hi.addEventListener("load", fit);
        }
        // 이미지 묶음 정렬 (줄 수를 직접 정한 다이어리는 제외)
        body.querySelectorAll(".gd-shots:not([style*='--n']), .gd-proc, .gd-ba").forEach(justify);
        const hv = body.querySelector(".gd-hero video");
        if (hv && reduce) { hv.removeAttribute("autoplay"); hv.pause(); }
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
        const url = "?w=" + encodeURIComponent(id);
        if (mode === "push") { history.pushState({ w: id }, "", url); pushed = true; }
        else if (mode === "replace") { history.replaceState({ w: id }, "", url); }
        detail.focus({ preventScroll: true });
    }

    // 칸을 누르면: 그 칸 그림이 화면 가득 커진 뒤 상세로
    function open(id, tile) {
        lastTile = tile || null;
        if (!tile || reduce) { show(id, "push"); return; }
        const r = tile.getBoundingClientRect();
        fly.innerHTML = '<img src="' + esc(tileImg(byId[id])) + '" alt="">';
        Object.assign(fly.style, { display: "block", left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", transition: "none" });
        void fly.offsetWidth;
        fly.style.transition = "left .6s cubic-bezier(.22,1,.36,1), top .6s cubic-bezier(.22,1,.36,1), width .6s cubic-bezier(.22,1,.36,1), height .6s cubic-bezier(.22,1,.36,1)";
        Object.assign(fly.style, { left: "0px", top: "0px", width: window.innerWidth + "px", height: window.innerHeight + "px" });
        setTimeout(function () {
            show(id, "push");
            setTimeout(function () { fly.style.display = "none"; fly.innerHTML = ""; }, 260);
        }, 560);
    }

    function hide() {
        body.querySelectorAll("video, audio").forEach(function (m) { m.pause(); });
        detail.hidden = true;
        body.innerHTML = "";
        document.body.classList.remove("g-lock");
        document.title = "Works — Emongc";
        // 마지막으로 본 작품 칸이 화면 가운데 오도록
        const t = curId && grid.querySelector('.g-tile[data-id="' + curId + '"]');
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

    // 첫 장면: 내릴수록 그림은 천천히, 글자는 조금 더 빨리 (깊이감)
    detail.addEventListener("scroll", function () {
        if (reduce) return;
        const y = detail.scrollTop;
        const m = body.querySelector(".gd-hero-media"), t = body.querySelector(".gd-hero-text");
        if (!m || y > window.innerHeight * 1.2) return;
        m.style.transform = "translateY(" + (y * 0.35).toFixed(1) + "px) scale(" + (1 + y / 6000).toFixed(3) + ")";
        t.style.transform = "translateY(" + (y * -0.12).toFixed(1) + "px)";
        t.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7)).toFixed(2);
    }, { passive: true });

    function zoom(f) {
        const z = el("div", "g-zoom", '<img src="' + esc(f) + '" alt="">');
        z.setAttribute("role", "dialog");
        z.setAttribute("aria-label", "크게 보기 — 누르면 닫힘");
        z.addEventListener("click", function () { z.remove(); });
        document.body.appendChild(z);
    }

    // 맨 아래(끝 문구)가 보이면 위로 가기 버튼 등장
    const topBtn = document.getElementById("gTop"), foot = document.querySelector(".g-foot");
    if (topBtn && foot) {
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (e) { topBtn.classList.toggle("show", e[0].isIntersecting); }, { threshold: 0.15 }).observe(foot);
        } else { topBtn.classList.add("show"); }
        topBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
            document.getElementById("gIntroTitle").setAttribute("tabindex", "-1");
            document.getElementById("gIntroTitle").focus({ preventScroll: true });
        });
    }

    // 주소에 ?w=작품id 가 있으면 바로 그 작품 열기
    const first = new URLSearchParams(location.search).get("w");
    if (first && byId[first]) { show(first, false); }
})();
