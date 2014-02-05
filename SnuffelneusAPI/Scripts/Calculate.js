var query = '';
var timer = 0;
var lats = new Array(10);
var lons = new Array(10);
var geocode;
google.load('maps', '3', { other_params: "sensor=false" });

function initialize() {
    geocoder = new google.maps.Geocoder();
    f1 = document.frm;
    f1.circular.checked = true;
    f1.wholeearth[1].checked = true;
    selectedRegion = 0;
    switchrows();
    f1.results.value = "";
    f1.points.value = 1;
}

function launchGeocode() {
    query = trim(document.getElementById('search').value);
    var l = query.length;
    if (l == 0) {
        alert("You must enter a city, town or other place to search for");
        f1.search.focus();
        return false;
    }
    clearRandomPoint();
    geocoder.geocode({ 'address': query }, gCallback);
}

function gCallback(res, status) {
    clearTimeout(timer);
    var r = f1.results;

    if (status != "OK") {
        switch (status) {
            case "ZERO_RESULTS":
                alert('No results');
                break;
            case "OVER_QUERY_LIMIT":
                alert('Google geocoder speed limit. Click \'Resume\' each time calculator stops.');
                break;
            case "REQUEST_DENIED":
                alert('Request denied');
                break;
            case "INVALID_REQUEST":
                alert('Invalid request');
                break;
        }
        r.length = 0;
        return;
    }
    // status=OK
    var addr;
    r.length = 0;
    lats.length = 0;
    lons.length = 0;
    for (i = 0; i < res.length; i++) {
        addr = res[i].formatted_address;
        appendOptionLast("results", addr);
        r[r.length - 1].value = res[i].geometry.location.lat() + "|" + res[i].geometry.location.lng();
        lats[i] = res[i].geometry.location.lat();
        lons[i] = res[i].geometry.location.lng();
    }
    if (lats.length > 0) {
        f1.startlat.value = lats[0];
        f1.startlon.value = lons[0];
    }
    if (r.length == 1) {
        document.getElementById("resultslabel").innerHTML = "1 search result:";
    } else {
        document.getElementById("resultslabel").innerHTML = r.length + " search results:";
    }
    toggle2Rows("resultsrow", "searchrow");
    f1.results.focus();
}



function noResults() {
    clearTimeout(timer);
    var r = f1.results;
    r.length = 0;
    toggle2Rows("resultsrow", "searchrow");
    document.getElementById("resultslabel").innerHTML = "0 search results:";
    f1.results.focus();
}

function clearGeocode() {
    f1.search.value = "";
    f1.results.length = 0;
    document.getElementById("resultslabel").innerHTML = "search results:";
    f1.startlat.value = "";
    f1.startlon.value = "";
    if (selectedRegion == 0) {
        toggle2Rows("searchrow", "resultsrow");
    }
    clearRandomPoint();
}

function toggle2Rows(div1, div2) {
    document.getElementById(div1).style.display = "block";
    document.getElementById(div2).style.display = "none";
}


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

function writeLatLon() {
    var i = f1.results.selectedIndex;
    f1.startlat.value = lats[i];
    f1.startlon.value = lons[i];
}

function appendOptionLast(combo, item) {
    var elOptNew = document.createElement('option');
    elOptNew.text = item;
    elOptNew.value = item;
    var elSel = document.getElementById(combo);
    try {
        elSel.add(elOptNew, null);
    }
    catch (ex) {
        elSel.add(elOptNew);
    }
}

function clearRandomPoint() {
    f1.randompoint.value = "";
    gLatlon = "";
    document.getElementById("randompoint").rows = 2;
    document.getElementById("randompointlabel").innerHTML = "Results:";
}

