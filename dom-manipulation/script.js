// Initialize the quotes array from local storage or with default values
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  // More default quotes can be added here...
];

// Function to save the quotes array to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote from the quotes array
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById('quoteDisplay').innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p><em>— ${randomQuote.category}</em></p>
  `;

  // Save the last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteTextInput = document.createElement('input');
  quoteTextInput.setAttribute('id', 'newQuoteText');
  quoteTextInput.setAttribute('type', 'text');
  quoteTextInput.setAttribute('placeholder', 'Enter a new quote');
  
  const quoteCategoryInput = document.createElement('input');
  quoteCategoryInput.setAttribute('id', 'newQuoteCategory');
  quoteCategoryInput.setAttribute('type', 'text');
  quoteCategoryInput.setAttribute('placeholder', 'Enter quote category');

  const addButton = document.createElement('button');
  addButton.innerText = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteTextInput);
  formContainer.appendChild(quoteCategoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to add a new quote to the quotes array and update the DOM
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotesToLocalStorage(); // Save quotes to local storage
    showRandomQuote(); // Optionally display the newly added quote

    // Clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Both quote text and category are required to add a new quote.");
  }
}

// Function to export quotes as a JSON file
function exportQuotesAsJSON() {
  const quotesJSON = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotesToLocalStorage();
        showRandomQuote(); // Optionally display one of the newly imported quotes
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format. Please upload a valid JSON file.');
      }
    } catch (e) {
      alert('Error parsing JSON file. Please upload a valid JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial setup when the page loads
showRandomQuote();
createAddQuoteForm();

// Restore last viewed quote from session storage
const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
if (lastViewedQuote) {
  document.getElementById('quoteDisplay').innerHTML = `
    <p>"${lastViewedQuote.text}"</p>
    <p><em>— ${lastViewedQuote.category}</em></p>
  `;
}

// Add event listener to export button
document.getElementById('exportQuotes').addEventListener('click', exportQuotesAsJSON);

// HTML elements: Add the following where appropriate in your HTML file
// <button id="exportQuotes">Export Quotes</button>
// <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
