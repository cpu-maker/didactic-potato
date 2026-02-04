// ---------- GLOBAL ----------
let difficulty, permadeath;
const logDiv = document.getElementById("log");

function log(msg) {
  logDiv.innerHTML = msg + "<br>" + logDiv.innerHTML;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------- PLAYER ----------
let player;

function resetPlayer() {
  player = {
    health: 100,
    hunger: 80,
    thirst: 80,
    energy: 80,
    food: 2,
    wood: 0,
    metal: 0,
    fibers: 0,
    hasBed: false,
    hasSpear: false,
    hasSword: false,
    hasRevolver: false,
    cursed: false,
    day: 1,
    location: "Camp"
  };
}

// ---------- START ----------
function startGame() {
  difficulty = document.getElementById("difficulty").value;
  permadeath = document.getElementById("permadeath").checked;

  resetPlayer();
  document.getElementById("setup").hidden = true;
  document.getElementById("game").hidden = false;

  log(`🎮 ${difficulty.toUpperCase()} | Permadeath: ${permadeath}`);
  updateUI();
}

// ---------- MAP ----------
const mapData = {
  Camp: "Your broken car waits silently.",
  Forest: "The forest whispers your name.",
  Ruins: "Ancient stones pulse with dread.",
  Road: "The abandoned road stretches endlessly."
};

const monsters = {
  Forest: [
    { name: "Whispering Shade", min: 10, max: 18 },
    { name: "Forest Howler", min: 15, max: 25 }
  ],
  Ruins: [
    { name: "Bone Stalker", min: 20, max: 30 },
    { name: "Cursed Watcher", min: 25, max: 35 }
  ]
};

// ---------- UI ----------
function updateUI() {
  document.getElementById("stats").innerHTML = `
    <b>Day ${player.day}</b><br>
    ❤️ ${player.health} | 🍗 ${player.hunger} | 💧 ${player.thirst} | ⚡ ${player.energy}
  `;

  document.getElementById("inventory").innerHTML = `
    🍖 Food: ${player.food}<br>
    🌲 Wood: ${player.wood}<br>
    🔩 Metal: ${player.metal}<br>
    🌿 Fibers: ${player.fibers}<br>
    🛏️ Bed: ${player.hasBed}<br>
    🔫 Revolver: ${player.hasRevolver}
  `;

  document.getElementById("map").innerHTML = `
    📍 <b>${player.location}</b><br>${mapData[player.location]}
  `;
}

// ---------- CORE ----------
function drain() {
  const mod = difficulty === "hard" ? 1.5 : difficulty === "easy" ? 0.7 : 1;

  player.hunger -= 5 * mod;
  player.thirst -= 7 * mod;
  player.energy -= 5 * mod;

  if (player.hunger <= 0 || player.thirst <= 0) {
    player.health -= 10 * mod;
    log("⚠️ Starvation or dehydration.");
  }

  if (player.health <= 0) endGame("death");

  player.day++;
  updateUI();
}

// ---------- ACTIONS ----------
function explore() {
  const keys = Object.keys(mapData);
  player.location = keys[rand(0, keys.length - 1)];
  log(`🧭 You travel to the ${player.location}.`);

  if (Math.random() < 0.3) storyEvent();
  if (Math.random() < 0.35) monsterAttack();

  drain();
}

function scavenge() {
  player.wood += rand(1, 4);
  if (Math.random() < 0.15) player.metal++;
  log("🌲 You scavenge.");
  drain();
}

function hunt() {
  if (player.energy < 10) return log("Too tired.");
  player.energy -= 10;

  if (Math.random() < 0.65) {
    player.food += rand(1, 3);
    player.fibers += rand(2, 10);
    log("🍖 Successful hunt.");
  } else log("❌ Hunt failed.");

  drain();
}

function eat() {
  if (player.food <= 0) return;
  player.food--;
  player.hunger += 20;
  log("🍎 You eat.");
  updateUI();
}

function sleep() {
  player.energy += player.hasBed ? 40 : 15;
  log(player.hasBed ? "🛏️ Safe sleep." : "😴 Restless sleep.");

  if (!player.hasBed && Math.random() < 0.4) monsterAttack();
  drain();
}

// ---------- STORY ----------
function storyEvent() {
  if (confirm("You find a strange symbol. Touch it?")) {
    player.cursed = true;
    log("☠️ A curse settles on you.");
  } else {
    log("You walk away.");
  }
}

// ---------- COMBAT ----------
function monsterAttack() {
  const pool = monsters[player.location];
  if (!pool) return;

  const m = pool[rand(0, pool.length - 1)];
  let dmg = rand(m.min, m.max);

  const action = player.hasRevolver
    ? confirm(`${m.name} attacks! Shoot?`) ? "shoot" : "flee"
    : confirm(`${m.name} attacks! Fight?`) ? "fight" : "flee";

  if (action === "shoot" && player.hasRevolver) {
    log(`🔫 You kill the ${m.name}.`);
    return;
  }

  if (action === "flee" && Math.random() < 0.5) {
    log("🏃 You escape.");
    return;
  }

  if (player.hasSword || player.hasSpear) dmg /= 2;

  player.health -= dmg;
  log(`💥 ${m.name} hits you for ${Math.floor(dmg)}.`);
}

// ---------- CRAFT ----------
function craftMenu() {
  const c = prompt("1 Bed | 2 Spear | 3 Sword | 4 Revolver");
  if (c === "1" && player.wood >= 5) player.wood -= 5, player.hasBed = true;
  if (c === "2" && player.wood >= 3 && player.fibers >= 2) player.hasSpear = true;
  if (c === "3" && player.metal >= 5 && player.wood >= 2) player.hasSword = true;
  if (c === "4" && player.metal >= 6) player.hasRevolver = true;
  updateUI();
}

// ---------- ENDINGS ----------
function repairCar() {
  if (player.wood >= 9 && player.metal >= 7) {
    endGame(player.cursed ? "cursed" : "escape");
  } else log("Not enough materials.");
}

function endGame(type) {
  document.querySelectorAll("button").forEach(b => b.disabled = true);

  if (type === "escape") log("🚗 You escape. YOU WIN.");
  if (type === "cursed") log("🕯️ You escape, but the curse follows.");
  if (type === "death") log("💀 You die alone.");

  if (!permadeath) log("Refresh to try again.");
}

// ---------- SAVE ----------
function saveGame() {
  localStorage.setItem("hauntedSave", JSON.stringify(player));
  log("💾 Saved.");
}

function loadGame() {
  const s = localStorage.getItem("hauntedSave");
  if (!s) return;
  player = JSON.parse(s);
  updateUI();
  log("📂 Loaded.");
}
