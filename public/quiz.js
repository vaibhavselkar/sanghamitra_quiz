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
    fetch('https://my-postgres-server.vercel.app/quiz1') // Assuming this endpoint returns the JSON data provided
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
    
        // Add submit button only on the last page
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
        // Handle form submission with the score
        submitForm(score);
    }

    // Function to submit form with score
    function submitForm(score) {
        const name = document.getElementById('name').value;
        const pageName = window.location.pathname.split('.')[0]; // get the current page name

        fetch('https://my-postgres-server.vercel.app/quiz1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                score: score,
                pageName: pageName
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
});
