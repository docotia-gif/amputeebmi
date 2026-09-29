(function () {
  const form = document.getElementById('bmiForm');
  const heightUsRow = document.getElementById('heightUsRow');
  const heightFtInput = document.getElementById('heightFt');
  const heightInInput = document.getElementById('heightIn');
  const heightInput = document.getElementById('height'); // hidden cm field, used for metric mode
  const weightInput = document.getElementById('weight');
  const heightUnitLabel = document.getElementById('heightUnit');
  const weightUnitLabel = document.getElementById('weightUnit');
  const unitButtons = document.querySelectorAll('.unit-toggle button');
  const resultBox = document.getElementById('resultBox');

  const legLeftSelect = document.getElementById('legLeft');
  const legRightSelect = document.getElementById('legRight');
  const armLeftSelect = document.getElementById('armLeft');
  const armRightSelect = document.getElementById('armRight');

  let units = 'us'; // 'us' (ft/in, lb) or 'metric' (cm, kg)

  function setUnits(newUnits) {
    units = newUnits;
    unitButtons.forEach(b => b.classList.toggle('active', b.dataset.units === units));

    if (units === 'metric') {
      heightUsRow.style.display = 'none';
      heightInput.style.display = '';
      heightUnitLabel.textContent = 'centimeters — your height before amputation, or your best estimate. This matters especially for bilateral amputees, since a post-amputation standing/measured height won\'t reflect true stature.';
      weightUnitLabel.textContent = 'kilograms';
      heightInput.placeholder = '175';
      weightInput.placeholder = '70';
    } else {
      heightUsRow.style.display = '';
      heightInput.style.display = 'none';
      heightUnitLabel.textContent = 'feet & inches — your height before amputation, or your best estimate. This matters especially for bilateral amputees, since a post-amputation standing/measured height won\'t reflect true stature.';
      weightUnitLabel.textContent = 'pounds';
      weightInput.placeholder = '154';
    }

    heightFtInput.value = '';
    heightInInput.value = '';
    heightInput.value = '';
    weightInput.value = '';
    resultBox.classList.remove('show');
  }

  unitButtons.forEach(btn => {
    btn.addEventListener('click', () => setUnits(btn.dataset.units));
  });

  // Initialize to default (US / ft & in)
  setUnits(units);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let heightCm;
    let weightKg;

    const limbs = {
      legLeft: legLeftSelect.value,
      legRight: legRightSelect.value,
      armLeft: armLeftSelect.value,
      armRight: armRightSelect.value
    };

    const hasAnyAmputation = Object.values(limbs).some(v => v !== 'none');
    if (!hasAnyAmputation) {
      alert('Please select at least one amputation level before calculating.');
      return;
    }

    if (units === 'metric') {
      heightCm = parseFloat(heightInput.value);
      weightKg = parseFloat(weightInput.value);
      if (!heightCm || !weightKg) return;
    } else {
      const ft = parseFloat(heightFtInput.value) || 0;
      const inches = parseFloat(heightInInput.value) || 0;
      const totalInches = ft * 12 + inches;
      const weightLb = parseFloat(weightInput.value);
      if (!totalInches || !weightLb) return;
      heightCm = totalInches * 2.54;
      weightKg = weightLb * 0.453592;
    }

    const raw = calculateCorrectedBMI({ heightCm, weightKg, limbs });
    const formatted = formatResult(raw);

    document.getElementById('resStandard').textContent = formatted.standardBMI;
    document.getElementById('resCorrected').textContent = formatted.correctedBMI;
    document.getElementById('resFullWeight').textContent =
      units === 'us'
        ? (raw.estimatedFullWeight / 0.453592).toFixed(1) + ' lb'
        : raw.estimatedFullWeight.toFixed(1) + ' kg';
    document.getElementById('resCategory').textContent = formatted.category;
    document.getElementById('resExplanation').textContent = formatted.explanation;

    resultBox.classList.add('show');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
