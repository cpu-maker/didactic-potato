// ------------------ PLAYER ------------------
let player = {
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
  day: 1
};

// ------------------ UI ------------------
const statsDiv = document.getElementById("stats");
const inventoryDiv = document.getElementById("inventory");
const logDiv = document.getElementById("log");

function log(msg) {
  logDiv.innerHTML = msg + "<br>" + logDiv.innerHTML;
}

// ------------------ UPDATE UI ------------------
function updateUI() {
  statsDiv.innerHTML = `
    <strong>Day ${player.day}</strong><br>
    ❤️ Health: ${player.health}<br>
    🍗 Hunger: ${player.hunger}<br>
    💧 Thirst: ${player.thirst}<br>
    ⚡ Energy: ${player.energy}
  `;

  inventoryDiv.innerHTML = `
    🎒 <strong>Inventory</strong><br>
    🍖 Food: ${player.food}<br>
    🌲 Wood: ${player.wood}<br>
    🔩 Metal: ${player.metal}<br>
    🌿 Fibers: ${player.fibers}<br>
    🛏️ Bed: ${player.hasBed ? "Yes" : "No"}<br>
    🗡️ Spear: ${player.hasSpear ? "Yes" : "No"}<br>
    ⚔️ Sword: ${player.hasSword ? "Yes" : "No"}<br>
    🔫 Revolver: ${player.hasRevolver ? "Yes" : "No"}
  `;
}

// ------------------ CORE SYSTEMS ------------------
function drain() {
  player.hunger -= 5;
  player.thirst -= 7;
  player.energy -= 5;

  if (player.hunger <= 0 || player.thirst <= 0) {
    player.health -= 10;
    log("⚠️ Starvation or dehydration hurts you.");
  }

  if (player.health <= 0) {
    log("💀 You died in the haunted forest.");
    endGame();
  }

  player.day++;
  updateUI();
}

function endGame() {
  document.querySelectorAll("button").forEach(b => b.disabled = true);
}

// ------------------ ACTIONS ------------------
function scavenge() {
  const woodFound = rand(1, 4);
  player.wood += woodFound;

  if (Math.random() < 0.15) {
    player.metal++;
    log("🔩 You found metal.");
  }

  log(`🌲 Collected ${woodFound} wood.`);
  drain();
}

function hunt() {
  if (player.energy < 10) {
    log("Too tired to hunt.");
    return;
  }

  player.energy -= 10;

  if (Math.random() < 0.65) {
    const food = rand(1, 3);
    player.food += food;

    const roll = Math.random();
    const fibers =
      roll < 0.40 ? 2 :
      roll < 0.60 ? 3 :
      roll < 0.75 ? 4 :
      roll < 0.85 ? 5 :
      roll < 0.92 ? 6 :
      roll < 0.96 ? 7 :
      roll < 0.98 ? 8 :
      roll < 0.995 ? 9 : 10;

    player.fibers += fibers;
    log(`🍖 Hunted ${food} food & 🌿 ${fibers} fibers.`);
  } else {
    log("❌ Hunt failed.");
  }

  drain();
}

function eat() {
  if (player.food <= 0) {
    log("No food.");
    return;
  }
  player.food--;
  player.hunger += 20;
  log("🍎 You eat.");
  updateUI();
}

function sleep() {
  if (!player.hasBed) {
    player.energy += 15;
    log("😴 Sleeping on the ground...");
    if (Math.random() < 0.4) monsterAttack();
  } else {
    player.energy += 40;
    log("🛏️ Safe sleep in bed.");
  }
  drain();
}

// ------------------ MONSTERS ------------------
const monsters = [
  { name: "Whispering Shade", dmg: [10, 18] },
  { name: "Bone Stalker", dmg: [15, 25] },
  { name: "Forest Howler", dmg: [20, 30] }
];

function monsterAttack() {
  const m = monsters[rand(0, monsters.length - 1)];
  let damage = rand(m.dmg[0], m.dmg[1]);

  log(`👁️ ${m.name} attacks!`);

  if (player.hasRevolver) {
    log("🔫 You shoot it dead.");
    return;
  }
  if (player.hasSword || player.hasSpear) {
    damage = Math.floor(damage / 2);
    log("⚔️ You fight back.");
  }

  player.health -= damage;
  log(`💥 Took ${damage} damage.`);
}

// ------------------ CRAFTING ------------------
function craftMenu() {
  const c = prompt(
    "Craft:\n1 Bed (5 wood)\n2 Spear (3 wood, 2 fibers)\n3 Sword (5 metal, 2 wood)\n4 Revolver (6 metal)"
  );

  if (c === "1" && player.wood >= 5) {
    player.wood -= 5;
    player.hasBed = true;
    log("🛏️ Bed crafted.");
  } else if (c === "2" && player.wood >= 3 && player.fibers >= 2) {
    player.wood -= 3;
    player.fibers -= 2;
    player.hasSpear = true;
    log("🗡️ Spear crafted.");
  } else if (c === "3" && player.metal >= 5 && player.wood >= 2) {
    player.metal -= 5;
    player.wood -= 2;
    player.hasSword = true;
    log("⚔️ Sword forged.");
  } else if (c === "4" && player.metal >= 6) {
    player.metal -= 6;
    player.hasRevolver = true;
    log("🔫 Revolver assembled.");
  } else {
    log("❌ Crafting failed.");
  }

  updateUI();
}

// ------------------ WIN CONDITION ------------------
function repairCar() {
  if (player.wood >= 9 && player.metal >= 7) {
    log("🚗 Car repaired.");
    log("🎉 YOU ESCAPED!");
    endGame();
  } else {
    log("Not enough materials.");
  }
}

// ------------------ SAVE / LOAD ------------------
function saveGame() {
  localStorage.setItem("hauntedSave", JSON.stringify(player));
  log("💾 Game saved.");
}

function loadGame() {
  const save = localStorage.getItem("hauntedSave");
  if (!save) {
    log("No save found.");
    return;
  }
  player = JSON.parse(save);
  log("📂 Game loaded.");
  updateUI();
}

// ------------------ UTILS ------------------
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

updateUI();
