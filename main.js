/*
INSPECTOR
 */

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var dec = new TextDecoder();
        if (details.method == "POST" && details.url == 'https://data.mercadolibre.com/tracks') {
            $(".content").append('<tr><td><img class="size-img" src="img/md.png"/></td><td>Melidata</td></tr>');
            //$(".content").append('Melidata');
            //$(".content").append(dec.decode(details.requestBody.raw[0].bytes));
        }else if (details.method == "POST" && details.url == 'https://www.google-analytics.com/collect'){
            $(".content").append('<tr><td><img class="size-img" src="img/ga.png"/></td><td>Google Analytics</td></tr>');
            //$(".content").append(dec.decode(details.requestBody.raw[0].bytes));
        }
    }, { urls: ["<all_urls>"] }, ['blocking', 'requestBody']
);
