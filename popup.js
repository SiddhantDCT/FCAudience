const API_KEY  = "657f815f1b26a5342fc8a069a6ee8ff1";
const BASE_URL = "https://v3.football.api-sports.io";
const H        = { "x-apisports-key": API_KEY };

const teamInput        = document.getElementById("teamInput");
const suggestEl        = document.getElementById("suggestions");
const favEl            = document.getElementById("favorites");
const liveEl           = document.getElementById("live");
const upcomingEl       = document.getElementById("upcoming");
const otherEl          = document.getElementById("other");
const statusDot        = document.getElementById("statusDot");
const ringFill         = document.getElementById("ringFill");
const ringLabel        = document.getElementById("ringLabel");
const pinnedZone       = document.getElementById("pinnedZone");
const pinnedCard       = document.getElementById("pinnedCard");
const standingsPanel   = document.getElementById("standingsPanel");
const standingsTitle   = document.getElementById("standingsTitle");
const standingsContent = document.getElementById("standingsContent");
const upcomingFilter   = document.getElementById("upcomingLeagueFilter");

document.getElementById("standingsClose").onclick = () => standingsPanel.classList.add("hidden");

function hoursFromNow(h) {
  return new Date(Date.now() + h * 3600000).toISOString();
}

const FALLBACK_LIVE = [
  {
    fixture: { id: 90001, date: new Date().toISOString(), status: { short: "1H", elapsed: 34 } },
    league:  { id: 39,  name: "Premier League",        country: "England", logo: "https://media.api-sports.io/football/leagues/39.png"  },
    teams:   { home: { id: 33,  name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png"  },
               away: { id: 40,  name: "Liverpool",          logo: "https://media.api-sports.io/football/teams/40.png"  } },
    goals:   { home: 1, away: 2 },
    events:  [
      { type: "Goal", team: { id: 40  }, player: { name: "Salah"    }, time: { elapsed: 12 }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 33  }, player: { name: "Rashford" }, time: { elapsed: 27 }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 40  }, player: { name: "Nunez"    }, time: { elapsed: 31 }, detail: "Normal Goal" },
      { type: "Card", team: { id: 33  }, player: { name: "Bruno"    }, time: { elapsed: 22 }, detail: "Yellow Card"  },
    ],
    statistics: [
      { team: { id: 33 }, statistics: [{ type: "Ball Possession", value: "44%" }, { type: "Total Shots", value: 5  }, { type: "Shots on Goal", value: 2 }] },
      { team: { id: 40 }, statistics: [{ type: "Ball Possession", value: "56%" }, { type: "Total Shots", value: 9  }, { type: "Shots on Goal", value: 4 }] },
    ]
  },
  {
    fixture: { id: 90002, date: new Date().toISOString(), status: { short: "2H", elapsed: 67 } },
    league:  { id: 140, name: "La Liga",               country: "Spain",   logo: "https://media.api-sports.io/football/leagues/140.png" },
    teams:   { home: { id: 541, name: "Real Madrid",      logo: "https://media.api-sports.io/football/teams/541.png" },
               away: { id: 529, name: "Barcelona",         logo: "https://media.api-sports.io/football/teams/529.png" } },
    goals:   { home: 2, away: 2 },
    events:  [
      { type: "Goal", team: { id: 541 }, player: { name: "Vinicius Jr"  }, time: { elapsed: 14 }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 529 }, player: { name: "Yamal"        }, time: { elapsed: 38 }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 529 }, player: { name: "Lewandowski"  }, time: { elapsed: 55 }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 541 }, player: { name: "Mbappe"       }, time: { elapsed: 61 }, detail: "Normal Goal" },
      { type: "Card", team: { id: 529 }, player: { name: "Gavi"         }, time: { elapsed: 44 }, detail: "Yellow Card"  },
      { type: "Card", team: { id: 541 }, player: { name: "Rudiger"      }, time: { elapsed: 58 }, detail: "Yellow Card"  },
    ],
    statistics: [
      { team: { id: 541 }, statistics: [{ type: "Ball Possession", value: "48%" }, { type: "Total Shots", value: 11 }, { type: "Shots on Goal", value: 5 }] },
      { team: { id: 529 }, statistics: [{ type: "Ball Possession", value: "52%" }, { type: "Total Shots", value: 13 }, { type: "Shots on Goal", value: 6 }] },
    ]
  },
  {
    fixture: { id: 90003, date: new Date().toISOString(), status: { short: "HT", elapsed: 45 } },
    league:  { id: 135, name: "Serie A",               country: "Italy",   logo: "https://media.api-sports.io/football/leagues/135.png" },
    teams:   { home: { id: 489, name: "AC Milan",        logo: "https://media.api-sports.io/football/teams/489.png" },
               away: { id: 505, name: "Inter Milan",     logo: "https://media.api-sports.io/football/teams/505.png" } },
    goals:   { home: 0, away: 1 },
    events:  [
      { type: "Goal", team: { id: 505 }, player: { name: "Lautaro" }, time: { elapsed: 39 }, detail: "Normal Goal" },
      { type: "Card", team: { id: 489 }, player: { name: "Theo"    }, time: { elapsed: 41 }, detail: "Yellow Card"  },
    ],
    statistics: [
      { team: { id: 489 }, statistics: [{ type: "Ball Possession", value: "51%" }, { type: "Total Shots", value: 6 }, { type: "Shots on Goal", value: 1 }] },
      { team: { id: 505 }, statistics: [{ type: "Ball Possession", value: "49%" }, { type: "Total Shots", value: 7 }, { type: "Shots on Goal", value: 3 }] },
    ]
  },
  {
    fixture: { id: 90004, date: new Date().toISOString(), status: { short: "2H", elapsed: 78 } },
    league:  { id: 78,  name: "Bundesliga",            country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png"  },
    teams:   { home: { id: 157, name: "Bayern Munich",    logo: "https://media.api-sports.io/football/teams/157.png" },
               away: { id: 165, name: "Borussia Dortmund",logo: "https://media.api-sports.io/football/teams/165.png" } },
    goals:   { home: 3, away: 1 },
    events:  [
      { type: "Goal", team: { id: 157 }, player: { name: "Kane"     }, time: { elapsed: 9  }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 157 }, player: { name: "Muller"   }, time: { elapsed: 33 }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 165 }, player: { name: "Guirassy" }, time: { elapsed: 48 }, detail: "Normal Goal" },
      { type: "Goal", team: { id: 157 }, player: { name: "Kane"     }, time: { elapsed: 71 }, detail: "Penalty"     },
      { type: "Card", team: { id: 165 }, player: { name: "Brandt"   }, time: { elapsed: 62 }, detail: "Yellow Card"  },
      { type: "Card", team: { id: 165 }, player: { name: "Nmecha"   }, time: { elapsed: 74 }, detail: "Red Card"     },
    ],
    statistics: [
      { team: { id: 157 }, statistics: [{ type: "Ball Possession", value: "62%" }, { type: "Total Shots", value: 18 }, { type: "Shots on Goal", value: 8 }] },
      { team: { id: 165 }, statistics: [{ type: "Ball Possession", value: "38%" }, { type: "Total Shots", value: 7  }, { type: "Shots on Goal", value: 2 }] },
    ]
  },
  {
    fixture: { id: 90005, date: new Date().toISOString(), status: { short: "1H", elapsed: 22 } },
    league:  { id: 61,  name: "Ligue 1",               country: "France",  logo: "https://media.api-sports.io/football/leagues/61.png"  },
    teams:   { home: { id: 85,  name: "Paris Saint-Germain", logo: "https://media.api-sports.io/football/teams/85.png"  },
               away: { id: 80,  name: "Lyon",                logo: "https://media.api-sports.io/football/teams/80.png"  } },
    goals:   { home: 1, away: 0 },
    events:  [
      { type: "Goal", team: { id: 85 }, player: { name: "Dembele" }, time: { elapsed: 18 }, detail: "Normal Goal" },
    ],
    statistics: [
      { team: { id: 85 }, statistics: [{ type: "Ball Possession", value: "58%" }, { type: "Total Shots", value: 7 }, { type: "Shots on Goal", value: 3 }] },
      { team: { id: 80 }, statistics: [{ type: "Ball Possession", value: "42%" }, { type: "Total Shots", value: 4 }, { type: "Shots on Goal", value: 1 }] },
    ]
  },
];

