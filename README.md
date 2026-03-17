# FCAudience

> A retro-styled live football tracker Chrome extension — built for fans, by a fan.
--------------------------------------------------------

## About

FCAudience is a Chrome extension that puts live football scores, upcoming fixtures, league standings, and real-time match stats right in your browser toolbar. No bloated sports apps, no sign-ups — just open the popup and see what's on the pitch, styled like a 1970s stadium scoreboard.

**Made by Siddhant Bhuyar**

-------------------------------------------------------

## Features

### Team Search with Autocomplete
Type any team name and get instant suggestions pulled from the API complete with team logos and country labels. Click to add to favourites in one tap.

### Favourites
Pin your teams locally using Chrome's storage API. The Live and Upcoming tabs automatically filter to show only your teams' matches. If no favourites are set, all matches across every league are shown.

### Live Tab
Shows ongoing matches for your favourited teams in real time. Each card shows the current score in large Bebas Neue figures, the match minute, a pulsing green LIVE badge, a goal and card event timeline, and a live stats bar with possession and shots data.

### Upcoming Tab
Shows the next batch of fixtures with a league filter dropdown. Select any league from the dropdown to narrow down the list — the dropdown auto-populates from whatever fixtures are available. Defaults to all upcoming matches when no favourites are set. Fabricated preview matches ensure the tab is never empty.

### All Matches Tab
A full overview of every live and upcoming fixture not already in your favourites tabs. If no favourites are set, it shows everything.

### Event Timeline
Live match cards show a compact row of event chips below the score — green for home goals, red for away goals, and colour-coded card rectangles (yellow/red) for bookings, all sorted chronologically.

### Live Stats Bar
When statistics are available, a bar appears inside live cards showing possession percentage with a visual progress bar, total shots, and shots on target for both teams.

### League Standings (TABLE button)
Every favourited team has a TABLE button. Tap it to open an inline standings panel showing the team's current position in context — three places above, the team highlighted in amber, three places below — with played, wins, draws, losses, goal difference, and points.

### Pin a Match
Tap PIN on any live match card to lock it to the top of the Live tab inside an amber-bordered Pinned Match strip. Tap UNPIN to release it.

### Auto-Refresh Countdown Ring
A circular SVG countdown ring in the header counts down from 2:00. When it hits zero all three tabs refresh automatically. The ring drains visually as the timer ticks.

### Push Notifications
The background service worker polls the API every 2 minutes even when the popup is closed. It fires a Chrome notification when a favourited team scores a goal and again when a match transitions from pre-kick to live.

### Live Status Dot
A small dot in the header pulses red when there are live matches for your favourited teams, giving an at-a-glance indicator without opening the popup.

--------------------------------------------------------

## API

FCAudience uses [API-Football v3](https://www.api-football.com) for:

- Live fixtures — `/fixtures?live=all`
- Upcoming fixtures — `/fixtures?next=N`
- League standings — `/standings`
- Team search — `/teams?search=`


---

## Design

The visual language is inspired by 1970s–80s stadium scoreboards — amber on near-black, stencil typography, grass-stripe header accents, and subtle pitch-line textures on every match card.


**Fonts**
- **Bebas Neue** — scoreboard numbers and section titles
- **Barlow Condensed** — team names, labels, buttons

---

## Made By

**Siddhant Bhuyar**

Built from scratch — design, logic, API integration, icon, and styling — as a personal side project for following live football without leaving the browser.
