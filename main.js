/*
    INSPECTOR v0.1.2
 */

function impresion(id, img, tool, path, type, businessurl, body, body2, link, isValid, messagesCatalog) {
    var iconValid = '';
    var iconColor = '';
    var businessImg = '';
    var business = '';
    var bsn = '';
    if (type.indexOf("view") > -1) {
        type = 'pageview'
    }
    if (businessurl.match(/mercadoli(b|v)re(\.|$)/)) {
        businessImg = 'img/md.png';
        business = 'Mercado Libre';
        bsn = 'ml'
    } else if (businessurl.match(/mercadopago(\.|$)/)) {
        businessImg = 'img/mp.png';
        business = 'Mercado Pago';
        bsn = 'mp'
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
    var tool_class;

    if (tool == 'MELIDATA') {
        subbody = '<div class="col-sm-12">' +
            body +
            "</div>";
        tool_class= 'md'
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
        tool_class= 'ga'
    }

    if (business != '') {
        $(".accordion").append(
            '<div class="card list '+tool_class+' '+type+' '+bsn+'">' +
            '<div class="card-header">' +
            '<a class="collapsed card-link" data-toggle="collapse" data-parent="#accordion" href="#' + id + '">' +
            '<div class="row">' +
            '<div id="imgTool" class="col-sm-1 text-center"><img class="size-img" src="' + img + '"/></div>' +
            '<div id="idValid" class="col-sm-1 text-center">' + isValid + '</div>' +
            '<div id="tool" class="col-sm-2 text-center">' + tool + '</div>' +
            '<div id="type" class="col-sm-2 text-center">' + type + '</div>' +
            '<div id="path" class="path col-sm-3 text-center">' + path + '</textarea></div>' +
            '<div id="business" class="col-sm-2 text-center"><img class="size-img" src="' + businessImg + '"/></div>' +
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

    $('[data-toggle="tooltip_gral"]').tooltip(); 

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

    if (details.method == "POST" && details.url.match(/data\.mercadolibre\.com\/tracks$/)) {
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
            sURLVariables = details.url.split('&');
        } else {
            url = new URL('http://www.ml.com.ar/?' + decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)));
            sURLVariables = decodeURIComponent(dec.decode(details.requestBody.raw[0].bytes)).split('&');
        }

        type = url.searchParams.get("t");
        if (url.searchParams.get("dp") == null){
            path = 'null'
        }else{
        path = url.searchParams.get("dp").replace(/\?.*/, "")
        }
        business = url.searchParams.get("dl")

        if (details.requestBody != null){
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
                "<td><path id='path_"+id+"'>" + path + "</path>&nbsp;&nbsp;<button class='btn btn-default btn-sm copy' id='copy_"+id+"'><i class='fa fa-clone'></i></button></td>" +                "</tr>" +
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
                    "<td> Event Category </td>" +
                    "<td>" + url.searchParams.get("ec") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><i class='fa fa-external-link fa-2x'></i></td>" +
                    "<td> Event Action </td>" +
                    "<td>" + url.searchParams.get("ea") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td><i class='fa fa-tag fa-2x'></i></td>" +
                    "<td> Event Label </td>" +
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
                if (business.match(/appstore\.mercadolibre/)) {
                    dimension_name = dimensions["dimensions_appstore"][(dimensions_id[i].id) - 1].name;
                    dimension_id = dimensions["dimensions_appstore"][(dimensions_id[i].id) - 1].id;
                }else if (business.match(/developers\.mercadolibre/)) {
                    dimension_name = dimensions["dimensions_devs"][(dimensions_id[i].id) - 1].name;
                    dimension_id = dimensions["dimensions_devs"][(dimensions_id[i].id) - 1].id;
                }else if (business.match(/mercadoli(b|v)re\./)) {
                    dimension_name = dimensions["dimensions_ml"][(dimensions_id[i].id) - 1].name;
                    dimension_id = dimensions["dimensions_ml"][(dimensions_id[i].id) - 1].id;
                } else if (business.match(/www\.mercadopago\./)) {
                    dimension_name = dimensions["dimensions_mp"][(dimensions_id[i].id) - 1].name;
                    dimension_id = dimensions["dimensions_mp"][(dimensions_id[i].id) - 1].id;
                }

                body2 += "<tr>" +
                    "<td>" + dimension_id + "</span></td>" +
                    "<td title='sdfksjhdf'> " + dimension_name + " </td>" +
                    "<td>" + dimensions_id[i].value + "</td>" +
                    "</tr>";
            }

            impresion(id, img, tool, path, type, business, body, body2, link, isValid, messagesCatalog);

            $(document).ready(function() {    
                $(".copy").on("click",function(){
                    var id_element = $(this).attr("id");
                    path_id = "path_" + id_element.substr(5,id_element.length);
                    copiarAlPortapapeles(path_id);
                    $("#"+path_id).attr("data-toggle","tooltip");
                    $("#"+path_id).attr("title","Copied!");
                    $("#"+path_id).tooltip('show');
                    setTimeout(function () {
                            $("path").tooltip('dispose');
                    }, 800);
                });
/*
                $.ajax({
                    url: "http://localhost:8080/inspector/script.php",
                    type: "post",
                    data: { path: path, type: type },
                    dataType: 'json'
                }).always(function(data) {
                     console.log(data);
                });
*/
            })

        });
    }
}

