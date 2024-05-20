// Function to update chart based on selected subject and date range
function updateChart() {
  const selectedSubject = document.getElementById('subjectDropdown').value;
  const startDate = document.getElementById('startDatePicker').value;
  const endDate = document.getElementById('endDatePicker').value;

  fetch('https://my-postgres-server.vercel.app/scores')
      .then(response => response.json())
      .then(data => {
          // Filter data based on selected subject and date range
          const filteredData = data.filter(entry => 
              entry.subject === selectedSubject &&
              entry.date >= startDate && 
              entry.date <= endDate
          );

          // Extracting user names and scores
          const usernames = filteredData.map(entry => entry.name);
          const scores = filteredData.map(entry => parseInt(entry.score));

          // Highlight the last user
          const lastUserIndex = scores.length - 1;

          // Create an array to hold backgroundColor and borderColor
          const backgroundColors = [];
          const borderColors = [];

          // Loop through the scores array to set colors
          for (let i = 0; i < scores.length; i++) {
              if (i === lastUserIndex) {
                  backgroundColors.push('rgba(255, 99, 132, 0.5)'); // Highlight last user in red
                  borderColors.push('rgba(255, 99, 132, 1)');
              } else {
                  backgroundColors.push('rgba(54, 162, 235, 0.5)');
                  borderColors.push('rgba(54, 162, 235, 1)');
              }
          }

          // Get the canvas element
          const ctx = document.getElementById('quizChart').getContext('2d');

          // Destroy previous chart instance if it exists
          if (window.myChart) {
              window.myChart.destroy();
          }

          // Create new chart instance with fixed maximum y-axis scale
          window.myChart = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: usernames,
                  datasets: [{
                      label: 'Score',
                      data: scores,
                      backgroundColor: backgroundColors,
                      borderColor: borderColors,
                      borderWidth: 1
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      y: [{
                          ticks: {
                              beginAtZero: true,
                              max: 100 // Set a fixed maximum value for the y-axis scale (e.g., 100)
                          }
                      }]
                  }
              }
          });
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}

// Fetch data from server
fetch('https://my-postgres-server.vercel.app/scores')
  .then(response => response.json())
  .then(data => {
      // Extracting unique subjects from the data
      const subjects = [...new Set(data.map(entry => entry.subject))];
      // Populate dropdown options with subjects
      const subjectDropdown = document.getElementById('subjectDropdown');
      // Populate dropdown options with subjects
      subjects.forEach(subject => {
          const option = document.createElement('option');
          option.text = subject;
          subjectDropdown.add(option);
      });

      // Initially update the chart with the first subject and default date range
      updateChart();
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });

// Add event listener to subject dropdown
document.getElementById('subjectDropdown').addEventListener('change', updateChart);
document.getElementById('startDatePicker').addEventListener('change', updateChart);
document.getElementById('endDatePicker').addEventListener('change', updateChart);
