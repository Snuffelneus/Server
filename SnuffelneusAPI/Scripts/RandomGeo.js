var f1;
var sigDigits = 8;
var selectedRegion = 0;
var selectedFormat = 0;
var units = "mi";
var mapwin = null;
var circumMiles = 12440.883;
var circumKm = 20020.732;
var gLatlon = "";
var gStartlat = 0;
var gStartlon = 0;

function calculate() {
    var array1 = new Array();
    var lat = 0;
    var lon = 0;
    var p = 1000;

    // circular
    var startlat = latLonToDecimal("51.92421599999999", 1, "latitude");
    if (startlat == -999) {
        f1.startlat.focus();
        clearRandomPoint();
        return;
    }
    gStartlat = startlat;
    var brg = new Array(0, 180, 0);
    var j = 0;
    if (startlat == 90) {
        startlat = 89.99999999;
        j = 1
    }
    if (startlat == -90) {
        startlat = -89.99999999;
        j = 2;
    }
    startlat = rad(startlat);
    startlon = latLonToDecimal("4.481775999999968", 0, "longitude");
    if (startlon == -999) {
        f1.startlon.focus();
        clearRandomPoint();
        return;
    }
    gStartlon = startlon;
    startlon = rad(startlon);
    var mx = circumKm;
    var radiusEarth = 6372.796924;

    var maxdist = 15;

    maxdist = maxdist / radiusEarth;
    var cosdif = cos(maxdist) - 1;
    var sinstartlat = sin(startlat);
    var cosstartlat = cos(startlat);
    var dist = 0;
    var rad360 = 2 * PI;
    var displayDist = (f1.wholeearth[1].checked || f1.wholeearth[0].checked && (f1.startlat.value != 0 || f1.startlon.value != 0));

    for (i = 0; i < p; i++) {
        dist = acos(random() * cosdif + 1);
        brg[0] = rad360 * random();
        lat = asin(sinstartlat * cos(dist) + cosstartlat * sin(dist) * cos(brg[0]));
        lon = deg(normalizeLongitude(startlon * 1 + atan2(sin(brg[0]) * sin(dist) * cosstartlat, cos(dist) - sinstartlat * sin(lat))));
        lat = deg(lat);
        dist = round(dist * radiusEarth * 10000) / 10000;
        brg[0] = round(deg(brg[0]) * 1000) / 1000;
        array1.push("w" + decimalToDMS(lat, 1) + "x" + padZeroRight(lat) + "y" + decimalToDMS(lon, 0) + "z" + padZeroRight(lon) + "\n");

    }

    console.log(array1);

    gLatlon = array1.join("");
    displayResults(p);
}

function latLonToDecimal(ll, lat, f) {
    var sChar;
    var decCoord;
    var array1 = new Array(10);
    var l;
    var fail;
    msg = "invalid";
    if (ll == "") {
        msg = "required";
        fail = true;
    }
    sChar = ll.substring(ll.length - 1);
    sChar = sChar.toLowerCase();
    if (sChar != "n" && sChar != "s" && sChar != "e" && sChar != "w") {
        if ((ll != parseFloat(ll, 10))
			|| (lat == 1 && (ll < -90 || ll > 90))
			|| (lat == 0 && (ll < -180 || ll > 180))) {
            fail = true;
        } else {
            decCoord = ll;
        }
    } else {
        // ends in N, S, E or W
        ll = trim(ll.substring(0, ll.length - 1));
        l = ll.length;
        // test for pure integer
        if ((ll == parseInt(ll, 10)) && l > 4) {
            array1[2] = (ll.substring(l - 2, l));
            array1[1] = (ll.substring(l - 4, l - 2));
            array1[0] = (ll.substring(0, l - 4));
        } else {
            // validate DMS formats
            var dms = /^\d{1,3}\W{1}\d{1,2}\W{1}\d{1,2}\W?$/
            var dm = /^\d{1,3}\W{1}\d{1,2}\W?$/
            var d = /^\d{1,3}\W?$/
            if (dms.test(ll) || dm.test(ll) || d.test(ll)) {
                array1 = ll.match(/\d+/g)
            } else {
                fail = true;
            }
        }
        l = array1.length;
        if (l >= 1) {
            decCoord = array1[0] * 1;
        }
        if (l >= 2) {
            decCoord = decCoord + (array1[1] / 60);
        }
        if (l >= 3) {
            decCoord = decCoord + (array1[2] / 3600);
        }
        if ((lat == 1 && (decCoord > 90 || sChar != "n" && sChar != "s")
			|| lat == 0 && (decCoord > 180 || sChar != "e" && sChar != "w"))
			|| array1[1] > 59 || array1[2] > 59) {
            fail = true;
        }
        if (sChar == "w" || sChar == "s") {
            decCoord = decCoord * -1;
        }
    }
    if (fail) {
        alert('The ' + f + ' is ' + msg);
        return -999;
    } else {
        return decCoord;
    }
}

function rad(dg) {
    return (dg * Math.PI / 180);
}

function deg(rd) {
    return (rd * 180 / Math.PI);
}

calculate();