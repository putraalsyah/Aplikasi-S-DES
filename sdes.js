/**
 * sdes.js - Implementasi Algoritma S-DES (Simplified Data Encryption Standard)
 * 
 * Algoritma S-DES menggunakan:
 * - Plaintext/Ciphertext: 8-bit
 * - Kunci: 10-bit
 * - 2 Round Function
 */

// ============================================================
//   TABEL PERMUTASI
// ============================================================

// P10: permutasi 10-bit kunci awal
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];

// P8: mengambil 8 bit dari 10-bit untuk menghasilkan subkunci
const P8 = [6, 3, 7, 4, 8, 5, 10, 9];

// IP (Initial Permutation)
const IP  = [2, 6, 3, 1, 4, 8, 5, 7];

// IP-1 (Inverse Initial Permutation)
const IP_INV = [4, 1, 3, 5, 7, 2, 8, 6];

// EP (Expansion Permutation): 4-bit → 8-bit
const EP = [4, 1, 2, 3, 2, 3, 4, 1];

// P4
const P4 = [2, 4, 3, 1];

// S-Box S0
const S0 = [
  [1, 0, 3, 2],
  [3, 2, 1, 0],
  [0, 2, 1, 3],
  [3, 1, 3, 2]
];

// S-Box S1
const S1 = [
  [0, 1, 2, 3],
  [2, 0, 1, 3],
  [3, 0, 1, 0],
  [2, 1, 0, 3]
];

// ============================================================
//   FUNGSI BANTU
// ============================================================

/**
 * Permutasi array bit berdasarkan tabel permutasi
 * @param {number[]} bits - Array bit input
 * @param {number[]} table - Tabel permutasi (1-indexed)
 * @returns {number[]} Array bit hasil permutasi
 */
function permute(bits, table) {
  return table.map(i => bits[i - 1]);
}

/**
 * Left Shift (Circular) sebanyak n posisi pada array
 */
function leftShift(bits, n) {
  return [...bits.slice(n), ...bits.slice(0, n)];
}

/**
 * XOR dua array bit
 */
function xorBits(a, b) {
  return a.map((bit, i) => bit ^ b[i]);
}

/**
 * Konversi string biner ke array integer
 * @param {string} str - String biner, misal "10110100"
 * @returns {number[]}
 */
function strToArr(str) {
  return str.split('').map(Number);
}

/**
 * Konversi array integer ke string biner
 */
function arrToStr(arr) {
  return arr.join('');
}

/**
 * Lookup S-Box
 * @param {number[]} bits4 - Array 4 bit (baris: bit ke-0 & ke-3, kolom: bit ke-1 & ke-2)
 * @param {number[][]} sbox
 * @returns {number[]} 2-bit output
 */
function sBoxLookup(bits4, sbox) {
  const row = (bits4[0] << 1) | bits4[3];   // bits 0 dan 3
  const col = (bits4[1] << 1) | bits4[2];   // bits 1 dan 2
  const val = sbox[row][col];
  return [(val >> 1) & 1, val & 1];
}

// ============================================================
//   KEY GENERATION — dengan log detail setiap langkah
// ============================================================

/**
 * Generate K1 dan K2 dari kunci 10-bit, disertai langkah detail
 * @param {number[]} key10 - Array 10-bit kunci
 * @returns {{ K1, K2, steps: object[] }}
 */
