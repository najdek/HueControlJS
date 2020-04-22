var hueUser = getBridge("username");
var hueIP = getBridge("ip");

var hueURL = "http://" + hueIP + "/api/" + hueUser;

//var hueLightsState;

function hueLightsGet() {
  var request = {};
  $.ajax({
        type: "GET",
        url: hueURL + "/lights/",
        datatype: "html",
        success: function(data) {
            console.log(data);
//            hueLightsState = data;
            hueLightsLoad(data);
        },
        error: function() {
            window.location.href = "setup.html";
        }
  });
}

function hueGroupsGet() {
  var request = {};
  $.ajax({
        type: "GET",
        url: hueURL + "/groups/",
        datatype: "html",
        success: function(data) {
            console.log(data);
//            hueLightsState = data;
            hueGroupsLoad(data);
        },
        error: function() {
            window.location.href = "setup.html";
        }
  });
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function hueLightSetBrightness(lightid, bri, transitiontime) {
  if (isNaN(parseInt(bri))) {
    console.log("error: Invalid brightness");
    return;
  }
  if (!isNumeric(bri)) {
    console.log("not numeric: " + bri);
    $.ajax({
          type: "GET",
          url: hueURL + "/lights/" + lightid + "/",
          datatype: "html",
          success: function(data) {
              lastBri = data.state.bri;
              newBri = lastBri + parseInt(bri);
              if (newBri > 254) {
                newBri = 254;
              } else if (newBri < 0) {
                newBri = 0;
              }
              hueLightSetBrightness(lightid, newBri, transitiontime);
          },
          error: function() {
              window.location.href = "setup.html";
          }
    });
  }

  var request = {"bri": bri, "transitiontime": transitiontime};
  for (var i = 0; i < lightid.length; i++) {
    $.ajax({
        type: "PUT",
        url: hueURL + "/lights/" + lightid[i] + "/state",
        data: JSON.stringify(request),
        datatype: "html",
        success: function(data) {
            console.log(data);
            hueLightsGet();
            hueGroupsGet();
        },
        error: function() {
            window.location.href = "setup.html";
        }
    });
  }
}

function hueLightToggle(lightid, on) {
  var request = {"on": on};
  for (var i = 0; i < lightid.length; i++) {
    $.ajax({
        type: "PUT",
        url: hueURL + "/lights/" + lightid[i] + "/state",
        data: JSON.stringify(request),
        datatype: "html",
        success: function(data) {
            console.log(data);
            hueLightsGet();
            hueGroupsGet();
        },
        error: function() {
            window.location.href = "setup.html";
        }
    });
  }
}


function hueLightSetXY(lightid, on, bri, x, y, transitiontime) {
  for (var i = 0; i < lightid.length; i++) {
    var request = {"on": on, "bri": bri, "xy": [x, y], "transitiontime": transitiontime};
    $.ajax({
        type: "PUT",
        url: hueURL + "/lights/" + lightid[i] + "/state",
        data: JSON.stringify(request),
        datatype: "html",
        success: function(data) {
            console.log(data);
            hueLightsGet();
            hueGroupsGet();
        },
        error: function() {
            window.location.href = "setup.html";
        }
    });
  }
}

function hueLightSetColor(lightid, on, bri, hue, sat, transitiontime) {
  for (var i = 0; i < lightid.length; i++) {
    var request = {"on": on, "bri": bri, "hue": hue, "sat": sat, "transitiontime": transitiontime};
    $.ajax({
        type: "PUT",
        url: hueURL + "/lights/" + lightid[i] + "/state",
        data: JSON.stringify(request),
        datatype: "html",
        success: function(data) {
            console.log(data);
            hueLightsGet();
            hueGroupsGet();
        },
        error: function() {
            window.location.href = "setup.html";
        }
    });
  }
}

function hueLightSetWhite(lightid, on, bri, ct, transitiontime) {
  for (var i = 0; i < lightid.length; i++) {
    var request = {"on": on, "bri": bri, "ct": ct, "transitiontime": transitiontime};
    $.ajax({
        type: "PUT",
        url: hueURL + "/lights/" + lightid[i] + "/state",
        data: JSON.stringify(request),
        datatype: "html",
        success: function(data) {
            console.log(data);
            hueLightsGet();
            hueGroupsGet();
        },
        error: function() {
            window.location.href = "setup.html";
        }
    });
  }
}



function xyBriToRgb(x, y, bri)
{
    if (x == 0) {
      x = 0.001;
    }
    if (y == 0) {
      y = 0.001;
    }
    z = 1.0 - x - y;

    Y = 255; // brightness
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r,g,b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;//   if (r < 0) { r = 255 };
    g = g * 255;//   if (g < 0) { g = 255 };
    b = b * 255;//   if (b < 0) { b = 255 };
    if (r > 0) {} else { r = 0 };
    if (g > 0) {} else { g = 0 };
    if (b > 0) {} else { b = 0 };

    return rgbToHex(Math.round(r),Math.round(g),Math.round(b));
}

function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hsvToRgb(h, s) {
    h = h / 65535;
    s = s / 254;
    v = 1;
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));

}


function hexToHs (hex) {

    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;


    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 65535),
        s: Math.round(s * 254)
//        v: Math.round(v * 254)
    };
}

function lightOrDark(color) {

  color = +("0x" + color.replace(
  color.length < 5 && /./g, '$&$&'));

  r = color >> 16;
  g = color >> 8 & 255;
  b = color & 255;

  hsp = Math.sqrt(
  0.299 * (r * r) +
  0.587 * (g * g) +
  0.114 * (b * b)
  );

  if (hsp>150) {
    return 'light';
  }
  else {
    return 'dark';
  }
}



function getBridge(a) {
  data = getCookie("bridge").split("|");
  if (a == "ip") {
    return data[0];
  } else if (a == "id") {
    return data[1];
  } else if (a == "username") {
    return data[2];
  } else {
    return data;
  }
}


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

