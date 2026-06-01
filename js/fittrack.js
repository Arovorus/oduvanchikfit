'use strict';
// FitTrack v1.0 — Кабінет особистого тренера

// ══════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════
const STORAGE_KEY = 'fittrack_v2';

const GOALS = {
  weight_loss: { label:'Схуднення',  color:'#93C5FD', badge:'badge-wl', offset:-500 },
  muscle_gain: { label:'Набір маси', color:'#6EE7B7', badge:'badge-mg', offset:+300 },
  definition:  { label:'Рельєф',     color:'#FCD34D', badge:'badge-df', offset:-250 },
  health:      { label:'Здоровʼя',   color:'#C4B5FD', badge:'badge-hl', offset:0    },
};

const ACTIVITY = [
  { v:1.2,   l:'Сидячий спосіб (без тренувань)'        },
  { v:1.375, l:'Легка активність (1–3 тренування/тиж)'  },
  { v:1.55,  l:'Помірна (3–5 тренувань на тиждень)'     },
  { v:1.725, l:'Висока активність (6–7/тиж)'            },
  { v:1.9,   l:'Дуже висока (двічі на день)'            },
];

const GRAD = [
  ['#667eea','#764ba2'],['#f093fb','#f5576c'],['#4facfe','#00f2fe'],
  ['#43e97b','#38f9d7'],['#fa709a','#fee140'],['#a18cd1','#fbc2eb'],
  ['#ffecd2','#fcb69f'],['#96fbc4','#f9f586'],
];

const DEFAULT_DATA = {
  version:2, theme:'dark',
  clients:[
    {
      id:'demo1', name:'Марія Коваленко', phone:'+380501234567', email:'',
      currentWeight:72.5, targetWeight:62.0, height:168, age:28,
      gender:'female', goal:'weight_loss', activityLevel:1.375,
      startDate:'2025-01-10', status:'active',
      notes:'Не вживає лактозу. Займається вранці. Невеличкий дискомфорт у лівому коліні.',
      weightHistory:[
        {date:'2025-01-10',weight:76.0},{date:'2025-01-17',weight:75.2},
        {date:'2025-01-24',weight:74.5},{date:'2025-02-01',weight:73.8},
        {date:'2025-02-08',weight:73.2},{date:'2025-02-15',weight:72.5},
      ],
    },
    {
      id:'demo2', name:'Олексій Мороз', phone:'+380631234567', email:'',
      currentWeight:78.0, targetWeight:85.0, height:180, age:24,
      gender:'male', goal:'muscle_gain', activityLevel:1.55,
      startDate:'2025-02-01', status:'active', remainingSessions:1,
      notes:'Тренується ввечері. Хоче набрати 7 кг маси за 6 місяців.',
      weightHistory:[
        {date:'2025-02-01',weight:76.0},{date:'2025-02-08',weight:76.8},
        {date:'2025-02-15',weight:77.3},{date:'2025-02-22',weight:78.0},
      ],
    },
    {
      id:'demo3', name:'Тетяна Бойко', phone:'+380671234568', email:'',
      currentWeight:65.0, targetWeight:62.0, height:162, age:35,
      gender:'female', goal:'definition', activityLevel:1.55,
      startDate:'2024-11-01', status:'pause', remainingSessions:0,
      notes:'Пауза через відрядження. Планує відновитися у квітні.',
      weightHistory:[
        {date:'2024-11-01',weight:68.0},{date:'2024-11-15',weight:67.2},
        {date:'2024-12-01',weight:66.5},{date:'2024-12-15',weight:65.8},
        {date:'2025-01-01',weight:65.0},
      ],
    },
  ],
  schedules: [],
  financialTransactions: [],
  partnerRequests: [],
  quickNotes:[
    {id:'n1',text:'Нагадати Марії про зважування в пʼятницю',done:false},
    {id:'n2',text:'Скласти план харчування для Олексія',done:false},
    {id:'n3',text:'Переглянути загальні результати за лютий',done:true},
  ],
  knowledge:{
    mealPlans:[
      {
        id:'mp1', title:'Раціон 1500 ккал — дефіцит',
        calories:1500, protein:120, fat:50, carbs:138,
        desc:'Для жінок при помірному дефіциті. Підходить для плавного схуднення.',
        meals:[
          {time:'Сніданок (7:30)',  foods:'Вівсянка 60г + 2 відварних яйця + огірок'},
          {time:'Перекус (10:30)', foods:'Грецький йогурт 150г + жменя ягід'},
          {time:'Обід (13:00)',    foods:'Куряча грудка 150г + гречка 60г + салат зі свіжих овочів'},
          {time:'Перекус (16:00)', foods:'Мигдаль 20г + зелене яблуко'},
          {time:'Вечеря (19:00)',  foods:'Риба нежирна 150г + тушковані овочі + зелень'},
        ],
      },
      {
        id:'mp2', title:'Раціон 1800 ккал — підтримка',
        calories:1800, protein:145, fat:60, carbs:188,
        desc:'Для підтримки поточної ваги та тонусу тіла.',
        meals:[
          {time:'Сніданок (8:00)',  foods:'Омлет з 3 яєць + тост цільнозерновий + авокадо ½'},
          {time:'Перекус (11:00)', foods:'Кисломолочний сир 200г + чайна ложка меду'},
          {time:'Обід (14:00)',    foods:'Індичка 180г + рис бурий 80г + броколі на парі'},
          {time:'Перекус (17:00)', foods:'Банан або протеїновий батончик'},
          {time:'Вечеря (20:00)',  foods:'Лосось 150г + тушковані овочі + квасоля 60г'},
        ],
      },
      {
        id:'mp3', title:'Раціон 2200 ккал — набір маси',
        calories:2200, protein:175, fat:70, carbs:248,
        desc:'Для набору м\'язової маси, профіцит ~300 ккал. Чоловіки з активними тренуваннями.',
        meals:[
          {time:'Сніданок (7:00)',      foods:'Вівсянка 80г + банан + 4 яйця + горіхи'},
          {time:'Перед тренуванням',    foods:'Рисові коржики + протеїновий коктейль'},
          {time:'Обід (13:00)',         foods:'Яловичина 200г + картопля варена 200г + овочі'},
          {time:'Перекус (16:00)',      foods:'Цільнозерновий хліб + арахісова паста + мед'},
          {time:'Вечеря (19:00)',       foods:'М\'ясо або риба 180г + макарони 100г + зелень'},
          {time:'Після тренування',     foods:'Протеїн 30г + рисові коржі або банан'},
        ],
      },
    ],
    foodGuide:{
      proteins:['Куряча грудка','Індичка','Яловичина (пісна)','Лосось','Тунець у власному соку','Тріска','Яйця','Кисломолочний сир 0–5%','Грецький йогурт','Тофу','Нут','Сочевиця'],
      carbs:   ['Гречка','Рис бурий','Вівсяна крупа','Батат','Квасоля','Кіноа','Цільнозерновий хліб','Сочевиця','Ячмінь','Кукурудза'],
      fats:    ['Авокадо','Волоські горіхи','Мигдаль','Оливкова олія','Лляне насіння','Насіння чіа','Жирна риба','Арахісова паста (без цукру)','Кокосова олія (в міру)'],
    },
    templates:[
      {id:'t1',title:'Нагадування про зважування', text:'Привіт! 👋 Не забудь завтра зранку зважитись натщесерце та надіслати мені результат. Слідкуємо за прогресом разом! 💪'},
      {id:'t2',title:'Мотиваційне повідомлення',    text:'Ти молодець! 🔥 Кожен день — це крок до твоєї мети. Памʼятай: результат приходить до тих, хто не здається. Продовжуємо!'},
      {id:'t3',title:'Нагадування про тренування',  text:'Привіт! 💪 Сьогодні день тренування. Підготуй форму, пий воду і памʼятай — я чекаю. Разом ми досягнемо результату! 🏋️'},
      {id:'t4',title:'Похвала за результат',         text:'Чудові результати! ⭐ Я дуже пишаюся твоїм прогресом. Ти вже зробила великий крок — так тримати! Наступний тиждень ще кращий!'},
      {id:'t5',title:'Відповідь на зважування',      text:'Отримала! ✅ Все йде за планом. Продовжуємо дотримуватись режиму харчування та тренувань. Побачимось на наступному занятті! 🌿'},
    ],
  },
};

// ══════════════════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════════════════
const DB = {
  _d: null,

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._d = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
      if (!raw) {
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const tomorrow = new Date(now.getTime() + 86400000);
        const tomorrowDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`;
        if (!this._d.schedules || !this._d.schedules.length) {
          this._d.schedules = [
            {id:'sch1', clientId:'demo1', date:today, time:'09:00', endTime:'10:00', status:'scheduled'},
            {id:'sch2', clientId:'demo2', date:today, time:'11:30', endTime:'12:30', status:'scheduled'},
            {id:'sch3', clientId:'demo1', date:tomorrowDate, time:'18:00', endTime:'19:00', status:'scheduled'},
          ];
        }
      }
    } catch { this._d = JSON.parse(JSON.stringify(DEFAULT_DATA)); }
    return this;
  },

  save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._d)); return this; },

  getTheme()  { return this._d.theme || 'dark'; },
  setTheme(t) { this._d.theme = t; this.save(); },

  getClients()  { return this._d.clients || []; },
  getClient(id) { return (this._d.clients || []).find(c => c.id === id) || null; },

  saveClient(c) {
    if (!this._d.clients) this._d.clients = [];
    const i = this._d.clients.findIndex(x => x.id === c.id);
    if (i >= 0) this._d.clients[i] = c; else this._d.clients.unshift(c);
    this.save();
  },

  deleteClient(id) { this._d.clients = (this._d.clients||[]).filter(c => c.id !== id); this.save(); },

  addWeight(clientId, date, weight) {
    const c = this.getClient(clientId); if (!c) return;
    c.weightHistory = (c.weightHistory||[]).filter(e => e.date !== date);
    c.weightHistory.push({date, weight});
    c.weightHistory.sort((a,b) => a.date.localeCompare(b.date));
    c.currentWeight = weight;
    this.save();
  },

  deleteWeight(clientId, date) {
    const c = this.getClient(clientId); if (!c) return;
    c.weightHistory = (c.weightHistory||[]).filter(e => e.date !== date);
    if (c.weightHistory.length) c.currentWeight = c.weightHistory[c.weightHistory.length-1].weight;
    this.save();
  },

  getNotes()   { return this._d.quickNotes || []; },
  saveNote(n)  {
    if (!this._d.quickNotes) this._d.quickNotes = [];
    const i = this._d.quickNotes.findIndex(x => x.id === n.id);
    if (i >= 0) this._d.quickNotes[i] = n; else this._d.quickNotes.unshift(n);
    this.save();
  },
  deleteNote(id) { this._d.quickNotes = (this._d.quickNotes||[]).filter(n => n.id !== id); this.save(); },

  getSchedules() { return this._d.schedules || []; },
  // Financial transactions
  getFinancialTransactions() { return this._d.financialTransactions || []; },
  saveFinancialTransaction(t) {
    if (!this._d.financialTransactions) this._d.financialTransactions = [];
    t.id = t.id || this.uid();
    const idx = this._d.financialTransactions.findIndex(x=>x.id===t.id);
    if (idx>=0) this._d.financialTransactions[idx] = t; else this._d.financialTransactions.unshift(t);
    this.save();
  },
  // helper to add sessions to client when buying a subscription
  addSessionsToClient(clientId, count) {
    const c = this.getClient(clientId);
    if (!c) return;
    if (typeof c.remainingSessions !== 'number') c.remainingSessions = 0;
    c.remainingSessions += Number(count) || 0;
    this.saveClient(c);
  },
  getPartnerRequests() { return this._d.partnerRequests || []; },
  savePartnerRequest(r) {
    if (!this._d.partnerRequests) this._d.partnerRequests = [];
    r.id = r.id || this.uid();
    const idx = this._d.partnerRequests.findIndex(x=>x.id===r.id);
    if (idx>=0) this._d.partnerRequests[idx] = r; else this._d.partnerRequests.unshift(r);
    this.save();
  },
  deletePartnerRequest(id) { this._d.partnerRequests = (this._d.partnerRequests||[]).filter(r => r.id !== id); this.save(); },
  getSchedule(id) { return (this._d.schedules || []).find(e => e.id === id) || null; },
  getSchedulesForDay(date) { return (this._d.schedules || []).filter(e => e.date === date).sort((a,b)=> (a.time||'').localeCompare(b.time||'')); },
  _calcEndTime(time) {
    if (!time || !/^\d{2}:\d{2}$/.test(time)) return '00:00';
    const [h,m] = time.split(':').map(Number);
    const dt = new Date(); dt.setHours(h); dt.setMinutes(m + 60);
    return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
  },
  _normalizeSchedule(ev) {
    if (!ev.time && ev.startTime) ev.time = ev.startTime;
    if (!ev.endTime && ev.time) ev.endTime = this._calcEndTime(ev.time);
    return ev;
  },
  saveSchedule(ev) {
    if (!this._d.schedules) this._d.schedules = [];
    ev = this._normalizeSchedule(ev);
    const idx = this._d.schedules.findIndex(x => x.id === ev.id);
    if (idx >= 0) {
      const existing = this._d.schedules[idx];
      const nowDone = ev.status === 'done';
      const wasDone = existing.status === 'done';
      if (!wasDone && nowDone && !ev.sessionUsed) {
        ev.sessionUsed = this._consumeSession(ev.clientId);
      }
      this._d.schedules[idx] = ev;
    } else {
      ev.id = ev.id || this.uid();
      ev.sessionUsed = ev.sessionUsed ?? this._consumeSession(ev.clientId);
      this._d.schedules.unshift(ev);
    }
    this.save();
  },
  deleteSchedule(id) { this._d.schedules = (this._d.schedules||[]).filter(e => e.id !== id); this.save(); },
  completeSchedule(id) {
    const ev = this.getSchedule(id);
    if (!ev || ev.status === 'done') return;
    ev.status = 'done';
    if (!ev.sessionUsed) ev.sessionUsed = this._consumeSession(ev.clientId);
    this.saveSchedule(ev);
  },
  _consumeSession(clientId) {
    const c = this.getClient(clientId);
    if (!c) return false;
    if (typeof c.remainingSessions !== 'number') c.remainingSessions = 0;
    if (c.remainingSessions > 0) {
      c.remainingSessions = Math.max(0, c.remainingSessions - 1);
      this.saveClient(c);
      return true;
    }
    return false;
  },

  getKnowledge() { return this._d.knowledge || DEFAULT_DATA.knowledge; },

  uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); },
};

// ══════════════════════════════════════════════════════════
// CALCULATOR ENGINE  (Mifflin–St Jeor)
// ══════════════════════════════════════════════════════════
const Calc = {
  bmr(gender, weight, height, age) {
    const b = 10*weight + 6.25*height - 5*age;
    return Math.round(gender === 'male' ? b+5 : b-161);
  },
  tdee(bmr, act) { return Math.round(bmr * act); },
  goalKcal(tdee, goal) { return Math.round(tdee + (GOALS[goal]?.offset ?? 0)); },

  macros(kcal, goal, weight) {
    let pG, fatPct;
    switch(goal) {
      case 'weight_loss': pG = weight*2.2; fatPct = .25; break;
      case 'muscle_gain': pG = weight*2.0; fatPct = .30; break;
      case 'definition':  pG = weight*2.5; fatPct = .20; break;
      default:            pG = weight*1.6; fatPct = .30;
    }
    pG = Math.round(pG);
    const fG = Math.round((kcal * fatPct) / 9);
    const cG = Math.max(20, Math.round((kcal - pG*4 - fG*9) / 4));
    return {protein:pG, fat:fG, carbs:cG};
  },

  bmi(w, h) { return (w / ((h/100)**2)).toFixed(1); },
  bmiLabel(v) {
    if (v < 18.5) return ['Недостатня вага','#60A5FA'];
    if (v < 25)   return ['Норма',          '#34D399'];
    if (v < 30)   return ['Надмірна вага',  '#FBB040'];
    return               ['Ожиріння',       '#F87171'];
  },

  run(p) {
    const bmr  = this.bmr(p.gender, p.weight, p.height, p.age);
    const tdee = this.tdee(bmr, p.activityLevel);
    const kcal = this.goalKcal(tdee, p.goal);
    const macros = this.macros(kcal, p.goal, p.weight);
    const bmiVal = parseFloat(this.bmi(p.weight, p.height));
    const [bmiLabel, bmiColor] = this.bmiLabel(bmiVal);
    return {bmr, tdee, kcal, macros, bmi:bmiVal, bmiLabel, bmiColor};
  },
};

// ══════════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════════
const Utils = {
  fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('uk-UA',{day:'numeric',month:'short',year:'numeric'});
  },
  fmtShort(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('uk-UA',{day:'numeric',month:'short'});
  },
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },
  initials(name) {
    const p = (name||'').trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0]+p[1][0]).toUpperCase() : (p[0]||'?')[0].toUpperCase();
  },
  grad(name) {
    let h = 0;
    for (let i=0; i<(name||'').length; i++) h = ((h<<5)-h+name.charCodeAt(i))|0;
    const [a,b] = GRAD[Math.abs(h) % GRAD.length];
    return `linear-gradient(135deg,${a},${b})`;
  },
  avatar(name, size=40, r='11px') {
    const fs = Math.round(size*.38);
    return `<div class="avatar" style="width:${size}px;height:${size}px;border-radius:${r};background:${this.grad(name)};font-size:${fs}px">${this.initials(name)}</div>`;
  },
  delta(history) {
    if (!history || history.length < 2) return null;
    const s = [...history].sort((a,b)=>a.date.localeCompare(b.date));
    return +(s[s.length-1].weight - s[0].weight).toFixed(1);
  },
  validate(val, min, max, name) {
    const n = parseFloat(val);
    if (isNaN(n)||n<min||n>max) throw new Error(`${name}: введіть число від ${min} до ${max}`);
    return n;
  },
  esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },
};

// ══════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════
const Toast = {
  show(msg, type='ok') {
    const el = document.createElement('div');
    const icon = {ok:'check-circle',err:'alert-circle',info:'info'}[type]||'info';
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i><span>${Utils.esc(msg)}</span>`;
    document.getElementById('toasts').appendChild(el);
    lucide.createIcons({nodes:[el]});
    setTimeout(()=>{ el.style.cssText='opacity:0;transition:opacity .3s'; setTimeout(()=>el.remove(),300); }, 2700);
  },
};