function generateKeys(key10) {
  const steps = [];

  // Langkah 1: P10
  const afterP10 = permute(key10, P10);
  steps.push({
    id: 'p10',
    label: 'Permutasi P10',
    desc: 'Permutasi kunci 10-bit dengan tabel P10 = [3,5,2,7,4,10,1,9,8,6]',
    input: { label: 'Kunci Awal (K)', bits: key10 },
    table: P10,
    output: { label: 'Setelah P10', bits: afterP10 }
  });

  // Langkah 2: Split
  const leftP10  = afterP10.slice(0, 5);
  const rightP10 = afterP10.slice(5, 10);
  steps.push({
    id: 'split',
    label: 'Pembagian Kiri & Kanan',
    desc: 'Hasil P10 dibagi menjadi 2 bagian masing-masing 5-bit',
    input: { label: 'Setelah P10', bits: afterP10 },
    left:  { label: 'Kiri (LS)', bits: leftP10 },
    right: { label: 'Kanan (RS)', bits: rightP10 }
  });

  // Langkah 3: LS-1 (shift kiri 1)
  const ls1Left  = leftShift(leftP10, 1);
  const ls1Right = leftShift(rightP10, 1);
  steps.push({
    id: 'ls1',
    label: 'Left Shift-1 (LS-1)',
    desc: 'Geser circular kiri 1 posisi pada kedua bagian',
    leftIn:   { label: 'Kiri sebelum LS-1', bits: leftP10 },
    rightIn:  { label: 'Kanan sebelum LS-1', bits: rightP10 },
    leftOut:  { label: 'Kiri setelah LS-1', bits: ls1Left },
    rightOut: { label: 'Kanan setelah LS-1', bits: ls1Right }
  });

  // Langkah 4: Gabungkan dan P8 → K1
  const afterLS1 = [...ls1Left, ...ls1Right];
  const K1 = permute(afterLS1, P8);
  steps.push({
    id: 'k1',
    label: 'Permutasi P8 → K1',
    desc: 'Gabungkan hasil LS-1 lalu permutasi dengan tabel P8 = [6,3,7,4,8,5,10,9]',
    input:  { label: 'Gabungan LS-1', bits: afterLS1 },
    table:  P8,
    output: { label: 'K1', bits: K1 }
  });

  // Langkah 5: LS-2 (shift kiri 2) pada hasil LS-1
  const ls2Left  = leftShift(ls1Left, 2);
  const ls2Right = leftShift(ls1Right, 2);
  steps.push({
    id: 'ls2',
    label: 'Left Shift-2 (LS-2)',
    desc: 'Geser circular kiri 2 posisi pada hasil LS-1',
    leftIn:   { label: 'Kiri setelah LS-1', bits: ls1Left },
    rightIn:  { label: 'Kanan setelah LS-1', bits: ls1Right },
    leftOut:  { label: 'Kiri setelah LS-2', bits: ls2Left },
    rightOut: { label: 'Kanan setelah LS-2', bits: ls2Right }
  });

  // Langkah 6: Gabungkan dan P8 → K2
  const afterLS2 = [...ls2Left, ...ls2Right];
  const K2 = permute(afterLS2, P8);
  steps.push({
    id: 'k2',
    label: 'Permutasi P8 → K2',
    desc: 'Gabungkan hasil LS-2 lalu permutasi dengan tabel P8 = [6,3,7,4,8,5,10,9]',
    input:  { label: 'Gabungan LS-2', bits: afterLS2 },
    table:  P8,
    output: { label: 'K2', bits: K2 }
  });

  return { K1, K2, steps };
}

// ============================================================
//   FUNGSI F (Round Function)
// ============================================================

/**
 * Fungsi F untuk satu round
 * @param {number[]} R4      - 4-bit input kanan
 * @param {number[]} subkey  - 8-bit subkunci
 * @param {number} roundNum  - Nomor round (untuk logging)
 * @returns {{ result: number[], steps: object[] }}
 */
