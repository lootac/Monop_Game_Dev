# HANDOFF.md

Complete, verbatim on-disk source export of the Monopoly vs AI project, generated 2026-08-02 23:29 UTC for a Claude session that couldn't reliably fetch the GitHub repo directly. Every file below is reproduced exactly as it exists in the working tree — no truncation, no reformatting.

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Monopoly — vs AI</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<div id="app">
  <div id="board-wrap">
    <div id="board"></div>
  </div>

  <div id="sidebar">
    <div id="players"></div>

    <div id="controls">
      <div id="dice-area">
        <div id="dice">
          <div class="die" id="die1">-</div>
          <div class="die" id="die2">-</div>
        </div>
        <button id="roll-btn">Roll Dice</button>
      </div>
      <div id="action-area"></div>
      <button id="manage-btn" class="secondary" disabled>Manage Properties</button>
      <button id="trade-btn" class="secondary" disabled>Propose Trade</button>
      <button id="end-turn-btn" disabled>End Turn</button>
    </div>
  </div>

  <div id="log"></div>
</div>

<div id="modal-backdrop" class="hidden">
  <div id="modal">
    <div id="modal-title"></div>
    <div id="modal-body"></div>
    <div id="modal-actions"></div>
  </div>
</div>

<script src="data.js?cachebust1"></script>
<script src="app.js?cachebust1"></script>
</body>
</html>

```

_Line count: 

## data.js

```javascript
// Standard Monopoly (US edition) board data, simplified ruleset (no trading).

const COLORS = {
  brown: '#955436',
  lightblue: '#aae0fa',
  pink: '#d93a96',
  orange: '#f7941d',
  red: '#ed1b24',
  yellow: '#fef200',
  green: '#1fb25a',
  darkblue: '#0072bb',
  railroad: '#333333',
  utility: '#888888',
};

// Lighter variants of COLORS for legible text on the dark sidebar background.
const LEGEND_COLORS = {
  brown: '#c9895f',
  lightblue: '#8fd7fb',
  pink: '#f06fb9',
  orange: '#ffab40',
  red: '#ff6b6b',
  yellow: '#fdf065',
  green: '#4ade80',
  darkblue: '#5eb3ef',
  railroad: '#b7bfc9',
  utility: '#cfd6dd',
};

// type: go | property | railroad | utility | tax | chance | chest | jail | freeparking | gotojail
const BOARD = [
  { i: 0, type: 'go', name: 'GO' },
  { i: 1, type: 'property', name: 'Mediterranean Avenue', color: 'brown', price: 60, houseCost: 50, rent: [2, 10, 30, 90, 160, 250] },
  { i: 2, type: 'chest', name: 'Community Chest' },
  { i: 3, type: 'property', name: 'Baltic Avenue', color: 'brown', price: 60, houseCost: 50, rent: [4, 20, 60, 180, 320, 450] },
  { i: 4, type: 'tax', name: 'Income Tax', amount: 200, altPercent: 0.10 },
  { i: 5, type: 'railroad', name: 'Reading Railroad', price: 200 },
  { i: 6, type: 'property', name: 'Oriental Avenue', color: 'lightblue', price: 100, houseCost: 50, rent: [6, 30, 90, 270, 400, 550] },
  { i: 7, type: 'chance', name: 'Chance' },
  { i: 8, type: 'property', name: 'Vermont Avenue', color: 'lightblue', price: 100, houseCost: 50, rent: [6, 30, 90, 270, 400, 550] },
  { i: 9, type: 'property', name: 'Connecticut Avenue', color: 'lightblue', price: 120, houseCost: 50, rent: [8, 40, 100, 300, 450, 600] },
  { i: 10, type: 'jail', name: 'Jail / Just Visiting' },
  { i: 11, type: 'property', name: 'St. Charles Place', color: 'pink', price: 140, houseCost: 100, rent: [10, 50, 150, 450, 625, 750] },
  { i: 12, type: 'utility', name: 'Electric Company', price: 150 },
  { i: 13, type: 'property', name: 'States Avenue', color: 'pink', price: 140, houseCost: 100, rent: [10, 50, 150, 450, 625, 750] },
  { i: 14, type: 'property', name: 'Virginia Avenue', color: 'pink', price: 160, houseCost: 100, rent: [12, 60, 180, 500, 700, 900] },
  { i: 15, type: 'railroad', name: 'Pennsylvania Railroad', price: 200 },
  { i: 16, type: 'property', name: 'St. James Place', color: 'orange', price: 180, houseCost: 100, rent: [14, 70, 200, 550, 750, 950] },
  { i: 17, type: 'chest', name: 'Community Chest' },
  { i: 18, type: 'property', name: 'Tennessee Avenue', color: 'orange', price: 180, houseCost: 100, rent: [14, 70, 200, 550, 750, 950] },
  { i: 19, type: 'property', name: 'New York Avenue', color: 'orange', price: 200, houseCost: 100, rent: [16, 80, 220, 600, 800, 1000] },
  { i: 20, type: 'freeparking', name: 'Free Parking' },
  { i: 21, type: 'property', name: 'Kentucky Avenue', color: 'red', price: 220, houseCost: 150, rent: [18, 90, 250, 700, 875, 1050] },
  { i: 22, type: 'chance', name: 'Chance' },
  { i: 23, type: 'property', name: 'Indiana Avenue', color: 'red', price: 220, houseCost: 150, rent: [18, 90, 250, 700, 875, 1050] },
  { i: 24, type: 'property', name: 'Illinois Avenue', color: 'red', price: 240, houseCost: 150, rent: [20, 100, 300, 750, 925, 1100] },
  { i: 25, type: 'railroad', name: 'B&O Railroad', price: 200 },
  { i: 26, type: 'property', name: 'Atlantic Avenue', color: 'yellow', price: 260, houseCost: 150, rent: [22, 110, 330, 800, 975, 1150] },
  { i: 27, type: 'property', name: 'Ventnor Avenue', color: 'yellow', price: 260, houseCost: 150, rent: [22, 110, 330, 800, 975, 1150] },
  { i: 28, type: 'utility', name: 'Water Works', price: 150 },
  { i: 29, type: 'property', name: 'Marvin Gardens', color: 'yellow', price: 280, houseCost: 150, rent: [24, 120, 360, 850, 1025, 1200] },
  { i: 30, type: 'gotojail', name: 'Go To Jail' },
  { i: 31, type: 'property', name: 'Pacific Avenue', color: 'green', price: 300, houseCost: 200, rent: [26, 130, 390, 900, 1100, 1275] },
  { i: 32, type: 'property', name: 'North Carolina Avenue', color: 'green', price: 300, houseCost: 200, rent: [26, 130, 390, 900, 1100, 1275] },
  { i: 33, type: 'chest', name: 'Community Chest' },
  { i: 34, type: 'property', name: 'Pennsylvania Avenue', color: 'green', price: 320, houseCost: 200, rent: [28, 150, 450, 1000, 1200, 1400] },
  { i: 35, type: 'railroad', name: 'Short Line', price: 200 },
  { i: 36, type: 'chance', name: 'Chance' },
  { i: 37, type: 'property', name: 'Park Place', color: 'darkblue', price: 350, houseCost: 200, rent: [35, 175, 500, 1100, 1300, 1500] },
  { i: 38, type: 'tax', name: 'Luxury Tax', amount: 100 },
  { i: 39, type: 'property', name: 'Boardwalk', color: 'darkblue', price: 400, houseCost: 200, rent: [50, 200, 600, 1400, 1700, 2000] },
];

const COLOR_GROUPS = {};
BOARD.forEach((s) => {
  if (s.type === 'property') {
    (COLOR_GROUPS[s.color] = COLOR_GROUPS[s.color] || []).push(s.i);
  }
});

const RAILROAD_RENT = [25, 50, 100, 200];

// Card effects are applied by the game engine via a `kind` tag + params.
const CHANCE_CARDS = [
  { text: 'Advance to GO (Collect $200)', kind: 'advanceTo', to: 0 },
  { text: 'Advance to Illinois Avenue', kind: 'advanceTo', to: 24 },
  { text: 'Advance to St. Charles Place', kind: 'advanceTo', to: 11 },
  { text: 'Advance to the nearest Railroad', kind: 'nearestRailroad' },
  { text: 'Advance to the nearest Utility', kind: 'nearestUtility' },
  { text: 'Bank pays you dividend of $50', kind: 'collect', amount: 50 },
  { text: 'Get Out of Jail Free', kind: 'getOutOfJail' },
  { text: 'Go back 3 spaces', kind: 'move', by: -3 },
  { text: 'Go to Jail', kind: 'goToJail' },
  { text: 'Make general repairs: $25 per house, $100 per hotel', kind: 'repairs', house: 25, hotel: 100 },
  { text: 'Pay poor tax of $15', kind: 'pay', amount: 15 },
  { text: 'Take a trip to Reading Railroad', kind: 'advanceTo', to: 5 },
  { text: 'Advance to Boardwalk', kind: 'advanceTo', to: 39 },
  { text: 'You have been elected Chairman: pay each player $50', kind: 'payEach', amount: 50 },
  { text: 'Your building loan matures: collect $150', kind: 'collect', amount: 150 },
  { text: 'You have won a crossword competition: collect $100', kind: 'collect', amount: 100 },
];

