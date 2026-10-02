# CLAUDE.md

## Project

A browser-based Monopoly game (US board) in vanilla JavaScript: no framework, no build step, no dependencies, no tests. One human player ("You") plays against three AI opponents. Rules include buying, auctions on declined properties, even-build houses/hotels with a limited bank supply (32 houses / 12 hotels), mortgaging, Chance/Community Chest, jail, Income Tax ($200 or 10% of net worth), trading with counter-offers, and bankruptcy.

## Files

- `index.html` — Static layout: `#board`, `#sidebar` (`#players`, dice, Roll / Manage Properties / Propose Trade / End Turn buttons, `#action-area`), `#log`, and one shared `#modal`. Loads `data.js` then `app.js` as plain `<script>` tags with a `?cachebust1` query string.
- `data.js` — Static game data as globals: `COLORS`, `LEGEND_COLORS` (lighter variants for the dark sidebar), `BOARD` (40 spaces with `type`, `price`, `houseCost`, `rent[0..5]`), `COLOR_GROUPS` (derived), `RAILROAD_RENT`, `CHANCE_CARDS`, `CHEST_CARDS`, `PLAYER_COLORS`, `PLAYER_NAMES`. Its header comment still says "no trading", which is out of date.
- `app.js` — All game logic and rendering, split into banner-commented sections: State, DOM refs, Small utilities, Modal helpers, Trade UI, Rendering, Movement & space resolution, Building, Auctions, Trading, AI logic, Turn engine, Init. Ends with `init()`.
- `style.css` — Dark theme, an 11×11 CSS grid board (758px square), sidebar, log and modal styles.
- `serve.py` — Python dev server (`http.server`) that sends no-cache headers so edits appear on a normal refresh.
- `HANDOFF.md` — A verbatim copy of every source file, made for a past session handoff. It is not used at runtime and goes stale when the sources change.

## Running locally

```sh
python3 serve.py          # http://localhost:8843
python3 serve.py 9000     # custom port
```

Opening `index.html` directly also works, since there are no modules or fetches.

## Architecture notes

- Global mutable state: the `players` array (index 0 is the human, indices 1–3 are the AIs) and `state` (`props[40]` with `{owner, houses, mortgaged}` or `null` for non-ownable spaces, `currentIndex`, `bankHouses`, `bankHotels`, `gameOver`, …). `houses === 5` means a hotel.
- The game flow is a chain of `async` functions: `playTurn` → `doRoll` / `handleJail` → `resolveLanding` → `finishTurn` → `nextTurn`. Human input is awaited through Promises: `waitForRollClick` / `waitForEndTurnClick`, which resolve via `pendingRollResolve` / `pendingEndTurnResolve`, and `askModal(title, html, buttons)`, which resolves to the chosen button's `value`. AI pacing uses `await sleep(ms)`.
- All money owed goes through `chargePlayer(player, amount, reason, payee)`. It calls `raiseCash` (the human gets a modal; AIs sell houses and then mortgage automatically) and then `goBankrupt` if the player still can't pay. Call `checkGameOver()` after any step that can bankrupt someone.
- `renderAll()` redraws ownership, tokens, players and buttons from state. Call it after state changes. `log(msg, cls)` appends to the game log, which keeps the last 300 entries.

## AI opponents

Each AI's behavior comes from `AI_PROFILES` in `app.js`, keyed by player id:

| Player | Personality | buyBuffer | buildBuffer | jailPayThreshold | auctionFactor | cashFloor |
|---|---|---|---|---|---|---|
| Ava (id 1) | aggressive | 60 | 150 | 400 | 1.1 | 150 |
| Ben (id 2) | moderate | 150 | 250 | 250 | 0.85 | 200 |
| Cleo (id 3) | cautious | 250 | 350 | 150 | 0.6 | 300 |

- **Buying** (`aiShouldBuy`): buys if cash left after paying the price is ≥ `buyBuffer`.
- **Building** (`aiTakeBuildActions`, end of turn): builds while cash left after building is ≥ `buildBuffer`.
- **Jail** (`aiJailDecision`): uses a card if it has one, pays $50 if cash ≥ `jailPayThreshold + 50`, and otherwise rolls.
- **Auctions** (`aiBidAmount`): bids up to `price × auctionFactor`, always keeping at least $50 in cash.
- **Trading** (`aiConsiderTrade`, end of turn): tries to buy the missing pieces of a color group held by one other player, offering about `value × auctionFactor`. If cash drops below `cashFloor`, it offers a lone property for 90% of its price. When responding to offers (`aiDecideOnOffer`), it accepts if net value ≥ 0. Otherwise it counters by asking for more cash, for up to `TRADE_ROUND_CAP` (4) rounds.
- Income Tax: the AI always pays the cheaper of the two options.

## Conventions

- `'use strict';`, 2-space indentation, single quotes, semicolons, `const`/`let` (no `var`), arrow callbacks, template literals for log and UI text.
- Plain top-level `function` declarations, with `async` for anything that awaits input or delays. No classes and no modules; `data.js` constants are shared as globals.
- Constants are `UPPER_SNAKE_CASE`. Functions and variables are `camelCase`. DOM element refs end in `El` or `Btn`. AI functions start with `ai`.
- Sections are separated by `/* ---- Section ---- */` banner comments. Comments are sparse.
- The DOM is built imperatively (`document.createElement`, the `mkBtn` helper, `innerHTML` for modal bodies). Some one-off inline styles are set through `style.cssText`.
- Properties are referred to by board index `i` (0–39). Look up static data with `BOARD[i]` and mutable data with `state.props[i]`.