function fFunction(R4, subkey, roundNum) {
  const steps = [];
  const keyLabel = roundNum === 1 ? 'K1' : 'K2';

  // EP: 4-bit → 8-bit
  const ep = permute(R4, EP);
  steps.push({
    id: `r${roundNum}_ep`,
    label: `Expansion Permutation (EP)`,
    desc: `Ekspansi 4-bit menjadi 8-bit dengan tabel EP = [4,1,2,3,2,3,4,1]`,
    input:  { label: 'Kanan (R)', bits: R4 },
    table:  EP,
    output: { label: 'Setelah EP', bits: ep }
  });

  // XOR dengan subkunci
  const xorResult = xorBits(ep, subkey);
  steps.push({
    id: `r${roundNum}_xor`,
    label: `XOR dengan ${keyLabel}`,
    desc: `XOR hasil EP dengan subkunci ${keyLabel}`,
    a: { label: 'EP', bits: ep },
    b: { label: keyLabel, bits: subkey },
    output: { label: `EP ⊕ ${keyLabel}`, bits: xorResult }
  });

  // Split → S0 input dan S1 input
  const s0input = xorResult.slice(0, 4);
  const s1input = xorResult.slice(4, 8);
  steps.push({
    id: `r${roundNum}_split`,
    label: 'Pembagian untuk S-Box',
    desc: 'Hasil XOR dibagi: 4-bit pertama ke S0, 4-bit kedua ke S1',
    input: { label: `EP ⊕ ${keyLabel}`, bits: xorResult },
    left:  { label: 'Untuk S0 (bit 1-4)', bits: s0input },
    right: { label: 'Untuk S1 (bit 5-8)', bits: s1input }
  });

  // S-Box S0
  const s0row = (s0input[0] << 1) | s0input[3];
  const s0col = (s0input[1] << 1) | s0input[2];
  const s0out = sBoxLookup(s0input, S0);
  steps.push({
    id: `r${roundNum}_s0`,
    label: 'S-Box S0',
    desc: 'Substitusi 4-bit pertama. Baris = bit ke-1 & ke-4, Kolom = bit ke-2 & ke-3',
    input: { label: 'Input S0', bits: s0input },
    sbox:  S0,
    row:   s0row,
    col:   s0col,
    output: { label: 'Output S0', bits: s0out }
  });

  // S-Box S1
  const s1row = (s1input[0] << 1) | s1input[3];
  const s1col = (s1input[1] << 1) | s1input[2];
  const s1out = sBoxLookup(s1input, S1);
  steps.push({
    id: `r${roundNum}_s1`,
    label: 'S-Box S1',
    desc: 'Substitusi 4-bit kedua. Baris = bit ke-1 & ke-4, Kolom = bit ke-2 & ke-3',
    input: { label: 'Input S1', bits: s1input },
    sbox:  S1,
    row:   s1row,
    col:   s1col,
    output: { label: 'Output S1', bits: s1out }
  });

  // P4
  const sboxCombined = [...s0out, ...s1out];
  const p4out = permute(sboxCombined, P4);
  steps.push({
    id: `r${roundNum}_p4`,
    label: 'Permutasi P4',
    desc: 'Gabungkan output S0 dan S1 lalu permutasi dengan tabel P4 = [2,4,3,1]',
    input:  { label: 'S0 | S1', bits: sboxCombined },
    table:  P4,
    output: { label: 'Setelah P4', bits: p4out }
  });

  return { result: p4out, steps };
}

// ============================================================
//   ENKRIPSI
// ============================================================

/**
 * Enkripsi S-DES lengkap dengan log detail
 * @param {number[]} plain8 - Plaintext 8-bit
 * @param {number[]} key10  - Kunci 10-bit
 * @returns {{ ciphertext: number[], keyGen: object, encSteps: object[] }}
 */
