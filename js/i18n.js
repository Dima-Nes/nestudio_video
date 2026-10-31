/* RU lives in the HTML; EN is this dictionary. Switching restores the cached RU markup. */
window.I18N = (() => {
  const EN = {
    'nav.video': 'Video', 'nav.web': 'Websites and bots', 'nav.works': 'Work', 'nav.faq': 'FAQ', 'nav.contact': 'Contact', 'nav.cta': 'Get in touch',
    'hero.eyebrow': 'nestudio · Minsk',
    'hero.title': 'AI-made <em>commercials</em> and websites for business',
    'hero.lead': 'We film what is too expensive or impossible to shoot with a camera, and build websites and Telegram bots that bring you customers. You see the first version before you pay.',
    'hero.credit': 'In the background: our own work for Palazzo · “Yasik” · Porsche · Technex · Myadel',
    'hero.v': 'Video and music videos', 'hero.vs': 'Commercials, promos, music videos', 'hero.vp': 'a video in 3–5 days',
    'hero.w': 'Websites and bots', 'hero.ws': 'Landing pages, websites, AI Telegram bots', 'hero.wp': 'demo before payment',
    'clients.label': 'Trusted by', 'clients.title': 'Companies we have already worked with',
    'clients.gov': '<b>For public sector clients</b> we build a demo video or website before the bid. We have done this for Myadel and Voronovo districts, the Minsk nature committee, the National Centre for Youth Education, EIRKC Grodno, Gomel Cadet School and Kobrinkhimservice.',
    'cl.0': 'mall · Minsk', 'cl.1': 'food hall', 'cl.2': 'Switzerland', 'cl.3': 'rock band · USA', 'cl.4': 'industrial', 'cl.5': 'music rights · RU', 'cl.6': 'pharma', 'cl.7': 'EV charging', 'cl.8': 'cars', 'cl.9': 'bank', 'cl.10': 'TV channel', 'cl.11': 'agri holding · RU', 'cl.12': 'IT engineering', 'cl.13': 'website and SEO', 'cl.15': 'AI artist', 'cl.16': 'pizzeria · RU',
    'stats.projects': 'projects: commercials, music videos, websites, bots',
    'stats.letters': 'signed and stamped letters of appreciation',
    'stats.countries': 'countries: Belarus, Russia, Switzerland, USA',
    'stats.years': 'years in editing and production',
    'video.label': 'Direction 1 · Video', 'video.title': 'Commercials and music videos no camera could shoot',
    'video.lead': 'We generate scenes with AI and finish them for air: script, directing, editing, grading, music and voice. No film crew, no locations, no gear rental, so it is faster and cheaper than a classic production.',
    'video.1': 'Commercials for business', 'video.1s': 'Videos for social media, your website, TV and mall screens',
    'video.2': 'Impossible Ads', 'video.2s': 'Your product where no camera can go: in space, in Times Square, inside a game',
    'video.3': 'Music videos and animation', 'video.3s': 'Music videos, cartoons and characters without a shoot day',
    'video.4': 'HR and image films', 'video.4s': 'For companies, banks, regions and public bodies',
    'video.cta': 'Order a video',
    'reel.label': 'Example · Geely EX5', 'reel.lead': '7,000 km from Minsk to Yerevan: a real road trip and AI scenes of roads and mountains in one commercial.', 'reel.cta': 'Watch the Geely film',
    'web.label': 'Direction 2 · Websites and bots', 'web.title': 'Websites and Telegram bots that bring in leads',
    'web.lead': 'We build the site around your goal: structure, copy, design, a mobile version and SEO. Bots take requests and answer customers around the clock. You see a demo before you pay.',
    'web.1': 'Landing page or one-pager', 'web.1s': 'One page for an ad campaign, a product or a service',
    'web.2': 'Corporate website', 'web.2s': 'Services, projects, documents, a low-vision version',
    'web.3': 'Telegram and Viber bots', 'web.3s': 'Requests, bookings, AI answers to customer questions',
    'web.4': 'Automation', 'web.4s': 'Data collection, reports, integrations, AI assistants for the office',
    'web.shot3': 'Kobrinkhimservice', 'web.cta': 'Discuss a website or bot',
    'works.label': 'Work', 'works.title': 'What we have already made', 'works.all': 'All', 'works.video': 'Video', 'works.web': 'Websites', 'works.more': 'Full portfolio',
    'build.label': 'How a video is born', 'build.title': 'From one sentence to a finished shot',
    'build.lead': 'Scroll: this is how we built the BMW M3 in orbit.',
    'build.s1': 'Idea', 'build.p1': 'You write one sentence. We turn it into a script.',
    'build.s2': 'Sketch', 'build.p2': 'We draw the storyboard in pencil: angle and composition.',
    'build.s3': '3D scene', 'build.p3': 'We build the scene in Blender so the car and the light are exact.',
    'build.s4': 'Finished video', 'build.p4': 'Motion generation, editing and sound. Ready for Reels and TikTok.',
    'build.prompt': 'Black BMW M3 floating in orbit above Earth, sunrise over the horizon, NESTUDIO plate, cinematic light',
    'pr.label': 'Prices', 'pr.title': 'What it costs',
    'pr.v': 'Video', 'pr.v1': 'Short video', 'pr.v1s': '15–30 seconds for Reels, TikTok or your website. Music and sound, two rounds of revisions',
    'pr.v2': 'Commercial', 'pr.v2s': '30–60 seconds, several scenes, 16:9 and 9:16 versions',
    'pr.v3': 'Music video or series', 'pr.v3s': '60–180 seconds: a music video or a campaign of several videos', 'pr.from500': 'from $500',
    'pr.vnote': '3–5 working days. Commercial usage rights are yours.',
    'pr.w': 'Websites and bots', 'pr.w1': 'Landing page or one-pager', 'pr.w1s': 'One page, mobile-ready, request form',
    'pr.w2': 'Corporate website', 'pr.w2s': 'Several sections, admin panel, SEO', 'pr.w3': 'Telegram bot', 'pr.w3s': 'Requests, bookings, AI answers to questions',
    'pr.brief': 'after a brief', 'pr.wnote': 'We send the estimate on the day you contact us. You see a demo before you pay.',
    'pr.pay': 'Payment: 50% once you like the demo, 50% on delivery. We work under a contract.',
    'proc.label': 'Process', 'proc.title': 'Five steps from request to result',
    'proc.1t': 'Request', 'proc.1p': 'Message us on Telegram or leave a request. We reply within 15 minutes during working hours.',
    'proc.2t': 'Concept', 'proc.2p': 'Script or site structure, budget and timeline. Everything in writing.',
    'proc.badge': 'What sets us apart', 'proc.3t': 'Demo before payment', 'proc.3p': 'You see the first version of the video or site before you pay. Results, not promises.',
    'proc.4t': 'Production', 'proc.4p': '50% upfront. We finish the work and make revisions from the agreed list.',
    'proc.5t': 'Delivery', 'proc.5p': 'Watermark-free final after payment, versions for every platform and source files.',
    'rev.label': 'Reviews', 'rev.title': 'Clients write letters. Signed and stamped.',
    'rev.q1': 'If you think AI is a toy, you are already behind. nestudio are partners who turn new technology into a real business tool.',
    'rev.q1a': 'Alexander Ioda', 'rev.q1r': 'Deputy Director, Technex LLC',
    'rev.q2': 'The video was delivered on time, and the final version needed no changes at all.',
    'rev.q2r': 'Managing Director, Orthotec AG, Switzerland',
    'geo.label': 'Geography', 'geo.title': 'We work online from Minsk',
    'geo.by': 'Belarus', 'geo.by.t': 'Palazzo, Geely, Belinvestbank, Technex, Aaronpharm, Electroport, public clients in six cities',
    'geo.ru': 'Russia', 'geo.ru.t': 'Music 2 Business (Moscow), Sr.Double pizzeria (Dmitrov), AK Management',
    'geo.ch': 'Switzerland', 'geo.ch.t': 'Orthotec AG, Nottwil',
    'geo.us': 'USA', 'geo.us.t': '70’s Child rock band, “Bottom of a Bottle” music video',
    'faq.label': 'FAQ', 'faq.title': 'Frequent questions',
    'faq.q1': 'How long does a video take?', 'faq.a1': 'A short video or a commercial takes 3–5 working days after the script is approved. A music video or a series takes longer; we tell you the exact deadline up front.',
    'faq.q2': 'What do you need from us?', 'faq.a2': 'An idea or a task is enough. If you have product photos, a logo or a brand book, send them and the result will be more precise.',
    'faq.q3': 'Can we use the video in advertising?', 'faq.a3': 'Yes. Commercial usage rights come with the final file.',
    'faq.q4': 'How many revisions are included?', 'faq.a4': 'Two rounds of revisions from an agreed list. If you need more, we agree on it in advance.',
    'faq.q5': 'How does payment work?', 'faq.a5': 'First we show you a demo. If you like it, you pay 50% upfront and the rest on delivery. We work under a contract with individuals and companies.',
    'faq.q6': 'Do you work with other countries?', 'faq.a6': 'Yes, everything happens online. Our clients are in Belarus, Russia, Switzerland and the USA.',
    'faq.q7': 'Do you build websites for public bodies?', 'faq.a7': 'Yes. We follow the requirements for government websites: a low-vision version, Belarusian language, citizens’ appeals. We build the demo before the bid.',
    'ct.label': 'Contact', 'ct.title': 'Tell us what you need. We reply in 15 minutes.',
    'ct.lead': 'Mon–Fri, 09:00–19:00 Minsk time. Telegram is the fastest.', 'ct.tg': 'Message us on Telegram',
    'ct.phone': 'Phone', 'ct.copy': 'copy',
    'ct.name': 'Your name', 'ct.contact': 'Telegram, phone or e-mail', 'ct.dir': 'What you need',
    'ct.d1': 'Commercial', 'ct.d2': 'Music video', 'ct.d3': 'Website', 'ct.d4': 'Telegram bot',
    'ct.msg': 'Your task in a few words', 'ct.msg.ph': 'For example: a 30-second Instagram video about our coffee shop',
    'ct.send': 'Send request', 'ct.note': 'Your request goes straight to our Telegram. We reply within 15 minutes during working hours.',
    'ft.about': 'AI-made commercials, websites and Telegram bots. Minsk, Belarus.', 'ft.sections': 'Sections', 'ft.contacts': 'Contact', 'ft.more': 'More', 'ft.portfolio': 'Portfolio nestudio.by', 'ft.legal': 'Company details on request'
  };
  const ru = new Map(), ruPh = new Map();
  const TITLE = { ru: document.title, en: 'nestudio — AI-made commercials, websites and bots' };
  function apply(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (!ru.has(el)) ru.set(el, el.innerHTML);
      const k = el.dataset.i18n;
      el.innerHTML = lang === 'en' && EN[k] ? EN[k] : ru.get(el);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      if (!ruPh.has(el)) ruPh.set(el, el.placeholder);
      const k = el.dataset.i18nPh;
      el.placeholder = lang === 'en' && EN[k] ? EN[k] : ruPh.get(el);
    });
    document.documentElement.lang = lang;
    document.title = TITLE[lang];
  }
  return { apply, EN };
})();
