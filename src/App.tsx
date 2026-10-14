/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface TimelineItem {
  era: string;
  name: string;
  text: string;
  today: string;
}

interface TowerLayer {
  n: string;
  d: string;
  c: string;
  y: number;
  h: number;
  w: number;
  lt: boolean;
}

interface LanternItem {
  id: number;
  name: string;
  wish: string;
  left: number;
  top: number;
  delay?: number;
}

const TITLES = [
  "Bosh sahifa",
  "Ustoz kim?",
  "Tarixda ustoz izi",
  "Bunyodkor",
  "Har bir kasb",
  "Zanjir taʼsiri",
  "Fazilatlar",
  "Raqamli davr",
  "Tashakkur osmoni",
  "Xulosa"
];

const T2 = [
  {
    t: "Bilim beradi",
    h: "Poydevor",
    p: "Ustoz alifbodan murakkab formulagacha yoʻl ochadi. Bilim — har bir kasb va har bir kashfiyotning poydevori."
  },
  {
    t: "Tarbiya beradi",
    h: "Devor",
    p: "Odob, halollik va mehnatsevarlik darslikda yozilmaydi. Shogird ularni ustozning har kungi xulqidan oʻrganadi."
  },
  {
    t: "Ishonch beradi",
    h: "Tom",
    p: "“Sen eplaysan” degan bir jumla insonning butun yoʻlini oʻzgartirishi mumkin. Ustoz aynan shu jumlani aytadigan odam."
  }
];

const TL: TimelineItem[] = [
  {
    era: "IX asr",
    name: "Muhammad al-Xorazmiy",
    text: "Xorazmda tugʻilgan buyuk olim algebra fanining asoschilaridan biri hisoblanadi. Asarlari lotin tiliga tarjima qilinib, Yevropa olimlariga ham ustoz boʻlgan.",
    today: "“Algoritm” atamasi uning nomidan kelib chiqqan. Bugungi dasturlash ham shundan boshlanadi."
  },
  {
    era: "X–XI asrlar",
    name: "Beruniy va Ibn Sino",
    text: "Beruniy astronomiya, geografiya va tarix sohalarida, Ibn Sino esa tibbiyotda ulkan meros qoldirdi. Ibn Sinoning “Tib qonunlari” asari asrlar davomida tibbiy darslik boʻlgan.",
    today: "Ilm-fanga sadoqat va tinimsiz izlanish — bugungi har bir oʻqituvchining yoʻli."
  },
  {
    era: "XV asr",
    name: "Mirzo Ulugʻbek",
    text: "Samarqandda madrasa va mashhur rasadxona qurdirgan, oʻzi ham talabalarga dars bergan hukmdor-olim. Uning yulduzlar jadvali jahon astronomiyasiga katta hissa boʻldi.",
    today: "Bilimni qadrlagan davlat birinchi navbatda ilm maskanlarini quradi."
  },
  {
    era: "XV asr",
    name: "Alisher Navoiy",
    text: "Shoir va davlat arbobi. Oʻz ustozlarini ehtirom bilan eslagan, ilm-fan va maʼrifat ahlining homiysi boʻlgan.",
    today: "Ustozga hurmat — xalqimiz maʼnaviyatining qadimiy ildizi."
  },
  {
    era: "XX asr boshi",
    name: "Jadidlar: Behbudiy, Avloniy, Munavvarqori",
    text: "Yangi usuldagi maktablar ochib, savodxonlik va zamonaviy fanlarni xalq orasiga olib kirdilar. Avloniyning “Turkiy guliston yoxud axloq” asari tarbiya darsligi boʻlgan.",
    today: "Maʼrifat — millatni uygʻotadigan eng kuchli vosita."
  },
  {
    era: "Bugun",
    name: "Sizning ustozingiz",
    text: "Maktabda, litseyda, oliygohda, mahallada, ustaxonada — har kuni minglab ustozlar yangi avlodni voyaga yetkazmoqda.",
    today: "Ularning mehnati — kelajak Oʻzbekistonining asosiy qurilishi."
  }
];

