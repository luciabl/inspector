/*
    INSPECTOR v0.0.1
 */

function impresion(id, img, tool, path, type, business, body, body2) {
    if (type.indexOf("view") > -1) {
        type = 'pageview'
    }
    if (business.match(/mercadoli(b|v)re(\.|$)/)) {
        business = 'img/md.png'
    } else if (business.match(/mercadopago(\.|$)/)) {
        business = 'img/mp.png'
    } else { business = '' }
    var subbody;
    if (tool == 'MELIDATA') {
        subbody = '<div class="col-sm-1"></div><div class="col-sm-10">' +
            body +
            "</div><div class='col-sm-1'></div>";
    } else {
        subbody = '<div class="col-sm-1"></div><div class="col-sm-4">' +
            "<h6>Details</h6>" +
            "<table class='table'>" +
            body +
            "</table>" +
            
            "</div>" +

            
            "<div class='col-sm-6'>" +

            body2 +
            "</table>" +

            "</div>";
    }

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
            subbody +
            '</div>' +
            '</div>' +
            '</div>'
        );
    }
}

function llamadas(details) {
    var tool = '';
    var path = '';
    var type = '';
    var body = '';
    var body2 = '';
    var business = '';
    var img = '';
    var id = '';
    var dec = new TextDecoder();
    var joinBuffer = '';
    var join = '';
    var j = 0;
    var i = 0;
    var url = '';
    var sURLVariables = '';
   // console.log(details);

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
            tool = "MELIDATA";
            img = "img/md.png";
            id = join.tracks[j].id;
            body += "<div id=" + id + " class=" + id + "></div>";
            impresion(id, img, tool, path, type, business, body, body2);

            $("." + id + "").jJsonViewer(JSON.stringify(join.tracks[j]));
        }
    } else if (details.url.match(/\/collect/)) {
        if (details.url.match(/collect\?v=/)){
        	url = new URL(details.url);
        	sURLVariables = details.url;
        }else{
        	url = new URL('http://www.ml.com.ar/?' + decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)));
        	sURLVariables = decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)).split('&');
        }

        path = url.searchParams.get("dp");
        type = url.searchParams.get("t");
        business = url.searchParams.get("dl")
        tool = "GOOGLE ANALYTICS";
        img = "img/ga.png";
        body = "";
        id = url.searchParams.get("z");
        //var sURLVariables = decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)).split('&');

        $.getJSON(chrome.extension.getURL('dimensiones.json'), function(dimensions) {

            for (var i = 0; i < dimensions["accounts"].length; i++) {
                if (dimensions["accounts"][i].id == url.searchParams.get("tid").substr(3, 8)) {
                    var account = dimensions["accounts"][i].name;
                    var flag = dimensions["accounts"][i].flag;
                    for (var j = 0; j < dimensions["accounts"][i].properties.length; j++) {
                        if (dimensions["accounts"][i].properties[j].id == url.searchParams.get("tid").substr(-1)) {
                            var property = dimensions["accounts"][i].properties[j].name;
                        }
                    }
                }
            }

            body += "<tr>" +
                "<td><img class='fa-2x' src=" + flag + " height= '20px'/></td>" +
                "<td> Account </td>" +
                "<td>" + account + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td><i class='fa fa-navicon fa-2x'></i></td>" +
                "<td> Property </td>" +
                "<td>" + property + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td><i class='fa fa-user fa-2x'></i></td>" +
                "<td> User Id </td>" +
                "<td>" + url.searchParams.get("uid") + "</td>" +
                "</tr>";

            if (type == 'event') {
                body += "<tr>" +
                    "<td><i class='fa fa-folder-open fa-2x'></i></td>" +
                    "<td> Categoría </td>" +
                    "<td>" + url.searchParams.get("ec") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><i class='fa fa-external-link fa-2x'></i></td>" +
                    "<td> Acción </td>" +
                    "<td>" + url.searchParams.get("ea") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><i class='fa fa-tag fa-2x'></i></td>" +
                    "<td> Etiqueta </td>" +
                    "<td>" + url.searchParams.get("el") + "</td>" +
                    "</tr>";
            }

            body2 += "<h6>Custom Dimensions</h6>" +
                "<table class='table'>" +
                "<th>ID</th><th>Name</th><th>Value</th>";

            for (var i = 0; i < sURLVariables.length; i++) {
                var sParametro = sURLVariables[i].split('=');
                if (!sParametro[0].indexOf("cd")) {
                    if (business.match(/www\.mercadoli(b|v)re\./)) {
                        dimension_name = dimensions["dimensions_ml"][(sParametro[0].substr(2)) - 1].name;
                        dimension_id = dimensions["dimensions_ml"][(sParametro[0].substr(2)) - 1].id;
                    } else if (business.match(/www\.mercadopago\./)) {
                        dimension_name = dimensions["dimensions_mp"][(sParametro[0].substr(2)) - 1].name;
                        dimension_id = dimensions["dimensions_mp"][(sParametro[0].substr(2)) - 1].id;
                    } else if (business.match(/developers\.mercadolibre/)) {
                    	dimension_name = dimensions["dimensions_devs"][(sParametro[0].substr(2)) - 1].name;
                        dimension_id = dimensions["dimensions_devs"][(sParametro[0].substr(2)) - 1].id;
                    }

                    body2 += "<tr>" +
                        "<td>" + dimension_id + "</span></td>" +
                        "<td title='sdfksjhdf'> " + dimension_name + " </td>" +
                        "<td>" + sParametro[1] + "</td>" +
                        "</tr>";
                }
            }
            impresion(id, img, tool, path, type, business, body, body2);
        });
    }

    //api dimensions:
    //https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/customDimensions/get
    //https://www.googleapis.com/analytics/v3/management/accounts/46085787/webproperties/UA-46085787-1/customDimensions/ga:dimension2
}

chrome.webRequest.onBeforeRequest.addListener(llamadas, { urls: ["https://*.mercadolibre.com/*", "https://*.google-analytics.com/*"] }, ['blocking', 'requestBody']);



