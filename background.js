const API_KEY  = "657f815f1b26a5342fc8a069a6ee8ff1";
const BASE_URL = "https://v3.football.api-sports.io";
const HEADERS  = { "x-apisports-key": API_KEY };

chrome.alarms.create("refresh", { periodInMinutes: 2 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "refresh") return;
  try {
    const res    = await fetch(`${BASE_URL}/fixtures?live=all`, { headers: HEADERS });
    const data   = await res.json();
    const live   = data.response || [];
    const stored = await chrome.storage.local.get(["favorites", "lastScores"]);
    const favs   = stored.favorites  || [];
    const prev   = stored.lastScores || {};
    const favIds = favs.map(f => String(f.id));
    if (!favIds.length) return;
    const next = {};
    for (const m of live) {
      const id      = String(m.fixture.id);
      const key     = `${m.goals.home}-${m.goals.away}`;
      next[id]      = key;
      const homeFav = favIds.includes(String(m.teams.home.id));
      const awayFav = favIds.includes(String(m.teams.away.id));
      if (!(homeFav || awayFav)) continue;
      if (prev[id] && prev[id] !== key) {
        chrome.notifications.create(`goal_${id}_${Date.now()}`, {
          type:    "basic",
          iconUrl: homeFav ? m.teams.home.logo : m.teams.away.logo,
          title:   "GOAL!",
          message: `${m.teams.home.name} ${m.goals.home} - ${m.goals.away} ${m.teams.away.name} (${m.fixture.status.elapsed}')`,
        });
      }
      const wasLive = prev[`live_${id}`];
      const isLive  = m.fixture.status.short === "1H" || m.fixture.status.short === "2H";
      if (!wasLive && isLive) {
        chrome.notifications.create(`live_${id}`, {
          type:    "basic",
          iconUrl: homeFav ? m.teams.home.logo : m.teams.away.logo,
          title:   "MATCH STARTED",
          message: `${m.teams.home.name} vs ${m.teams.away.name} is now live!`,
        });
      }
      next[`live_${id}`] = isLive;
    }
    await chrome.storage.local.set({ lastScores: next });
  } catch (e) {
    console.error("FCAudience refresh error:", e);
  }
});