function sdesEncrypt(plain8, key10) {
  const encSteps = [];

  // Key generation
  const { K1, K2, steps: keySteps } = generateKeys(key10);

  // --- IP ---
  const afterIP = permute(plain8, IP);
  encSteps.push({
    id: 'ip',
    label: 'Initial Permutation (IP)',
    desc: 'Permutasi awal pada plaintext 8-bit dengan tabel IP = [2,6,3,1,4,8,5,7]',
    input:  { label: 'Plaintext', bits: plain8 },
    table:  IP,
    output: { label: 'Setelah IP', bits: afterIP }
  });

  // Split
  let L = afterIP.slice(0, 4);
  let R = afterIP.slice(4, 8);
  encSteps.push({
    id: 'ip_split',
    label: 'Pembagian L dan R',
    desc: 'Hasil IP dibagi menjadi bagian kiri (L) dan kanan (R) masing-masing 4-bit',
    input: { label: 'Setelah IP', bits: afterIP },
    left:  { label: 'L (kiri)', bits: L },
    right: { label: 'R (kanan)', bits: R }
  });

  // ---- ROUND 1 ----
  encSteps.push({ id: 'round1_header', type: 'round_header', label: 'Round Function 1', keyUsed: 'K1' });

  const { result: fOut1, steps: fSteps1 } = fFunction(R, K1, 1);
  encSteps.push(...fSteps1.map(s => ({ ...s, round: 1 })));

  const xorL1 = xorBits(fOut1, L);
  encSteps.push({
    id: 'r1_xor_l',
    label: 'XOR P4 dengan L',
    desc: 'XOR hasil P4 dengan bagian kiri (L) dari IP',
    a: { label: 'P4 output', bits: fOut1 },
    b: { label: 'L (kiri IP)', bits: L },
    output: { label: 'L1 = P4 ⊕ L', bits: xorL1 }
  });

  const combined1 = [...xorL1, ...R];
  encSteps.push({
    id: 'r1_combine',
    label: 'Penggabungan L1 dan R',
    desc: 'Gabungkan L1 (hasil XOR) dengan R (kanan IP) sebelum SWAP',
    left:  { label: 'L1', bits: xorL1 },
    right: { label: 'R (tetap)', bits: R },
    output: { label: 'L1 | R', bits: combined1 }
  });

  // SWAP
  const L2 = R;
  const R2 = xorL1;
  encSteps.push({
    id: 'swap',
    label: 'SWAP (SW)',
    desc: 'Tukar bagian kiri dan kanan: kiri menjadi R, kanan menjadi L1',
    input: { label: 'Sebelum SWAP', bits: combined1 },
    left:  { label: 'L2 (baru) = R', bits: L2 },
    right: { label: 'R2 (baru) = L1', bits: R2 }
  });

  // ---- ROUND 2 ----
  encSteps.push({ id: 'round2_header', type: 'round_header', label: 'Round Function 2', keyUsed: 'K2' });

  const { result: fOut2, steps: fSteps2 } = fFunction(R2, K2, 2);
  encSteps.push(...fSteps2.map(s => ({ ...s, round: 2 })));

  const xorL2 = xorBits(fOut2, L2);
  encSteps.push({
    id: 'r2_xor_l',
    label: 'XOR P4 dengan L2',
    desc: 'XOR hasil P4 Round 2 dengan L2',
    a: { label: 'P4 output', bits: fOut2 },
    b: { label: 'L2', bits: L2 },
    output: { label: 'L_final = P4 ⊕ L2', bits: xorL2 }
  });

  const combined2 = [...xorL2, ...R2];
  encSteps.push({
    id: 'r2_combine',
    label: 'Penggabungan Akhir Round 2',
    desc: 'Gabungkan hasil Round 2 (tanpa SWAP)',
    left:  { label: 'L_final', bits: xorL2 },
    right: { label: 'R2 (tetap)', bits: R2 },
    output: { label: 'L_final | R2', bits: combined2 }
  });

  // IP-1
  const ciphertext = permute(combined2, IP_INV);
  encSteps.push({
    id: 'ip_inv',
    label: 'Inverse Initial Permutation (IP⁻¹)',
    desc: 'Permutasi balik dengan tabel IP⁻¹ = [4,1,3,5,7,2,8,6] untuk mendapatkan ciphertext',
    input:  { label: 'Sebelum IP⁻¹', bits: combined2 },
    table:  IP_INV,
    output: { label: 'Ciphertext (Hasil Enkripsi)', bits: ciphertext }
  });

  return { result: ciphertext, K1, K2, keySteps, encSteps };
}

// ============================================================
//   DEKRIPSI
// ============================================================

/**
 * Dekripsi S-DES lengkap dengan log detail
 * (sama dengan enkripsi tapi K1 dan K2 dibalik)
 */