chrome.webRequest.onBeforeRequest.addListener(llamadas, { urls: ["http://*.mercadolibre.com/*","https://*.mercadolibre.com/*", "https://*.google-analytics.com/*"] }, ['blocking', 'requestBody']);

var consulta = window.matchMedia('(max-width: 767px)');

function mediaQuery() {
    if (consulta.matches) {
        $('.path').attr('class', 'col-sm-10 text-center');
    } else {
    }
};

function copiarAlPortapapeles(id_elemento) {
  var aux = document.createElement("input");
  aux.setAttribute("value", document.getElementById(id_elemento).innerHTML);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

document.addEventListener('DOMContentLoaded', function() {
    consulta.addListener(mediaQuery);
});

$(document).ready(function() {

    $('.dropdown-toggle').dropdownHover();

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


    //FILTROS
    $("#filter1 :checkbox,#filter2 :checkbox,#filter3 :checkbox").click(function () {

            $("div.list").hide();

            var Filter1Array = [];
            var Filter2Array = [];
            var Filter3Array = [];
            var filter1_Count = 0, filter2_Count = 0, filter3_Count = 0;

            $("#filter1 :checkbox:checked").each(function () {
                Filter1Array[filter1_Count] = $(this).val();
                filter1_Count++;
            });

            $("#filter2 :checkbox:checked").each(function () {
                Filter2Array[filter2_Count] = $(this).val();
                filter2_Count++;
            });

            $("#filter3 :checkbox:checked").each(function () {
                Filter3Array[filter3_Count] = $(this).val();
                filter3_Count++;
            });

            var filter1string
            var filter2string
            var filter3string

            var filter1checked = false
            var filter2checked = false
            var filter3checked = false

            if (filter1_Count == 0) { filter1_Count = 1; $(".filter1 i").hide();} else { filter1checked = true; $(".filter1 i").show();}
            if (filter2_Count == 0) { filter2_Count = 1; $(".filter2 i").hide();} else { filter2checked = true; $(".filter2 i").show();}
            if (filter3_Count == 0) { filter3_Count = 1; $(".filter3 i").hide();} else { filter3checked = true; $(".filter3 i").show();}

            for (f1 = 0; f1 < filter1_Count; f1++) {

                if (Filter1Array[f1] != null) { filter1string = '.' + Filter1Array[f1] } else { filter1string = '' }

                for (f2 = 0; f2 < filter2_Count; f2++) {

                    if (Filter2Array[f2] != null) { filter2string = '.' + Filter2Array[f2] } else { filter2string = '' }

                    for (f3 = 0; f3 < filter3_Count; f3++) {

                        if (Filter3Array[f3] != null) { filter3string = '.' + Filter3Array[f3] } else { filter3string = '' }

                        var QueryString = filter1string + filter2string + filter3string
                            $(QueryString).fadeIn('fast');
                    }
                }
            }

            if (!filter1checked && !filter2checked && !filter3checked) {
                $("div.list").fadeIn('fast');
            };

            if ($('div.list:visible').length === 0) {
                
            }
            else { $(".NoResults").html(""); }

        });

        $('a.showall').click(function () {
            $("div.list").fadeIn('fast');
            $("#filter1 :checkbox").prop("checked", false);
            $("#filter2 :checkbox").prop("checked", false);
            $("#filter3 :checkbox").prop("checked", false);
            $(".filter1 i").hide();
            $(".filter2 i").hide();
            $(".filter3 i").hide();
            $(".NoResults").html("");
            ga('send', 'event', 'LIST', 'DELETE_FILTERS');
            return false;
        });

        $('a.export').click(function () {
        	ga('send', 'event', 'LIST', 'EXPORT', 'CSV');
        });

        $('a.delete').click(function () {
            $(".accordion").empty();
        	ga('send', 'event', 'LIST', 'DELETE_TRACKS');
        });


    //END FILTROS
});