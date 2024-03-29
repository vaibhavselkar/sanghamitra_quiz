document.addEventListener("DOMContentLoaded", function() {
    console.log('Quiz1.js script loaded');

    const questionsContainer = document.getElementById('questionscontainer');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton'); // Added
    const nameInput = document.getElementById('name'); // Added
    let currentPage = 1;
    let pageSize = 5; // Display 5 questions per page
    let totalPages;
    let questions;
    let selectedOptions = new Array(50).fill(null); // Array to store selected options
    let name; // Variable to store the name

    // Function to fetch questions data
    function fetchQuestions() {
        fetch('https://my-postgres-server.vercel.app/quiz1')
            .then(res => res.json())
            .then(data => {
                questions = data;
                totalPages = Math.ceil(questions.length / pageSize);
                displayQuestions();
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

    // Function to display the questions for the current page
    function displayQuestions() {
        questionsContainer.innerHTML = ''; // Clear previous questions
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, questions.length);

        for (let i = startIndex; i < endIndex; i++) {
            const question = questions[i];
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <div>
                    <p>${i + 1}. ${question.question}</p>
                    <div class="options">
                        <button class="option" data-index="${i}" data-option="a">a. ${question.option_a}</button>
                        <button class="option" data-index="${i}" data-option="b">b. ${question.option_b}</button>
                        <button class="option" data-index="${i}" data-option="c">c. ${question.option_c}</button>
                        <button class="option" data-index="${i}" data-option="d">d. ${question.option_d}</button>
                    </div>
                </div>
            `;
            questionsContainer.appendChild(questionElement);
        }

        // Show or hide pagination buttons based on current page
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        // Hide submit button if not on the last page
        submitButton.style.display = currentPage === totalPages ? 'block' : 'none';
    }

    // Event listener for the "Next" button
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayQuestions();
        }
    });

    // Event listener for the "Previous" button
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayQuestions();
        }
    });

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
        fetch('https://my-postgres-server.vercel.app/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                score: score
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

    // Initial setup: Fetch questions and display the first page
    fetchQuestions();

    // Event listener for name input
    nameInput.addEventListener('input', (event) => {
        name = event.target.value; // Update name variable when input changes
    });

    // Add event listeners to options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', selectOption);
    });
});
