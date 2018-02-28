/*
    INSPECTOR v0.0.1
 */

function llamadas(details) {

    var tool;
    var path;
    var type;
    var body;
    var business = '';
    var img;
    var id;
    var dec = new TextDecoder();
    var joinBuffer = '';

    if (details.method == "POST" && details.url == 'https://data.mercadolibre.com/tracks') {
// EN ESTE BLOQUE INTENTAMOS VISUALIZAR CUANDO details.requestBody.raw TIENE MAS DE UNA POSICIÓN
        
        //console.log(details);
        //console.log(JSON.stringify(details.requestBody.raw[0].bytes));
        if (details.requestBody.raw.length > 1) {
            for (var i = 0; i < details.requestBody.raw.length -1 ; i++) {      
            console.log(i);          
            joinBuffer +=((String.fromCharCode.apply(null,
                                      new Uint8Array(details.requestBody.raw[i].bytes))));
            }
            
        }
        console.log(joinBuffer);

        var parsedJSON;
        
        var cont = 1;

        while (details.requestBody.raw.length >= cont) {
            //console.log(details.requestBody.raw[cont].bytes);
           // console.log(cont);
            cont = cont + 1;
        }
//FIN DEL BLOQUE DE PRUEBA
//
//  DESDE ACÁ ANDA BIEN, CONTEMPLANDO SOLO LA POSICIÓN 0 DE details.requestBody.raw
        if ((details.requestBody.raw.length) == 1) {
            var parsedJSON = JSON.parse(dec.decode(details.requestBody.raw[0].bytes));
            path = parsedJSON.tracks[0].path;
            type;
            if (parsedJSON.tracks[0].type.indexOf("view") > -1) {
                type = 'pageview'
            } else {
                type = parsedJSON.tracks[0].type
            }
            if ((parsedJSON.tracks[0].application.business).indexOf("mercadolibre") > -1) {
                business = 'img/md.png'
            } else if ((parsedJSON.tracks[0].application.business).indexOf("mercadopago") > -1) {
                business = 'img/mp.png'
            }
            body = dec.decode(details.requestBody.raw[0].bytes);
            tool = "MELIDATA";
            img = "img/md.png";
            id = parsedJSON.tracks[0].id;
        }
    } else if (details.method == "POST" && details.url == 'https://www.google-analytics.com/collect') {
        var url = new URL('http://www.ml.com.ar/?' + decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)));
        path = url.searchParams.get("dp");
        type = url.searchParams.get("t");
        if (url.searchParams.get("dl").indexOf("mercadolibre") > -1) {
            business = 'img/md.png'
        } else if (url.searchParams.get("dl").indexOf("mercadopago") > -1) {
            business = 'img/mp.png'
        }
        tool = "GOOGLE ANALYTICS";
        img = "img/ga.png";
        body = ""; 
        id = url.searchParams.get("z")

        var sURLVariables = decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)).split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParametro = sURLVariables[i].split('=');
            if (!sParametro[0].indexOf("cd") || sParametro[0] == 'tid' || sParametro[0] == 'uid') {
                body += (sParametro[0] + " -> " + sParametro[1]);
                body += "<br />";
            }
        }
    }
    //api dimensions:
    //https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/customDimensions/get
    //https://www.googleapis.com/analytics/v3/management/accounts/46085787/webproperties/UA-46085787-1/customDimensions/ga:dimension2

    if (business != '') {
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
    /*      for (i = 0; i < parsedJSON.tracks.length; i++) {
                 console.log(parsedJSON.tracks[i].path + ' - ' + parsedJSON.tracks[i].type + ' - ' + parsedJSON.tracks[i].application.business);
            }
    */
}

chrome.webRequest.onBeforeRequest.addListener(llamadas, { urls: ["https://*.mercadolibre.com/*", "https://*.google-analytics.com/*"] }, ['blocking', 'requestBody']);