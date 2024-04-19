
document.addEventListener("DOMContentLoaded", function() {
    console.log('diagnostic math.js script loaded');

    const questionsContainer = document.getElementById('questionsContainer-english');
    const submitButton = document.getElementById('submitButton-english');
    const nameInput = document.getElementById('name-english');
    let questions;
    let selectedOptions = new Array(50).fill(null); // Array to store selected options
    let name;

    // Function to fetch questions data
    function fetchQuestions() {
        console.log('Fetching questions...');
        fetch('https://my-postgres-server.vercel.app/diagnos-math-2')
            .then(res => res.json())
            .then(data => {
                console.log('Questions fetched:', data);
                questions = data;
                displayQuestions();
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

    // Function to display the questions
    function displayQuestions() {
        console.log('Displaying questions...');
        console.log('Questions:', questions);
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

    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        const score = calculateScore(); // Calculate the score
        displayReview(score); // Display review based on the score
        submitForm(nameInput, score); // Submit the form
        
        // Remove the submit button
        submitButton.style.display = 'none';
        
        // Add a new button for feedback
        const feedbackLink = document.createElement('a');
        feedbackLink.textContent = 'Feedback To Develop';
        feedbackLink.href = 'https://docs.google.com/document/d/16TgneItEErdDl9JA-YVOpMRibAsxgB-Wn4JtbU242H4/edit'; // Add your feedback link here
        feedbackLink.classList.add('btn', 'btn-primary');
        submitButton.parentNode.appendChild(feedbackLink);
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
        const totalQuestions = questions.length;
    
        for (let i = 0; i < totalQuestions; i++) {
            if (selectedOptions[i] === questions[i].correct_option) {
                score++;
            }
        }
    
        score = (score / totalQuestions) * 100; // Calculate the percentage
        return score; // Return the score as a percentage
    }

    // Function to display review based on the score
    function displayReview(score) {
        let reviewMessage = '';
        let scorePercentage = Math.round(score * 100) / 100; // Calculate score percentage
        if (score >= 70) {
            reviewMessage = 'Congratulations! You passed the quiz.';
        } else {
            reviewMessage = 'Sorry, you did not pass the quiz. Please review your answers below.';
        }
    
        let reviewHTML = `
            <h2>${reviewMessage}</h2>
            <p>Your Score: ${scorePercentage}%</p>
            <ul>
        `;
        questions.forEach((question, index) => {
            let selectedOption = selectedOptions[index];
            let correctOption = question.correct_option;
    
            reviewHTML += `<li>${index + 1}. ${question.question}<br>`;
            ['a', 'b', 'c', 'd'].forEach((option) => {
                if (selectedOption === option && selectedOption !== correctOption) {
                    // Incorrectly selected option
                    reviewHTML += `<span style="color: red;">${option}. ${question['option_' + option]}</span><br>`;
                } else if (selectedOption === option && selectedOption === correctOption) {
                    // Correctly selected option
                    reviewHTML += `<span style="color: green;">${option}. ${question['option_' + option]}</span><br>`;
                } else if (option === correctOption) {
                    // Correct option
                    reviewHTML += `<span style="color: green;">${option}. ${question['option_' + option]}</span><br>`;
                } else {
                    // Incorrect option (not selected)
                    reviewHTML += `${option}. ${question['option_' + option]}<br>`;
                }
            });
            reviewHTML += `</li><br>`;
        });
        reviewHTML += '</ul>';
    
        questionsContainer.innerHTML = reviewHTML;
    }
    
    function submitForm(nameInput, score) {
        fetch('https://my-postgres-server.vercel.app/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameInput.value, // Get the value from the name input field
                score: score,
                subject: 'diagnostic-math(8-10)' // Corrected assignment operator
            })
        });
    }

    // Function to get the text of the correct option
    function getCorrectOptionText(question) {
        switch (question.correct_option) {
            case 'a':
                return question.option_a;
            case 'b':
                return question.option_b;
            case 'c':
                return question.option_c;
            case 'd':
                return question.option_d;
            default:
                return 'Not specified';
        }
    }

    // Function to get the text of the selected option
    function getSelectedOptionText(selectedOption, question) {
        switch (selectedOption) {
            case 'a':
                return question.option_a;
            case 'b':
                return question.option_b;
            case 'c':
                return question.option_c;
            case 'd':
                return question.option_d;
            default:
                return 'Not selected';
        }
    }

    // Initial setup: Fetch questions and display them
    fetchQuestions();

    // Event listener for name input
    nameInput.addEventListener('input', (event) => {
        name = event.target.value; // Update name variable when input changes
    });
});
