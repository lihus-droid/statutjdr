// Page d'état : interroge, depuis le navigateur du visiteur, la sonde publique de l'appli et du site (/api/status), toutes les 30 secondes,
// et affiche le message laissé par l'hébergeur dans message.json. Aucune donnée n'est envoyée ailleurs ; rien n'est gardé, sauf la langue
// choisie (dans ce navigateur seulement).
'use strict';

const SERVICES = [
  { id: 'svc-app', url: 'https://appjdr.duckdns.org:27563/api/status' },
  { id: 'svc-site', url: 'https://sitejdr.duckdns.org:27568/api/status' },
];
const INTERVAL_MS = 30000;
const TIMEOUT_MS = 8000;

const LANGS = {
  fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', it: 'Italiano', pt: 'Português', ja: '日本語', zh: '中文', ru: 'Русский', ko: '한국어',
};

const T = {
  fr: {
    eyebrow: 'App JDR', title: 'État du service', language: 'Langue', messageTitle: 'Message de l’hébergeur', services: 'Services',
    app: 'L’application', site: 'Le site de présentation', checking: 'Vérification…', open: 'Ouvrir', ok: 'En service', degraded: 'En difficulté',
    down: 'Injoignable', checkedAt: 'Dernière vérification :', recheck: 'Vérifier maintenant',
    allOk: 'Tout fonctionne.', someDown: 'Le service est injoignable pour le moment. Une coupure d’Internet ou de courant est probable chez l’hébergeur.',
    offline: 'Ton appareil semble hors ligne : vérifie ta propre connexion.', helpTitle: 'Pendant une coupure',
    help: 'L’application est hébergée chez nous : une coupure d’Internet ou de courant la rend injoignable. Rien n’est perdu : tout reprend dès le retour de la connexion. Cette page se met à jour toute seule.',
    footer: 'Cette page est hébergée par GitHub Pages, hors de notre serveur. Elle ne dépose aucun cookie et ne mesure rien.', postedAt: 'Publié le {date}',
  },
  en: {
    eyebrow: 'App JDR', title: 'Service status', language: 'Language', messageTitle: 'Message from the host', services: 'Services',
    app: 'The app', site: 'The presentation site', checking: 'Checking…', open: 'Open', ok: 'Up', degraded: 'Having trouble',
    down: 'Unreachable', checkedAt: 'Last check:', recheck: 'Check now',
    allOk: 'Everything is working.', someDown: 'The service is unreachable right now. An Internet or power cut at the host is likely.',
    offline: 'Your device seems to be offline: check your own connection.', helpTitle: 'During an outage',
    help: 'The app is hosted at home: an Internet or power cut makes it unreachable. Nothing is lost: everything resumes as soon as the connection is back. This page updates by itself.',
    footer: 'This page is hosted by GitHub Pages, outside our server. It sets no cookies and tracks nothing.', postedAt: 'Posted on {date}',
  },
  es: {
    eyebrow: 'App JDR', title: 'Estado del servicio', language: 'Idioma', messageTitle: 'Mensaje del alojamiento', services: 'Servicios',
    app: 'La aplicación', site: 'El sitio de presentación', checking: 'Comprobando…', open: 'Abrir', ok: 'En servicio', degraded: 'Con problemas',
    down: 'Inaccesible', checkedAt: 'Última comprobación:', recheck: 'Comprobar ahora',
    allOk: 'Todo funciona.', someDown: 'El servicio no está disponible por ahora. Probablemente hay un corte de Internet o de luz en el alojamiento.',
    offline: 'Tu dispositivo parece sin conexión: revisa tu propia conexión.', helpTitle: 'Durante un corte',
    help: 'La aplicación está alojada en casa: un corte de Internet o de luz la deja inaccesible. No se pierde nada: todo vuelve en cuanto regresa la conexión. Esta página se actualiza sola.',
    footer: 'Esta página está alojada en GitHub Pages, fuera de nuestro servidor. No guarda cookies ni mide nada.', postedAt: 'Publicado el {date}',
  },
  de: {
    eyebrow: 'App JDR', title: 'Dienststatus', language: 'Sprache', messageTitle: 'Nachricht des Betreibers', services: 'Dienste',
    app: 'Die App', site: 'Die Vorstellungsseite', checking: 'Wird geprüft…', open: 'Öffnen', ok: 'In Betrieb', degraded: 'Gestört',
    down: 'Nicht erreichbar', checkedAt: 'Letzte Prüfung:', recheck: 'Jetzt prüfen',
    allOk: 'Alles funktioniert.', someDown: 'Der Dienst ist gerade nicht erreichbar. Wahrscheinlich ist beim Betreiber Internet oder Strom ausgefallen.',
    offline: 'Dein Gerät scheint offline zu sein: Prüfe deine eigene Verbindung.', helpTitle: 'Während eines Ausfalls',
    help: 'Die App läuft bei uns zu Hause: Ein Internet- oder Stromausfall macht sie unerreichbar. Nichts geht verloren: Sobald die Verbindung zurück ist, geht alles weiter. Diese Seite aktualisiert sich von selbst.',
    footer: 'Diese Seite wird von GitHub Pages gehostet, außerhalb unseres Servers. Sie setzt keine Cookies und misst nichts.', postedAt: 'Veröffentlicht am {date}',
  },
  it: {
    eyebrow: 'App JDR', title: 'Stato del servizio', language: 'Lingua', messageTitle: 'Messaggio del gestore', services: 'Servizi',
    app: 'L’applicazione', site: 'Il sito di presentazione', checking: 'Verifica…', open: 'Apri', ok: 'In servizio', degraded: 'In difficoltà',
    down: 'Irraggiungibile', checkedAt: 'Ultima verifica:', recheck: 'Verifica ora',
    allOk: 'Tutto funziona.', someDown: 'Il servizio è irraggiungibile al momento. Probabilmente c’è un’interruzione di Internet o di corrente presso il gestore.',
    offline: 'Il tuo dispositivo sembra offline: controlla la tua connessione.', helpTitle: 'Durante un’interruzione',
    help: 'L’applicazione è ospitata a casa nostra: un’interruzione di Internet o di corrente la rende irraggiungibile. Non si perde nulla: tutto riprende appena torna la connessione. Questa pagina si aggiorna da sola.',
    footer: 'Questa pagina è ospitata da GitHub Pages, fuori dal nostro server. Non usa cookie e non misura nulla.', postedAt: 'Pubblicato il {date}',
  },
  pt: {
    eyebrow: 'App JDR', title: 'Estado do serviço', language: 'Idioma', messageTitle: 'Mensagem do alojamento', services: 'Serviços',
    app: 'A aplicação', site: 'O site de apresentação', checking: 'A verificar…', open: 'Abrir', ok: 'Em serviço', degraded: 'Com problemas',
    down: 'Inacessível', checkedAt: 'Última verificação:', recheck: 'Verificar agora',
    allOk: 'Tudo funciona.', someDown: 'O serviço está inacessível de momento. Provavelmente há um corte de Internet ou de luz no alojamento.',
    offline: 'O teu dispositivo parece estar offline: verifica a tua própria ligação.', helpTitle: 'Durante um corte',
    help: 'A aplicação está alojada em casa: um corte de Internet ou de luz torna-a inacessível. Nada se perde: tudo volta assim que a ligação regressa. Esta página atualiza-se sozinha.',
    footer: 'Esta página está alojada no GitHub Pages, fora do nosso servidor. Não guarda cookies nem mede nada.', postedAt: 'Publicado a {date}',
  },
  ja: {
    eyebrow: 'App JDR', title: 'サービスの状況', language: '言語', messageTitle: '運営者からのお知らせ', services: 'サービス',
    app: 'アプリ', site: '紹介サイト', checking: '確認中…', open: '開く', ok: '稼働中', degraded: '不安定',
    down: '接続できません', checkedAt: '最終確認：', recheck: '今すぐ確認',
    allOk: 'すべて正常に動作しています。', someDown: '現在サービスに接続できません。運営者側でインターネットか電源の障害が起きている可能性があります。',
    offline: 'お使いの端末がオフラインのようです。ご自身の接続を確認してください。', helpTitle: '障害が起きているとき',
    help: 'アプリは自宅のサーバーで動いているため、インターネットや電源の障害で接続できなくなります。データは失われません。接続が戻ればすべて再開します。このページは自動で更新されます。',
    footer: 'このページは当方のサーバーの外、GitHub Pages で公開されています。Cookie は使わず、計測もしていません。', postedAt: '{date} に掲載',
  },
  zh: {
    eyebrow: 'App JDR', title: '服务状态', language: '语言', messageTitle: '托管方留言', services: '服务',
    app: '应用', site: '介绍网站', checking: '正在检查…', open: '打开', ok: '运行中', degraded: '运行不稳定',
    down: '无法访问', checkedAt: '上次检查：', recheck: '立即检查',
    allOk: '一切正常。', someDown: '服务暂时无法访问。托管方很可能遇到了断网或停电。',
    offline: '你的设备似乎已离线：请检查你自己的网络连接。', helpTitle: '故障期间',
    help: '应用托管在我们家中：断网或停电会导致无法访问。数据不会丢失，连接恢复后一切照常。本页面会自动更新。',
    footer: '本页面由 GitHub Pages 托管，位于我们的服务器之外。不使用 Cookie，也不做任何统计。', postedAt: '发布于 {date}',
  },
  ru: {
    eyebrow: 'App JDR', title: 'Состояние сервиса', language: 'Язык', messageTitle: 'Сообщение хостинга', services: 'Сервисы',
    app: 'Приложение', site: 'Сайт-презентация', checking: 'Проверка…', open: 'Открыть', ok: 'Работает', degraded: 'Есть проблемы',
    down: 'Недоступно', checkedAt: 'Последняя проверка:', recheck: 'Проверить сейчас',
    allOk: 'Всё работает.', someDown: 'Сервис сейчас недоступен. Вероятно, у хостинга пропал интернет или электричество.',
    offline: 'Похоже, твоё устройство не в сети: проверь своё подключение.', helpTitle: 'Во время сбоя',
    help: 'Приложение работает у нас дома: отключение интернета или электричества делает его недоступным. Ничего не теряется: всё возобновится, как только связь вернётся. Эта страница обновляется сама.',
    footer: 'Эта страница размещена на GitHub Pages, вне нашего сервера. Она не использует cookie и ничего не отслеживает.', postedAt: 'Опубликовано {date}',
  },
  ko: {
    eyebrow: 'App JDR', title: '서비스 상태', language: '언어', messageTitle: '운영자 안내', services: '서비스',
    app: '앱', site: '소개 사이트', checking: '확인 중…', open: '열기', ok: '정상 운영', degraded: '불안정',
    down: '접속 불가', checkedAt: '마지막 확인:', recheck: '지금 확인',
    allOk: '모두 정상 작동 중입니다.', someDown: '지금은 서비스에 접속할 수 없습니다. 운영자 쪽 인터넷이나 전기가 끊겼을 가능성이 큽니다.',
    offline: '기기가 오프라인인 것 같습니다. 본인의 연결을 확인하세요.', helpTitle: '장애가 생겼을 때',
    help: '앱은 저희 집 서버에서 운영됩니다. 인터넷이나 전기가 끊기면 접속할 수 없게 됩니다. 데이터는 사라지지 않으며, 연결이 돌아오면 모든 것이 다시 이어집니다. 이 페이지는 자동으로 업데이트됩니다.',
    footer: '이 페이지는 저희 서버 밖, GitHub Pages에서 호스팅됩니다. 쿠키를 쓰지 않고 아무것도 측정하지 않습니다.', postedAt: '{date} 게시',
  },
};

