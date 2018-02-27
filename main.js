/*
    INSPECTOR v0.0.1
 */

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var dec = new TextDecoder();
        if (details.method == "POST" && details.url == 'https://data.mercadolibre.com/tracks') {
            if ((details.requestBody.raw.length) == 1) {
                var parsedJSON = JSON.parse(dec.decode(details.requestBody.raw[0].bytes));
                var path = parsedJSON.tracks[0].path;
                var type;
                if (parsedJSON.tracks[0].type.indexOf("view") > -1) {
                    type = 'pageview'
                } else {
                    type = parsedJSON.tracks[0].type
                }
                var business;
                if ((parsedJSON.tracks[0].application.business).indexOf("mercadolibre") > -1) {
                    business = 'img/md.png'
                } else if ((parsedJSON.tracks[0].application.business).indexOf("mercadopago") > -1) {
                    business = 'img/mp.png'
                }
                var body = dec.decode(details.requestBody.raw[0].bytes);
                var tool = "MELIDATA";
                var img = "img/md.png";
                var id = parsedJSON.tracks[0].id;
                //$(".content").append('<tr><td><img class="size-img" src="img/md.png"/></td><td>Melidata</td><td>'+path+'</td><td>'+type+'</td><td>'+business+'</td></tr>');
                //console.log(JSON.parse(dec.decode(details.requestBody.raw[0].bytes)));    

            }
        } else if (details.method == "POST" && details.url == 'https://www.google-analytics.com/collect') {
            var url = new URL('http://www.ml.com.ar/?' + decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)));
            var path = url.searchParams.get("dp");
            var type = url.searchParams.get("t");
            var business;
            if (url.searchParams.get("dl").indexOf("mercadolibre") > -1) {
                business = 'img/md.png'
            } else if (url.searchParams.get("dl").indexOf("mercadopago") > -1) {
                business = 'img/mp.png'
            }
            var tool = "GOOGLE ANALYTICS";
            var img = "img/ga.png";
            var body = "";// = dec.decode(details.requestBody.raw[0].bytes);
            var id = url.searchParams.get("z")
            //$(".content").append('<tr><td><img class="size-img" src="img/ga.png"/></td><td>Google Analytics</td><td>'+path+'</td><td>'+type+'</td><td>'+business+'</td></tr>');
            
             var sURLVariables = decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)).split('&');
              for (var i = 0; i < sURLVariables.length; i++) {
                var sParametro = sURLVariables[i].split('=');
                    if (!sParametro[0].indexOf("cd")) {
                        console.log (sParametro[0] + " -> " + sParametro[1]);   
                        body +=  (sParametro[0] + " -> " + sParametro[1]);
                        body += "<br />";     
                    }
              }

        }


        if (tool != undefined) {
            $(".accordion").append(
                '<div class="card">' +
                '<div class="card-header">' +
                '<a class="collapsed card-link" data-toggle="collapse" data-parent="#accordion" href="#' + id + '">' +
                '<div class="row">' +
                '<div class="col-sm-1"></div>' +
                '<div class="col-sm-1 text-center"><img class="size-img" src="' + img + '"/></div>' +
                '<div class="col-sm-2 text-center">' + tool + '</div>' +
                '<div class="col-sm-3 text-center">' + path + '</div>' +
                '<div class="col-sm-2 text-center">' + type + '</div>' +
                '<div class="col-sm-1 text-center"><img class="size-img" src="' + business + '"/></div>' +
                '<div class="col-sm-1"></div>' +
                '<div class="col-sm-1"><i class="fa fa-info" style="font-size:24px"></i></div>' +
                '</div>' +
                '</a>' +
                '</div>' +
                '<div id="' + id + '" class="collapse">' +
                '<div class="card-body">' +
                '<div class="row">' +
                '<div class="col-sm-1"></div>' +
                '<div class="col-sm-10">' + body + '</div>' +
                '<div class="col-sm-1"></div>' +
                '</div>' +
                '</div>' +
                '</div>');
        }



            
        




        /* 
                 for (i = 0; i < parsedJSON.tracks.length; i++) {
                     console.log(parsedJSON.tracks[i].path + ' - ' + parsedJSON.tracks[i].type + ' - ' + parsedJSON.tracks[i].application.business);
                 }
                 */
    }, { urls: ["<all_urls>"] }, ['blocking', 'requestBody']
);