// const { readFileSync, promises: fsPromises } = require("fs");

$(document).ready(function () {
  testFunction();
  function testFunction(){
    // search_val = $("#searchBox").val();
    search_val="india"
    var queryString = { q: search_val };
    $.ajax({
      method: "POST",
      url: "/search",
      contentType: "application/json;charset=utf-8",
      cache: false,
      datatype: "text",
      data: JSON.stringify(queryString),
      success: function (data) {
        // alert("yes");
        wholeJson = JSON.parse(data);
        articles=wholeJson['articles'];
        // $("#news").text(data)
        showNews(articles);
      },
      error: function (data) {
        // alert("error");
      },
    });
  }
  function showNews(articles) {
    // articles = wholeJson["articles"];
    var newslist = document.getElementById("newsList");
    newslist.innerHTML = "";
    for (var i = 0; i < articles.length; i++) {
      description = articles[i].description;
      image_url = articles[i].urlToImage;
      link_url = articles[i].url;
      var a=document.createElement("a");
      var li = document.createElement("li");
      var image = document.createElement("img");
      image.src = image_url;
      image.innerHTML = "<img src=" + image_url + ' class="newsImages"/>';
      li.innerHTML =
        '<div class="newsLi" id="news_' + i + '">' + description + "</div>";
      li.appendChild(image);
      a.setAttribute('href',link_url)
      a.setAttribute('target','_blank')
      a.appendChild(li);
      newslist.appendChild(a);
    }
  }

  $("#searchButton").click(function () {
    search_val = $("#searchBox").val();
    var queryString = { q: search_val };
    $.ajax({
      method: "POST",
      url: "/search",
      contentType: "application/json;charset=utf-8",
      cache: false,
      datatype: "text",
      data: JSON.stringify(queryString),
      success: function (data) {
        // alert("yes");
        wholeJson = JSON.parse(data);
        articles=wholeJson['articles'];
        // $("#news").text(data)
        showNews(articles);
      },
      error: function (data) {
        alert("error");
      },
    });
  });
});