/*
INSPECTOR
 */

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var dec = new TextDecoder();
        if (details.method == "POST" && details.url == 'https://data.mercadolibre.com/tracks') {            
            if ((details.requestBody.raw.length) == 1){
                var parsedJSON = JSON.parse(dec.decode(details.requestBody.raw[0].bytes));
                var path = parsedJSON.tracks[0].path;
                var type = parsedJSON.tracks[0].type;
                var business = parsedJSON.tracks[0].application.business;
                $(".content").append('<tr><td><img class="size-img" src="img/md.png"/></td><td>Melidata</td><td>'+path+'</td><td>'+type+'</td><td>'+business+'</td></tr>');
                //console.log(JSON.parse(dec.decode(details.requestBody.raw[0].bytes)));    
            }
   /* 
            for (i = 0; i < parsedJSON.tracks.length; i++) {
                console.log(parsedJSON.tracks[i].path + ' - ' + parsedJSON.tracks[i].type + ' - ' + parsedJSON.tracks[i].application.business);
            }
            */
        }else if (details.method == "POST" && details.url == 'https://www.google-analytics.com/collect'){            
            var url = new URL('http://www.ml.com.ar/?'+decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)));
            var path = url.searchParams.get("dp");
            var type = url.searchParams.get("t");
            var business = url.searchParams.get("dl");            
            $(".content").append('<tr><td><img class="size-img" src="img/ga.png"/></td><td>Google Analytics</td><td>'+path+'</td><td>'+type+'</td><td>'+business+'</td></tr>');
        }
    }, { urls: ["<all_urls>"] }, ['blocking', 'requestBody']
);
