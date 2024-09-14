// FREE PALESTINE 🍉
// VARS
const getInput = document.querySelector('.get-input');
const getButton = document.getElementById('get-button');
const resetButton = document.getElementById('reset-button');
const reposData = document.getElementById('final-data');

let username = '';

// Get button click event
getButton.onclick = () => {
    username = getInput.value.trim();
    // If the user does not type anything in the input field
    if (username === '') {
        reposData.innerHTML = `<span>Please add your GitHub username</span>`;
    } else {
        // If the username exists, then fetch repos if there is any
        checkUser();
    }
    // Clear the input field
    getInput.value = '';
};

resetButton.onclick = () => {
    reposData.innerHTML = '<span>No Data To Show</span>';
};

// Checker function=> check if the user exists
const checkUser = () => {
    let req = new XMLHttpRequest();
    req.open('GET', `https://api.github.com/users/${username}`);
    req.send();
    req.onload = function () {
        // If the status of the response = 404, then there is no such username
        if (req.status === 404) {
            reposData.innerHTML = `<span>Username Does Not Exist!</span>`;
        } else {
            // If user exists, fetch repositories
            getRepos();
        }
    };
};

// Function to fetch repositories
// Function to fetch repositories
const getRepos = () => {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then((repos) => repos.json())
        .then((finalRepos) => {
            // If the username has no repos
            if (finalRepos.length === 0) {
                reposData.innerHTML = `<span>No repos found for this user</span>`;
            } else {
                // Create table structure
                const table = document.createElement('table');
                table.id = 'repos-table';

                // Create table headers
                const headerRow = document.createElement('tr');
                const headers = ['Repository Name', 'Creation Date', 'Size (MB)', 'Programming Language'];
                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);

                // Fill the table with repository data
                finalRepos.forEach(repo => {
                    const row = document.createElement('tr');

                    // Repository Name (with link)
                    const cellName = document.createElement('td');
                    const repoLink = document.createElement('a');
                    repoLink.href = `https://github.com/${repo.full_name}`;
                    repoLink.setAttribute('target', '_blank');
                    repoLink.textContent = repo.name;
                    cellName.appendChild(repoLink);
                    row.appendChild(cellName);

                    // Creation Date
                    const creationDateCell = document.createElement('td');
                    creationDateCell.textContent = new Date(repo.created_at).toLocaleDateString();
                    row.appendChild(creationDateCell);

                    const sizeCell = document.createElement('td');
                    // Convert from KB it to MB
                    const sizeInMB = (repo.size / 1024).toFixed(2);
                    sizeCell.textContent = `${sizeInMB} MB`;
                    row.appendChild(sizeCell);

                    // Programming Language
                    const languageCell = document.createElement('td');
                    languageCell.textContent = repo.language ? repo.language : 'N/A';
                    row.appendChild(languageCell);

                    // Append row to table
                    table.appendChild(row);
                });

                // Clear previous data and append the table to reposData
                reposData.innerHTML = '';
                reposData.appendChild(table);
            }
        })
        .catch((error) => {
            console.error('Fetch error: ', error);
            reposData.innerHTML = `<span>Failed to load repos. Please try again.</span>`;
        });
};
