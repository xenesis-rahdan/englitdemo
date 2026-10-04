/* ===== TUTORS =====
   img = the normal artwork (required).
   yay = shown on the result screen when the player passes, same as the "good" line (optional).
   nay = shown on the result screen when the player needs to retry, same as the "retry" line (optional).
   If yay/nay is not set, or the file is missing, the normal img is used instead.
   Put the PNGs in the "assets" folder. The first tutor listed is the default. */
const TUTORS = {
  angelo: {
    name: "Angelo",
    img: "assets/angelo.png",
    yay: "assets/angelo-yay.png",
    nay: "assets/angelo-nay.png",
  },
  serena: {
    name: "Serena",
    img: "assets/serena.png",
    yay: "assets/serena-yay.png",
    nay: "assets/serena-nay.png",
  },
};

/* ===== APP STATE ===== */
const $ = document.getElementById("app"),
  done = {};
let st = {};

/* ===== TUTOR HELPERS ===== */
// The tutor the user picked (Angelo if none picked yet)
function tid() {
  return st.tutor || "angelo";
}
function me() {
  return TUTORS[tid()];
}

// Turns a dialogue line into text for the current tutor, filling in {name} with the nickname.
// "line" can be a plain string or { angelo: "...", serena: "..." }
function say(line) {
  const text = typeof line === "string" ? line : line[tid()];
  return text.replace(/\{name\}/g, st.nick || "friend");
}
// A general line from LINES in content.js, e.g. L("right")
function L(key) {
  return say(LINES[tid()][key]);
}

// Tutor art. who = "angelo" / "serena" (leave empty for the chosen tutor),
// mood = "yay" / "nay" (leave empty for the normal artwork)
function tutor(who, mood) {
  const t = who ? TUTORS[who] : me();
  return `<img class="cg" src="${t[mood] || t.img}" data-fallback="${t.img}" alt="${t.name}" onerror="tutorMissing(this)">`;
}

// Runs when an image file is not found: try the normal artwork first, then show a placeholder box
function tutorMissing(img) {
  const fallback = img.dataset.fallback;
  if (fallback && !img.src.endsWith(fallback)) {
    img.src = fallback;
    return;
  }
  const box = document.createElement("div");
  box.className = "cg-missing";
  box.textContent = img.alt + " art goes here";
  img.replaceWith(box);
}

/* ===== QUIZ HELPERS ===== */
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
// Every question from every chapter of the current course (for the Course Quiz)
const courseQs = () => C[st.c].m.flatMap((x) => x.q);
const freshQuiz = (qs, extra) => ({ qs, qi: 0, sc: 0, streak: 0, ok: 0, ...extra });

/* ===== SCREEN ROUTER ===== */
function go(s, o) {
  st = { ...st, ...o, s };
  clearInterval(st.tm);
  render();
}
function render() {
  try {
    ({ title, choose, mats, study, quiz, result })[st.s || "title"]();
  } catch (e) {
    console.error(e);
    $.innerHTML = `<p style="padding:24px;font-family:sans-serif">Something went wrong: ${e.message}<br>Check that content.js is in the same folder as index.html and is loaded before script.js.</p>`;
  }
}

