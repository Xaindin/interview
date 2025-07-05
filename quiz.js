const allQuestions = [
  { q: "How do you prefer to work?", type: "mcq", options: ["Alone", "In a team", "Hybrid", "Remote-only"], correct: "In a team" },
  { q: "What’s your current job role?", type: "text" },
  { q: "What is 12 × 8?", type: "mcq", options: ["96", "88", "84", "108"], correct: "96", timer: 10 },
  { q: "Write one line describing your work ethic.", type: "text" },
  { q: "What motivates you the most?", type: "mcq", options: ["Growth & learning", "Recognition", "Salary", "Job security"], correct: "Growth & learning" },
  { q: "How do you prioritize tasks when everything seems important?", type: "mcq", options: ["Tackle urgent first", "Focus on long-term", "Delegate", "By order"], correct: "Tackle urgent first" },
  { q: "What’s one goal you want to achieve this year?", type: "text" },
  { q: "What is 15 divided by 3?", type: "mcq", options: ["3", "4", "5", "6"], correct: "5" },
  { q: "What does 'HTTP' stand for?", type: "mcq", options: ["Hypertext Transfer Protocol", "High Tech Platform", "Hyper Transport Protocol", "None"], correct: "Hypertext Transfer Protocol", timer: 10 },
  { q: "Pick the odd one out: Apple, Banana, Orange, Chair", type: "mcq", options: ["Apple", "Banana", "Orange", "Chair"], correct: "Chair" },
  { q: "What’s your expected monthly salary (USD)?", type: "mcq", options: ["<500", "500–1000", "1000–1500", "1500+"], correct: "500–1000" },
  { q: "Are you currently employed?", type: "mcq", options: ["Yes", "No"], correct: "No" },
  { q: "How do you handle missed deadlines?", type: "mcq", options: ["Communicate early", "Work overtime", "Ignore", "Blame"], correct: "Communicate early" },
  { q: "How do you handle criticism?", type: "text" },
  { q: "Why should we hire you?", type: "text" }
];

let questions = [];
let currentIndex = 0;
let userAnswers = [];
let correctCount = 0;
let timerInterval;

function startQuiz() {
  const name = document.getElementById('fullName').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const passport = document.getElementById('passport').value.trim();

  if (!name || !whatsapp || !passport) {
    alert("Please fill in all required fields.");
    return;
  }

  userAnswers = [{ fullName: name, whatsapp, passport }];

  questions = [...allQuestions]
    .map(q => ({ q, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ q }) => q)
    .slice(0, 7);

  document.getElementById('intro').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';

  showQuestion();
}

function showQuestion() {
  const qObj = questions[currentIndex];
  document.getElementById('question-text').innerText = qObj.q;
  document.getElementById('answer-options').innerHTML = '';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('timer').style.display = 'none';

  if (qObj.type === 'mcq') {
    qObj.options.forEach(option => {
      const btn = document.createElement('button');
      btn.innerText = option;
      btn.onclick = () => {
        document.querySelectorAll('#answer-options button').forEach(b => b.disabled = true);
        userAnswers.push({ question: qObj.q, answer: option });
        if (qObj.correct && option === qObj.correct) correctCount++;
        clearInterval(timerInterval);
        document.getElementById('nextBtn').style.display = 'block';
      };
      document.getElementById('answer-options').appendChild(btn);
    });
    if (qObj.timer) startTimer(qObj.timer);
  } else if (qObj.type === 'text') {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Your answer';
    input.oninput = () => {
      document.getElementById('nextBtn').style.display = input.value.trim() ? 'block' : 'none';
    };
    input.onblur = () => {
      userAnswers.push({ question: qObj.q, answer: input.value });
    };
    document.getElementById('answer-options').appendChild(input);
  }
}

function startTimer(seconds) {
  document.getElementById('timer').style.display = 'block';
  let timeLeft = seconds;
  document.getElementById('time').innerText = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('time').innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById('nextBtn').style.display = 'block';
      document.querySelectorAll('#answer-options button').forEach(b => b.disabled = true);
    }
  }, 1000);
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('result').style.display = 'block';

  const passThreshold = 4;
  const passed = correctCount >= passThreshold;

  const telegramLink = 'https://t.me/+c9h7F1lIXEszOTVl';

  const resultMsg = passed
    ? `✅ You passed the quiz take the screenshot and copy the link below and save it in your notepad this is the only proof that you have passed the quiz.\n\nYour application is shortlisted for interview.\n\n📌 Please download Telegram and join the group below:\n👉 ${telegramLink}\n\n⚠️ Make sure your Telegram display name matches your passport name to be accepted once you got approved send this screenshot in the group and wait for interview.`
    : `❌ You did not pass the quiz.\n\nThank you for your time.`;

  document.getElementById('result-message').innerText = resultMsg;
  sendToGoogleSheet();
}

function sendToGoogleSheet() {
  fetch('https://script.google.com/macros/s/AKfycbwdsuzmGNNrcNTi9QCarHlBCOAbk98VPZrM-zYXyBBGMG4CZySayGvYoRCstnZSLLmytg/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userAnswers)
  });
}
