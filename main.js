/*
    INSPECTOR v0.0.1
 */

function impresion(id, img, tool, path, type, businessurl, body, body2, link, isValid, messagesCatalog) {
    var iconValid = '';
    var iconColor = '';
    var businessImg = '';
    var business = '';
    if (type.indexOf("view") > -1) {
        type = 'pageview'
    }
    if (businessurl.match(/mercadoli(b|v)re(\.|$)/)) {
        businessImg = 'img/md.png'
        business = 'Mercado Libre'
    } else if (businessurl.match(/mercadopago(\.|$)/)) {
        businessImg = 'img/mp.png'
        business = 'Mercado Pago'
    } else { business = '' }

    if (isValid == 'valid') {
        description = 'Valid Track';
        iconColor = 'green';
        isValid = '<i id="circleValid" class="fa fa-circle" style="color:green;" data-toggle="tooltip" data-placement="right"></i>';
        iconValid = 'fa fa-check-circle-o'
    } else if (isValid == 'notValid') {
        description = 'Invalid Track';
        iconColor = 'red';
        isValid = '<i id="circleValid" class="fa fa-circle" style="color:red;" data-toggle="tooltip" data-placement="right"></i>';
        iconValid = 'fa fa-times-circle-o'
    } else {
        isValid = '';
        description = '';
    }

    var subbody;

    if (tool == 'MELIDATA') {
        subbody = '<div class="col-sm-12">' +
            body +
            "</div>";
    } else {
        subbody = '<div class="col-sm-6">' +
            "<h6>Details</h6>" +
            "<table class='table' width='100%'>" +
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
            '<div id="imgTool" class="col-sm-1 text-center"><img class="size-img" src="' + img + '"/></div>' +
            '<div id="idValid" class="col-sm-1 text-center">' + isValid + '</div>' +
            '<div id="tool" class="col-sm-2 text-center">' + tool + '</div>' +
            '<div id="path" class="path col-sm-3 text-center">' + path + '</textarea></div>' +
            '<div id="type" class="col-sm-2 text-center">' + type + '</div>' +
            '<div id="business" class="col-sm-1 text-center"><img class="size-img" src="' + businessImg + '"/></div>' +
            '<div id="blank" class="col-sm-1"></div>' +
            '<div id="moreInfo" class="col-sm-1"><i class="fa fa-sort" style="font-size:24px"></i></div>' +
            '</div>' +
            '</a>' +
            '</div>' +
            '<div id="' + id + '" class="collapse">' +
            '<div class="card-body">' +
            '<div class="row" style="overflow: scroll;">' +
            subbody +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
        $(".dvDataTR").append(
            '<tr>' +
            '<td>' + tool + '</td>' +
            '<td>' + path + '</td>' +
            '<td>' + type + '</td>' +
            '<td>' + business + '</td>' +
            '<td>' + businessurl + '</td>' +
            '<td>' + description + ' ' + messagesCatalog + '</td>' +
            '</tr>'
        );
    }

    $('[data-toggle="tooltip"]').tooltip({
        html: true,
        title: '<i class="' + iconValid + '" style="font-size:30px;color:' + iconColor + ';"></i>\n<a style="font-size:14px; font-weight: bold;">' + description + '</a style="text-align=left;">\n' + messagesCatalog + '</a>'
    });
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
    var link = '';
    var isValid = false;
    var formData = {};
    var messagesCatalog = '';
    var utm_campaign = '';
    var utm_medium = '';
    var utm_source = '';

    if (details.method == "POST" && details.url == 'https://data.mercadolibre.com/tracks') {
        for (i = 0; i < details.requestBody.raw.length; i++) {
            joinBuffer += ((String.fromCharCode.apply(null,
                new Uint8Array(details.requestBody.raw[i].bytes))));
        }
        join = JSON.parse(joinBuffer);

        for (j = 0; j < join.tracks.length; j++) {

            formData = join.tracks[j];

            $.ajax({
                    async: false,
                    url: 'https://api.mercadolibre.com/melidata/catalog/validate',
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(join.tracks[j])
                })
                .always(function(data) {
                    path = formData.path;
                    type = formData.type;
                    //                    business = formData.application.business;
                    business = formData.platform.http.http_url;
                    tool = "MELIDATA";
                    img = "img/md.png";
                    id = formData.id;
                    body += "<div id=" + id + " class=" + id + "></div>";
                    if (data.status == 400) {
                        isValid = 'notValid';
                        for (var i = 0; i < data.responseJSON.messages.length; i++) {
                            messagesCatalog += '- ' + data.responseJSON.messages[i];
                            messagesCatalog += '\n'
                        }
                    } else {
                        isValid = 'valid'
                    }
                    impresion(id, img, tool, path, type, business, body, body2, link, isValid, messagesCatalog)
                    $("." + id + "").jJsonViewer(JSON.stringify(formData));
                })
        }

    } else if (details.url.match(/\/collect/)) {
        if (details.url.match(/collect\?v=/)) {
            url = new URL(details.url);
            sURLVariables = details.url;
        } else {
            url = new URL('http://www.ml.com.ar/?' + decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)));
            sURLVariables = decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)).split('&');
        }

        //path = url.searchParams.get("dp").replace(/\?.*/,"");
        type = url.searchParams.get("t");
        if (type == 'pageview') {
            path = url.searchParams.get("dp").replace(/\?.*/, "");
        } else {
            path = url.searchParams.get("ec");
            path += ' - ' + url.searchParams.get("ea")
        }
        business = url.searchParams.get("dl")

        var utm_url = decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)).replace("?","&").split("&");
        for (var i = 0; i < utm_url.length; i++) {
            if (utm_url[i].match(/utm_campaign/)){
                utm_campaign = utm_url[i].split('=')[1];
            }else if (utm_url[i].match(/utm_source/)){
                utm_source = utm_url[i].split('=')[1];
            }else if (utm_url[i].match(/utm_medium/)){
                utm_medium = utm_url[i].split('=')[1];
            }
        }
        tool = "GOOGLE ANALYTICS";
        img = "img/ga.png";
        body = "";
        id = url.searchParams.get("z");

        $.getJSON(chrome.extension.getURL('dimensiones.json'), function(dimensions) {

            for (var i = 0; i < dimensions["accounts"].length; i++) {
                if (dimensions["accounts"][i].id == url.searchParams.get("tid").substr(3, 8)) {
                    var account = dimensions["accounts"][i].name;
                    var flag = dimensions["accounts"][i].flag;
                    var a = dimensions["accounts"][i].id;
                    for (var j = 0; j < dimensions["accounts"][i].properties.length; j++) {
                        if (dimensions["accounts"][i].properties[j].id == url.searchParams.get("tid").substr(-1)) {
                            var property = dimensions["accounts"][i].properties[j].name;
                            var w = dimensions["accounts"][i].properties[j].id_w;
                            var p = dimensions["accounts"][i].properties[j].id_p;
                        }
                    }
                }
            }
            link = '<a href="https://analytics.google.com/analytics/web/#report/content-pages/a' + a + 'w' + w + 'p' + p + '/%3Fexplorer-table.plotKeys%3D%5B%5D%26_r.drilldown%3Danalytics.pagePath%3A' + encodeURIComponent(path) + '/"  target="_blank">Link</a>';

            body += "<tr>" +
                "<td><i class='fa fa-angle-right fa-2x'></i></td>" +
                "<td> Path </td>" +
                "<td>" + path + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td><i class='fa fa-globe fa-2x'></i></td>" +
                "<td> Url </td>" +
                "<td><a href='" + business + "' target='_blank'>Link</a></td>" +
                "</tr>" +
                "<tr>" +
                "<td><img class='fa-2x' src=" + flag + " height= '25px'/></td>" +
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

            if ((type == 'event') || (type == 'EVENT')) {
                body += "<tr>" +
                    "<td><i class='fa fa-folder-open fa-2x'></i></td>" +
                    "<td> Category </td>" +
                    "<td>" + url.searchParams.get("ec") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><i class='fa fa-external-link fa-2x'></i></td>" +
                    "<td> Action </td>" +
                    "<td>" + url.searchParams.get("ea") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><i class='fa fa-tag fa-2x'></i></td>" +
                    "<td> Label </td>" +
                    "<td>" + url.searchParams.get("el") + "</td>" +
                    "</tr>";
            } else {
                body += "<tr>" +
                    "<td><i class='fa fa-external-link fa-2x'></i></td>" +
                    "<td> View in GA </td>" +
                    "<td>" + link + "</td>" +
                    "</tr>";
            }

            if (utm_source != ''){
                body += "<tr>" +
                "<td><i class='fa fa-bullhorn fa-2x'></i></td>" +
                "<td> UTM source </td>" +
                "<td>" + utm_source + "</td>" +
                "</tr>" +
                "<tr>"
            }
            if(utm_medium != ''){
                body += "<tr>" +
                "<td><i class='fa fa-bullhorn fa-2x'></i></td>" +
                "<td> UTM medium </td>" +
                "<td>" + utm_medium + "</td>" +
                "</tr>" +
                "<tr>"
            }
            if (utm_campaign != ''){
                body += "<tr>" +
                "<td><i class='fa fa-bullhorn fa-2x'></i></td>" +
                "<td> UTM campaign </td>" +
                "<td>" + utm_campaign + "</td>" +
                "</tr>" +
                "<tr>"
            }

            body2 += "<h6>Custom Dimensions</h6>" +
                "<table class='table'>" +
                "<th>ID</th><th>Name</th><th>Value</th>";

            var dimensions_id = []
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParametro = sURLVariables[i].split('=');
                if (!sParametro[0].indexOf("cd")) {
                    dimensions_id.push({ id: parseInt(sParametro[0].substr(2)), value: sParametro[1] });
                }
            }

            dimensions_id.sort(function(a, b) {
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
                return 0;
            });

            for (var i = 0; i < dimensions_id.length; i++) {
                if (business.match(/mercadoli(b|v)re\./)) {
                    dimension_name = dimensions["dimensions_ml"][(dimensions_id[i].id) - 1].name;
                    dimension_id = dimensions["dimensions_ml"][(dimensions_id[i].id) - 1].id;
                } else if (business.match(/www\.mercadopago\./)) {
                    dimension_name = dimensions["dimensions_mp"][(dimensions_id[i].id) - 1].name;
                    dimension_id = dimensions["dimensions_mp"][(dimensions_id[i].id) - 1].id;
                } else if (business.match(/developers\.mercadolibre/)) {
                    dimension_name = dimensions["dimensions_devs"][(dimensions_id[i].id) - 1].name;
                    dimension_id = dimensions["dimensions_devs"][(dimensions_id[i].id) - 1].id;
                }

                body2 += "<tr>" +
                    "<td>" + dimension_id + "</span></td>" +
                    "<td title='sdfksjhdf'> " + dimension_name + " </td>" +
                    "<td>" + dimensions_id[i].value + "</td>" +
                    "</tr>";
            }
            impresion(id, img, tool, path, type, business, body, body2, link, isValid, messagesCatalog);
        });
    }
}

