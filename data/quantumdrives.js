/**
 * Quantum Drive Specifications
 * Data source: grafik.png
 */

const quantumDrives = [
  {
    name: "SparkFire",
    size: "S2",
    maxSpeedKmS: 171000,
    fuelRequirementMSCUperGm: 16
  },
  {
    name: "Yaeger",
    size: "S2",
    maxSpeedKmS: 278000,
    fuelRequirementMSCUperGm: 13
  },
  {
    name: "Khaos",
    size: "S2",
    maxSpeedKmS: 201000,
    fuelRequirementMSCUperGm: 16
  },
  {
    name: "Expedition",
    size: "S1",
    maxSpeedKmS: 165000,
    fuelRequirementMSCUperGm: 10
  },
  {
    name: "Kama",
    size: "S3",
    maxSpeedKmS: 319000,
    fuelRequirementMSCUperGm: 26
  }
];

// For use in Node.js
if (typeof module !== 'undefined') {
  module.exports = quantumDrives;
}

// For use in ES modules/Modern Browser
// export default quantumDrives;