function resetValues() {
    f1.startlat.value = "";
    f1.startlon.value = "";
    f1.maxdist.value = "";
    f1.northlat.value = "";
    f1.southlat.value = "";
    f1.westlon.value = "";
    f1.eastlon.value = "";
    f1.search.value = "";
    f1.results.length = 0;
    clearRandomPoint();
    if (f1.wholeearth[0].checked) {
        if (f1.region[0].checked) {
            // circular
            f1.startlat.value = 0;
            f1.startlon.value = 0;
            if (f1.distunits[1].checked) {
                f1.maxdist.value = circumKm;
            } else {
                f1.maxdist.value = circumMiles;
            }
        } else {
            //rectangular
            f1.northlat.value = 90;
            f1.southlat.value = -90;
            f1.westlon.value = -180;
            f1.eastlon.value = 180;
        }
    }
    document.getElementById("resultsrow").style.display = "none";
    if (!f1.wholeearth[0].checked && f1.region[0].checked) {
        document.getElementById("searchrow").style.display = "block";
    } else {
        document.getElementById("searchrow").style.display = "none";
    }
}

function switchrows() {
    if (f1.region[1].checked) {
        // rectangular is checked
        document.getElementById("northlatrow").style.display = "block";
        document.getElementById("westlonrow").style.display = "block";
        document.getElementById("startlatrow").style.display = "none";
        document.getElementById("maxdistrow").style.display = "none";
        selectedRegion = 1;
    } else {
        // circular
        document.getElementById("startlatrow").style.display = "block";
        document.getElementById("maxdistrow").style.display = "block";
        document.getElementById("northlatrow").style.display = "none";
        document.getElementById("westlonrow").style.display = "none";
        selectedRegion = 0;
    }
    resetValues();
}

function changeMiles() {
    if (f1.maxdist.value == circumKm) {
        f1.maxdist.value = circumMiles;
    }
}

function changeKm() {
    if (f1.maxdist.value == circumMiles) {
        f1.maxdist.value = circumKm;
    }
}

function rad(dg) {
    return (dg * Math.PI / 180);
}

function deg(rd) {
    return (rd * 180 / Math.PI);
}

function trim(sString) {
    while (sString.charCodeAt(0) < 33)
        sString = sString.substring(1, sString.length);
    while (sString.charCodeAt(sString.length - 1) < 33)
        sString = sString.substring(0, sString.length - 1);
    return sString;
}

function normalizeLongitude(lon) {
    var n = Math.PI;
    if (lon > n) {
        lon = lon - 2 * n
    } else if (lon < -n) {
        lon = lon + 2 * n
    }
    return lon;
}

function isNumeric(s, mn, mx, allowNull) {
    var result = true;
    if (s == "" && !allowNull) {
        return false;
    } else {
        if ((parseFloat(s, 10) != s) || (s < mn) || (s > mx)) {
            return false;
        }
    }
    return result;
}

function changeUnits() {
    var x = f1.maxdist;
    if (f1.distunits[0].checked) {
        units = "mi";
        if (x.value == circumKm) {
            x.value = circumMiles;
        }
    } else {
        units = "km";
        if (x.value == circumMiles) {
            x.value = circumKm;
        }
    }
}

function changeFormat() {
    for (i = 0; i < 3; i++) {
        if (f1.format[i].checked) {
            selectedFormat = i;
        }
    }
    if (f1.randompoint.value.length == 0) {
        return false;
    }
    timer = window.setTimeout("displayResults()", 1);
    document.getElementById("randompointlabel").innerHTML = "Please wait...";
}

function displayResults(p) {
    var p = trim(f1.points.value);
    var w1 = new Array("Latitude: ", "", "");
    var x1 = new Array("   ", "\t", ",");
    var y1 = new Array("\nLongitude: ", "\t", ",");
    var j1 = new Array("\nDistance: ", "\t", ",");
    var q1 = new Array(" " + units + "  Bearing: ", "\t", ",");
    //var tick = (new Date()).valueOf();
    var ll = gLatlon;
    ll = ll.replace(/w/g, w1[selectedFormat]);
    ll = ll.replace(/x/g, x1[selectedFormat]);
    ll = ll.replace(/y/g, y1[selectedFormat]);
    ll = ll.replace(/z/g, x1[selectedFormat]);
    ll = ll.replace(/j/g, j1[selectedFormat]);
    ll = ll.replace(/q/g, q1[selectedFormat]);
    f1.randompoint.value = ll;
    if (p == 1) {
        document.getElementById("randompointlabel").innerHTML = "1 random point:";
    } else {
        document.getElementById("randompointlabel").innerHTML = p + " random points:";
    }
    if (p == 1 && f1.format[0].checked && (f1.region[0].checked && f1.wholeearth[0].checked && f1.startlat.value == 0 && f1.startlon.value == 0 || f1.region[1].checked)) {
        document.getElementById("randompoint").rows = 2;
    } else {
        document.getElementById("randompoint").rows = 3;
    }
}

