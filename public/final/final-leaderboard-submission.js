document.addEventListener("DOMContentLoaded", function() {
    // Function to update leaderboard for the latest test taken by the user
    function updateLeaderboard(latestSubject, userName) {
        fetch('https://my-postgres-server.vercel.app/scores')
            .then(response => response.json())
            .then(data => {
                // Filter data for the latest test taken by the user
                const filteredData = data.filter(entry => entry.subject === latestSubject);

                // Sort filtered data by score in descending order
                filteredData.sort((a, b) => b.score - a.score);

                // Find the test taker's entry and rank
                let userRank = -1;
                for (let i = 0; i < filteredData.length; i++) {
                    if (filteredData[i].name === userName) {
                        userRank = i + 1; // Rank is index + 1
                        break;
                    }
                }

                // Get the leaderboard body element
                const leaderboardBody = document.getElementById('leaderboardBody');

                // Clear any existing rows in the leaderboard body
                leaderboardBody.innerHTML = '';

                // Display the test taker's name, rank, and time taken at the top
                if (userRank !== -1) {
                    const userRow = document.createElement('tr');
                    const userRankCell = document.createElement('td');
                    const userNameCell = document.createElement('td');
                    const userScoreCell = document.createElement('td');
                    const userTimeCell = document.createElement('td');

                    userRankCell.textContent = userRank;
                    userNameCell.textContent = userName;
                    userScoreCell.textContent = Math.round(filteredData[userRank - 1].score * 100) / 100;
                    userTimeCell.textContent = Math.round(filteredData[userRank - 1].time_taken * 100) / 100;

                    userRow.appendChild(userRankCell);
                    userRow.appendChild(userNameCell);
                    userRow.appendChild(userScoreCell);
                    userRow.appendChild(userTimeCell);
                    leaderboardBody.appendChild(userRow);

                    // Add a separator row for clarity
                    const separatorRow = document.createElement('tr');
                    const separatorCell = document.createElement('td');
                    separatorCell.setAttribute('colspan', '4');
                    separatorCell.textContent = '---';
                    separatorRow.appendChild(separatorCell);
                    leaderboardBody.appendChild(separatorRow);
                }

                // Populate the leaderboard with top 10 filtered data
                filteredData.slice(0, 10).forEach((entry, index) => {
                    const row = document.createElement('tr');
                    const rankCell = document.createElement('td');
                    const nameCell = document.createElement('td');
                    const scoreCell = document.createElement('td');
                    const timeCell = document.createElement('td');

                    rankCell.textContent = index + 1;
                    nameCell.textContent = entry.name;
                    scoreCell.textContent = Math.round(entry.score * 100) / 100;
                    timeCell.textContent = Math.round(entry.time_taken * 100) / 100;

                    row.appendChild(rankCell);
                    row.appendChild(nameCell);
                    row.appendChild(scoreCell);
                    row.appendChild(timeCell);

                    leaderboardBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Extract user name from URL query parameters
    function getUserNameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('userName');
    }

    // Fetch data from server
    fetch('https://my-postgres-server.vercel.app/scores')
        .then(response => response.json())
        .then(data => {
            // Find the latest test subject for the user
            const latestEntry = data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            if (latestEntry) {
                const latestSubject = latestEntry.subject;
                const userName = getUserNameFromURL();
                updateLeaderboard(latestSubject, userName);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

