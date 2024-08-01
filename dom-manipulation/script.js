// Initialization
document.addEventListener('DOMContentLoaded', initializeApp);

// Quotes data
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  // More default quotes can be added here...
];

// Initialize application
function initializeApp() {
  populateCategoryFilter();
  showRandomQuote();
  createAddQuoteForm();

  // Restore last viewed quote from session storage
  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
    displayQuote(lastViewedQuote);
  }

  // Event listeners
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotesAsJSON);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
}

// Save quotes to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a quote in the DOM
function displayQuote(quote) {
  document.getElementById('quoteDisplay').innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>— ${quote.category}</em></p>
  `;
}

// Show a random quote based on the selected category
function showRandomQuote() {
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    displayQuote(randomQuote);
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  } else {
    document.getElementById('quoteDisplay').innerHTML = "No quotes available in this category.";
  }
}

// Populate category filter dropdown with unique categories
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(quote => quote.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from local storage
  const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory); // Save selected category to local storage
  showRandomQuote();
}

// Create and append the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuote">Add Quote</button>
  `;
  document.body.appendChild(formContainer);

  // Add event listener for the add quote button
  document.getElementById('addQuote').addEventListener('click', addQuote);
}

// Add a new quote and update the DOM
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotesToLocalStorage();
    updateCategoryFilter(); // Update category filter dropdown if necessary
    showRandomQuote();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Both quote text and category are required to add a new quote.");
  }
}

// Update category filter dropdown with new categories
function updateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  const existingCategories = new Set([...categoryFilter.options].map(option => option.value));

  // Extract new categories
  const newCategories = [...new Set(quotes.map(quote => quote.category))]
    .filter(category => !existingCategories.has(category));

  // Add new categories to the dropdown
  newCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Export quotes to a JSON file
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

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = [...quotes, ...importedQuotes];
        saveQuotesToLocalStorage();
        updateCategoryFilter(); // Update category filter with new categories from imported quotes
        showRandomQuote();
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