function calcStub() {
    timer = window.setTimeout("calculate()", 1);
    clearRandomPoint();
    document.getElementById("randompointlabel").innerHTML = "Calculating...";
}

function calculate() {
    var array1 = new Array();
    var lat = 0;
    var lon = 0;
    var p = trim(f1.points.value);
    with (Math) {
        if (parseInt(p) != p || p < 1) {
            alert('The number of points is invalid');
            f1.points.focus();
            clearRandomPoint();
            return;
        }
        if (p > 2000) {
            alert('A maximum of 2000 points may be generated at a time');
            f1.points.focus();
            clearRandomPoint();
            return;
        }
        if (f1.region[0].checked) {
            // circular
            var startlat = latLonToDecimal(f1.startlat.value, 1, "latitude");
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
            startlon = latLonToDecimal(f1.startlon.value, 0, "longitude");
            if (startlon == -999) {
                f1.startlon.focus();
                clearRandomPoint();
                return;
            }
            gStartlon = startlon;
            startlon = rad(startlon);
            if (f1.distunits[1].checked) {
                var mx = circumKm;
                var radiusEarth = 6372.796924;
            } else {
                var mx = circumMiles;
                var radiusEarth = 3960.056052;
            }
            var maxdist = f1.maxdist.value;
            if (isNumeric(maxdist, 0, mx, false) == false) {
                alert("The max distance must be a valid number between 0 and " + mx);
                f1.maxdist.focus();
                clearRandomPoint();
                return;
            }
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
                if (!displayDist) {
                    array1.push("w" + decimalToDMS(lat, 1) + "x" + padZeroRight(lat) + "y" + decimalToDMS(lon, 0) + "z" + padZeroRight(lon) + "\n");
                } else {
                    array1.push("w" + decimalToDMS(lat, 1) + "x" + padZeroRight(lat) + "y" + decimalToDMS(lon, 0) + "z" + padZeroRight(lon) + "j" + dist + "q" + brg[j] + "\u00B0\n");
                }
            }

        } else {
            var northlimit = latLonToDecimal(f1.northlat.value, 1, "latitude north limit");
            if (northlimit == -999) {
                f1.northlat.focus();
                clearRandomPoint();
                return;
            }
            var southlimit = latLonToDecimal(f1.southlat.value, 1, "latitude south limit");
            if (southlimit == -999) {
                f1.southlat.focus();
                clearRandomPoint();
                return;
            }
            if (northlimit * 1 < 1 * southlimit) {
                alert('The latitude south limit must not be greater than the latitude north limit');
                f1.northlat.focus();
                clearRandomPoint();
                return;
            }
            var westlimit = latLonToDecimal(f1.westlon.value, 0, "longitude west limit");
            if (westlimit == -999) {
                f1.westlon.focus();
                clearRandomPoint();
                return;
            }
            var eastlimit = latLonToDecimal(f1.eastlon.value, 0, "longitude east limit");
            if (eastlimit == -999) {
                f1.eastlon.focus();
                clearRandomPoint();
                return;
            }
            gStartlat = (northlimit - southlimit) / 2 + 1 * southlimit;
            northlimit = rad(northlimit);
            southlimit = rad(southlimit);
            westlimit = rad(westlimit);
            eastlimit = rad(eastlimit);
            var sinsl = sin(southlimit);
            var width = eastlimit - westlimit;
            if (width < 0) {
                width = width + 2 * PI;
            }
            gStartlon = deg(normalizeLongitude(westlimit + width / 2));
            for (i = 0; i < p; i++) {
                lat = deg(asin(random() * (sin(northlimit) - sinsl) + sinsl));
                lon = deg(normalizeLongitude(westlimit + width * random()));
                array1.push("w" + decimalToDMS(lat, 1) + "x" + padZeroRight(lat) + "y" + decimalToDMS(lon, 0) + "z" + padZeroRight(lon) + "\n");
            }
        }
        gLatlon = array1.join("");
        displayResults(p);
    }
}

