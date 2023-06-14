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