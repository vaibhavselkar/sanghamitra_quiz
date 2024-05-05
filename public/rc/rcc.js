let questions = []; // Define an empty array to store the questions data

document.addEventListener("DOMContentLoaded", function() {
    const nameInput = document.getElementById('name-prepo');
    fetchPassagesAndQuestions();

    const submitButton = document.getElementById('submitButton-prepo');
    
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        if (nameInput.value.trim() === '') {
            // Display error message and return without further processing
            alert('Please enter your name before submitting.');
            return;
        }
        stopTimer(); // Stop the timer when the quiz is submitted
        const score = calculateScore(); // Calculate the score
        submitForm(nameInput, score); // Pass the name input and score to the submitForm function
        submitButton.style.display = 'none'; // Hide the submit button
    
        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        // Add a new button for feedback
        const feedbackLink = document.createElement('a');
        feedbackLink.textContent = 'Click To Provide Feedback';
        feedbackLink.href = 'https://forms.gle/VmWRLfKCfR4MnnRp7'; // Add your feedback link here
        feedbackLink.classList.add('btn', 'btn-outline-success');
        feedbackLink.target = '_blank';
        buttonContainer.appendChild(feedbackLink);

        // Add a button for statistics
        const statisticsButton = document.createElement('button');
        statisticsButton.textContent = 'View Statistics';
        statisticsButton.classList.add('btn', 'btn-outline-success', 'mx-2');
        statisticsButton.onclick = function() {
            window.location.href = '../submission.html'; // Replace 'statistics.html' with your actual statistics page URL
        };
        buttonContainer.appendChild(statisticsButton);
        
        // Add a button for home page
        const homeButton = document.createElement('button');
        homeButton.textContent = 'Home';
        homeButton.classList.add('btn', 'btn-outline-success');
        homeButton.onclick = function() {
            window.location.href = '../english.html'; // Replace 'index.html' with your actual home page URL
        };
        buttonContainer.appendChild(homeButton);

        // Append the button container to the parent element of submitButton
        submitButton.parentNode.appendChild(buttonContainer);
    });

    document.getElementById("nameForm").addEventListener("submit", function(event) {
        event.preventDefault();
    });

    nameInput.addEventListener('input', (event) => {
        toggleSubmitButton();
    });
});

function fetchPassagesAndQuestions() {
    // Fetch passages and questions from backend API
    fetch('https://my-postgres-server.vercel.app/rc1')
        .then(response => response.json())
        .then(data => {
            // Organize data into passages and questions
            const passages = {};
            data.forEach(row => {
                if (!passages[row.passage_id]) {
                    passages[row.passage_id] = {
                        passageNumber: row.passage_id,
                        passageText: row.passage_text,
                        questions: []
                    };
                }
                passages[row.passage_id].questions.push({
                    passageId: row.passage_id, // Add passageId for reference
                    questionId: row.question_id, // Add questionId for reference
                    questionText: row.question_text,
                    correctOption: row.correct_option,
                    options: {
                        a: row.option_a,
                        b: row.option_b,
                        c: row.option_c,
                        d: row.option_d
                    }
                });
            });

            // Flatten passages object to questions array
            questions = Object.values(passages).flatMap(passage => passage.questions);

            // Populate passages and questions into the HTML
            const quizContainer = document.getElementById('quiz-container');
            quizContainer.innerHTML = '';

            for (const passageId in passages) {
                const passage = passages[passageId];
                const passageDiv = document.createElement('div');
                passageDiv.classList.add('passage');
                passageDiv.innerHTML = `<p> ${passage.passageText}</p>`;

                const questionsDiv = document.createElement('div');
                questionsDiv.classList.add('questions');
                questionsDiv.innerHTML = `<h2>Questions:</h2>`;

                const questionList = document.createElement('ol'); // Use <ol> for ordered list
                passage.questions.forEach((question, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <p>${question.questionText}</p>
                        <div class="options">
                            <button class="option" data-passage-id="${question.passageId}" data-question-id="${question.questionId}" data-option="a">a. ${question.options.a}</button>
                            <button class="option" data-passage-id="${question.passageId}" data-question-id="${question.questionId}" data-option="b">b. ${question.options.b}</button>
                            <button class="option" data-passage-id="${question.passageId}" data-question-id="${question.questionId}" data-option="c">c. ${question.options.c}</button>
                            <button class="option" data-passage-id="${question.passageId}" data-question-id="${question.questionId}" data-option="d">d. ${question.options.d}</button>
                            <p></p> <!-- Empty paragraph for line space -->
                        </div>
                    `;

                    questionList.appendChild(listItem);
                });
                questionsDiv.appendChild(questionList);

                quizContainer.appendChild(passageDiv);
                quizContainer.appendChild(questionsDiv);
            }
            timerDisplay = document.getElementById('timer-prepo');
            startTimer();
        })
        .catch(error => console.error('Error fetching data:', error));
}

const selectedOptions = {};

function selectOption(event) {
    const optionButton = event.target;
    const passageId = optionButton.getAttribute('data-passage-id');
    const questionId = optionButton.getAttribute('data-question-id');
    const option = optionButton.getAttribute('data-option');

    const options = document.querySelectorAll(`.option[data-passage-id="${passageId}"][data-question-id="${questionId}"]`);
    options.forEach(opt => opt.classList.remove('selected'));

    optionButton.classList.add('selected');
    selectedOptions[`${passageId}_${questionId}`] = option;

    // Enable the submit button
    toggleSubmitButton();
}

function startTimer() {
    startTime = Date.now();
    displayTime();
    timerInterval = setInterval(displayTime, 1000);
}

function displayTime() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeElapsed = elapsedTime;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function calculateScore() {
    let score = 0;
    for (const key in selectedOptions) {
        const [passageId, questionId] = key.split('_');
        const selectedOption = selectedOptions[key];
        
        // Find the corresponding question data
        const question = questions.find(q => q.passageId === passageId && q.questionId === questionId);
        if (!question) {
            console.log(`Question not found for passageId: ${passageId}, questionId: ${questionId}`);
            continue; // Skip if question not found
        }
        
        const correctOption = question.correctOption;

        console.log(`Passage ${passageId}, Question ${questionId}`);
        console.log('Selected Option:', selectedOption);
        console.log('Correct Option:', correctOption);

        if (selectedOption === correctOption) {
            score++;
            console.log('Score incremented:', score);
        }
    }
    console.log('Final score:', score);
    return score;
}


function toggleSubmitButton() {
    const submitButton = document.getElementById('submitButton-prepo');
    submitButton.disabled = false; // Enable the submit button
}


function submitForm(nameInput, score) {
    const totalQuestions = questions.length;
    const percentageScore = (score / totalQuestions) * 100;

    const formData = {
        username: nameInput.value,
        passage: "rc-trial", // Assuming total questions is the passage number
        score: percentageScore.toFixed(2), // Format score as a percentage
        time: timeElapsed // Assuming timeElapsed is the time in seconds
    };

    // Send POST request to save score
    fetch('https://my-postgres-server.vercel.app/rc_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score saved successfully:', data);
    })
    .catch(error => {
        console.error('Error saving score:', error);
    });

    // Clear the quiz container
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    // Create a new element to display the score as a percentage
    const scoreElement = document.createElement('h1');
    scoreElement.textContent = `Your score: ${percentageScore.toFixed(2)}%`;

    // Append the score element to the quiz container
    quizContainer.appendChild(scoreElement);
}


document.addEventListener('click', function(event) {
    if (event.target.classList.contains('option')) {
        selectOption(event);
    }
    toggleSubmitButton();
});
