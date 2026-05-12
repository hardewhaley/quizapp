let quizData = [];
let userAnswers = []

let currentQuestion = 0;
let timeLeft = 600;
let timerInterval;
let correct = 0;
let wrong = 0;
let selectedOption;


function formatMinSec(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ":" + String(seconds).padStart(2, "0");
}

function shuffleArray(array) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]]
            = [arr[j], arr[i]]
    }
    return arr
}

function shuffleOptions(question) {
    const correctOption = question.options[question.answer];

    const shuffledOptions = shuffleArray(question.options);

    const newCorrectIndex = shuffledOptions.indexOf(correctOption);

    return {
        ...question,
        options: shuffledOptions,
        answer: newCorrectIndex
    };
}

function prepareQuiz(data) {
    // shuffle questions first
    const shuffledQuestions = shuffleArray(data);

    // shuffle options inside each question
    return shuffledQuestions.map(q => shuffleOptions(q));
}


function startTimer() {
    clearInterval(timerInterval);
    // timeLeft = 30;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = formatMinSec(timeLeft)

        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}


function loadQuestion() {
    const q = quizData[currentQuestion];
    document.getElementById("question").textContent =
        `${currentQuestion + 1}. ${q.question}`;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    const labels = ["A", "B", "C", "D"];

    q.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.textContent = `${labels[index]}. ${opt}`;
        btn.className =
            "block w-full cursor-pointer text-left px-4 py-2 border rounded-lg hover:bg-blue-100";

        btn.onclick = () => selectOption(btn, index);

        if (userAnswers[currentQuestion] === index) {
            btn.classList.add("bg-blue-200");
            selectedOption = index;
        }

        optionsDiv.appendChild(btn);
    });

    if (userAnswers[currentQuestion] === undefined) {
        selectedOption = undefined;
    }

    const display = document.getElementById("noofquiz");
    display.innerText =
        `Question ${currentQuestion + 1} of ${quizData.length}`;

    const progress = Math.floor(
        (currentQuestion / quizData.length) * 100
    );

    document.getElementById("quizpct").innerText = `${progress}%`;

    const progressDiv = document.getElementById("progress");
    progressDiv.style.width = `${progress}%`;

    startTimer();
}

function renderQuestionReview() {
    const container = document.getElementById("content-review");

    container.innerHTML = quizData
        .map((questionData, questionIndex) => {
            const userAnswerIndex = userAnswers[questionIndex];
            const isCorrect =
                userAnswerIndex === questionData.answer;

            const optionsHTML = questionData.options
                .map((option, index) => {
                    const letter = String.fromCharCode(65 + index);

                    let classes =
                        "space-y-3 w-full p-2 rounded-lg mt-2 flex justify-between items-center border";

                    let icon = "";

                    // Highlight correct answer
                    if (index === questionData.answer) {
                        classes +=
                            " border-2 border-green-500 bg-green-50";
                        icon =
                            '<span><i class="fa-solid fa-check text-green-500"></i></span>';
                    }

                    // Highlight incorrect selected answer
                    if (
                        index === userAnswerIndex &&
                        index !== questionData.answer
                    ) {
                        classes +=
                            " border-2 border-red-500 bg-red-100";
                        icon =
                            '<span><i class="fa-solid fa-xmark text-red-500"></i></span>';
                    }

                    return `
                        <div class="${classes}">
                            <span>${letter}. ${option}</span>
                            ${icon}
                        </div>
                    `;
                })
                .join("");

            return `
                <div class="p-4 bg-gray-50 border-t mb-6 rounded-lg">
                    <div class="flex justify-between mb-4">
                        <h2 class="text-xl font-bold">
                            Question ${questionIndex + 1}
                        </h2>
                        <span class="font-semibold ${isCorrect
                    ? "text-green-600"
                    : "text-red-600"
                }">
                            ${isCorrect
                    ? "Correct"
                    : "Incorrect"
                }
                        </span>
                    </div>

                    <div class="text-lg font-medium mb-4">
                        ${questionIndex + 1}. ${questionData.question
                }
                    </div>

                    <div class="w-full">
                        ${optionsHTML}
                    </div>
                </div>
            `;
        })
        .join("");

}


function selectOption(button, index) {
    selectedOption = index;

    userAnswers[currentQuestion] = index;

    const buttons = document.querySelectorAll("#options button");
    buttons.forEach(btn => btn.classList.remove("bg-blue-200"));

    button.classList.add("bg-blue-200");
}

function endQuiz() {
    correct = 0;
    wrong = 0;

    quizData.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
            correct++;
        } else {
            wrong++;
        }
    });

    const result = document.getElementById("result");
    result.classList.remove("hidden");

    const quiz = document.getElementById("quiz-question");
    quiz.classList.add("hidden");

    document.getElementById("correct").innerText = correct;
    document.getElementById("wrong").innerText = wrong;

    const percentage = Math.floor(
        (correct / quizData.length) * 100
    );

    document.getElementById("percentage").innerText =
        `${percentage}%`;

    const chart = document.getElementById("chart");
    chart.style.background =
        `conic-gradient(#3b82f6 ${percentage}%, #e5e7eb 0)`;

    renderQuestionReview();

    clearInterval(timerInterval);
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        endQuiz()
    }
}


function toggleAccordion(id) {
    const content = document.getElementById(id);
    content.classList.toggle('hidden');
}

function prevQuestion() {
    if (currentQuestion <= 0) return;
    currentQuestion--;

    // if (currentQuestion < quizData.length) {
    loadQuestion();
    // } else {
    //     document.querySelector(".bg-white").innerHTML =
    //         "<h2 class='text-xl font-bold text-center'>Quiz Completed 🎉</h2>";
    //     clearInterval(timerInterval);
    // }
}

async function loadQuiz() {
    const res = await fetch("./questions.json")
    quizData = prepareQuiz(await res.json());

    loadQuestion()
}

loadQuiz()
