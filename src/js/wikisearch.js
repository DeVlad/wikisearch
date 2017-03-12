// TODO: fetch most current trends
// Autocomplete
var trendsUrl = "https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/2017/03/10";
var promiseGetTrends = new Promise(function (resolve, reject) {
    //resolve(fetch(trendsUrl).then(response => response.json()).then(json => json));
    resolve(fetch(trendsUrl).then(function (response) {
                return response.json();
    }));
    reject(Error("Error: fetch channel from API failed"));
});
promiseGetTrends.then(function (data) {
    var object = data.items[0].articles;
    var tags = $.map(object, function (value, index) {
        output = value.article;
        filtered = output.replace(/\(|\)|_/g, ' ');
        return [filtered];
    });
    return tags;
}).then(function (tags) {
    $(function () {
        $("#search-box").autocomplete({
            minLength: 3,
            source: tags
        });
    });
});
// Search trigger
$("#search").submit(function (event) {
    // TODO: - sanitaze input - but it's kind of useless because is running on the client side
    if ($("input:first").val() !== "") {
        searched = $("input:first").val();
        wikiRequest();
    }
    else {
        $("span").text("Please enter search term").show().fadeOut(5000);
    }
    event.preventDefault();
});
// Wikipedia API request
function wikiRequest() {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + searched,
        dataType: 'jsonp',
        error: function () {
            console.log("error");
        },
        success: function (response) {
            if (response.hasOwnProperty('query')) {
                result = response.query.pages;
                for (var prop in result) {
                    var item = result[prop];
                    $("#result" + item.index).empty().append(renderResult(item.title, item.extract, item.pageid, item.index));
                }
            }
            else {
                // Empty each id starting with "result"
                $('div[id^="result"]').empty();
                $("span").text("No results found").show().fadeOut(5000);
            }
        }
    });
}
// Render View
function renderResult(title, extract, pageid, index) {
    // Display in clickable div blocks    
    return '<div class="result" id="' + index + '" onclick="openUrl(' + pageid + ')">' + '<h3>' + title + '</h3>' + '<br>' + extract + '</.div>';
}
// Article open on new tab
function openUrl(pageid) {
    window.open('https://en.wikipedia.org/wiki?curid=' + pageid, '_blank');
}
//Random Article
$("#random").click(function () {
    window.open('https://wikipedia.org/wiki/Special:Random', '_blank');
});