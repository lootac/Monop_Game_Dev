# CLAUDE.md

## Project

A browser-based Monopoly game (US board) in vanilla JavaScript: no framework, no build step, no dependencies, no tests. One human player ("You") plays against three AI opponents. Rules include buying, auctions on declined properties, even-build houses/hotels with a limited bank supply (32 houses / 12 hotels), mortgaging, Chance/Community Chest, jail, Income Tax ($200 or 10% of net worth), trading with counter-offers, and bankruptcy.

There are two versions of the game:
- **Multi-file version** (`index.html` + `data.js` + `app.js` + `style.css`): the base game.
- **`monopoly.html`**: a self-contained single file with all CSS and JS inline. It has the same game plus the **Books** panel (double-entry accounting) and the **Game Advisor**. Its game logic is a modified copy of `app.js`, not a shared module, so a fix to the base game has to be made in both places.

## Files

- `index.html` — Static layout: `#board`, `#sidebar` (`#players`, dice, Roll / Manage Properties / Propose Trade / End Turn buttons, `#action-area`), `#log`, and one shared `#modal`. Loads `data.js` then `app.js` as plain `<script>` tags with a `?cachebust1` query string.
- `data.js` — Static game data as globals: `COLORS`, `LEGEND_COLORS` (lighter variants for the dark sidebar), `BOARD` (40 spaces with `type`, `price`, `houseCost`, `rent[0..5]`), `COLOR_GROUPS` (derived), `RAILROAD_RENT`, `CHANCE_CARDS`, `CHEST_CARDS`, `PLAYER_COLORS`, `PLAYER_NAMES`. Its header comment still says "no trading", which is out of date.
- `app.js` — All game logic and rendering, split into banner-commented sections: State, DOM refs, Small utilities, Modal helpers, Trade UI, Rendering, Movement & space resolution, Building, Auctions, Trading, AI logic, Turn engine, Init. Ends with `init()`.
- `style.css` — Dark theme, an 11×11 CSS grid board (758px square), sidebar, log and modal styles.
- `serve.py` — Python dev server (`http.server`) that sends no-cache headers so edits appear on a normal refresh.
- `monopoly.html` — The single-file version with Books and the Advisor (see below). It contains a `<style>` block, a data `<script>` (a copy of `data.js`) and a game `<script>` (an extended `app.js`). It adds Open Books / Ask Advisor buttons, and its `chargePlayer` takes an extra `category` argument (an expense account key, default `'fees'`) so each payment posts a journal entry.
- `HANDOFF.md` — A verbatim copy of every source file, made for a past session handoff. It is not used at runtime and goes stale when the sources change.

## Running locally

```sh
python3 serve.py          # http://localhost:8843
python3 serve.py 9000     # custom port
```

Then open `/` (multi-file version) or `/monopoly.html` (Books version). Opening either file directly also works, since there are no modules and no local fetches. The Advisor does need network access to `api.anthropic.com`.

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

## Books panel (`monopoly.html` only)

Double-entry accounting for the human player (id 0, `HUMAN_ID`) only, at historical cost.

- **Chart of accounts** (`ACCOUNTS`): assets (1000 Cash, 1100 Real Estate, 1200 Improvements), a liability (2000 Mortgages Payable), equity (3000 Owner's Capital, 3100 Retained Earnings), revenue (4000 GO Salary, 4100 Rent Income, 4200 Windfall, 4300 Gain on Disposal) and expenses (5000 Rent, 5100 Tax, 5200 Interest, 5300 Fees & Penalties, 5400 Loss on Disposal).
- **Posting**: every event that moves value calls a `bk*` helper (`bkOpening`, `bkGo`, `bkBuy`, `bkAuctionWin`, `bkBuild`, `bkUnmortgage`, `bkCharge`, …). Each helper calls `post(desc, lines, opts)` with `{acct, dr, cr}` lines. `post` updates `books.bal` (debits minus credits), appends to `books.entries`, shows a toast, and re-renders the open panel or window. `books.basis[i]` tracks each property's cost so sales, trades and bankruptcy can book a gain or loss.
- **Periods**: one round (each player's turn once) is one game-month. `booksAdvancePeriod()` runs at the start of the human's turn; the first call posts the opening entry (Dr Cash 1500 / Cr Capital 1500). After every 12th month, `runYearEndClose` closes revenue and expense accounts into Retained Earnings. Periods are labeled `Y1-M01`.
- **Panel** (shared modal, `books-mode`): Journal, Ledger (T-accounts) and Statements tabs. Statements show the Balance Sheet, Income Statement and Cash Flow (operating / investing / financing), worked out by replaying the journal up to a chosen month (`computeStatements`). The game-over modal also has a View Books button.
- **Spreadsheet**: "Open Live Spreadsheet" opens a pop-up window styled like a workbook that updates as entries post. "Download Excel" builds a real `.xlsx` with no library (hand-written OOXML plus a stored zip, `sheetsToXlsxBlob`). Both have seven sheets: Chart of Accounts, Journal, Ledger, Trial Balance, Balance Sheet, Profit & Loss, Cash Flow. `lineReason` adds a plain-English explanation of why each line is a debit or a credit.

## Game Advisor (`monopoly.html` only)

"Ask Advisor" sends a text summary of the game state (`advisorGameStateText`) to the Anthropic Messages API, calling it directly from the browser with the `anthropic-dangerous-direct-browser-access` header, and shows the coaching it returns. The player provides their own API key. The key and the chosen model (`ADVISOR_MODELS`) are saved in `localStorage` (`monopoly_advisor_key`, `monopoly_advisor_model`).

## Conventions

- `'use strict';`, 2-space indentation, single quotes, semicolons, `const`/`let` (no `var`), arrow callbacks, template literals for log and UI text.
- Plain top-level `function` declarations, with `async` for anything that awaits input or delays. No classes and no modules; `data.js` constants are shared as globals.
- Constants are `UPPER_SNAKE_CASE`. Functions and variables are `camelCase`. DOM element refs end in `El` or `Btn`. AI functions start with `ai`.
- Sections are separated by `/* ---- Section ---- */` banner comments. Comments are sparse.
- The DOM is built imperatively (`document.createElement`, the `mkBtn` helper, `innerHTML` for modal bodies). Some one-off inline styles are set through `style.cssText`.
- Properties are referred to by board index `i` (0–39). Look up static data with `BOARD[i]` and mutable data with `state.props[i]`.