const TOWER_LAYERS: TowerLayer[] = [
  { n: "Bilim", d: "Poydevor. Fan asoslarini bilmagan kishi kelajakni qura olmaydi — ustoz birinchi gʻishtni qoʻyadi.", c: "#F6F3EA", y: 370, h: 60, w: 260, lt: false },
  { n: "Tarbiya", d: "Devor. Odob va halollik binoni boqiy qiladi. Bu gʻishtlar ustozning har kungi xulqidan terilgan.", c: "#9BE3DD", y: 312, h: 56, w: 232, lt: false },
  { n: "Vatanparvarlik", d: "Vatanni sevish ustoz nutqida emas, uning kundalik ishida, adolatida va mehnatida koʻrinadi.", c: "#E0546F", y: 258, h: 52, w: 204, lt: true },
  { n: "Mehnatsevarlik", d: "Shogird ustozning tinimsiz mehnatiga qarab oʻrganadi: oʻzi koʻrgan narsani oʻziga qonun qiladi.", c: "#1B4FA8", y: 208, h: 48, w: 176, lt: true },
  { n: "Ijodkorlik", d: "Yangi gʻoya va kashfiyot ustozdan olingan ishonchdan boshlanadi: “yoʻq” emas, “urinib koʻraylik”.", c: "#FFB38A", y: 164, h: 42, w: 148, lt: false }
];

const JOBS: [string, string][] = [
  ["Shifokor", "Inson tanasini oʻrganishdan oldin harfni, sonni va “nega?” deb soʻrashni unga ustozi oʻrgatgan."],
  ["Muhandis", "Koʻprik va binolarni hisoblashdan oldin birinchi chizma va birinchi tenglamani unga ustozi tushuntirgan."],
  ["Dasturchi", "Kod yozishdan oldin mantiqiy fikrlashni — oddiy matematik masalada — unga ustozi oʻrgatgan."],
  ["Quruvchi", "Gʻisht qatorini toʻgʻri terish aniqlik va sabr talab qiladi. Buni birinchi navbatda usta-ustozlar oʻrgatadi."],
  ["Dehqon", "Yerni tushunish, suv va urugʻ ilmi — ustoz va ota-bobolardan meros boʻlib kelgan bilimdir."],
  ["Harbiy", "Vatan himoyasi bilimdan, intizomdan va mardlikdan boshlanadi. Bu fazilatlarni ham ustoz yoʻnaltiradi."],
  ["Sportchi", "Chempion ortida doim murabbiy turadi: texnikani ham, gʻalaba va magʻlubiyatga munosabatni ham u oʻrgatadi."],
  ["Rassom", "Ranglar va shakllarni koʻra bilish ham oʻrgatiladi. Birinchi chizilgan egri chiziqni ustoz toʻgʻrilaydi."]
];

const D8 = [
  {
    t: "Texnologiya beradi",
    i: [
      "Maʼlumotni bir zumda topib beradi",
      "Istalgan vaqtda, istalgan joyda mashq qildiradi",
      "Darsni koʻrgazmali qiladi: video, model, simulyatsiya"
    ]
  },
  {
    t: "Ustoz beradi",
    i: [
      "Qaysi yoʻldan borishni koʻrsatadi",
      "“Sen eplaysan” deb ishonch uygʻotadi",
      "Halollik va mehr-oqibatni oʻz hayoti bilan oʻrgatadi"
    ]
  },
  {
    t: "Birgalikda",
    i: [
      "Ustoz yoʻnalish beradi, texnologiya tezlik beradi",
      "Har bir oʻquvchiga mos topshiriq tayyorlash osonlashadi",
      "Ustozning vaqti yozuv-chizuvdan insonga qaytadi"
    ]
  }
];

