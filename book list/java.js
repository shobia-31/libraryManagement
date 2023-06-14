document.addEventListener("DOMContentLoaded", function() {
  var bookList = document.getElementById("book-list");
  var query = "fantasy books";
  var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(query);

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.items) {
        var books = data.items;
        books.forEach(function(book) {
          var bookItem = createBookItem(book);
          bookList.appendChild(bookItem);
        });
      } else {
        var message = document.createElement("p");
        message.textContent = "No books found.";
        bookList.appendChild(message);
      }
    })
    .catch(function(error) {
      console.log("Error fetching book data:", error);
    });

  function createBookItem(bookData) {
    var bookItem = document.createElement("div");
    bookItem.classList.add("book");

    var titleElement = document.createElement("h3");
    titleElement.textContent = bookData.volumeInfo.title;

    var authorsElement = document.createElement("p");
    authorsElement.textContent = "Authors: " + bookData.volumeInfo.authors.join(", ");

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorsElement);

    return bookItem;
  }
});