const CHEST_CARDS = [
  { text: 'Advance to GO (Collect $200)', kind: 'advanceTo', to: 0 },
  { text: 'Bank error in your favor: collect $200', kind: 'collect', amount: 200 },
  { text: "Doctor's fees: pay $50", kind: 'pay', amount: 50 },
  { text: 'From sale of stock you get $50', kind: 'collect', amount: 50 },
  { text: 'Get Out of Jail Free', kind: 'getOutOfJail' },
  { text: 'Go to Jail', kind: 'goToJail' },
  { text: 'Holiday fund matures: receive $100', kind: 'collect', amount: 100 },
  { text: 'Income tax refund: collect $20', kind: 'collect', amount: 20 },
  { text: "It's your birthday: collect $10 from every player", kind: 'collectEach', amount: 10 },
  { text: 'Life insurance matures: collect $100', kind: 'collect', amount: 100 },
  { text: 'Pay hospital fees of $100', kind: 'pay', amount: 100 },
  { text: 'Pay school fees of $150', kind: 'pay', amount: 150 },
  { text: 'Receive $25 consultancy fee', kind: 'collect', amount: 25 },
  { text: 'You are assessed for street repair: $40 per house, $115 per hotel', kind: 'repairs', house: 40, hotel: 115 },
  { text: 'You have won second prize in a beauty contest: collect $10', kind: 'collect', amount: 10 },
  { text: 'You inherit $100', kind: 'collect', amount: 100 },
];

const PLAYER_COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835'];
const PLAYER_NAMES = ['You', 'Ava (AI)', 'Ben (AI)', 'Cleo (AI)'];

```

_Line count: 

## style.css

```css
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: #0e1420;
  color: #eaeef2;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

#app {
  display: flex;
  gap: 16px;
  padding: 16px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}

/* ---------- Board ---------- */
#board-wrap { flex: 0 0 auto; }

#board {
  display: grid;
  grid-template-columns: 100px repeat(9, 62px) 100px;
  grid-template-rows: 100px repeat(9, 62px) 100px;
  width: 758px;
  height: 758px;
  background: #14532d;
  border: 3px solid #333;
  position: relative;
}

.cell {
  border: 1px solid #444;
  background: #1b2333;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 8px;
  line-height: 1.15;
}

.cell.corner {
  font-size: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  background: #202a3d;
}

.cell .colorbar {
  height: 12px;
  width: 100%;
  flex: 0 0 auto;
}

.cell .name {
  padding: 2px 3px;
  font-weight: 600;
  flex: 1;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #dfe6ee;
}

.cell .price {
  padding: 1px 3px 3px;
  text-align: center;
  color: #9fb0c3;
  font-size: 7.5px;
}

.cell .owner-strip {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 4px;
}

