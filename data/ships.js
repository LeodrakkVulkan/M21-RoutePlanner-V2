/**
 * Ship Quantum Specifications
 * Data source: 4.10.0-12344240 QT fuel rebalance reference sheet
 * (New Quantum Tank (SCU) column, matched against each ship's stock drive)
 *
 * First 7 entries are the original curated shortlist for this app.
 * Everything below the marker is the full remaining ship roster from
 * the reference sheet (includes paint/livery variants, since their
 * quantum tank and drive can differ slightly from the base hull).
 */

const shipData = [
  {
    ship: "Hull B",
    driveSize: "S2",
    fuelCapacitySCU: 8.4,
    defaultDrive: "SparkFire"
  },
  {
    ship: "Zeus ES",
    driveSize: "S2",
    fuelCapacitySCU: 6.7,
    defaultDrive: "Khaos"
  },
  {
    ship: "Spirit C1",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Yeager"
  },
  {
    ship: "Nomad",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Expedition"
  },
  {
    ship: "300i",
    driveSize: "S1",
    fuelCapacitySCU: 0.7,
    defaultDrive: "Expedition"
  },
  {
    ship: "Reclaimer",
    driveSize: "S3",
    fuelCapacitySCU: 21.8,
    defaultDrive: "Kama"
  },
  {
    ship: "Hercules C2",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Kama"
  },

  // --- Remaining ships from the reference sheet ---
  {
    ship: "Aegis Avenger Stalker",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Expedition"
  },
  {
    ship: "Aegis Avenger Titan",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Expedition"
  },
  {
    ship: "Aegis Avenger Titan Renegade",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Expedition"
  },
  {
    ship: "Aegis Avenger Warlock",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Expedition"
  },
  {
    ship: "Aegis Eclipse",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Drift"
  },
  {
    ship: "Aegis Gladius",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Beacon"
  },
  {
    ship: "Aegis Gladius Dunlevy",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Beacon"
  },
  {
    ship: "Aegis Gladius Pirate",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Expedition"
  },
  {
    ship: "Aegis Gladius Valiant",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Beacon"
  },
  {
    ship: "Aegis Hammerhead",
    driveSize: "S3",
    fuelCapacitySCU: 19,
    defaultDrive: "Kama"
  },
  {
    ship: "Aegis Hammerhead 2949 Best In Show Edition",
    driveSize: "S3",
    fuelCapacitySCU: 19,
    defaultDrive: "Kama"
  },
  {
    ship: "Aegis Idris-M",
    driveSize: "S4",
    fuelCapacitySCU: 31.5,
    defaultDrive: "Frontline"
  },
  {
    ship: "Aegis Idris-P",
    driveSize: "S4",
    fuelCapacitySCU: 31.5,
    defaultDrive: "Frontline"
  },
  {
    ship: "Aegis Idris-P Wikelo War Special",
    driveSize: "S4",
    fuelCapacitySCU: 31.5,
    defaultDrive: "Frontline"
  },
  {
    ship: "Aegis Reclaimer 2949 Best In Show Edition",
    driveSize: "S3",
    fuelCapacitySCU: 21.8,
    defaultDrive: "Kama"
  },
  {
    ship: "Aegis Reclaimer Teach's Special",
    driveSize: "S3",
    fuelCapacitySCU: 21.8,
    defaultDrive: "Kama"
  },
  {
    ship: "Aegis Redeemer",
    driveSize: "S2",
    fuelCapacitySCU: 6.3,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Aegis Retaliator",
    driveSize: "S2",
    fuelCapacitySCU: 7,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Aegis Sabre",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Drift"
  },
  {
    ship: "Aegis Sabre Comet",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Drift"
  },
  {
    ship: "Aegis Sabre Firebird",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Drift"
  },
  {
    ship: "Aegis Sabre Firebird Wikelo War Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "VK-00"
  },
  {
    ship: "Aegis Sabre Peregrine",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Drift"
  },
  {
    ship: "Aegis Sabre Peregrine Wikelo Speedy Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "FoxFire"
  },
  {
    ship: "Aegis Sabre Raven",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Drift"
  },
  {
    ship: "Aegis Tiburon",
    driveSize: "S3",
    fuelCapacitySCU: 19,
    defaultDrive: "Pontes"
  },
  {
    ship: "Aegis Vanguard Warden",
    driveSize: "S2",
    fuelCapacitySCU: 5.5,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Aegis Vanguard Harbinger",
    driveSize: "S2",
    fuelCapacitySCU: 5.5,
    defaultDrive: "Yeager"
  },
  {
    ship: "Aegis Vanguard Hoplite",
    driveSize: "S2",
    fuelCapacitySCU: 5.1,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Aegis Vanguard Sentinel",
    driveSize: "S2",
    fuelCapacitySCU: 5.5,
    defaultDrive: "Nova"
  },
  {
    ship: "Anvil Arrow",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Beacon"
  },
  {
    ship: "Anvil Asgard",
    driveSize: "S2",
    fuelCapacitySCU: 7.7,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Anvil Asgard Wikelo War Special",
    driveSize: "S2",
    fuelCapacitySCU: 7.7,
    defaultDrive: "Yeager"
  },
  {
    ship: "Anvil C8R Pisces Rescue",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Anvil C8X Pisces Expedition",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Anvil C8 Pisces",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Anvil Carrack",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Kama"
  },
  {
    ship: "Anvil Carrack Expedition",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Kama"
  },
  {
    ship: "Anvil Gladiator",
    driveSize: "S1",
    fuelCapacitySCU: 1.1,
    defaultDrive: "Beacon"
  },
  {
    ship: "Anvil Hawk",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "Anvil F7A Hornet Mk II",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7A Hornet Mk I",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C Hornet Mk I",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-M Super Hornet Mk I",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-M Hornet Heartseeker Mk I",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-M Super Hornet Mk II",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-M Hornet Heartseeker Mk II",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-R Hornet Tracker Mk I",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-R Hornet Tracker Mk II",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-S Hornet Ghost Mk I",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C-S Hornet Ghost Mk II",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Drift"
  },
  {
    ship: "Anvil F7C Hornet Mk II",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7C Hornet Wildfire Mk I",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil F7 Hornet Mk Wikelo",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "VK-00"
  },
  {
    ship: "Anvil Hurricane",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Anvil F8C Lightning",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Anvil F8C Lightning Wikelo War Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Colossus"
  },
  {
    ship: "Anvil F8C Lightning Wikelo Sneak Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Colossus"
  },
  {
    ship: "Anvil F8C Lightning Executive Edition",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Anvil Paladin",
    driveSize: "S2",
    fuelCapacitySCU: 7,
    defaultDrive: "SparkFire"
  },
  {
    ship: "Anvil Terrapin",
    driveSize: "S1",
    fuelCapacitySCU: 1.6,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil Terrapin Medic",
    driveSize: "S1",
    fuelCapacitySCU: 1.4,
    defaultDrive: "Eos"
  },
  {
    ship: "Anvil Terrapin Medic Wikelo Savior Special",
    driveSize: "S1",
    fuelCapacitySCU: 1.4,
    defaultDrive: "Hyperion"
  },
  {
    ship: "Anvil Valkyrie",
    driveSize: "S2",
    fuelCapacitySCU: 7.7,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Anvil Valkyrie Liberator",
    driveSize: "S2",
    fuelCapacitySCU: 7.7,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Argo MOLE",
    driveSize: "S2",
    fuelCapacitySCU: 6.4,
    defaultDrive: "Huracan"
  },
  {
    ship: "ARGO MOLE Alliance",
    driveSize: "S2",
    fuelCapacitySCU: 6.4,
    defaultDrive: "Huracan"
  },
  {
    ship: "Argo MOLE Teach's Special",
    driveSize: "S2",
    fuelCapacitySCU: 6.4,
    defaultDrive: "Huracan"
  },
  {
    ship: "Argo MOTH",
    driveSize: "S2",
    fuelCapacitySCU: 6.4,
    defaultDrive: "Huracan"
  },
  {
    ship: "Argo RAFT",
    driveSize: "S2",
    fuelCapacitySCU: 7.2,
    defaultDrive: "Bolon"
  },
  {
    ship: "Argo RAFT Wikelo Work Special",
    driveSize: "S2",
    fuelCapacitySCU: 7.2,
    defaultDrive: "Huracan"
  },
  {
    ship: "Argo SRV",
    driveSize: "S2",
    fuelCapacitySCU: 6.4,
    defaultDrive: "Huracan"
  },
  {
    ship: "Banu Defender",
    driveSize: "S1",
    fuelCapacitySCU: 1.1,
    defaultDrive: "Beacon"
  },
  {
    ship: "C.O. Mustang Alpha",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "C.O. Mustang CitizenCon 2948 Edition",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "C.O. Mustang Beta",
    driveSize: "S1",
    fuelCapacitySCU: 0.7,
    defaultDrive: "Rush"
  },
  {
    ship: "C.O. Mustang Delta",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "C.O. Mustang Gamma",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "C.O. Mustang Omega",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "C.O. Nomad Teach's Special",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Expedition"
  },
  {
    ship: "Crusader Intrepid",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "FoxFire"
  },
  {
    ship: "Crusader Intrepid Wikelo Work Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Atlas"
  },
  {
    ship: "Crusader A1 Spirit",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Yeager"
  },
  {
    ship: "Crusader C1 Spirit Wikelo Special",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Hemera"
  },
  {
    ship: "Crusader Ares Star Fighter Inferno",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Crusader Ares Star Fighter Inferno Wikelo War Special",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Yeager"
  },
  {
    ship: "Crusader Ares Star Fighter Ion",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Crusader Ares Star Fighter Ion Wikelo Sneak Special",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Bolt"
  },
  {
    ship: "Crusader A2 Hercules Starlifter",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Pontes"
  },
  {
    ship: "Crusader A2 Hercules Starlifter Wikelo War Special",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Balandin"
  },
  {
    ship: "Crusader M2 Hercules Starlifter",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Pontes"
  },
  {
    ship: "Crusader Mercury Star Runner",
    driveSize: "S2",
    fuelCapacitySCU: 8.1,
    defaultDrive: "Bolon"
  },
  {
    ship: "Drake Buccaneer",
    driveSize: "S1",
    fuelCapacitySCU: 0.7,
    defaultDrive: "Rush"
  },
  {
    ship: "Drake Caterpillar",
    driveSize: "S3",
    fuelCapacitySCU: 18.8,
    defaultDrive: "Pontes"
  },
  {
    ship: "Drake Caterpillar Pirate",
    driveSize: "S3",
    fuelCapacitySCU: 18.8,
    defaultDrive: "Pontes"
  },
  {
    ship: "Drake Caterpillar 2949 Best In Show Edition",
    driveSize: "S3",
    fuelCapacitySCU: 18.8,
    defaultDrive: "Pontes"
  },
  {
    ship: "Drake Clipper",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Flood"
  },
  {
    ship: "Drake Clipper Wikelo War Special",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Siren"
  },
  {
    ship: "Drake Corsair",
    driveSize: "S2",
    fuelCapacitySCU: 8.1,
    defaultDrive: "Torrent"
  },
  {
    ship: "Drake Cutlass Black",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Drake Cutlass 2949 Best In Show Edition",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Drake Cutlass Blue",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Bolon"
  },
  {
    ship: "Drake Cutlass Red",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Bolon"
  },
  {
    ship: "Drake Cutlass Steel",
    driveSize: "S2",
    fuelCapacitySCU: 7.2,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Drake Cutter",
    driveSize: "S1",
    fuelCapacitySCU: 0.8,
    defaultDrive: "FoxFire"
  },
  {
    ship: "Drake Cutter Rambler",
    driveSize: "S1",
    fuelCapacitySCU: 0.8,
    defaultDrive: "FoxFire"
  },
  {
    ship: "Drake Cutter Scout",
    driveSize: "S1",
    fuelCapacitySCU: 0.8,
    defaultDrive: "FoxFire"
  },
  {
    ship: "Drake Golem",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Goliath"
  },
  {
    ship: "Drake Golem Alliance",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Colossus"
  },
  {
    ship: "Drake Golem Wikelo Work Special",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Goliath"
  },
  {
    ship: "Drake Golem OX",
    driveSize: "S1",
    fuelCapacitySCU: 1.1,
    defaultDrive: "Goliath"
  },
  {
    ship: "Drake Golem Teach's Special",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Atlas"
  },
  {
    ship: "Drake Herald",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Expedition"
  },
  {
    ship: "Drake Ironclad",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Kama"
  },
  {
    ship: "Drake Ironclad Assault",
    driveSize: "S3",
    fuelCapacitySCU: 20.9,
    defaultDrive: "Kama"
  },
  {
    ship: "Drake Vulture",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Goliath"
  },
  {
    ship: "Drake Vulture Teach's Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Goliath"
  },
  {
    ship: "Esperia Prowler",
    driveSize: "S2",
    fuelCapacitySCU: 7.2,
    defaultDrive: "Nova"
  },
  {
    ship: "Esperia Prowler Utility",
    driveSize: "S2",
    fuelCapacitySCU: 7.5,
    defaultDrive: "Nova"
  },
  {
    ship: "Esperia Prowler Utility Wikelo Work Special",
    driveSize: "S2",
    fuelCapacitySCU: 7.5,
    defaultDrive: "Huracan"
  },
  {
    ship: "Esperia Talon",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Drift"
  },
  {
    ship: "Esperia Talon Shrike",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Drift"
  },
  {
    ship: "Gatac Railen",
    driveSize: "S2",
    fuelCapacitySCU: 8.8,
    defaultDrive: "Bolon"
  },
  {
    ship: "Gatac Syulen",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "FoxFire"
  },
  {
    ship: "Gatac Tyilui",
    driveSize: "S2",
    fuelCapacitySCU: 9.2,
    defaultDrive: "Bolon"
  },
  {
    ship: "Grey's Basher",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Eos"
  },
  {
    ship: "Grey's Shiv",
    driveSize: "S2",
    fuelCapacitySCU: 4.1,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Kruger L-21 Wolf",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "FoxFire"
  },
  {
    ship: "Kruger L-21 Wolf Wikelo War Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "VK-00"
  },
  {
    ship: "Kruger L-21 Wolf Wikelo Sneak Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Zephyr"
  },
  {
    ship: "Kruger L-22 Alpha Wolf",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "VK-00"
  },
  {
    ship: "Kruger L-22 Alpha Wolf Wikelo War Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "VK-00"
  },
  {
    ship: "MISC Fortune",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Goliath"
  },
  {
    ship: "MISC Fortune Wikelo Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Atlas"
  },
  {
    ship: "MISC Fortune Teach's Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Goliath"
  },
  {
    ship: "MISC Freelancer",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Odyssey"
  },
  {
    ship: "MISC Freelancer DUR",
    driveSize: "S2",
    fuelCapacitySCU: 6.7,
    defaultDrive: "Odyssey"
  },
  {
    ship: "MISC Freelancer MAX",
    driveSize: "S2",
    fuelCapacitySCU: 6.4,
    defaultDrive: "Odyssey"
  },
  {
    ship: "MISC Freelancer MIS",
    driveSize: "S2",
    fuelCapacitySCU: 5.9,
    defaultDrive: "Crossfield"
  },
  {
    ship: "MISC Hull A",
    driveSize: "S1",
    fuelCapacitySCU: 1.2,
    defaultDrive: "Goliath"
  },
  {
    ship: "MISC Prospector",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Goliath"
  },
  {
    ship: "MISC Prospector Alliance",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Colossus"
  },
  {
    ship: "MISC Prospector Wikelo Work Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Colossus"
  },
  {
    ship: "Mirai Razor",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "LightFire"
  },
  {
    ship: "Mirai Razor EX",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "LightFire"
  },
  {
    ship: "Mirai Razor LX",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "LightFire"
  },
  {
    ship: "MISC Reliant Kore",
    driveSize: "S1",
    fuelCapacitySCU: 0.7,
    defaultDrive: "Rush"
  },
  {
    ship: "MISC Reliant Mako",
    driveSize: "S1",
    fuelCapacitySCU: 0.7,
    defaultDrive: "Drift"
  },
  {
    ship: "MISC Reliant Sen",
    driveSize: "S1",
    fuelCapacitySCU: 0.8,
    defaultDrive: "Goliath"
  },
  {
    ship: "MISC Reliant Tana",
    driveSize: "S1",
    fuelCapacitySCU: 0.7,
    defaultDrive: "Beacon"
  },
  {
    ship: "MISC Starfarer",
    driveSize: "S3",
    fuelCapacitySCU: 19,
    defaultDrive: "Kama"
  },
  {
    ship: "MISC Starfarer Gemini",
    driveSize: "S3",
    fuelCapacitySCU: 19,
    defaultDrive: "Pontes"
  },
  {
    ship: "MISC Starfarer Teach's Special",
    driveSize: "S3",
    fuelCapacitySCU: 19,
    defaultDrive: "Kama"
  },
  {
    ship: "MISC Starlancer MAX",
    driveSize: "S2",
    fuelCapacitySCU: 8.6,
    defaultDrive: "SparkFire"
  },
  {
    ship: "MISC Starlancer MAX Wikelo Work Special",
    driveSize: "S2",
    fuelCapacitySCU: 8.6,
    defaultDrive: "Hemera"
  },
  {
    ship: "MISC Starlancer TAC",
    driveSize: "S2",
    fuelCapacitySCU: 8.6,
    defaultDrive: "SparkFire"
  },
  {
    ship: "MISC Starlancer TAC Wikelo War Special",
    driveSize: "S2",
    fuelCapacitySCU: 8.6,
    defaultDrive: "Yeager"
  },
  {
    ship: "MISC Starlite",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Goliath"
  },
  {
    ship: "Mirai Guardian",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Mirai Guardian Wikelo War Special",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "VK-00"
  },
  {
    ship: "Mirai Guardian MX",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Mirai Guardian MX Wikelo War Special",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "XL-1"
  },
  {
    ship: "Mirai Guardian QI",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Crossfield"
  },
  {
    ship: "Mirai Guardian QI Wikelo Special",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "SunFire"
  },
  {
    ship: "Origin 100i",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Origin 125a",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Origin 135c",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Expedition"
  },
  {
    ship: "Origin 315p",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Goliath"
  },
  {
    ship: "Origin 325a",
    driveSize: "S1",
    fuelCapacitySCU: 0.7,
    defaultDrive: "Beacon"
  },
  {
    ship: "Origin 350r",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Eos"
  },
  {
    ship: "Origin 400i",
    driveSize: "S2",
    fuelCapacitySCU: 8.1,
    defaultDrive: "Torrent"
  },
  {
    ship: "Origin 600i",
    driveSize: "S2",
    fuelCapacitySCU: 9.9,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Origin 600i 2951 BIS",
    driveSize: "S2",
    fuelCapacitySCU: 9.9,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Origin 600i Executive Edition",
    driveSize: "S2",
    fuelCapacitySCU: 9.9,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Origin 600i Touring",
    driveSize: "S2",
    fuelCapacitySCU: 9.9,
    defaultDrive: "Odyssey"
  },
  {
    ship: "Origin 85X Limited",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Beacon"
  },
  {
    ship: "Origin 890 Jump",
    driveSize: "S4",
    fuelCapacitySCU: 33.1,
    defaultDrive: "Allegro"
  },
  {
    ship: "Origin M50 Interceptor",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "LightFire"
  },
  {
    ship: "Origin M80",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Torrent"
  },
  {
    ship: "RSI Apollo Medivac",
    driveSize: "S2",
    fuelCapacitySCU: 9.4,
    defaultDrive: "Odyssey"
  },
  {
    ship: "RSI Apollo Triage",
    driveSize: "S2",
    fuelCapacitySCU: 9.4,
    defaultDrive: "Odyssey"
  },
  {
    ship: "RSI Apollo Triage Wikelo Sneak Special",
    driveSize: "S2",
    fuelCapacitySCU: 9.4,
    defaultDrive: "Bolt"
  },
  {
    ship: "RSI Aurora Mk I CL",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Aurora Mk I ES",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Aurora Mk I LN",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Aurora Mk I LX",
    driveSize: "S1",
    fuelCapacitySCU: 1,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Aurora Mk I MR",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Aurora Mk I SE",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Aurora Mk II",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Constellation Andromeda",
    driveSize: "S2",
    fuelCapacitySCU: 7,
    defaultDrive: "Bolon"
  },
  {
    ship: "RSI Constellation Aquila",
    driveSize: "S2",
    fuelCapacitySCU: 8.1,
    defaultDrive: "Bolon"
  },
  {
    ship: "RSI Constellation Phoenix",
    driveSize: "S2",
    fuelCapacitySCU: 7,
    defaultDrive: "Bolon"
  },
  {
    ship: "RSI Constellation Phoenix Emerald",
    driveSize: "S2",
    fuelCapacitySCU: 7,
    defaultDrive: "Bolon"
  },
  {
    ship: "RSI Constellation Taurus",
    driveSize: "S2",
    fuelCapacitySCU: 7.7,
    defaultDrive: "Bolon"
  },
  {
    ship: "RSI Constellation Taurus Wikelo War Special",
    driveSize: "S2",
    fuelCapacitySCU: 7.7,
    defaultDrive: "XL-1"
  },
  {
    ship: "RSI Hermes",
    driveSize: "S2",
    fuelCapacitySCU: 9.4,
    defaultDrive: "Odyssey"
  },
  {
    ship: "RSI Mantis",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Beacon"
  },
  {
    ship: "RSI Meteor",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Beacon"
  },
  {
    ship: "RSI Meteor PYAM Exec",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Siren"
  },
  {
    ship: "RSI Meteor Wikelo Sneak Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Zephyr"
  },
  {
    ship: "RSI Perseus",
    driveSize: "S3",
    fuelCapacitySCU: 19.8,
    defaultDrive: "Pontes"
  },
  {
    ship: "RSI Polaris",
    driveSize: "S3",
    fuelCapacitySCU: 21.6,
    defaultDrive: "Erebos"
  },
  {
    ship: "RSI Polaris Wikelo Special",
    driveSize: "S3",
    fuelCapacitySCU: 21.6,
    defaultDrive: "Erebos"
  },
  {
    ship: "RSI Salvation",
    driveSize: "S1",
    fuelCapacitySCU: 0.8,
    defaultDrive: "Colossus"
  },
  {
    ship: "RSI Scorpius",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Scorpius Antares",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Eos"
  },
  {
    ship: "RSI Scorpius Wikelo Sneak Special",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Spectre"
  },
  {
    ship: "RSI Zeus Mk II CL",
    driveSize: "S2",
    fuelCapacitySCU: 6.4,
    defaultDrive: "Khaos"
  },
  {
    ship: "RSI Zeus Mk II ES Wikelo Work Special",
    driveSize: "S2",
    fuelCapacitySCU: 6.7,
    defaultDrive: "Hemera"
  },
  {
    ship: "Esperia Blade",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "Vanduul Blade",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Rush"
  },
  {
    ship: "Esperia Glaive",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Beacon"
  },
  {
    ship: "Vanduul Glaive",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Beacon"
  },
  {
    ship: "Vanduul Scythe",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Beacon"
  },
  {
    ship: "Esperia Stinger",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Bolon"
  },
  {
    ship: "Vanduul Stinger",
    driveSize: "S2",
    fuelCapacitySCU: 4.6,
    defaultDrive: "Bolon"
  },
  {
    ship: "Aopoa Khartu-al",
    driveSize: "S1",
    fuelCapacitySCU: 0.6,
    defaultDrive: "Eos"
  },
  {
    ship: "Aopoa San'tok.y?i",
    driveSize: "S1",
    fuelCapacitySCU: 0.9,
    defaultDrive: "Beacon"
  }
];

// Export for Node.js environments
if (typeof module !== 'undefined') {
  module.exports = shipData;
}

// Export for ES modules/Modern Browser environments
// export default shipData;
