let health = 100;
let hunger = 80;
let thirst = 80;
let energy = 80;

let wood = 0;
let metal = 0;
let plantFibers = 0;
let food = 2;

let hasBed = false;
let hasSpear = false;
let hasSword = false;
let hasRevolver = false;

let day = 1;

const logDiv = document.getElementById("log");
const statsDiv = document.getElementById("stats");

function log(msg) {
  logDiv.innerHTML = msg + "<br>" + logDiv.innerHTML;
}

function updateStats() {
  statsDiv.innerHTML = `
  <strong>Day ${day}</strong><br>
  ❤️ Health: ${health}<br>
  🍗 Hunger: ${hunger}<br>
  💧 Thirst: ${thirst}<br>
  ⚡ Energy: ${energy}<br>
  🍖 Food: ${food}<br>
  🌲 Wood: ${wood} | 🔩 Metal: ${metal} | 🌿 Fibers: ${plantFibers}
  `;
}

function drainStats() {
  hunger -= 5;
  thirst -= 7;
  energy -= 5;

  if (hunger <= 0 || thirst <= 0) {
    health -= 10;
    log("⚠️ Starvation or dehydration hurts you.");
  }

  if (health <= 0) {
    log("💀 You were killed by the haunted forest.");
    disableGame();
  }

  day++;
  updateStats();
}

function disableGame() {
  document.querySelectorAll("button").forEach(b => b.disabled = true);
}

function scavenge() {
  let foundWood = Math.floor(Math.random() * 4) + 1;
  wood += foundWood;

  if (Math.random() < 0.15) {
    metal++;
    log("🔩 You found metal.");
  }

  log(`🌲 You collected ${foundWood} wood.`);
  drainStats();
}

function hunt() {
  if (energy < 10) {
    log("Too tired to hunt.");
    return;
  }

  energy -= 10;

  if (Math.random() < 0.65) {
    let gainedFood = Math.floor(Math.random() * 3) + 1;
    food += gainedFood;

    let roll = Math.random();
    let fibers =
      roll < 0.40 ? 2 :
      roll < 0.60 ? 3 :
      roll < 0.75 ? 4 :
      roll < 0.85 ? 5 :
      roll < 0.92 ? 6 :
      roll < 0.96 ? 7 :
      roll < 0.98 ? 8 :
      roll < 0.995 ? 9 : 10;

    plantFibers += fibers;

    log(`🍖 Hunted ${gainedFood} food and 🌿 ${fibers} fibers.`);
  } else {
    log("❌ Hunt failed.");
  }

  drainStats();
}

function eat() {
  if (food <= 0) {
    log("No food left.");
    return;
  }
  food--;
  hunger += 20;
  log("🍎 You eat food.");
  updateStats();
}

function sleep() {
  if (!hasBed) {
    energy += 15;
    log("😴 You sleep on the cold ground.");
    if (Math.random() < 0.4) monsterAttack();
  } else {
    energy += 40;
    log("🛏️ You sleep safely in your bed.");
  }
  drainStats();
}

function monsterAttack() {
  let damage = Math.floor(Math.random() * 16) + 10;

  if (hasRevolver) {
    log("🔫 You shoot the monster.");
    return;
  }
  if (hasSword || hasSpear) {
    damage = Math.floor(damage / 2);
    log("⚔️ You fight back.");
  }

  health -= damage;
  log(`👁️ Monster attacks for ${damage} damage.`);
}

function craft() {
  let choice = prompt(
    "Craft:\n1 Bed (5 wood)\n2 Spear (3 wood, 2 fibers)\n3 Sword (5 metal, 2 wood)\n4 Revolver (6 metal)"
  );

  if (choice === "1" && wood >= 5) {
    wood -= 5;
    hasBed = true;
    log("🛏️ Bed crafted.");
  } else if (choice === "2" && wood >= 3 && plantFibers >= 2) {
    wood -= 3;
    plantFibers -= 2;
    hasSpear = true;
    log("🗡️ Spear crafted.");
  } else if (choice === "3" && metal >= 5 && wood >= 2) {
    metal -= 5;
    wood -= 2;
    hasSword = true;
    log("⚔️ Sword crafted.");
  } else if (choice === "4" && metal >= 6) {
    metal -= 6;
    hasRevolver = true;
    log("🔫 Revolver assembled.");
  } else {
    log("❌ Crafting failed.");
  }

  updateStats();
}

function repairCar() {
  if (wood >= 9 && metal >= 7) {
    log("🚗 You repaired the car and escaped!");
    log("🎉 YOU WIN!");
    disableGame();
  } else {
    log("Not enough materials to repair the car.");
  }
}

updateStats();
