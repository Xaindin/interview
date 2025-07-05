const questions = [
  {
    q: "How do you prefer to work?",
    type: "mcq",
    options: ["Alone", "In a team", "Hybrid", "Remote-only"]
  },
  {
    q: "What’s your current job role?",
    type: "text"
  },
  {
    q: "What is 12 × 8?",
    type: "mcq",
    options: ["96", "88", "84", "108"],
    correct: "96",
    timer: 10
  },
  {
    q: "Write one line describing your work ethic.",
    type: "text"
  }
];

let currentIndex = 0;
let userAnswers = [];
let timerInterval;

function startQuiz() {
  const name = document.getElementById('fullName').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const passport = document.getElementById('passport').value.trim();

  if (!name || !whatsapp || !passport) {
    alert("Please fill in all required fields.");
    return;
  }

  userAnswers.push({ fullName: name, whatsapp, passport });

  document.getElementById('intro').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';

  showQuestion();
}

function showQuestion() {
  const qObj = questions[currentIndex];
  document.getElementById('question-text').innerText = qObj.q;
  document.getElementById('answer-options').innerHTML = '';
  document.getElementById('nextBtn').style.display = 'none';

  if (qObj.type === 'mcq') {
    qObj.options.forEach(option => {
      const btn = document.createElement('button');
      btn.innerText = option;
      btn.onclick = () => {
        userAnswers.push({ question: qObj.q, answer: option });
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
      document.getElementById('nextBtn').style.display = 'block';
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
    }
  }, 1000);
}

function nextQuestion() {
  const input = document.querySelector('#answer-options input');
  if (input) {
    userAnswers.push({ question: questions[currentIndex].q, answer: input.value });
  }
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
  document.getElementById('result-message').innerText = '✅ Thank you. Your responses have been recorded.';
  sendToGoogleSheet();
}

function sendToGoogleSheet() {
  fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userAnswers)
  });
}