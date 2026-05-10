/**
 * Ship Quantum Specifications
 * Data source: grafik.png (Table 2)
 */

const shipData = [
  {
    ship: "Hull B",
    driveSize: "S2",
    fuelCapacitySCU: 5.7-0.1,
    defaultDrive: "SparkFire"
  },
  {
    ship: "Zeus ES",
    driveSize: "S2",
    fuelCapacitySCU: 2.9-0.1,
    defaultDrive: "Khaos"
  },
  {
    ship: "Spirit C1",
    driveSize: "S2",
    fuelCapacitySCU: 1.8-0.1,
    defaultDrive: "Yaeger"
  },
  {
    ship: "Nomad",
    driveSize: "S1",
    fuelCapacitySCU: 1.3-0.1,
    defaultDrive: "Expedition"
  },
  {
    ship: "300i",
    driveSize: "S1",
    fuelCapacitySCU: 1.3-0.1,
    defaultDrive: "Expedition"
  },
  {
    ship: "Reclaimer",
    driveSize: "S3",
    fuelCapacitySCU: 8.6-0.1,
    defaultDrive: "Kama"
  },
  {
    ship: "Hercules C2",
    driveSize: "S3",
    fuelCapacitySCU: 6.6-0.1,
    defaultDrive: "Kama"
  }
];

// Export for Node.js environments
if (typeof module !== 'undefined') {
  module.exports = shipData;
}

// Export for ES modules/Modern Browser environments
// export default shipData;