export default function App() {
  const [cur, setCur] = useState(0);
  const totalPages = TITLES.length;

  // Page 2 State
  const [tab2Index, setTab2Index] = useState(0);

  // Page 3 State
  const [tlIndex, setTlIndex] = useState(0);

  // Page 4 State: Tower layers
  const [towerState, setTowerState] = useState<boolean[]>([false, false, false, false, false]);
  const [towerText, setTowerText] = useState("Quyidagi gʻishtlardan birini bosing.");

  // Page 5 State: Professions
  const [jobIndex, setJobIndex] = useState(0);

  // Page 6 State: Ripple
  const [years, setYears] = useState(30);
  const [students, setStudents] = useState(25);
  const [animatedTotal, setAnimatedTotal] = useState(750);
  const rafRef = useRef<number | null>(null);

  // Page 8 State: Digital age
  const [d8Index, setD8Index] = useState(0);

  // Page 9 State: Lanterns & Sky
  const [lanterns, setLanterns] = useState<LanternItem[]>([
    { id: 1, name: "Barcha ustozlarga", wish: "Sizlar tufayli bilimli boʻldik", left: 24, top: 40, delay: 0 },
    { id: 2, name: "Birinchi muallimga", wish: "Ilk harfni sizdan oʻrgandim", left: 68, top: 75, delay: 0.5 }
  ]);
  const [lName, setLName] = useState("");
  const [lWish, setLWish] = useState("");
  const [lErr, setLErr] = useState("");
  const nextLanternId = useRef(3);
  const skyRef = useRef<HTMLDivElement>(null);

  // Starry sky static background stars
  const stars = useRef(
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: (0.25 + Math.random() * 0.6).toFixed(2)
    }))
  ).current;

  // Hero page SVG bricks
  const heroBricks = useRef(
    Array.from({ length: 8 }, (_, r) => {
      const y = 444 - r * 18;
      const off = r % 2 ? -20 : 0;
      const cols = ['#F0B93A', '#22B8B0', '#F6F3EA', '#E0546F'];
      return Array.from({ length: 7 }, (_, c) => ({
        x: 96 + off + c * 41,
        y,
        fill: cols[(r + c) % 4],
        delay: (1.9 + r * 0.28 + c * 0.05).toFixed(2)
      }));
    }).flat()
  ).current;

  const goTo = (i: number) => {
    const nextIdx = Math.max(0, Math.min(totalPages - 1, i));
    setCur(nextIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goTo(cur + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goTo(cur - 1);
      } else if (e.key === 'Home') {
        goTo(0);
      } else if (e.key === 'End') {
        goTo(totalPages - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cur, totalPages]);

  // Touch and wheel handling
  const touchStartRef = useRef<{ x: number; y: number; skip: boolean }>({ x: 0, y: 0, skip: false });
  const wheelLockRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const target = e.target as HTMLElement;
    touchStartRef.current = {
      x: t.clientX,
      y: t.clientY,
      skip: !!target.closest('input, .tl-wrap, .sky-box')
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current.skip) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      goTo(cur + (dx < 0 ? 1 : -1));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLockRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, .tl-wrap')) return;

    const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const d = horiz ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 40) return;

    goTo(cur + (d > 0 ? 1 : -1));
    wheelLockRef.current = true;
    setTimeout(() => {
      wheelLockRef.current = false;
    }, 900);
  };

  // Tower toggle layer
  const toggleTowerLayer = (idx: number) => {
    const nextState = [...towerState];
    nextState[idx] = !nextState[idx];
    setTowerState(nextState);

    const layer = TOWER_LAYERS[idx];
    const cnt = nextState.filter(Boolean).length;
    const all = cnt === 5;

    if (all) {
      setTowerText("Gumbaz yopildi! Bilim, tarbiya, vatanparvarlik, mehnat va ijod birlashganda — mustahkam inson, mustahkam Vatan quriladi.");
    } else if (nextState[idx]) {
      setTowerText(layer.d);
    } else {
      setTowerText(`${layer.n} gʻishti olib tashlandi. Bino endi nomukammal: har bir gʻisht kerak.`);
    }
  };

  // Animated total student count
  useEffect(() => {
    const target = years * students;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = animatedTotal;
    const to = target;
    const startTime = performance.now();
    const duration = 450;

    const step = (now: number) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const val = Math.round(from + (to - from) * elapsed);
      setAnimatedTotal(val);
      if (elapsed < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [years, students]);

  // Lantern form submission
  const handleLanternSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = lName.trim();
    const trimmedWish = lWish.trim();

    if (!trimmedName) {
      setLErr("Ustoz ismini yozing, shunda fonus unga atab yoqiladi.");
      return;
    }
    setLErr("");

    const h = skyRef.current ? skyRef.current.clientHeight : 320;
    const randomLeft = Math.round(8 + Math.random() * 80);
    const randomTop = Math.round(8 + Math.random() * Math.max(10, h - 150));

    const newLantern: LanternItem = {
      id: nextLanternId.current++,
      name: trimmedName,
      wish: trimmedWish || "Rahmat sizga, ustoz!",
      left: randomLeft,
      top: randomTop,
      delay: 0
    };

    setLanterns(prev => {
      const updated = [...prev, newLantern];
      if (updated.length > 24) {
        return updated.slice(updated.length - 24);
      }
      return updated;
    });

    setLName("");
    setLWish("");
  };

  const isAllTowerDone = towerState.every(Boolean);

  return (
    <div
      className="app"
      id="app"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Chrome Top Bar */}
      <header className="top">
        <div className="brand">
          <svg viewBox="-20 -20 40 40" width="28" height="28" aria-hidden="true">
            <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="#F0B93A" strokeWidth="2.2" />
            <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="#22B8B0" strokeWidth="2.2" transform="rotate(45)" />
          </svg>
          <span>Ustoz — bunyodkor</span>
        </div>
        <div className="ptitle" id="pageTitle" aria-live="polite">
          {TITLES[cur]}
        </div>
        <div className="ctrl">
          <span className="counter" id="counter">
            {cur + 1} / {totalPages}
          </span>
          <button
            className="nav-btn"
            id="prev"
            aria-label="Oldingi sahifa"
            disabled={cur === 0}
            onClick={() => goTo(cur - 1)}
          >
            ‹
          </button>
          <button
            className="nav-btn"
            id="next"
            aria-label="Keyingi sahifa"
            disabled={cur === totalPages - 1}
            onClick={() => goTo(cur + 1)}
          >
            ›
          </button>
        </div>
      </header>

      {/* Rail Nav */}
      <nav className="rail" id="rail" aria-label="Sahifalar">
        {TITLES.map((title, i) => {
          const isDone = i < cur;
          const isNow = i === cur;
          return (
            <button
              key={i}
              className={`brick ${isDone ? 'done' : ''} ${isNow ? 'now' : ''}`}
              title={`${i + 1}. ${title}`}
              aria-label={`${i + 1}-sahifa: ${title}`}
              aria-current={isNow ? 'page' : undefined}
              onClick={() => goTo(i)}
            />
          );
        })}
      </nav>

      {/* Stage Container with 10 Slides */}
      <main
        className="stage"
        id="stage"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {/* 1. Bosh sahifa */}
        <section
          className="page dark"
          aria-label="Bosh sahifa"
          aria-hidden={cur !== 0 ? 'true' : 'false'}
        >
          <div className="inner hero-grid">
            <div className="hero-copy">
              <h1>Ustoz – Vatan taraqqiyotining buyuk bunyodkori</h1>
              <p className="lead">
                Har bir bino poydevordan boshlanadi. Insonning poydevorini esa ustoz qoʻyadi.
              </p>
              <div className="actions">
                <button className="btn" onClick={() => goTo(1)}>
                  Sayohatni boshlash
                </button>
                <span className="hint">Varaqlash: ← → tugmalari yoki barmoq bilan surish</span>
              </div>
              <p className="muted">Ustozlar va murabbiylar kuniga bagʻishlanadi</p>
            </div>

            <svg
              className="hero-art"
              viewBox="0 0 400 480"
              role="img"
              aria-label="Pishtoq shaklidagi darvoza, ichida sakkiz qirrali yulduz va terilayotgan gʻishtlar"
            >
              <defs>
                <clipPath id="clipB">
                  <rect x="96" y="300" width="208" height="160" />
                </clipPath>
              </defs>
              <path
                className="draw d1"
                pathLength="1"
                d="M60 460V230C60 120 150 70 200 30C250 70 340 120 340 230V460"
                fill="none"
                stroke="#F0B93A"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                className="draw d2"
                pathLength="1"
                d="M90 460V235C90 140 160 100 200 62C240 100 310 140 310 235V460"
                fill="none"
                stroke="#22B8B0"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <g transform="translate(200 232)">
                <g className="star">
                  <rect x="-50" y="-50" width="100" height="100" fill="none" stroke="#F0B93A" strokeWidth="3" />
                  <rect x="-50" y="-50" width="100" height="100" fill="none" stroke="#22B8B0" strokeWidth="3" transform="rotate(45)" />
                  <circle r="10" fill="#E0546F" />
                </g>
              </g>
              <g id="bricks" clipPath="url(#clipB)">
                {heroBricks.map((b, idx) => (
                  <rect
                    key={idx}
                    x={b.x}
                    y={b.y}
                    width={38}
                    height={15}
                    rx={2}
                    className="brk"
                    fill={b.fill}
                    fillOpacity=".88"
                    style={{ animationDelay: `${b.delay}s` }}
                  />
                ))}
              </g>
              <path d="M40 460H360" stroke="#F0B93A" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        {/* 2. Ustoz kim */}
        <section
          className="page light"
          aria-label="Ustoz kim?"
          aria-hidden={cur !== 1 ? 'true' : 'false'}
        >
          <div className="inner">
            <div>
              <h2>Ustoz kim?</h2>
            </div>
            <div className="split">
              <div>
                <p className="lead" style={{ marginBottom: 22 }}>
                  “Ustoz” soʻzi fors tilidagi “ustod” soʻzidan olingan boʻlib, usta, mohir bilimdon degan maʼnoni bildiradi. Ustoz faqat dars beruvchi emas, u yoʻl koʻrsatuvchi insondir.
                </p>
                <div className="tablist" role="tablist" aria-label="Ustoz nima beradi" id="tabs2">
                  {T2.map((item, idx) => {
                    const isSelected = tab2Index === idx;
                    return (
                      <button
                        key={idx}
                        className="tab"
                        role="tab"
                        id={`tab2-${idx}`}
                        aria-selected={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => setTab2Index(idx)}
                        onKeyDown={e => {
                          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                            e.preventDefault();
                            e.stopPropagation();
                            const next = (idx + (e.key === 'ArrowDown' ? 1 : T2.length - 1)) % T2.length;
                            setTab2Index(next);
                            const nextBtn = document.getElementById(`tab2-${next}`);
                            nextBtn?.focus();
                          }
                        }}
                      >
                        {item.t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="arch" id="panel2" role="tabpanel" aria-live="polite">
                <svg className="mini" viewBox="-30 -30 60 60" width="56" height="56" aria-hidden="true">
                  <rect x="-16" y="-16" width="32" height="32" fill="none" stroke="#F0B93A" strokeWidth="2.5" />
                  <rect x="-16" y="-16" width="32" height="32" fill="none" stroke="#22B8B0" strokeWidth="2.5" transform="rotate(45)" />
                </svg>
                <h3 id="p2h">{T2[tab2Index].h}</h3>
                <p id="p2p">{T2[tab2Index].p}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Tarix */}
        <section
          className="page dark"
          aria-label="Tarixdagi ustozlar"
          aria-hidden={cur !== 2 ? 'true' : 'false'}
        >
          <div className="inner">
            <div>
              <h2>Tarixda ustoz izi</h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Asrlar davomida yurtimiz ilm-fan va maʼrifat markazi boʻlgan. Davrlarni tanlab, ustozlar qoldirgan merosni koʻring.
              </p>
            </div>
            <div className="tl-wrap">
              <ul className="tl" id="tl">
                {TL.map((item, idx) => {
                  const isSelected = tlIndex === idx;
                  return (
                    <li key={idx}>
                      <button
                        aria-selected={isSelected}
                        onClick={() => setTlIndex(idx)}
                      >
                        <span className="dot"></span>
                        <span className="era">{item.era}</span>
                        <span className="who">{item.name.split(':')[0]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="tcard" id="tcard" aria-live="polite">
              <div>
                <h3 id="tName">{TL[tlIndex].name}</h3>
                <p id="tText">{TL[tlIndex].text}</p>
              </div>
              <div className="today">
                <strong>Bugun uchun saboq</strong>
                <p id="tToday">{TL[tlIndex].today}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Bunyodkor */}
        <section
          className="page teal"
          aria-label="Bunyodkor"
          aria-hidden={cur !== 3 ? 'true' : 'false'}
        >
          <div className="inner build">
            <div>
              <h2>Ustoz — bunyodkor</h2>
              <p className="lead" style={{ margin: '12px 0 18px' }}>
                Bunyodkor bino emas, inson quradi. Besh asosiy gʻishtni bosib, shogirdning shaxsini bosqichma-bosqich quring.
              </p>
              <div className="bricks-ui" id="bricksUi">
                {TOWER_LAYERS.map((layer, idx) => {
                  const isOn = towerState[idx];
                  return (
                    <button
                      key={idx}
                      className="bb"
                      aria-pressed={isOn}
                      onClick={() => toggleTowerLayer(idx)}
                    >
                      <span
                        className="sw"
                        style={{ background: isOn ? layer.c : 'transparent' }}
                      />
                      <b>{layer.n}</b>
                    </button>
                  );
                })}
              </div>
              <p className="btext" id="btext" aria-live="polite">
                {towerText}
              </p>
            </div>

            <svg
              className="tower"
              id="tower"
              viewBox="0 0 320 440"
              role="img"
              aria-label="Besh qavatli minora: bilim, tarbiya, vatanparvarlik, mehnatsevarlik, ijodkorlik"
            >
              <defs>
                <pattern id="bk" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0 0H40M0 10H40M20 0V10M0 10V20M40 10V20" stroke="rgba(10,29,69,.28)" strokeWidth="1.5" fill="none" />
                </pattern>
              </defs>

              {TOWER_LAYERS.map((l, idx) => {
                const isOn = towerState[idx];
                const x = 160 - l.w / 2;
                return (
                  <g key={idx} className={`lay ${l.lt ? 'lt' : ''} ${isOn ? 'on' : ''}`}>
                    <rect
                      className="shape"
                      x={x}
                      y={l.y}
                      width={l.w}
                      height={l.h}
                      rx={3}
                      style={{ fill: isOn ? l.c : 'none' }}
                    />
                    <rect
                      className="joints"
                      x={x}
                      y={l.y}
                      width={l.w}
                      height={l.h}
                      rx={3}
                      fill="url(#bk)"
                    />
                    <text x={160} y={l.y + l.h / 2 + 6}>
                      {l.n}
                    </text>
                  </g>
                );
              })}

              <g className={`roof ${isAllTowerDone ? 'on' : ''}`}>
                <path className="shape" d="M86 164C86 124 132 104 160 70C188 104 234 124 234 164Z" />
                <path className="fin" d="M160 70V46" />
                <circle className="fin" cx={160} cy={40} r={7} />
              </g>
            </svg>
          </div>
        </section>

        {/* 5. Kasblar */}
        <section
          className="page light"
          aria-label="Har bir kasb"
          aria-hidden={cur !== 4 ? 'true' : 'false'}
        >
          <div className="inner">
            <div>
              <h2>Har bir kasbning ustozi bor</h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Kasbni tanlang va uning ortida kim turganini koʻring.
              </p>
            </div>
            <div className="chips" id="chips" role="group" aria-label="Kasblar">
              {JOBS.map((j, idx) => {
                const isSelected = jobIndex === idx;
                return (
                  <button
                    key={idx}
                    className="chip"
                    aria-pressed={isSelected}
                    onClick={() => setJobIndex(idx)}
                  >
                    {j[0]}
                  </button>
                );
              })}
            </div>
            <div className="jobcard" id="job" aria-live="polite">
              <h3 id="jobH">{JOBS[jobIndex][0]}ning ustozi bor</h3>
              <p id="jobP">{JOBS[jobIndex][1]}</p>
            </div>
            <p className="closing">
              Har bir kasb egasining gʻalabasi ortida ustozning mehnati bor.
            </p>
          </div>
        </section>

        {/* 6. Zanjir */}
        <section
          className="page dark"
          aria-label="Zanjir taʼsiri"
          aria-hidden={cur !== 5 ? 'true' : 'false'}
        >
          <div className="inner split">
            <div>
              <h2>Bir ustoz — minglab taqdir</h2>
              <p className="lead" style={{ margin: '12px 0 18px' }}>
                Ustozlik yillari va sinfdagi oʻquvchilar sonini oʻzgartiring. Bir inson umri davomida nechta shogirdga bilim berishini hisoblang.
              </p>
              <div className="ctl">
                <label htmlFor="yrs">
                  Ustozlik yillari <output id="yrsV">{years} yil</output>
                </label>
                <input
                  type="range"
                  id="yrs"
                  min="1"
                  max="40"
                  value={years}
                  onChange={e => setYears(+e.target.value)}
                />
              </div>
              <div className="ctl">
                <label htmlFor="std">
                  Sinfdagi oʻquvchilar <output id="stdV">{students} nafar</output>
                </label>
                <input
                  type="range"
                  id="std"
                  min="10"
                  max="40"
                  value={students}
                  onChange={e => setStudents(+e.target.value)}
                />
              </div>
              <div className="total">
                <span className="num" id="total">
                  {animatedTotal.toLocaleString('uz')}
                </span>
                <span className="lbl">shogird</span>
              </div>
              <p className="legend">
                Hisob oddiy: yillar × sinfdagi oʻquvchilar soni. Har bir shogird olgan bilimini oilasiga, jamoasiga va mahallasiga yetkazadi.
              </p>
            </div>

            <div>
              <div className="dots" id="dots" aria-hidden="true">
                <i className="t" />
                {Array.from({ length: years * students }, (_, k) => (
                  <i key={k} />
                ))}
              </div>
              <p className="legend">
                Sariq nuqta — ustoz, firuza nuqtalar — uning shogirdlari.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Fazilatlar */}
        <section
          className="page light"
          aria-label="Fazilatlar"
          aria-hidden={cur !== 6 ? 'true' : 'false'}
        >
          <div className="inner">
            <div>
              <h2>Ustozni ustoz qiladigan fazilatlar</h2>
            </div>
            <div className="arches">
              <article className="vc">
                <h3>Sabr</h3>
                <p>Bir mavzuni uchinchi marta tushuntirganda ham ovozni koʻtarmaslik.</p>
              </article>
              <article className="vc">
                <h3>Adolat</h3>
                <p>Aʼlochi oʻquvchini ham, qiynalayotganini ham bir xil diqqat bilan eshitish.</p>
              </article>
              <article className="vc">
                <h3>Ilhom</h3>
                <p>Fanni yoqtirmagan bolaga bir kun “qiziq ekan” dedira olish.</p>
              </article>
              <article className="vc">
                <h3>Fidoyilik</h3>
                <p>Qoʻngʻiroqdan keyin ham, dam olish kunida ham shogirdning savoliga javob topish.</p>
              </article>
            </div>
          </div>
        </section>

        {/* 8. Raqamli davr */}
        <section
          className="page dark"
          aria-label="Raqamli davr"
          aria-hidden={cur !== 7 ? 'true' : 'false'}
        >
          <div className="inner">
            <div>
              <h2>Texnologiya kuchli, ammo ustoz oʻrnini bosmaydi</h2>
            </div>
            <div className="seg" role="tablist" aria-label="Taqqoslash" id="seg8">
              {D8.map((item, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={d8Index === idx}
                  onClick={() => setD8Index(idx)}
                >
                  {item.t}
                </button>
              ))}
            </div>
            <ul className="plist" id="plist8" aria-live="polite">
              {D8[d8Index].i.map((txt, idx) => (
                <li key={idx}>{txt}</li>
              ))}
            </ul>
            <p className="ptag">
              Eng yaxshi natija ikkalasi birga ishlaganda chiqadi: ustoz texnologiyadan foydalanadi, texnologiya esa ustozga insonga vaqt ajratish imkonini beradi.
            </p>
          </div>
        </section>

        {/* 9. Tashakkur */}
        <section
          className="page sky"
          aria-label="Tashakkur osmoni"
          aria-hidden={cur !== 8 ? 'true' : 'false'}
        >
          <div className="inner">
            <div>
              <h2>Tashakkur osmoni</h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Ustozingiz ismini yozing va unga atab osmonga fonus yoqing.
              </p>
            </div>

            <div className="sky-box" id="sky" ref={skyRef}>
              {stars.map(s => (
                <span
                  key={s.id}
                  className="sp"
                  style={{
                    left: `${s.left}%`,
                    top: `${s.top}%`,
                    opacity: s.opacity
                  }}
                />
              ))}

              {lanterns.map(l => (
                <div
                  key={l.id}
                  className="lantern"
                  style={{
                    left: `${l.left}%`,
                    top: `${l.top}px`,
                    animationDelay: l.delay ? `${l.delay}s, ${l.delay + 2.6}s` : undefined
                  }}
                >
                  <div className="glow" />
                  <b>{l.name}</b>
                  <span>{l.wish}</span>
                </div>
              ))}
            </div>

            <form className="lform" id="lform" autoComplete="off" noValidate onSubmit={handleLanternSubmit}>
              <label className="fld">
                Ustoz ismi
                <input
                  id="lname"
                  maxLength={30}
                  placeholder="Masalan, Dilfuza opa"
                  value={lName}
                  onChange={e => setLName(e.target.value)}
                />
              </label>
              <label className="fld">
                Tashakkur soʻzi
                <input
                  id="lwish"
                  maxLength={80}
                  placeholder="Siz bergan bilim uchun rahmat"
                  value={lWish}
                  onChange={e => setLWish(e.target.value)}
                />
              </label>
              <button className="btn" type="submit">
                Fonus yoqish
              </button>
            </form>
            <p className="err" id="lerr" role="alert">
              {lErr}
            </p>
          </div>
        </section>

        {/* 10. Xulosa */}
        <section
          className="page dark"
          aria-label="Xulosa"
          aria-hidden={cur !== 9 ? 'true' : 'false'}
        >
          <div className="inner split">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <p className="proverb">Ustoz — otangdek ulugʻ.</p>
              <p className="lead">
                Xulosa qilib aytganda, ustoz bilim, tarbiya va ishonchni bir joyga jamlab, Vatan kelajagini qurayotgan insondir. Ustozni qadrlagan xalqning kelajagi mustahkam boʻladi.
              </p>
              <div className="actions">
                <button className="btn" onClick={() => goTo(8)}>
                  Fonus yoqish
                </button>
                <button className="btn ghost" onClick={() => goTo(0)}>
                  Boshiga qaytish
                </button>
              </div>
              <p className="muted">Ustozlar va murabbiylar kuni har yili 1 oktyabrda nishonlanadi.</p>
            </div>
            <div className="facts">
              <div>
                <strong>Bilim beradi</strong>
                Har bir kasb va kashfiyotning poydevorini qoʻyadi.
              </div>
              <div>
                <strong>Tarbiya beradi</strong>
                Odob, halollik va mehnatsevarlikni oʻz hayoti bilan oʻrgatadi.
              </div>
              <div>
                <strong>Ishonch beradi</strong>
                “Sen eplaysan” deydi va shogirdning yoʻlini oʻzgartiradi.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