.cell .houses {
  position: absolute;
  top: 13px;
  left: 0; right: 0;
  display: flex;
  justify-content: center;
  gap: 1px;
}
.cell .houses .h { width: 6px; height: 6px; background: #2ecc71; border-radius: 1px; }
.cell .houses .hotel { width: 10px; height: 8px; background: #e74c3c; border-radius: 1px; }

.tokens {
  position: absolute;
  bottom: 2px;
  left: 2px;
  right: 2px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
}
.token {
  width: 11px; height: 11px;
  border-radius: 50%;
  border: 1.5px solid #0e1420;
  flex: 0 0 auto;
}

.cell.mortgaged { opacity: 0.55; }
.cell.mortgaged .name::after { content: " (M)"; color: #e74c3c; }

/* ---------- Sidebar ---------- */
#sidebar {
  flex: 0 0 auto;
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#players {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-card {
  background: #1b2333;
  border: 1px solid #2c3750;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.player-card.active {
  border-color: #ffd54f;
  box-shadow: 0 0 0 2px rgba(255,213,79,0.35);
}
.player-card.bankrupt { opacity: 0.4; }

.player-dot {
  width: 16px; height: 16px; border-radius: 50%;
  flex: 0 0 auto;
  border: 2px solid #0e1420;
}

.player-info { flex: 1; }
.player-name { font-weight: 700; font-size: 13px; }
.player-cash { font-size: 12px; color: #9fb0c3; }
.player-jail { font-size: 11px; color: #ff8a65; }
.player-props { font-size: 10.5px; color: #7f93ac; margin-top: 2px; }

#controls {
  background: #1b2333;
  border: 1px solid #2c3750;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#dice-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

#dice { display: flex; gap: 6px; }
.die {
  width: 34px; height: 34px;
  background: #fff;
  color: #111;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800;
  font-size: 16px;
}

button {
  background: #2c6bed;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
button:disabled { background: #3a4256; color: #7a8598; cursor: not-allowed; }
button.secondary { background: #3a4256; }
button.danger { background: #c0392b; }

#action-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
#action-area .action-row { display: flex; gap: 8px; flex-wrap: wrap; }

#log {
  flex: 0 0 auto;
  width: 360px;
  height: 764px;
  background: #1b2333;
  border: 1px solid #2c3750;
  border-radius: 8px;
  padding: 12px;
  overflow-y: auto;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
#log .entry { color: #b7c2d0; }
#log .entry.you { color: #ffe082; }
#log .entry.event { color: #80cbc4; }

/* ---------- Modal ---------- */
#modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 50;
}
#modal-backdrop.hidden { display: none; }
#modal {
  background: #1b2333;
  border: 1px solid #2c3750;
  border-radius: 10px;
  padding: 18px 20px;
  width: 420px;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
#modal-title { font-weight: 800; font-size: 15px; margin-bottom: 8px; }
#modal-body { font-size: 13px; color: #c6d0dc; margin-bottom: 14px; line-height: 1.5; overflow-y: auto; }
#modal-actions { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }

```

_Line count: 

## app.js

```javascript
'use strict';

/* ---------------------------------------------------------------------
   State
--------------------------------------------------------------------- */

const players = [
  { id: 0, name: PLAYER_NAMES[0], color: PLAYER_COLORS[0], isHuman: true,
    cash: 1500, position: 0, inJail: false, jailTurns: 0, goojCards: 0, bankrupt: false },
  { id: 1, name: PLAYER_NAMES[1], color: PLAYER_COLORS[1], isHuman: false,
    cash: 1500, position: 0, inJail: false, jailTurns: 0, goojCards: 0, bankrupt: false },
  { id: 2, name: PLAYER_NAMES[2], color: PLAYER_COLORS[2], isHuman: false,
    cash: 1500, position: 0, inJail: false, jailTurns: 0, goojCards: 0, bankrupt: false },
  { id: 3, name: PLAYER_NAMES[3], color: PLAYER_COLORS[3], isHuman: false,
    cash: 1500, position: 0, inJail: false, jailTurns: 0, goojCards: 0, bankrupt: false },
];

const AI_PROFILES = {
  1: { buyBuffer: 60, buildBuffer: 150, jailPayThreshold: 400, auctionFactor: 1.1, cashFloor: 150 },  // Ava: aggressive
  2: { buyBuffer: 150, buildBuffer: 250, jailPayThreshold: 250, auctionFactor: 0.85, cashFloor: 200 }, // Ben: moderate
  3: { buyBuffer: 250, buildBuffer: 350, jailPayThreshold: 150, auctionFactor: 0.6, cashFloor: 300 },  // Cleo: cautious
};

const TRADE_ROUND_CAP = 4;

function buildInitialProps() {
  return BOARD.map((space) => {
    if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
      return { owner: null, houses: 0, mortgaged: false };
    }
    return null;
  });
}

const state = {
  props: buildInitialProps(),
  currentIndex: -1,
  lastDiceSum: 0,
  gameOver: false,
  cellEls: {},
  bankHouses: 32,
  bankHotels: 12,
};

let pendingRollResolve = null;
let pendingEndTurnResolve = null;

/* ---------------------------------------------------------------------
   DOM refs
--------------------------------------------------------------------- */

const boardEl = document.getElementById('board');
const playersEl = document.getElementById('players');
const rollBtn = document.getElementById('roll-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const manageBtn = document.getElementById('manage-btn');
const tradeBtn = document.getElementById('trade-btn');
const actionArea = document.getElementById('action-area');
const die1El = document.getElementById('die1');
const die2El = document.getElementById('die2');
const logEl = document.getElementById('log');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalActions = document.getElementById('modal-actions');

/* ---------------------------------------------------------------------
   Small utilities
--------------------------------------------------------------------- */

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function ownedIndicesOf(playerId) {
  const res = [];
  for (let i = 0; i < 40; i++) {
    if (state.props[i] && state.props[i].owner === playerId) res.push(i);
  }
  return res;
}

function log(msg, cls) {
  const wasNearBottom = logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 40;
  const div = document.createElement('div');
  div.className = 'entry' + (cls ? ' ' + cls : '');
  div.textContent = msg;
  logEl.appendChild(div);
  while (logEl.children.length > 300) logEl.removeChild(logEl.firstChild);
  if (wasNearBottom) logEl.scrollTop = logEl.scrollHeight;
}

function setStatus(text) { actionArea.textContent = text || ''; }

function mkBtn(label, onclick, disabled, cls) {
  const btn = document.createElement('button');
  btn.textContent = label;
  if (cls) btn.className = cls;
  if (disabled) btn.disabled = true;
  btn.onclick = onclick;
  return btn;
}

/* ---------------------------------------------------------------------
   Modal helpers
--------------------------------------------------------------------- */

function showModal() { modalBackdrop.classList.remove('hidden'); }
function hideModal() { modalBackdrop.classList.add('hidden'); }

function askModal(title, bodyHtml, buttons) {
  return new Promise((resolve) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalActions.innerHTML = '';
    buttons.forEach((b) => {
      const btn = mkBtn(b.label, () => { hideModal(); resolve(b.value); }, b.disabled, b.cls);
      modalActions.appendChild(btn);
    });
    showModal();
  });
}

function propertyRowLabel(i) {
  const space = BOARD[i];
  const st = state.props[i];
  let extra = '';
  if (st.mortgaged) extra += ' (mortgaged)';
  if (space.type === 'property' && st.houses > 0) extra += st.houses === 5 ? ' [Hotel]' : ` [${st.houses}h]`;
  return `${space.name}${extra}`;
}

function showRaiseCashModal(player, targetAmount) {
  return new Promise((resolve) => {
    function refresh() {
      modalTitle.textContent = 'Raise Cash';
      modalBody.innerHTML = '';
      const info = document.createElement('div');
      info.innerHTML = `You owe <b>$${targetAmount}</b>. Cash on hand: <b>$${player.cash}</b>.`;
      info.style.marginBottom = '8px';
      modalBody.appendChild(info);

      const owned = ownedIndicesOf(player.id);
      const list = document.createElement('div');
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = '6px';

      if (owned.length === 0) {
        const none = document.createElement('div');
        none.textContent = 'No properties left to liquidate.';
        none.style.color = '#7f93ac';
        list.appendChild(none);
      }

      owned.forEach((i) => {
        const space = BOARD[i];
        const st = state.props[i];
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;';
        const label = document.createElement('span');
        label.textContent = propertyRowLabel(i);
        row.appendChild(label);
        const grp = document.createElement('span');
        grp.style.cssText = 'display:flex;gap:4px;';
        if (space.type === 'property' && st.houses > 0) {
          if (canSellHouseOn(i, player.id)) {
            grp.appendChild(mkBtn(`Sell house (+$${space.houseCost / 2})`, () => {
              sellHouseOn(i, player); refresh();
            }));
          } else {
            const note = document.createElement('span');
            note.textContent = 'Sell evenly first';
            note.style.cssText = 'color:#7f93ac;font-size:11px;';
            grp.appendChild(note);
          }
        } else if (!st.mortgaged) {
          grp.appendChild(mkBtn(`Mortgage (+$${space.price / 2})`, () => {
            st.mortgaged = true; player.cash += space.price / 2; refresh();
          }));
        } else {
          const cost = Math.round(space.price * 0.55);
          grp.appendChild(mkBtn(`Unmortgage (-$${cost})`, () => {
            if (player.cash >= cost) { player.cash -= cost; st.mortgaged = false; refresh(); }
          }, player.cash < cost));
        }
        row.appendChild(grp);
        list.appendChild(row);
      });
      modalBody.appendChild(list);

      modalActions.innerHTML = '';
      modalActions.appendChild(mkBtn('Done', () => { hideModal(); resolve(); }));
      modalActions.appendChild(mkBtn('Declare Bankruptcy', () => { hideModal(); resolve(); }, false, 'danger'));
      renderPlayers();
    }
    showModal();
    refresh();
  });
}

function showManagePropertiesModal(player) {
  return new Promise((resolve) => {
    function refresh() {
      modalTitle.textContent = 'Manage Properties';
      modalBody.innerHTML = '';
      const cashInfo = document.createElement('div');
      cashInfo.innerHTML = `Cash: <b>$${player.cash}</b> &middot; Bank supply: <b>${state.bankHouses}</b> houses, <b>${state.bankHotels}</b> hotels`;
      cashInfo.style.marginBottom = '8px';
      modalBody.appendChild(cashInfo);

      const owned = ownedIndicesOf(player.id);
      if (owned.length === 0) {
        const none = document.createElement('div');
        none.textContent = 'You own no properties yet.';
        none.style.color = '#7f93ac';
        modalBody.appendChild(none);
      }
      const list = document.createElement('div');
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = '6px';

      owned.forEach((i) => {
        const space = BOARD[i];
        const st = state.props[i];
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;';
        const label = document.createElement('span');
        label.textContent = propertyRowLabel(i);
        row.appendChild(label);
        const grp = document.createElement('span');
        grp.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;';

        if (space.type === 'property') {
          if (canBuildHouseOn(i, player.id)) {
            grp.appendChild(mkBtn(`Build (-$${space.houseCost})`, () => {
              buildHouseOn(i, player); refresh();
            }, player.cash < space.houseCost));
          }
          if (st.houses > 0) {
            if (canSellHouseOn(i, player.id)) {
              grp.appendChild(mkBtn(`Sell house (+$${space.houseCost / 2})`, () => {
                sellHouseOn(i, player); refresh();
              }));
            } else {
              const note = document.createElement('span');
              note.textContent = 'Sell evenly first';
              note.style.cssText = 'color:#7f93ac;font-size:11px;';
              grp.appendChild(note);
            }
          }
        }
        if (!st.mortgaged && st.houses === 0) {
          grp.appendChild(mkBtn(`Mortgage (+$${space.price / 2})`, () => {
            st.mortgaged = true; player.cash += space.price / 2; refresh();
          }));
        } else if (st.mortgaged) {
          const cost = Math.round(space.price * 0.55);
          grp.appendChild(mkBtn(`Unmortgage (-$${cost})`, () => {
            if (player.cash >= cost) { player.cash -= cost; st.mortgaged = false; refresh(); }
          }, player.cash < cost));
        }
        row.appendChild(grp);
        list.appendChild(row);
      });
      modalBody.appendChild(list);

      modalActions.innerHTML = '';
      modalActions.appendChild(mkBtn('Close', () => { hideModal(); renderAll(); resolve(); }));
      renderPlayers();
      renderBoardOwnership();
    }
    showModal();
    refresh();
  });
}

/* ---------------------------------------------------------------------
   Trade UI
--------------------------------------------------------------------- */

function tradeablePropertiesOf(playerId) {
  return ownedIndicesOf(playerId).filter((i) => BOARD[i].type !== 'property' || state.props[i].houses === 0);
}

function buildTradeSideColumn(title, player, sel, onChange) {
  const col = document.createElement('div');
  col.style.marginBottom = '12px';

  const h = document.createElement('div');
  h.textContent = `${title} (cash: $${player.cash}, GOOJ cards: ${player.goojCards})`;
  h.style.cssText = 'font-weight:700;font-size:12px;margin-bottom:6px;';
  col.appendChild(h);

  const tradeable = tradeablePropertiesOf(player.id);
  if (tradeable.length === 0) {
    const none = document.createElement('div');
    none.textContent = 'No tradeable properties.';
    none.style.cssText = 'color:#7f93ac;font-size:11px;margin-bottom:4px;';
    col.appendChild(none);
  }
  tradeable.forEach((i) => {
    const space = BOARD[i];
    const row = document.createElement('label');
    row.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;padding:2px 0;';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = sel.props.has(i);
    cb.onchange = () => { if (cb.checked) sel.props.add(i); else sel.props.delete(i); onChange(); };
    row.appendChild(cb);
    const span = document.createElement('span');
    span.textContent = propertyRowLabel(i);
    const colorKey = space.type === 'property' ? space.color : space.type;
    span.style.color = LEGEND_COLORS[colorKey] || '#c6d0dc';
    row.appendChild(span);
    col.appendChild(row);
  });

  const cashRow = document.createElement('div');
  cashRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;';
  const cashLabel = document.createElement('span');
  cashLabel.textContent = 'Cash: $';
  const cashInput = document.createElement('input');
  cashInput.type = 'number';
  cashInput.min = 0;
  cashInput.max = player.cash;
  cashInput.value = sel.cash;
  cashInput.style.cssText = 'width:70px;background:#0e1420;color:#eaeef2;border:1px solid #2c3750;border-radius:4px;padding:2px 4px;';
  cashInput.oninput = () => { sel.cash = Math.max(0, Math.min(player.cash, Number(cashInput.value) || 0)); onChange(); };
  cashRow.appendChild(cashLabel);
  cashRow.appendChild(cashInput);
  col.appendChild(cashRow);

  if (player.goojCards > 0) {
    const cardRow = document.createElement('label');
    cardRow.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;margin-top:4px;';
    const cardCb = document.createElement('input');
    cardCb.type = 'checkbox';
    cardCb.checked = sel.cards > 0;
    cardCb.onchange = () => { sel.cards = cardCb.checked ? 1 : 0; onChange(); };
    cardRow.appendChild(cardCb);
    const cardLabel = document.createElement('span');
    cardLabel.textContent = 'Get Out of Jail Free card';
    cardRow.appendChild(cardLabel);
    col.appendChild(cardRow);
  }

  return col;
}

function openTradeBuilder(proposer, counterpart) {
  return new Promise((resolve) => {
    const giveSel = { props: new Set(), cash: 0, cards: 0 };
    const takeSel = { props: new Set(), cash: 0, cards: 0 };
    let sendBtn;
    function updateSendState() {
      const hasContent = giveSel.props.size || giveSel.cash || giveSel.cards
        || takeSel.props.size || takeSel.cash || takeSel.cards;
      sendBtn.disabled = !hasContent;
    }
    modalTitle.textContent = `Propose Trade: ${proposer.name} ⇄ ${counterpart.name}`;
    modalBody.innerHTML = '';
    modalBody.appendChild(buildTradeSideColumn(`${proposer.name} gives`, proposer, giveSel, updateSendState));
    modalBody.appendChild(buildTradeSideColumn(`${counterpart.name} gives`, counterpart, takeSel, updateSendState));
    modalActions.innerHTML = '';
    sendBtn = mkBtn('Send Offer', () => {
      hideModal();
      resolve({
        fromId: proposer.id,
        toId: counterpart.id,
        give: { props: [...giveSel.props], cash: giveSel.cash, cards: giveSel.cards },
        take: { props: [...takeSel.props], cash: takeSel.cash, cards: takeSel.cards },
      });
    }, true);
    modalActions.appendChild(sendBtn);
    modalActions.appendChild(mkBtn('Cancel', () => { hideModal(); resolve(null); }, false, 'secondary'));
    showModal();
  });
}

function describeTradeSide(side) {
  const parts = [];
  side.props.forEach((i) => parts.push(BOARD[i].name));
  if (side.cash) parts.push(`$${side.cash}`);
  if (side.cards) parts.push(`${side.cards} GOOJ card${side.cards > 1 ? 's' : ''}`);
  return parts.length ? parts.join(', ') : 'nothing';
}

function renderTradeThread(thread) {
  modalBody.innerHTML = '';
  thread.forEach((entry) => {
    const isYou = entry.by === 0;
    const bubble = document.createElement('div');
    bubble.style.cssText = `margin-bottom:8px;padding:8px 10px;border-radius:8px;font-size:12px;
      max-width:90%;background:${isYou ? 'rgba(44,107,237,0.25)' : 'rgba(58,66,86,0.6)'};
      margin-left:${isYou ? 'auto' : '0'};`;
    const name = document.createElement('div');
    name.style.cssText = 'font-weight:700;margin-bottom:3px;';
    name.textContent = players[entry.by].name;
    bubble.appendChild(name);
    const body = document.createElement('div');
    if (entry.offer) {
      body.innerHTML = `Offers: <b>${describeTradeSide(entry.offer.give)}</b><br>Wants: <b>${describeTradeSide(entry.offer.take)}</b>`;
    } else if (entry.type === 'accept') {
      body.textContent = 'Deal accepted!';
    } else if (entry.type === 'reject') {
      body.textContent = 'Rejected the offer.';
    } else if (entry.type === 'stalled') {
      body.textContent = 'Negotiations stalled (round limit reached).';
    }
    bubble.appendChild(body);
    modalBody.appendChild(bubble);
  });
  modalBody.scrollTop = modalBody.scrollHeight;
}

async function askHumanTradeDecision(thread, offer, round) {
  while (true) {
    const choice = await new Promise((resolve) => {
      modalTitle.textContent = 'Trade Proposal';
      renderTradeThread(thread);
      modalActions.innerHTML = '';
      modalActions.appendChild(mkBtn('Accept', () => resolve('accept')));
      modalActions.appendChild(mkBtn('Reject', () => resolve('reject'), false, 'danger'));
      modalActions.appendChild(mkBtn('Counter', () => resolve('counter'), round >= TRADE_ROUND_CAP, 'secondary'));
      showModal();
    });
    if (choice === 'counter') {
      const counter = await openTradeBuilder(players[offer.toId], players[offer.fromId]);
      if (counter) return counter;
      continue;
    }
    return choice;
  }
}

/* ---------------------------------------------------------------------
   Rendering
--------------------------------------------------------------------- */

function cellPosition(i) {
  if (i === 0) return { row: 11, col: 11 };
  if (i >= 1 && i <= 9) return { row: 11, col: 11 - i };
  if (i === 10) return { row: 11, col: 1 };
  if (i >= 11 && i <= 19) return { row: 21 - i, col: 1 };
  if (i === 20) return { row: 1, col: 1 };
  if (i >= 21 && i <= 29) return { row: 1, col: i - 19 };
  if (i === 30) return { row: 1, col: 11 };
  return { row: i - 29, col: 11 }; // 31..39
}

function buildBoard() {
  BOARD.forEach((space) => {
    const { row, col } = cellPosition(space.i);
    const cell = document.createElement('div');
    cell.className = 'cell' + ([0, 10, 20, 30].includes(space.i) ? ' corner' : '');
    cell.style.gridRow = row;
    cell.style.gridColumn = col;

    if (space.type === 'property') {
      const bar = document.createElement('div');
      bar.className = 'colorbar';
      bar.style.background = COLORS[space.color];
      cell.appendChild(bar);
    } else if (space.type === 'railroad' || space.type === 'utility') {
      const bar = document.createElement('div');
      bar.className = 'colorbar';
      bar.style.background = COLORS[space.type];
      cell.appendChild(bar);
    }

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = space.name;
    cell.appendChild(nameEl);

    if (space.price) {
      const priceEl = document.createElement('div');
      priceEl.className = 'price';
      priceEl.textContent = '$' + space.price;
      cell.appendChild(priceEl);
    }

    let housesEl = null;
    if (space.type === 'property') {
      housesEl = document.createElement('div');
      housesEl.className = 'houses';
      cell.appendChild(housesEl);
    }

    const ownerStrip = document.createElement('div');
    ownerStrip.className = 'owner-strip';
    cell.appendChild(ownerStrip);

    const tokens = document.createElement('div');
    tokens.className = 'tokens';
    cell.appendChild(tokens);

    boardEl.appendChild(cell);
    state.cellEls[space.i] = { cell, ownerStrip, tokens, houses: housesEl };
  });
}

function renderBoardOwnership() {
  for (let i = 0; i < 40; i++) {
    const st = state.props[i];
    if (!st) continue;
    const els = state.cellEls[i];
    els.ownerStrip.style.background = st.owner !== null ? PLAYER_COLORS[st.owner] : 'transparent';
    els.cell.classList.toggle('mortgaged', st.mortgaged);
    if (els.houses) {
      els.houses.innerHTML = '';
      if (st.houses === 5) {
        const h = document.createElement('div');
        h.className = 'hotel';
        els.houses.appendChild(h);
      } else {
        for (let n = 0; n < st.houses; n++) {
          const h = document.createElement('div');
          h.className = 'h';
          els.houses.appendChild(h);
        }
      }
    }
  }
}

function renderTokens() {
  for (let i = 0; i < 40; i++) state.cellEls[i].tokens.innerHTML = '';
  players.forEach((p) => {
    if (p.bankrupt) return;
    const tok = document.createElement('div');
    tok.className = 'token';
    tok.style.background = p.color;
    tok.title = p.name;
    state.cellEls[p.position].tokens.appendChild(tok);
  });
}

function renderPlayers() {
  playersEl.innerHTML = '';
  players.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'player-card' + (p.id === state.currentIndex ? ' active' : '') + (p.bankrupt ? ' bankrupt' : '');
    const dot = document.createElement('div');
    dot.className = 'player-dot';
    dot.style.background = p.color;
    card.appendChild(dot);

    const info = document.createElement('div');
    info.className = 'player-info';
    const nameEl = document.createElement('div');
    nameEl.className = 'player-name';
    nameEl.textContent = p.name + (p.bankrupt ? ' — bankrupt' : '');
    info.appendChild(nameEl);
    const cashEl = document.createElement('div');
    cashEl.className = 'player-cash';
    cashEl.textContent = `$${p.cash}`;
    info.appendChild(cashEl);
    if (p.inJail && !p.bankrupt) {
      const jailEl = document.createElement('div');
      jailEl.className = 'player-jail';
      jailEl.textContent = `In Jail (attempt ${p.jailTurns + 1}/3)`;
      info.appendChild(jailEl);
    }
    if (!p.bankrupt) {
      const owned = ownedIndicesOf(p.id);
      const propsEl = document.createElement('div');
      propsEl.className = 'player-props';
      if (owned.length === 0) {
        propsEl.textContent = 'No properties';
      } else {
        propsEl.appendChild(document.createTextNode(`${owned.length} properties: `));
        owned.forEach((i, idx) => {
          const space = BOARD[i];
          const nameSpan = document.createElement('span');
          nameSpan.textContent = space.name;
          const colorKey = space.type === 'property' ? space.color : space.type;
          nameSpan.style.color = LEGEND_COLORS[colorKey] || '#c6d0dc';
          propsEl.appendChild(nameSpan);
          if (idx < owned.length - 1) propsEl.appendChild(document.createTextNode(', '));
        });
      }
      info.appendChild(propsEl);
    }
    card.appendChild(info);
    playersEl.appendChild(card);
  });
}

function updateButtons() {
  const human = players[0];
  const notHumansTurn = state.gameOver || human.bankrupt || state.currentIndex !== 0;
  manageBtn.disabled = notHumansTurn;
  tradeBtn.disabled = notHumansTurn || players.filter((p) => p.id !== 0 && !p.bankrupt).length === 0;
}

function renderAll() {
  renderPlayers();
  renderTokens();
  renderBoardOwnership();
  updateButtons();
}

function showDiceFaces(d1, d2) {
  die1El.textContent = d1;
  die2El.textContent = d2;
}

/* ---------------------------------------------------------------------
   Movement & space resolution
--------------------------------------------------------------------- */

function movePlayerBySteps(player, steps) {
  const passed = player.position + steps >= 40;
  player.position = (player.position + steps) % 40;
  if (passed) {
    player.cash += 200;
    log(`${player.name} passed GO and collected $200.`, player.isHuman ? 'you' : '');
  }
}

function moveDirect(player, dest, opts) {
  const passGo = !opts || opts.passGo !== false;
  if (passGo && dest < player.position) {
    player.cash += 200;
    log(`${player.name} passed GO and collected $200.`, player.isHuman ? 'you' : '');
  }
  player.position = dest;
}

function sendToJail(player) {
  player.position = 10;
  player.inJail = true;
  player.jailTurns = 0;
  log(`${player.name} was sent to Jail.`, 'event');
}

function nearestOf(list, position) {
  const sorted = [...list].sort((a, b) => a - b);
  for (const x of sorted) if (x > position) return x;
  return sorted[0];
}

function computeRent(i, diceSum, utilityMultiplierOverride) {
  const space = BOARD[i];
  const st = state.props[i];
  if (space.type === 'property') {
    if (st.houses === 0) {
      const fullGroup = COLOR_GROUPS[space.color].every((j) => state.props[j].owner === st.owner);
      return fullGroup ? space.rent[0] * 2 : space.rent[0];
    }
    return space.rent[st.houses];
  }
  if (space.type === 'railroad') {
    const railroads = [5, 15, 25, 35];
    const count = railroads.filter((j) => state.props[j].owner === st.owner).length;
    return RAILROAD_RENT[count - 1];
  }
  if (space.type === 'utility') {
    if (utilityMultiplierOverride) return diceSum * utilityMultiplierOverride;
    const utils = [12, 28];
    const count = utils.filter((j) => state.props[j].owner === st.owner).length;
    return diceSum * (count === 2 ? 10 : 4);
  }
  return 0;
}

/* ---------------------------------------------------------------------
   Building (even-build rule + bank house/hotel supply)
--------------------------------------------------------------------- */

function ownsFullUnmortgagedGroup(playerId, color) {
  return COLOR_GROUPS[color].every((j) => state.props[j].owner === playerId && !state.props[j].mortgaged);
}

function canBuildHouseOn(i, playerId) {
  const space = BOARD[i];
  if (space.type !== 'property') return false;
  const st = state.props[i];
  if (st.owner !== playerId || st.mortgaged || st.houses >= 5) return false;
  if (!ownsFullUnmortgagedGroup(playerId, space.color)) return false;
  const minInGroup = Math.min(...COLOR_GROUPS[space.color].map((j) => state.props[j].houses));
  if (st.houses > minInGroup) return false; // must build evenly across the color group
  return st.houses < 4 ? state.bankHouses >= 1 : state.bankHotels >= 1;
}

function buildHouseOn(i, player) {
  const space = BOARD[i];
  const st = state.props[i];
  if (!canBuildHouseOn(i, player.id) || player.cash < space.houseCost) return false;
  player.cash -= space.houseCost;
  if (st.houses < 4) {
    state.bankHouses -= 1;
  } else {
    state.bankHotels -= 1;
    state.bankHouses += 4; // the 4 houses on the property return to the bank's pool
  }
  st.houses += 1;
  return true;
}

function canSellHouseOn(i, playerId) {
  const space = BOARD[i];
  const st = state.props[i];
  if (space.type !== 'property' || st.owner !== playerId || st.houses <= 0) return false;
  const maxInGroup = Math.max(...COLOR_GROUPS[space.color].map((j) => state.props[j].houses));
  if (st.houses < maxInGroup) return false; // must sell evenly, from the highest first
  if (st.houses === 5 && state.bankHouses < 4) return false; // not enough houses in the bank to break down the hotel
  return true;
}

function sellHouseOn(i, player) {
  const space = BOARD[i];
  const st = state.props[i];
  if (!canSellHouseOn(i, player.id)) return false;
  if (st.houses === 5) {
    state.bankHotels += 1;
    state.bankHouses -= 4;
  } else {
    state.bankHouses += 1;
  }
  st.houses -= 1;
  player.cash += space.houseCost / 2;
  return true;
}

function liquidateBuildingsOn(i) {
  const space = BOARD[i];
  const st = state.props[i];
  if (space.type !== 'property' || st.houses <= 0) return 0;
  const refund = st.houses * (space.houseCost / 2);
  if (st.houses === 5) state.bankHotels += 1;
  else state.bankHouses += st.houses;
  st.houses = 0;
  return refund;
}

function computeNetWorth(player) {
  let worth = player.cash;
  ownedIndicesOf(player.id).forEach((i) => {
    const space = BOARD[i];
    const st = state.props[i];
    worth += st.mortgaged ? space.price / 2 : space.price;
    if (space.type === 'property' && st.houses > 0) worth += st.houses * space.houseCost;
  });
  return worth;
}

async function chargePlayer(player, amount, reason, payee) {
  if (amount <= 0) return true;
  if (player.cash < amount) {
    log(`${player.name} is short of cash and must raise funds.`, 'event');
    await raiseCash(player, amount);
  }
  if (player.cash >= amount) {
    player.cash -= amount;
    if (payee) {
      payee.cash += amount;
      log(`${player.name} paid $${amount} to ${payee.name}${reason ? ` (${reason})` : ''}.`);
    } else {
      log(`${player.name} paid $${amount}${reason ? ` (${reason})` : ''}.`);
    }
    return true;
  }
  await goBankrupt(player, payee);
  return false;
}

function payBankToPlayer(player, amount) {
  player.cash += amount;
  log(`${player.name} collected $${amount}.`, player.isHuman ? 'you' : '');
}

async function raiseCash(player, targetAmount) {
  if (player.cash >= targetAmount) return;
  if (!player.isHuman) {
    let guard = 0;
    while (player.cash < targetAmount && guard < 200) {
      guard++;
      const sellable = ownedIndicesOf(player.id).filter((i) => canSellHouseOn(i, player.id));
      if (sellable.length === 0) break;
      sellHouseOn(sellable[0], player); // always sells from a property currently at the group's max, per the even-sell rule
    }
    if (player.cash < targetAmount) {
      for (const i of ownedIndicesOf(player.id)) {
        if (player.cash >= targetAmount) break;
        const st = state.props[i];
        const space = BOARD[i];
        if (!st.mortgaged && st.houses === 0) {
          st.mortgaged = true;
          player.cash += space.price / 2;
          log(`${player.name} mortgaged ${space.name} for $${space.price / 2}.`);
        }
      }
    }
    renderAll();
  } else {
    await showRaiseCashModal(player, targetAmount);
    renderAll();
  }
}

async function goBankrupt(player, payee) {
  log(`${player.name} is BANKRUPT!`, 'event');
  const owned = ownedIndicesOf(player.id);
  let buildingRefund = 0;
  for (const i of owned) {
    const st = state.props[i];
    buildingRefund += liquidateBuildingsOn(i);
    if (payee) {
      st.owner = payee.id;
    } else {
      st.owner = null;
      st.mortgaged = false;
    }
  }
  if (payee && buildingRefund > 0) {
    payee.cash += buildingRefund;
    log(`${payee.name} recovered $${buildingRefund} selling ${player.name}'s buildings back to the bank.`);
  }
  player.cash = 0;
  player.bankrupt = true;
  renderAll();
}

async function resolvePropertySpace(player, space, opts) {
  opts = opts || {};
  const st = state.props[space.i];
  if (st.owner === null) {
    let wantsBuy;
    if (player.isHuman) {
      wantsBuy = await askModal(
        space.name,
        `Unowned. Price: $${space.price}<br>Your cash: $${player.cash}`,
        [{ label: `Buy for $${space.price}`, value: true, disabled: player.cash < space.price },
         { label: 'Pass', value: false, cls: 'secondary' }]
      );
    } else {
      await sleep(400);
      wantsBuy = aiShouldBuy(player, space);
    }
    if (wantsBuy && player.cash >= space.price) {
      player.cash -= space.price;
      st.owner = player.id;
      log(`${player.name} bought ${space.name} for $${space.price}.`, player.isHuman ? 'you' : '');
      renderAll();
    } else {
      log(`${player.name} passed on ${space.name}.`);
      await runAuction(space, player.id);
    }
  } else if (st.owner === player.id) {
    log(`${player.name} owns ${space.name} already.`);
  } else if (st.mortgaged) {
    log(`${space.name} is mortgaged — no rent due.`);
  } else {
    const owner = players[st.owner];
    const rent = computeRent(space.i, state.lastDiceSum, opts.utilityMultiplierOverride) * (opts.rentMultiplier || 1);
    log(`${player.name} landed on ${space.name} (owned by ${owner.name}) — rent $${rent}.`);
    await chargePlayer(player, rent, `rent: ${space.name}`, owner);
  }
}

/* ---------------------------------------------------------------------
   Auctions
--------------------------------------------------------------------- */

function nextBidIncrement(currentBid) {
  return Math.max(10, Math.round((currentBid * 0.08) / 10) * 10);
}

function askAuctionModal(player, space, currentBid, currentBidderId) {
  return new Promise((resolve) => {
    const leaderName = currentBidderId !== null ? players[currentBidderId].name : 'no one yet';
    const minBid = currentBid + 1;
    const suggested = Math.min(player.cash, currentBid + nextBidIncrement(currentBid));
    modalTitle.textContent = `Auction: ${space.name}`;
    modalBody.innerHTML = '';
    const info = document.createElement('div');
    info.innerHTML = `Current bid: $${currentBid} (${leaderName})<br>Your cash: $${player.cash}`;
    info.style.marginBottom = '10px';
    modalBody.appendChild(info);
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:6px;';
    const label = document.createElement('span');
    label.textContent = 'Bid: $';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = minBid;
    input.max = player.cash;
    input.value = Math.max(minBid, suggested);
    input.style.cssText = 'width:90px;background:#0e1420;color:#eaeef2;border:1px solid #2c3750;border-radius:4px;padding:2px 4px;';
    row.appendChild(label);
    row.appendChild(input);
    modalBody.appendChild(row);
    modalActions.innerHTML = '';
    modalActions.appendChild(mkBtn('Place Bid', () => {
      const amount = Math.floor(Number(input.value));
      if (amount >= minBid && amount <= player.cash) { hideModal(); resolve(amount); }
    }, player.cash < minBid));
    modalActions.appendChild(mkBtn('Pass', () => { hideModal(); resolve(null); }, false, 'secondary'));
    showModal();
  });
}

function aiBidAmount(player, space, currentBid) {
  const profile = AI_PROFILES[player.id];
  const maxBid = Math.round(space.price * profile.auctionFactor);
  if (maxBid <= currentBid) return null;
  const bid = Math.min(maxBid, currentBid + nextBidIncrement(currentBid));
  if (bid <= currentBid || player.cash < bid || player.cash - bid < 50) return null;
  return bid;
}

async function runAuction(space, decliningPlayerId) {
  const allIds = players.filter((p) => !p.bankrupt).map((p) => p.id);
  if (allIds.length === 0) return;
  const startIdx = decliningPlayerId === undefined ? 0 : (Math.max(0, allIds.indexOf(decliningPlayerId)) + 1) % allIds.length;
  const orderedIds = [...allIds.slice(startIdx), ...allIds.slice(0, startIdx)];

  log(`Auction for ${space.name} begins!`, 'event');
  const activeIds = new Set(orderedIds);
  let currentBid = 0;
  let currentBidderId = null;
  let idx = 0;
  let guard = 0;

  while (activeIds.size > 1 && guard < 1000) {
    guard++;
    const pid = orderedIds[idx % orderedIds.length];
    idx++;
    if (!activeIds.has(pid) || pid === currentBidderId) continue;

    const player = players[pid];
    let bidAmount;
    if (player.isHuman) {
      bidAmount = await askAuctionModal(player, space, currentBid, currentBidderId);
    } else {
      await sleep(350);
      bidAmount = aiBidAmount(player, space, currentBid);
    }

    if (bidAmount && bidAmount > currentBid && bidAmount <= player.cash) {
      currentBid = bidAmount;
      currentBidderId = pid;
      log(`${player.name} bids $${currentBid} for ${space.name}.`, player.isHuman ? 'you' : '');
    } else {
      activeIds.delete(pid);
      log(`${player.name} drops out of the auction.`);
    }
  }

  if (currentBidderId !== null) {
    const winner = players[currentBidderId];
    winner.cash -= currentBid;
    state.props[space.i].owner = winner.id;
    log(`${winner.name} wins the auction for ${space.name} at $${currentBid}!`, winner.isHuman ? 'you' : 'event');
  } else {
    log(`No bids — ${space.name} remains unowned.`, 'event');
  }
  renderAll();
}

/* ---------------------------------------------------------------------
   Trading
--------------------------------------------------------------------- */

function propertyValue(ownerId, i) {
  const space = BOARD[i];
  const st = state.props[i];
  let value = space.price;
  if (st.mortgaged) value *= 0.5;
  if (space.type === 'property') {
    const group = COLOR_GROUPS[space.color];
    const ownedByPlayer = group.filter((j) => state.props[j].owner === ownerId).length;
    if (ownedByPlayer === group.length - 1) value *= 2.5;
    else if (ownedByPlayer > 0) value *= 1.4;
  }
  return value;
}

function offerSideValue(forPlayerId, side) {
  let v = side.cash + side.cards * 50;
  side.props.forEach((i) => { v += propertyValue(forPlayerId, i); });
  return v;
}

async function executeTrade(offer) {
  const from = players[offer.fromId];
  const to = players[offer.toId];

  offer.give.props.forEach((i) => { state.props[i].owner = to.id; });
  offer.take.props.forEach((i) => { state.props[i].owner = from.id; });

  from.cash -= offer.give.cash;
  to.cash += offer.give.cash;
  to.cash -= offer.take.cash;
  from.cash += offer.take.cash;

  from.goojCards -= offer.give.cards;
  to.goojCards += offer.give.cards;
  to.goojCards -= offer.take.cards;
  from.goojCards += offer.take.cards;

  for (const i of offer.give.props) {
    if (state.props[i].mortgaged) await chargePlayer(to, Math.round(BOARD[i].price * 0.05), `mortgage interest: ${BOARD[i].name}`);
  }
  for (const i of offer.take.props) {
    if (state.props[i].mortgaged) await chargePlayer(from, Math.round(BOARD[i].price * 0.05), `mortgage interest: ${BOARD[i].name}`);
  }
  renderAll();
}

function aiDecideOnOffer(ai, offer, round) {
  if (offer.take.cash > ai.cash) return 'reject';
  if (offer.take.cards > ai.goojCards) return 'reject';
  if (offer.take.props.some((i) => state.props[i].owner !== ai.id)) return 'reject';

  const receiveValue = offerSideValue(ai.id, offer.give);
  const giveValue = offerSideValue(ai.id, offer.take);
  const netGain = receiveValue - giveValue;

  if (netGain >= 0) return 'accept';
  if (round >= TRADE_ROUND_CAP) return 'reject';

  const proposer = players[offer.fromId];
  const shortfall = Math.ceil(-netGain);
  const maxExtraCash = Math.max(0, proposer.cash - offer.give.cash);
  const extraCash = Math.min(shortfall, maxExtraCash);
  if (extraCash <= 0) return 'reject';

  return {
    fromId: ai.id,
    toId: offer.fromId,
    give: { props: [...offer.take.props], cash: offer.take.cash, cards: offer.take.cards },
    take: { props: [...offer.give.props], cash: offer.give.cash + extraCash, cards: offer.give.cards },
  };
}

async function proposeAndNegotiate(initialOffer) {
  let offer = initialOffer;
  let round = 1;
  const thread = [{ by: offer.fromId, offer }];
  const involvesHuman = players[offer.fromId].isHuman || players[offer.toId].isHuman;
  const pairKey = [offer.fromId, offer.toId].sort((a, b) => a - b).join('-');
  state.negotiationLogs = state.negotiationLogs || {};
  state.negotiationLogs[pairKey] = thread;

  log(`${players[offer.fromId].name} proposes a trade to ${players[offer.toId].name}.`, 'event');

  while (true) {
    const responder = players[offer.toId];
    let decision;
    if (responder.isHuman) {
      decision = await askHumanTradeDecision(thread, offer, round);
    } else {
      await sleep(450);
      decision = aiDecideOnOffer(responder, offer, round);
    }

    if (decision === 'accept') {
      thread.push({ by: responder.id, type: 'accept' });
      if (involvesHuman) { renderTradeThread(thread); await sleep(700); hideModal(); }
      await executeTrade(offer);
      log(`${players[offer.fromId].name} and ${responder.name} struck a deal!`, involvesHuman ? 'you' : 'event');
      return;
    }
    if (decision === 'reject' || round >= TRADE_ROUND_CAP) {
      thread.push({ by: responder.id, type: decision === 'reject' ? 'reject' : 'stalled' });
      if (involvesHuman) { renderTradeThread(thread); await sleep(700); hideModal(); }
      log(`Trade talks between ${players[offer.fromId].name} and ${responder.name} fell through.`, 'event');
      return;
    }

    offer = decision;
    round++;
    thread.push({ by: offer.fromId, offer });
  }
}

function aiFindBuyOpportunity(ai) {
  for (const color in COLOR_GROUPS) {
    const group = COLOR_GROUPS[color];
    const ownedByAI = group.filter((j) => state.props[j].owner === ai.id);
    if (ownedByAI.length === 0 || ownedByAI.length === group.length) continue;
    const missing = group.filter((j) => state.props[j].owner !== ai.id);
    if (missing.some((j) => state.props[j].owner === null || state.props[j].houses > 0)) continue;
    const owners = new Set(missing.map((j) => state.props[j].owner));
    if (owners.size !== 1) continue;
    const ownerId = [...owners][0];
    if (ownerId === ai.id || players[ownerId].bankrupt) continue;
    return { targetId: ownerId, wantProps: missing };
  }
  return null;
}

function aiFindSellOpportunity(ai) {
  const profile = AI_PROFILES[ai.id];
  if (ai.cash >= profile.cashFloor) return null;
  const owned = tradeablePropertiesOf(ai.id).filter((i) => BOARD[i].type === 'property');
  for (const i of owned) {
    const space = BOARD[i];
    const group = COLOR_GROUPS[space.color];
    const ownedByAI = group.filter((j) => state.props[j].owner === ai.id).length;
    if (ownedByAI > 1) continue;
    const candidates = players.filter((p) => p.id !== ai.id && !p.bankrupt);
    if (candidates.length === 0) continue;
    let buyer = candidates.find((p) => group.some((j) => state.props[j].owner === p.id));
    if (!buyer) buyer = candidates[0];
    return { targetId: buyer.id, sellProp: i };
  }
  return null;
}

async function aiConsiderTrade(ai) {
  if (state.gameOver || ai.bankrupt) return;

  const buyOpp = aiFindBuyOpportunity(ai);
  if (buyOpp) {
    const profile = AI_PROFILES[ai.id];
    const value = buyOpp.wantProps.reduce((s, j) => s + propertyValue(ai.id, j), 0);
    const cashOffer = Math.min(Math.round(value * profile.auctionFactor), Math.max(0, ai.cash - 100));
    if (cashOffer > 0) {
      await proposeAndNegotiate({
        fromId: ai.id,
        toId: buyOpp.targetId,
        give: { props: [], cash: cashOffer, cards: 0 },
        take: { props: buyOpp.wantProps, cash: 0, cards: 0 },
      });
      return;
    }
  }

  const sellOpp = aiFindSellOpportunity(ai);
  if (sellOpp) {
    const price = Math.round(BOARD[sellOpp.sellProp].price * 0.9);
    await proposeAndNegotiate({
      fromId: ai.id,
      toId: sellOpp.targetId,
      give: { props: [sellOpp.sellProp], cash: 0, cards: 0 },
      take: { props: [], cash: price, cards: 0 },
    });
  }
}

async function drawCard(player, deckName) {
  const deck = deckName === 'chance' ? CHANCE_CARDS : CHEST_CARDS;
  const card = deck[Math.floor(Math.random() * deck.length)];
  log(`${player.name} drew a ${deckName === 'chance' ? 'Chance' : 'Community Chest'} card: "${card.text}"`, 'event');
  if (player.isHuman) {
    await askModal(deckName === 'chance' ? 'Chance' : 'Community Chest', card.text, [{ label: 'OK', value: true }]);
  } else {
    await sleep(500);
  }
  await applyCard(player, card);
}

async function applyCard(player, card) {
  switch (card.kind) {
    case 'advanceTo':
      moveDirect(player, card.to);
      renderAll(); await sleep(300);
      await resolveLanding(player);
      break;
    case 'nearestRailroad': {
      const dest = nearestOf([5, 15, 25, 35], player.position);
      moveDirect(player, dest);
      renderAll(); await sleep(300);
      await resolvePropertySpace(player, BOARD[dest], { rentMultiplier: 2 });
      break;
    }
    case 'nearestUtility': {
      const dest = nearestOf([12, 28], player.position);
      moveDirect(player, dest);
      renderAll(); await sleep(300);
      await resolvePropertySpace(player, BOARD[dest], { utilityMultiplierOverride: 10 });
      break;
    }
    case 'move': {
      const dest = (player.position + card.by + 40) % 40;
      moveDirect(player, dest, { passGo: false });
      renderAll(); await sleep(300);
      await resolveLanding(player);
      break;
    }
    case 'goToJail':
      sendToJail(player);
      break;
    case 'collect':
      payBankToPlayer(player, card.amount);
      break;
    case 'pay':
      await chargePlayer(player, card.amount, card.text);
      break;
    case 'payEach':
      for (const p of players) {
        if (p !== player && !p.bankrupt) await chargePlayer(player, card.amount, 'paid to ' + p.name, p);
      }
      break;
    case 'collectEach':
      for (const p of players) {
        if (p !== player && !p.bankrupt) await chargePlayer(p, card.amount, 'birthday gift', player);
      }
      break;
    case 'getOutOfJail':
      player.goojCards = (player.goojCards || 0) + 1;
      log(`${player.name} now holds a Get Out of Jail Free card.`);
      break;
    case 'repairs': {
      let houses = 0, hotels = 0;
      for (const i of ownedIndicesOf(player.id)) {
        const st = state.props[i];
        if (st.houses === 5) hotels++;
        else houses += st.houses;
      }
      const amt = houses * card.house + hotels * card.hotel;
      await chargePlayer(player, amt, 'repairs');
      break;
    }
  }
}

async function payTax(player, space) {
  let amount = space.amount;
  if (space.altPercent) {
    const altAmount = Math.round(computeNetWorth(player) * space.altPercent);
    if (player.isHuman) {
      amount = await askModal(
        space.name,
        `Pay a flat $${space.amount}, or ${space.altPercent * 100}% of your net worth?<br>Your net worth: $${computeNetWorth(player)} (${space.altPercent * 100}% = $${altAmount})`,
        [
          { label: `Pay $${space.amount}`, value: space.amount },
          { label: `Pay $${altAmount} (${space.altPercent * 100}%)`, value: altAmount },
        ]
      );
    } else {
      amount = Math.min(space.amount, altAmount);
    }
  }
  await chargePlayer(player, amount, space.name);
}

async function resolveLanding(player) {
  const space = BOARD[player.position];
  switch (space.type) {
    case 'go': log(`${player.name} is on GO.`); break;
    case 'freeparking': log(`${player.name} landed on Free Parking. Nothing happens.`); break;
    case 'jail': log(`${player.name} is just visiting Jail.`); break;
    case 'gotojail': sendToJail(player); break;
    case 'tax': await payTax(player, space); break;
    case 'chance': await drawCard(player, 'chance'); break;
    case 'chest': await drawCard(player, 'chest'); break;
    case 'property': case 'railroad': case 'utility':
      await resolvePropertySpace(player, space);
      break;
  }
}

/* ---------------------------------------------------------------------
   AI logic
--------------------------------------------------------------------- */

function aiShouldBuy(player, space) {
  const profile = AI_PROFILES[player.id];
  return player.cash - space.price >= profile.buyBuffer;
}

function aiJailDecision(player) {
  const profile = AI_PROFILES[player.id];
  if (player.goojCards > 0) return 'card';
  if (player.cash >= profile.jailPayThreshold + 50) return 'pay';
  return 'roll';
}

async function aiTakeBuildActions(player) {
  const profile = AI_PROFILES[player.id];
  let built = true;
  let guard = 0;
  while (built && guard < 30) {
    guard++;
    built = false;
    for (const color in COLOR_GROUPS) {
      const idxs = COLOR_GROUPS[color];
      const buildable = idxs.filter((i) => canBuildHouseOn(i, player.id));
      if (buildable.length === 0) continue;
      const target = buildable[0];
      const cost = BOARD[target].houseCost;
      if (player.cash - cost >= profile.buildBuffer && buildHouseOn(target, player)) {
        log(`${player.name} built ${state.props[target].houses === 5 ? 'a hotel' : 'a house'} on ${BOARD[target].name}.`);
        built = true;
      }
    }
  }
  renderAll();
}

/* ---------------------------------------------------------------------
   Turn engine
--------------------------------------------------------------------- */

function waitForRollClick() {
  rollBtn.disabled = false;
  setStatus('Your turn — roll the dice.');
  return new Promise((resolve) => { pendingRollResolve = resolve; });
}

function waitForEndTurnClick() {
  endTurnBtn.disabled = false;
  setStatus('Review your properties, then end your turn.');
  return new Promise((resolve) => { pendingEndTurnResolve = resolve; });
}

async function doRoll(player) {
  if (player.isHuman) {
    await waitForRollClick();
    rollBtn.disabled = true;
  } else {
    setStatus(`${player.name} is rolling...`);
    await sleep(600);
  }
  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  showDiceFaces(d1, d2);
  state.lastDiceSum = d1 + d2;
  log(`${player.name} rolled ${d1} + ${d2} = ${d1 + d2}${d1 === d2 ? ' (doubles!)' : ''}.`, player.isHuman ? 'you' : '');
  await sleep(400);
  return [d1, d2];
}

async function handleJail(player) {
  let action;
  if (player.isHuman) {
    action = await askModal(
      'You are in Jail',
      `Attempt ${player.jailTurns + 1} of 3. Cash: $${player.cash}. GOOJ cards: ${player.goojCards}`,
      [
        { label: 'Pay $50 to get out', value: 'pay', disabled: player.cash < 50 },
        { label: 'Use Get Out of Jail Free card', value: 'card', disabled: player.goojCards < 1 },
        { label: 'Try to roll doubles', value: 'roll', cls: 'secondary' },
      ]
    );
  } else {
    action = aiJailDecision(player);
    await sleep(400);
  }

  if (action === 'pay') {
    await chargePlayer(player, 50, 'jail fee');
    if (player.bankrupt) return 'bankrupt';
    player.inJail = false; player.jailTurns = 0;
    log(`${player.name} paid $50 and left Jail.`);
    return 'escaped-pay';
  }
  if (action === 'card') {
    player.goojCards--; player.inJail = false; player.jailTurns = 0;
    log(`${player.name} used a Get Out of Jail Free card.`);
    return 'escaped-pay';
  }

  const [d1, d2] = await doRoll(player);
  if (d1 === d2) {
    player.inJail = false; player.jailTurns = 0;
    log(`${player.name} rolled doubles and is out of Jail!`);
    movePlayerBySteps(player, d1 + d2);
    renderAll(); await sleep(400);
    await resolveLanding(player);
    return 'escaped-roll';
  }
  player.jailTurns++;
  if (player.jailTurns >= 3) {
    log(`${player.name} failed 3 times — must pay $50 and move.`);
    await chargePlayer(player, 50, 'jail fee');
    if (player.bankrupt) return 'bankrupt';
    player.inJail = false; player.jailTurns = 0;
    movePlayerBySteps(player, d1 + d2);
    renderAll(); await sleep(400);
    await resolveLanding(player);
    return 'escaped-roll';
  }
  log(`${player.name} stays in Jail.`);
  return 'stayed';
}

function checkGameOver() {
  if (state.gameOver) return true;
  const alive = players.filter((p) => !p.bankrupt);
  if (players[0].bankrupt || alive.length <= 1) {
    state.gameOver = true;
    let msg;
    if (alive.length === 1) msg = `🏆 ${alive[0].name} wins the game!`;
    else if (alive.length === 0) msg = 'Everyone went bankrupt. Game over.';
    else msg = 'You went bankrupt. Game over.';
    log(msg, 'event');
    rollBtn.disabled = true; endTurnBtn.disabled = true; manageBtn.disabled = true; tradeBtn.disabled = true;
    setStatus(msg);
    askModal('Game Over', msg, [{ label: 'New Game', value: true }]).then(() => location.reload());
    return true;
  }
  return false;
}

async function playTurn(player) {
  state.currentIndex = player.id;
  renderAll();
  if (player.bankrupt) { nextTurn(); return; }

  log(`—— ${player.name}'s turn ——`, 'event');

  if (player.inJail) {
    const result = await handleJail(player);
    if (checkGameOver()) return;
    renderAll();
    if (result === 'stayed' || result === 'bankrupt') {
      await sleep(player.isHuman ? 300 : 600);
      nextTurn();
      return;
    }
    if (result === 'escaped-roll') {
      await finishTurn(player);
      return;
    }
    // 'escaped-pay' falls through to a normal roll below
  }

  let doublesStreak = 0;
  let active = true;
  while (active) {
    const [d1, d2] = await doRoll(player);
    const isDouble = d1 === d2;
    doublesStreak = isDouble ? doublesStreak + 1 : 0;

    if (doublesStreak === 3) {
      log(`${player.name} rolled doubles three times in a row — straight to Jail!`, 'event');
      sendToJail(player);
      renderAll();
      active = false;
      break;
    }

    movePlayerBySteps(player, d1 + d2);
    renderAll();
    await sleep(400);
    await resolveLanding(player);
    if (checkGameOver()) return;
    renderAll();

    if (player.bankrupt || player.inJail) { active = false; break; }
    if (!isDouble) { active = false; }
    else { log(`${player.name} rolled doubles and goes again!`); await sleep(300); }
  }

  await finishTurn(player);
}

async function finishTurn(player) {
  if (checkGameOver()) return;
  if (!player.isHuman && !player.bankrupt) {
    await aiConsiderTrade(player);
    if (checkGameOver()) return;
    await aiTakeBuildActions(player);
  }
  renderAll();
  if (player.isHuman && !player.bankrupt) {
    await waitForEndTurnClick();
    endTurnBtn.disabled = true;
  } else {
    await sleep(500);
  }
  if (checkGameOver()) return;
  nextTurn();
}

function nextTurn() {
  if (checkGameOver()) return;
  let next = state.currentIndex;
  do { next = (next + 1) % 4; } while (players[next].bankrupt);
  playTurn(players[next]);
}

/* ---------------------------------------------------------------------
   Init
--------------------------------------------------------------------- */

function init() {
  buildBoard();
  renderAll();
  log('Welcome to Monopoly! You are playing against Ava, Ben, and Cleo.', 'you');

  rollBtn.addEventListener('click', () => {
    if (pendingRollResolve) {
      const resolve = pendingRollResolve;
      pendingRollResolve = null;
      resolve();
    }
  });
  endTurnBtn.addEventListener('click', () => {
    if (pendingEndTurnResolve) {
      const resolve = pendingEndTurnResolve;
      pendingEndTurnResolve = null;
      resolve();
    }
  });
  manageBtn.addEventListener('click', async () => {
    if (state.currentIndex !== 0 || state.gameOver) return;
    await showManagePropertiesModal(players[0]);
  });
  tradeBtn.addEventListener('click', async () => {
    if (state.currentIndex !== 0 || state.gameOver) return;
    const candidates = players.filter((p) => p.id !== 0 && !p.bankrupt);
    if (candidates.length === 0) return;
    const targetId = await askModal(
      'Propose Trade',
      'Choose a player to trade with:',
      candidates.map((p) => ({ label: p.name, value: p.id }))
    );
    const offer = await openTradeBuilder(players[0], players[targetId]);
    if (offer) await proposeAndNegotiate(offer);
    renderAll();
  });

  rollBtn.disabled = true;
  endTurnBtn.disabled = true;
  manageBtn.disabled = true;
  tradeBtn.disabled = true;

  playTurn(players[0]);
}

init();

```

_Line count: 

## serve.py

```python
#!/usr/bin/env python3
"""Dev server for the Monopoly game that disables all caching, so edits show up on a normal refresh."""
import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8843
    http.server.test(HandlerClass=NoCacheHandler, port=port)

```

_Line count: 

