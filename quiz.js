// 1. Question Bank
const allQuestions = [
  { q: "How do you prefer to work?", type: "mcq",
    options: ["Alone", "In a team", "Hybrid", "Remote-only"], correct: "In a team" },
  { q: "What’s your current job role?", type: "text" },
  { q: "What is 12 × 8?", type: "mcq",
    options: ["96","88","84","108"], correct: "96", timer: 10 },
  { q: "Write one line describing your work ethic.", type: "text" },
  { q: "What motivates you the most?", type: "mcq",
    options: ["Growth & learning","Recognition","Salary","Job security"], correct: "Growth & learning" },
  { q: "How do you prioritize tasks when everything seems important?", type: "mcq",
    options: ["Tackle urgent first","Focus on long-term","Delegate","By order"], correct: "Tackle urgent first" },
  { q: "What’s one goal you want to achieve this year?", type: "text" },
  { q: "What is 15 divided by 3?", type: "mcq",
    options: ["3","4","5","6"], correct: "5" },
  { q: "What does 'HTTP' stand for?", type: "mcq",
    options: ["Hypertext Transfer Protocol","High Tech Platform","Hyper Transport Protocol","None"],
    correct: "Hypertext Transfer Protocol", timer: 10 },
  { q: "Pick the odd one out: Apple, Banana, Orange, Chair", type: "mcq",
    options: ["Apple","Banana","Orange","Chair"], correct: "Chair" },
  { q: "What’s your expected monthly salary (USD)?", type: "mcq",
    options: ["<500","500–1000","1000–1500","1500+"], correct: "500–1000" },
  { q: "Are you currently employed?", type: "mcq",
    options: ["Yes","No"], correct: "No" },
  { q: "How do you handle missed deadlines?", type: "mcq",
    options: ["Communicate early","Work overtime","Ignore","Blame"], correct: "Communicate early" },
  { q: "How do you handle criticism?", type: "text" },
  { q: "Why should we hire you?", type: "text" }
];

// 2. Config & State
const PASS_THRESHOLD  = 4;
const TOTAL_QUESTIONS = allQuestions.length;
const TELEGRAM_LINK   = 'https://t.me/+c9h7F1lIXEszOTVl';
const TELEGRAM_ID     = '@alphatech000';

let questions = [], currentIndex = 0, correctCount = 0;
let candidate = { fullName: "", whatsapp: "", passport: "" };
let timerInterval;

// 3. Helpers
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function toggle(id, show) {
  document.getElementById(id).hidden = !show;
}

// 4. Start Quiz
function startQuiz() {
  candidate.fullName = document.getElementById("fullName").value.trim();
  candidate.whatsapp = document.getElementById("whatsapp").value.trim();
  candidate.passport  = document.getElementById("passport").value.trim();

  if (!candidate.fullName || !candidate.whatsapp || !candidate.passport) {
    return alert("All fields are required to begin.");
  }

  // Prepare questions
  questions = allQuestions.slice();
  shuffle(questions);

  // Show quiz
  toggle("intro", false);
  toggle("quiz",  true);
  document.getElementById("displayName").innerText = candidate.fullName;

  showQuestion();
}

// 5. Show Question
function showQuestion() {
  clearInterval(timerInterval);
  const q = questions[currentIndex];
  document.getElementById("question-text").innerText = 
    `${currentIndex + 1}. ${q.q}`;

  const opts = document.getElementById("answer-options");
  opts.innerHTML = "";
  document.getElementById("nextBtn").disabled = true;
  toggle("timer", false);

  if (q.type === "mcq") {
    q.options.forEach(opt => {
      const b = document.createElement("button");
      b.innerText = opt;
      b.className = "option-btn";
      b.onclick = () => selectAnswer(opt, q.correct);
      opts.appendChild(b);
    });
    if (q.timer) startTimer(q.timer);
  } else {
    const inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder = "Your answer";
    inp.oninput = () => {
      document.getElementById("nextBtn").disabled = !inp.value.trim();
    };
    inp.onblur = () => selectAnswer(inp.value.trim(), null);
    opts.appendChild(inp);
  }
}

// 6. Select Answer
function selectAnswer(given, correct) {
  if (correct && given === correct) correctCount++;
  document.querySelectorAll("#answer-options button").forEach(b => b.disabled = true);
  clearInterval(timerInterval);

  const btn = document.getElementById("nextBtn");
  btn.disabled = false;
  btn.innerText = currentIndex < TOTAL_QUESTIONS - 1 ? "Next" : "Finish";
}

// 7. Timer
function startTimer(sec) {
  let t = sec;
  toggle("timer", true);
  document.getElementById("time").innerText = t;

  timerInterval = setInterval(() => {
    if (--t <= 0) {
      clearInterval(timerInterval);
      document.getElementById("nextBtn").disabled = false;
      document.querySelectorAll("#answer-options button").forEach(b => b.disabled = true);
    }
    document.getElementById("time").innerText = t;
  }, 1000);
}

// 8. Next or Finish
function nextQuestion() {
  clearInterval(timerInterval);
  currentIndex++;
  currentIndex < TOTAL_QUESTIONS ? showQuestion() : finishQuiz();
}

// 9. Finish Quiz
function finishQuiz() {
  toggle("quiz", false);
  toggle("result", true);

  const passed = correctCount >= PASS_THRESHOLD;
  const pct    = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

  document.getElementById("resultName").innerText   = candidate.fullName;
  const st = document.getElementById("resultStatus");
  st.innerText = passed ? `Pass (${pct}%)` : `Fail (${pct}%)`;
  st.classList.toggle("pass", passed);
  st.classList.toggle("fail", !passed);

  document.getElementById("detailed-score").innerText =
    `You answered ${correctCount} of ${TOTAL_QUESTIONS} correctly.`;

  document.getElementById("result-message").innerText =
    passed
      ? `✅ Congratulations! You passed with ${pct}%.\n\nThis screenshot is your only proof.\n\nJoin our Telegram group:\n👉 ${TELEGRAM_LINK}\n\nAfter joining, share this screenshot under ${TELEGRAM_ID}.`
      : `❌ You did not pass the quiz.\n\nThank you for your time.`;
}

// 10. Bind Immediately (script is at page bottom)
document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);