const readLang = () => { try { return localStorage.getItem('statut-lang'); } catch { return null; } };
const writeLang = (lang) => { try { localStorage.setItem('statut-lang', lang); } catch { /* navigation privée */ } };
const browserLang = (navigator.language || 'fr').slice(0, 2).toLowerCase();
let lang = T[readLang()] ? readLang() : T[browserLang] ? browserLang : 'fr';
const states = {};
let message = null;
let lastCheck = null;

const tr = (key, vars = {}) => (T[lang][key] ?? T.fr[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');

function render() {
  document.documentElement.lang = lang;
  document.title = `App JDR — ${tr('title')}`;
  for (const node of document.querySelectorAll('[data-i18n]')) {
    const key = node.dataset.i18n;
    if (key === 'checking' && node.closest('.status-item')) continue;
    node.textContent = tr(key);
  }
  for (const { id } of SERVICES) {
    const item = document.getElementById(id);
    const state = states[id] || 'checking';
    item.dataset.state = state;
    item.querySelector('.status-state').textContent = tr(state);
  }
  const values = SERVICES.map(({ id }) => states[id]);
  const summary = document.getElementById('summary');
  if (!navigator.onLine) summary.textContent = tr('offline');
  else if (values.every((v) => v === 'ok')) summary.textContent = tr('allOk');
  else if (values.some((v) => v === 'down' || v === 'degraded')) summary.textContent = tr('someDown');
  else summary.textContent = '';
  document.getElementById('checked-at').textContent = lastCheck ? lastCheck.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
  const box = document.getElementById('message');
  const text = message ? (message[lang] || message.fr || '').trim() : '';
  box.hidden = !text;
  if (text) {
    document.getElementById('message-text').textContent = text;
    document.getElementById('message-date').textContent = message.date ? tr('postedAt', { date: message.date }) : '';
  }
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store', signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!res.ok) return 'degraded';
    const data = await res.json().catch(() => null);
    return data?.status === 'ok' ? 'ok' : 'degraded';
  } catch {
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}

async function loadMessage() {
  try {
    const res = await fetch(`message.json?t=${Date.now()}`, { cache: 'no-store' });
    message = res.ok ? await res.json() : null;
  } catch {
    message = null;
  }
}

let checking = false;
async function check() {
  if (checking) return;
  checking = true;
  const results = await Promise.all(SERVICES.map((service) => probe(service.url)));
  SERVICES.forEach((service, index) => { states[service.id] = results[index]; });
  await loadMessage();
  lastCheck = new Date();
  checking = false;
  render();
}

const select = document.getElementById('lang');
for (const [code, name] of Object.entries(LANGS)) {
  const option = document.createElement('option');
  option.value = code;
  option.textContent = name;
  select.append(option);
}
select.value = lang;
select.addEventListener('change', () => { lang = select.value; writeLang(lang); render(); });
document.getElementById('recheck').addEventListener('click', check);
window.addEventListener('online', check);
window.addEventListener('offline', render);
render();
check();
setInterval(check, INTERVAL_MS);
