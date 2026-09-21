// Amputee-corrected BMI calculator
// Segment weight percentages derived from Winter/Dempster body-segment tables.

function getSegmentPercent(level) {
  const segmentTable = {
    AKA: 9.9,   // above-knee / transfemoral
    BKA: 4.4,   // below-knee / transtibial
    AE: 3.35,   // above-elbow / transhumeral
    BE: 2.3,    // below-elbow / transradial
    hand: 0.7,
    foot: 1.5
  };
  return segmentTable[level] || 0;
}

function calculateCorrectedBMI({ heightCm, weightKg, level, side }) {
  const percent = getSegmentPercent(level);
  const multiplier = side === "bilateral" ? 2 : 1;
  const missingFraction = (percent / 100) * multiplier;
  const estimatedFullWeight = weightKg / (1 - missingFraction);
  const heightM = heightCm / 100;
  const standardBMI = weightKg / (heightM * heightM);
  const correctedBMI = estimatedFullWeight / (heightM * heightM);

  return {
    standardBMI: Math.round(standardBMI * 10) / 10,
    correctedBMI: Math.round(correctedBMI * 10) / 10,
    estimatedFullWeight: Math.round(estimatedFullWeight * 10) / 10,
    missingFraction
  };
}

function interpretBMI(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function formatResult(result) {
  const category = interpretBMI(result.correctedBMI);
  const pct = (result.missingFraction * 100).toFixed(1);
  const explanation = `Your standard BMI does not account for the ${pct}% of total body mass typically represented by the missing limb segment(s). Corrected BMI estimates what your BMI would be with that mass restored, giving a more accurate picture for weight-related clinical conversations.`;

  return {
    standardBMI: result.standardBMI.toFixed(1),
    correctedBMI: result.correctedBMI.toFixed(1),
    category,
    explanation
  };
}
