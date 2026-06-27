/* === SECCION: CALCULADORA === */
const squareMeters = document.getElementById("squareMeters");
const m2Value = document.getElementById("m2Value");
const city = document.getElementById("city");
const propertyType = document.getElementById("propertyType");
const estrato = document.getElementById("estrato");
const floorLevel = document.getElementById("floorLevel");
const locationZone = document.getElementById("locationZone");
const hasParking = document.getElementById("hasParking");
const hasPool = document.getElementById("hasPool");
const hasElevator = document.getElementById("hasElevator");
const monthlyIncome = document.getElementById("monthlyIncome");
const incomeRange = document.getElementById("incomeRange");
const resultFactors = document.getElementById("resultFactors");

if (squareMeters && m2Value && city && propertyType && estrato && floorLevel && locationZone && hasParking && hasPool && hasElevator && monthlyIncome && incomeRange && resultFactors) {
  const NIGHTS_PER_MONTH = 30.4;

  const cityData = {
    bogota: { adr: 148000, occupancy: 0.58 },
    medellin: { adr: 209000, occupancy: 0.63 },
    cartagena: { adr: 353000, occupancy: 0.56 },
    santa_marta: { adr: 262000, occupancy: 0.47 },
    cali: { adr: 139000, occupancy: 0.48 },
    barranquilla: { adr: 201000, occupancy: 0.43 },
    san_andres: { adr: 320000, occupancy: 0.55 },
    eje_cafetero: { adr: 180000, occupancy: 0.50 },
    ibague: { adr: 140000, occupancy: 0.48 },
    guamo: { adr: 110000, occupancy: 0.42 }
  };

  const typeFactors = {
    studio: 0.78,
    one: 0.9,
    two: 1,
    three: 1.35,
    villa: 2.1
  };

  const estratoFactors = {
    1: 0.78,
    2: 0.86,
    3: 0.94,
    4: 1,
    5: 1.12,
    6: 1.28
  };

  const floorFactors = {
    ground: 0.95,
    low: 0.98,
    mid: 1,
    high: 1.05,
    penthouse: 1.15
  };

  const zoneFactors = {
    standard: 1,
    tourist: 1.15,
    premium: 1.45
  };

  const estratoLabels = {
    1: "Estrato 1",
    2: "Estrato 2",
    3: "Estrato 3",
    4: "Estrato 4",
    5: "Estrato 5",
    6: "Estrato 6"
  };

  const floorLabels = {
    ground: "Planta baja",
    low: "Pisos 1-3",
    mid: "Pisos 4-8",
    high: "Pisos 9+",
    penthouse: "Penthouse"
  };

  const zoneLabels = {
    standard: "Zona estándar",
    tourist: "Zona turística",
    premium: "Zona premium"
  };

  let currentIncome = 0;

  function formatCop(value) {
    return `$ ${Math.round(value).toLocaleString("es-CO")} COP`;
  }

  function calculateIncome() {
    const market = cityData[city.value];
    const m2 = Number(squareMeters.value);
    const m2Factor = Math.max(0.85, Math.min(1.2, 0.9 + (m2 - 60) / 400));

    let adrMultiplier = typeFactors[propertyType.value]
      * estratoFactors[estrato.value]
      * floorFactors[floorLevel.value]
      * zoneFactors[locationZone.value]
      * m2Factor;

    if (hasParking.checked) adrMultiplier *= 1.04;
    if (hasPool.checked) adrMultiplier *= 1.07;
    if (hasElevator.checked) adrMultiplier *= 1.03;
    else if (["high", "penthouse"].includes(floorLevel.value)) adrMultiplier *= 0.9;

    const adjustedAdr = market.adr * adrMultiplier;
    const grossMonthly = adjustedAdr * market.occupancy * NIGHTS_PER_MONTH;
    return grossMonthly * 0.85;
  }

  function renderFactorPills() {
    const pills = [
      estratoLabels[estrato.value],
      floorLabels[floorLevel.value],
      zoneLabels[locationZone.value]
    ];

    if (hasParking.checked) pills.push("Parqueadero");
    if (hasPool.checked) pills.push("Piscina / zonas comunes");
    if (hasElevator.checked) pills.push("Ascensor");
    else pills.push("Sin ascensor");

    resultFactors.innerHTML = pills.map((pill) => `<span class="factor-pill">${pill}</span>`).join("");
  }

  function updateCalculator() {
    const nextIncome = calculateIncome();
    const minIncome = nextIncome * 0.9;
    const maxIncome = nextIncome * 1.1;

    m2Value.textContent = `${squareMeters.value} m²`;
    animateValue(monthlyIncome, currentIncome, nextIncome, 520, { prefix: "$ ", suffix: " COP" });
    incomeRange.textContent = `Rango estimado: ${formatCop(minIncome)} - ${formatCop(maxIncome)}`;
    renderFactorPills();
    currentIncome = nextIncome;
  }

  [squareMeters, city, propertyType, estrato, floorLevel, locationZone, hasParking, hasPool, hasElevator].forEach((input) => {
    input.addEventListener("input", updateCalculator);
    input.addEventListener("change", updateCalculator);
  });

  updateCalculator();
}