// ══════════════════════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════════════════════
const Modal = {
  open(html) {
    const box = document.getElementById('modal-box');
    const ov  = document.getElementById('modal-overlay');
    box.innerHTML = html;
    ov.classList.remove('hidden');
    lucide.createIcons({nodes:[box]});
    const close = e => { if (e.target === ov) Modal.close(); };
    ov.addEventListener('click', close, {once:true});
  },
  close() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-box').innerHTML = '';
  },
};

// ══════════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════════
let _chart = null;

const Router = {
  init() {
    window.addEventListener('hashchange', ()=>this._go());
    this._go();
  },
  _go() {
    Modal.close();
    if (_chart) { try{_chart.destroy();}catch{} _chart=null; }
    const hash = location.hash.replace('#','') || 'dashboard';
    const [view, param] = hash.split('/');
    const map = {
      dashboard:  ()=>Views.Dashboard.render(),
      clients:    ()=>Views.Clients.render(),
      finances:   ()=>Views.Finances.render(),
      calculator: ()=>Views.Calculator.render(),
      knowledge:  ()=>Views.Knowledge.render(),
      calendar:   ()=>Views.Calendar.render(),
      client:     ()=>Views.ClientDetail.render(param),
    };
    (map[view] || map.dashboard)();
    this._nav(view, param);
  },
  _nav(view, param) {
    const isDetail = view==='client' && param;
    document.querySelectorAll('[data-view]').forEach(el=>{
      const v = el.dataset.view;
      el.classList.toggle('active', isDetail ? v==='clients' : v===view);
    });
    const bb = document.getElementById('back-btn');
    if (bb) bb.classList.toggle('hidden', !isDetail);
  },
  go(hash) { location.hash = hash; },
};

// ══════════════════════════════════════════════════════════
// CHART HELPER
// ══════════════════════════════════════════════════════════
function buildChart(canvasId, history, target, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const sorted = [...history].sort((a,b)=>a.date.localeCompare(b.date));
  const labels = sorted.map(e=>Utils.fmtShort(e.date));
  const data   = sorted.map(e=>e.weight);
  const ctx    = canvas.getContext('2d');
  const grad   = ctx.createLinearGradient(0,0,0,220);
  grad.addColorStop(0, color+'55');
  grad.addColorStop(1, color+'00');
  if (_chart) { try{_chart.destroy();}catch{} }
  _chart = new Chart(ctx, {
    type:'line',
    data:{
      labels,
      datasets:[
        {
          label:'Вага (кг)', data, borderColor:color, borderWidth:2.5,
          backgroundColor:grad, fill:true, tension:.4,
          pointRadius:5, pointBackgroundColor:color,
          pointBorderColor:'#1A1A2C', pointBorderWidth:2, pointHoverRadius:7,
        },
        {
          label:`Ціль ${target} кг`,
          data:Array(data.length).fill(target),
          borderColor:'rgba(255,255,255,.2)', borderWidth:1.5,
          borderDash:[6,4], pointRadius:0, fill:false,
        },
      ],
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'#1A1A2C', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
          titleColor:'#8080A8', bodyColor:'#F0F0F5', padding:10,
          callbacks:{label:c=>` ${c.dataset.label}: ${c.parsed.y} кг`},
        },
      },
      scales:{
        x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#5050A0',font:{size:11}}},
        y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#5050A0',font:{size:11},callback:v=>v+' кг'}},
      },
    },
  });
}

// ══════════════════════════════════════════════════════════
// VIEW: DASHBOARD
// ══════════════════════════════════════════════════════════
const Views = {};

Views.Dashboard = {
  render() {
    const clients = DB.getClients();
    const active  = clients.filter(c=>c.status==='active');
    let totalDelta = 0;
    clients.forEach(c=>{
      const d = Utils.delta(c.weightHistory);
      if (d!==null) totalDelta += d;
    });
    const notes   = DB.getNotes();
    const pending = notes.filter(n=>!n.done).length;

    document.getElementById('content').innerHTML = `
    <div class="p-4 md:p-6 max-w-4xl mx-auto page-enter space-y-5">

      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Доброго дня! 👋</h1>
        <p class="text-sm text-gray-500 mt-1">${new Date().toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      </div>

      ${this._todayWidget()}

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        ${this._stat(active.length, 'Активних клієнтів','users','emerald')}
        ${this._stat(Math.abs(totalDelta).toFixed(1)+' кг', 'Результат команди','trending-down','gold')}
        ${this._stat(clients.length, 'Всього клієнтів','user-check','blue')}
        ${this._stat(pending, 'Завдань на сьогодні','clipboard-list','purple')}
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-white text-sm">Активні клієнти</div>
          <a href="#clients" class="btn btn-sm btn-ghost"><i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>Всі клієнти</a>
        </div>
        ${active.length===0
          ? `<div class="text-center py-8 text-gray-600 text-sm">Немає активних клієнтів.<br><a href="#clients" class="text-gold-400 hover:underline">Додати клієнта</a></div>`
          : `<div class="space-y-1.5">${active.map(c=>{
              const d=Utils.delta(c.weightHistory);
              return `<div class="client-card flex items-center gap-3 p-3 rounded-xl" onclick="Router.go('client/${c.id}')">
                ${Utils.avatar(c.name,40)}
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-white">${Utils.esc(c.name)}</div>
                  <div class="text-xs text-gray-500">${GOALS[c.goal]?.label||'—'} · ${c.currentWeight} кг → ${c.targetWeight} кг</div>
                </div>
                ${d!==null?`<div class="text-sm font-bold flex-shrink-0 ${d<0?'text-emerald-400':d>0?'text-rose-400':'text-gray-500'}">${d>0?'+':''}${d} кг</div>`:''}
              </div>`;
            }).join('')}</div>`
        }
      </div>

      ${this._todayWidget()}

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-white text-sm">Нотатки та завдання</div>
          <button onclick="Views.Dashboard._addNote()" class="btn btn-sm btn-gold"><i data-lucide="plus" class="w-3.5 h-3.5"></i>Додати</button>
        </div>
        <div id="notes-list">${this._notesList(notes)}</div>
      </div>
    </div>`;

    lucide.createIcons({nodes:[document.getElementById('content')]});
  },

  _stat(val, lbl, icon, color) {
    const bg = {gold:'bg-gold-400/15',emerald:'bg-emerald-500/15',blue:'bg-blue-500/15',purple:'bg-purple-500/15'};
    const tc = {gold:'text-gold-400',emerald:'text-emerald-400',blue:'text-blue-400',purple:'text-purple-400'};
    return `<div class="stat-card">
      <div class="text-2xl font-bold text-white mb-1">${val}</div>
      <div class="text-xs text-gray-500 font-medium">${lbl}</div>
      <div class="mt-3 w-7 h-7 rounded-lg ${bg[color]||''} flex items-center justify-center">
        <i data-lucide="${icon}" class="w-3.5 h-3.5 ${tc[color]||''}"></i>
      </div>
    </div>`;
  },

  _todayWidget() {
    const selected = (typeof Views!=='undefined' && Views.Calendar && Views.Calendar._date) ? Views.Calendar._date : Utils.today();
    const events = DB.getSchedulesForDay(selected);
    return `<div class="card">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="font-semibold text-white text-sm">Поточні тренування</div>
          <div class="text-xs text-gray-500 mt-0.5">${Utils.fmtDate(selected)}</div>
        </div>
        <button onclick="Router.go('calendar')" class="btn btn-sm btn-ghost">
          <i data-lucide="calendar" class="w-3.5 h-3.5"></i>Відкрити календар
        </button>
      </div>
      ${events.length===0
        ? `<div class="text-center py-8 text-gray-600 text-sm">Наразі ніяких тренувань немає.<br><button onclick="Views.Calendar._openAddModal('${selected}')" class="btn btn-sm btn-gold mt-3">+ Записати на тренування</button></div>`
        : `<div class="space-y-3">${events.map(e=>{
            const client = DB.getClient(e.clientId);
            const isLast = client && client.remainingSessions===1;
            return `<div class="calendar-event-card ${isLast?'warn':''}">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-sm font-semibold text-white">${Utils.esc(client?.name||'Клієнт')}</div>
                  <div class="text-xs text-gray-400"><span class="whitespace-nowrap">${this._formatInterval(e)}</span> · ${client?.status==='pause'?'Пауза':'Активний'}</div>
                </div>
                <span class="text-xs ${isLast?'text-amber-300':'text-gray-400'}">${client?.remainingSessions??0} занять</span>
              </div>
              <div class="mt-3 flex items-center justify-between gap-2 flex-wrap">
                <span class="badge ${isLast?'badge-df badge-pause':''}">${e.status==='done'?'Завершено':'Заплановано'}</span>
                <div class="flex gap-2">
                  ${e.status==='scheduled'?`<button onclick="Views.Calendar._complete('${e.id}')" class="btn btn-sm btn-ghost">Готово</button>`:''}
                  <button onclick="Views.Calendar._delete('${e.id}')" class="btn btn-sm btn-danger">Видалити</button>
                </div>
              </div>
            </div>`;
          }).join('')}</div>`}
    </div>`;
  },

  _notesList(notes) {
    if (!notes.length) return `<div class="text-center py-6 text-gray-600 text-sm">Нотаток немає. Додайте першу!</div>`;
    return notes.map(n=>`
      <div class="flex items-start gap-3 py-2.5 group">
        <button onclick="Views.Dashboard._toggle('${n.id}')" class="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all border ${n.done?'bg-emerald-500 border-emerald-500':'border-white/20 hover:border-gold-400'}">
          ${n.done?'<i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>':''}
        </button>
        <span class="flex-1 text-sm leading-snug ${n.done?'line-through text-gray-600':'text-gray-300'}">${Utils.esc(n.text)}</span>
        <button onclick="Views.Dashboard._delNote('${n.id}')" class="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-600 hover:text-rose-400 transition-all">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>`).join('');
  },

  _addNote() {
    Modal.open(`<div class="p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="font-bold text-white">Нова нотатка</div>
        <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <label class="ft-label">Текст нотатки</label>
      <textarea id="nt" class="ft-input" rows="3" placeholder="Наприклад: нагадати клієнту про зважування…"></textarea>
      <div class="flex gap-2 mt-4">
        <button onclick="Modal.close()" class="btn btn-ghost flex-1">Скасувати</button>
        <button onclick="Views.Dashboard._saveNote()" class="btn btn-gold flex-1">Додати</button>
      </div>
    </div>`);
  },

  _saveNote() {
    const text = document.getElementById('nt').value.trim();
    if (!text) { Toast.show('Введіть текст нотатки','err'); return; }
    DB.saveNote({id:DB.uid(),text,done:false});
    Modal.close(); this.render(); Toast.show('Нотатку додано');
  },

  _toggle(id) {
    const n = DB.getNotes().find(x=>x.id===id);
    if (n) { n.done=!n.done; DB.saveNote(n); this.render(); }
  },

  _delNote(id) { DB.deleteNote(id); this.render(); Toast.show('Нотатку видалено'); },
};

