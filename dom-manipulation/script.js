// Array of quote objects with text and category properties
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  // More quotes can be added here...
];

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
    showRandomQuote(); // Optionally display the newly added quote

    // Clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Both quote text and category are required to add a new quote.");
  }
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial setup when the page loads
showRandomQuote();
createAddQuoteForm();
