/**
 * app.js - UI Logic untuk S-DES Calculator
 * Mengelola interaksi pengguna dan rendering hasil
 */

// ============================================================
//   DOM REFERENCES
// ============================================================
const inputText   = document.getElementById('inputText');
const inputKey    = document.getElementById('inputKey');
const inputBadge  = document.getElementById('inputBadge');
const keyBadge    = document.getElementById('keyBadge');
const inputPreview = document.getElementById('inputPreview');
const keyPreview   = document.getElementById('keyPreview');
const errorMsg    = document.getElementById('errorMsg');
const btnSubmit   = document.getElementById('btnSubmit');
const btnReset    = document.getElementById('btnReset');
const resultCard  = document.getElementById('resultCard');
const stepsSection = document.getElementById('stepsSection');
const stepsToggle  = document.getElementById('stepsToggle');
const stepsContent = document.getElementById('stepsContent');
const toggleIcon   = document.getElementById('toggleIcon');
const keyGenSteps  = document.getElementById('keyGenSteps');
const processSteps = document.getElementById('processSteps');
const modeEncEl    = document.getElementById('modeEnc');
const modeDecEl    = document.getElementById('modeDec');
let stepsOpen = false;

// ============================================================
//   LIVE PREVIEW
// ============================================================
function updatePreview(input, container, badge, maxLen) {
  const val = input.value;
  badge.textContent = `${val.length}/${maxLen}`;
  container.innerHTML = '';

  for (let i = 0; i < maxLen; i++) {
    const div = document.createElement('div');
    div.className = 'bp' + (val[i] === '1' ? ' one' : '');
    div.textContent = val[i] ?? '·';
    container.appendChild(div);
  }
}

inputText.addEventListener('input', () => {
  inputText.value = inputText.value.replace(/[^01]/g, '');
  updatePreview(inputText, inputPreview, inputBadge, 8);
});

inputKey.addEventListener('input', () => {
  inputKey.value = inputKey.value.replace(/[^01]/g, '');
  updatePreview(inputKey, keyPreview, keyBadge, 10);
});

// Init previews
updatePreview(inputText, inputPreview, inputBadge, 8);
updatePreview(inputKey, keyPreview, keyBadge, 10);

// ============================================================
//   MODE SELECTOR
// ============================================================
document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', () => {
    modeEncEl.classList.toggle('active', radio.value === 'encrypt');
    modeDecEl.classList.toggle('active', radio.value === 'decrypt');
  });
});

modeEncEl.addEventListener('click', () => {
  document.querySelector('input[value="encrypt"]').checked = true;
  modeEncEl.classList.add('active');
  modeDecEl.classList.remove('active');
});

modeDecEl.addEventListener('click', () => {
  document.querySelector('input[value="decrypt"]').checked = true;
  modeDecEl.classList.add('active');
  modeEncEl.classList.remove('active');
});

// ============================================================
//   STEPS TOGGLE
// ============================================================
stepsToggle.addEventListener('click', () => {
  stepsOpen = !stepsOpen;
  stepsContent.style.display = stepsOpen ? 'flex' : 'none';
  toggleIcon.classList.toggle('open', stepsOpen);
  stepsToggle.querySelector('span:last-child').textContent =
    stepsOpen ? 'Sembunyikan Solusi Penyelesaian' : 'Tampilkan Solusi Penyelesaian (Step-by-Step)';
});

// ============================================================
//   VALIDATION
// ============================================================
function validate() {
  const text = inputText.value;
  const key  = inputKey.value;

  if (text.length !== 8) {
    showError('Plaintext/Ciphertext harus tepat 8-bit biner (contoh: 10110100)');
    inputText.classList.add('error');
    return false;
  }
  if (!/^[01]{8}$/.test(text)) {
    showError('Plaintext/Ciphertext hanya boleh mengandung karakter 0 dan 1');
    inputText.classList.add('error');
    return false;
  }
  if (key.length !== 10) {
    showError('Kunci harus tepat 10-bit biner (contoh: 1010000010)');
    inputKey.classList.add('error');
    return false;
  }
  if (!/^[01]{10}$/.test(key)) {
    showError('Kunci hanya boleh mengandung karakter 0 dan 1');
    inputKey.classList.add('error');
    return false;
  }
  hideError();
  inputText.classList.remove('error');
  inputKey.classList.remove('error');
  return true;
}