// ══════════════════════════════════════════════════════════
// VIEW: CLIENTS
// ══════════════════════════════════════════════════════════
Views.Clients = {
  _f:'all', _q:'',

  render() {
    document.getElementById('content').innerHTML = `
    <div class="p-4 md:p-6 max-w-4xl mx-auto page-enter">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-xl font-bold text-white">Клієнти</h1>
          <div class="text-xs text-gray-500 mt-0.5">${DB.getClients().length} осіб у базі</div>
        </div>
        <button onclick="Views.Clients.openForm()" class="btn btn-gold">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          <span class="hidden sm:inline">Новий клієнт</span><span class="sm:hidden">+</span>
        </button>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <input id="csearch" type="search" class="ft-input flex-1" style="min-width:160px;max-width:260px" placeholder="Пошук за іменем або телефоном…" value="${Utils.esc(this._q)}" oninput="Views.Clients._search(this.value)">
        <div class="flex gap-1">
          ${['all','active','pause'].map(f=>`<button onclick="Views.Clients._filter('${f}')" class="btn btn-sm ${this._f===f?'btn-gold':'btn-ghost'}">${f==='all'?'Всі':f==='active'?'Активні':'На паузі'}</button>`).join('')}
        </div>
      </div>

      <div id="clist">${this._list()}</div>
    </div>`;
    lucide.createIcons({nodes:[document.getElementById('content')]});
  },

  _list() {
    let list = DB.getClients();
    if (this._f!=='all') list = list.filter(c=>c.status===this._f);
    if (this._q) { const q=this._q.toLowerCase(); list=list.filter(c=>c.name.toLowerCase().includes(q)||(c.phone||'').includes(q)); }
    if (!list.length) return `<div class="text-center py-16 text-gray-600 text-sm"><i data-lucide="search-x" class="w-8 h-8 mx-auto mb-3 opacity-40"></i><div>Клієнтів не знайдено</div></div>`;
    return `<div class="card p-0 overflow-hidden">${list.map((c,i)=>{
      const d = Utils.delta(c.weightHistory);
      return `<div class="flex items-center gap-3 p-4 client-card ${i?'border-t border-white/5':''}" onclick="Router.go('client/${c.id}')">
        ${Utils.avatar(c.name,44)}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5 flex-wrap">
            <span class="text-sm font-semibold text-white">${Utils.esc(c.name)}</span>
            <span class="badge ${c.status==='active'?'badge-active':'badge-pause'}">${c.status==='active'?'Активна':'Пауза'}</span>
          </div>
          <div class="text-xs text-gray-500">
            <span class="badge ${GOALS[c.goal]?.badge||''} mr-1">${GOALS[c.goal]?.label||'—'}</span>
            ${c.currentWeight} кг · Ціль: ${c.targetWeight} кг · З ${Utils.fmtShort(c.startDate)}
            ${typeof c.remainingSessions==='number'?` · <span class="font-semibold text-white">${c.remainingSessions} занять</span>`:''}
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          ${d!==null?`<div class="text-sm font-bold ${d<0?'text-emerald-400':d>0?'text-rose-400':'text-gray-500'}">${d>0?'+':''}${d} кг</div>`:''}
          <i data-lucide="chevron-right" class="w-4 h-4 text-gray-600"></i>
        </div>
      </div>`;
    }).join('')}</div>`;
  },

  _search(v) {
    this._q=v;
    const el = document.getElementById('clist');
    if (el) { el.innerHTML=this._list(); lucide.createIcons({nodes:[el]}); }
  },

  _filter(f) { this._f=f; this.render(); },

  openForm(id) {
    const c = id ? DB.getClient(id) : null;
    Modal.open(`<div class="p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="font-bold text-white text-base">${c?'Редагувати клієнта':'Новий клієнт'}</div>
        <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="ft-label">ПІБ *</label>
          <input id="cf-name" class="ft-input" placeholder="Марія Коваленко" value="${c?Utils.esc(c.name):''}">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Телефон</label><input id="cf-phone" class="ft-input" placeholder="+380501234567" value="${c?Utils.esc(c.phone||''):''}"></div>
          <div><label class="ft-label">Статус</label>
            <select id="cf-status" class="ft-input">
              <option value="active" ${!c||c.status==='active'?'selected':''}>Активна</option>
              <option value="pause" ${c&&c.status==='pause'?'selected':''}>Пауза</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Стать</label>
            <select id="cf-gender" class="ft-input">
              <option value="female" ${!c||c.gender==='female'?'selected':''}>Жінка</option>
              <option value="male" ${c&&c.gender==='male'?'selected':''}>Чоловік</option>
            </select>
          </div>
          <div><label class="ft-label">Вік *</label><input id="cf-age" class="ft-input" type="number" min="10" max="100" placeholder="28" value="${c?c.age:''}"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Зріст (см) *</label><input id="cf-height" class="ft-input" type="number" min="100" max="250" placeholder="168" value="${c?c.height:''}"></div>
          <div><label class="ft-label">Поточна вага (кг) *</label><input id="cf-weight" class="ft-input" type="number" min="30" max="300" step="0.1" placeholder="72.5" value="${c?c.currentWeight:''}"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Цільова вага (кг) *</label><input id="cf-target" class="ft-input" type="number" min="30" max="300" step="0.1" placeholder="62.0" value="${c?c.targetWeight:''}"></div>
          <div><label class="ft-label">Дата початку</label><input id="cf-start" class="ft-input" type="date" value="${c?c.startDate:Utils.today()}"></div>
        </div>
        <div><label class="ft-label">Ціль тренувань</label>
          <select id="cf-goal" class="ft-input">${Object.entries(GOALS).map(([k,g])=>`<option value="${k}" ${c&&c.goal===k?'selected':''}>${g.label}</option>`).join('')}</select>
        </div>
        <div><label class="ft-label">Рівень активності</label>
          <select id="cf-act" class="ft-input">${ACTIVITY.map(a=>`<option value="${a.v}" ${c&&c.activityLevel==a.v?'selected':''}>${a.l}</option>`).join('')}</select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Залишок оплачених занять</label>
            <input id="cf-sessions" class="ft-input" type="number" min="0" max="100" step="1" placeholder="8" value="${c?(typeof c.remainingSessions==='number'?c.remainingSessions:0):8}"></div>
          <div><label class="ft-label">Пакет</label>
            <input id="cf-package" class="ft-input" type="text" placeholder="Пакет" value="${c?Utils.esc(c.package||''):''}"></div>
        </div>
        <div><label class="ft-label">Нотатки тренера</label>
          <textarea id="cf-notes" class="ft-input" rows="2" placeholder="Особливості, обмеження, побажання…">${c?Utils.esc(c.notes||''):''}</textarea>
        </div>
      </div>
      <div class="flex gap-2 mt-5">
        <button onclick="Modal.close()" class="btn btn-ghost flex-1">Скасувати</button>
        <button onclick="Views.Clients._save('${c?c.id:''}')" class="btn btn-gold flex-1">${c?'Зберегти зміни':'Додати клієнта'}</button>
      </div>
    </div>`);
  },

  _save(eid) {
    try {
      const name   = document.getElementById('cf-name').value.trim();
      if (!name) throw new Error('Введіть ПІБ клієнта');
      const age    = Utils.validate(document.getElementById('cf-age').value,10,100,'Вік');
      const height = Utils.validate(document.getElementById('cf-height').value,100,250,'Зріст');
      const weight = Utils.validate(document.getElementById('cf-weight').value,30,300,'Поточна вага');
      const target = Utils.validate(document.getElementById('cf-target').value,30,300,'Цільова вага');
      const ex     = eid ? DB.getClient(eid) : null;
      const start  = document.getElementById('cf-start').value || Utils.today();
      const client = {
        id: ex ? ex.id : DB.uid(), name,
        phone: document.getElementById('cf-phone').value.trim(), email:'',
        gender: document.getElementById('cf-gender').value, age, height,
        currentWeight: weight, targetWeight: target,
        goal: document.getElementById('cf-goal').value,
        activityLevel: parseFloat(document.getElementById('cf-act').value),
        startDate: start, status: document.getElementById('cf-status').value,
        remainingSessions: parseInt(document.getElementById('cf-sessions').value,10) || 0,
        package: document.getElementById('cf-package').value.trim(),
        notes: document.getElementById('cf-notes').value.trim(),
        weightHistory: ex ? ex.weightHistory : [{date:start,weight}],
      };
      DB.saveClient(client);
      // auto-create first schedule when new client added with start date
      if (!ex && client.startDate) {
        const existing = DB.getSchedulesForDay(client.startDate).some(s=>s.clientId===client.id && s.time==='18:00');
        if (!existing) {
          DB.saveSchedule({ clientId: client.id, date: client.startDate, time: '18:00', status: 'scheduled', notes: 'Автоматичний запис при створенні клієнта' });
        }
      }
      Modal.close();
      if (document.getElementById('clist')) this.render();
      else { const c=DB.getClient(client.id); if(c) Views.ClientDetail.render(c.id); }
      Toast.show(ex?'Дані клієнта оновлено':'Клієнта додано!');
    } catch(e) { Toast.show(e.message,'err'); }
  },
};

