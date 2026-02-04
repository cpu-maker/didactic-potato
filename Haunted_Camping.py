import random

# -----------------------------
# Player Stats
# -----------------------------
health = 100
hunger = 80
thirst = 80
energy = 80

wood = 0
metal = 0
plant_fibers = 0
food = 2

has_bed = False
has_spear = False
has_sword = False
has_revolver = False

car_repaired = False
day = 1

# -----------------------------
# Helper Functions
# -----------------------------
def status():
    print("\n--- STATUS ---")
    print(f"Day: {day}")
    print(f"Health: {health}")
    print(f"Hunger: {hunger}")
    print(f"Thirst: {thirst}")
    print(f"Energy: {energy}")
    print(f"Food: {food}")
    print(f"Wood: {wood}, Metal: {metal}, Plant Fibers: {plant_fibers}")
    print("----------------\n")

def check_death():
    global health
    if health <= 0:
        print("\n💀 You were killed by the horrors of the haunted forest.")
        exit()

def drain_stats():
    global hunger, thirst, energy, health
    hunger -= 5
    thirst -= 7
    energy -= 5

    if hunger <= 0 or thirst <= 0:
        health -= 10
        print("⚠️ Starvation or dehydration is hurting you.")

# -----------------------------
# Actions
# -----------------------------
def scavenge():
    global wood, metal
    print("\nYou search the forest...")
    found_wood = random.randint(1, 4)
    wood += found_wood

    if random.random() < 0.15:
        metal += 1
        print("🔩 You found a piece of metal!")

    print(f"🌲 You collected {found_wood} wood.")

def hunt():
    global food, plant_fibers, energy
    if energy < 10:
        print("You're too tired to hunt.")
        return

    print("\nYou go hunting...")
    energy -= 10

    if random.random() < 0.65:
        gained_food = random.randint(1, 3)
        food += gained_food
        print(f"🍖 You hunted and got {gained_food} food.")

        # Plant fibers rarity system
        roll = random.random()
        if roll < 0.40:
            fibers = 2
        elif roll < 0.60:
            fibers = 3
        elif roll < 0.75:
            fibers = 4
        elif roll < 0.85:
            fibers = 5
        elif roll < 0.92:
            fibers = 6
        elif roll < 0.96:
            fibers = 7
        elif roll < 0.98:
            fibers = 8
        elif roll < 0.995:
            fibers = 9
        else:
            fibers = 10

        plant_fibers += fibers
        print(f"🌿 You gathered {fibers} plant fibers.")
    else:
        print("❌ The hunt failed.")

def eat():
    global food, hunger
    if food <= 0:
        print("No food left.")
        return
    food -= 1
    hunger += 20
    print("🍎 You eat food and feel less hungry.")

def sleep():
    global energy, health
    if not has_bed:
        print("You sleep on the cold ground...")
        energy += 15
        if random.random() < 0.4:
            monster_attack()
    else:
        print("🛏️ You sleep safely in your bed.")
        energy += 40

def monster_attack():
    global health
    print("👁️ A monster attacks in the night!")
    damage = random.randint(10, 25)

    if has_revolver:
        print("🔫 You shoot the monster with your revolver!")
        return
    elif has_sword or has_spear:
        damage //= 2
        print("⚔️ You fight back with your weapon!")

    health -= damage
    print(f"💥 You take {damage} damage.")

def craft():
    global wood, metal, plant_fibers
    global has_bed, has_spear, has_sword, has_revolver

    print("\n--- Crafting ---")
    print("1. Bed (5 wood)")
    print("2. Spear (3 wood, 2 fibers)")
    print("3. Sword (5 metal, 2 wood)")
    print("4. Revolver (RARE: 6 metal)")
    choice = input("> ")

    if choice == "1" and wood >= 5:
        wood -= 5
        has_bed = True
        print("🛏️ You built a bed.")
    elif choice == "2" and wood >= 3 and plant_fibers >= 2:
        wood -= 3
        plant_fibers -= 2
        has_spear = True
        print("🗡️ You crafted a spear.")
    elif choice == "3" and metal >= 5 and wood >= 2:
        metal -= 5
        wood -= 2
        has_sword = True
        print("⚔️ You forged a sword.")
    elif choice == "4" and metal >= 6:
        metal -= 6
        has_revolver = True
        print("🔫 You assembled a revolver!")
    else:
        print("❌ You can't craft that.")

def repair_car():
    global wood, metal, car_repaired
    if wood >= 9 and metal >= 7:
        wood -= 9
        metal -= 7
        car_repaired = True
        print("\n🚗 You repaired the car and escaped the haunted forest!")
        print("🎉 YOU WIN!")
        exit()
    else:
        print("You don't have enough materials.")

# -----------------------------
# Main Game Loop
# -----------------------------
print("🏕️ HAUNTED CAMPING DISASTER 🏕️")
print("Your car broke down deep in a haunted forest...")
print("Survive, craft, and repair the car to escape.\n")

while True:
    status()
    print("Choose an action:")
    print("1. Scavenge")
    print("2. Hunt")
    print("3. Eat")
    print("4. Sleep")
    print("5. Craft")
    print("6. Repair Car")
    print("7. Quit")

    action = input("> ")

    if action == "1":
        scavenge()
    elif action == "2":
        hunt()
    elif action == "3":
        eat()
    elif action == "4":
        sleep()
    elif action == "5":
        craft()
    elif action == "6":
        repair_car()
    elif action == "7":
        print("You abandon the forest... for now.")
        break
    else:
        print("Invalid choice.")

    drain_stats()
    check_death()
    day += 1
