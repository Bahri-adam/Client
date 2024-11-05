// meet-utils.js

// Function to parse CSV content
function parseCSV(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const entry = {};
        headers.forEach((header, index) => {
            entry[header.trim()] = values[index]?.trim() || '';
        });
        return entry;
    });
}

// Function to get meet summary from CSV content
function getMeetSummary(csvContent) {
    const lines = csvContent.trim().split('\n');
    const meetInfo = {};
    
    // Parse meet name and date from first two lines
    meetInfo.name = lines[0].trim();
    meetInfo.date = lines[1].trim();
    
    // Find team scores section
    const teamScoresStart = lines.findIndex(line => line.includes('Place,Team,Score'));
    if (teamScoresStart !== -1) {
        const teamScores = parseCSV(lines.slice(teamScoresStart).join('\n'));
        meetInfo.winner = `${teamScores[0].Team} (${teamScores[0].Score})`;
        meetInfo.totalTeams = teamScores.length;
    }
    
    // Find individual results section
    const individualResultsStart = lines.findIndex(line => line.includes('Place,Grade,Name'));
    if (individualResultsStart !== -1) {
        const individualResults = parseCSV(lines.slice(individualResultsStart).join('\n'));
        meetInfo.totalRunners = individualResults.length;
    }
    
    return meetInfo;
}

// Function to display meet results
function displayMeetResults(csvContent, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const meetInfo = getMeetSummary(csvContent);
    
    // Find the sections for team and individual results
    const lines = csvContent.trim().split('\n');
    const teamScoresStart = lines.findIndex(line => line.includes('Place,Team,Score'));
    const individualResultsStart = lines.findIndex(line => line.includes('Place,Grade,Name'));
    
    // Parse team results
    const teamResults = parseCSV(lines.slice(teamScoresStart, individualResultsStart).join('\n'));
    
    // Parse individual results
    const individualResults = parseCSV(lines.slice(individualResultsStart).join('\n'));
    
    // Create HTML content
    let html = `
        <h1>${meetInfo.name}</h1>
        
        <div class="meet-details">
            <div class="meet-stat">
                <span class="stat-label">Date:</span> ${meetInfo.date}
            </div>
            <div class="meet-stat">
                <span class="stat-label">Total Teams:</span> ${meetInfo.totalTeams}
            </div>
            <div class="meet-stat">
                <span class="stat-label">Total Runners:</span> ${meetInfo.totalRunners}
            </div>
        </div>
        
        <section class="section">
            <h2>Team Results</h2>
            <div class="results-container">
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Team</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${teamResults.map(team => `
                            <tr>
                                <td>${team.Place}</td>
                                <td>${team.Team}</td>
                                <td>${team.Score}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
        
        <section class="section">
            <h2>Individual Results</h2>
            <div class="results-container">
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Name</th>
                            <th>Grade</th>
                            <th>Time</th>
                            <th>Team</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${individualResults.map(runner => `
                            <tr>
                                <td>${runner.Place}</td>
                                <td>${runner.Name}</td>
                                <td>${runner.Grade}</td>
                                <td>${runner.Time}</td>
                                <td>${runner.Team}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;
    
    container.innerHTML = html;
}

// Function to generate meet cards for index page
function generateMeetCards(meetDataArray) {
    return meetDataArray.map(meetData => {
        const meetInfo = getMeetSummary(meetData.content);
        return `
            <a href="${meetData.filename}" class="meet-card">
                <h2>${meetInfo.name}</h2>
                <div class="meet-details">
                    <div class="meet-stat">
                        <span class="stat-label">Date:</span> ${meetInfo.date}
                    </div>
                    <div class="meet-stat">
                        <span class="stat-label">Teams:</span> ${meetInfo.totalTeams}
                    </div>
                    <div class="meet-stat">
                        <span class="stat-label">Runners:</span> ${meetInfo.totalRunners}
                    </div>
                    <div class="meet-stat">
                        <span class="stat-label">Winner:</span> ${meetInfo.winner}
                    </div>
                </div>
            </a>
        `;
    }).join('');
}
