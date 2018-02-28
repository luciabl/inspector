/*
    INSPECTOR v0.0.1
 */

function impresion(id, img, tool, path, type, business, body) {
    if (type.indexOf("view") > -1) {
        type = 'pageview'
    }
    if ((tool == 'GOOGLE ANALYTICS' && business.indexOf("mercadolibre.com") > -1) || (tool == 'MELIDATA' && business.indexOf("mercadolibre") > -1)) {
        business = 'img/md.png'
    } else if ((tool == 'GOOGLE ANALYTICS' && business.indexOf("mercadopago.com") > -1) || (tool == 'MELIDATA' && business.indexOf("mercadopago") > -1)) {
        business = 'img/mp.png'
    } else { business = '' }

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
}

function llamadas(details) {
    var tool = '';
    var path = '';
    var type = '';
    var body = '';
    var business = '';
    var img = '';
    var id = '';
    var dec = new TextDecoder();
    var joinBuffer = '';
    var join = '';
    var j = 0;
    var i = 0;
    if (details.method == "POST" && details.url == 'https://data.mercadolibre.com/tracks') {
        for (i = 0; i < details.requestBody.raw.length; i++) {
            joinBuffer += ((String.fromCharCode.apply(null,
                new Uint8Array(details.requestBody.raw[i].bytes))));
        }
        join = JSON.parse(joinBuffer);
        for (j = 0; j < join.tracks.length; j++) {
            path = join.tracks[j].path;
            type = join.tracks[j].type;
            business = join.tracks[j].application.business;
            body = JSON.stringify(join.tracks[j]);
            tool = "MELIDATA";
            img = "img/md.png";
            id = join.tracks[j].id;
            impresion(id, img, tool, path, type, business, body);
        }
    } else if (details.method == "POST" && details.url == 'https://www.google-analytics.com/collect') {
        var url = new URL('http://www.ml.com.ar/?' + decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)));
        path = url.searchParams.get("dp");
        type = url.searchParams.get("t");
        business = url.searchParams.get("dl")
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
        impresion(id, img, tool, path, type, business, body);
    }
    //api dimensions:
    //https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/customDimensions/get
    //https://www.googleapis.com/analytics/v3/management/accounts/46085787/webproperties/UA-46085787-1/customDimensions/ga:dimension2


    /*      for (i = 0; i < parsedJSON.tracks.length; i++) {
                 console.log(parsedJSON.tracks[i].path + ' - ' + parsedJSON.tracks[i].type + ' - ' + parsedJSON.tracks[i].application.business);
            }
    */
}

chrome.webRequest.onBeforeRequest.addListener(llamadas, { urls: ["https://*.mercadolibre.com/*", "https://*.google-analytics.com/*"] }, ['blocking', 'requestBody']);