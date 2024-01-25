const questions = [];
let currentQuestionIndex = 0;

function loadQuestionsFromFile() {
  const filePath = "isg.txt";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", filePath, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      processFileContent(xhr.responseText);
      displayQuestion();
    }
  };
  xhr.send();
}

function processFileContent(fileContent) {
  const lines = fileContent.split("\n");

  for (let i = 0; i < lines.length; i += 6) {
    const questionText = lines[i]?.trim();
    const choices = (lines.slice(i + 1, i + 5) || []).map((choice) =>
      choice.trim()
    );

    // Doğru cevap
    const correctAnswerString = lines[i + 5]?.trim().toUpperCase();

    if (
      questionText &&
      choices.length === 4 &&
      correctAnswerString !== undefined
    ) {
      const correctAnswerIndex = choices.findIndex((choice) =>
        choice.toUpperCase().startsWith(correctAnswerString)
      );

      if (correctAnswerIndex !== -1) {
        questions.push({
          question: questionText,
          choices: choices,
          correctAnswer: correctAnswerIndex,
        });
      } else {
        console.error(`Hata: Doğru cevap bulunamadı - Satır: ${i + 6}`);
      }
    } else {
      console.error(
        `Hata: Soru veya doğru cevap bilgisi eksik - Satır: ${i + 6}`
      );
    }
  }
}

function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion && currentQuestion.choices) {
    document.getElementById("question").textContent = currentQuestion.question;

    const choiceButtons = document.querySelectorAll(".choice");

    if (currentQuestion.choices.length === choiceButtons.length) {
      choiceButtons.forEach((button, index) => {
        button.textContent = currentQuestion.choices[index];
        button.classList.remove("correct", "incorrect");
      });
    } else {
      console.error("Hata: Soru şıkları eksik veya fazla.");
    }
  } else {
    console.error("Hata: Sorular yüklenirken bir sorun oluştu.");
  }
}

function checkAnswer(button) {
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion || !Array.isArray(currentQuestion.choices)) {
    console.error("Hata: Soru bilgisi veya şıklar eksik.");
    return;
  }

  const selectedAnswerIndex = currentQuestion.choices.findIndex(
    (choice, index) => button.textContent.includes(choice)
  );

  if (selectedAnswerIndex === -1) {
    console.error("Hata: Geçersiz şık indeksi.");
    return;
  }

  const correctAnswerIndex = currentQuestion.correctAnswer;

  const choices = document.querySelectorAll(".choice");

  if (correctAnswerIndex < 0 || correctAnswerIndex >= choices.length) {
    console.error("Hata: Geçersiz doğru cevap indeksi.");
    return;
  }

  choices.forEach((choice, index) => {
    choice.classList.remove("correct", "incorrect");
  });

  choices[correctAnswerIndex].classList.add("correct");

  if (selectedAnswerIndex === correctAnswerIndex) {
    choices[selectedAnswerIndex].classList.add("correct");
  } else {
    choices[selectedAnswerIndex].classList.add("incorrect");
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
    document
      .querySelectorAll(".choice")
      .forEach((button) => button.classList.remove("correct", "incorrect"));
  } else {
    alert("Quiz bitti!");
  }
}

function previousQuestion() {
  currentQuestionIndex--;
  if (currentQuestionIndex >= 0) {
    displayQuestion();
    document
      .querySelectorAll(".choice")
      .forEach((button) => button.classList.remove("correct", "incorrect"));
  } else {
    currentQuestionIndex = 0;
  }
}

function goToQuestionByNumber() {
  const questionNumberInput = document.getElementById("questionNumber");
  const targetQuestionIndex = parseInt(questionNumberInput.value, 10) - 1;

  if (
    !isNaN(targetQuestionIndex) &&
    targetQuestionIndex >= 0 &&
    targetQuestionIndex < questions.length
  ) {
    currentQuestionIndex = targetQuestionIndex;
    displayQuestion();
    document
      .querySelectorAll(".choice")
      .forEach((button) => button.classList.remove("correct", "incorrect"));
  } else {
    console.error("Hata: Geçersiz soru numarası.");
  }
}

document
  .getElementById("questionNumber")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      goToQuestionByNumber();
    }
  });

document.addEventListener("contextmenu", function (event) {
  event.preventDefault();

  // nextQuestion()
  nextQuestion();
});

// İlk soru
loadQuestionsFromFile();
