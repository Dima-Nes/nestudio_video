/* nestudio.site v2 — page behaviour (no build step, no dependencies) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'ru';
  const t = (o) => (typeof o === 'string' ? o : o[lang()] || o.ru);

  /* ---------- data ---------- */
  const V = 'assets/video/';
  const WORKS = [
    { id: 'geely', file: 'geelyv', cat: 'video', shape: 'v', title: 'Geely EX5 · 7 000 км до Еревана', titleEn: 'Geely EX5 · 7,000 km to Yerevan', tag: { ru: 'Спецпроект', en: 'Special project' }, meta: '9:16 · 85 s',
      task: { ru: 'Показать, что электромобиль проходит Минск — Ереван без поломок, и сделать это интересно для соцсетей.', en: 'Show that an EV drives Minsk to Yerevan without a single breakdown, and make it watchable on social.' },
      how: { ru: 'Сценарий по реальному автотрипу, AI-сцены дорог и гор, юмор вместо списка характеристик. Вертикаль для Reels и TikTok, триптих 16:9 для YouTube.', en: 'Script based on a real road trip, AI scenes of roads and mountains, humour instead of a spec sheet. Vertical cut for Reels and TikTok, a 16:9 triptych for YouTube.' } },
    { id: 'belinvest', cat: 'video', shape: 'v', title: 'Белинвестбанк · «Первый день»', titleEn: 'Belinvestbank · "First day"', tag: { ru: 'Банк · тендер', en: 'Bank · tender' }, meta: '9:16 · 37 s',
      task: { ru: 'HR-ролики для департамента развития персонала: показать кандидату, кем, с кем и над чем он будет работать.', en: 'HR films for the staff development department: show a candidate who they will work as, with whom and on what.' },
      how: { ru: 'Серия «Старт» для молодых специалистов: волнение первого дня сменяется уверенностью. AI-сцены в фирменных цветах банка, вертикаль для соцсетей и карьерной страницы.', en: 'The "Start" series for young specialists: first-day nerves turn into confidence. AI scenes in the bank\'s brand colours, vertical for social and the careers page.' } },
    { id: 'foresto', cat: 'video', shape: 'v', title: 'FORESTO · фуд-холл в Palazzo', titleEn: 'FORESTO · food hall at Palazzo', tag: { ru: 'Реклама', en: 'Commercial' }, meta: '9:16 · 25 s', letter: 'foresto',
      task: { ru: 'Промо фуд-холла FORESTO в ТРЦ Palazzo: привести гостей на третий этаж.', en: 'Promo for the FORESTO food hall in Palazzo mall: bring guests to the third floor.' },
      how: { ru: 'Живая съёмка ТРЦ, AI-переходы, сочные кулинарные кадры и коммерческий саунд-дизайн. Вертикаль для Reels и экранов торгового центра.', en: 'Live mall footage, AI transitions, food close-ups and commercial sound design. Vertical for Reels and the mall\'s screens.' },
      res: { ru: 'Благодарственное письмо ООО «БелМартПлаза».', en: 'Letter of appreciation from BelMartPlaza LLC.' } },
    { id: 'yasik', cat: 'video', shape: 'h', title: 'Беларусь 3 · «Ясік у краіне вершаў!»', titleEn: 'Belarus 3 · “Yasik in the Land of Verses”', tag: { ru: 'Мультфильм · пилот', en: 'Animation · pilot' }, meta: '16:9 · 70 s',
      task: { ru: 'Пилотная серия детского мультсериала на белорусском языке для телеканала «Беларусь 3».', en: 'A pilot episode of a Belarusian-language children’s animated series for the Belarus 3 TV channel.' },
      how: { ru: 'Ясік открывает чароўную кніжку, и оживают строки Якуба Коласа «Мой родны кут»: он бежит к родной деревне и летит на бусле над полями и речкой. Рисованный стиль, персонаж узнаваем во всех сценах.', en: 'Yasik opens a magic book and Yakub Kolas’s lines “My native corner” come alive: he runs to his village and flies on a stork over fields and a river. Hand-drawn style, the character stays recognisable in every scene.' } },
    { id: 'technex', cat: 'video', shape: 'v', title: 'Технекс · Инженерная мощь', titleEn: 'Technex · Engineering power', tag: 'B2B', meta: '9:16 · 84 s', letter: 'technex',
      task: { ru: 'Показать производство грузоподъёмного оборудования так, чтобы это смотрели до конца.', en: 'Present lifting-equipment manufacturing so people watch to the end.' },
      how: { ru: 'AI-сцены цеха и литья, 3D-оверлеи, дикторский голос, B2B-стилистика бренда.', en: 'AI factory and foundry scenes, 3D overlays, voice-over, B2B brand style.' },
      res: { ru: 'Рекомендательное письмо: «Работайте с лучшими».', en: 'Recommendation letter: "Work with the best."' } },
    { id: 'seventies', cat: 'video', shape: 'v', title: "70's Child · Bottom of a Bottle", tag: { ru: 'Клип · США', en: 'Music video · USA' }, meta: '9:16 · 30 s', letter: 'seventies',
      task: { ru: 'Клип для рок-группы из Нью-Гэмпшира без съёмочного дня.', en: 'A music video for a New Hampshire rock band without a shoot day.' },
      how: { ru: 'Сохранили внешность музыкантов через референс-листы, сюжет по тексту песни, версии для YouTube и Shorts.', en: 'Kept the musicians recognisable with reference sheets, story driven by the lyrics, YouTube and Shorts versions.' },
      res: { ru: 'Релиз 2 августа 2026, благодарственное письмо группы.', en: 'Released 2 August 2026, letter of appreciation from the band.' } },
    { id: 'myadel', cat: 'video', shape: 'h', title: 'Мядельский район · имиджевый ролик', titleEn: 'Myadel District · image film', tag: { ru: 'Тендер · демо', en: 'Tender · demo' }, meta: '16:9 · 42 s',
      task: { ru: 'Имиджевый ролик района для телевидения и соцсетей: озёра Нарочанского края, храмы, отдых.', en: 'An image film of the district for TV and social: the Naroch lakes, churches, leisure.' },
      how: { ru: 'Демо собрали до подачи заявки, чтобы заказчик сразу увидел результат: аэропанорамы озёр, архитектура, герб района в финале.', en: 'We built the demo before the bid so the client saw the result straight away: aerial lake panoramas, architecture, the district crest in the finale.' } },
    { id: 'voronovo', cat: 'video', shape: 'h', title: 'Вороновский район · «Камень помнит»', titleEn: 'Voronovo District · "The Stone Remembers"', tag: { ru: 'Тендер · демо', en: 'Tender · demo' }, meta: '16:9 · 36 s',
      task: { ru: 'Видеофильм о районе: валуны ледникового периода, костёлы, история края.', en: 'A film about the district: ice-age boulders, churches, local history.' },
      how: { ru: 'Сквозной образ камня, который помнит всё, тёплый закатный свет, аэропанорамы реки и храмов, герб района в финале.', en: 'The stone that remembers everything as the through-line, warm sunset light, aerial views of the river and churches, the district crest at the end.' } },
    { id: 'priroda', cat: 'video', shape: 'h', title: 'Мингорприроды · «Знай их в лицо»', titleEn: 'Minsk Nature Committee · "Know them by sight"', tag: { ru: 'Социальный ролик · тендер', en: 'Public service film · tender' }, meta: '16:9 · 40 s',
      task: { ru: 'Социальный эко-ролик для Минского городского комитета природных ресурсов: научить горожан узнавать инвазивные растения.', en: 'A public service film for the Minsk city nature committee: teach residents to recognise invasive plants.' },
      how: { ru: '3D-растения на постаментах, инфографика, анимированные сцены и памятка «Узнал — сообщи!» с телефоном горячей линии.', en: '3D plants on plinths, infographics, animated scenes and a "Spotted it? Report it!" card with the hotline number.' } },
    { id: 'electroport', cat: 'web', shape: 'h', img: 'assets/img/electroport.jpg', title: 'electroport.by', tag: { ru: 'Сайт под ключ', en: 'Turnkey website' }, meta: 'web · 2026', letter: 'electroport', url: 'https://electroport.by',
      task: { ru: 'Корпоративный сайт подрядчика по зарядной инфраструктуре для электромобилей.', en: 'Corporate website for an EV charging infrastructure contractor.' },
      how: { ru: 'Структура под B2B-заявки, калькулятор сметы, объекты, аттестаты, адаптив и SEO.', en: 'B2B lead structure, estimate calculator, projects, certificates, mobile and SEO.' },
      res: { ru: 'Сайт запущен, письмо ООО «Электропорт» от 30.06.2026.', en: 'Live site, letter from Electroport LLC dated 30 June 2026.' } },
    { id: 'tolkomyaso', cat: 'web', shape: 'h', img: 'assets/img/tolkomyaso.jpg', title: '«Только мясо внутри» · лендинг', titleEn: '"Only meat inside" · landing page', tag: { ru: 'Лендинг · РФ', en: 'Landing page · RU' }, meta: 'web · 2026',
      task: { ru: 'Продуктовый лендинг для линейки колбасы без заменителей мяса от АК Менеджмент.', en: 'A product landing page for a sausage line with no meat substitutes, for AK Management.' },
      how: { ru: 'Четыре варианта дизайна на выбор, AI-фотографии продукта, кнопки «Где купить» и «Написать нам», версия для телефона.', en: 'Four design options to choose from, AI product photography, "Where to buy" and "Contact us" buttons, mobile version.' } },
    { id: 'kobrinhim', cat: 'web', shape: 'h', img: 'assets/img/kobrinhim.jpg', title: 'Кобринхимсервис · сайт госпредприятия', titleEn: 'Kobrinkhimservice · state enterprise website', tag: { ru: 'Сайт · тендер · демо', en: 'Website · tender · demo' }, meta: 'web · 2026', url: 'demo/kobrinhim/', urlLabel: { ru: 'Открыть демо', en: 'Open the demo' },
      task: { ru: 'Сайт для государственного предприятия Кобринского района: услуги, новости, обращения граждан, документы.', en: 'A website for a state enterprise in the Kobrin district: services, news, citizens\' appeals, documents.' },
      how: { ru: 'Демо собрали до подачи заявки: версия для слабовидящих, русский и белорусский языки, заявка на работы онлайн.', en: 'Demo built before the bid: a low-vision version, Russian and Belarusian, online work requests.' } },
    { id: 'srdouble', cat: 'web', shape: 'h', img: 'assets/img/srdouble.jpg', title: 'Sr.Double · сайт пиццерии', titleEn: 'Sr.Double · pizzeria website', tag: { ru: 'Сайт · демо', en: 'Website · demo' }, meta: 'web · 2026', url: 'demo/srdouble/', urlLabel: { ru: 'Открыть демо', en: 'Open the demo' },
      task: { ru: 'Новый сайт для пиццерии в Дмитровском районе: римская и классическая пицца, пицца из двух половинок, скидка 10% на самовывоз.', en: 'A new website for a pizzeria near Moscow: Roman and classic pizza, half-and-half pizza, 10% off for pickup.' },
      how: { ru: 'Фирменный персонаж-волчонок, меню с корзиной, блок «Две половинки» и доставка. Демо-версия, которую клиент видит до оплаты.', en: 'A wolf-cub mascot, a menu with a cart, a "Two halves" block and delivery. A demo the client sees before paying.' } },
  ];
  // opened from the showreel block, not listed
  const FEATURED = [
    { id: 'geely169', file: 'geely', cat: 'video', shape: 'h', title: 'Geely EX5 · триптих 16:9', titleEn: 'Geely EX5 · 16:9 triptych', tag: { ru: 'Спецпроект', en: 'Special project' }, meta: '16:9 · 60 s',
      task: WORKS[0].task, how: WORKS[0].how }
  ];

  const L = 'assets/letters/';
  const LETTERS = [
    { id: 'technex', org: { ru: 'ООО «Технекс»', en: 'Technex LLC' }, sub: { ru: 'AI-видео · 01.2026', en: 'AI video · 01.2026' }, pages: 2 },
    { id: 'orthotec', org: 'Orthotec AG', sub: { ru: 'Клип · Швейцария', en: 'Music video · CH' }, pages: 1 },
    { id: 'seventies', org: "70's Child", sub: { ru: 'Клип · США', en: 'Music video · USA' }, pages: 1 },
    { id: 'foresto', org: { ru: 'ООО «БелМартПлаза»', en: 'BelMartPlaza LLC' }, sub: { ru: 'FORESTO · 04.2026', en: 'FORESTO · 04.2026' }, pages: 2 },
    { id: 'aaronpharm', org: { ru: 'ООО «Ааронфарм»', en: 'Aaronpharm LLC' }, sub: { ru: 'AI-аватар бренда', en: 'AI brand avatar' }, pages: 2 },
    { id: 'm2b', org: { ru: 'ООО «Музыка для бизнеса»', en: 'Music 2 Business LLC' }, sub: { ru: 'Программный комплекс', en: 'Software system' }, pages: 1 },
    { id: 'electroport', org: { ru: 'ООО «Электропорт»', en: 'Electroport LLC' }, sub: { ru: 'Сайт · 06.2026', en: 'Website · 06.2026' }, pages: 1 },
    { id: 'agrocapital', org: { ru: 'ООО «Агрокапитал-М»', en: 'Agrocapital-M LLC' }, sub: { ru: '3D и дизайн · 10.2026', en: '3D and design · 10.2026' }, pages: 1 },
    { id: 'uitp', org: { ru: 'ООО «Универсальные ИТ Проекты»', en: 'Universal IT Projects LLC' }, sub: { ru: 'IT-инженерия · 05.2025', en: 'IT engineering · 05.2025' }, pages: 1 },
    { id: 'padvokam', org: { ru: 'ЧТУП «ПадВокам»', en: 'PadVokam' }, sub: { ru: 'Сайт и SEO · 2024', en: 'Website and SEO · 2024' }, pages: 2 },
    { id: 'stefan', org: 'Stefan Dürger', sub: { ru: 'Личное письмо', en: 'Personal letter' }, pages: 1 }
  ];

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('.nav__burger');
  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }));

  /* ---------- works list + floating preview ---------- */
  const list = $('#wlist'), prev = $('#wprev');
  const mockHTML = (kind) => kind === 'chat'
    ? `<div class="mock mock--chat" aria-hidden="true"><div class="bubble bubble--me">Подготовь КП для Электропорта и отправь на почту</div><div class="bubble bubble--bot">Готово: КП_Электропорт.pdf, 4 страницы. Отправил на info@… и продублировал в Telegram.</div><div class="bubble bubble--me">Что с тендером в Гродно?</div><div class="bubble bubble--bot">Пакет собран, срок подачи завтра до 24:00. Напомню в 10:00.</div></div>`
    : `<div class="mock" aria-hidden="true"><div class="mock__row mock__head"><span>track / author</span><span>dsp report</span><span>match</span></div><div class="mock__row"><span>Bely Sneg — Gravitation</span><span>yandex_2026_09.csv</span><span class="ok">0.98</span></div><div class="mock__row"><span>Razbitye zerkala (live)</span><span>vk_music_q3.xlsx</span><span class="ok">0.95</span></div><div class="mock__row"><span>Disco 85 — remix</span><span>zvuk_09.csv</span><span class="wait">0.71</span></div><div class="mock__row"><span>Kolyada lullaby</span><span>apple_09.tsv</span><span class="ok">1.00</span></div><div class="mock__row"><span>Man on a Mission</span><span>spotify_10.csv</span><span class="ok">0.99</span></div><div class="mock__row"><span>4 812 rows · 3 min 12 s</span><span>auto-matched 96.4%</span><span class="ok">done</span></div></div>`;
  const thumb = (w) => w.img || (w.mock ? '' : `${V}${w.file || w.id}.jpg`);

  function renderWorks() {
    list.innerHTML = WORKS.map((w, i) => {
      const title = lang() === 'en' && w.titleEn ? w.titleEn : w.title, th = thumb(w);
      return `<li class="rv" data-cat="${w.cat}"><button class="wrow" type="button" data-id="${w.id}">
        <span class="wrow__n">${String(i + 1).padStart(2, '0')}</span>
        <span class="wrow__title">${title}</span>
        <span class="wrow__tag"><i class="dot dot--${w.cat}"></i>${t(w.tag)}</span>
        <span class="wrow__meta">${w.meta}</span>
        <span class="wrow__thumb">${th ? `<img src="${th}" alt="" loading="lazy">` : mockHTML(w.mock)}</span>
        <svg class="wrow__go"><use href="#i-arrow"/></svg>
      </button></li>`;
    }).join('');
    // one media slot per work inside the floating preview; only the hovered one is shown and played
    prev.innerHTML = WORKS.map(w => `<div class="wprev__item wprev__item--${w.shape}" data-id="${w.id}">${
      w.img ? `<img src="${w.img}" alt="">` : w.mock ? mockHTML(w.mock)
      : `<video muted playsinline loop preload="none" poster="${V}${w.file || w.id}.jpg" data-src="${V}${w.file || w.id}-loop.mp4"></video>`}</div>`).join('');
    $$('.wrow', list).forEach(b => {
      b.addEventListener('click', () => openWork(b.dataset.id));
      if (canHover) b.addEventListener('mouseenter', () => showPrev(b.dataset.id));
    });
    applyFilter(currentFilter);
  }

  let currentFilter = 'all';
  function applyFilter(f) {
    currentFilter = f;
    $$('.filters button').forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === f));
    $$('li', list).forEach(li => li.hidden = f !== 'all' && li.dataset.cat !== f);
  }
  $$('.filters button').forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

  const loadVid = (v) => { if (v && !v.src && v.dataset.src) v.src = v.dataset.src; };
  let shown = null;
  function showPrev(id) {
    if (shown === id) return; shown = id;
    $$('.wprev__item', prev).forEach(el => {
      const on = el.dataset.id === id, v = $('video', el);
      el.classList.toggle('is-on', on);
      if (v) { if (on) { loadVid(v); v.currentTime = 0; v.play().catch(() => {}); } else v.pause(); }
    });
    prev.classList.add('is-on');
  }
  if (canHover && !reduce) {
    let px = innerWidth / 2, py = innerHeight / 2, tx = px, ty = py, raf = 0;
    const follow = () => {
      px += (tx - px) * .16; py += (ty - py) * .16;
      prev.style.transform = `translate(${px}px, ${py}px) rotate(${(tx - px) * .03}deg)`;
      raf = Math.abs(tx - px) + Math.abs(ty - py) > .5 ? requestAnimationFrame(follow) : 0;
    };
    list.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(follow); }, { passive: true });
    list.addEventListener('pointerleave', () => { prev.classList.remove('is-on'); shown = null; $$('video', prev).forEach(v => v.pause()); });
  }

  /* ---------- hero background reel: desktop only; phones and reduced motion keep the poster ---------- */
  const heroBg = $('#hero-bg');
  if (heroBg && !reduce && !matchMedia('(pointer: coarse)').matches) {
    heroBg.muted = true; heroBg.autoplay = true; heroBg.src = heroBg.dataset.src;
    new IntersectionObserver(([e]) => { e.isIntersecting ? heroBg.play().catch(() => {}) : heroBg.pause(); }).observe(heroBg);
  }

  /* ---------- showreel: three cameras on wide screens, one vertical film on phones; only the visible set plays ---------- */
  const narrowMQ = matchMedia('(max-width: 860px)');
  const tripSet = () => (narrowMQ.matches ? $$('#trip-box .trip-m video') : $$('#trip video'));
  let tripOn = false;
  const tripPlay = () => {
    $$('#trip-box video').forEach(v => v.pause());
    if (!tripOn || reduce) return;
    const set = tripSet(); set.forEach(v => { loadVid(v); v.currentTime = 0; }); set.forEach(v => v.play().catch(() => {}));
  };
  new IntersectionObserver(([e]) => { tripOn = e.isIntersecting; tripPlay(); }, { threshold: .25 }).observe($('#trip-box'));
  narrowMQ.addEventListener('change', tripPlay);
  $$('[data-work]').forEach(b => b.addEventListener('click', () => openWork(b.dataset.work)));

  /* ---------- modal ---------- */
  const modal = $('#modal'), lightbox = $('#lightbox');
  let lastFocus = null;
  function openModal(m) {
    lastFocus = document.activeElement;
    m.hidden = false; void m.offsetWidth; m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    $('.modal__close', m).focus();
  }
  function closeModal(m) {
    m.classList.remove('is-open');
    $$('video', m).forEach(v => v.pause());
    setTimeout(() => { m.hidden = true; if (m === modal) $('#modal-media').innerHTML = ''; }, 300);
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  }
  [modal, lightbox].forEach(m => {
    $('.modal__close', m).addEventListener('click', () => closeModal(m));
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') [modal, lightbox].forEach(m => m.classList.contains('is-open') && closeModal(m)); });

  function openWork(id) {
    const w = WORKS.concat(FEATURED).find(x => x.id === id); if (!w) return;
    const en = lang() === 'en';
    const media = $('#modal-media');
    media.classList.toggle('is-v', w.shape === 'v');
    $$('video', prev).forEach(v => v.pause());
    if (w.img) media.innerHTML = `<img src="${w.img}" alt="${w.title}">`;
    else if (w.mock) media.innerHTML = mockHTML(w.mock).replace('class="mock', 'style="position:relative;min-height:340px;width:100%" class="mock');
    else media.innerHTML = `<video src="${V}${w.file || w.id}.mp4" poster="${V}${w.file || w.id}.jpg" controls playsinline autoplay></video>`;
    $('#modal-meta').textContent = `${t(w.tag)} · ${w.meta}`;
    $('#modal-title').textContent = en && w.titleEn ? w.titleEn : w.title;
    const rows = [[en ? 'Task' : 'Задача', w.task], [en ? 'How we did it' : 'Решение', w.how]];
    if (w.res) rows.push([en ? 'Result' : 'Результат', w.res]);
    let html = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${t(v)}</dd></div>`).join('');
    if (w.url) html += `<div><dt>${en ? 'Website' : 'Сайт'}</dt><dd><a class="modal__link" href="${w.url}" target="_blank" rel="noopener">${w.urlLabel ? t(w.urlLabel) : w.url.replace('https://', '')} ↗</a></dd></div>`;
    if (w.letter) html += `<div><dt>${en ? 'Reference' : 'Отзыв'}</dt><dd><button class="modal__link" type="button" data-letter="${w.letter}" style="background:none;border:0;padding:0;cursor:pointer">${en ? 'Open the letter' : 'Открыть письмо'} →</button></dd></div>`;
    $('#modal-dl').innerHTML = html;
    const lb = $('[data-letter]', modal);
    lb && lb.addEventListener('click', () => { closeModal(modal); setTimeout(() => openLetter(w.letter), 320); });
    openModal(modal);
  }

  /* ---------- letters ---------- */
  function renderLetters() {
    $('#lrow').innerHTML = LETTERS.map(l => `<button class="lcard" type="button" data-id="${l.id}">
      <span class="lcard__img"><img src="${L}thumb-${l.id}-p1.jpg" alt="${t(l.org)}" loading="lazy"></span>
      <b>${t(l.org)}</b><span>${t(l.sub)}</span></button>`).join('');
    $$('#lrow .lcard').forEach(b => b.addEventListener('click', () => openLetter(b.dataset.id)));
  }
  function openLetter(id) {
    const l = LETTERS.find(x => x.id === id); if (!l) return;
    $('#lightbox-pages').innerHTML = Array.from({ length: l.pages }, (_, i) => `<img src="${L}${l.id}-p${i + 1}.jpg" alt="${t(l.org)}, ${i + 1}">`).join('');
    openModal(lightbox);
  }

  /* ---------- counters ---------- */
  const cntIO = new IntersectionObserver((es) => es.forEach(e => {
    if (!e.isIntersecting) return; cntIO.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, sup = el.querySelector('sup');
    const tail = sup ? sup.outerHTML : '';
    if (reduce) return;
    const t0 = performance.now(), dur = 1600;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - p, 4);
      el.innerHTML = Math.round(end * k) + tail;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cntIO.observe(el));

  /* ---------- build section (sticky scroll) ---------- */
  const build = $('#build'), layers = $$('.frame__layer[data-layer]'), steps = $$('#build-steps li'), scan = $('#scan'), tc = $('#tc');
  const buildVideo = $('video', build);
  function onBuild() {
    if (reduce) return;
    const r = build.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    const seg = p * (layers.length + .6);   // layer i wipes in between i + .6 and i + 1.6
    let active = 0;
    let scanY = null;
    layers.forEach((el, i) => {
      const local = Math.min(1, Math.max(0, seg - (i + .6)));
      el.style.clipPath = `inset(${(1 - local) * 100}% 0 0 0)`;
      if (local > 0) active = i + 1;
      if (local > 0 && local < 1) scanY = (1 - local) * 100;
    });
    steps.forEach((li, i) => li.classList.toggle('is-on', i === active));
    scan.style.opacity = scanY === null ? 0 : 1;
    if (scanY !== null) scan.style.top = scanY + '%';
    const frames = Math.floor(p * 240 * 25);
    const f = (n) => String(n).padStart(2, '0');
    tc.textContent = `00:${f(Math.floor(frames / 1500) % 60)}:${f(Math.floor(frames / 25) % 60)}:${f(frames % 25)}`;
    if (active === layers.length) { if (!buildVideo.src) buildVideo.src = buildVideo.getAttribute('src'); buildVideo.play().catch(() => {}); }
    else buildVideo.pause();
  }
  if (!reduce) { addEventListener('scroll', onBuild, { passive: true }); addEventListener('resize', onBuild); onBuild(); }
  else layers.forEach(el => el.style.clipPath = 'none');

  /* ---------- direction: buttons preselect the form option; the contact box turns blue for websites and bots ---------- */
  const cbox = $('#cbox');
  const setTheme = () => { const v = ($('input[name="dir"]:checked') || {}).value; cbox.dataset.theme = v === 'web' || v === 'ai' ? 'web' : 'video'; };
  $$('input[name="dir"]').forEach(r => r.addEventListener('change', setTheme));
  $$('[data-dir]').forEach(a => a.addEventListener('click', () => {
    $('#cf-dir-' + a.dataset.dir).checked = true; setTheme();
  }));
  setTheme();

  /* ---------- FAQ: answers slide open and closed instead of jumping ---------- */
  $$('#faq details').forEach(d => {
    const body = $('p', d), ease = 'cubic-bezier(.2, .7, .1, 1)';
    $('summary', d).addEventListener('click', (e) => {
      if (reduce) return;
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = '1';
      const done = () => delete d.dataset.anim;
      if (!d.open) {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: '0px', paddingBottom: '0px', opacity: 0 }, { height: h + 'px', paddingBottom: '20px', opacity: 1 }], { duration: 420, easing: ease });
        setTimeout(done, 420);
      } else {
        const h = body.offsetHeight;
        body.animate([{ height: h + 'px', paddingBottom: '20px', opacity: 1 }, { height: '0px', paddingBottom: '0px', opacity: 0 }], { duration: 320, easing: ease, fill: 'forwards' });
        // timers keep running when animations are throttled, so the state never gets stuck
        setTimeout(() => { d.open = false; body.getAnimations().forEach(a => a.cancel()); done(); }, 320);
      }
    });
  });

  /* ---------- copy ---------- */
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    const txt = b.dataset.copy, label = b.textContent;
    try { await navigator.clipboard.writeText(txt); b.textContent = lang() === 'en' ? 'copied' : 'скопировано'; }
    catch { const r = document.createRange(); r.selectNodeContents(b.previousElementSibling); getSelection().removeAllRanges(); getSelection().addRange(r); }
    setTimeout(() => (b.textContent = label), 1600);
  }));

  /* ---------- lead form ----------
     Goes to the Telegram relay (lead-bot/worker.js) named in <meta name="ns-lead-endpoint">.
     Without an endpoint, or if the relay fails, the request falls back to an e-mail draft. */
  const form = $('#lead-form'), status = $('#form-status'), sendBtn = $('button[type="submit"]', form);
  const openedAt = Date.now();
  function say(text, kind) {
    status.hidden = false;
    status.style.background = kind === 'err' ? 'rgba(255,77,126,.08)' : '';
    status.style.borderColor = kind === 'err' ? 'rgba(255,77,126,.45)' : '';
    status.innerHTML = text;
  }
  function mailFallback(d, dirLabel, en) {
    const body = `${en ? 'Name' : 'Имя'}: ${d.name}\n${en ? 'Contact' : 'Связь'}: ${d.contact}\n${en ? 'Need' : 'Что нужно'}: ${dirLabel}\n\n${d.message}`;
    const subject = `${en ? 'Request' : 'Заявка'} nestudio.site: ${dirLabel}`;
    navigator.clipboard && navigator.clipboard.writeText(body).catch(() => {});
    location.href = `mailto:nestudiowork@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const en = lang() === 'en';
    const bad = $$('input[required], textarea[required]', form).find(i => !i.value.trim());
    if (bad) { say(en ? 'Fill in your name, a way to reach you and the idea.' : 'Заполните имя, способ связи и идею.', 'err'); bad.focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    const dirLabel = $(`label[for="cf-dir-${d.dir}"]`).textContent;
    const endpoint = ($('meta[name="ns-lead-endpoint"]') || {}).content;
    const tg = '<a href="https://t.me/nestudiopro" target="_blank" rel="noopener">@nestudiopro</a>';
    if (!endpoint) {
      mailFallback(d, dirLabel, en);
      say(en ? `Your mail app should open with the request. If it did not, the text is copied: send it to ${tg} on Telegram.`
             : `Должна открыться почта с готовым письмом. Если не открылась, текст заявки скопирован: отправьте его в Telegram ${tg}.`);
      return;
    }
    sendBtn.disabled = true;
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, lang: lang(), elapsed: Date.now() - openedAt }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || r.status);
      form.reset(); $('#cf-dir-video').checked = true; setTheme();
      say(en ? 'Thank you! The request is with us. We reply within 15 minutes during working hours.'
             : 'Спасибо! Заявка у нас. Ответим в рабочее время в течение 15 минут.');
    } catch (err) {
      say(en ? `Could not send the request. Please message us on Telegram ${tg} or e-mail nestudiowork@gmail.com.`
             : `Не получилось отправить заявку. Напишите нам в Telegram ${tg} или на nestudiowork@gmail.com.`, 'err');
    } finally { sendBtn.disabled = false; }
  });

  /* ---------- magnetic buttons ---------- */
  if (canHover && !reduce) {
    $$('.magnet').forEach(b => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      b.addEventListener('mouseleave', () => (b.style.transform = ''));
    });
  }

  /* ---------- language ---------- */
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  function setLang(l) {
    window.I18N.apply(l);
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === l));
    renderWorks(); renderLetters();
    store.set('ns-lang', l);
    window.dispatchEvent(new CustomEvent('ns:lang', { detail: l }));
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));


  /* ---------- init ---------- */
  setLang(store.get('ns-lang') === 'en' ? 'en' : 'ru');
})();
