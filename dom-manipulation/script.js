const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  // Add more quotes here
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.author}`;
}

function createAddQuoteForm() {
  // Implement logic to create a form for adding new quotes
  // This could involve creating input fields for text and author,
  // a submit button, and handling the form submission to add new quotes to the array.
  console.log("Add quote form creation is not implemented yet.");
}

newQuoteButton.addEventListener('click', showRandomQuote);

// Example usage:
showRandomQuote(); // Display an initial random quote

// ... rest of your code

function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText.trim() !== '') {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);

    // Optionally, clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // You can implement logic to display a success message or update the UI here
    console.log('Quote added successfully!');
  } else {
    // Handle empty quote text
    alert('Please enter a quote text.');
  }
}


  