// ══════════════════════════════════════════════════════════════════
// VIEW: FINANCES
// ══════════════════════════════════════════════════════════════════
Views.Finances = {
  _month: (new Date()).toISOString().slice(0,7), // YYYY-MM

  render() {
    const month = this._month;
    const txs = DB.getFinancialTransactions().filter(t => t.date && t.date.slice(0,7) === month);
    const gross = txs.reduce((s,t)=>s + (Number(t.amount)||0), 0);
    const net = +(gross * 0.7).toFixed(2);
    const activeClients = new Set(txs.filter(t=>t.clientId).map(t=>t.clientId)).size;
    const avg = activeClients ? +(net / activeClients).toFixed(2) : 0;

    document.getElementById('content').innerHTML = `
    <div class="p-4 md:p-6 max-w-4xl mx-auto page-enter space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-white">Фінанси</h1>
          <div class="text-xs text-gray-500 mt-1">Перегляд: ${new Date(month+'-01').toLocaleDateString('uk-UA',{month:'long',year:'numeric'})}</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="Views.Finances._changeMonth(-1)" class="btn btn-sm btn-ghost">‹</button>
          <button onclick="Views.Finances._changeMonth(1)" class="btn btn-sm btn-ghost">›</button>
          <button onclick="Views.Finances._openPartnerSearchModal()" class="btn btn-sm btn-ghost">Пошук партнера</button>
          <button onclick="Views.Finances._openAddIncomeModal()" class="btn btn-gold btn-sm">+ Внести дохід</button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div class="card p-4 text-white" style="background:#1E1E24;border:1px solid rgba(229,169,60,.08)">
          <div class="text-xs text-gray-400">Брудний прибуток</div>
          <div class="text-2xl font-bold text-white">${gross.toFixed(2)} ₴</div>
        </div>
        <div class="card p-4 text-white" style="background:#1E1E24;border:1px solid rgba(229,169,60,.08)">
          <div class="text-xs text-gray-400">Чистий прибуток</div>
          <div class="text-2xl font-bold text-white">${net.toFixed(2)} ₴</div>
        </div>
        <div class="card p-4 text-white" style="background:#1E1E24;border:1px solid rgba(229,169,60,.08)">
          <div class="text-xs text-gray-400">Активні клієнти</div>
          <div class="text-2xl font-bold text-white">${activeClients}</div>
        </div>
        <div class="card p-4 text-white" style="background:#1E1E24;border:1px solid rgba(229,169,60,.08)">
          <div class="text-xs text-gray-400">Середній чек</div>
          <div class="text-2xl font-bold text-white">${avg.toFixed(2)} ₴</div>
        </div>
      </div>

      <div class="lg:grid lg:grid-cols-[1.4fr_0.8fr] gap-3">
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm font-semibold text-white">Транзакції за місяць</div>
          </div>
          <div class="space-y-2">
            ${txs.length ? txs.map(t=>{
              const client = t.clientId ? DB.getClient(t.clientId) : null;
              return `<div class="flex items-center justify-between"><div class="text-sm">${Utils.esc(t.service)} · ${Utils.fmtDate(t.date)} ${client?`· ${Utils.esc(client.name)}`:''}</div><div class="text-sm font-semibold">${Number(t.amount).toFixed(2)} ₴</div></div>`;
            }).join('') : '<div class="text-sm text-gray-500">Немає транзакцій за цей місяць.</div>'}
          </div>
        </div>
        <div class="card p-4 bg-[#1E1E24] border border-orange-500/10">
          <div class="text-sm font-semibold text-white mb-3">Поточні броні</div>
          <div class="space-y-3">
            ${(() => {
              const paymentsThisMonth = DB.getFinancialTransactions().filter(t => t.date && t.date.slice(0,7) === month && t.clientId);
              const paidClients = new Set(paymentsThisMonth.map(t => t.clientId));
              const dueEvents = DB.getSchedules().filter(e => e.date && e.date.slice(0,7) === month && e.status==='scheduled' && e.clientId && !paidClients.has(e.clientId));
              if (!dueEvents.length) return '<div class="text-sm text-gray-500">Немає клієнтів із заборгованістю.</div>';
              return dueEvents.map(e => {
                const c = DB.getClient(e.clientId);
                return `<div class="rounded-xl border border-orange-400/30 bg-orange-500/10 p-3">
                  <div class="text-xs text-orange-200">Потрібна оплата</div>
                  <div class="text-sm font-semibold text-white mt-1">${Utils.esc(c?.name||'Клієнт')}</div>
                  <div class="text-xs text-gray-400 mt-1">${Utils.fmtDate(e.date)} · ${this._formatInterval(e)}</div>
                </div>`;
              }).join('');
            })()}
          </div>
        </div>
      </div>
    </div>`;

    lucide.createIcons({nodes:[document.getElementById('content')]});
  },

  _changeMonth(delta) {
    const [y,m] = this._month.split('-').map(Number);
    const d = new Date(y,m-1,1);
    d.setMonth(d.getMonth()+delta);
    this._month = d.toISOString().slice(0,7);
    this.render();
  },

  _openAddIncomeModal() {
    const today = Utils.today();
    const clients = DB.getClients();
    Modal.open(`
      <div class="p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="font-bold text-white">+ Внести дохід</div>
          <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="space-y-3">
          <div>
            <label class="ft-label">Клієнт</label>
            <div class="flex items-center gap-2">
              <input id="fin-client-search" class="ft-input flex-1 h-12" type="text" placeholder="Пошук або введіть ім'я...">
              <input id="fin-client" type="hidden" value="">
            </div>
            <div id="fin-client-list" class="mt-2 bg-white/5 rounded-lg max-h-44 overflow-auto hidden"></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="ft-label">Сума (₴)</label><input id="fin-amount" class="ft-input h-12" type="number" step="0.01" value="0"></div>
            <div><label class="ft-label">Послуга</label><select id="fin-service" class="ft-input h-12"><option>Разове</option><option>Абонемент</option></select></div>
          </div>
          <div id="fin-sessions-row" class="hidden"><label class="ft-label">Кількість занять</label><input id="fin-sessions" class="ft-input h-12" type="number" value="0"></div>
          <div><label class="ft-label">Дата</label><input id="fin-date" class="ft-input h-12" type="date" value="${today}"></div>
        </div>
        <div class="flex gap-2 mt-4">
          <button onclick="Modal.close()" class="btn btn-ghost flex-1">Скасувати</button>
          <button id="fin-save" class="btn btn-gold flex-1">Зберегти</button>
        </div>
      </div>
    `);

    // attach client search handlers
    (function(){
      const search = document.getElementById('fin-client-search');
      const hid = document.getElementById('fin-client');
      const list = document.getElementById('fin-client-list');
      const service = document.getElementById('fin-service');
      const sessionsRow = document.getElementById('fin-sessions-row');
      const saveBtn = document.getElementById('fin-save');

      function render(q){
        const clients = DB.getClients();
        const ql = (q||'').toLowerCase();
        const matches = clients.filter(c=>c.name.toLowerCase().includes(ql) || (c.phone||'').includes(ql)).slice(0,20);
        if(!matches.length){ list.classList.add('hidden'); list.innerHTML=''; return; }
        list.classList.remove('hidden');
        list.innerHTML = matches.map(c=>'<div class="px-3 py-2 cursor-pointer hover:bg-white/5" data-id="'+c.id+'" data-name="'+Utils.esc(c.name)+'">'+Utils.esc(c.name)+'</div>').join('');
        list.querySelectorAll('div[data-id]').forEach(el=>el.addEventListener('click', ()=>{ hid.value = el.dataset.id; search.value = el.dataset.name; list.classList.add('hidden'); }));
      }
      search.addEventListener('input', e=>{ hid.value=''; render(e.target.value); });
      search.addEventListener('focus', ()=>render(search.value));
      document.addEventListener('click', e=>{ if(!e.target.closest('#fin-client-list') && !e.target.closest('#fin-client-search')) list.classList.add('hidden'); });

      service.addEventListener('change', ()=>{ if(service.value==='Абонемент'){ sessionsRow.classList.remove('hidden'); } else { sessionsRow.classList.add('hidden'); }});

      saveBtn.addEventListener('click', ()=>{
        const clientId = hid.value;
        const clientName = (search.value||'').trim();
          const amountValue = document.getElementById('fin-amount').value;
          const amount = amountValue ? parseFloat(amountValue) || 0 : 0;
          const svc = document.getElementById('fin-service').value;
          const date = document.getElementById('fin-date').value || Utils.today();
          const sessions = parseInt(document.getElementById('fin-sessions').value,10) || 0;

          let finalClientId = clientId;
          if(!finalClientId && clientName){
            const existing = DB.getClients().find(c=> (c.name||'').trim().toLowerCase() === clientName.toLowerCase());
            if(existing) finalClientId = existing.id; else {
              const id = DB.uid();
              DB.saveClient({ id, name: clientName, phone:'', email:'', gender:'male', age:0, height:0, currentWeight:0, targetWeight:0, goal:'', activityLevel:1, startDate:Utils.today(), status:'active', remainingSessions:0, package:'', notes:'', weightHistory:[] });
              finalClientId = id;
              Toast.show('Клієнта створено');
            }
          }

          const tx = { clientId: finalClientId || null, amount, service:svc, date, sessionsAdded: svc==='Абонемент' ? sessions : 0 };
          DB.saveFinancialTransaction(tx);
          if (svc==='Абонемент' && finalClientId && sessions>0) DB.addSessionsToClient(finalClientId, sessions);
          Views.Finances.render();
          Modal.close();
          Toast.show('Транзакцію збережено');
        });
      })();
  },

  _openPartnerSearchModal() {
    const today = Utils.today();
    Modal.open(`
      <div class="p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="font-bold text-white">Пошук партнера</div>
          <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="space-y-3">
          <div>
            <label class="ft-label">Клієнт</label>
            <div class="flex items-center gap-2">
              <input id="partner-client-search" class="ft-input flex-1 h-12" type="text" placeholder="Пошук або введіть ім'я...">
              <input id="partner-client" type="hidden" value="">
            </div>
            <div id="partner-client-list" class="mt-2 bg-white/5 rounded-lg max-h-44 overflow-auto hidden"></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="ft-label">Дата</label><input id="partner-date" class="ft-input h-12" type="date" value="${today}"></div>
            <div><label class="ft-label">Час</label><input id="partner-time" class="ft-input h-12" type="time" value="18:00"></div>
          </div>
          <div><label class="ft-label">Нотатки</label><textarea id="partner-notes" class="ft-input" rows="3" placeholder="Особливості, побажання, рівень..."></textarea></div>
          <button id="partner-add" class="btn btn-gold btn-sm w-full h-12">Додати заявку</button>
        </div>
        <div class="mt-4">
          <div class="text-sm font-semibold text-white mb-3">Заявки</div>
          <div id="partner-requests-list" class="space-y-3"></div>
        </div>
      </div>
    `);

    (function(){
      const search = document.getElementById('partner-client-search');
      const hid = document.getElementById('partner-client');
      const list = document.getElementById('partner-client-list');
      const addBtn = document.getElementById('partner-add');
      const requestsWrapper = document.getElementById('partner-requests-list');
      const dateInput = document.getElementById('partner-date');
      const timeInput = document.getElementById('partner-time');
      const notesInput = document.getElementById('partner-notes');

      const toMinutes = t => { const [h,m] = (t||'00:00').split(':').map(Number); return h*60 + m; };

      function renderClients(q){
        const clients = DB.getClients();
        const ql = (q||'').toLowerCase();
        const matches = clients.filter(c=>c.name.toLowerCase().includes(ql) || (c.phone||'').includes(ql)).slice(0,20);
        if(!matches.length){ list.classList.add('hidden'); list.innerHTML = ''; return; }
        list.classList.remove('hidden');
        list.innerHTML = matches.map(c=>'<div class="px-3 py-2 cursor-pointer hover:bg-white/5" data-id="'+c.id+'" data-name="'+Utils.esc(c.name)+'">'+Utils.esc(c.name)+'</div>').join('');
        list.querySelectorAll('div[data-id]').forEach(el=>el.addEventListener('click', ()=>{ hid.value = el.dataset.id; search.value = el.dataset.name; list.classList.add('hidden'); }));
      }

      function renderRequests(){
        const reqs = DB.getPartnerRequests().sort((a,b)=> (a.date||'').localeCompare(b.date||'') || (a.time||'').localeCompare(b.time||''));
        if(!reqs.length){ requestsWrapper.innerHTML = '<div class="text-sm text-gray-500">Немає заявок.</div>'; return; }
        requestsWrapper.innerHTML = reqs.map(r=>{
          const matches = reqs.filter(o=>o.id!==r.id && o.date===r.date && Math.abs(toMinutes(o.time)-toMinutes(r.time)) <= 60);
          const match = matches[0];
          const matchedClass = matches.length ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-white/10 bg-white/5';
          const client = DB.getClient(r.clientId);
          return `<div class="rounded-xl border ${matchedClass} p-3">
            <div class="flex items-center justify-between gap-3 mb-2">
              <div class="text-sm font-semibold text-white">${Utils.esc(r.clientName || client?.name || 'Клієнт')}</div>
              <div class="text-xs text-gray-400">${Utils.fmtDate(r.date)} · ${Utils.esc(r.time)}</div>
            </div>
            <div class="text-xs text-gray-400 mb-3">${Utils.esc(r.notes||'')}</div>
            <div class="flex flex-wrap gap-2">
              <button data-action="match" data-id="${r.id}" data-match="${match?match.id:''}" class="btn btn-sm ${matches.length?'btn-gold':'btn-ghost'} ${matches.length?'':'opacity-50 cursor-not-allowed'}">Об'єднати</button>
              <button data-action="share" data-id="${r.id}" class="btn btn-sm btn-ghost">Поділитися в Telegram</button>
            </div>
          </div>`;
        }).join('');
        requestsWrapper.querySelectorAll('button[data-action]').forEach(btn=>{
          btn.addEventListener('click', (e)=>{
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            if(action==='match'){
              const matchId = btn.dataset.match;
              if(!matchId) return;
              Views.Finances._combinePartnerRequests(id, matchId);
            }
            if(action==='share') Views.Finances._copyPartnerInvite(id);
          });
        });
      }

      search.addEventListener('input', e=>{ hid.value=''; renderClients(e.target.value); });
      search.addEventListener('focus', ()=>renderClients(search.value));
      document.addEventListener('click', e=>{ if(!e.target.closest('#partner-client-list') && !e.target.closest('#partner-client-search')) list.classList.add('hidden'); });

      addBtn.addEventListener('click', ()=>{
        const clientId = hid.value;
        const clientName = (search.value||'').trim();
        const date = dateInput.value || today;
        const time = timeInput.value || '18:00';
        const notes = notesInput.value.trim();
        if(!clientName){ Toast.show('Введіть імʼя клієнта','err'); return; }
        let finalClientId = clientId;
        if(!finalClientId){
          const existing = DB.getClients().find(c=> (c.name||'').trim().toLowerCase() === clientName.toLowerCase());
          if(existing) finalClientId = existing.id; else {
            const id = DB.uid();
            DB.saveClient({ id, name: clientName, phone:'', email:'', gender:'male', age:0, height:0, currentWeight:0, targetWeight:0, goal:'', activityLevel:1, startDate:today, status:'active', remainingSessions:0, package:'', notes:'', weightHistory:[] });
            finalClientId = id;
            Toast.show('Клієнта створено');
          }
        }
        DB.savePartnerRequest({ clientId: finalClientId, clientName, date, time, notes });
        hid.value = '';
        search.value = '';
        notesInput.value = '';
        renderRequests();
        Toast.show('Заявку додано');
      });

      renderRequests();
    })();
  },

  _combinePartnerRequests(reqId, matchId) {
    const req = DB.getPartnerRequests().find(r=>r.id===reqId);
    const match = DB.getPartnerRequests().find(r=>r.id===matchId);
    if(!req || !match) return;
    const clientA = DB.getClient(req.clientId);
    const clientB = DB.getClient(match.clientId);
    if(!clientA || !clientB) return;
    const schedule = {
      id: DB.uid(),
      clientId: clientA.id,
      partnerIds: [clientB.id],
      date: req.date,
      time: req.time,
      endTime: this._defaultEnd(req.time),
      status: 'scheduled',
      type: 'pair',
      notes: `Парне тренування з ${clientB.name}`,
    };
    DB.saveSchedule(schedule);
    DB.addSessionsToClient(clientA.id, -0.7);
    DB.addSessionsToClient(clientB.id, -0.7);
    DB.deletePartnerRequest(req.id);
    DB.deletePartnerRequest(match.id);
    Modal.close();
    this.render();
    Toast.show('Парне тренування створено');
  },

  _copyPartnerInvite(reqId) {
    const req = DB.getPartnerRequests().find(r=>r.id===reqId);
    if(!req) return;
    const client = DB.getClient(req.clientId);
    const text = `Запрошення на парне тренування:
Клієнт: ${client?.name||req.clientName}
Дата: ${Utils.fmtDate(req.date)}
Час: ${req.time}
${req.notes ? 'Нотатки: '+req.notes : ''}`;
    navigator.clipboard.writeText(text).then(()=>Toast.show('Запрошення скопійовано')).catch(()=>Toast.show('Не вдалося скопіювати','err'));
  },
};

