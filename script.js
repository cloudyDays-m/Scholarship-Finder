const API_KEY = '6c2fb373e98ce077054f9bc9bceb7368'; 

let scholarshipDatabase = []; // starts as an empty array, later loaded with the parsed data from the JSON file

// loading the JSON file in the scholarship database 

async function loadScholarshipData() {
  try {
    const response = await fetch('./scholarships.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } // added missing curly brace 
    scholarshipDatabase = await response.json();
  } catch (error) {
    console.error('Could not load scholarships: ', error.message);
    scholarshipDatabase = [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadScholarshipData();
  initializeCountryPicker();
});

// start initializing the country-picker API and take care of any bugs or errors that may take place

function initializeCountryPicker() {
  const input = document.getElementById('countryInput');
  const list = document.getElementById('countries');
  const codeInput = document.getElementById('countryCode');

  fetch(`https://api.countrylayer.com/v2/all?access_key=${encodeURIComponent(API_KEY)}`)
    .then(res => res.json())
    .then(data => {
        data 
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .forEach(c => {
            if (!c.name) return; 
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.dataset.code = c.alpha2Code || '';
            list.appendChild(opt); // was 'FileList', should be 'list'
          });
    })
    .catch(err => {
      console.error("Could not fetch the country list", err.message);
    }); 

    input.addEventListener('input', () => {
      const val = input.value.trim();
      const match = Array.from(list.options).find(o => o.value === val); // was 'FileList', should be 'list'. Same syntax error as above
      codeInput.value = match ? (match.dataset.code || '') : '';
    }); 
}

// the following function processes user input answers and then matches the scholarships from the (database) JSON file 

function submitAnswers() {
  if (scholarshipDatabase.length === 0){
    alert('The scholarships are still loading, try again in a moment');
    return;
  }
  
  const subject = document.getElementById('q1').value;
  const country = document.getElementById('countryInput').value;
  const reason = document.getElementById('q3').value;

  if (!subject || !country || !reason) {
    alert('Fill in all the fields before submitting');
    return;
  }

  const matches = scholarshipDatabase.filter(scholarship => {
    const subjectMatch = scholarship.subjects.includes(subject);
    const countryMatch = scholarship.countries.includes(country);
    const reasonMatch = scholarship.reason === reason;
    return subjectMatch && countryMatch && reasonMatch;
  });
  displayScholarships(matches, {subject, country, reason});
}

function displayScholarships(scholarships, userCriteria){
  const overlay = document.createElement('div');
  overlay.className = 'results-overlay'; // Fixed: was 'classname', should be 'className'

  const container = document.createElement('div');
  container.className = 'results-container';

  const header = document.createElement('div');
  header.className = 'results-header';
  header.innerHTML = `
    <h2>Your Scholarship Matches</h2>
    <p>Found ${scholarships.length} scholarship${scholarships.length !== 1 ? 's' : ''} matching your criteria:</p>
    <div class="criteria-summary">
        <span><strong>Subject:</strong> ${formatSubject(userCriteria.subject)}</span>
        <span><strong>Country:</strong> ${userCriteria.country}</span>
        <span><strong>Purpose:</strong> ${userCriteria.reason === 'study' ? 'Study' : 'Teaching'}</span>
    </div>
    <button class="close-results" onclick="closeResults()">&times;</button>
  `;

  const grid = document.createElement('div');
  grid.className = 'scholarships-grid';

  if (scholarships.length == 0){
    grid.innerHTML = `
      <div class="no-results">
        <h3>No scholarships found</h3> 
        <p>Try adjusting the criteria you've entered or try again later :D</p>
      </div>
    `;
  } else {
    scholarships.forEach(scholarship => {
      const card = createScholarshipCard(scholarship);
      grid.appendChild(card);
    });
  } 

  container.appendChild(header);
  container.appendChild(grid);
  overlay.appendChild(container); // Fixed: was appending 'overlay' to itself, should append 'container'
  document.body.appendChild(overlay);

  setTimeout(() => overlay.classList.add('show'), 100);
}

function createScholarshipCard(scholarship) {
  const card = document.createElement('div');
  card.className = 'scholarship-card';
  card.onclick = () => window.open(scholarship.url, '_blank');

  card.innerHTML = `
    <div class="card-header">
        <h3>${scholarship.title}</h3>
        <div class="amount">${scholarship.amount}</div>
    </div>
    <div class="card-body">
        <p class="description">${scholarship.description}</p>
        <div class="details">
            <div class="detail-item"><strong>Provider:</strong> ${scholarship.provider}</div>
            <div class="detail-item"><strong>Deadline:</strong> ${scholarship.deadline}</div>
            <div class="requirements">
                <strong>Requirements:</strong>
                <ul>
                    ${scholarship.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>
    <div class="card-footer">
        <button class="apply-btn">View Details & Apply</button>
    </div>
  `;
  return card;
}

function formatSubject(subject){
  const subjectMap = {
    'engineering': 'Engineering',
    'art': 'Art, Music & Sports',
    'math': 'Mathematics & Natural Sciences', 
    'medicine': 'Medicine', 
    'law': 'Law & Social Sciences'
  };
  return subjectMap[subject] || subject;
}

function closeResults() {
  const overlay = document.querySelector('.results-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 300);
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeResults();
  } 
});