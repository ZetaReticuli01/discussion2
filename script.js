const questionList = document.getElementById("question-list");
const searchBar = document.getElementById("search-bar");
const questionForm = document.getElementById("new-question-form");
const responseForm = document.getElementById("response-form");
const questionDetails = document.getElementById("question-details");
const questionTitle = document.getElementById("question-title");
const questionContent = document.getElementById("question-content");
const responseList = document.getElementById("response-list");
const resolveBtn = document.getElementById("resolve-btn");

let questions = [];
let selectedQuestionIndex = null;

// Add a new question
questionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const question = document.getElementById("question").value;

  questions.push({ title, question, responses: [], votes: 0 });
  renderQuestions();
  questionForm.reset();
});

// Render questions in the left pane
function renderQuestions() {
  questionList.innerHTML = "";
  questions
    .sort((a, b) => b.votes - a.votes) // Sort by votes
    .forEach((q, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";
      questionDiv.innerHTML = `
        <h4>${q.title}</h4>
        <p>Votes: ${q.votes}</p>
        <button class="upvote" data-index="${index}">⬆</button>
        <button class="downvote" data-index="${index}">⬇</button>
      `;
      questionDiv.addEventListener("click", () => selectQuestion(index));
      questionList.appendChild(questionDiv);
    });
}

// Select a question to display details
function selectQuestion(index) {
  selectedQuestionIndex = index;
  const question = questions[index];

  document.getElementById("question-form").classList.add("hidden");
  questionDetails.classList.remove("hidden");

  questionTitle.innerText = question.title;
  questionContent.innerText = question.question;

  renderResponses(question.responses);
}

// Add a new response
responseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const comment = document.getElementById("comment").value;

  questions[selectedQuestionIndex].responses.push({ name, comment, votes: 0 });
  renderResponses(questions[selectedQuestionIndex].responses);
  responseForm.reset();
});

// Render responses
function renderResponses(responses) {
  responseList.innerHTML = "";
  responses
    .sort((a, b) => b.votes - a.votes) // Sort by votes
    .forEach((r, index) => {
      const responseDiv = document.createElement("div");
      responseDiv.innerHTML = `
        <p><strong>${r.name}:</strong> ${r.comment} (Votes: ${r.votes})</p>
        <button class="upvote-response" data-index="${index}">⬆</button>
        <button class="downvote-response" data-index="${index}">⬇</button>
      `;
      responseList.appendChild(responseDiv);
    });
}

// Resolve a question
resolveBtn.addEventListener("click", () => {
  questions.splice(selectedQuestionIndex, 1);
  renderQuestions();

  questionDetails.classList.add("hidden");
  document.getElementById("question-form").classList.remove("hidden");
});

// Search questions
searchBar.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchText)
  );
  questionList.innerHTML = "";
  filteredQuestions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `<h4>${q.title}</h4>`;
    questionDiv.addEventListener("click", () => selectQuestion(index));
    questionList.appendChild(questionDiv);
  });
});

// Handle voting
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("upvote")) {
    const index = e.target.dataset.index;
    questions[index].votes++;
    renderQuestions();
  } else if (e.target.classList.contains("downvote")) {
    const index = e.target.dataset.index;
    questions[index].votes--;
    renderQuestions();
  }
});