function sdesDecrypt(cipher8, key10) {
  const decSteps = [];

  const { K1, K2, steps: keySteps } = generateKeys(key10);
  // Untuk dekripsi: Round 1 pakai K2, Round 2 pakai K1

  // IP
  const afterIP = permute(cipher8, IP);
  decSteps.push({
    id: 'ip',
    label: 'Initial Permutation (IP)',
    desc: 'Permutasi awal pada ciphertext 8-bit dengan tabel IP = [2,6,3,1,4,8,5,7]',
    input:  { label: 'Ciphertext', bits: cipher8 },
    table:  IP,
    output: { label: 'Setelah IP', bits: afterIP }
  });

  let L = afterIP.slice(0, 4);
  let R = afterIP.slice(4, 8);
  decSteps.push({
    id: 'ip_split',
    label: 'Pembagian L dan R',
    desc: 'Hasil IP dibagi menjadi bagian kiri (L) dan kanan (R)',
    input: { label: 'Setelah IP', bits: afterIP },
    left:  { label: 'L (kiri)', bits: L },
    right: { label: 'R (kanan)', bits: R }
  });

  // Round 1 (pakai K2)
  decSteps.push({ id: 'round1_header', type: 'round_header', label: 'Round Function 1 (Dekripsi)', keyUsed: 'K2' });

  const { result: fOut1, steps: fSteps1 } = fFunction(R, K2, 1);
  decSteps.push(...fSteps1.map(s => ({ ...s, round: 1 })));

  const xorL1 = xorBits(fOut1, L);
  decSteps.push({
    id: 'r1_xor_l',
    label: 'XOR P4 dengan L',
    desc: 'XOR hasil P4 dengan bagian kiri (L) dari IP',
    a: { label: 'P4 output', bits: fOut1 },
    b: { label: 'L', bits: L },
    output: { label: 'L1 = P4 ⊕ L', bits: xorL1 }
  });

  const combined1 = [...xorL1, ...R];
  decSteps.push({
    id: 'r1_combine',
    label: 'Penggabungan L1 dan R',
    desc: 'Gabungkan L1 dengan R sebelum SWAP',
    left:  { label: 'L1', bits: xorL1 },
    right: { label: 'R (tetap)', bits: R },
    output: { label: 'L1 | R', bits: combined1 }
  });

  const L2 = R;
  const R2 = xorL1;
  decSteps.push({
    id: 'swap',
    label: 'SWAP (SW)',
    desc: 'Tukar bagian kiri dan kanan',
    input: { label: 'Sebelum SWAP', bits: combined1 },
    left:  { label: 'L2 (baru) = R', bits: L2 },
    right: { label: 'R2 (baru) = L1', bits: R2 }
  });

  // Round 2 (pakai K1)
  decSteps.push({ id: 'round2_header', type: 'round_header', label: 'Round Function 2 (Dekripsi)', keyUsed: 'K1' });

  const { result: fOut2, steps: fSteps2 } = fFunction(R2, K1, 2);
  decSteps.push(...fSteps2.map(s => ({ ...s, round: 2 })));

  const xorL2 = xorBits(fOut2, L2);
  decSteps.push({
    id: 'r2_xor_l',
    label: 'XOR P4 dengan L2',
    desc: 'XOR hasil P4 Round 2 dengan L2',
    a: { label: 'P4 output', bits: fOut2 },
    b: { label: 'L2', bits: L2 },
    output: { label: 'L_final = P4 ⊕ L2', bits: xorL2 }
  });

  const combined2 = [...xorL2, ...R2];
  decSteps.push({
    id: 'r2_combine',
    label: 'Penggabungan Akhir Round 2',
    desc: 'Gabungkan hasil Round 2 (tanpa SWAP)',
    left:  { label: 'L_final', bits: xorL2 },
    right: { label: 'R2 (tetap)', bits: R2 },
    output: { label: 'L_final | R2', bits: combined2 }
  });

  // IP-1
  const plaintext = permute(combined2, IP_INV);
  decSteps.push({
    id: 'ip_inv',
    label: 'Inverse Initial Permutation (IP⁻¹)',
    desc: 'Permutasi balik dengan tabel IP⁻¹ = [4,1,3,5,7,2,8,6] untuk mendapatkan plaintext',
    input:  { label: 'Sebelum IP⁻¹', bits: combined2 },
    table:  IP_INV,
    output: { label: 'Plaintext (Hasil Dekripsi)', bits: plaintext }
  });

  return { result: plaintext, K1, K2, keySteps, encSteps: decSteps };
}

// Export agar bisa digunakan di app.js
window.SDES = {
  encrypt: sdesEncrypt,
  decrypt: sdesDecrypt,
  strToArr,
  arrToStr,
  S0,
  S1
};
