const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").textContent = randomQuote.text;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    alert("New quote added!");
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  } else {
    alert("Please enter both quote text and category.");
  }
}


  