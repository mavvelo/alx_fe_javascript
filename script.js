// Array to hold quote objects
let quotes = [
    { text: "Success is not final; failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
    { text: "Learn as if you will live forever, live like you will die tomorrow.", category: "Life" },
    { text: "Just because something doesn’t do what you planned it to do doesn’t mean it’s useless.", category: "Technology" }
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added successfully!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  