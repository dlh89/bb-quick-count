const stackEl = document.getElementById('stack');
const blindsEl = document.getElementById('blinds');
const bbCountEl = document.getElementById('bbCount');
const breakdownEl = document.getElementById('breakdown');
const answerEl = document.getElementById('answer');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const correctBtn = document.getElementById('correctBtn');
const incorrectBtn = document.getElementById('incorrectBtn');
const totalEl = document.getElementById('total');
const correctEl = document.getElementById('correct');
const accuracyEl = document.getElementById('accuracy');

const timerEl = document.createElement('p');
const avgTimeEl = document.createElement('p');
document.getElementById('stats').appendChild(timerEl);
document.getElementById('stats').appendChild(avgTimeEl);

let correctCount = 0;
let totalCount = 0;
let totalTime = 0;
let startTime = null;
let timerInterval = null;

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMentalTip(bigBlind, stack) {
  const baseBB = bigBlind >= 1000 ? bigBlind / 10 : bigBlind;
  const divisor = bigBlind >= 1000 ? 10000 : 100;
  const divisorText = bigBlind >= 1000 ? '10000' : '100';

  switch (baseBB) {
    case 150:
      return `Tip: Divide by ${divisorText}, then multiply result by 2/3.\n${stack} ÷ ${divisorText} = ${(stack / divisor).toFixed(2)} → × 2/3 = ${((stack / divisor) * 2 / 3).toFixed(2)} BB`;
    case 200:
      return `Tip: Divide by ${divisorText}, then divide result by 2.\n${stack} ÷ ${divisorText} = ${(stack / divisor).toFixed(2)} → ÷ 2 = ${(stack / (divisor * 2)).toFixed(2)} BB`;
    case 250:
      return `Tip: Divide by ${divisorText}, then multiply by 4 (or double twice).\n${stack} ÷ ${divisorText} = ${(stack / divisor).toFixed(2)} → × 4 = ${(stack / (divisor / 4)).toFixed(2)} BB`;
    case 400:
      return `Tip: Halve the stack twice.\n${stack} → ${(stack / 2).toFixed(0)} → ${(stack / 4).toFixed(0)} → ÷ ${bigBlind} = ${(stack / bigBlind).toFixed(2)} BB`;
    case 500:
      return `Tip: Divide by ${divisorText}, then multiply by 2.\n${stack} ÷ ${divisorText} = ${(stack / divisor).toFixed(2)} → × 2 = ${(stack / (divisor / 2)).toFixed(2)} BB`;
    case 600:
      const closeMultiple = Math.floor(stack / bigBlind);
      const approx = closeMultiple * bigBlind;
      const remainder = stack - approx;
      return `Tip: Estimate using chunks of ${bigBlind}.\nTry ${approx} ÷ ${bigBlind} = ${closeMultiple}, remainder: ${remainder}`;
    case 800:
      return `Tip: Halve the stack 3 times.\n${stack} → ${(stack / 2).toFixed(0)} → ${(stack / 4).toFixed(0)} → ${(stack / 8).toFixed(0)} → ${(stack / 800).toFixed(2)} BB`;
    case 1000:
      return `Tip: Drop the last 3 digits.\n${stack} → ${(stack / 1000).toFixed(2)} BB`;
    default:
      return `Tip: Estimate using mental rounding.\n${stack} ÷ ${bigBlind} = ${(stack / bigBlind).toFixed(2)} BB`;
  }
}

function generateQuestion() {
  const bigBlindOptions = [150, 200, 250, 400, 500, 600, 800, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
  const bigBlind = randomChoice(bigBlindOptions);
  const stackMultiplier = Math.floor(Math.random() * 100 + 10);
  const stack = bigBlind * stackMultiplier;

  const bb = stack / bigBlind;
  const tip = getMentalTip(bigBlind, stack);

  const breakdown = `Stack: ${stack.toLocaleString()} chips\nBig Blind: ${bigBlind.toLocaleString()} chips\n\n${stack.toLocaleString()} ÷ ${bigBlind.toLocaleString()} = ${bb.toFixed(2)} BB\n\n${tip}`;

  return {
    stack,
    bigBlind,
    smallBlind: bigBlind / 2,
    bb: bb.toFixed(2),
    breakdown,
  };
}

let currentQuestion;

function updateStats() {
  totalEl.textContent = totalCount;
  correctEl.textContent = correctCount;
  accuracyEl.textContent = totalCount ? ((correctCount / totalCount) * 100).toFixed(1) : '0';
  avgTimeEl.textContent = `Avg Time: ${totalCount ? (totalTime / totalCount).toFixed(2) : '0.00'}s`;
}

function loadNewQuestion() {
  currentQuestion = generateQuestion();
  stackEl.textContent = currentQuestion.stack.toLocaleString();
  blindsEl.textContent = `${currentQuestion.smallBlind.toLocaleString()} / ${currentQuestion.bigBlind.toLocaleString()}`;
  answerEl.classList.add('hidden');
  bbCountEl.textContent = '';
  breakdownEl.textContent = '';
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    timerEl.textContent = `Time: ${elapsed.toFixed(2)}s`;
  }, 100);
}

showAnswerBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  const elapsed = (Date.now() - startTime) / 1000;
  totalTime += elapsed;
  timerEl.textContent = `Time: ${elapsed.toFixed(2)}s`;
  bbCountEl.textContent = currentQuestion.bb;
  breakdownEl.textContent = currentQuestion.breakdown;
  answerEl.classList.remove('hidden');
});

correctBtn.addEventListener('click', () => {
  correctCount++;
  totalCount++;
  updateStats();
  loadNewQuestion();
});

incorrectBtn.addEventListener('click', () => {
  totalCount++;
  updateStats();
  loadNewQuestion();
});

// Initialize
loadNewQuestion();
updateStats();