/* ===== SCREEN 1: TITLE / WELCOME + NICKNAME ===== */
function title() {
  $.innerHTML = `<div class="title"><h1>EngLIT!!!</h1><p class="sub">Every chapter is a lesson.</p><h3 class="step">What should we call you?</h3><input class="nick" id="nick" maxlength="16" placeholder="Type your nickname" value="${st.nick || ""}" autocomplete="off"><p class="hint" id="hint"></p><button class="btn" id="go">▶ Start</button></div>`;
  const input = document.getElementById("nick");
  const start = () => {
    const nick = input.value.replace(/[<>&"']/g, "").trim();
    if (!nick) {
      document.getElementById("hint").textContent = "Please type a nickname first.";
      input.focus();
      return;
    }
    go("choose", { nick });
  };
  document.getElementById("go").onclick = start;
  input.onkeydown = (e) => {
    if (e.key === "Enter") start();
  };
}

/* ===== SCREEN 2: TUTOR + COURSE SELECT ===== */
function choose() {
  const cur = tid();
  $.innerHTML = `<div class="title"><h2>Welcome, ${st.nick}!</h2><h3 class="step">1. Choose your tutor</h3><div class="tutors">${Object.entries(TUTORS).map(([id, t]) => `<button class="tcard ${id === cur ? "sel" : ""}" data-t="${id}"><div class="pic">${tutor(id)}</div><b>${t.name}</b><small>${id === cur ? "✓ Your tutor" : "Tap to choose"}</small></button>`).join("")}</div><h3 class="step">2. Choose your course</h3><div class="grid">${C.map((c, i) => `<button class="card" data-i="${i}"><span class="em">${c.e}</span><b>${c.n}</b><small>${c.d}</small><br><small>${c.m.filter((_, j) => done[c.id + j]).length}/${c.m.length} chapters cleared</small></button>`).join("")}</div><div class="dlg"><span class="nm">${me().name}</span>${L("pick")}</div><div class="nav"><button class="btn ghost" id="b">← Back</button></div></div>`;
  document.getElementById("b").onclick = () => go("title");
  $.querySelectorAll(".tcard").forEach((b) => (b.onclick = () => go("choose", { tutor: b.dataset.t })));
  $.querySelectorAll(".card").forEach((b) => (b.onclick = () => go("mats", { c: +b.dataset.i })));
}

/* ===== SCREEN 3: MATERIAL SELECT (chapters + Course Quiz) ===== */
function mats() {
  const c = C[st.c],
    all = courseQs();
  $.innerHTML = `<div class="bar"><h2>${c.e} ${c.n}</h2><button class="btn ghost" id="b">← Back</button></div><div class="grid">${c.m.map((m, j) => `<button class="card" data-j="${j}"><span class="tag">Chapter ${j + 1}</span><b>${m.t}</b><small>${m.s.length} slides · ${m.q.length} quiz questions</small><br><small>${done[c.id + j] ? "⭐ Best: " + done[c.id + j] + " pts" : "Not yet played"}</small></button>`).join("")}<button class="card final" id="final"><span class="tag">Course Quiz</span><b>All chapters mixed</b><small>${all.length} questions from every chapter</small><br><small>${done[c.id + "all"] ? "⭐ Best: " + done[c.id + "all"] + " pts" : "Not yet played"}</small></button></div><div class="dlg"><span class="nm">${me().name}</span>${L("mats")}</div>`;
  document.getElementById("b").onclick = () => go("choose");
  $.querySelectorAll(".card[data-j]").forEach(
    (b) => (b.onclick = () => go("study", { m: +b.dataset.j, i: 0 })),
  );
  document.getElementById("final").onclick = () =>
    go("quiz", freshQuiz(shuffle(all), { m: "all" }));
}

/* ===== SCREEN 4: STUDY SLIDES ===== */
let ty;
function study() {
  const m = C[st.c].m[st.m],
    s = m.s[st.i],
    last = st.i === m.s.length - 1;
  $.innerHTML = `<div class="bar"><span class="tag">${m.t}</span><button class="btn ghost" id="b">← Chapters</button></div><div class="study"><div class="slide"><h2>${s[0]}</h2><ul>${s[1].map((x) => `<li>${x.replace(/</g, "&lt;")}</li>`).join("")}</ul><span class="n">${st.i + 1} / ${m.s.length}</span></div><div class="cgw">${tutor()}</div></div><div class="dlg" id="d"><span class="nm">${me().name}</span><span id="tx"></span></div><div class="nav"><button class="btn ghost" id="p" ${st.i ? "" : "disabled"}>◀ Back</button>${last ? '<button class="btn alt" id="q">Start Quiz ⚡</button>' : '<button class="btn" id="n">Next ▶</button>'}</div>`;
  document.getElementById("b").onclick = () => go("mats");
  const p = document.getElementById("p"),
    n = document.getElementById("n"),
    q = document.getElementById("q");
  p.onclick = () => go("study", { i: st.i - 1 });
  if (n) n.onclick = () => go("study", { i: st.i + 1 });
  if (q) q.onclick = () => go("quiz", freshQuiz(m.q));
  const tx = document.getElementById("tx"),
    line = say(s[2]);
  let k = 0;
  clearInterval(ty);
  ty = setInterval(() => {
    tx.textContent = line.slice(0, ++k);
    if (k >= line.length) clearInterval(ty);
  }, 22);
  document.getElementById("d").onclick = () => {
    clearInterval(ty);
    tx.textContent = line;
  };
}

/* ===== SCREEN 5: QUIZ ===== */
function quiz() {
  const q = st.qs[st.qi],
    sh = ["▲", "◆", "●", "■"];
  st.t = 15;
  st.lock = false;
  $.innerHTML = `<div class="qtop"><span>Q ${st.qi + 1}/${st.qs.length}</span><span id="sc">⭐ ${st.sc}${st.streak > 1 ? " 🔥x" + st.streak : ""}</span></div><div class="timer"><i id="tb"></i></div><div class="qbox">${q[0]}</div><div class="ans">${q[1].map((a, i) => `<button class="a" data-i="${i}"><span>${sh[i]}</span>${a.replace(/</g, "&lt;")}</button>`).join("")}</div><div class="mini" style="margin-top:12px"><div id="tm" style="width:90px">${tutor()}</div><div class="dlg" style="flex:1;margin:0;min-height:60px" id="fb"><span class="nm">${me().name}</span>${L("think")}</div></div>`;
  const pick = (i) => {
    if (st.lock) return;
    st.lock = true;
    clearInterval(st.tm);
    const right = i === q[2];
    $.querySelectorAll(".a").forEach((b, j) => {
      if (j === q[2]) b.classList.add("ok");
      else b.classList.add("dim");
    });
    if (right) {
      st.streak++;
      st.ok++;
      st.sc += 100 + Math.round(st.t * 10) + (st.streak > 1 ? st.streak * 20 : 0);
    } else st.streak = 0;
    document.getElementById("fb").innerHTML =
      `<span class="nm">${me().name}</span>${right ? L("right") : i < 0 ? L("timeout") : L("wrong")}`;
    document.getElementById("sc").textContent =
      "⭐ " + st.sc + (st.streak > 1 ? " 🔥x" + st.streak : "");
    setTimeout(() => {
      st.qi++;
      st.qi >= st.qs.length ? go("result") : quiz();
    }, 1700);
  };
  $.querySelectorAll(".a").forEach((b) => (b.onclick = () => pick(+b.dataset.i)));
  st.tm = setInterval(() => {
    st.t -= 0.1;
    document.getElementById("tb").style.width = (st.t / 15) * 100 + "%";
    if (st.t <= 0) {
      clearInterval(st.tm);
      pick(-1);
    }
  }, 100);
}

/* ===== SCREEN 6: RESULT ===== */
function result() {
  const k = C[st.c].id + st.m,
    tot = st.qs.length,
    all = st.m === "all",
    good = st.ok >= tot - 1, // passed: at most one mistake
    mood = good ? "yay" : "nay";
  done[k] = Math.max(done[k] || 0, st.sc);
  $.innerHTML = `<div class="res"><h2>${all ? "Course Quiz Clear" : "Chapter Clear"}, ${st.nick}!</h2><div class="big">${st.sc} pts</div><p>${st.ok} / ${tot} correct</p><div class="mini"><div style="width:160px">${tutor(null, mood)}</div></div></div><div class="dlg"><span class="nm">${me().name}</span>${good ? L("good") : L("retry")}</div><div class="nav"><button class="btn ghost" id="r">${all ? "↻ Play again" : "↻ Review slides"}</button><button class="btn" id="h">Chapters ▶</button></div>`;
  document.getElementById("r").onclick = () =>
    all ? go("quiz", freshQuiz(shuffle(courseQs()))) : go("study", { i: 0 });
  document.getElementById("h").onclick = () => go("mats");
}

render();