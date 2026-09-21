(function () {
  const form = document.getElementById('bmiForm');
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const heightUnitLabel = document.getElementById('heightUnit');
  const weightUnitLabel = document.getElementById('weightUnit');
  const unitButtons = document.querySelectorAll('.unit-toggle button');
  const resultBox = document.getElementById('resultBox');

  let units = 'metric';

  unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      unitButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      units = btn.dataset.units;
      if (units === 'metric') {
        heightUnitLabel.textContent = 'centimeters';
        weightUnitLabel.textContent = 'kilograms';
        heightInput.placeholder = '175';
        weightInput.placeholder = '70';
      } else {
        heightUnitLabel.textContent = 'inches';
        weightUnitLabel.textContent = 'pounds';
        heightInput.placeholder = '69';
        weightInput.placeholder = '154';
      }
      heightInput.value = '';
      weightInput.value = '';
      resultBox.classList.remove('show');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let heightCm = parseFloat(heightInput.value);
    let weightKg = parseFloat(weightInput.value);
    const level = document.getElementById('level').value;
    const side = document.getElementById('side').value;

    if (!heightCm || !weightKg || !level) return;

    if (units === 'imperial') {
      heightCm = heightCm * 2.54;
      weightKg = weightKg * 0.453592;
    }

    const raw = calculateCorrectedBMI({ heightCm, weightKg, level, side });
    const formatted = formatResult(raw);

    document.getElementById('resStandard').textContent = formatted.standardBMI;
    document.getElementById('resCorrected').textContent = formatted.correctedBMI;
    document.getElementById('resFullWeight').textContent =
      units === 'imperial'
        ? (raw.estimatedFullWeight / 0.453592).toFixed(1) + ' lb'
        : raw.estimatedFullWeight.toFixed(1) + ' kg';
    document.getElementById('resCategory').textContent = formatted.category;
    document.getElementById('resExplanation').textContent = formatted.explanation;

    resultBox.classList.add('show');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
