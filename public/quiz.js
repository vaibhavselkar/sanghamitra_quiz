document.addEventListener("DOMContentLoaded", function() {
    console.log('Quiz1.js script loaded');

    const questionsContainer = document.getElementById('questionscontainer');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let currentPage = 1;
    let pageSize = 5; // Display 5 questions per page
    let totalPages;
    let questions;
    let selectedOptions = new Array(50).fill(null); // Array to store selected options

    // Fetch questions data
    fetch('http://localhost:9999/quiz1') // Assuming this endpoint returns the JSON data provided
        .then(res => res.json())
        .then(data => {
            questions = data;
            totalPages = Math.ceil(questions.length / pageSize);
            displayQuestions();
        })
        .catch(error => {
            console.error('Error fetching questions:', error); // Log error fetching questions
        });

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

        // Add submit button on the last page
        if (currentPage === totalPages) {
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.classList.add('submit-button'); // Add class for styling
            submitButton.addEventListener('click', calculateScore);
            questionsContainer.appendChild(submitButton);
        }

        // Enable or disable pagination buttons based on current page
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        // Add event listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', selectOption);
        });
    }

    // Event listener for the "Next" button
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayQuestions();
        }
        nextButton.classList.add('submit-button');// Add class for styling to next button
        
    });

    // Event listener for the "Previous" button
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayQuestions();
        }
        prevButton.classList.add('submit-button');// Add class for styling to next button
    });

    submitButton.addEventListener('click', () => {
        // Additional logic for handling the submission of the quiz
        // Add or remove a class to change the appearance of the button
        calculateScore(); // Call the function to calculate the score
        window.location.href = 'submission.html'; // Redirect to the submission page

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
        window.location.href = `submission.html?score=${score}`; // Redirect to the submission page with the score as a query parameter
    }
});
