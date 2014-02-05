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