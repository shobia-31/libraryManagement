$(document).ready(function() {
  var bookList = $("#book-list");
  var searchInput = $("#search-input");
  var homeLink = $("#home-link");
  var filterSelect = $("#filter-select");
  var sortSelect = $("#sort-select");

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

  filterSelect.on("change", function() {
    var selectedFilter = filterSelect.val();
    var books = bookList.children(".book");
    books.hide();

    if (selectedFilter === "all") {
      books.show();
    } else {
      books.each(function() {
        var book = $(this);
        if (book.hasClass(selectedFilter)) {
          book.show();
        }
      });
    }
  });

  sortSelect.on("change", function() {
    var selectedSort = sortSelect.val();
    var books = bookList.children(".book");

    books.sort(function(a, b) {
      var bookA = $(a).data(selectedSort);
      var bookB = $(b).data(selectedSort);

      if (selectedSort === "publish-date") {
        bookA = new Date(bookA);
        bookB = new Date(bookB);
      }

      if (bookA < bookB) {
        return -1;
      } else if (bookA > bookB) {
        return 1;
      } else {
        return 0;
      }
    });

    bookList.html(books);
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
    bookItem.data("title", bookData.volumeInfo.title);

    var authorsElement = $("<p>").text("Author(s): " + (bookData.volumeInfo.authors ? bookData.volumeInfo.authors.join(", ") : "N/A"));
    bookItem.data("author
