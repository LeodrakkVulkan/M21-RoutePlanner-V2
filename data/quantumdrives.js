/**
 * Quantum Drive Specifications
 * Data source: 4.10.0-12344240 QT fuel rebalance reference sheet
 * (Alpha Patch 4.9.0-12302499 -> 4.10.0-12344240 comparison)
 * Max speeds are unchanged in 4.10; consumption rates (SCU/Gm) increased.
 *
 * First 5 entries are the ones originally wired into this app's ship
 * dropdown (see ships.js defaultDrive). Everything below the marker is
 * the full remaining drive roster from the reference sheet, added for
 * ships that aren't in the curated ship list yet.
 */

const quantumDrives = [
  {
    name: "SparkFire",
    size: "S2",
    maxSpeedKmS: 171000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Yeager",
    size: "S2",
    maxSpeedKmS: 278000,
    fuelRequirementMSCUperGm: 21
  },
  {
    name: "Khaos",
    size: "S2",
    maxSpeedKmS: 201000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Expedition",
    size: "S1",
    maxSpeedKmS: 165000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Kama",
    size: "S3",
    maxSpeedKmS: 319000,
    fuelRequirementMSCUperGm: 36
  },

  // --- Remaining drives from the reference sheet ---
  {
    name: "FoxFire",
    size: "S1",
    maxSpeedKmS: 168000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "LightFire",
    size: "S1",
    maxSpeedKmS: 140000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "SunFire",
    size: "S2",
    maxSpeedKmS: 205000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Burst",
    size: "S1",
    maxSpeedKmS: 198000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Flood",
    size: "S1",
    maxSpeedKmS: 138000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Rush",
    size: "S1",
    maxSpeedKmS: 165000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Cascade",
    size: "S2",
    maxSpeedKmS: 168000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Flash",
    size: "S2",
    maxSpeedKmS: 242000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Torrent",
    size: "S2",
    maxSpeedKmS: 201000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Echo",
    size: "S3",
    maxSpeedKmS: 205000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Fissure",
    size: "S3",
    maxSpeedKmS: 246000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Impulse",
    size: "S3",
    maxSpeedKmS: 295000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Colossus",
    size: "S1",
    maxSpeedKmS: 257000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Goliath",
    size: "S1",
    maxSpeedKmS: 215000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Vulcan",
    size: "S1",
    maxSpeedKmS: 179000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Bolon",
    size: "S2",
    maxSpeedKmS: 262000,
    fuelRequirementMSCUperGm: 20
  },
  {
    name: "Huracan",
    size: "S2",
    maxSpeedKmS: 314000,
    fuelRequirementMSCUperGm: 20
  },
  {
    name: "Yaluk",
    size: "S2",
    maxSpeedKmS: 218000,
    fuelRequirementMSCUperGm: 20
  },
  {
    name: "Agni",
    size: "S3",
    maxSpeedKmS: 383000,
    fuelRequirementMSCUperGm: 36
  },
  {
    name: "Vesta",
    size: "S3",
    maxSpeedKmS: 266000,
    fuelRequirementMSCUperGm: 36
  },
  {
    name: "Allegro",
    size: "S4",
    maxSpeedKmS: 512000,
    fuelRequirementMSCUperGm: 55
  },
  {
    name: "Drift",
    size: "S1",
    maxSpeedKmS: 140000,
    fuelRequirementMSCUperGm: 4
  },
  {
    name: "Spectre",
    size: "S1",
    maxSpeedKmS: 196000,
    fuelRequirementMSCUperGm: 4
  },
  {
    name: "Zephyr",
    size: "S1",
    maxSpeedKmS: 168000,
    fuelRequirementMSCUperGm: 4
  },
  {
    name: "Bolt",
    size: "S2",
    maxSpeedKmS: 205000,
    fuelRequirementMSCUperGm: 18
  },
  {
    name: "Nova",
    size: "S2",
    maxSpeedKmS: 171000,
    fuelRequirementMSCUperGm: 18
  },
  {
    name: "Spicule",
    size: "S2",
    maxSpeedKmS: 240000,
    fuelRequirementMSCUperGm: 18
  },
  {
    name: "Atlas",
    size: "S1",
    maxSpeedKmS: 231000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Eos",
    size: "S1",
    maxSpeedKmS: 165000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Hyperion",
    size: "S1",
    maxSpeedKmS: 198000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Aither",
    size: "S2",
    maxSpeedKmS: 242000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Hemera",
    size: "S2",
    maxSpeedKmS: 282000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Erebos",
    size: "S3",
    maxSpeedKmS: 344000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Metis",
    size: "S3",
    maxSpeedKmS: 246000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Tyche",
    size: "S3",
    maxSpeedKmS: 295000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Voyage",
    size: "S1",
    maxSpeedKmS: 198000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Wayfare",
    size: "S1",
    maxSpeedKmS: 138000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Odyssey",
    size: "S2",
    maxSpeedKmS: 201000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Quest",
    size: "S2",
    maxSpeedKmS: 168000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Sojourn",
    size: "S2",
    maxSpeedKmS: 242000,
    fuelRequirementMSCUperGm: 22
  },
  {
    name: "Drifter",
    size: "S3",
    maxSpeedKmS: 205000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Ranger",
    size: "S3",
    maxSpeedKmS: 295000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Wanderer",
    size: "S3",
    maxSpeedKmS: 246000,
    fuelRequirementMSCUperGm: 39
  },
  {
    name: "Beacon",
    size: "S1",
    maxSpeedKmS: 190000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Siren",
    size: "S1",
    maxSpeedKmS: 228000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "VK-00",
    size: "S1",
    maxSpeedKmS: 266000,
    fuelRequirementMSCUperGm: 5
  },
  {
    name: "Crossfield",
    size: "S2",
    maxSpeedKmS: 231000,
    fuelRequirementMSCUperGm: 21
  },
  {
    name: "XL-1",
    size: "S2",
    maxSpeedKmS: 324000,
    fuelRequirementMSCUperGm: 21
  },
  {
    name: "Balandin",
    size: "S3",
    maxSpeedKmS: 339000,
    fuelRequirementMSCUperGm: 38
  },
  {
    name: "Pontes",
    size: "S3",
    maxSpeedKmS: 282000,
    fuelRequirementMSCUperGm: 38
  },
  {
    name: "TS-2",
    size: "S3",
    maxSpeedKmS: 395000,
    fuelRequirementMSCUperGm: 38
  },
  {
    name: "Frontline",
    size: "S4",
    maxSpeedKmS: 718000,
    fuelRequirementMSCUperGm: 53
  }
];

// For use in Node.js
if (typeof module !== 'undefined') {
  module.exports = quantumDrives;
}

// For use in ES modules/Modern Browser
// export default quantumDrives;
