// 1. Config
const PASS_THRESHOLD   = 4;
const TOTAL_QUESTIONS  = allQuestions.length;

// 2. Question Bank
const allQuestions = [
  { q: "How do you prefer to work?", type: "mcq",
    options: ["Alone", "In a team", "Hybrid", "Remote-only"], correct: "In a team" },
  { q: "What’s your current job role?", type: "text" },
  { q: "What is 12 × 8?", type: "mcq",
    options: ["96", "88", "84", "108"], correct: "96", timer: 10 },
  { q: "Write one line describing your work ethic.", type: "text" },
  { q: "What motivates you the most?", type: "mcq",
    options: ["Growth & learning", "Recognition", "Salary", "Job security"], correct: "Growth & learning" },
  { q: "How do you prioritize tasks when everything seems important?", type: "mcq",
    options: ["Tackle urgent first", "Focus on long-term", "Delegate", "By order"], correct: "Tackle urgent first" },
  { q: "What’s one goal you want to achieve this year?", type: "text" },
  { q: "What is 15 divided by 3?", type: "mcq",
    options: ["3", "4", "5", "6"], correct: "5" },
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

// 3. State
let questions     = [];
let currentIndex  = 0;
let correctCount  = 0;
let candidate     = { fullName: "", whatsapp: "", passport: "" };
let timerInterval;

// 4. Helpers
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function toggle(id, show) {
  document.getElementById(id).hidden = !show;
}

// 5. Start Quiz
function startQuiz() {
  candidate.fullName = document.getElementById("fullName").value.trim();
  candidate.whatsapp = document.getElementById("whatsapp").value.trim();
  candidate.passport  = document.getElementById("passport").value.trim();

  if (!candidate.fullName || !candidate.whatsapp || !candidate.passport) {
    alert("All fields are required to begin.");
    return;
  }

  // Prepare & shuffle questions
  questions = allQuestions.slice();
  shuffle(questions);

  toggle("intro", false);
  toggle("quiz",  true);

  document.getElementById("displayName").innerText = candidate.fullName;
  showQuestion();
}

// 6. Show Question
function showQuestion() {
  clearInterval(timerInterval);
  const qObj = questions[currentIndex];

  document.getElementById("question-text").innerText =
    `${currentIndex + 1}. ${qObj.q}`;
  const container = document.getElementById("answer-options");
  container.innerHTML = "";
  document.getElementById("nextBtn").disabled = true;
  toggle("timer", false);

  if (qObj.type === "mcq") {
    qObj.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.className = "option-btn";
      btn.onclick = () => handleAnswer(opt, qObj.correct);
      container.appendChild(btn);
    });
    if (qObj.timer) startTimer(qObj.timer);
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Your answer here";
    input.oninput = () => {
      document.getElementById("nextBtn").disabled = !input.value.trim();
    };
    input.onblur   = () => handleAnswer(input.value.trim(), null);
    container.appendChild(input);
  }
}

// 7. Handle Answer
function handleAnswer(given, correct) {
  if (correct && given === correct) correctCount++;
  document.querySelectorAll("#answer-options button")
          .forEach(b => b.disabled = true);
  clearInterval(timerInterval);

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled   = false;
  nextBtn.innerText  = currentIndex < TOTAL_QUESTIONS - 1 ? "Next" : "Finish";
}

// 8. Timer
function startTimer(sec) {
  let t = sec;
  toggle("timer", true);
  document.getElementById("time").innerText = t;

  timerInterval = setInterval(() => {
    t--;
    document.getElementById("time").innerText = t;
    if (t <= 0) {
      clearInterval(timerInterval);
      document.getElementById("nextBtn").disabled = false;
      document.querySelectorAll("#answer-options button").forEach(b => b.disabled = true);
    }
  }, 1000);
}

// 9. Next or Finish
function nextQuestion() {
  clearInterval(timerInterval);
  currentIndex++;
  if (currentIndex < TOTAL_QUESTIONS) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

// 10. Show Results
function finishQuiz() {
  toggle("quiz",   false);
  toggle("result", true);

  const passed  = correctCount >= PASS_THRESHOLD;
  const percent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

  document.getElementById("resultName").innerText   = candidate.fullName;
  const statusEl = document.getElementById("resultStatus");
  statusEl.textContent = passed ? `Pass (${percent}%)` : `Fail (${percent}%)`;
  statusEl.classList.toggle("pass", passed);
  statusEl.classList.toggle("fail", !passed);

  document.getElementById("detailed-score").innerText =
    `You answered ${correctCount} of ${TOTAL_QUESTIONS} correctly.`;

  document.getElementById("result-message").innerText =
    passed
      ? "✅ Congratulations! You're shortlisted for the interview. Please save this screenshot."
      : "❌ Thank you for your time. Better luck next time.";
}

// 11. Bind Events
document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);