const FALLBACK_UPCOMING = [
  {
    fixture: { id: 91001, date: hoursFromNow(3),  status: { short: "NS", elapsed: null } },
    league:  { id: 39,  name: "Premier League",        country: "England", logo: "https://media.api-sports.io/football/leagues/39.png"  },
    teams:   { home: { id: 42,  name: "Arsenal",           logo: "https://media.api-sports.io/football/teams/42.png"  },
               away: { id: 50,  name: "Manchester City",   logo: "https://media.api-sports.io/football/teams/50.png"  } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91002, date: hoursFromNow(5),  status: { short: "NS", elapsed: null } },
    league:  { id: 39,  name: "Premier League",        country: "England", logo: "https://media.api-sports.io/football/leagues/39.png"  },
    teams:   { home: { id: 49,  name: "Chelsea",            logo: "https://media.api-sports.io/football/teams/49.png"  },
               away: { id: 51,  name: "Brighton",           logo: "https://media.api-sports.io/football/teams/51.png"  } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91003, date: hoursFromNow(6),  status: { short: "NS", elapsed: null } },
    league:  { id: 39,  name: "Premier League",        country: "England", logo: "https://media.api-sports.io/football/leagues/39.png"  },
    teams:   { home: { id: 40,  name: "Liverpool",          logo: "https://media.api-sports.io/football/teams/40.png"  },
               away: { id: 47,  name: "Tottenham",          logo: "https://media.api-sports.io/football/teams/47.png"  } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91004, date: hoursFromNow(8),  status: { short: "NS", elapsed: null } },
    league:  { id: 140, name: "La Liga",               country: "Spain",   logo: "https://media.api-sports.io/football/leagues/140.png" },
    teams:   { home: { id: 536, name: "Sevilla",            logo: "https://media.api-sports.io/football/teams/536.png" },
               away: { id: 548, name: "Real Sociedad",      logo: "https://media.api-sports.io/football/teams/548.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91005, date: hoursFromNow(10), status: { short: "NS", elapsed: null } },
    league:  { id: 140, name: "La Liga",               country: "Spain",   logo: "https://media.api-sports.io/football/leagues/140.png" },
    teams:   { home: { id: 541, name: "Real Madrid",        logo: "https://media.api-sports.io/football/teams/541.png" },
               away: { id: 543, name: "Real Betis",         logo: "https://media.api-sports.io/football/teams/543.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91006, date: hoursFromNow(24), status: { short: "NS", elapsed: null } },
    league:  { id: 2,   name: "UEFA Champions League", country: "World",   logo: "https://media.api-sports.io/football/leagues/2.png"   },
    teams:   { home: { id: 529, name: "Barcelona",          logo: "https://media.api-sports.io/football/teams/529.png" },
               away: { id: 489, name: "AC Milan",           logo: "https://media.api-sports.io/football/teams/489.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91007, date: hoursFromNow(26), status: { short: "NS", elapsed: null } },
    league:  { id: 2,   name: "UEFA Champions League", country: "World",   logo: "https://media.api-sports.io/football/leagues/2.png"   },
    teams:   { home: { id: 157, name: "Bayern Munich",      logo: "https://media.api-sports.io/football/teams/157.png" },
               away: { id: 541, name: "Real Madrid",        logo: "https://media.api-sports.io/football/teams/541.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91008, date: hoursFromNow(28), status: { short: "NS", elapsed: null } },
    league:  { id: 2,   name: "UEFA Champions League", country: "World",   logo: "https://media.api-sports.io/football/leagues/2.png"   },
    teams:   { home: { id: 505, name: "Inter Milan",        logo: "https://media.api-sports.io/football/teams/505.png" },
               away: { id: 50,  name: "Manchester City",    logo: "https://media.api-sports.io/football/teams/50.png"  } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91009, date: hoursFromNow(30), status: { short: "NS", elapsed: null } },
    league:  { id: 78,  name: "Bundesliga",            country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png"  },
    teams:   { home: { id: 168, name: "Bayer Leverkusen",   logo: "https://media.api-sports.io/football/teams/168.png" },
               away: { id: 157, name: "Bayern Munich",      logo: "https://media.api-sports.io/football/teams/157.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91010, date: hoursFromNow(32), status: { short: "NS", elapsed: null } },
    league:  { id: 78,  name: "Bundesliga",            country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png"  },
    teams:   { home: { id: 165, name: "Borussia Dortmund",  logo: "https://media.api-sports.io/football/teams/165.png" },
               away: { id: 173, name: "RB Leipzig",         logo: "https://media.api-sports.io/football/teams/173.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91011, date: hoursFromNow(36), status: { short: "NS", elapsed: null } },
    league:  { id: 135, name: "Serie A",               country: "Italy",   logo: "https://media.api-sports.io/football/leagues/135.png" },
    teams:   { home: { id: 496, name: "Juventus",           logo: "https://media.api-sports.io/football/teams/496.png" },
               away: { id: 505, name: "Inter Milan",        logo: "https://media.api-sports.io/football/teams/505.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91012, date: hoursFromNow(40), status: { short: "NS", elapsed: null } },
    league:  { id: 135, name: "Serie A",               country: "Italy",   logo: "https://media.api-sports.io/football/leagues/135.png" },
    teams:   { home: { id: 489, name: "AC Milan",           logo: "https://media.api-sports.io/football/teams/489.png" },
               away: { id: 496, name: "Juventus",           logo: "https://media.api-sports.io/football/teams/496.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91013, date: hoursFromNow(44), status: { short: "NS", elapsed: null } },
    league:  { id: 61,  name: "Ligue 1",               country: "France",  logo: "https://media.api-sports.io/football/leagues/61.png"  },
    teams:   { home: { id: 85,  name: "Paris Saint-Germain", logo: "https://media.api-sports.io/football/teams/85.png"  },
               away: { id: 80,  name: "Lyon",                logo: "https://media.api-sports.io/football/teams/80.png"  } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91014, date: hoursFromNow(50), status: { short: "NS", elapsed: null } },
    league:  { id: 88,  name: "Eredivisie",            country: "Netherlands", logo: "https://media.api-sports.io/football/leagues/88.png" },
    teams:   { home: { id: 194, name: "Ajax",               logo: "https://media.api-sports.io/football/teams/194.png" },
               away: { id: 197, name: "PSV Eindhoven",      logo: "https://media.api-sports.io/football/teams/197.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
  {
    fixture: { id: 91015, date: hoursFromNow(54), status: { short: "NS", elapsed: null } },
    league:  { id: 94,  name: "Primeira Liga",         country: "Portugal", logo: "https://media.api-sports.io/football/leagues/94.png"  },
    teams:   { home: { id: 212, name: "Benfica",            logo: "https://media.api-sports.io/football/teams/212.png" },
               away: { id: 228, name: "Porto",              logo: "https://media.api-sports.io/football/teams/228.png" } },
    goals: { home: null, away: null }, events: [], statistics: []
  },
];

const store = {
  get: keys => new Promise(r => chrome.storage.local.get(keys, r)),
  set: obj  => new Promise(r => chrome.storage.local.set(obj, r)),
};

const CIRC = 2 * Math.PI * 13;
let countdown = 120;
ringFill.style.strokeDasharray  = CIRC;
ringFill.style.strokeDashoffset = 0;

function tickRing() {
  countdown--;
  if (countdown < 0) { countdown = 120; refreshAll(); }
  ringFill.style.strokeDashoffset = CIRC * (1 - countdown / 120);
  const m = Math.floor(countdown / 60);
  const s = String(countdown % 60).padStart(2, "0");
  ringLabel.textContent = m + ":" + s;
}
setInterval(tickRing, 1000);

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => { p.classList.add("hidden"); p.classList.remove("active"); });
    btn.classList.add("active");
    const panel = document.getElementById("tab-" + btn.dataset.tab);
    panel.classList.remove("hidden");
    panel.classList.add("active");
  });
});

async function getFavs() {
  const d = await store.get(["favorites"]);
  return d.favorites || [];
}
async function setFavs(favs) { await store.set({ favorites: favs }); }

async function renderFavourites() {
  const favs = await getFavs();
  favEl.innerHTML = "";
  if (!favs.length) {
    favEl.innerHTML = '<li class="empty-msg">-- No teams added yet --</li>';
    return;
  }
  favs.forEach(t => {
    const li = document.createElement("li");
    li.className = "fav-item";
    li.innerHTML = `
      <img src="${t.logo}" alt="" class="fav-logo">
      <span class="fav-name">${t.name.toUpperCase()}</span>
      <button class="standings-btn" data-id="${t.id}" data-name="${t.name}">TABLE</button>
      <button class="remove-btn" data-id="${t.id}">REMOVE</button>
    `;
    li.querySelector(".remove-btn").addEventListener("click", () => removeFav(t.id));
    li.querySelector(".standings-btn").addEventListener("click", () => fetchStandings(t.id, t.name));
    favEl.appendChild(li);
  });
}

async function addFav(team) {
  const favs = await getFavs();
  if (favs.find(f => f.id === team.id)) return;
  favs.push(team);
  await setFavs(favs);
  await renderFavourites();
  refreshAll();
}

async function removeFav(id) {
  const favs = await getFavs();
  await setFavs(favs.filter(f => f.id !== id));
  await renderFavourites();
  const { pinnedId } = await store.get(["pinnedId"]);
  if (pinnedId === String(id)) {
    await store.set({ pinnedId: null });
    pinnedZone.style.display = "none";
  }
  refreshAll();
}

let searchTimer = null;
teamInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  const q = teamInput.value.trim();
  if (q.length < 2) { hideSuggest(); return; }
  searchTimer = setTimeout(() => fetchSuggestions(q), 320);
});
teamInput.addEventListener("blur", () => setTimeout(hideSuggest, 180));

async function fetchSuggestions(q) {
  try {
    const res  = await fetch(`${BASE_URL}/teams?search=${encodeURIComponent(q)}`, { headers: H });
    const data = await res.json();
    showSuggestions(data.response || []);
  } catch { hideSuggest(); }
}

function showSuggestions(teams) {
  suggestEl.innerHTML = "";
  if (!teams.length) {
    suggestEl.innerHTML = '<div class="sug-none">NO RESULTS FOUND</div>';
    suggestEl.classList.remove("hidden");
    return;
  }
  teams.slice(0, 7).forEach(t => {
    const d = document.createElement("div");
    d.className = "sug-item";
    d.innerHTML = `
      <img src="${t.team.logo}" alt="" class="sug-logo">
      <span class="sug-name">${t.team.name.toUpperCase()}</span>
      <span class="sug-country">${(t.team.country || "").toUpperCase()}</span>
    `;
    d.addEventListener("mousedown", () => {
      addFav({ id: t.team.id, name: t.team.name, logo: t.team.logo });
      teamInput.value = "";
      hideSuggest();
    });
    suggestEl.appendChild(d);
  });
  suggestEl.classList.remove("hidden");
}
function hideSuggest() { suggestEl.classList.add("hidden"); suggestEl.innerHTML = ""; }

async function fetchStandings(teamId, teamName) {
  standingsContent.innerHTML = '<p class="loading-msg">Loading table...</p>';
  standingsTitle.textContent = teamName.toUpperCase() + " -- STANDINGS";
  standingsPanel.classList.remove("hidden");
  try {
    const year = new Date().getFullYear();
    const res  = await fetch(`${BASE_URL}/standings?team=${teamId}&season=${year}`, { headers: H });
    const data = await res.json();
    const leagues = data.response || [];
    if (!leagues.length) {
      standingsContent.innerHTML = '<p class="empty-msg">No standings data found.</p>';
      return;
    }
    standingsContent.innerHTML = "";
    leagues.forEach(entry => {
      const league = entry.league;
      const table  = league.standings[0];
      if (!table) return;
      const wrap = document.createElement("div");
      wrap.className = "standings-wrap";
      wrap.innerHTML = `
        <div class="standings-league">
          <img src="${league.logo}" class="league-logo" alt="">
          ${league.name.toUpperCase()}
        </div>
        <table class="standings-table">
          <thead>
            <tr><th>#</th><th class="text-left">TEAM</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>PTS</th></tr>
          </thead>
          <tbody id="sbody-${league.id}"></tbody>
        </table>
      `;
      standingsContent.appendChild(wrap);
      const tbody = document.getElementById(`sbody-${league.id}`);
      const idx   = table.findIndex(r => r.team.id === teamId);
      const start = Math.max(0, idx - 3);
      const end   = Math.min(table.length, idx + 4);
      if (start > 0) tbody.innerHTML += `<tr><td colspan="8" class="ellipsis-row">...</td></tr>`;
      table.slice(start, end).forEach(r => {
        const tr = document.createElement("tr");
        if (r.team.id === teamId) tr.className = "highlight-row";
        tr.innerHTML = `
          <td>${r.rank}</td>
          <td class="text-left team-cell"><img src="${r.team.logo}" class="mini-logo" alt="">${r.team.name}</td>
          <td>${r.all.played}</td><td>${r.all.win}</td><td>${r.all.draw}</td><td>${r.all.lose}</td>
          <td>${r.goalsDiff > 0 ? "+" : ""}${r.goalsDiff}</td>
          <td class="pts">${r.points}</td>
        `;
        tbody.appendChild(tr);
      });
      if (end < table.length) tbody.innerHTML += `<tr><td colspan="8" class="ellipsis-row">...</td></tr>`;
    });
  } catch {
    standingsContent.innerHTML = '<p class="error-msg">Failed to load standings.</p>';
  }
}

async function renderPinned(allLive) {
  const { pinnedId } = await store.get(["pinnedId"]);
  if (!pinnedId || !allLive) { pinnedZone.style.display = "none"; return; }
  const match = allLive.find(m => String(m.fixture.id) === String(pinnedId));
  if (!match) { pinnedZone.style.display = "none"; return; }
  pinnedZone.style.display = "block";
  pinnedCard.innerHTML = "";
  pinnedCard.appendChild(buildMatchCard(match, true, true));
}

function buildMatchCard(m, isLive, isPinned) {
  const card = document.createElement("div");
  const statusShort = m.fixture.status.short;
  const isActiveGame = isLive && statusShort !== "NS";
  card.className = "match-card" + (isActiveGame ? " is-live" : "") + (isPinned ? " is-pinned" : "");

  const dt = new Date(m.fixture.date).toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const events   = m.events || [];
  const timelineHTML = [...events]
    .filter(e => e.type === "Goal" || e.type === "Card")
    .sort((a, b) => (a.time.elapsed || 0) - (b.time.elapsed || 0))
    .map(e => {
      if (e.type === "Goal") {
        const side = e.team.id === m.teams.home.id ? "home" : "away";
        return `<span class="ev ev-goal ev-${side}" title="${e.player.name} ${e.time.elapsed}'">
                  ${e.time.elapsed}'${e.detail === "Own Goal" ? " OG" : ""}
                </span>`;
      }
      const col = e.detail === "Yellow Card" ? "ev-yellow" : "ev-red";
      return `<span class="ev ev-card ${col}" title="${e.player.name} ${e.time.elapsed}'"></span>`;
    }).join("");

  let statsHTML = "";
  if (m.statistics && m.statistics.length >= 2) {
    const hS = m.statistics[0]?.statistics || [];
    const aS = m.statistics[1]?.statistics || [];
    const get = (arr, type) => { const f = arr.find(s => s.type === type); return f ? (f.value || 0) : 0; };
    const hPoss = get(hS, "Ball Possession");
    const aPoss = get(aS, "Ball Possession");
    const hShot = get(hS, "Total Shots");
    const aShot = get(aS, "Total Shots");
    const hSOT  = get(hS, "Shots on Goal");
    const aSOT  = get(aS, "Shots on Goal");
    if (hPoss || hShot) {
      statsHTML = `
        <div class="stats-bar">
          <div class="stat-row">
            <span class="stat-val">${hPoss}</span>
            <span class="stat-label">POSSESSION</span>
            <span class="stat-val">${aPoss}</span>
          </div>
          <div class="stat-progress"><div class="progress-h" style="width:${parseInt(hPoss) || 50}%"></div></div>
          <div class="stat-row">
            <span class="stat-val">${hShot} (${hSOT})</span>
            <span class="stat-label">SHOTS (ON TGT)</span>
            <span class="stat-val">${aShot} (${aSOT})</span>
          </div>
        </div>
      `;
    }
  }

  const fid = m.fixture.id;

  card.innerHTML = `
    <div class="card-row">
      <div class="team-col home">
        <img src="${m.teams.home.logo}" alt="" class="team-logo">
        <span class="team-name">${m.teams.home.name.toUpperCase()}</span>
      </div>
      <div class="card-center">
        ${isActiveGame
          ? `<div class="score-block">
               <span class="score-num">${m.goals.home ?? 0}</span>
               <span class="score-sep">-</span>
               <span class="score-num">${m.goals.away ?? 0}</span>
             </div>
             <div class="minute-badge">${m.fixture.status.elapsed ? m.fixture.status.elapsed + "'" : statusShort}</div>`
          : `<div class="vs-block">VS</div>
             <div class="match-time">${dt}</div>`
        }
      </div>
      <div class="team-col away">
        <span class="team-name">${m.teams.away.name.toUpperCase()}</span>
        <img src="${m.teams.away.logo}" alt="" class="team-logo">
      </div>
    </div>
    ${timelineHTML ? `<div class="event-timeline">${timelineHTML}</div>` : ""}
    ${statsHTML}
    <div class="card-actions">
      ${isPinned
        ? `<button class="act-btn unpin-btn" data-id="${fid}">UNPIN</button>`
        : `<button class="act-btn pin-btn" data-id="${fid}">PIN</button>`
      }
    </div>
  `;

  const pinBtn   = card.querySelector(".pin-btn");
  const unpinBtn = card.querySelector(".unpin-btn");
  if (pinBtn) pinBtn.addEventListener("click", async () => { await store.set({ pinnedId: String(fid) }); refreshAll(); });
  if (unpinBtn) unpinBtn.addEventListener("click", async () => { await store.set({ pinnedId: null }); pinnedZone.style.display = "none"; refreshAll(); });

  return card;
}

function groupByLeague(matches) {
  const map = {};
  matches.forEach(m => {
    const k = m.league.name;
    if (!map[k]) map[k] = { logo: m.league.logo, country: m.league.country, items: [] };
    map[k].items.push(m);
  });
  return map;
}

function renderMatches(container, matches, isLive) {
  container.innerHTML = "";
  if (!matches.length) {
    container.innerHTML = '<p class="empty-msg">-- No matches found --</p>';
    return;
  }
  const grouped = groupByLeague(matches);
  Object.entries(grouped).forEach(([league, data]) => {
    const wrap = document.createElement("div");
    wrap.className = "league-group";
    wrap.innerHTML = `
      <div class="league-header">
        <img src="${data.logo}" alt="" class="league-logo">
        <span class="league-name">${league.toUpperCase()}</span>
        <span class="league-country">${(data.country || "").toUpperCase()}</span>
      </div>
    `;
    data.items.forEach(m => wrap.appendChild(buildMatchCard(m, isLive, false)));
    container.appendChild(wrap);
  });
}

function populateUpcomingFilter(matches) {
  const current = upcomingFilter.value;
  const leagues = [...new Map(matches.map(m => [m.league.name, m.league])).values()];
  upcomingFilter.innerHTML = '<option value="all">ALL LEAGUES</option>';
  leagues.forEach(lg => {
    const opt = document.createElement("option");
    opt.value = lg.name;
    opt.textContent = lg.name;
    upcomingFilter.appendChild(opt);
  });
  if ([...upcomingFilter.options].some(o => o.value === current)) {
    upcomingFilter.value = current;
  }
}

let cachedUpcoming = [];

upcomingFilter.addEventListener("change", () => {
  const val = upcomingFilter.value;
  const filtered = val === "all" ? cachedUpcoming : cachedUpcoming.filter(m => m.league.name === val);
  renderMatches(upcomingEl, filtered, false);
});

let cachedLive = [];

async function fetchLive() {
  liveEl.innerHTML = '<p class="loading-msg">Fetching live matches...</p>';
  try {
    const res  = await fetch(`${BASE_URL}/fixtures?live=all`, { headers: H });
    const data = await res.json();
    cachedLive = (data.response || []).length ? data.response : FALLBACK_LIVE;
  } catch {
    cachedLive = FALLBACK_LIVE;
  }

  statusDot.classList.toggle("dot-live", cachedLive.length > 0);
  statusDot.title = cachedLive.length ? `${cachedLive.length} live matches` : "No live matches";

  const favs   = await getFavs();
  const favIds = favs.map(f => String(f.id));
  const show   = favIds.length
    ? cachedLive.filter(m => favIds.includes(String(m.teams.home.id)) || favIds.includes(String(m.teams.away.id)))
    : cachedLive;

  renderMatches(liveEl, show, true);
  await renderPinned(cachedLive);
  checkGoalNotifications(cachedLive, favIds);
}

async function checkGoalNotifications(liveMatches, favIds) {
  if (!favIds.length) return;
  const { lastScores } = await store.get(["lastScores"]);
  const prev = lastScores || {};
  const next = {};
  liveMatches.forEach(m => {
    const id  = String(m.fixture.id);
    const key = `${m.goals.home}-${m.goals.away}`;
    next[id]  = key;
    if (prev[id] && prev[id] !== key) {
      const homeFav = favIds.includes(String(m.teams.home.id));
      const awayFav = favIds.includes(String(m.teams.away.id));
      if ((homeFav || awayFav) && chrome.notifications) {
        chrome.notifications.create(`goal_${id}_${Date.now()}`, {
          type: "basic",
          iconUrl: homeFav ? m.teams.home.logo : m.teams.away.logo,
          title: "GOAL!",
          message: `${m.teams.home.name} ${m.goals.home} - ${m.goals.away} ${m.teams.away.name} (${m.fixture.status.elapsed}')`,
        });
      }
    }
  });
  await store.set({ lastScores: next });
}

async function fetchUpcoming() {
  upcomingEl.innerHTML = '<p class="loading-msg">Fetching upcoming matches...</p>';
  try {
    const res  = await fetch(`${BASE_URL}/fixtures?next=20`, { headers: H });
    const data = await res.json();
    cachedUpcoming = (data.response || []).length ? data.response : FALLBACK_UPCOMING;
  } catch {
    cachedUpcoming = FALLBACK_UPCOMING;
  }

  const favs   = await getFavs();
  const favIds = favs.map(f => String(f.id));
  const base   = favIds.length
    ? cachedUpcoming.filter(m => favIds.includes(String(m.teams.home.id)) || favIds.includes(String(m.teams.away.id)))
    : cachedUpcoming;

  const display = base.length ? base : cachedUpcoming;

  populateUpcomingFilter(display);

  const selectedLeague = upcomingFilter.value;
  const filtered = selectedLeague === "all" ? display : display.filter(m => m.league.name === selectedLeague);
  renderMatches(upcomingEl, filtered, false);
}

async function fetchOther() {
  otherEl.innerHTML = '<p class="loading-msg">Fetching all matches...</p>';
  try {
    const [liveRes, upRes] = await Promise.all([
      fetch(`${BASE_URL}/fixtures?live=all`, { headers: H }),
      fetch(`${BASE_URL}/fixtures?next=30`, { headers: H }),
    ]);
    const [ld, ud] = await Promise.all([liveRes.json(), upRes.json()]);
    const favs   = await getFavs();
    const favIds = favs.map(f => String(f.id));

    const filterOut = arr => favIds.length
      ? arr.filter(m => !favIds.includes(String(m.teams.home.id)) && !favIds.includes(String(m.teams.away.id)))
      : arr;

    const liveArr = (ld.response || []).length ? ld.response : FALLBACK_LIVE;
    const upArr   = (ud.response || []).length ? ud.response : FALLBACK_UPCOMING;

    const combined = [...filterOut(liveArr), ...filterOut(upArr)];
    const seen = new Set();
    const unique = combined.filter(m => { if (seen.has(m.fixture.id)) return false; seen.add(m.fixture.id); return true; });
    renderMatches(otherEl, unique, false);
  } catch {
    const combined = [...FALLBACK_LIVE, ...FALLBACK_UPCOMING];
    const seen = new Set();
    renderMatches(otherEl, combined.filter(m => { if (seen.has(m.fixture.id)) return false; seen.add(m.fixture.id); return true; }), false);
  }
}

async function refreshAll() {
  await Promise.all([fetchLive(), fetchUpcoming(), fetchOther()]);
}

(async () => {
  await renderFavourites();
  await refreshAll();
})();