function latLonToDecimal(ll, lat, f) {
    var sChar;
    var decCoord;
    var array1 = new Array(10);
    var l;
    var fail;
    ll = trim(ll);
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

function padWithZero(s) {
    if (s < 10) {
        s = "0" + s;
    }
    return s;
}

function padZeroRight(s) {
    if (sigDigits > 8) {
        sigDigits = 8;
    } else if (sigDigits < 5) {
        sigDigits = 5;
    }
    s = "" + Math.round(s * Math.pow(10, sigDigits)) / Math.pow(10, sigDigits);
    var i = s.indexOf('.');
    var d = (s.length - i - 1);
    if (i == -1) {
        return (s + ".00");
    } else if (d == 1) {
        return (s + "0");
    } else {
        return s;
    }
}

function getSigDigits(s) {
    var sig = 0;
    var i = s.indexOf('.');
    if (i != -1) {
        sig = s.length - i - 1;
    }
    if (sig >= sigDigits) {
        if (sig > 8) {
            sigDigits = 8;
        } else {
            sigDigits = sig + 1;
        }
    }
}

function decimalToDMS(l, isLat) {
    var dir1 = "";
    if (isLat == 1) {
        if (l < 0) {
            dir1 = "S";
        } else {
            dir1 = "N";
        }
    } else {
        if (l < 0) {
            dir1 = "W";
        } else {
            dir1 = "E";
        }
    }
    l = Math.abs(Math.round(l * 3600) / 3600);
    var deg1 = Math.floor(l);
    var temp = (l - deg1) * 60;
    var min1 = padWithZero(Math.floor(temp));
    temp = (temp - min1);
    var sec1 = padWithZero(Math.round(temp * 60));
    if (sec1 == 60) {
        sec1 = 59;
    }
    return Math.abs(deg1) + '\u00B0' + min1 + '\u2032' + sec1 + '\u2033' + dir1;
}

function viewMap() {
    var p = gLatlon.split("\n");
    if (p.length > 1) {
        var circ = 0;
        if (f1.region[0].checked) {
            circ = 1;
        }
        var lat1 = gStartlat;
        var lon1 = gStartlon;
        var j, max;
        for (i = 0; i < p.length - 1; i++) {
            lat1 = lat1 + "|" + p[i].substring(p[i].indexOf("x") + 1, p[i].indexOf("y"));
            j = p[i].indexOf("j");
            if (j == -1) {
                lon1 = lon1 + "|" + p[i].substring(p[i].indexOf("z") + 1);
            } else {
                lon1 = lon1 + "|" + p[i].substring(p[i].indexOf("z") + 1, j);
            }
        }
        if (navigator.appName == "Microsoft Internet Explorer") {
            max = 2050;
        } else {
            max = 3950;
        }
        if (lat1.length + lon1.length < max) {
            var url = "viewmap.html?" + lat1 + "&" + lon1 + "&" + circ;
        } else {
            var url = "viewmap.php";
        }
        f1.target = "mapwin";
        mapwin = window.open(url, "mapwin", "menubar=1,toolbar=1,directories=1,location=1,status=1,resizable=1,scrollbars=1");
        if (url == "viewmap.php") {
            f1.data.value = lat1 + "&" + lon1 + "&" + circ;
            f1.submit();
        }
    } else {
        alert('You must calculate a random point before viewing a map');
    }
}

var recipient = "C" + "o" + "n" + "t" + "a" + "c" + "t"
var eml = "mailto:" + "&#100;&#101;" + "a" + "&#110;&#64;&#103;&#101;&#111;&#109;&#105;&#100;&#112;&#111;&#105;&#110;&#116;&#46;&#99;&#111;&#109;";

function e() {
    document.write('<a href=' + eml + '>' + recipient + '</a>');
}


google.setOnLoadCallback(initialize);
