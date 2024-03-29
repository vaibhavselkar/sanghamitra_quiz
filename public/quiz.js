document.addEventListener("DOMContentLoaded", function() {
    console.log('Quiz1.js script loaded');

    const questionsContainer = document.getElementById('questionsContainer');
    const submitButton = document.getElementById('submitButton');
    const nameInput = document.getElementById('name');
    let questions;
    let selectedOptions = new Array(50).fill(null); // Array to store selected options
    let name;

    // Function to fetch questions data
    function fetchQuestions() {
        fetch('https://my-postgres-server.vercel.app/quiz1')
            .then(res => res.json())
            .then(data => {
                questions = data;
                displayQuestions();
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

    // Function to display the questions
    function displayQuestions() {
        questionsContainer.innerHTML = ''; // Clear previous questions

        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <div>
                    <p>${index + 1}. ${question.question}</p>
                    <div class="options">
                        <button class="option" data-index="${index}" data-option="a">a. ${question.option_a}</button>
                        <button class="option" data-index="${index}" data-option="b">b. ${question.option_b}</button>
                        <button class="option" data-index="${index}" data-option="c">c. ${question.option_c}</button>
                        <button class="option" data-index="${index}" data-option="d">d. ${question.option_d}</button>
                    </div>
                </div>
            `;
            questionsContainer.appendChild(questionElement);
        });

        // Add event listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', selectOption);
        });
    }

    // Event listener for the "Submit" button
    submitButton.addEventListener('click', () => {
        calculateScore();
    });

    // Function to select option for each question
    function selectOption(event) {
        const index = event.target.dataset.index;
        const option = event.target.dataset.option;
        selectedOptions[index] = option;
        document.querySelectorAll(`.option[data-index="${index}"]`).forEach(opt => {
            opt.classList.remove('selected');
        });
        event.target.classList.add('selected');
    }

    // Function to calculate score
    function calculateScore() {
        let score = 0;
        for (let i = 0; i < questions.length; i++) {
            if (selectedOptions[i] === questions[i].correct_option) {
                score++;
            }
        }
        // Submit form with name and score
        submitForm(name, score);
    }

    // Function to submit form with name and score
    function submitForm(name, score) {
        const pageName = window.location.pathname.split('.')[0];
        fetch('https://my-postgres-server.vercel.app/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                score: score,
                subject: pageName // Corrected assignment operator
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response
            // Redirect to submission page with score as query parameter
            window.location.href = `submission.html?score=${score}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Initial setup: Fetch questions and display them
    fetchQuestions();

    // Event listener for name input
    nameInput.addEventListener('input', (event) => {
        name = event.target.value; // Update name variable when input changes
    });
});