function showError(msg) {
  errorMsg.textContent = '⚠ ' + msg;
  errorMsg.style.display = 'block';
}

function hideError() {
  errorMsg.style.display = 'none';
}

// ============================================================
//   RESET
// ============================================================
btnReset.addEventListener('click', () => {
  inputText.value = '';
  inputKey.value  = '';
  updatePreview(inputText, inputPreview, inputBadge, 8);
  updatePreview(inputKey, keyPreview, keyBadge, 10);
  resultCard.style.display   = 'none';
  stepsSection.style.display = 'none';
  stepsContent.style.display = 'none';
  stepsOpen = false;
  toggleIcon.classList.remove('open');
  hideError();
  inputText.classList.remove('error');
  inputKey.classList.remove('error');
});

// ============================================================
//   SUBMIT
// ============================================================
btnSubmit.addEventListener('click', () => {
  if (!validate()) return;

  const mode   = document.querySelector('input[name="mode"]:checked').value;
  const text8  = SDES.strToArr(inputText.value);
  const key10  = SDES.strToArr(inputKey.value);

  let result;
  if (mode === 'encrypt') {
    result = SDES.encrypt(text8, key10);
  } else {
    result = SDES.decrypt(text8, key10);
  }

  renderResult(text8, key10, result, mode);
  renderSteps(result, mode);

  resultCard.style.display   = 'block';
  stepsSection.style.display = 'block';
  resultCard.classList.add('animate-in');

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================================
//   RENDER RESULT
// ============================================================
function renderResult(inputBits, keyBits, result, mode) {
  const isEnc = mode === 'encrypt';

  document.getElementById('resultTitle').textContent =
    isEnc ? 'Hasil Enkripsi' : 'Hasil Dekripsi';
  document.getElementById('resultOutputLabel').textContent =
    isEnc ? 'Ciphertext' : 'Plaintext';

  document.getElementById('resultInput').innerHTML =
    renderBitBoxes(inputBits, true);
  document.getElementById('resultOutput').innerHTML =
    renderBitBoxes(result.result, true);
  document.getElementById('resultKey').innerHTML =
    renderBitBoxes(keyBits, false);
}

// ============================================================
//   BIT BOX HELPERS
// ============================================================
function renderBitBoxes(bits, isResult = false, showIdx = false) {
  return bits.map((b, i) => {
    const cls = isResult
      ? `bit-box result-bit${b === 1 ? ' one' : ''}`
      : `bit-box${b === 1 ? ' one' : ''}`;
    const idx = showIdx ? `<span class="bit-idx">${i+1}</span>` : '';
    return `<div class="${cls}">${b}${idx}</div>`;
  }).join('');
}

function renderBitBoxesSm(bits, showIdx = false) {
  return `<div class="bit-boxes bit-boxes-sm">${bits.map((b, i) => {
    const idx = showIdx ? `<span class="bit-idx">${i+1}</span>` : '';
    return `<div class="bit-box${b===1?' one':''}">${b}${idx}</div>`;
  }).join('')}</div>`;
}

// ============================================================
//   RENDER STEPS
// ============================================================
function renderSteps(result, mode) {
  const isEnc = mode === 'encrypt';
  document.getElementById('processTitle').textContent =
    isEnc ? 'Proses Enkripsi' : 'Proses Dekripsi';

  // KEY GENERATION
  keyGenSteps.innerHTML = renderKeyGenSteps(result.keySteps);

  // ENCRYPTION / DECRYPTION PROCESS
  processSteps.innerHTML = renderProcessSteps(result.encSteps, isEnc);
}

// ---- KEY GEN STEPS ----
function renderKeyGenSteps(steps) {
  let html = '';
  let stepNum = 1;

  for (const step of steps) {
    switch (step.id) {
      case 'p10':
        html += renderPermStep(stepNum++, step, step.table);
        break;
      case 'split':
        html += renderSplitStep(stepNum++, step);
        break;
      case 'ls1':
      case 'ls2':
        html += renderLSStep(stepNum++, step);
        break;
      case 'k1':
      case 'k2':
        html += renderPermStep(stepNum++, step, step.table);
        break;
    }
  }
  return html;
}

// ---- PROCESS STEPS ----
function renderProcessSteps(steps, isEnc) {
  let html = '';
  let stepNum = 1;
  let inRound = 0;

  for (const step of steps) {
    if (step.type === 'round_header') {
      if (inRound > 0) html += '</div>'; // close previous round
      html += `
        <div class="round-block">
        <div class="round-header">
          <span class="round-badge">${step.label}</span>
          <h4>Menggunakan subkunci: <span style="color:var(--yellow)">${step.keyUsed}</span></h4>
        </div>`;
      inRound++;
      continue;
    }

    switch (step.id) {
      case 'ip':
        html += renderPermStep(stepNum++, step, step.table);
        break;
      case 'ip_split':
        html += renderSplitStep(stepNum++, step);
        break;
      case 'swap':
        html += renderSwapStep(stepNum++, step);
        break;
      case 'ip_inv':
        html += renderPermStep(stepNum++, step, step.table);
        break;
      default:
        if (step.id.includes('_ep') || step.id.includes('_p4')) {
          html += renderPermStep(stepNum++, step, step.table);
        } else if (step.id.includes('_xor')) {
          html += renderXorStep(stepNum++, step);
        } else if (step.id.includes('_split')) {
          html += renderSplitStep(stepNum++, step);
        } else if (step.id.includes('_s0')) {
          html += renderSboxStep(stepNum++, step, 'S0', SDES.S0);
        } else if (step.id.includes('_s1')) {
          html += renderSboxStep(stepNum++, step, 'S1', SDES.S1);
        } else if (step.id.includes('_combine')) {
          html += renderCombineStep(stepNum++, step);
        } else if (step.id.includes('_xor_l')) {
          html += renderXorStep(stepNum++, step);
        }
        break;
    }
  }

  if (inRound > 0) html += '</div>'; // close last round
  return html;
}

// ============================================================
//   STEP RENDERERS
// ============================================================

function stepWrapper(num, label, desc, body) {
  return `
  <div class="step-item">
    <div class="step-label">
      <span class="step-num-badge">Step ${num}</span>
      <span class="step-name">${label}</span>
      <span class="step-desc">${desc}</span>
    </div>
    <div class="step-body">${body}</div>
  </div>`;
}

function renderPermStep(num, step, table) {
  const body = `
    <div class="step-row">
      <span class="step-row-label">${step.input.label}:</span>
      ${renderBitBoxesSm(step.input.bits, true)}
    </div>
    <div class="step-comment">
      Tabel Permutasi: [${table.join(', ')}]
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.output.label}:</span>
      ${renderBitBoxesSm(step.output.bits, false)}
    </div>`;
  return stepWrapper(num, step.label, step.desc, body);
}

function renderSplitStep(num, step) {
  let body = '';
  if (step.input) {
    body += `<div class="step-row">
      <span class="step-row-label">${step.input.label}:</span>
      ${renderBitBoxesSm(step.input.bits)}
    </div>`;
  }
  body += `
    <div class="step-row">
      <span class="step-row-label">${step.left.label}:</span>
      ${renderBitBoxesSm(step.left.bits)}
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.right.label}:</span>
      ${renderBitBoxesSm(step.right.bits)}
    </div>`;
  if (step.output) {
    body += `<div class="step-row">
      <span class="step-row-label">${step.output.label}:</span>
      ${renderBitBoxesSm(step.output.bits)}
    </div>`;
  }
  return stepWrapper(num, step.label, step.desc, body);
}

function renderLSStep(num, step) {
  const body = `
    <div class="step-row">
      <span class="step-row-label">${step.leftIn.label}:</span>
      ${renderBitBoxesSm(step.leftIn.bits)}
      <span class="step-op">→ shift →</span>
      ${renderBitBoxesSm(step.leftOut.bits)}
      <span class="step-row-label">${step.leftOut.label}</span>
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.rightIn.label}:</span>
      ${renderBitBoxesSm(step.rightIn.bits)}
      <span class="step-op">→ shift →</span>
      ${renderBitBoxesSm(step.rightOut.bits)}
      <span class="step-row-label">${step.rightOut.label}</span>
    </div>`;
  return stepWrapper(num, step.label, step.desc, body);
}

function renderXorStep(num, step) {
  const body = `
    <div class="step-row">
      <span class="step-row-label">${step.a.label}:</span>
      ${renderBitBoxesSm(step.a.bits)}
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.b.label}:</span>
      ${renderBitBoxesSm(step.b.bits)}
      <span class="step-op">⊕ XOR</span>
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.output.label}:</span>
      ${renderBitBoxesSm(step.output.bits)}
    </div>`;
  return stepWrapper(num, step.label, step.desc, body);
}

function renderSboxStep(num, step, boxName, sbox) {
  // Build table
  let tbl = `<table class="sbox-table">
    <tr>
      <th>${boxName}</th><th>Col 00</th><th>Col 01</th><th>Col 10</th><th>Col 11</th>
    </tr>`;
  sbox.forEach((row, ri) => {
    tbl += `<tr><th>Row ${ri.toString(2).padStart(2,'0')}</th>`;
    row.forEach((val, ci) => {
      const isHighlight = ri === step.row && ci === step.col;
      tbl += `<td class="${isHighlight ? 'highlight' : ''}">${val}</td>`;
    });
    tbl += '</tr>';
  });
  tbl += '</table>';

  const rowBin = step.row.toString(2).padStart(2,'0');
  const colBin = step.col.toString(2).padStart(2,'0');

  const body = `
    <div class="step-row">
      <span class="step-row-label">${step.input.label}:</span>
      ${renderBitBoxesSm(step.input.bits)}
    </div>
    <div class="step-comment">
      Baris = bit 1 &amp; 4 → ${step.input.bits[0]}${step.input.bits[3]} = ${rowBin} (baris ${step.row})<br/>
      Kolom = bit 2 &amp; 3 → ${step.input.bits[1]}${step.input.bits[2]} = ${colBin} (kolom ${step.col})
    </div>
    ${tbl}
    <div class="sbox-result">
      <span>${boxName}[${rowBin}][${colBin}]</span>
      <span class="step-op">=</span>
      <span>${sbox[step.row][step.col]}</span>
      <span style="color:var(--white-40)">→</span>
      ${renderBitBoxesSm(step.output.bits)}
    </div>`;
  return stepWrapper(num, step.label, step.desc, body);
}

function renderSwapStep(num, step) {
  const body = `
    <div class="step-row">
      <span class="step-row-label">${step.input.label}:</span>
      ${renderBitBoxesSm(step.input.bits)}
    </div>
    <div class="step-comment">⟵ Posisi kiri dan kanan ditukar (SWAP) ⟶</div>
    <div class="step-row">
      <span class="step-row-label">${step.left.label}:</span>
      ${renderBitBoxesSm(step.left.bits)}
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.right.label}:</span>
      ${renderBitBoxesSm(step.right.bits)}
    </div>`;
  return stepWrapper(num, step.label, step.desc, body);
}

function renderCombineStep(num, step) {
  const body = `
    <div class="step-row">
      <span class="step-row-label">${step.left.label}:</span>
      ${renderBitBoxesSm(step.left.bits)}
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.right.label}:</span>
      ${renderBitBoxesSm(step.right.bits)}
    </div>
    <div class="step-row">
      <span class="step-row-label">${step.output.label}:</span>
      ${renderBitBoxesSm(step.output.bits)}
    </div>`;
  return stepWrapper(num, step.label, step.desc, body);
}
