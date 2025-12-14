//TODO add imports if needed

/**
 * The main function which calls the application.
 * Generates employee data and computes statistics over them.
 *
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

/**
 * Generates random employee data based on input limits.
 *
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  const maleNames = ["Jan", "Petr", "Tomáš", "Jakub", "Karel"];
  const femaleNames = ["Jana", "Anna", "Petra", "Lucie", "Kateřina"];
  const surnames = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka"];
  const workloads = [10, 20, 30, 40];

  const employees = [];

  for (let i = 0; i < dtoIn.count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";

    employees.push({
      gender,
      birthdate: generateBirthdate(dtoIn.age.min, dtoIn.age.max),
      name: gender === "male"
        ? randomItem(maleNames)
        : randomItem(femaleNames),
      surname: randomItem(surnames),
      workload: randomItem(workloads)
    });
  }

  return employees;
}

/**
 * Computes statistics over generated employees.
 *
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {
  const ages = employees.map(e => calculateAge(e.birthdate));
  const workloads = employees.map(e => e.workload);

  const total = employees.length;

  const workload10 = workloads.filter(w => w === 10).length;
  const workload20 = workloads.filter(w => w === 20).length;
  const workload30 = workloads.filter(w => w === 30).length;
  const workload40 = workloads.filter(w => w === 40).length;

  const averageAge =
    Math.round(
      (ages.reduce((a, b) => a + b, 0) / total) * 10
    ) / 10;

  const minAge = Math.round(Math.min(...ages));
  const maxAge = Math.round(Math.max(...ages));

  const medianAge = Math.round(calculateMedian(ages));

  const medianWorkload = calculateMedian(workloads);

  const women = employees.filter(e => e.gender === "female");
  const averageWomenWorkload =
    women.length === 0
      ? 0
      : Math.round(
          (women.reduce((sum, w) => sum + w.workload, 0) / women.length) * 10
        ) / 10;

  const sortedByWorkload = [...employees].sort(
    (a, b) => a.workload - b.workload
  );

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}

/* -------------------------------------------------------------------------- */
/*                                Helpers                                     */
/* -------------------------------------------------------------------------- */

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function calculateAge(birthdateISO) {
  const birth = new Date(birthdateISO);
  const now = new Date();
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return (now - birth) / msPerYear;
}

function generateBirthdate(minAge, maxAge) {
  let date;
  do {
    const age = Math.random() * (maxAge - minAge) + minAge;
    const now = new Date();
    const birthYear = now.getFullYear() - Math.floor(age);
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    date = new Date(Date.UTC(birthYear, month, day));
  } while (
    calculateAge(date.toISOString()) < minAge ||
    calculateAge(date.toISOString()) > maxAge
  );
  return date.toISOString();
}

function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
