// ==================================================
// WORKS 작품 목록 — 작품을 넣고 빼거나 글을 고칠 때는 이 파일만 고치면 됨
//  · 파일 위치: img/works/<dir>/ (목록: img/works/목록.md)
//  · show = 카드 가운데 놓이는 대표 이미지 한 장 (흰 칸 가운데, 원래 비율)
//  · type(상세창 보기 방식): video 영상 / music 음원 / book 책·만화 / poster 포스터·인쇄물 / ba 전후 비교 / plan 기획 / sticker 스티커
//  · [확인 필요] 로 표시한 곳은 본인 확인 후 고치기
// ==================================================
window.WORK_CATS = [
    { key: "video", label: "AI 영상" },
    { key: "music", label: "AI 음악" },
    { key: "book",  label: "출판·일러스트" },
    { key: "promo", label: "홍보물·캠페인" },
    { key: "ad",    label: "광고·브랜딩" },
    { key: "edu",   label: "강의·교육" },
    { key: "plan",  label: "기획·행사" }
];

window.WORKS = [
    // ---------------- AI 영상 ----------------
    {
        // 카드로는 안 보이는 상세보기 — CONTACT의 춤추는 에몽씨를 누르면 열림 (works.js 의 openWork)
        id: "emongc-making", cat: "video", type: "video", hidden: true, no: "MAKING", dir: "video/emongc",
        show: "thumb.jpg",
        title: "나를 닮은 캐릭터, 춤추게 하기", sub: "에몽씨 캐릭터 제작기", tags: "AI 영상 · 캐릭터 디자인",
        thumb: "thumb.jpg", preview: "preview.mp4", src: "video.mp4",
        why: "이 포트폴리오의 얼굴이 될 캐릭터를 '나답게' 만들고 싶었습니다. 머스타드 비니, 낮게 묶은 머리, 오버핏 티셔츠와 와이드 팬츠, 크로스백까지 제 모습에서 특징을 골라 손그림 얼굴을 먼저 확정했습니다. 그 얼굴을 기준으로 AI에 전신 캐릭터와 춤 영상을 요청하고, 두 영상을 같은 자세의 순간에서 이어 붙여 끊김 없이 반복되는 13초 춤으로 다듬어 이 사이트에 직접 적용했습니다.",
        tools: "Gemini (캐릭터 시트 · 춤 영상 생성) ",
        role: "캐릭터 콘셉트 · 프롬프트 설계 · 결과물 선별 · 편집 · 웹 적용",
        process: { title: "제작 과정", items: [
            "손그림 얼굴 확정 · 머스타드 비니와 낮은 포니테일",
            "Gemini 전신 캐릭터 시트 · 춤 포즈 6종",
            "영상 2개를 같은 자세에서 이어 13초 반복 영상으로",
            "웹 적용 · CONTACT 섹션에서 춤추는 에몽씨"
        ] }
    },
    {
        // 작품 카드가 아닌 "내 캐릭터 자리" — 영상 탭 첫 칸, 아래는 일부러 비워 둠 (상세창 없음)
        id: "emongc", cat: "video", type: "mascot",
        title: "춤추는 에몽씨",
        video: "img/mini/emongc-dance.mp4", poster: "img/mini/emongc-dance-poster.webp",
        hello: "안녕하세요, 에몽씨예요!",
        note: "I'm emongc",
        small: "with Gemini"
    },
    {
        id: "school", cat: "video", type: "video", dir: "video/school",
        show: "thumb.jpg",
        title: "학교폭력 공익광고", sub: "SKIP → SPEAK", tags: "AI 영상 · 공익 캠페인", label: "v1 → v2",
        thumb: "thumb.jpg", preview: "preview.mp4",
        versions: [{ label: "v1 · 처음 버전", src: "v1.mp4" }, { label: "v2 · 발전시킨 버전", src: "v2.mp4" }],
        why: "영상이 지루하면 우리는 망설임 없이 '건너뛰기'를 누릅니다. 하지만 학교폭력을 겪는 아이에게는 그 버튼이 없습니다. 밝은 광고처럼 시작해 차가운 현실로 뒤집히는 30초로, 그냥 넘기려는(SKIP) 사람들에게 이제는 목소리를 내 달라(SPEAK)고 말합니다.",
        tools: "Google Flow (AI 영상 생성) · 캡컷 (편집)",
        role: "기획 · 시나리오 · 프롬프트 설계 · 편집",
        change: { v1: "[혼자 놀라고 갑자기 필통이 생기는 오류]", v2: "[v1 오류 수정]" },
        process: { title: "시나리오", items: ["시나리오 · 기획 의도와 등장인물", "시나리오 · 6초 × 5장면 구성"] }
    },
    {
        id: "dream-video", cat: "video", type: "video", dir: "video/dream",
        show: "thumb.jpg",
        title: "AI의 꿈", sub: "내 꿈이 사라졌다", tags: "AI 영상 · 메시지", label: "v1 → v2",
        thumb: "thumb.jpg", preview: "preview.mp4",
        versions: [{ label: "v1 · 처음 버전", src: "v1.mp4" }, { label: "v2 · 발전시킨 버전", src: "v2.mp4" }],
        why: "그림책 〈꿈〉의 이야기를 30초 영상으로 옮겼습니다. AI를 악당으로 그리지 않고, 사람이 AI에게 넘겨주는 것의 범위만 조금씩 넓혀 갑니다. 마지막 \"내 꿈이 사라졌다\" 뒤에 놓인 AI의 \"내 꿈이 이루어졌다\" 한마디로 질문을 남깁니다.",
        tools: "Google Flow · 캡컷",
        role: "기획 · 시나리오 · 프롬프트 설계 · 편집",
        change: { v1: "[영상 주인공이 나래이션을 따라 말하는 오류]", v2: "[오류를 최대한 수정하고 AI 모습을 부드럽게 변경]" },
        process: { title: "시나리오", items: ["시나리오 · 기획 의도", "시나리오 · 장면별 연출", "시나리오 · 연출 핵심"] },
        links: [{ label: "← 원작 그림책 〈꿈〉 보기", work: "dream-book" }]
    },
    {
        id: "teen", cat: "video", type: "video", dir: "video/teen",
        show: "thumb.jpg",
        title: "내 딸은 중2", sub: "흔들리는 나이", tags: "AI 영상 · 숏폼",
        thumb: "thumb.jpg", preview: "preview.mp4", src: "video.mp4",
        why: "공부에도 진로에도 관심 없어 보이는 중2. 잔소리는 배경음악처럼 흘려듣지만, 친구들이 앞서가는 것 같아 혼자 멈춰 서는 순간이 있습니다. 사춘기 중2의 투덜거림과 그 아래 숨은 속마음을 유쾌하게 담은 30초 숏폼입니다.",
        tools: "Google Flow · 캡컷",
        role: "기획 · 캐릭터 설정 · 시나리오 · 편집",
        process: { title: "시나리오", items: ["시나리오 · 6개 장면 대본"] },
        links: [{ label: "이 캐릭터로 만든 다이어리 굿즈 →", work: "diary" }]
    },
    {
        id: "couple", cat: "video", type: "video", dir: "video/couple",
        show: "thumb.jpg",
        title: "부부의 대화", sub: "버럭이와 심통이", tags: "AI 영상 · 코미디",
        thumb: "thumb.jpg", preview: "preview.mp4", src: "video.mp4",
        why: "말이 생각보다 먼저 나가는 남편 '버럭이'와, 한마디도 지지 않는 아내 '심통이'. 사소한 말실수 하나가 수습할수록 커지는 오래된 부부의 티키타카를, 대사보다 감정의 온도 차를 유쾌하게 연출하려 노력했습니다.",
        tools: "Google Flow · 캡컷",
        role: "기획 · 캐릭터 설정 · 시나리오 · 편집",
        process: { title: "시나리오", items: ["시나리오 · 기획 의도와 등장인물", "SCENE 2 · 수습의 시작", "SCENE 3~4", "SCENE 5 · 엔딩"] }
    },
    {
        id: "rap", cat: "video", type: "video", dir: "video/rap",
        show: "thumb.jpg",
        title: "랩배틀", sub: "블랙캣 vs 골댕이", tags: "AI 영상 · 숏폼",
        thumb: "thumb.jpg", preview: "preview.mp4", src: "video.mp4",
        why: "외모도 성격도 정반대인 고양이와 강아지가 서로의 특징을 놀리는 디스랩을 벌입니다. 놀리던 특징이 사실 상대의 고민이라는 걸 알게 되며 친구가 되지만, 끝까지 장난을 멈추지 않는 두 캐릭터로 '다름도 매력이 된다'는 메시지를 가볍게 전합니다.",
        tools: "Google Flow · 캡컷",
        role: "기획 · 캐릭터 설정 · 가사 · 편집",
        process: { title: "시나리오", items: ["작품 개요 · 등장인물", "SCENE 3 · 디스배틀 절정", "SCENE 5 · 이제는 친구", "핵심 메시지"] }
    },

    // ---------------- AI 음악 ----------------
    {
        id: "today", cat: "music", type: "music", dir: "music/today",
        title: "오늘만은", sub: "괜찮지 않아도 돼", tags: "AI 음악 · 발라드 랩", label: "2:20",
        cover: "cover.webp", audio: "song.mp3",
        why: "\"괜찮아\"를 습관처럼 말하며 마음을 접어 두는 사람에게, 오늘만은 괜찮지 않아도 된다고 말해 주는 노래입니다. 다른 사람의 기준보다 내 마음을 먼저 보자는 이야기를 잔잔한 노래와 담담한 랩으로 담았습니다.",
        tools: "ChatGPT (작사) · Suno (작곡 · 노래 생성)",
        role: "콘셉트 · 작사 · 곡 스타일 프롬프트",
        lyrics: "[Verse]\n다들 별일 없냐고\n가볍게 묻고 지나가\n나는 웃으면서\n응, 괜찮아 하고 말아\n작은 말 하나가\n하루 종일 남아 있어\n아무 일 아닌 척\n또 마음을 접어 둬\n[Pre-Chorus]\n시간이 지나면\n나아질 줄 알았어\n근데 내 마음은\n더 얇아졌나 봐\n[Chorus]\n괜찮아, 괜찮아\n습관처럼 말했지만\n괜찮지 않은 마음은\n자꾸만 뒤에 남아\n다른 사람들 말보다\n내 마음을 먼저 볼래\n오늘만은 나도\n괜찮지 않아도 돼\n[Rap]\n괜찮단 말은 편해서\n먼저 꺼내는 말\n설명하기엔 길어서\n그냥 넘기는 밤\n다른 사람 기준에\n나를 맞추다 보니\n작아진 내 목소릴\n이제야 듣게 돼\n너무 오래 참아서\n얇은 종이 같아\n작은 말 하나에도\n금방 찢어질 것 같아\n[Bridge]\n오늘은 잠시 멈춰\n내 마음을 볼래\n말하지 못한 걱정도\n그냥 두고 갈래\n[Final Chorus]\n괜찮아, 괜찮아\n이제는 말하지 않을래\n괜찮지 않은 마음을\n그대로 두고 볼래\n다른 사람들 말보다\n내 마음을 먼저 볼래\n오늘만은 나도\n괜찮지 않아도 돼\n[Outro]\n오늘만은 나도\n괜찮지 않아도 돼"
    },
    {
        id: "notbad", cat: "music", type: "music", dir: "music/notbad",
        title: "NOT BAD DAY", sub: "내가 별로인 게 아냐", tags: "AI 음악 · 힙합", label: "1:36",
        cover: "cover.webp", audio: "song.mp3",
        why: "하루가 꼬였다고 내가 망한 건 아니라는 응원가입니다. \"Bad day, not me\" 한 줄을 후렴으로 반복해 오늘의 점수와 나를 분리해서 보자는 메시지를 경쾌한 힙합 비트에 실었습니다.",
        tools: "ChatGPT (작사) · Suno (작곡 · 노래 생성)",
        role: "콘셉트 · 작사 · 곡 스타일 프롬프트",
        lyrics: "[Verse]\n오늘 좀 꼬였어\n뭐 하나 안 풀려\n세상이 다 나만\n밀어내는 것 같아\n잠깐만, wait\n왜 내가 작아져\n하루 좀 망쳤다고\n내가 망한 건 아냐\n[Pre-Chorus]\n오늘은 low\n내일은 몰라\n고개를 들어\n여기서부터\n[Chorus]\nBad day, bad day\n그저 오늘이 bad day\nNot me, not me\n내가 별로인 게 아냐\nBad day, bad day\n하루쯤 뭐 어때\n오늘 하나로\n나를 다 말하지 마\n[Rap]\nYeah\n꼬이면 어때, 다시 go\n바닥을 쳐도 다시 flow\n오늘의 점수는 zero\n그래도 나는 그대로\nNo no\n날 정하지 마\n한 장면 보고 다 말하지 마\n오늘은 low\n내일은 high\n아직 내 얘기는\n끝나지 않아\n[Break]\nBad day\nNot me\nBad day\nNot my life\n[Break]\nBad day\nNot me\nBad day\nNot my life\n[Final Chorus]\nBad day, bad day\n그저 오늘이 bad day\nNot me, not me\n내가 별로인 게 아냐\nBad day, bad day\n하루쯤 뭐 어때\n오늘 하나로\n나를 다 말하지 마\nBad day!\nNot me!"
    },
    {
        id: "teacher", cat: "music", type: "music", dir: "music/teacher",
        title: "의미 전달 됐죠?", sub: "선생님께 바치는 노래", tags: "AI 음악 · K-pop 댄스", label: "2:56",
        cover: "cover.webp", audio: "song.mp3",
        why: "디지털융합 수업을 마치며 만든 유쾌한 감사 노래입니다. 선생님의 입버릇 \"의미 전달 됐죠?\"를 후렴으로, HTML · CSS · 자바스크립트부터 깃허브와 넷틀리파이 배포까지 배운 과정을 학생들의 대답처럼 풀었고, 마지막엔 진심 어린 고마움을 담았습니다.",
        tools: "ChatGPT (작사) · Suno (작곡 · 노래 생성)",
        role: "콘셉트 · 작사 · 목소리 · 연출 지시 프롬프트",
        lyrics: "[Start Immediately - Male Teacher, Deep Spoken Voice]\n자! 여러분! 집! 중! 하세요!\n타이핑이 중요한 게 아니란 말입니다!\n자, 의미 전달 됐죠?\n[Female Students - Playful Spoken Response]\n네에에~ 됐죠!\n근데 집에 가면 왜 모르죠?\n[Beat Drop - Bright K-pop Dance Hip Hop]\n[Verse 1 - Female Rap, Crystal Clear Diction]\n처음엔 놀랐죠, 너무 재밌어서\n다음엔 놀랐죠, 갑자기 버럭해서!\nHTML에 CSS\n자바스크립트까지 오케이 예스!\n설명은 쏙쏙! 진도는 쭉쭉!\n우리 머릿속은 빙글빙글 빙빙!\n우리 머릿속은 빙글빙글 빙빙!\n쉬는 시간 없이, 출석도 잊고\n하나라도 더 알려주시려고!\n네 시간은 짧아! 여덟 시간 하자!\n선생님 잠깐! 화장실 좀 가자!\n열정은 만땅! 체력은 바닥!\n마음은 청춘인데 허리가 아작!\n[Pre-Chorus - Female Group Vocals, Playful]\n알죠 알죠! 선생님 마음!\n하나라도 더 알려주고 싶은 마음!\n우리도 알아요! 다 알아요!\n그 열정만큼은 진짜 최고예요!\n[Chorus - Big Catchy Female Group Vocals]\n의미 전달 됐죠? 됐죠? 됐죠?\n네네네! 됐죠! 됐죠!\n설명 들을 땐 다 알겠죠!\n혼자 해보면 왜 안 되죠?\n됐죠? 됐죠? 의미 전달 됐죠?\n알죠? 알죠? 선생님 마음 알죠!\n우리 마음도 전달됐죠?\n됐죠! 됐죠! 의미 전달 됐죠!\n[Verse 2 - Female Rap, Clear and Playful]\n깃허브에 올려! 넷틀리파이!\n내 웹사이트 드디어 세상에 공개!\n선생님 말씀! 메이크 머니!\n그런데 돈은 어디서 버니?\n그런데 돈은 어디서 버니?\n코드는 짰는데 통장은 그대로!\n버튼은 움직여도 잔고는 제로!\n배우면 배울수록 궁금한 게 많아\n이제 좀 알겠는데 수업이 끝나!\n[Beat Stop - Male Teacher, Stern Spoken Voice]\n자! 이제 이걸로 돈 버셔야죠!\n의미 전달 됐죠?\n[Female Student - Confused Spoken Voice]\n네? 돈 버는 건 아직 안 배웠는데요?\n[Short Comedic Pause]\n[Bridge - Female Emotional Singing, Softer Instrumental]\n조금만 더 일찍 만났더라면\n조금만 더 오래 배웠더라면\n버럭하시던 그 목소리마저\n그리워질 것만 같아요\n선생님 마음, 우리도 알아요\n끝까지 알려주셔서 감사해요\n[Final Chorus - Powerful Female Group Vocals]\n의미 전달 됐죠? 됐죠? 됐죠?\n네네네! 이제는 알죠!\n선생님 마음 우리도 알죠!\n우리 마음도 전달됐죠?\n됐죠? 됐죠? 의미 전달 됐죠?\n알죠? 알죠? 서로 다 알죠!\n더 배우고 싶은 이 마음까지\n선생님께 전달됐죠!\n[Outro - Male Teacher, Spoken, Music Stops]\n자! 마지막으로!\n의미 전달 됐죠?\n[Female Student - Playful Spoken Voice]\n네! 근데 선생님...\n메이크 머니는 어디서 다운로드하죠?\n[Record Scratch - Group Laughter]\n[Male Teacher - Funny Stern Spoken Voice]\n아유! 진짜! 집중하세요!\n[Female Group - Cheerful Shout]\n네에에! 의미 전달 됐죠오오!\n[End]"
    },

    // ---------------- 출판·일러스트 ----------------
    {
        id: "dream-book", cat: "book", type: "book", dir: "book/dream",
        show: "img/book/p01.webp", ratio: 1.000,
        title: "그림책 〈꿈〉", sub: "내 꿈이 사라졌다", tags: "그림책 · 일러스트", label: "그림책 · 24p",
        card: ["card/01.webp", "card/03.webp", "card/06.webp", "card/10.webp", "card/13.webp", "card/17.webp"],
        gallery: { files: ["img/book/p01.webp", "img/book/p09.webp", "img/book/p03.webp", "img/book/p17.webp", "img/book/p22.webp"],
                   caps: ["표지", "AI는 모든 걸 알고 있다.", "궁금한 게 생기면 나는 묻는다.", "어느 길로 가야 하는지도 AI가 정해준다.", "내 꿈이.. 사라졌다.."] },
        why: "묻고, 맡기고, 기대는 일이 익숙해진 일상. 편리함 끝에 '내 꿈'까지 AI에게 맡겨 버린 엄마의 이야기를 24쪽 그림책으로 담았습니다. 기획서와 다섯 번 고쳐 그린 스토리보드, 캐릭터 시트부터 완성본까지 혼자 만들었고, 이 그림책이 AI 영상 〈AI의 꿈〉의 출발점이 되었습니다.",
        tools: "AI 이미지 생성",
        role: "기획 · 글 · 그림 · 편집",
        process: {
            title: "만든 과정",
            items: ["기획서 · 기획 의도, 콘셉트, 캐릭터 첫 구상", "비주얼 개발 · 색과 분위기, 이야기 흐름",
                    "스토리보드 1 · 수채화풍 12컷", "스토리보드 2 · 24장면으로 늘려 흐름 다듬기", "스토리보드 3 · 플랫 일러스트로 그림체 실험",
                    "스토리보드 4 · 결말 장면을 크게 연출", "스토리보드 5 · 흑백 스케치로 구도 점검",
                    "캐릭터 설정 · 엄마 · 아이 · 남편 · AI", "캐릭터 시트 · 엄마 (정면 · 측면 · 표정)", "캐릭터 시트 · AI 표정 변화",
                    "표지 시안 · 글자 없는 버전 → 후광 → 최종", "AI와 대화하며 다듬은 과정 요약"]
        },
        links: [{ label: "책 펼쳐보기", href: "book.html", main: true }, { label: "이 이야기로 만든 영상 〈AI의 꿈〉 →", work: "dream-video" }]
    },
    {
        id: "jamong", cat: "book", type: "book", dir: "book/jamong",
        show: "gallery/01.webp", ratio: 0.667,
        title: "자몽살구클럽", sub: "네 명의 약속", tags: "만화 · 일러스트", label: "만화 · 4화",
        card: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp", "gallery/05.webp"],
        gallery: { files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp", "gallery/05.webp"],
                   caps: ["표지", "프롤로그 · 네 명의 약속", "에피소드 1 · 처음의 약속", "에피소드 2 · 마음을 말하는 날", "에피소드 3 · 내일을 고르는 마음"] },
        why: "\"괜찮다고 말했는데, 마음은 아니었어.\" 겉으로는 웃지만 속마음을 말하지 못하는 네 친구가 서로의 마음을 알아봐 주며 내일을 함께 지켜 가는 이야기입니다. 프롤로그와 세 편의 에피소드, 표지까지 한 권의 만화로 구성했습니다.",
        tools: "AI 이미지 생성",
        role: "기획 · 글 · 연출 · 편집",
        process: {
            title: "만든 과정",
            items: ["배경 · 분위기 잡기", "컷 구성 · 그림만 먼저", "성별수정", "말풍선 넣기", "표지 시안 1", "표지 시안 2"]
        }
    },
    {
        id: "diary", cat: "book", type: "book", dir: "book/diary",
        show: "gallery/01.webp", ratio: 0.792,
        title: "(중2)캐릭터 다이어리", sub: "나의 9월 하루", tags: "캐릭터 · 굿즈 디자인", label: "캐릭터 · 굿즈",
        card: ["gallery/01.webp", "gallery/04.webp", "gallery/02.webp", "gallery/05.webp", "gallery/06.webp"],
        gallery: { files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp", "gallery/05.webp", "gallery/06.webp", "gallery/07.webp", "gallery/08.webp"],
                   caps: ["다이어리 속지 · 나의 9월 하루", "스티커 시트", "스티커 시트 (어두운 배경)", "캐릭터 · 기본 포즈", "캐릭터 · 바이올린", "캐릭터 · 기타", "다이어리 쓰는 장면", "다이어리 쓰는 장면 2"] },
        why: "(내 딸은 중2)의 특징, 검은 모자와 마스크를 쓴 캐릭터를 정하고, 여러 포즈를 스티커로 만든 뒤 다이어리 속지까지 이어지는 굿즈 세트로 확장했습니다. 같은 캐릭터가 AI 영상 〈내 딸은 중2〉의 주인공으로도 등장합니다.",
        tools: "AI 이미지 생성",
        role: "캐릭터 디자인 · 굿즈 구성",
        links: [{ label: "이 캐릭터가 나오는 영상 〈내 딸은 중2〉 →", work: "teen" }]
    },

    {
        id: "sticker", cat: "book", type: "sticker", dir: "book/sticker",
        show: "gallery/01.webp", ratio: 1.030,
        title: "스티커 다이어리", sub: "좋아하는 캐릭터로 쓰는 하루", tags: "스티커 디자인 · 다이어리 연출", label: "스티커 · 다이어리",
        bg: "card/bg.webp", stickers: ["card/s1.webp", "card/s2.webp", "card/s3.webp", "card/s4.webp"],
        gallery: { files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp", "gallery/05.webp", "gallery/06.webp", "gallery/07.webp", "gallery/08.webp"],
                   caps: ["다이어리 펼침면 · 9월 21일 월요일", "디테일 · 할 일 체크 옆에서 공부하는 스티커", "디테일 · 일기 내용에 맞춰 붙인 '신나는' 표정",
                          "디테일 · 공원 벤치 · 도시락 · 물병으로 그날의 장면 만들기", "디테일 · 하루 끝은 달과 잠자는 스티커로", "다이어리 다른 연출",
                          "책상 위 목업 · 실제로 쓰는 모습", "흰 책상 목업"] },
        why: "좋아하는 캐릭터로 매일 쓰고 싶은 다이어리를 만들었습니다. 캐릭터마다 공부 · 휴식 · 기쁨 포즈를 스티커로 디자인하고 칼선을 넣어 실제로 붙일 수 있게 만든 뒤, 일기 내용에 맞는 표정을 골라 붙이는 하루 일기 장면까지 연출했습니다. 손글씨, 마스킹테이프, 스티커가 한 장 안에서 어우러지도록 배치를 다듬었습니다.",
        tools: "AI 이미지 생성",
        role: "스티커 디자인 · 다이어리 구성 · 목업 연출",
        note: "유명 작품 캐릭터를 활용한 팬아트 · 개인 학습용 작업입니다.",
        process: {
            title: "만든 과정",
            items: ["스티커 디자인 시안", "다이컷 시트 · 캐릭터 1", "다이컷 시트 · 캐릭터 2", "다이컷 시트 · 캐릭터 3",
                    "다이컷 시트 · 캐릭터 4", "캐릭터 일러스트 카드", "아이콘 스티커", "다이어리 페이지 배치"]
        }
    },

    // ---------------- 홍보물·캠페인 ----------------
    {
        id: "moon", cat: "promo", type: "poster", dir: "promo/moon",
        show: "gallery/01.webp", ratio: 0.708,
        title: "달빛소나타", sub: "생명사랑 걷기 캠페인", tags: "포스터 · 부스 기획", label: "포스터 · 기획안",
        card: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp"],
        gallery: { files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp"], caps: ["캠페인 포스터", "체험 부스 포스터 · 달빛우체국", "포스터 원화"] },
        why: "밤길을 함께 걷는 생명사랑 걷기 캠페인 포스터입니다. 보름달 아래 이어 걷는 실루엣과 우체통으로 '함께'와 '마음을 전하는 일'을 그렸고, 현장에서 운영할 체험 부스 「달빛우체국」까지 기획했습니다.",
        tools: "포토샵 · 미리캔버스 · AI 이미지 생성",
        role: "포스터 디자인 · 체험 부스 기획",
        plan: {
            title: "체험 부스 기획안 · 달빛우체국",
            lead: "오늘의 내가 미래의 나에게 보내는 단 한 통의 편지",
            items: ["대상: 청소년 · 대학생 · 성인 · 가족 (전 연령, 5~10분)",
                    "목적: 지금의 마음을 돌아보고, 스스로를 응원하며 생명의 소중함을 자연스럽게 전함",
                    "운영: 편지 세트 받기 → 질문카드 보며 편지 쓰기 → 봉인 → 홀로그램 스티커 → 접수 도장 → 1년 보관",
                    "1년 뒤 개봉일(2027. 9. 12)을 정해, 행사 이후에도 오래 기억되는 체험으로 설계"]
        }
    },
    {
        id: "seminar", cat: "promo", type: "poster", dir: "promo/seminar",
        show: "gallery/01.webp", ratio: 0.708,
        title: "괜찮은 척하는 중년들", sub: "자살예방 세미나", tags: "포스터 · 강연 기획", label: "포스터 · 기획안",
        card: ["gallery/01.webp"],
        gallery: { files: ["gallery/01.webp"], caps: ["세미나 홍보 포스터"] },
        why: "가족을 책임져야 한다는 생각, 약한 모습을 보이고 싶지 않은 마음. 힘들어도 '괜찮다'고 말하는 중장년층을 위한 자살예방 세미나를 기획하고 홍보 포스터를 만들었습니다. 손그림 인물과 손글씨 제목으로 무겁지 않게 다가가도록 했습니다.",
        tools: "포토샵 · 미리캔버스 · AI 이미지 생성",
        role: "세미나 기획서 작성 · 포스터 디자인",
        plan: {
            title: "세미나 기획서",
            lead: "\"중장년층의 자살예방은 힘들어도 괜찮다고 말하는 사람들의 신호를 알아차리는 것에서 시작된다.\"",
            items: ["사업명: 괜찮은 척하는 중년들 : 혼자 견디지 않는 법",
                    "대상: 자녀 양육, 부모 부양, 직장과 노후 준비를 함께 짊어진 중장년층",
                    "구성: 강연 프로그램 · 참여 활동 · 질의응답",
                    "함께: 강연 시작 3분 도입 멘트까지 작성"]
        }
    },
    // ---------------- 광고·브랜딩 ----------------
    {
        id: "starbucks", cat: "ad", type: "ba", dir: "ad/starbucks",
        show: "ba-after.webp", ratio: 1.778,
        title: "스타벅스 광고 이미지", sub: "추석 프로모션 · 앱 광고", tags: "광고 이미지 · AI 프롬프트", label: "Before → After",
        before: "ba-before.webp", after: "ba-after.webp", baNote: "레퍼런스 앱 광고 → 커피 주문 앱 광고",
        gallery: { files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp"], caps: ["최종 앱 광고", "추석 음료 프로모션 배너", "추석 프로모션 · 캐릭터 시리즈", "Before / After 요약"] },
        why: "추석 시즌 캐릭터(토끼와 말) 프로모션에서 시작해, 다른 분야 앱 광고의 정보 구조만 가져와 커피 주문 · 리워드 · 픽업 기능을 담은 앱 다운로드 광고로 다시 설계했습니다. 단계마다 무엇을 고쳤는지 프롬프트와 함께 정리했습니다.",
        tools: "AI 이미지 생성 (대화형 프롬프트)",
        role: "콘셉트 · 프롬프트 설계 · 시안 보정 · 과정 정리",
        note: "실제 브랜드를 활용한 개인 학습용 리디자인입니다.",
        process: {
            title: "만든 과정",
            items: ["과정 정리 표지", "STEP 1 · 추석 캐릭터 콘셉트", "STEP 2 · 추석 음료 프로모션", "STEP 3 · 앱 광고 레퍼런스 분석",
                    "STEP 4 · 커피 주문 앱으로 전환", "STEP 5 · 시안 보정", "STEP 6 · 최종 앱 광고", "Before / After 요약"]
        }
    },
    {
        id: "costa", cat: "ad", type: "ba", dir: "ad/costa",
        show: "ba-after.webp", ratio: 0.684,
        title: "COSTA 크리스마스 프로모션", sub: "용감한 하루를 위한 가장 따뜻한 선택", tags: "광고 포스터 · 시안 9종", label: "시안 1 → 9",
        before: "ba-before.webp", after: "ba-after.webp", baNote: "첫 시안 → 최종 시안",
        gallery: { files: ["gallery/01.webp"], caps: ["최종 시안"] },
        why: "크리스마스 시즌 커피 프로모션 포스터입니다. 히어로처럼 달려 나오는 산타 캐릭터와 붉은 리본으로 '따뜻함'과 '활기'를 한 장에 담았고, 아홉 번의 시안을 거치며 카피와 로고의 위치 · 크기 · 여백을 다듬었습니다.",
        tools: "AI 이미지 생성",
        role: "콘셉트 · 카피 · 시안 제작 · 보정",
        note: "실제 브랜드를 활용한 개인 학습용 리디자인입니다.",
        process: { title: "시안 변화", items: ["시안 1 · 인물과 배경", "시안 2 · 리본 연출", "시안 3 · 카피 배치", "시안 4 · 로고 추가", "시안 5", "시안 6", "시안 7", "시안 8", "시안 9 · 최종"] }
    },
    {
        id: "fashion", cat: "ad", type: "ba", dir: "ad/fashion",
        show: "ba-after.webp", ratio: 0.647,
        title: "패션 브랜드 세일 광고", sub: "같은 컨셉, 새로운 느낌", tags: "배너 리디자인", label: "Before → After",
        before: "ba-before.webp", after: "ba-after.webp", baNote: "같은 문구 · 같은 구도, 더 눈에 띄게",
        gallery: { files: ["gallery/01.webp", "gallery/02.webp"], caps: ["세일 배너 3종 Before / After", "선글라스 · 브랜드 광고 Before / After"] },
        why: "연말 결산 세일 배너를 같은 문구와 구도는 그대로 두고 더 눈에 띄게 다시 만들었습니다. 색 대비를 바꾸고, 무표정한 모델을 웃는 얼굴로, 손으로 그린 낙서와 붓글씨 '50% Sale'을 더해 '내가 더 특별한 스타일'이 되는 느낌을 살렸습니다.",
        tools: "AI 이미지 생성",
        role: "리디자인 · 카피 강조 · 시안 정리"
    },
    {
        id: "cosme", cat: "ad", type: "ba", dir: "ad/cosme",
        show: "ba-after.webp", ratio: 1.098,
        title: "화장품 광고 리디자인", sub: "From product to possibility", tags: "광고 이미지 · 프롬프트", label: "Before → After",
        before: "ba-before.webp", after: "ba-after.webp", baNote: "제품 사진 → 광고 컷",
        gallery: { files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp"], caps: ["Before / After 정리", "향수 트리오 광고", "향수 트리오 광고 (다른 구성)"] },
        why: "'좋은 제품은, 더 좋은 이야기가 됩니다.' 기존 제품 패키지 디자인은 그대로 유지하고, 소품 · 빛 · 공간 연출과 브랜드 카피를 더해 평범한 제품 사진을 감각적인 광고 컷으로 바꿨습니다. 작품마다 사용한 프롬프트를 함께 정리했습니다.",
        tools: "AI 이미지 생성",
        role: "아트 디렉션 · 프롬프트 설계",
        note: "실제 브랜드를 활용한 개인 학습용 리디자인입니다."
    },

    // ---------------- 강의·교육 ----------------
    {
        id: "battery", cat: "edu", type: "poster", dir: "edu/battery",
        show: "gallery/01.webp", ratio: 1.778,
        title: "내 마음의 배터리 프로젝트", sub: "번아웃 예방 강의 슬라이드", tags: "강의 슬라이드 · 정신건강 교육", label: "시안 2 → 최종 · 18p",
        card: ["gallery/01.webp", "gallery/03.webp", "gallery/08.webp"],
        gallery: {
            files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp", "gallery/05.webp", "gallery/06.webp", "gallery/07.webp", "gallery/08.webp", "gallery/09.webp",
                    "gallery/10.webp", "gallery/11.webp", "gallery/12.webp", "gallery/13.webp", "gallery/14.webp", "gallery/15.webp", "gallery/16.webp", "gallery/17.webp", "gallery/18.webp"],
            caps: ["표지 · 오늘 당신의 마음은 몇 %인가요?", "휴대폰은 충전하면서, 마음은 왜 방전될 때까지 둘까", "번아웃이 찾아오는 5단계", "100% · 열정과 안정", "75% · 가벼운 피로",
                   "50% · 경고의 시작", "25% · 고갈과 고립", "5% · 한계와 방전", "\"게으름\"이라는 착각", "몸이 먼저 보내는 신호", "번아웃을 키우는 내면의 문장들",
                   "마음 충전은 거창하지 않다", "하루 루틴으로 채우는 충전", "지금 우리에게 필요한 쉼표", "멈춤도 당연한 여정", "혼자 짊어지지 않아도 괜찮다",
                   "오늘 집에 가면, 30분", "마무리 · 오늘 당신의 마음에 띄우는 편지"]
        },
        why: "\"휴대폰 배터리가 20%만 돼도 불안해서 충전기를 꽂으면서, 왜 내 마음은 방전될 때까지 내버려 둘까?\" 이 질문 하나로 번아웃 강의 전체를 다시 짰습니다. 어렵게 느껴지는 번아웃의 진행 단계를 누구나 아는 배터리 잔량(100% → 75% → 50% → 25% → 5%)으로 바꿔, 듣는 사람이 자기 상태를 바로 떠올릴 수 있게 했습니다.",
        tools: "AI 내용 구성, 미리캔버스(편집)",
        role: "강의 기획 · 구성 · 글 · 슬라이드 디자인",
        change: {
            v1: "시안 2개(\"열심히 살던 내가 멈추는 순간\", \"마음에도 쉼표가 필요합니다\")는 번아웃의 정의 · 원인 · 증상 · 체크리스트를 차례로 설명하는 정보 위주 구성이었고, '마음의 배터리'는 마지막 질문 한 장에만 있었습니다.",
            v2: "그 마지막 한 장을 강의 전체의 뼈대로 올렸습니다. 배터리 잔량 5단계로 이야기를 이어 가고, 배터리 아이콘도 초록에서 빨강으로 줄어들게 해 한눈에 읽히게 했습니다."
        },
        process: { title: "시안", items: ["시안 1 · 표지 〈번아웃, 열심히 살던 내가 멈추는 순간〉", "시안 1 · 번아웃이란?", "시안 1 · 자가진단 체크리스트",
                                         "시안 2 · 표지 〈마음에도 쉼표가 필요합니다〉", "시안 2 · 몸과 마음이 보내는 경보", "시안 2 · 마지막 장 — 여기서 '마음의 배터리'가 나왔습니다"] },
        links: [{ label: "PDF로 전체 보기", href: "img/works/edu/battery/battery.pdf", main: true }]
    },
    {
        id: "talk", cat: "edu", type: "poster", dir: "edu/talk",
        show: "gallery/01.webp", ratio: 1.778,
        title: "인간관계를 위한 의사소통", sub: "50분 강의안 · 슬라이드", tags: "강의안 · 강의 슬라이드", label: "강의안 · 7p",
        card: ["gallery/01.webp", "gallery/03.webp", "gallery/07.webp"],
        gallery: {
            files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp", "gallery/05.webp", "gallery/06.webp", "gallery/07.webp"],
            caps: ["표지", "강의 구성", "소통의 오해와 중요성", "의사소통의 이해", "경청 · 좋은 관계의 시작", "효과적인 대화기법", "갈등 관리 및 정리"]
        },
        why: "\"답장이 [네.] 두 글자로 왔을 때, 심장이 쿵 내려앉지 않으세요?\" 누구나 겪어 본 메시지 한 줄로 강의를 엽니다. 청소년과 성인이 함께 들을 수 있도록 경청, 나-전달법(I-Message), 개방형 질문을 일상 장면으로 풀었고, 강사가 그대로 읽을 수 있는 멘트와 화면 구성까지 강의안에 담았습니다.",
        tools: "AI 내용 구성, 미리캔버스(편집)",
        role: "강의 기획 · 강의안 작성 · 슬라이드 디자인",
        plan: {
            title: "강의안 · 50분",
            lead: "대상: 청소년 및 성인 / 목표: 경청과 공감의 행동 지침을 익히고, 나-전달법과 개방형 질문을 실제 갈등 상황에 써 본다",
            items: ["도입 5분 · \"내 마음은 그게 아닌데… 왜 오해가 생길까?\"",
                    "의사소통의 이해 10분",
                    "좋은 관계의 시작, 경청 10분",
                    "효과적인 대화기법 15분 · 나-전달법, 개방형 질문",
                    "걸림돌 제거와 갈등 관리 5분",
                    "정리 및 마무리 5분",
                    "구간마다 강사 가이드 · 화면 구성 · 강사 멘트를 함께 작성"]
        },
        links: [{ label: "PDF로 전체 보기", href: "img/works/edu/talk/talk.pdf", main: true }]
    },

    // ---------------- 기획·행사 ----------------
    {
        id: "youthcamp", cat: "plan", type: "plan", dir: "plan/youthcamp",
        show: "card/kit.webp", ratio: 1.778,
        title: "2031 유스베이스센터", sub: "청소년 공간 브랜딩 · 기획", tags: "브랜드북 · 공간 기획 · 홍보물", label: "브랜드북 · 평면도",
        cover: "gallery/02.webp", pin: "gallery/01.webp",
        gallery: { files: ["gallery/05.webp", "gallery/01.webp", "gallery/02.webp"], caps: ["브랜드북 표지", "센터 홍보 리플릿", "공간 평면도"] },
        why: "청소년 기관은 많은데 아이들은 왜 카페와 PC방으로 갈까? 중학생 자녀를 키우며 생긴 이 질문에서 시작했습니다. '복지를 받으러 가는 기관'이 아니라 아무 이유 없이 들르고 싶은 '베이스(Base)'를 상상해 이름 · 철학 · 핵심 가치 · 공간 · 프로그램을 브랜드북으로 정리하고, 같은 톤으로 평면도와 홍보 리플릿까지 만들었습니다.",
        tools: "AI 이미지 생성",
        role: "브랜드 기획 · 브랜드북 작성 · 공간 구성 · 평면도 · 홍보물 디자인",
        // brand = 상세창의 "브랜드 장표" (핵심 가치 4칸 + 기존 기관과 비교)
        brand: {
            title: "브랜드북 한 장 요약",
            motto: "복지는 목적이 아니라 결과이다.",
            values: [["B", "Believe", "믿고"], ["A", "Aspire", "함께 꿈꾸고"], ["S", "Support", "곁에 있고"], ["E", "Empower", "스스로 서게"]],
            compare: { from: "기존 청소년기관", to: "유스베이스센터", rows: [["프로그램 중심", "일상 중심"], ["상담 중심", "관계 중심"], ["문제가 생긴 뒤 이용", "평소에도 자유롭게"]] }
        },
        process: { title: "만든 과정", items: ["리플릿 레이아웃 잡기 · 사진과 칸 배치", "리플릿 템플릿 · 글 넣기 전 틀"] }
    },
    {
        id: "goods", cat: "plan", type: "poster", dir: "promo/goods",
        show: "gallery/01.webp", ratio: 1.766,
        title: "생명존중 굿즈", sub: "마음 정류장 캠페인", tags: "캠페인 굿즈 기획 · 제안서", label: "기획안 · 11p",
        card: ["gallery/01.webp", "gallery/05.webp", "gallery/08.webp"],
        gallery: { files: ["gallery/01.webp", "gallery/02.webp", "gallery/03.webp", "gallery/04.webp", "gallery/05.webp", "gallery/06.webp", "gallery/07.webp", "gallery/08.webp", "gallery/09.webp", "gallery/10.webp", "gallery/11.webp"] },
        why: "일상에서 늘 쓰는 물건에 생명존중 메시지를 담아, 청소년과 청년층(10~30대)이 자주 보고 스스로를 돌보게 하는 굿즈를 기획했습니다. 지갑에 넣는 '마음 치유 부적카드'와 휴대폰을 닦을 때마다 마음도 닦는 '마음 닦기 액정 클리너'를 캠페인 리워드로 제안합니다.",
        tools: "AI 이미지 생성, 미리캔버스",
        role: "굿즈 기획 · 디자인 · 발표 자료 제작"
    }
];
