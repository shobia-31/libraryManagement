$(document).ready(function() {
    var bookList = $("#book-list");
    var searchInput = $("#search-input");
    var homeLink = $("#home-link");
  
    homeLink.on("click", function(event) {
      event.preventDefault();
      bookList.html("");
      homeLink.addClass("active");
      loadBooks("fantasy books");
    });
  
    searchInput.autocomplete({
      source: function(request, response) {
        var query = request.term;
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(query);
  
        $.ajax({
          url: apiUrl,
          dataType: "json",
          success: function(data) {
            if (data.items) {
              var suggestions = [];
              data.items.forEach(function(book) {
                var suggestion = {
                  label: book.volumeInfo.title,
                  value: book.volumeInfo.title
                };
                suggestions.push(suggestion);
              });
              response(suggestions);
            } else {
              response([]);
            }
          }
        });
      },
      select: function(event, ui) {
        event.preventDefault();
        bookList.html("");
        loadBooks(ui.item.label);
        searchInput.val(ui.item.label);
      }
    });
  
    function loadBooks(query) {
      var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(query);
  
      $.ajax({
        url: apiUrl,
        dataType: "json",
        success: function(data) {
          if (data.items) {
            data.items.forEach(function(book) {
              var bookItem = createBookItem(book);
              bookList.append(bookItem);
            });
          } else {
            var message = $("<p>").text("No books found.");
            bookList.append(message);
          }
        },
        error: function(error) {
          console.log("Error fetching book data:", error);
        }
      });
    }
  
    function createBookItem(bookData) {
      var bookItem = $("<div>").addClass("book");
  
      var titleElement = $("<h3>").text(bookData.volumeInfo.title);
  
      var authorsElement = $("<p>").text("Authors: " + (bookData.volumeInfo.authors ? bookData.volumeInfo.authors.join(", ") : "N/A"));
  
      var availabilityElement = $("<p>").addClass("availability");
      if (bookData.saleInfo && bookData.saleInfo.saleability === "FOR_SALE") {
        availabilityElement.text("Available (" + bookData.saleInfo.retailPrice.amount + ")");
      } else {
        availabilityElement.text("Not available");
      }
  
      bookItem.append(titleElement, authorsElement, availabilityElement);
  
      return bookItem;
    }
  
    // Initial book load
    loadBooks("fantasy books");
  });
  