chrome.webRequest.onBeforeRequest.addListener(llamadas, { urls: ["https://*.mercadolibre.com/*", "https://*.google-analytics.com/*"] }, ['blocking', 'requestBody']);

var consulta = window.matchMedia('(max-width: 767px)');

function mediaQuery() {
    if (consulta.matches) {
        //console.log("se cumplio");
        $('.path').attr('class', 'col-sm-10 text-center');
    } else {
        //console.log("no se cumplio");
    }
};

document.addEventListener('DOMContentLoaded', function() {
    consulta.addListener(mediaQuery);
});


$(document).ready(function() {

    /* EXPORT TO CSV */
    function exportTableToCSV($table, filename) {
        var $rows = $table.find('tr:has(td)'),
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character
            colDelim = '","',
            rowDelim = '"\r\n"',
            csv = '"' + $rows.map(function(i, row) {
                var $row = $(row),
                    $cols = $row.find('td');
                return $cols.map(function(j, col) {
                    var $col = $(col),
                        text = $col.text();
                    return text.replace(/"/g, '""'); // escape double quotes
                }).get().join(tmpColDelim);
            }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '"';
        if (false && window.navigator.msSaveBlob) {
            var blob = new Blob([decodeURIComponent(csv)], {
                type: 'text/csv;charset=utf8'
            });
            window.navigator.msSaveBlob(blob, filename);
        } else if (window.Blob && window.URL) {
            var blob = new Blob([csv], {
                type: 'text/csv;charset=utf-8'
            });
            var csvUrl = URL.createObjectURL(blob);

            $(this)
                .attr({
                    'download': filename,
                    'href': csvUrl
                });
        } else {
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

            $(this)
                .attr({
                    'download': filename,
                    'href': csvData,
                    'target': '_blank'
                });
        }
    }

    $(".export").on('click', function(event) {
        var args = [$('#dvData>table'), 'TrackInspector-Export.csv'];
        exportTableToCSV.apply(this, args);
    });

    /* END EXPORT TO CSV */

});