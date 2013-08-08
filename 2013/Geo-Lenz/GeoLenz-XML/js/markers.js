$(document).ready(function () {
    $("#map").css({
        height: 685,
        width: 600
    });
    var myLatLng = new google.maps.LatLng(36.778261, -119.417932);
    MYMAP.init('#map', myLatLng, 5);


    MYMAP.placeMarkers('test.xml');
});

var MYMAP = {
    map: null,
    bounds: null
}

MYMAP.init = function (selector, latLng, zoom) {
    var myOptions = {
        zoom: zoom,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var style = [{
        featureType: 'all',
        elementType: 'all',
        stylers: [{
            saturation: -55
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [{
            visibility: 'off'
        }]
    }];
    this.map = new google.maps.Map($(selector)[0], myOptions);
    this.bounds = new google.maps.LatLngBounds();
}

MYMAP.placeMarkers = function (filename) {
    $.get(filename, function (xml) {



/*    <api_number>100001</api_number>
    <month>1/1/2012</month>
    <oil>52</oil>
    <gas>0</gas>
    <water>465</water>
    <serialid>725645</serialid>
    <operator_name>E &amp; B Natural Res. Mgmt. Corp.</operator_name>
    <well_name>Greenville Investment Group 1</well_name>
    <lat>37.41374676</lat>
    <lng>-121.4118816</lng>
    <status>I</status>
    <parent>\N</parent>
    <cik>\N</cik>
    <county>Alameda</county>*/

        $(xml).find("marker").each(function () {

            var county = $(this).find('county').text();
            var operator_name = $(this).find('operator_name').text();
            var well_name = $(this).find('well_name').text();
            var parent = $(this).find('parent').text();
            var oil = $(this).find('oil').text();
            var gas = $(this).find('gas').text();
            var water = $(this).find('water').text();
            // create a new LatLng point for the marker
            var lat = $(this).find('lat').text();
            var lng = $(this).find('lng').text();
            var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

            // extend the bounds to include the new point
            MYMAP.bounds.extend(point);

            var marker = new google.maps.Marker({
                position: point,
                map: MYMAP.map
            });

            var infoWindow = new google.maps.InfoWindow();
            var html = '<strong>County: </strong>'+county+'<br><strong>Operator Name: </strong>' + operator_name + '<br><strong>Well Name: </strong>' + well_name;
            
            var click = google.maps.event.addListener(marker, 'click', function () {

/*                $.ajax( {
                    data: {
                        html: $('#pseudo-ajax-response').html(),
                        delay: 0
                    },
                    type: 'get',
                    success: function(response) {
                        $('#accordion1').html(response);
                    }
                });*/
/*
                $.ajax({
                    type: "GET",
                    url: "test.xml",
                    cache: false,
                    dataType: "xml",
                    success: function(xml) {
                        $(xml).find('markers').each(function(){
                            $(this).find("well_name").each(function(){
                                var name = $(this).text();
                                alert(name);
                            });
                        });
                    }
                });*/


                $('.accordion-body').collapse('show');
                infoWindow.setContent(html);
                infoWindow.open(MYMAP.map, marker);
            });


            var mouseover = google.maps.event.addListener(marker, 'mouseover', function () {
                infoWindow.setContent(html);
                infoWindow.open(MYMAP.map, marker);
            });

            var mouseout = google.maps.event.addListener(marker, 'mouseout', function () {
                infoWindow.setContent(html);
                infoWindow.close();
            });
            MYMAP.map.fitBounds(MYMAP.bounds);
        });
    });
}