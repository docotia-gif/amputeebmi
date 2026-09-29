// Amputee-corrected BMI calculator
// Segment weight percentages derived from Winter/Dempster body-segment tables.
// Supports independent, mixed amputation levels per limb (e.g. below-knee on
// one leg, above-knee on the other, plus bilateral below-elbow arms).

// Percentage of total body mass represented by a given amputation level,
// per single limb (leg or arm).
const LEG_LEVELS = {
  none: 0,
  AKA: 9.9,   // above-knee / transfemoral
  BKA: 4.4,   // below-knee / transtibial
  foot: 1.5   // foot / partial foot
};

const ARM_LEVELS = {
  none: 0,
  AE: 3.35,  // above-elbow / transhumeral
  BE: 2.3,   // below-elbow / transradial
  hand: 0.7  // hand / partial hand
};

function getLegPercent(level) {
  return LEG_LEVELS[level] || 0;
}

function getArmPercent(level) {
  return ARM_LEVELS[level] || 0;
}

// limbs = { legLeft, legRight, armLeft, armRight } — each a level key
// ("none" / "AKA" / "BKA" / "foot" for legs, "none" / "AE" / "BE" / "hand" for arms)
function calculateCorrectedBMI({ heightCm, weightKg, limbs }) {
  const legLeftPct = getLegPercent(limbs.legLeft);
  const legRightPct = getLegPercent(limbs.legRight);
  const armLeftPct = getArmPercent(limbs.armLeft);
  const armRightPct = getArmPercent(limbs.armRight);

  const totalPercent = legLeftPct + legRightPct + armLeftPct + armRightPct;
  const missingFraction = totalPercent / 100;

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
  const explanation = `Your standard BMI does not account for the ${pct}% of total body mass typically represented by the missing limb segment(s), estimated from your pre-amputation height and body proportions. Corrected BMI estimates what your BMI would be with that mass restored, giving a more accurate picture for weight-related clinical conversations.`;

  return {
    standardBMI: result.standardBMI.toFixed(1),
    correctedBMI: result.correctedBMI.toFixed(1),
    category,
    explanation
  };
}
