// 1. Question Bank
const allQuestions = [
  { q: "How do you prefer to work?", type: "mcq",
    options: ["Alone","In a team","Hybrid","Remote-only"], correct: "In a team" },
  { q: "What’s your current job role?", type: "text" },
  { q: "What is 12 × 8?", type: "mcq",
    options: ["96","88","84","108"], correct: "96" },
  { q: "Write one line describing your work ethic.", type: "text" },
  { q: "What motivates you the most?", type: "mcq",
    options: ["Growth & learning","Recognition","Salary","Job security"], correct: "Growth & learning" },
  { q: "What’s one goal you want to achieve this year?", type: "text" },
  { q: "What is 15 divided by 3?", type: "mcq",
    options: ["3","4","5","6"], correct: "5" },
  { q: "Pick the odd one out: Apple, Banana, Orange, Chair", type: "mcq",
    options: ["Apple","Banana","Orange","Chair"], correct: "Chair" },
  { q: "Are you currently employed?", type: "mcq",
    options: ["Yes","No"], correct: "No" },
  { q: "Why should we hire you?", type: "text" },
  // … add more if needed
];

// 2. Config
const MAX_QUESTIONS      = 10;
const TIME_PER_QUESTION  = 20;    // seconds
const PASS_PERCENT       = 70;
const TELEGRAM_LINK      = "https://t.me/+c9h7F1lIXEszOTVl";
const TELEGRAM_ID        = "@alphatech000";

// 3. State
let questions    = [];
let currentIndex = 0;
let correctCount = 0;
let candidate    = { fullName:"", whatsapp:"", passport:"" };
let timerInterval;

// 4. Helpers
function shuffle(arr) {
  for (let i = arr.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
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
    return alert("All fields are required.");
  }

  // pick random questions
  questions = allQuestions.slice();
  shuffle(questions);
  questions = questions.slice(0, MAX_QUESTIONS);

  // show quiz
  toggle("intro", false);
  toggle("quiz",  true);
  document.getElementById("displayName").innerText = candidate.fullName;
  currentIndex = 0;
  correctCount = 0;

  showQuestion();
}

// 6. Show Question
function showQuestion() {
  clearInterval(timerInterval);
  const q = questions[currentIndex];
  document.getElementById("question-text").innerText = 
    `${currentIndex+1}. ${q.q}`;

  const opts = document.getElementById("answer-options");
  opts.innerHTML = "";
  document.getElementById("nextBtn").disabled = true;

  // start timer
  let t = TIME_PER_QUESTION;
  document.getElementById("time").innerText = t;
  toggle("timer", true);
  timerInterval = setInterval(() => {
    t--;
    document.getElementById("time").innerText = t;
    if (t <= 0) {
      clearInterval(timerInterval);
      selectAnswer(null, q.correct);
    }
  }, 1000);

  if (q.type === "mcq") {
    q.options.forEach(opt => {
      const b = document.createElement("button");
      b.innerText = opt;
      b.className = "option-btn";
      b.onclick = () => selectAnswer(opt, q.correct);
      opts.appendChild(b);
    });
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

// 7. Handle Selection
function selectAnswer(given, correct) {
  clearInterval(timerInterval);
  document.querySelectorAll("#answer-options button")
          .forEach(b => b.disabled = true);

  if (given && given === correct) correctCount++;

  const btn = document.getElementById("nextBtn");
  btn.disabled = false;
  btn.innerText = currentIndex < MAX_QUESTIONS-1 ? "Next" : "Finish";
}

// 8. Next or Finish
function nextQuestion() {
  currentIndex++;
  if (currentIndex < MAX_QUESTIONS) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

// 9. Finish Quiz
function finishQuiz() {
  toggle("quiz", false);
  toggle("result", true);

  const pct    = Math.round((correctCount/MAX_QUESTIONS)*100);
  const passed = pct >= PASS_PERCENT;

  document.getElementById("resultName").innerText   = candidate.fullName;
  const st = document.getElementById("resultStatus");
  st.innerText = passed ? `Pass (${pct}%)` : `Fail (${pct}%)`;
  st.className = passed ? "pass" : "fail";

  document.getElementById("detailed-score").innerText =
    `Correct: ${correctCount} / ${MAX_QUESTIONS}`;

  if (passed) {
    document.getElementById("result-message").innerText =
`✅ Congratulations, you passed with ${pct}%!
This screenshot is your only proof.

Join our Telegram group:
${TELEGRAM_LINK}

After joining, post this screenshot under ${TELEGRAM_ID}.`;
  } else {
    document.getElementById("result-message").innerText =
`❌ You did not pass the quiz.
Thank you for your time.`;
  }
}

// 10. Bind Events
document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);
```