// ══════════════════════════════════════════════════════════
// VIEW: CLIENT DETAIL
// ══════════════════════════════════════════════════════════
Views.ClientDetail = {
  render(id) {
    const c = DB.getClient(id);
    if (!c) { Router.go('clients'); return; }

    const r   = Calc.run({gender:c.gender,weight:c.currentWeight,height:c.height,age:c.age,activityLevel:c.activityLevel,goal:c.goal});
    const gc  = GOALS[c.goal]?.color || '#D4A017';
    const d   = Utils.delta(c.weightHistory);
    const rem = (c.targetWeight - c.currentWeight).toFixed(1);
    const sorted = [...(c.weightHistory||[])].sort((a,b)=>b.date.localeCompare(a.date));
    const tKcal  = r.macros.protein*4 + r.macros.fat*9 + r.macros.carbs*4;

    document.getElementById('content').innerHTML = `
    <div class="p-4 md:p-6 max-w-3xl mx-auto page-enter space-y-4">

      <a href="#clients" class="hidden lg:inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>Клієнти
      </a>

      <!-- Profile card -->
      <div class="card flex items-start gap-4">
        ${Utils.avatar(c.name,56,'14px')}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="text-lg font-bold text-white leading-snug">${Utils.esc(c.name)}</div>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span class="badge ${c.status==='active'?'badge-active':'badge-pause'}">${c.status==='active'?'Активна':'Пауза'}</span>
                <span class="badge ${GOALS[c.goal]?.badge||''}">${GOALS[c.goal]?.label||'—'}</span>
              </div>
              ${c.remainingSessions===1?`<div class="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-100"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>Останнє тренування!</div>`:''}
            </div>
            <div class="flex gap-1 flex-shrink-0">
              <button onclick="Views.Clients.openForm('${c.id}')" class="btn btn-sm btn-ghost btn-icon" title="Редагувати"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
              <button onclick="Views.ClientDetail._del('${c.id}')" class="btn btn-sm btn-danger btn-icon" title="Видалити"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
              <button onclick="Export.print('${c.id}')" class="btn btn-sm btn-ghost btn-icon" title="Звіт PDF"><i data-lucide="file-text" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            ${c.phone?`<span><i data-lucide="phone" class="w-3 h-3 inline mr-1 opacity-60"></i>${Utils.esc(c.phone)}</span>`:''}
            <span><i data-lucide="calendar" class="w-3 h-3 inline mr-1 opacity-60"></i>З ${Utils.fmtDate(c.startDate)}</span>
            <span><i data-lucide="ruler" class="w-3 h-3 inline mr-1 opacity-60"></i>${c.height} см · ${c.age} р.</span>
            <span><i data-lucide="user" class="w-3 h-3 inline mr-1 opacity-60"></i>${c.gender==='female'?'Жінка':'Чоловік'}</span>
          </div>
        </div>
      </div>

      <!-- Weight summary -->
      <div class="grid grid-cols-3 gap-3">
        <div class="stat-card text-center"><div class="text-2xl font-bold text-white">${c.currentWeight}</div><div class="text-xs text-gray-500 mt-0.5">кг зараз</div></div>
        <div class="stat-card text-center"><div class="text-2xl font-bold text-white">${c.targetWeight}</div><div class="text-xs text-gray-500 mt-0.5">кг ціль</div></div>
        <div class="stat-card text-center">
          <div class="text-2xl font-bold ${parseFloat(rem)<=0?'text-emerald-400':'text-gold-400'}">${parseFloat(rem)<=0?'✓':rem}</div>
          <div class="text-xs text-gray-500 mt-0.5">${parseFloat(rem)<=0?'Ціль досягнута!':'кг до цілі'}</div>
        </div>
      </div>

      ${c.notes?`<div class="card" style="background:rgba(255,255,255,.03)">
        <div class="text-xs font-semibold text-gray-500 mb-1.5">Нотатки тренера</div>
        <div class="text-sm text-gray-300 leading-relaxed">${Utils.esc(c.notes)}</div>
      </div>`:''}

      <!-- Calculator -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-white text-sm">Калькулятор харчування</div>
          <span class="text-xs text-gray-600">Міффлін–Сан Жеор</span>
        </div>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="rounded-xl p-3 text-center" style="background:rgba(255,255,255,.04)">
            <div class="text-lg font-bold text-white">${r.bmr}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">ккал BMR</div>
          </div>
          <div class="rounded-xl p-3 text-center" style="background:rgba(255,255,255,.04)">
            <div class="text-lg font-bold text-white">${r.tdee}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">ккал TDEE</div>
          </div>
          <div class="rounded-xl p-3 text-center" style="background:${gc}18;border:1px solid ${gc}30">
            <div class="text-lg font-bold" style="color:${gc}">${r.kcal}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">ккал/день</div>
          </div>
        </div>
        <div class="space-y-2.5">
          ${this._mrow('Білки',r.macros.protein,4,'#60A5FA',tKcal)}
          ${this._mrow('Жири',r.macros.fat,9,'#FBB040',tKcal)}
          ${this._mrow('Вуглеводи',r.macros.carbs,4,'#34D399',tKcal)}
        </div>
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <span class="text-xs text-gray-500">ІМТ</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white">${r.bmi}</span>
            <span class="badge" style="background:${r.bmiColor}20;color:${r.bmiColor}">${r.bmiLabel}</span>
          </div>
        </div>
      </div>

      <!-- Chart -->
      ${sorted.length>=2?`<div class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-white text-sm">Графік прогресу ваги</div>
          ${d!==null?`<span class="text-sm font-bold ${d<0?'text-emerald-400':d>0?'text-rose-400':'text-gray-500'}">${d>0?'+':''}${d} кг всього</span>`:''}
        </div>
        <div class="chart-wrap"><canvas id="wc"></canvas></div>
      </div>`:''}

      <!-- Weight history -->
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <div class="font-semibold text-white text-sm">Журнал зважувань</div>
          <button onclick="Views.ClientDetail._addW('${c.id}')" class="btn btn-sm btn-gold"><i data-lucide="plus" class="w-3.5 h-3.5"></i>Додати</button>
        </div>
        <div id="wtable">${this._wtable(c)}</div>
      </div>

    </div>`;

    lucide.createIcons({nodes:[document.getElementById('content')]});
    if (sorted.length>=2) requestAnimationFrame(()=>buildChart('wc', c.weightHistory, c.targetWeight, gc));
  },

  _mrow(label, g, cpg, color, total) {
    const pct = Math.round((g*cpg/total)*100);
    return `<div>
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-gray-400">${label}</span>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-white">${g} г</span>
          <span class="text-xs text-gray-600">${pct}%</span>
        </div>
      </div>
      <div class="mbar"><div class="mbar-fill" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
  },

  _wtable(c) {
    const rows = [...(c.weightHistory||[])].sort((a,b)=>b.date.localeCompare(a.date));
    if (!rows.length) return `<div class="text-sm text-gray-600 text-center py-4">Записів поки немає.</div>`;
    return `<table class="ft-table"><thead><tr><th>Дата</th><th>Вага</th><th>Зміна</th><th></th></tr></thead><tbody>
      ${rows.map((e,i)=>{
        const prev=rows[i+1];
        const diff=prev?(e.weight-prev.weight).toFixed(1):null;
        return `<tr>
          <td class="text-gray-300">${Utils.fmtDate(e.date)}</td>
          <td class="font-semibold text-white">${e.weight} кг</td>
          <td class="font-medium ${diff===null?'text-gray-600':parseFloat(diff)<0?'text-emerald-400':'text-rose-400'}">${diff!==null?(parseFloat(diff)>0?'+':'')+diff+' кг':'—'}</td>
          <td class="text-right">
            <button onclick="Views.ClientDetail._delW('${c.id}','${e.date}')" class="btn btn-icon btn-danger" style="padding:4px">
              <i data-lucide="trash-2" class="w-3 h-3"></i>
            </button>
          </td>
        </tr>`;
      }).join('')}
    </tbody></table>`;
  },

  _addW(cid) {
    Modal.open(`<div class="p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="font-bold text-white">Додати зважування</div>
        <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="space-y-3">
        <div><label class="ft-label">Дата</label><input id="wd" class="ft-input" type="date" value="${Utils.today()}"></div>
        <div><label class="ft-label">Вага (кг)</label><input id="wv" class="ft-input" type="number" min="30" max="300" step="0.1" placeholder="72.5"></div>
      </div>
      <div class="flex gap-2 mt-4">
        <button onclick="Modal.close()" class="btn btn-ghost flex-1">Скасувати</button>
        <button onclick="Views.ClientDetail._saveW('${cid}')" class="btn btn-gold flex-1">Зберегти</button>
      </div>
    </div>`);
  },

  _saveW(cid) {
    try {
      const date = document.getElementById('wd').value;
      if (!date) throw new Error('Оберіть дату');
      const w = Utils.validate(document.getElementById('wv').value,30,300,'Вага');
      DB.addWeight(cid,date,w);
      Modal.close(); this.render(cid); Toast.show('Зважування збережено');
    } catch(e) { Toast.show(e.message,'err'); }
  },

  _delW(cid,date) { DB.deleteWeight(cid,date); this.render(cid); Toast.show('Запис видалено'); },

  _del(id) {
    const c=DB.getClient(id);
    Modal.open(`<div class="p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="font-bold text-white">Видалити клієнта?</div>
        <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <p class="text-sm text-gray-400 mb-5">Ви видаляєте <strong class="text-white">${Utils.esc(c.name)}</strong>. Всі дані, включно з журналом ваги, будуть втрачені назавжди.</p>
      <div class="flex gap-2">
        <button onclick="Modal.close()" class="btn btn-ghost flex-1">Скасувати</button>
        <button onclick="Views.ClientDetail._doDelete('${id}')" class="btn btn-danger flex-1">Видалити</button>
      </div>
    </div>`);
  },
  _doDelete(id) { DB.deleteClient(id); Modal.close(); Router.go('clients'); Toast.show('Клієнта видалено'); },
};

// ══════════════════════════════════════════════════════════
// VIEW: STANDALONE CALCULATOR
// ══════════════════════════════════════════════════════════
Views.Calculator = {
  render() {
    document.getElementById('content').innerHTML = `
    <div class="p-4 md:p-6 max-w-2xl mx-auto page-enter">
      <div class="mb-5">
        <h1 class="text-xl font-bold text-white">Калькулятор харчування</h1>
        <p class="text-xs text-gray-500 mt-1">Формула Міффліна–Сан Жеора · BMR · TDEE · Макронутрієнти</p>
      </div>
      <div class="card space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Стать</label>
            <select id="sc-g" class="ft-input"><option value="female">Жінка</option><option value="male">Чоловік</option></select>
          </div>
          <div><label class="ft-label">Вік (роки)</label><input id="sc-a" class="ft-input" type="number" min="10" max="100" placeholder="28"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Зріст (см)</label><input id="sc-h" class="ft-input" type="number" min="100" max="250" placeholder="168"></div>
          <div><label class="ft-label">Вага (кг)</label><input id="sc-w" class="ft-input" type="number" min="30" max="300" step="0.1" placeholder="72.5"></div>
        </div>
        <div><label class="ft-label">Рівень фізичної активності</label>
          <select id="sc-act" class="ft-input">${ACTIVITY.map(a=>`<option value="${a.v}">${a.l}</option>`).join('')}</select>
        </div>
        <div><label class="ft-label">Ціль</label>
          <select id="sc-goal" class="ft-input">${Object.entries(GOALS).map(([k,g])=>`<option value="${k}">${g.label}</option>`).join('')}</select>
        </div>
        <button onclick="Views.Calculator.calc()" class="btn btn-gold w-full">
          <i data-lucide="calculator" class="w-4 h-4"></i>Розрахувати
        </button>
      </div>
      <div id="sc-result" class="mt-5"></div>
    </div>`;
    lucide.createIcons({nodes:[document.getElementById('content')]});
  },

  calc() {
    try {
      const gender      = document.getElementById('sc-g').value;
      const age         = Utils.validate(document.getElementById('sc-a').value,10,100,'Вік');
      const height      = Utils.validate(document.getElementById('sc-h').value,100,250,'Зріст');
      const weight      = Utils.validate(document.getElementById('sc-w').value,30,300,'Вага');
      const activityLevel = parseFloat(document.getElementById('sc-act').value);
      const goal        = document.getElementById('sc-goal').value;
      const r           = Calc.run({gender,age,height,weight,activityLevel,goal});
      const gc          = GOALS[goal]?.color || '#D4A017';
      const tK          = r.macros.protein*4+r.macros.fat*9+r.macros.carbs*4;

      document.getElementById('sc-result').innerHTML = `
      <div class="card space-y-4 page-enter">
        <div class="font-semibold text-white text-sm">Результати розрахунку</div>
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="rounded-xl p-3" style="background:rgba(255,255,255,.04)">
            <div class="text-xl font-bold text-white">${r.bmr}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">ккал BMR</div>
            <div class="text-[10px] text-gray-600 mt-1">Базовий обмін</div>
          </div>
          <div class="rounded-xl p-3" style="background:rgba(255,255,255,.04)">
            <div class="text-xl font-bold text-white">${r.tdee}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">ккал TDEE</div>
            <div class="text-[10px] text-gray-600 mt-1">З урахуванням активності</div>
          </div>
          <div class="rounded-xl p-3" style="background:${gc}18;border:1px solid ${gc}30">
            <div class="text-xl font-bold" style="color:${gc}">${r.kcal}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">ккал/день</div>
            <div class="text-[10px] text-gray-600 mt-1">${GOALS[goal]?.label}</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="font-semibold text-white text-sm">Макронутрієнти</div>
        <div class="space-y-3">
          ${[['Білки',r.macros.protein,4,'#60A5FA'],['Жири',r.macros.fat,9,'#FBB040'],['Вуглеводи',r.macros.carbs,4,'#34D399']].map(([lbl,g,cpg,color])=>{
            const pct=Math.round((g*cpg/tK)*100);
            return `<div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm text-gray-300">${lbl}</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-white">${g} г</span>
                  <span class="text-xs text-gray-600">${g*cpg} ккал · ${pct}%</span>
                </div>
              </div>
              <div class="mbar"><div class="mbar-fill" style="width:${pct}%;background:${color}"></div></div>
            </div>`;
          }).join('')}
        </div>
        <div class="divider"></div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-400">Індекс маси тіла (ІМТ)</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white">${r.bmi}</span>
            <span class="badge" style="background:${r.bmiColor}20;color:${r.bmiColor}">${r.bmiLabel}</span>
          </div>
        </div>
        <div class="rounded-xl p-3 text-xs text-gray-500 leading-relaxed" style="background:rgba(255,255,255,.025)">
          <strong class="text-gray-400">Як читати:</strong> <strong>BMR</strong> — калорії у стані спокою.
          <strong>TDEE</strong> — з урахуванням активності. <strong>Ціль</strong> — скоригована норма для ${GOALS[goal]?.label.toLowerCase()}.
        </div>
      </div>`;
      lucide.createIcons({nodes:[document.getElementById('sc-result')]});
    } catch(e) { Toast.show(e.message,'err'); }
  },
};

// ══════════════════════════════════════════════════════════
// VIEW: KNOWLEDGE BASE
// ══════════════════════════════════════════════════════════
Views.Knowledge = {
  _t: 'meals',

  render() {
    document.getElementById('content').innerHTML = `
    <div class="p-4 md:p-6 max-w-3xl mx-auto page-enter">
      <div class="mb-5">
        <h1 class="text-xl font-bold text-white">База знань</h1>
        <p class="text-xs text-gray-500 mt-1">Готові раціони, шпаргалки по продуктах та шаблони повідомлень</p>
      </div>
      <div class="flex gap-1 p-1 rounded-xl mb-5" style="background:rgba(255,255,255,.04)">
        ${[['meals','🍽 Раціони'],['food','🥦 Продукти'],['templates','💬 Шаблони']].map(([t,l])=>`
          <button data-tab="${t}" onclick="Views.Knowledge._tab('${t}')" class="flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${this._t===t?'bg-surf-500 text-white shadow':'text-gray-500 hover:text-gray-300'}">
            ${l}
          </button>`).join('')}
      </div>
      <div id="kb">${this._body()}</div>
    </div>`;
    lucide.createIcons({nodes:[document.getElementById('content')]});
  },

  _tab(t) {
    this._t=t;
    document.querySelectorAll('[data-tab]').forEach(el=>{
      const on=el.dataset.tab===t;
      el.className=`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${on?'bg-surf-500 text-white shadow':'text-gray-500 hover:text-gray-300'}`;
    });
    const kb=document.getElementById('kb');
    if(kb){ kb.innerHTML=this._body(); lucide.createIcons({nodes:[kb]}); }
  },

  _body() {
    const k=DB.getKnowledge();
    if(this._t==='meals')     return this._meals(k.mealPlans||[]);
    if(this._t==='food')      return this._food(k.foodGuide||{});
    return this._templates(k.templates||[]);
  },

  _meals(plans) {
    return plans.map(p=>`
      <div class="card card-hover mb-4">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div>
            <div class="font-semibold text-white text-sm">${Utils.esc(p.title)}</div>
            <div class="text-xs text-gray-500 mt-0.5">${Utils.esc(p.desc)}</div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-lg font-bold text-gold-400">${p.calories}</div>
            <div class="text-[10px] text-gray-600">ккал</div>
          </div>
        </div>
        <div class="flex gap-4 mb-3 text-xs">
          <span style="color:#60A5FA" class="font-semibold">Б: ${p.protein}г</span>
          <span style="color:#FBB040" class="font-semibold">Ж: ${p.fat}г</span>
          <span style="color:#34D399" class="font-semibold">В: ${p.carbs}г</span>
        </div>
        <div class="space-y-2 pt-2 border-t border-white/5">
          ${p.meals.map(m=>`<div class="flex items-start gap-2.5 text-sm">
            <span class="text-gray-500 text-xs font-medium flex-shrink-0 w-32 pt-0.5">${Utils.esc(m.time)}</span>
            <span class="text-gray-300">${Utils.esc(m.foods)}</span>
          </div>`).join('')}
        </div>
      </div>`).join('');
  },

  _food(g) {
    return [
      {key:'proteins',label:'Джерела білка',    color:'#60A5FA',icon:'beef'},
      {key:'carbs',   label:'Складні вуглеводи', color:'#34D399',icon:'wheat'},
      {key:'fats',    label:'Корисні жири',      color:'#FBB040',icon:'droplets'},
    ].map(s=>`
      <div class="card card-hover mb-4">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:${s.color}18">
            <i data-lucide="${s.icon}" class="w-3.5 h-3.5" style="color:${s.color}"></i>
          </div>
          <div class="font-semibold text-white text-sm">${s.label}</div>
        </div>
        <div class="flex flex-wrap gap-2">
          ${(g[s.key]||[]).map(item=>`<span class="px-2.5 py-1 rounded-lg text-xs font-medium" style="background:${s.color}12;color:${s.color}">${Utils.esc(item)}</span>`).join('')}
        </div>
      </div>`).join('');
  },

  _templates(tmpl) {
    return tmpl.map(t=>`
      <div class="card card-hover mb-3">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="font-semibold text-white text-sm">${Utils.esc(t.title)}</div>
          <button onclick="Views.Knowledge._copy(${JSON.stringify(t.text)})" class="btn btn-sm btn-ghost flex-shrink-0">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>Копіювати
          </button>
        </div>
        <div class="text-sm text-gray-400 leading-relaxed">${Utils.esc(t.text)}</div>
      </div>`).join('');
  },

  _copy(text) {
    navigator.clipboard.writeText(text)
      .then(()=>Toast.show('Скопійовано в буфер обміну!'))
      .catch(()=>Toast.show('Не вдалося скопіювати','err'));
  },
};

// ══════════════════════════════════════════════════════════
Views.Calendar = {
  _mode:'day',
  _date: Utils.today(),

  render(date) {
    if (date) this._date = date;
    const today = Utils.today();
    this._date = this._date || today;
    const events = DB.getSchedules().sort((a,b)=>a.date.localeCompare(b.date) || (a.time||'').localeCompare(b.time||''));
    const todayEvents = events.filter(e=> e.date === today);
    const lastSessionAlert = events.some(e=> {
      const c = DB.getClient(e.clientId);
      return c && c.remainingSessions === 1;
    });

    const monthLabel = new Date(this._date).toLocaleDateString('uk-UA',{month:'long',year:'numeric'});

    document.getElementById('content').innerHTML = `
    <div class="p-3 md:p-4 w-full max-w-none page-enter space-y-4">

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-white">Календар тренувань</h1>
          <div class="text-xs text-gray-500 mt-1">Перегляд: ${this._mode==='day'?'День':this._mode==='week'?'Тиждень':'Місяць'} · ${this._mode==='month'?monthLabel:Utils.fmtDate(this._date)}</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <button onclick="Views.Calendar._prev()" class="btn btn-sm btn-ghost"><i data-lucide="chevrons-left" class="w-3.5 h-3.5"></i></button>
            <button onclick="Views.Calendar._next()" class="btn btn-sm btn-ghost"><i data-lucide="chevrons-right" class="w-3.5 h-3.5"></i></button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="Views.Calendar._setMode('day')" class="btn btn-sm ${this._mode==='day'?'btn-gold':'btn-ghost'}">День</button>
            <button onclick="Views.Calendar._setMode('week')" class="btn btn-sm ${this._mode==='week'?'btn-gold':'btn-ghost'}">Тиждень</button>
            <button onclick="Views.Calendar._setMode('month')" class="btn btn-sm ${this._mode==='month'?'btn-gold':'btn-ghost'}">Місяць</button>
            <button onclick="Views.Calendar._openAddModal('${this._date}')" class="btn btn-gold btn-sm">+ Запис</button>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-[1fr_300px] gap-2">
        <div class="space-y-4">
          ${this._mode==='day' ? this._dayView(DB.getSchedulesForDay(this._date)) : this._mode==='week' ? this._weekView() : this._monthView()}
        </div>
        <div class="card p-4 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs text-gray-500">Всього тренувань</div>
              <div class="text-2xl font-bold text-white">${events.length}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-500">Сьогодні</div>
              <div class="text-xl font-semibold text-white">${todayEvents.length}</div>
            </div>
          </div>
          ${lastSessionAlert?`<div class="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-amber-100 text-sm">Є клієнти з останніми заняттями. Слід попередити або поповнити пакет.</div>`:''}
          <div>
            <div class="text-xs text-gray-500 mb-2">Поточні броні (ті, у кого останнє заняття)</div>
              <div id="mini-bookings" class="space-y-3">${(DB.getSchedulesForDay(this._date) || []).filter(e=>{
                const c = DB.getClient(e.clientId); return c && c.remainingSessions===1;
              }).map(e=>{
                const c = DB.getClient(e.clientId);
                return `<div class="calendar-event-card warn">
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                                <div class="text-xs font-semibold text-white">${Utils.esc(c?.name||'Клієнт')}</div>
                                <div class="text-xs text-gray-400">${Utils.fmtDate(e.date)} · <span class="whitespace-nowrap">${this._formatInterval(e)}</span></div>
                    </div>
                    <span class="text-xs text-amber-200">Потрібна оплата</span>
                  </div>
                </div>`;
              }).join('') || `<div class="text-sm text-gray-500">Немає нагальних броней на цю дату.</div>`}</div>
          </div>
        </div>
      </div>
    </div>`;

    lucide.createIcons({nodes:[document.getElementById('content')]});
    // attach drag/drop and interactive handlers
    this._attachDnD();
  },

  _setMode(mode) {
    this._mode = mode;
    this.render();
  },

  _formatInterval(ev) {
    const start = ev.time || ev.startTime || '00:00';
    const end = ev.endTime || this._defaultEnd(start);
    return `${start} - ${end}`;
  },

  _defaultEnd(start) {
    if (!/^\d{2}:\d{2}$/.test(start)) return '00:00';
    const [h,m] = start.split(':').map(Number);
    const dt = new Date(); dt.setHours(h); dt.setMinutes(m + 60);
    return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
  },

  _toMinutes(time) {
    if (!time || !/^\d{2}:\d{2}$/.test(time)) return 0;
    const [h,m] = time.split(':').map(Number);
    return h * 60 + m;
  },

  _findScheduleConflicts(events) {
    const intervals = (events || []).map(e => {
      const start = this._toMinutes(e.time || e.startTime || '00:00');
      const end = this._toMinutes(e.endTime || this._defaultEnd(e.time || e.startTime || '00:00'));
      return {id: e.id, start, end};
    }).filter(i => i.start < i.end).sort((a,b) => a.start - b.start);

    const conflictIds = new Set();
    for (let i = 0; i < intervals.length; i++) {
      for (let j = i + 1; j < intervals.length; j++) {
        if (intervals[j].start >= intervals[i].end) break;
        const overlap = Math.min(intervals[i].end, intervals[j].end) - Math.max(intervals[i].start, intervals[j].start);
        if (overlap > 5) {
          conflictIds.add(intervals[i].id);
          conflictIds.add(intervals[j].id);
        }
      }
    }
    return conflictIds;
  },

  _weekView() {
    const d = new Date(this._date);
    const dayIndex = (d.getDay() + 6) % 7;
    const weekStart = this._addDays(this._date, -dayIndex);
    const days = Array.from({length:7},(_,i)=>{
      const iso = this._addDays(weekStart, i);
      const events = DB.getSchedulesForDay(iso);
      const conflictIds = this._findScheduleConflicts(events);
      const hasLast = events.some(e=>{
        const c = DB.getClient(e.clientId);
        return c && c.remainingSessions === 1;
      });
      return {iso, label:new Date(iso).toLocaleDateString('uk-UA',{weekday:'short',day:'numeric'}), events, count:events.length, warn:hasLast, conflicts:conflictIds};
    });
    return `<div class="overflow-x-auto pb-1 -mx-1"><div class="week-grid grid gap-2 mb-4 grid-cols-7 min-w-[700px]">
      ${days.map(day=>`<div class="calendar-day ${day.iso===this._date?'selected':''} ${day.warn?'warn':''}">
        <div class="flex items-center justify-between gap-2 mb-2 cursor-pointer" onclick="Views.Calendar._selectDate('${day.iso}')">
          <div class="text-sm font-semibold text-white">${day.label}</div>
          <div class="text-xs text-gray-400">${day.count}</div>
        </div>
        <div class="space-y-3 text-[11px] text-gray-300">
          ${day.events.map(e=>{
            const c = DB.getClient(e.clientId);
            const conflict = day.conflicts.has(e.id);
            return `<div class="calendar-event-card draggable-schedule ${conflict?'warn':''}" draggable="true" data-sid="${e.id}" onclick="Views.Calendar._openEventModal('${e.id}')">
              <div class="event-time text-xs font-semibold mb-1 whitespace-nowrap">${this._formatInterval(e)}</div>
              <div class="event-name text-xs font-semibold text-white mb-2">${Utils.esc(c?.name||'Клієнт')}</div>
              <div class="event-count text-center block mt-1 text-xs text-gray-400">${c?.remainingSessions??0} ${((c?.remainingSessions??0)===1)?'заняття':'занять'}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`).join('')}
    </div></div>`;
  },

  _prev() {
    if (this._mode==='month') this._date = this._addMonths(this._date, -1);
    else if (this._mode==='week')  this._date = this._addDays(this._date, -7);
    else this._date = this._addDays(this._date, -1);
    this.render();
  },

  _next() {
    if (this._mode==='month') this._date = this._addMonths(this._date, +1);
    else if (this._mode==='week')  this._date = this._addDays(this._date, +7);
    else this._date = this._addDays(this._date, +1);
    this.render();
  },

  _monthView() {
    // Strict month view: 1..lastDay of selected month only
    const d = new Date(this._date);
    const year = d.getFullYear(); const month = d.getMonth();
    const first = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0).getDate();
    const startWeekday = (first.getDay()+6)%7; // make Monday=0
    const cells = [];
    for (let i=0;i<startWeekday;i++) cells.push({empty:true});
    for (let day=1; day<=lastDay; day++) {
      const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const count = DB.getSchedulesForDay(iso).length;
      cells.push({iso, day, count});
    }
    // pad to complete weeks
    while (cells.length % 7 !== 0) cells.push({empty:true});

    return `<div class="calendar-grid-month mb-4">
      ${cells.map(c=> c.empty?`<div class="calendar-day lead"></div>`:`<div onclick="Views.Calendar._selectDate('${c.iso}')" class="calendar-day ${c.iso===this._date?'selected':''}">
        <div class="text-sm font-semibold text-white">${c.day}</div>
        <div class="calendar-dot ${c.count?'':'hidden'}"></div>
        <div class="text-[11px] text-gray-400 mt-2">${c.count} занять</div>
      </div>`).join('')}
    </div>`;
  },

  _dayView(events) {
    const conflictIds = this._findScheduleConflicts(events);
    // timeline 07:00..22:00
    const slots = [];
    for (let h=7; h<=22; h++) {
      const hh = String(h).padStart(2,'0')+':00';
      const evs = (events||[]).filter(e=>e.time && e.time.startsWith(String(h).padStart(2,'0')));
      slots.push({time:hh, events:evs});
    }

    return `<div class="card p-3">
      ${slots.map(s=>`<div class="calendar-timeline-slot" data-time="${s.time}">
        <div class="calendar-hour">${s.time}</div>
        <div class="calendar-slot" data-date="${this._date}" data-time="${s.time}">
          ${s.events.length? s.events.map(e=>{
            const c = DB.getClient(e.clientId);
            const isLast = c && c.remainingSessions===1;
            const conflict = conflictIds.has(e.id);
            return `<div class="calendar-event-card draggable-schedule ${conflict?'warn':''}" draggable="true" data-sid="${e.id}" onclick="Views.Calendar._openEventModal('${e.id}')">
              <div class="event-time text-xs font-semibold mb-1 whitespace-nowrap"><button onclick="event.stopPropagation(); Views.Calendar._openEventModal('${e.id}')" class="text-xs font-semibold underline decoration-dotted whitespace-nowrap ${conflict?'text-amber-100':''}">${this._formatInterval(e)}</button></div>
              <div class="event-name text-sm font-semibold text-white mb-1">${Utils.esc(c?.name||'Клієнт')}</div>
              <div class="flex items-center justify-between text-[11px] ${conflict?'text-amber-100':'text-gray-400'}">
                <span>${c?.status==='pause'?'Пауза':'Активний'}</span>
                <span>${c?.remainingSessions??0} занять</span>
              </div>
            </div>`;
          }).join('') : `<div class="flex items-center justify-between w-full text-gray-500"><div>Вільно</div><button onclick="event.stopPropagation(); Views.Calendar._openAddModal('${this._date}','${s.time}')" class="btn btn-sm btn-ghost">+ Запис</button></div>`}
        </div>
      </div>`).join('')}
    </div>`;
  },

  _openAddModal(defaultDate, defaultTime) {
    const date = defaultDate || this._date || Utils.today();
    const startTime = defaultTime || '18:00';
    const endTime = this._defaultEnd(startTime);
    const clients = DB.getClients();
    Modal.open(`<div class="p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="font-bold text-white">Новий запис на тренування</div>
        <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="ft-label">Клієнт</label>
          <div class="flex items-center gap-2">
            <input id="sc-client-search" class="ft-input flex-1 h-12" type="text" placeholder="Пошук клієнта...">
            <input id="sc-client" type="hidden" value="">
            <button id="sc-add-btn" class="btn btn-sm btn-gold h-12 px-3" type="button">+</button>
          </div>
          <div id="sc-client-list" class="mt-2 bg-white/5 rounded-lg max-h-52 overflow-auto hidden"></div>
          <div id="sc-new-client-form" class="mt-3 p-3 rounded-lg bg-white/3 hidden">
            <div class="text-sm font-semibold text-white mb-2">Швидке створення клієнта</div>
            <input id="sc-new-name" class="ft-input mb-2 h-12" placeholder="ПІБ клієнта">
            <input id="sc-new-phone" class="ft-input mb-2 h-12" placeholder="Телефон">
            <div class="flex gap-2">
              <button id="sc-new-cancel" class="btn btn-ghost flex-1 h-12">Скасувати</button>
              <button id="sc-new-save" class="btn btn-gold flex-1 h-12">Створити</button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Дата</label><input id="sc-date" class="ft-input h-12" type="date" value="${date}"></div>
          <div><label class="ft-label">Статус</label><select id="sc-status" class="ft-input h-12"><option value="scheduled">Заплановано</option><option value="done">Завершено</option></select></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="ft-label">Початок</label><input id="sc-start" class="ft-input h-12" type="time" value="${startTime}"></div>
          <div><label class="ft-label">Кінець</label><input id="sc-end" class="ft-input h-12" type="time" value="${endTime}"></div>
        </div>
        <div><label class="ft-label">Нотатки</label><textarea id="sc-notes" class="ft-input" rows="3" placeholder="Особливості, побажання..."></textarea></div>
      </div>
      <script>
        (function(){
          const search = document.getElementById('sc-client-search');
          const hidden = document.getElementById('sc-client');
          const list = document.getElementById('sc-client-list');
          const addBtn = document.getElementById('sc-add-btn');
          const newForm = document.getElementById('sc-new-client-form');
          const newName = document.getElementById('sc-new-name');
          const newPhone = document.getElementById('sc-new-phone');
          const newSave = document.getElementById('sc-new-save');
          const newCancel = document.getElementById('sc-new-cancel');

          function renderMatches(q){
            const clients = DB.getClients();
            const ql = (q||'').toLowerCase();
            const matches = clients.filter(c=>c.name.toLowerCase().includes(ql) || (c.phone||'').includes(ql)).slice(0,20);
            if(!matches.length){ list.classList.add('hidden'); list.innerHTML = '' ; return; }
            list.classList.remove('hidden');
            list.innerHTML = matches.map(function(c){
              var n = Utils.esc(c.name);
              return '<div class="px-3 py-2 cursor-pointer hover:bg-white/5" data-id="'+c.id+'" data-name="'+n+'">'+n+' <span class="text-xs text-gray-400">('+((c.remainingSessions||0))+' занять)</span></div>';
            }).join('');
            list.querySelectorAll('div[data-id]').forEach(el=>el.addEventListener('click', ()=>{
              hidden.value = el.dataset.id;
              search.value = el.dataset.name;
              list.classList.add('hidden');
            }));
          }

          search.addEventListener('input', (e)=>{ renderMatches(e.target.value); hidden.value = ''; });
          search.addEventListener('focus', ()=>{ renderMatches(search.value); });
          document.addEventListener('click', (e)=>{ if(!e.target.closest('#sc-client-list') && !e.target.closest('#sc-client-search') && !e.target.closest('#sc-add-btn')) list.classList.add('hidden'); });

          addBtn.addEventListener('click', ()=>{ newForm.classList.toggle('hidden'); newName.focus(); });
          newCancel.addEventListener('click', ()=>{ newForm.classList.add('hidden'); });
          newSave.addEventListener('click', ()=>{
            const name = (newName.value||'').trim();
            const phone = (newPhone.value||'').trim();
            if(!name){ Toast.show('Введіть ПІБ клієнта','err'); return; }
            const id = DB.uid();
            const start = Utils.today();
            const client = { id, name, phone, email:'', gender:'male', age:30, height:170, currentWeight:70, targetWeight:70, goal:'', activityLevel:1.2, startDate:start, status:'active', remainingSessions:0, package:'', notes:'', weightHistory:[{date:start,weight:70}] };
            DB.saveClient(client);
            // update UI without closing modal
            hidden.value = id; search.value = name; newForm.classList.add('hidden');
            renderMatches('');
            Toast.show('Клієнта додано');
          });
        })();
      </script>
      <div class="flex gap-2 mt-4">
        <button onclick="Modal.close()" class="btn btn-ghost flex-1">Скасувати</button>
        <button onclick="Views.Calendar._saveSchedule()" class="btn btn-gold flex-1">Зберегти запис</button>
      </div>
    </div>`);
    lucide.createIcons({nodes:[document.getElementById('modal-box')]});
  },

  _saveSchedule() {
    try {
      const hiddenClientId = document.getElementById('sc-client').value;
      const searchNameRaw = (document.getElementById('sc-client-search') && document.getElementById('sc-client-search').value) || '';
      const searchName = searchNameRaw.trim();
      const date = document.getElementById('sc-date').value;
      const start = document.getElementById('sc-start').value;
      const end = document.getElementById('sc-end').value;
      const status = document.getElementById('sc-status').value;
      const notes = document.getElementById('sc-notes').value.trim();
      if (!date) throw new Error('Виберіть дату');
      if (!start) throw new Error('Введіть початок');
      if (!end) throw new Error('Введіть кінець');
      if (start >= end) throw new Error('Час завершення має бути пізніше початку');

      let clientId = hiddenClientId || '';

      // If user typed a name but didn't pick from list, try to find existing by name (trimmed, case-insensitive)
      if (!clientId && searchName) {
        const existing = DB.getClients().find(c=> (c.name||'').trim().toLowerCase() === searchName.toLowerCase());
        if (existing) {
          clientId = existing.id;
        } else {
          // Auto-create minimal client profile
          const id = DB.uid();
          const today = Utils.today();
          const newClient = {
            id,
            name: searchName,
            phone: '',
            email: '',
            gender: 'male',
            age: 0,
            height: 0,
            currentWeight: 0,
            targetWeight: 0,
            goal: '',
            activityLevel: 1,
            startDate: today,
            status: 'active',
            remainingSessions: 0,
            package: '',
            notes: '',
            weightHistory: [],
          };
          DB.saveClient(newClient);
          clientId = id;
          // reflect created client in hidden field
          const hid = document.getElementById('sc-client'); if (hid) hid.value = id;
          Toast.show('Клієнта автоматично створено');
        }
      }

      if (!clientId) throw new Error('Оберіть клієнта');

      const client = DB.getClient(clientId);
      if (!client) throw new Error('Оберіть клієнта');
      if (typeof client.remainingSessions !== 'number' || client.remainingSessions <= 0) {
        Toast.show('У клієнта немає оплачених занять — запис створено, але зверніть увагу.','info');
      }

      DB.saveSchedule({
        clientId,
        date,
        time:start,
        endTime:end,
        status:status || 'scheduled',
        notes,
      });
      Modal.close();
      this.render(date);
      Toast.show('Запис додано');
    } catch(e) {
      Toast.show(e.message,'err');
    }
  },

  _selectDate(date) {
    this._date = date;
    this._mode = 'day';
    this.render();
  },

  _complete(id) {
    DB.completeSchedule(id);
    this.render();
    Toast.show('Тренування завершено');
  },

  _delete(id) {
    Modal.open(`<div class="p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="font-bold text-white">Підтвердьте видалення</div>
        <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="text-sm text-gray-300 mb-5">Видалити запис тренування?</div>
      <div class="flex gap-2">
        <button onclick="Modal.close()" class="btn btn-ghost flex-1">Скасувати</button>
        <button onclick="Views.Calendar._deleteConfirmed('${id}')" class="btn btn-danger flex-1">Видалити</button>
      </div>
    </div>`);
  },

  _deleteConfirmed(id) {
    DB.deleteSchedule(id);
    Modal.close();
    this.render();
    Toast.show('Запис видалено');
  },

  _addDays(base, offset) {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0,10);
  },

  _addMonths(base, offset) {
    const d = new Date(base);
    d.setMonth(d.getMonth() + offset);
    return d.toISOString().slice(0,10);
  },

  _attachDnD() {
    // draggable items
    document.querySelectorAll('.draggable-schedule').forEach(el=>{
      el.addEventListener('dragstart', (ev)=>{
        ev.dataTransfer.setData('text/schedule', el.dataset.sid);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', ()=>{ el.classList.remove('dragging'); });
      // touch fallback
      el.addEventListener('touchstart', (ev)=>{ window._ft_drag = el.dataset.sid; }, {passive:true});
    });

    // drop targets
    document.querySelectorAll('.calendar-slot').forEach(slot=>{
      slot.addEventListener('dragover', (e)=>{ e.preventDefault(); slot.classList.add('drop-over'); });
      slot.addEventListener('dragleave', ()=>{ slot.classList.remove('drop-over'); });
      slot.addEventListener('drop', (e)=>{
        e.preventDefault(); slot.classList.remove('drop-over');
        const sid = e.dataTransfer.getData('text/schedule');
        if (!sid) return;
        const targetDate = slot.dataset.date;
        const targetTime = slot.dataset.time;
        this._moveSchedule(sid, targetDate, targetTime);
      });
      // touchend detection
      slot.addEventListener('touchend', (ev)=>{
        if (window._ft_drag) {
          const sid = window._ft_drag; delete window._ft_drag;
          const targetDate = slot.dataset.date; const targetTime = slot.dataset.time;
          this._moveSchedule(sid, targetDate, targetTime);
        }
      });
    });
  },

  _moveSchedule(sid, date, time) {
    const ev = DB.getSchedule(sid);
    if (!ev) return;
    ev.date = date; ev.time = time;
    DB.saveSchedule(ev);
    Toast.show('Час тренування оновлено');
    this.render(this._date);
  },

  _openEventModal(sid) {
    const ev = DB.getSchedule(sid); if (!ev) return;
    const c = DB.getClient(ev.clientId);
    Modal.open(`<div class="p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="font-bold text-white">Деталі запису</div>
        <button onclick="Modal.close()" class="btn btn-icon btn-ghost"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="space-y-3">
        <div class="flex items-center gap-3">${Utils.avatar(c.name,52)}
          <div>
            <div class="font-semibold text-white">${Utils.esc(c.name)}</div>
            <div class="text-xs text-gray-400">${GOALS[c.goal]?.label||'—'} · ${c.currentWeight} кг</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="text-sm text-gray-300">${ev.date}</div>
          <div class="grid grid-cols-2 gap-3" style="min-width:220px">
            <div><label class="ft-label">Початок</label><input id="ev-start-input" class="ft-input" type="time" value="${ev.time || ev.startTime || '18:00'}" /></div>
            <div><label class="ft-label">Кінець</label><input id="ev-end-input" class="ft-input" type="time" value="${ev.endTime || this._defaultEnd(ev.time || ev.startTime || '18:00')}" /></div>
          </div>
          <button onclick="Views.Calendar._saveTimeInline('${sid}')" class="btn btn-sm btn-gold">Зберегти час</button>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-xs text-gray-400">Залишок занять</div>
          <div class="text-sm font-semibold text-white">${c.remainingSessions??0}</div>
          <div class="flex gap-2 ml-4">
            <button onclick="Views.Calendar._changeSessions('${c.id}',1)" class="btn btn-sm btn-ghost">+</button>
            <button onclick="Views.Calendar._changeSessions('${c.id}',-1)" class="btn btn-sm btn-danger">-</button>
          </div>
        </div>
        ${ev.notes?`<div class="card" style="background:rgba(255,255,255,.02)"><div class="text-sm text-gray-300">${Utils.esc(ev.notes)}</div></div>`:''}
      </div>
      <div class="flex gap-2 mt-4">
        <button onclick="Modal.close()" class="btn btn-ghost flex-1">Закрити</button>
        <button onclick="Views.Calendar._complete('${sid}')" class="btn btn-gold flex-1">Відзначити як готове</button>
      </div>
    </div>`);
    lucide.createIcons({nodes:[document.getElementById('modal-box')]});
  },

  _changeSessions(cid, delta) {
    const c = DB.getClient(cid); if (!c) return;
    c.remainingSessions = Math.max(0, (c.remainingSessions||0) + delta);
    DB.saveClient(c);
    Toast.show('Залишок занять оновлено');
    // refresh modal and views
    Modal.close(); this.render(this._date);
  },

  _inlineEditTime(sid, btnEl) {
    const ev = DB.getSchedule(sid); if (!ev) return;
    const start = document.createElement('input');
    const end = document.createElement('input');
    start.type = 'time'; start.value = ev.time || '18:00';
    end.type = 'time'; end.value = ev.endTime || this._defaultEnd(ev.time || '18:00');
    start.className = end.className = 'ft-input';
    start.style.maxWidth = end.style.maxWidth = '120px';
    const save = ()=>{
      const startVal = start.value;
      const endVal = end.value;
      if (!startVal || !endVal || startVal >= endVal) return;
      ev.time = startVal;
      ev.endTime = endVal;
      DB.saveSchedule(ev);
      Toast.show('Час оновлено');
      this.render(this._date);
    };
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-2';
    wrapper.appendChild(start);
    wrapper.appendChild(end);
    btnEl.replaceWith(wrapper);
    const finish = (e)=>{ if (e.key==='Enter') save(); if (e.key==='Escape') this.render(this._date); };
    start.addEventListener('keydown', finish);
    end.addEventListener('keydown', finish);
    start.addEventListener('blur', save);
    end.addEventListener('blur', save);
    start.focus();
  },

  _saveTimeInline(sid) {
    const startEl = document.getElementById('ev-start-input');
    const endEl = document.getElementById('ev-end-input');
    if (!startEl || !endEl) return;
    const start = startEl.value;
    const end = endEl.value;
    if (!start || !end) { Toast.show('Вкажіть початок і кінець','err'); return; }
    if (start >= end) { Toast.show('Час завершення має бути пізніше початку','err'); return; }
    const ev = DB.getSchedule(sid); if (!ev) return;
    ev.time = start;
    ev.endTime = end;
    DB.saveSchedule(ev);
    Modal.close(); this.render(this._date); Toast.show('Час оновлено');
  },
};
// EXPORT / PRINT REPORT
// ══════════════════════════════════════════════════════════
const Export = {
  print(cid) {
    const c = DB.getClient(cid); if (!c) return;
    const r  = Calc.run({gender:c.gender,weight:c.currentWeight,height:c.height,age:c.age,activityLevel:c.activityLevel,goal:c.goal});
    const d  = Utils.delta(c.weightHistory);
    const tK = r.macros.protein*4+r.macros.fat*9+r.macros.carbs*4;
    const rows = [...(c.weightHistory||[])].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10);
    const wrap = document.getElementById('print-wrap');

    wrap.innerHTML = `<div class="print-report">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #eee">
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#aaa;margin-bottom:6px">Звіт клієнта · FitTrack</div>
          <h1 style="font-size:26px;font-weight:800;margin:0 0 4px;color:#111">${Utils.esc(c.name)}</h1>
          <div style="font-size:13px;color:#666">${GOALS[c.goal]?.label||'—'} · З ${Utils.fmtDate(c.startDate)} · Звіт: ${new Date().toLocaleDateString('uk-UA')}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:30px;font-weight:800;color:#D4A017">${c.currentWeight} кг</div>
          <div style="font-size:11px;color:#aaa">поточна вага</div>
        </div>
      </div>

      <div class="pr-section">
        <h2>Загальні показники</h2>
        <div class="pr-grid">
          <div class="pr-stat"><div class="val">${c.currentWeight}</div><div class="lbl">Поточна вага, кг</div></div>
          <div class="pr-stat"><div class="val">${c.targetWeight}</div><div class="lbl">Ціль, кг</div></div>
          <div class="pr-stat"><div class="val" style="color:${d!==null&&d<0?'#10B981':'#F43F5E'}">${d!==null?(d>0?'+':'')+d:'—'}</div><div class="lbl">Зміна ваги, кг</div></div>
          <div class="pr-stat"><div class="val">${Math.abs(c.targetWeight-c.currentWeight).toFixed(1)}</div><div class="lbl">До цілі, кг</div></div>
        </div>
      </div>

      <div class="pr-section">
        <h2>Калорійність</h2>
        <div class="pr-grid">
          <div class="pr-stat"><div class="val">${r.bmr}</div><div class="lbl">BMR, ккал</div></div>
          <div class="pr-stat"><div class="val">${r.tdee}</div><div class="lbl">TDEE, ккал</div></div>
          <div class="pr-stat"><div class="val" style="color:#D4A017">${r.kcal}</div><div class="lbl">Норма/день, ккал</div></div>
          <div class="pr-stat"><div class="val">${r.bmi} <span style="font-size:11px;color:#888">(${r.bmiLabel})</span></div><div class="lbl">ІМТ</div></div>
        </div>
      </div>

      <div class="pr-section">
        <h2>Макронутрієнти на день</h2>
        <div class="pr-grid">
          <div class="pr-stat"><div class="val" style="color:#60A5FA">${r.macros.protein}</div><div class="lbl">Білки, г</div></div>
          <div class="pr-stat"><div class="val" style="color:#F59E0B">${r.macros.fat}</div><div class="lbl">Жири, г</div></div>
          <div class="pr-stat"><div class="val" style="color:#34D399">${r.macros.carbs}</div><div class="lbl">Вуглеводи, г</div></div>
          <div class="pr-stat"><div class="val">${tK}</div><div class="lbl">Разом, ккал</div></div>
        </div>
      </div>

      ${rows.length?`<div class="pr-section">
        <h2>Журнал зважувань (останні ${rows.length})</h2>
        <table class="pr-table">
          <thead><tr><th>Дата</th><th>Вага, кг</th><th>Зміна</th></tr></thead>
          <tbody>${rows.map((e,i)=>{
            const prev=rows[i+1];
            const diff=prev?(e.weight-prev.weight).toFixed(1):null;
            return `<tr>
              <td>${Utils.fmtDate(e.date)}</td>
              <td style="font-weight:700">${e.weight}</td>
              <td style="color:${diff===null?'#888':parseFloat(diff)<0?'#10B981':'#F43F5E'}">${diff!==null?(parseFloat(diff)>0?'+':'')+diff:' —'}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>`:''}

      ${c.notes?`<div class="pr-section"><h2>Нотатки тренера</h2><p style="font-size:13px;color:#444;line-height:1.6">${Utils.esc(c.notes)}</p></div>`:''}

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#bbb;text-align:center">
        Звіт сформовано ${new Date().toLocaleDateString('uk-UA',{day:'numeric',month:'long',year:'numeric'})} · FitTrack — Кабінет персонального тренера
      </div>
    </div>`;

    wrap.classList.remove('hidden');
    setTimeout(()=>{ window.print(); setTimeout(()=>wrap.classList.add('hidden'),800); }, 150);
  },
};

// ══════════════════════════════════════════════════════════
// APP INIT
// ══════════════════════════════════════════════════════════
const App = {
  init() {
    DB.load();
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    this._theme(DB.getTheme());
    this._bindTheme();
    document.getElementById('back-btn')?.addEventListener('click',()=>Router.go('clients'));
    Router.init();
  },

  _theme(t) {
    document.documentElement.classList.toggle('dark',  t==='dark');
    document.documentElement.classList.toggle('light', t!=='dark');
    const icon  = t==='dark' ? 'moon' : 'sun';
    const label = t==='dark' ? 'Темна тема' : 'Світла тема';
    ['theme-icon','theme-icon-mobile'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){ el.setAttribute('data-lucide',icon); lucide.createIcons({nodes:[el.parentElement]}); }
    });
    const lbl=document.getElementById('theme-label');
    if(lbl) lbl.textContent=label;
  },

  _bindTheme() {
    const go=()=>{ const n=DB.getTheme()==='dark'?'light':'dark'; DB.setTheme(n); this._theme(n); };
    document.getElementById('theme-toggle')?.addEventListener('click',go);
    document.getElementById('theme-toggle-mobile')?.addEventListener('click',go);
  },
};

document.addEventListener('DOMContentLoaded',()=>App.init());