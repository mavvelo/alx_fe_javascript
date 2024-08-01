// Simulate server API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your mock API URL

// Initialize quotes from local storage or use default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  // More default quotes can be added here...
];

// Initialize application
function initializeApp() {
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();
  createNotificationContainer(); // Create notification container
  
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
  document.getElementById('addQuote').addEventListener('click', addQuote);

  // Start periodic data syncing
  setupPeriodicSync();
}

// Fetch quotes from server with POST request
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST', // Using POST to fetch data, normally GET is used
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const serverQuotes = await response.json();
    // Assuming server response has a structure { quotes: [...] }
    // Replace with your actual server response parsing
    return serverQuotes.map(q => ({
      text: q.title, // Adjust mapping based on actual server response
      category: q.body // Adjust mapping based on actual server response
    }));
  } catch (error) {
    console.error('Failed to fetch quotes from server:', error);
    return [];
  }
}

// Sync quotes with the server and handle conflicts
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  
  if (serverQuotes.length > 0) {
    const { updatedQuotes, conflictsResolved } = resolveConflicts(quotes, serverQuotes);
    
    if (conflictsResolved) {
      quotes = updatedQuotes;
      saveQuotesToLocalStorage();
      populateCategories(); // Update category filter
      showRandomQuote(); // Optionally display a random quote
      displayNotification('Data updated from server. Conflicts resolved.', true);
    }
  }
}

// Resolve conflicts between local and server quotes
function resolveConflicts(localQuotes, serverQuotes) {
  // Simple conflict resolution: replace local data with server data
  // Here you might want to implement more complex logic
  const conflictsResolved = !arraysEqual(localQuotes, serverQuotes);
  return {
    updatedQuotes: serverQuotes,
    conflictsResolved
  };
}

// Utility function to check if arrays are equal
function arraysEqual(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

// Set up periodic syncing
function setupPeriodicSync() {
  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 300000); // Sync every 5 minutes (300000 ms)
}

// Populate category filter dropdown with unique categories
function populateCategories() {
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
}

// Add a new quote and update the DOM
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotesToLocalStorage();
    populateCategories(); // Update category filter dropdown with new categories
    showRandomQuote();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Both quote text and category are required to add a new quote.");
  }
}

// Save quotes to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
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
        populateCategories(); // Update category filter with new categories from imported quotes
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

// Create notification container
function createNotificationContainer() {
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'notificationContainer';
  document.body.appendChild(notificationContainer);
}

// Display a notification
function displayNotification(message, isSuccess = false) {
  const notificationContainer = document.getElementById('notificationContainer');
  notificationContainer.innerHTML = `<p class="${isSuccess ? 'success' : 'error'}">${message}</p>`;
  setTimeout(() => {
    notificationContainer.innerHTML = ''; // Clear notification after 5 seconds
  }, 5000);
}

// Initialize application on page load
document.addEventListener('DOMContentLoaded', initializeApp);
