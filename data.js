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
