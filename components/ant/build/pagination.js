/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8294:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "blue": () => (/* binding */ blue),
  "cyan": () => (/* binding */ cyan),
  "geekblue": () => (/* binding */ geekblue),
  "generate": () => (/* binding */ generate),
  "gold": () => (/* binding */ gold),
  "green": () => (/* binding */ green),
  "grey": () => (/* binding */ grey),
  "lime": () => (/* binding */ lime),
  "magenta": () => (/* binding */ magenta),
  "orange": () => (/* binding */ orange),
  "presetDarkPalettes": () => (/* binding */ presetDarkPalettes),
  "presetPalettes": () => (/* binding */ presetPalettes),
  "presetPrimaryColors": () => (/* binding */ presetPrimaryColors),
  "purple": () => (/* binding */ purple),
  "red": () => (/* binding */ red),
  "volcano": () => (/* binding */ volcano),
  "yellow": () => (/* binding */ yellow)
});

;// CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/util.js
/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
function util_bound01(n, max) {
  if (isOnePointZero(n)) {
    n = '100%';
  }

  var isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n))); // Automatically convert percentage into number

  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  } // Handle floating point rounding errors


  if (Math.abs(n - max) < 0.000001) {
    return 1;
  } // Convert into [0, 1] range if it isn't already


  if (max === 360) {
    // If n is a hue given in degrees,
    // wrap around out-of-range values into [0, 360] range
    // then convert into [0, 1].
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    // If n not a hue given in degrees
    // Convert into [0, 1] range if it isn't already.
    n = n % max / parseFloat(String(max));
  }

  return n;
}
/**
 * Force a number between 0 and 1
 * @hidden
 */

function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */

function isOnePointZero(n) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}
/**
 * Check to see if string passed in is a percentage
 * @hidden
 */

function isPercentage(n) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
}
/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */

function boundAlpha(a) {
  a = parseFloat(a);

  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }

  return a;
}
/**
 * Replace a decimal with it's percentage value
 * @hidden
 */

function convertToPercentage(n) {
  if (n <= 1) {
    return Number(n) * 100 + "%";
  }

  return n;
}
/**
 * Force a hex value to have 2 characters
 * @hidden
 */

function util_pad2(c) {
  return c.length === 1 ? '0' + c : String(c);
}
;// CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/conversion.js
 // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */

function rgbToRgb(r, g, b) {
  return {
    r: util_bound01(r, 255) * 255,
    g: util_bound01(g, 255) * 255,
    b: util_bound01(b, 255) * 255
  };
}
/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]
 */

function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var s = 0;
  var l = (max + min) / 2;

  if (max === min) {
    s = 0;
    h = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;

      default:
        break;
    }

    h /= 6;
  }

  return {
    h: h,
    s: s,
    l: l
  };
}

function hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }

  if (t > 1) {
    t -= 1;
  }

  if (t < 1 / 6) {
    return p + (q - p) * (6 * t);
  }

  if (t < 1 / 2) {
    return q;
  }

  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }

  return p;
}
/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */


function hslToRgb(h, s, l) {
  var r;
  var g;
  var b;
  h = util_bound01(h, 360);
  s = util_bound01(s, 100);
  l = util_bound01(l, 100);

  if (s === 0) {
    // achromatic
    g = l;
    b = l;
    r = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]
 */

function rgbToHsv(r, g, b) {
  r = util_bound01(r, 255);
  g = util_bound01(g, 255);
  b = util_bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var v = max;
  var d = max - min;
  var s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;

      default:
        break;
    }

    h /= 6;
  }

  return {
    h: h,
    s: s,
    v: v
  };
}
/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */

function hsvToRgb(h, s, v) {
  h = util_bound01(h, 360) * 6;
  s = util_bound01(s, 100);
  v = util_bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
/**
 * Converts an RGB color to hex
 *
 * Assumes r, g, and b are contained in the set [0, 255]
 * Returns a 3 or 6 character hex
 */

function rgbToHex(r, g, b, allow3Char) {
  var hex = [util_pad2(Math.round(r).toString(16)), util_pad2(Math.round(g).toString(16)), util_pad2(Math.round(b).toString(16))]; // Return a 3 character hex if possible

  if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }

  return hex.join('');
}
/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * Assumes r, g, b are contained in the set [0, 255] and
 * a in [0, 1]. Returns a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params

function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16)), pad2(convertDecimalToHex(a))]; // Return a 4 character hex if possible

  if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }

  return hex.join('');
}
/**
 * Converts an RGBA color to an ARGB Hex8 string
 * Rarely used, but required for "toFilter()"
 */

function rgbaToArgbHex(r, g, b, a) {
  var hex = [pad2(convertDecimalToHex(a)), pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  return hex.join('');
}
/** Converts a decimal to a hex value */

function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */

function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */

function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 0xff00) >> 8,
    b: color & 0xff
  };
}
;// CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
// https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json

/**
 * @hidden
 */
var names = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  goldenrod: '#daa520',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavenderblush: '#fff0f5',
  lavender: '#e6e6fa',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};
;// CONCATENATED MODULE: ./node_modules/@ctrl/tinycolor/dist/module/format-input.js



/**
 * Given a string or object, convert that input to RGB
 *
 * Possible string inputs:
 * ```
 * "red"
 * "#f00" or "f00"
 * "#ff0000" or "ff0000"
 * "#ff000000" or "ff000000"
 * "rgb 255 0 0" or "rgb (255, 0, 0)"
 * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
 * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
 * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
 * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
 * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
 * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
 * ```
 */

function inputToRGB(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;

  if (typeof color === 'string') {
    color = stringInputToObject(color);
  }

  if (typeof color === 'object') {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = 'hsv';
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = 'hsl';
    }

    if (Object.prototype.hasOwnProperty.call(color, 'a')) {
      a = color.a;
    }
  }

  a = boundAlpha(a);
  return {
    ok: ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a
  };
} // <http://www.w3.org/TR/css3-values/#integers>

var CSS_INTEGER = '[-\\+]?\\d+%?'; // <http://www.w3.org/TR/css3-values/#number-value>

var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?'; // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.

var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")"; // Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren

var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var matchers = {
  CSS_UNIT: new RegExp(CSS_UNIT),
  rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
  rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
  hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
  hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
  hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
  hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
 */

function stringInputToObject(color) {
  color = color.trim().toLowerCase();

  if (color.length === 0) {
    return false;
  }

  var named = false;

  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === 'transparent') {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: 'name'
    };
  } // Try to match string input using regular expressions.
  // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the tinycolor is initialized with string or object.


  var match = matchers.rgb.exec(color);

  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }

  match = matchers.rgba.exec(color);

  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }

  match = matchers.hsl.exec(color);

  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }

  match = matchers.hsla.exec(color);

  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }

  match = matchers.hsv.exec(color);

  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }

  match = matchers.hsva.exec(color);

  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }

  match = matchers.hex8.exec(color);

  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? 'name' : 'hex8'
    };
  }

  match = matchers.hex6.exec(color);

  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? 'name' : 'hex'
    };
  }

  match = matchers.hex4.exec(color);

  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? 'name' : 'hex8'
    };
  }

  match = matchers.hex3.exec(color);

  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? 'name' : 'hex'
    };
  }

  return false;
}
/**
 * Check to see if it looks like a CSS unit
 * (see `matchers` above for definition).
 */

function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/dist/index.esm.js

var hueStep = 2; // 色相阶梯

var saturationStep = 0.16; // 饱和度阶梯，浅色部分

var saturationStep2 = 0.05; // 饱和度阶梯，深色部分

var brightnessStep1 = 0.05; // 亮度阶梯，浅色部分

var brightnessStep2 = 0.15; // 亮度阶梯，深色部分

var lightColorCount = 5; // 浅色数量，主色上

var darkColorCount = 4; // 深色数量，主色下
// 暗色主题颜色映射关系表

var darkColorMap = [{
  index: 7,
  opacity: 0.15
}, {
  index: 6,
  opacity: 0.25
}, {
  index: 5,
  opacity: 0.3
}, {
  index: 5,
  opacity: 0.45
}, {
  index: 5,
  opacity: 0.65
}, {
  index: 5,
  opacity: 0.85
}, {
  index: 4,
  opacity: 0.9
}, {
  index: 3,
  opacity: 0.95
}, {
  index: 2,
  opacity: 0.97
}, {
  index: 1,
  opacity: 0.98
}]; // Wrapper function ported from TinyColor.prototype.toHsv
// Keep it here because of `hsv.h * 360`

function toHsv(_ref) {
  var r = _ref.r,
      g = _ref.g,
      b = _ref.b;
  var hsv = rgbToHsv(r, g, b);
  return {
    h: hsv.h * 360,
    s: hsv.s,
    v: hsv.v
  };
} // Wrapper function ported from TinyColor.prototype.toHexString
// Keep it here because of the prefix `#`


function toHex(_ref2) {
  var r = _ref2.r,
      g = _ref2.g,
      b = _ref2.b;
  return "#".concat(rgbToHex(r, g, b, false));
} // Wrapper function ported from TinyColor.prototype.mix, not treeshakable.
// Amount in range [0, 1]
// Assume color1 & color2 has no alpha, since the following src code did so.


function mix(rgb1, rgb2, amount) {
  var p = amount / 100;
  var rgb = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b
  };
  return rgb;
}

function getHue(hsv, i, light) {
  var hue; // 根据色相不同，色相转向不同

  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }

  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }

  return hue;
}

function getSaturation(hsv, i, light) {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }

  var saturation;

  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  } // 边界值修正


  if (saturation > 1) {
    saturation = 1;
  } // 第一格的 s 限制在 0.06-0.1 之间


  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1;
  }

  if (saturation < 0.06) {
    saturation = 0.06;
  }

  return Number(saturation.toFixed(2));
}

function getValue(hsv, i, light) {
  var value;

  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }

  if (value > 1) {
    value = 1;
  }

  return Number(value.toFixed(2));
}

function generate(color) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var patterns = [];
  var pColor = inputToRGB(color);

  for (var i = lightColorCount; i > 0; i -= 1) {
    var hsv = toHsv(pColor);
    var colorString = toHex(inputToRGB({
      h: getHue(hsv, i, true),
      s: getSaturation(hsv, i, true),
      v: getValue(hsv, i, true)
    }));
    patterns.push(colorString);
  }

  patterns.push(toHex(pColor));

  for (var _i = 1; _i <= darkColorCount; _i += 1) {
    var _hsv = toHsv(pColor);

    var _colorString = toHex(inputToRGB({
      h: getHue(_hsv, _i),
      s: getSaturation(_hsv, _i),
      v: getValue(_hsv, _i)
    }));

    patterns.push(_colorString);
  } // dark theme patterns


  if (opts.theme === 'dark') {
    return darkColorMap.map(function (_ref3) {
      var index = _ref3.index,
          opacity = _ref3.opacity;
      var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || '#141414'), inputToRGB(patterns[index]), opacity * 100));
      return darkColorString;
    });
  }

  return patterns;
}

var presetPrimaryColors = {
  red: '#F5222D',
  volcano: '#FA541C',
  orange: '#FA8C16',
  gold: '#FAAD14',
  yellow: '#FADB14',
  lime: '#A0D911',
  green: '#52C41A',
  cyan: '#13C2C2',
  blue: '#1890FF',
  geekblue: '#2F54EB',
  purple: '#722ED1',
  magenta: '#EB2F96',
  grey: '#666666'
};
var presetPalettes = {};
var presetDarkPalettes = {};
Object.keys(presetPrimaryColors).forEach(function (key) {
  presetPalettes[key] = generate(presetPrimaryColors[key]);
  presetPalettes[key].primary = presetPalettes[key][5]; // dark presetPalettes

  presetDarkPalettes[key] = generate(presetPrimaryColors[key], {
    theme: 'dark',
    backgroundColor: '#141414'
  });
  presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
});
var red = presetPalettes.red;
var volcano = presetPalettes.volcano;
var gold = presetPalettes.gold;
var orange = presetPalettes.orange;
var yellow = presetPalettes.yellow;
var lime = presetPalettes.lime;
var green = presetPalettes.green;
var cyan = presetPalettes.cyan;
var blue = presetPalettes.blue;
var geekblue = presetPalettes.geekblue;
var purple = presetPalettes.purple;
var magenta = presetPalettes.magenta;
var grey = presetPalettes.grey;


/***/ }),

/***/ 9886:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var CheckCircleFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
      }
    }]
  },
  "name": "check-circle",
  "theme": "filled"
};
exports.default = CheckCircleFilled;

/***/ }),

/***/ 1657:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var CheckCircleOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"
      }
    }, {
      "tag": "path",
      "attrs": {
        "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
      }
    }]
  },
  "name": "check-circle",
  "theme": "outlined"
};
exports.default = CheckCircleOutlined;

/***/ }),

/***/ 8187:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var CheckOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
      }
    }]
  },
  "name": "check",
  "theme": "outlined"
};
exports.default = CheckOutlined;

/***/ }),

/***/ 8923:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var CloseCircleFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
      }
    }]
  },
  "name": "close-circle",
  "theme": "filled"
};
exports.default = CloseCircleFilled;

/***/ }),

/***/ 2716:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var CloseCircleOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"
      }
    }, {
      "tag": "path",
      "attrs": {
        "d": "M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
      }
    }]
  },
  "name": "close-circle",
  "theme": "outlined"
};
exports.default = CloseCircleOutlined;

/***/ }),

/***/ 8811:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var CloseOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
      }
    }]
  },
  "name": "close",
  "theme": "outlined"
};
exports.default = CloseOutlined;

/***/ }),

/***/ 3104:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var DoubleLeftOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"
      }
    }]
  },
  "name": "double-left",
  "theme": "outlined"
};
exports.default = DoubleLeftOutlined;

/***/ }),

/***/ 93:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var DoubleRightOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"
      }
    }]
  },
  "name": "double-right",
  "theme": "outlined"
};
exports.default = DoubleRightOutlined;

/***/ }),

/***/ 1730:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var DownOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
      }
    }]
  },
  "name": "down",
  "theme": "outlined"
};
exports.default = DownOutlined;

/***/ }),

/***/ 9996:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var ExclamationCircleFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
      }
    }]
  },
  "name": "exclamation-circle",
  "theme": "filled"
};
exports.default = ExclamationCircleFilled;

/***/ }),

/***/ 5757:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var ExclamationCircleOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
      }
    }, {
      "tag": "path",
      "attrs": {
        "d": "M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"
      }
    }]
  },
  "name": "exclamation-circle",
  "theme": "outlined"
};
exports.default = ExclamationCircleOutlined;

/***/ }),

/***/ 5453:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var InfoCircleFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
      }
    }]
  },
  "name": "info-circle",
  "theme": "filled"
};
exports.default = InfoCircleFilled;

/***/ }),

/***/ 9090:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var InfoCircleOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
      }
    }, {
      "tag": "path",
      "attrs": {
        "d": "M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
      }
    }]
  },
  "name": "info-circle",
  "theme": "outlined"
};
exports.default = InfoCircleOutlined;

/***/ }),

/***/ 4508:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var LeftOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
      }
    }]
  },
  "name": "left",
  "theme": "outlined"
};
exports.default = LeftOutlined;

/***/ }),

/***/ 6390:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var LoadingOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "0 0 1024 1024",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
      }
    }]
  },
  "name": "loading",
  "theme": "outlined"
};
exports.default = LoadingOutlined;

/***/ }),

/***/ 2623:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var RightOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
      }
    }]
  },
  "name": "right",
  "theme": "outlined"
};
exports.default = RightOutlined;

/***/ }),

/***/ 3919:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
 // This icon file is generated automatically.

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var SearchOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
      }
    }]
  },
  "name": "search",
  "theme": "outlined"
};
exports.default = SearchOutlined;

/***/ }),

/***/ 2692:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _CheckCircleFilled = _interopRequireDefault(__webpack_require__(4644));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _CheckCircleFilled;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 7129:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _CheckCircleOutlined = _interopRequireDefault(__webpack_require__(539));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _CheckCircleOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 4462:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _CheckOutlined = _interopRequireDefault(__webpack_require__(3385));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _CheckOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 6617:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _CloseCircleFilled = _interopRequireDefault(__webpack_require__(4283));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _CloseCircleFilled;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 200:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _CloseCircleOutlined = _interopRequireDefault(__webpack_require__(4692));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _CloseCircleOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 8774:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _CloseOutlined = _interopRequireDefault(__webpack_require__(4076));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _CloseOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 3731:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _DoubleLeftOutlined = _interopRequireDefault(__webpack_require__(517));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _DoubleLeftOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 1431:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _DoubleRightOutlined = _interopRequireDefault(__webpack_require__(6313));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _DoubleRightOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 3055:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _DownOutlined = _interopRequireDefault(__webpack_require__(542));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _DownOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 1817:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _ExclamationCircleFilled = _interopRequireDefault(__webpack_require__(5630));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _ExclamationCircleFilled;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 2010:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _ExclamationCircleOutlined = _interopRequireDefault(__webpack_require__(960));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _ExclamationCircleOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 1753:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _InfoCircleFilled = _interopRequireDefault(__webpack_require__(6463));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _InfoCircleFilled;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 8425:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _InfoCircleOutlined = _interopRequireDefault(__webpack_require__(396));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _InfoCircleOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 5338:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _LeftOutlined = _interopRequireDefault(__webpack_require__(2511));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _LeftOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 1610:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _LoadingOutlined = _interopRequireDefault(__webpack_require__(4585));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _LoadingOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 2084:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _RightOutlined = _interopRequireDefault(__webpack_require__(769));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _RightOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 4210:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _SearchOutlined = _interopRequireDefault(__webpack_require__(1501));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var _default = _SearchOutlined;
exports.default = _default;
module.exports = _default;

/***/ }),

/***/ 7553:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireWildcard = __webpack_require__(2579);

var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(9855));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(6546));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _classnames = _interopRequireDefault(__webpack_require__(7855));

var _Context = _interopRequireDefault(__webpack_require__(5008));

var _IconBase = _interopRequireDefault(__webpack_require__(2861));

var _twoTonePrimaryColor = __webpack_require__(3201);

var _utils = __webpack_require__(4024); // Initial setting
// should move it to antd main repo?


(0, _twoTonePrimaryColor.setTwoToneColor)('#1890ff');
var Icon = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _classNames;

  var className = props.className,
      icon = props.icon,
      spin = props.spin,
      rotate = props.rotate,
      tabIndex = props.tabIndex,
      onClick = props.onClick,
      twoToneColor = props.twoToneColor,
      restProps = (0, _objectWithoutProperties2.default)(props, ["className", "icon", "spin", "rotate", "tabIndex", "onClick", "twoToneColor"]);

  var _React$useContext = React.useContext(_Context.default),
      _React$useContext$pre = _React$useContext.prefixCls,
      prefixCls = _React$useContext$pre === void 0 ? 'anticon' : _React$useContext$pre;

  var classString = (0, _classnames.default)(prefixCls, (_classNames = {}, (0, _defineProperty2.default)(_classNames, "".concat(prefixCls, "-").concat(icon.name), !!icon.name), (0, _defineProperty2.default)(_classNames, "".concat(prefixCls, "-spin"), !!spin || icon.name === 'loading'), _classNames), className);
  var iconTabIndex = tabIndex;

  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
  }

  var svgStyle = rotate ? {
    msTransform: "rotate(".concat(rotate, "deg)"),
    transform: "rotate(".concat(rotate, "deg)")
  } : undefined;

  var _normalizeTwoToneColo = (0, _utils.normalizeTwoToneColors)(twoToneColor),
      _normalizeTwoToneColo2 = (0, _slicedToArray2.default)(_normalizeTwoToneColo, 2),
      primaryColor = _normalizeTwoToneColo2[0],
      secondaryColor = _normalizeTwoToneColo2[1];

  return /*#__PURE__*/React.createElement("span", Object.assign({
    role: "img",
    "aria-label": icon.name
  }, restProps, {
    ref: ref,
    tabIndex: iconTabIndex,
    onClick: onClick,
    className: classString
  }), /*#__PURE__*/React.createElement(_IconBase.default, {
    icon: icon,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    style: svgStyle
  }));
});
Icon.displayName = 'AntdIcon';
Icon.getTwoToneColor = _twoTonePrimaryColor.getTwoToneColor;
Icon.setTwoToneColor = _twoTonePrimaryColor.setTwoToneColor;
var _default = Icon;
exports.default = _default;

/***/ }),

/***/ 5008:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _react = __webpack_require__(3804);

var IconContext = /*#__PURE__*/(0, _react.createContext)({});
var _default = IconContext;
exports.default = _default;

/***/ }),

/***/ 2861:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(6546));

var _objectSpread2 = _interopRequireDefault(__webpack_require__(6928));

var _utils = __webpack_require__(4024);

var twoToneColorPalette = {
  primaryColor: '#333',
  secondaryColor: '#E6E6E6',
  calculated: false
};

function setTwoToneColors(_ref) {
  var primaryColor = _ref.primaryColor,
      secondaryColor = _ref.secondaryColor;
  twoToneColorPalette.primaryColor = primaryColor;
  twoToneColorPalette.secondaryColor = secondaryColor || (0, _utils.getSecondaryColor)(primaryColor);
  twoToneColorPalette.calculated = !!secondaryColor;
}

function getTwoToneColors() {
  return (0, _objectSpread2.default)({}, twoToneColorPalette);
}

var IconBase = function IconBase(props) {
  var icon = props.icon,
      className = props.className,
      onClick = props.onClick,
      style = props.style,
      primaryColor = props.primaryColor,
      secondaryColor = props.secondaryColor,
      restProps = (0, _objectWithoutProperties2.default)(props, ["icon", "className", "onClick", "style", "primaryColor", "secondaryColor"]);
  var colors = twoToneColorPalette;

  if (primaryColor) {
    colors = {
      primaryColor: primaryColor,
      secondaryColor: secondaryColor || (0, _utils.getSecondaryColor)(primaryColor)
    };
  }

  (0, _utils.useInsertStyles)();
  (0, _utils.warning)((0, _utils.isIconDefinition)(icon), "icon should be icon definiton, but got ".concat(icon));

  if (!(0, _utils.isIconDefinition)(icon)) {
    return null;
  }

  var target = icon;

  if (target && typeof target.icon === 'function') {
    target = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, target), {}, {
      icon: target.icon(colors.primaryColor, colors.secondaryColor)
    });
  }

  return (0, _utils.generate)(target.icon, "svg-".concat(target.name), (0, _objectSpread2.default)({
    className: className,
    onClick: onClick,
    style: style,
    'data-icon': target.name,
    width: '1em',
    height: '1em',
    fill: 'currentColor',
    'aria-hidden': 'true'
  }, restProps));
};

IconBase.displayName = 'IconReact';
IconBase.getTwoToneColors = getTwoToneColors;
IconBase.setTwoToneColors = setTwoToneColors;
var _default = IconBase;
exports.default = _default;

/***/ }),

/***/ 3201:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setTwoToneColor = setTwoToneColor;
exports.getTwoToneColor = getTwoToneColor;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(9855));

var _IconBase = _interopRequireDefault(__webpack_require__(2861));

var _utils = __webpack_require__(4024);

function setTwoToneColor(twoToneColor) {
  var _normalizeTwoToneColo = (0, _utils.normalizeTwoToneColors)(twoToneColor),
      _normalizeTwoToneColo2 = (0, _slicedToArray2.default)(_normalizeTwoToneColo, 2),
      primaryColor = _normalizeTwoToneColo2[0],
      secondaryColor = _normalizeTwoToneColo2[1];

  return _IconBase.default.setTwoToneColors({
    primaryColor: primaryColor,
    secondaryColor: secondaryColor
  });
}

function getTwoToneColor() {
  var colors = _IconBase.default.getTwoToneColors();

  if (!colors.calculated) {
    return colors.primaryColor;
  }

  return [colors.primaryColor, colors.secondaryColor];
}

/***/ }),

/***/ 4644:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _CheckCircleFilled = _interopRequireDefault(__webpack_require__(9886));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var CheckCircleFilled = function CheckCircleFilled(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _CheckCircleFilled.default
  }));
};

CheckCircleFilled.displayName = 'CheckCircleFilled';

var _default = /*#__PURE__*/React.forwardRef(CheckCircleFilled);

exports.default = _default;

/***/ }),

/***/ 539:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _CheckCircleOutlined = _interopRequireDefault(__webpack_require__(1657));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var CheckCircleOutlined = function CheckCircleOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _CheckCircleOutlined.default
  }));
};

CheckCircleOutlined.displayName = 'CheckCircleOutlined';

var _default = /*#__PURE__*/React.forwardRef(CheckCircleOutlined);

exports.default = _default;

/***/ }),

/***/ 3385:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _CheckOutlined = _interopRequireDefault(__webpack_require__(8187));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var CheckOutlined = function CheckOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _CheckOutlined.default
  }));
};

CheckOutlined.displayName = 'CheckOutlined';

var _default = /*#__PURE__*/React.forwardRef(CheckOutlined);

exports.default = _default;

/***/ }),

/***/ 4283:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _CloseCircleFilled = _interopRequireDefault(__webpack_require__(8923));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var CloseCircleFilled = function CloseCircleFilled(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _CloseCircleFilled.default
  }));
};

CloseCircleFilled.displayName = 'CloseCircleFilled';

var _default = /*#__PURE__*/React.forwardRef(CloseCircleFilled);

exports.default = _default;

/***/ }),

/***/ 4692:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _CloseCircleOutlined = _interopRequireDefault(__webpack_require__(2716));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var CloseCircleOutlined = function CloseCircleOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _CloseCircleOutlined.default
  }));
};

CloseCircleOutlined.displayName = 'CloseCircleOutlined';

var _default = /*#__PURE__*/React.forwardRef(CloseCircleOutlined);

exports.default = _default;

/***/ }),

/***/ 4076:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _CloseOutlined = _interopRequireDefault(__webpack_require__(8811));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var CloseOutlined = function CloseOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _CloseOutlined.default
  }));
};

CloseOutlined.displayName = 'CloseOutlined';

var _default = /*#__PURE__*/React.forwardRef(CloseOutlined);

exports.default = _default;

/***/ }),

/***/ 517:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _DoubleLeftOutlined = _interopRequireDefault(__webpack_require__(3104));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var DoubleLeftOutlined = function DoubleLeftOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _DoubleLeftOutlined.default
  }));
};

DoubleLeftOutlined.displayName = 'DoubleLeftOutlined';

var _default = /*#__PURE__*/React.forwardRef(DoubleLeftOutlined);

exports.default = _default;

/***/ }),

/***/ 6313:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _DoubleRightOutlined = _interopRequireDefault(__webpack_require__(93));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var DoubleRightOutlined = function DoubleRightOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _DoubleRightOutlined.default
  }));
};

DoubleRightOutlined.displayName = 'DoubleRightOutlined';

var _default = /*#__PURE__*/React.forwardRef(DoubleRightOutlined);

exports.default = _default;

/***/ }),

/***/ 542:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _DownOutlined = _interopRequireDefault(__webpack_require__(1730));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var DownOutlined = function DownOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _DownOutlined.default
  }));
};

DownOutlined.displayName = 'DownOutlined';

var _default = /*#__PURE__*/React.forwardRef(DownOutlined);

exports.default = _default;

/***/ }),

/***/ 5630:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _ExclamationCircleFilled = _interopRequireDefault(__webpack_require__(9996));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var ExclamationCircleFilled = function ExclamationCircleFilled(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _ExclamationCircleFilled.default
  }));
};

ExclamationCircleFilled.displayName = 'ExclamationCircleFilled';

var _default = /*#__PURE__*/React.forwardRef(ExclamationCircleFilled);

exports.default = _default;

/***/ }),

/***/ 960:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _ExclamationCircleOutlined = _interopRequireDefault(__webpack_require__(5757));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var ExclamationCircleOutlined = function ExclamationCircleOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _ExclamationCircleOutlined.default
  }));
};

ExclamationCircleOutlined.displayName = 'ExclamationCircleOutlined';

var _default = /*#__PURE__*/React.forwardRef(ExclamationCircleOutlined);

exports.default = _default;

/***/ }),

/***/ 6463:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _InfoCircleFilled = _interopRequireDefault(__webpack_require__(5453));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var InfoCircleFilled = function InfoCircleFilled(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _InfoCircleFilled.default
  }));
};

InfoCircleFilled.displayName = 'InfoCircleFilled';

var _default = /*#__PURE__*/React.forwardRef(InfoCircleFilled);

exports.default = _default;

/***/ }),

/***/ 396:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _InfoCircleOutlined = _interopRequireDefault(__webpack_require__(9090));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var InfoCircleOutlined = function InfoCircleOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _InfoCircleOutlined.default
  }));
};

InfoCircleOutlined.displayName = 'InfoCircleOutlined';

var _default = /*#__PURE__*/React.forwardRef(InfoCircleOutlined);

exports.default = _default;

/***/ }),

/***/ 2511:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _LeftOutlined = _interopRequireDefault(__webpack_require__(4508));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var LeftOutlined = function LeftOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _LeftOutlined.default
  }));
};

LeftOutlined.displayName = 'LeftOutlined';

var _default = /*#__PURE__*/React.forwardRef(LeftOutlined);

exports.default = _default;

/***/ }),

/***/ 4585:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _LoadingOutlined = _interopRequireDefault(__webpack_require__(6390));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var LoadingOutlined = function LoadingOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _LoadingOutlined.default
  }));
};

LoadingOutlined.displayName = 'LoadingOutlined';

var _default = /*#__PURE__*/React.forwardRef(LoadingOutlined);

exports.default = _default;

/***/ }),

/***/ 769:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _RightOutlined = _interopRequireDefault(__webpack_require__(2623));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var RightOutlined = function RightOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _RightOutlined.default
  }));
};

RightOutlined.displayName = 'RightOutlined';

var _default = /*#__PURE__*/React.forwardRef(RightOutlined);

exports.default = _default;

/***/ }),

/***/ 1501:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _SearchOutlined = _interopRequireDefault(__webpack_require__(3919));

var _AntdIcon = _interopRequireDefault(__webpack_require__(7553)); // GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY


var SearchOutlined = function SearchOutlined(props, ref) {
  return /*#__PURE__*/React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _SearchOutlined.default
  }));
};

SearchOutlined.displayName = 'SearchOutlined';

var _default = /*#__PURE__*/React.forwardRef(SearchOutlined);

exports.default = _default;

/***/ }),

/***/ 4024:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireWildcard = __webpack_require__(2579);

var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.warning = warning;
exports.isIconDefinition = isIconDefinition;
exports.normalizeAttrs = normalizeAttrs;
exports.generate = generate;
exports.getSecondaryColor = getSecondaryColor;
exports.normalizeTwoToneColors = normalizeTwoToneColors;
exports.useInsertStyles = exports.iconStyles = exports.svgBaseProps = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__(6928));

var _typeof2 = _interopRequireDefault(__webpack_require__(8705));

var _colors = __webpack_require__(8294);

var _react = _interopRequireWildcard(__webpack_require__(3804));

var _warning = _interopRequireDefault(__webpack_require__(9836));

var _dynamicCSS = __webpack_require__(4500);

var _Context = _interopRequireDefault(__webpack_require__(5008));

function warning(valid, message) {
  (0, _warning.default)(valid, "[@ant-design/icons] ".concat(message));
}

function isIconDefinition(target) {
  return (0, _typeof2.default)(target) === 'object' && typeof target.name === 'string' && typeof target.theme === 'string' && ((0, _typeof2.default)(target.icon) === 'object' || typeof target.icon === 'function');
}

function normalizeAttrs() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(attrs).reduce(function (acc, key) {
    var val = attrs[key];

    switch (key) {
      case 'class':
        acc.className = val;
        delete acc.class;
        break;

      default:
        acc[key] = val;
    }

    return acc;
  }, {});
}

function generate(node, key, rootProps) {
  if (!rootProps) {
    return /*#__PURE__*/_react.default.createElement(node.tag, (0, _objectSpread2.default)({
      key: key
    }, normalizeAttrs(node.attrs)), (node.children || []).map(function (child, index) {
      return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
    }));
  }

  return /*#__PURE__*/_react.default.createElement(node.tag, (0, _objectSpread2.default)((0, _objectSpread2.default)({
    key: key
  }, normalizeAttrs(node.attrs)), rootProps), (node.children || []).map(function (child, index) {
    return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
  }));
}

function getSecondaryColor(primaryColor) {
  // choose the second color
  return (0, _colors.generate)(primaryColor)[0];
}

function normalizeTwoToneColors(twoToneColor) {
  if (!twoToneColor) {
    return [];
  }

  return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
} // These props make sure that the SVG behaviours like general text.
// Reference: https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4


var svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false'
};
exports.svgBaseProps = svgBaseProps;
var iconStyles = "\n.anticon {\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
exports.iconStyles = iconStyles;

var useInsertStyles = function useInsertStyles() {
  var styleStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : iconStyles;

  var _useContext = (0, _react.useContext)(_Context.default),
      csp = _useContext.csp;

  (0, _react.useEffect)(function () {
    (0, _dynamicCSS.updateCSS)(styleStr, '@ant-design-icons', {
      prepend: true,
      csp: csp
    });
  }, []);
};

exports.useInsertStyles = useInsertStyles;

/***/ }),

/***/ 9968:
/***/ ((module) => {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 2079:
/***/ ((module) => {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 9813:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(9968);

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 2886:
/***/ ((module) => {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 7003:
/***/ ((module) => {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 9545:
/***/ ((module) => {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 1917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getPrototypeOf = __webpack_require__(8466);

var isNativeReflectConstruct = __webpack_require__(3280);

var possibleConstructorReturn = __webpack_require__(2082);

function _createSuper(Derived) {
  var hasNativeReflectConstruct = isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return possibleConstructorReturn(this, result);
  };
}

module.exports = _createSuper;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 3985:
/***/ ((module) => {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 4772:
/***/ ((module) => {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  module.exports.default = module.exports, module.exports.__esModule = true;
  return _extends.apply(this, arguments);
}

module.exports = _extends;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 8466:
/***/ ((module) => {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  module.exports.default = module.exports, module.exports.__esModule = true;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 5583:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(301);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 4541:
/***/ ((module) => {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 2579:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = __webpack_require__(8705).default;

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 3280:
/***/ ((module) => {

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = _isNativeReflectConstruct;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 7563:
/***/ ((module) => {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 2601:
/***/ ((module) => {

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 215:
/***/ ((module) => {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 2051:
/***/ ((module) => {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 6928:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(3985);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

module.exports = _objectSpread2;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 6546:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var objectWithoutPropertiesLoose = __webpack_require__(4912);

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 4912:
/***/ ((module) => {

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 2082:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = __webpack_require__(8705).default;

var assertThisInitialized = __webpack_require__(2886);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 301:
/***/ ((module) => {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  module.exports.default = module.exports, module.exports.__esModule = true;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 9855:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithHoles = __webpack_require__(2079);

var iterableToArrayLimit = __webpack_require__(2601);

var unsupportedIterableToArray = __webpack_require__(7670);

var nonIterableRest = __webpack_require__(215);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 27:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithoutHoles = __webpack_require__(9813);

var iterableToArray = __webpack_require__(7563);

var unsupportedIterableToArray = __webpack_require__(7670);

var nonIterableSpread = __webpack_require__(2051);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 8705:
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports.default = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports.default = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 7670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(9968);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 8627:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(2930);

/***/ }),

/***/ 6936:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "resetWarned", ({
  enumerable: true,
  get: function get() {
    return _warning.resetWarned;
  }
}));
exports.default = void 0;

var _warning = _interopRequireWildcard(__webpack_require__(9836));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var _default = function _default(valid, component, message) {
  (0, _warning["default"])(valid, "[antd: ".concat(component, "] ").concat(message));
};

exports.default = _default;

/***/ }),

/***/ 7901:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = exports.getTransitionName = void 0; // ================== Collapse Motion ==================

var getCollapsedHeight = function getCollapsedHeight() {
  return {
    height: 0,
    opacity: 0
  };
};

var getRealHeight = function getRealHeight(node) {
  return {
    height: node.scrollHeight,
    opacity: 1
  };
};

var getCurrentHeight = function getCurrentHeight(node) {
  return {
    height: node.offsetHeight
  };
};

var skipOpacityTransition = function skipOpacityTransition(_, event) {
  return (event === null || event === void 0 ? void 0 : event.deadline) === true || event.propertyName === 'height';
};

var collapseMotion = {
  motionName: 'ant-motion-collapse',
  onAppearStart: getCollapsedHeight,
  onEnterStart: getCollapsedHeight,
  onAppearActive: getRealHeight,
  onEnterActive: getRealHeight,
  onLeaveStart: getCurrentHeight,
  onLeaveActive: getCollapsedHeight,
  onAppearEnd: skipOpacityTransition,
  onEnterEnd: skipOpacityTransition,
  onLeaveEnd: skipOpacityTransition,
  motionDeadline: 500
};

var getTransitionName = function getTransitionName(rootPrefixCls, motion, transitionName) {
  if (transitionName !== undefined) {
    return transitionName;
  }

  return "".concat(rootPrefixCls, "-").concat(motion);
};

exports.getTransitionName = getTransitionName;
var _default = collapseMotion;
exports.default = _default;

/***/ }),

/***/ 4568:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = exports.responsiveMap = exports.responsiveArray = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var _extends3 = _interopRequireDefault(__webpack_require__(4772));

var responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
exports.responsiveArray = responsiveArray;
var responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};
exports.responsiveMap = responsiveMap;
var subscribers = new Map();
var subUid = -1;
var screens = {};
var responsiveObserve = {
  matchHandlers: {},
  dispatch: function dispatch(pointMap) {
    screens = pointMap;
    subscribers.forEach(function (func) {
      return func(screens);
    });
    return subscribers.size >= 1;
  },
  subscribe: function subscribe(func) {
    if (!subscribers.size) this.register();
    subUid += 1;
    subscribers.set(subUid, func);
    func(screens);
    return subUid;
  },
  unsubscribe: function unsubscribe(token) {
    subscribers["delete"](token);
    if (!subscribers.size) this.unregister();
  },
  unregister: function unregister() {
    var _this = this;

    Object.keys(responsiveMap).forEach(function (screen) {
      var matchMediaQuery = responsiveMap[screen];
      var handler = _this.matchHandlers[matchMediaQuery];
      handler === null || handler === void 0 ? void 0 : handler.mql.removeListener(handler === null || handler === void 0 ? void 0 : handler.listener);
    });
    subscribers.clear();
  },
  register: function register() {
    var _this2 = this;

    Object.keys(responsiveMap).forEach(function (screen) {
      var matchMediaQuery = responsiveMap[screen];

      var listener = function listener(_ref) {
        var matches = _ref.matches;

        _this2.dispatch((0, _extends3["default"])((0, _extends3["default"])({}, screens), (0, _defineProperty2["default"])({}, screen, matches)));
      };

      var mql = window.matchMedia(matchMediaQuery);
      mql.addListener(listener);
      _this2.matchHandlers[matchMediaQuery] = {
        mql: mql,
        listener: listener
      };
      listener(mql);
    });
  }
};
var _default = responsiveObserve;
exports.default = _default;

/***/ }),

/***/ 9708:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _en_US = _interopRequireDefault(__webpack_require__(3279));

var _default = _en_US["default"];
exports.default = _default;

/***/ }),

/***/ 2371:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = exports.SizeContextProvider = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var SizeContext = /*#__PURE__*/React.createContext(undefined);

var SizeContextProvider = function SizeContextProvider(_ref) {
  var children = _ref.children,
      size = _ref.size;
  return /*#__PURE__*/React.createElement(SizeContext.Consumer, null, function (originSize) {
    return /*#__PURE__*/React.createElement(SizeContext.Provider, {
      value: size || originSize
    }, children);
  });
};

exports.SizeContextProvider = SizeContextProvider;
var _default = SizeContext;
exports.default = _default;

/***/ }),

/***/ 7258:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.withConfigConsumer = withConfigConsumer;
exports.ConfigConsumer = exports.ConfigContext = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _renderEmpty = _interopRequireDefault(__webpack_require__(2341));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var defaultGetPrefixCls = function defaultGetPrefixCls(suffixCls, customizePrefixCls) {
  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? "ant-".concat(suffixCls) : 'ant';
};

var ConfigContext = /*#__PURE__*/React.createContext({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
  renderEmpty: _renderEmpty["default"]
});
exports.ConfigContext = ConfigContext;
var ConfigConsumer = ConfigContext.Consumer;
/** @deprecated Use hooks instead. This is a legacy function */

exports.ConfigConsumer = ConfigConsumer;

function withConfigConsumer(config) {
  return function withConfigConsumerFunc(Component) {
    // Wrap with ConfigConsumer. Since we need compatible with react 15, be care when using ref methods
    var SFC = function SFC(props) {
      return /*#__PURE__*/React.createElement(ConfigConsumer, null, function (configProps) {
        var basicPrefixCls = config.prefixCls;
        var getPrefixCls = configProps.getPrefixCls;
        var customizePrefixCls = props.prefixCls;
        var prefixCls = getPrefixCls(basicPrefixCls, customizePrefixCls);
        return /*#__PURE__*/React.createElement(Component, (0, _extends2["default"])({}, configProps, props, {
          prefixCls: prefixCls
        }));
      });
    };

    var cons = Component.constructor;
    var name = cons && cons.displayName || Component.name || 'Component';
    SFC.displayName = "withConfigConsumer(".concat(name, ")");
    return SFC;
  };
}

/***/ }),

/***/ 2774:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "ConfigConsumer", ({
  enumerable: true,
  get: function get() {
    return _context.ConfigConsumer;
  }
}));
Object.defineProperty(exports, "ConfigContext", ({
  enumerable: true,
  get: function get() {
    return _context.ConfigContext;
  }
}));
exports.default = exports.globalConfig = exports.defaultPrefixCls = exports.configConsumerProps = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _Context = _interopRequireDefault(__webpack_require__(5008));

var _rcFieldForm = __webpack_require__(3626);

var _useMemo = _interopRequireDefault(__webpack_require__(4750));

var _localeProvider = _interopRequireWildcard(__webpack_require__(3602));

var _LocaleReceiver = _interopRequireDefault(__webpack_require__(4601));

var _context = __webpack_require__(7258);

var _SizeContext = _interopRequireWildcard(__webpack_require__(2371));

var _message = _interopRequireDefault(__webpack_require__(6177));

var _notification = _interopRequireDefault(__webpack_require__(7395));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var configConsumerProps = ['getTargetContainer', 'getPopupContainer', 'rootPrefixCls', 'getPrefixCls', 'renderEmpty', 'csp', 'autoInsertSpaceInButton', 'locale', 'pageHeader']; // These props is used by `useContext` directly in sub component

exports.configConsumerProps = configConsumerProps;
var PASSED_PROPS = ['getTargetContainer', 'getPopupContainer', 'renderEmpty', 'pageHeader', 'input', 'form'];
var defaultPrefixCls = 'ant';
exports.defaultPrefixCls = defaultPrefixCls;
var globalPrefixCls;

var setGlobalConfig = function setGlobalConfig(params) {
  if (params.prefixCls !== undefined) {
    globalPrefixCls = params.prefixCls;
  }
};

function getGlobalPrefixCls() {
  return globalPrefixCls || defaultPrefixCls;
}

var globalConfig = function globalConfig() {
  return {
    getPrefixCls: function getPrefixCls(suffixCls, customizePrefixCls) {
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? "".concat(getGlobalPrefixCls(), "-").concat(suffixCls) : getGlobalPrefixCls();
    },
    getRootPrefixCls: function getRootPrefixCls(rootPrefixCls, customizePrefixCls) {
      // Customize rootPrefixCls is first priority
      if (rootPrefixCls) {
        return rootPrefixCls;
      } // If Global prefixCls provided, use this


      if (globalPrefixCls) {
        return globalPrefixCls;
      } // [Legacy] If customize prefixCls provided, we cut it to get the prefixCls


      if (customizePrefixCls && customizePrefixCls.includes('-')) {
        return customizePrefixCls.replace(/^(.*)-[^-]*$/, '$1');
      } // Fallback to default prefixCls


      return getGlobalPrefixCls();
    }
  };
};

exports.globalConfig = globalConfig;

var ProviderChildren = function ProviderChildren(props) {
  var children = props.children,
      csp = props.csp,
      autoInsertSpaceInButton = props.autoInsertSpaceInButton,
      form = props.form,
      locale = props.locale,
      componentSize = props.componentSize,
      direction = props.direction,
      space = props.space,
      virtual = props.virtual,
      dropdownMatchSelectWidth = props.dropdownMatchSelectWidth,
      legacyLocale = props.legacyLocale,
      parentContext = props.parentContext,
      iconPrefixCls = props.iconPrefixCls;
  var getPrefixCls = React.useCallback(function (suffixCls, customizePrefixCls) {
    var prefixCls = props.prefixCls;
    if (customizePrefixCls) return customizePrefixCls;
    var mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');
    return suffixCls ? "".concat(mergedPrefixCls, "-").concat(suffixCls) : mergedPrefixCls;
  }, [parentContext.getPrefixCls, props.prefixCls]);
  var config = (0, _extends2["default"])((0, _extends2["default"])({}, parentContext), {
    csp: csp,
    autoInsertSpaceInButton: autoInsertSpaceInButton,
    locale: locale || legacyLocale,
    direction: direction,
    space: space,
    virtual: virtual,
    dropdownMatchSelectWidth: dropdownMatchSelectWidth,
    getPrefixCls: getPrefixCls
  }); // Pass the props used by `useContext` directly with child component.
  // These props should merged into `config`.

  PASSED_PROPS.forEach(function (propName) {
    var propValue = props[propName];

    if (propValue) {
      config[propName] = propValue;
    }
  }); // https://github.com/ant-design/ant-design/issues/27617

  var memoedConfig = (0, _useMemo["default"])(function () {
    return config;
  }, config, function (prevConfig, currentConfig) {
    var prevKeys = Object.keys(prevConfig);
    var currentKeys = Object.keys(currentConfig);
    return prevKeys.length !== currentKeys.length || prevKeys.some(function (key) {
      return prevConfig[key] !== currentConfig[key];
    });
  });
  var memoIconContextValue = React.useMemo(function () {
    return {
      prefixCls: iconPrefixCls,
      csp: csp
    };
  }, [iconPrefixCls]);
  var childNode = children; // Additional Form provider

  var validateMessages = {};

  if (locale && locale.Form && locale.Form.defaultValidateMessages) {
    validateMessages = locale.Form.defaultValidateMessages;
  }

  if (form && form.validateMessages) {
    validateMessages = (0, _extends2["default"])((0, _extends2["default"])({}, validateMessages), form.validateMessages);
  }

  if (Object.keys(validateMessages).length > 0) {
    childNode = /*#__PURE__*/React.createElement(_rcFieldForm.FormProvider, {
      validateMessages: validateMessages
    }, children);
  }

  if (locale) {
    childNode = /*#__PURE__*/React.createElement(_localeProvider["default"], {
      locale: locale,
      _ANT_MARK__: _localeProvider.ANT_MARK
    }, childNode);
  }

  if (iconPrefixCls) {
    childNode = /*#__PURE__*/React.createElement(_Context["default"].Provider, {
      value: memoIconContextValue
    }, childNode);
  }

  if (componentSize) {
    childNode = /*#__PURE__*/React.createElement(_SizeContext.SizeContextProvider, {
      size: componentSize
    }, childNode);
  }

  return /*#__PURE__*/React.createElement(_context.ConfigContext.Provider, {
    value: memoedConfig
  }, childNode);
};

var ConfigProvider = function ConfigProvider(props) {
  React.useEffect(function () {
    if (props.direction) {
      _message["default"].config({
        rtl: props.direction === 'rtl'
      });

      _notification["default"].config({
        rtl: props.direction === 'rtl'
      });
    }
  }, [props.direction]);
  return /*#__PURE__*/React.createElement(_LocaleReceiver["default"], null, function (_, __, legacyLocale) {
    return /*#__PURE__*/React.createElement(_context.ConfigConsumer, null, function (context) {
      return /*#__PURE__*/React.createElement(ProviderChildren, (0, _extends2["default"])({
        parentContext: context,
        legacyLocale: legacyLocale
      }, props));
    });
  });
};
/** @private internal Usage. do not use in your production */


ConfigProvider.ConfigContext = _context.ConfigContext;
ConfigProvider.SizeContext = _SizeContext["default"];
ConfigProvider.config = setGlobalConfig;
var _default = ConfigProvider;
exports.default = _default;

/***/ }),

/***/ 2341:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _empty = _interopRequireDefault(__webpack_require__(9608));

var _ = __webpack_require__(2774);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var renderEmpty = function renderEmpty(componentName) {
  return /*#__PURE__*/React.createElement(_.ConfigConsumer, null, function (_ref) {
    var getPrefixCls = _ref.getPrefixCls;
    var prefix = getPrefixCls('empty');

    switch (componentName) {
      case 'Table':
      case 'List':
        return /*#__PURE__*/React.createElement(_empty["default"], {
          image: _empty["default"].PRESENTED_IMAGE_SIMPLE
        });

      case 'Select':
      case 'TreeSelect':
      case 'Cascader':
      case 'Transfer':
      case 'Mentions':
        return /*#__PURE__*/React.createElement(_empty["default"], {
          image: _empty["default"].PRESENTED_IMAGE_SIMPLE,
          className: "".concat(prefix, "-small")
        });

      default:
        return /*#__PURE__*/React.createElement(_empty["default"], null);
    }
  });
};

var _default = renderEmpty;
exports.default = _default;

/***/ }),

/***/ 3279:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _en_US = _interopRequireDefault(__webpack_require__(8235));

var _en_US2 = _interopRequireDefault(__webpack_require__(4924)); // Merge into a locale object


var locale = {
  lang: (0, _extends2["default"])({
    placeholder: 'Select date',
    yearPlaceholder: 'Select year',
    quarterPlaceholder: 'Select quarter',
    monthPlaceholder: 'Select month',
    weekPlaceholder: 'Select week',
    rangePlaceholder: ['Start date', 'End date'],
    rangeYearPlaceholder: ['Start year', 'End year'],
    rangeMonthPlaceholder: ['Start month', 'End month'],
    rangeWeekPlaceholder: ['Start week', 'End week']
  }, _en_US["default"]),
  timePickerLocale: (0, _extends2["default"])({}, _en_US2["default"])
}; // All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

var _default = locale;
exports.default = _default;

/***/ }),

/***/ 387:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _configProvider = __webpack_require__(2774);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var Empty = function Empty() {
  var _React$useContext = React.useContext(_configProvider.ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls;

  var prefixCls = getPrefixCls('empty-img-default');
  return /*#__PURE__*/React.createElement("svg", {
    className: prefixCls,
    width: "184",
    height: "152",
    viewBox: "0 0 184 152",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/React.createElement("g", {
    transform: "translate(24 31.67)"
  }, /*#__PURE__*/React.createElement("ellipse", {
    className: "".concat(prefixCls, "-ellipse"),
    cx: "67.797",
    cy: "106.89",
    rx: "67.797",
    ry: "12.668"
  }), /*#__PURE__*/React.createElement("path", {
    className: "".concat(prefixCls, "-path-1"),
    d: "M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "".concat(prefixCls, "-path-2"),
    d: "M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z",
    transform: "translate(13.56)"
  }), /*#__PURE__*/React.createElement("path", {
    className: "".concat(prefixCls, "-path-3"),
    d: "M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "".concat(prefixCls, "-path-4"),
    d: "M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
  })), /*#__PURE__*/React.createElement("path", {
    className: "".concat(prefixCls, "-path-5"),
    d: "M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
  }), /*#__PURE__*/React.createElement("g", {
    className: "".concat(prefixCls, "-g"),
    transform: "translate(149.65 15.383)"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "20.654",
    cy: "3.167",
    rx: "2.849",
    ry: "2.815"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"
  }))));
};

var _default = Empty;
exports.default = _default;

/***/ }),

/***/ 9608:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _classnames = _interopRequireDefault(__webpack_require__(7855));

var _configProvider = __webpack_require__(2774);

var _LocaleReceiver = _interopRequireDefault(__webpack_require__(4601));

var _empty = _interopRequireDefault(__webpack_require__(387));

var _simple = _interopRequireDefault(__webpack_require__(3869));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var defaultEmptyImg = /*#__PURE__*/React.createElement(_empty["default"], null);
var simpleEmptyImg = /*#__PURE__*/React.createElement(_simple["default"], null);

var Empty = function Empty(_a) {
  var className = _a.className,
      customizePrefixCls = _a.prefixCls,
      _a$image = _a.image,
      image = _a$image === void 0 ? defaultEmptyImg : _a$image,
      description = _a.description,
      children = _a.children,
      imageStyle = _a.imageStyle,
      restProps = __rest(_a, ["className", "prefixCls", "image", "description", "children", "imageStyle"]);

  var _React$useContext = React.useContext(_configProvider.ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction;

  return /*#__PURE__*/React.createElement(_LocaleReceiver["default"], {
    componentName: "Empty"
  }, function (locale) {
    var _classNames;

    var prefixCls = getPrefixCls('empty', customizePrefixCls);
    var des = typeof description !== 'undefined' ? description : locale.description;
    var alt = typeof des === 'string' ? des : 'empty';
    var imageNode = null;

    if (typeof image === 'string') {
      imageNode = /*#__PURE__*/React.createElement("img", {
        alt: alt,
        src: image
      });
    } else {
      imageNode = image;
    }

    return /*#__PURE__*/React.createElement("div", (0, _extends2["default"])({
      className: (0, _classnames["default"])(prefixCls, (_classNames = {}, (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-normal"), image === simpleEmptyImg), (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _classNames), className)
    }, restProps), /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-image"),
      style: imageStyle
    }, imageNode), des && /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-description")
    }, des), children && /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-footer")
    }, children));
  });
};

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;
var _default = Empty;
exports.default = _default;

/***/ }),

/***/ 3869:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _configProvider = __webpack_require__(2774);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var Simple = function Simple() {
  var _React$useContext = React.useContext(_configProvider.ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls;

  var prefixCls = getPrefixCls('empty-img-simple');
  return /*#__PURE__*/React.createElement("svg", {
    className: prefixCls,
    width: "64",
    height: "41",
    viewBox: "0 0 64 41",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("g", {
    transform: "translate(0 1)",
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/React.createElement("ellipse", {
    className: "".concat(prefixCls, "-ellipse"),
    cx: "32",
    cy: "33",
    rx: "32",
    ry: "7"
  }), /*#__PURE__*/React.createElement("g", {
    className: "".concat(prefixCls, "-g"),
    fillRule: "nonzero"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z",
    className: "".concat(prefixCls, "-path")
  }))));
};

var _default = Simple;
exports.default = _default;

/***/ }),

/***/ 2676:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(9855));

var _react = __webpack_require__(3804);

var _responsiveObserve = _interopRequireDefault(__webpack_require__(4568));

function useBreakpoint() {
  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      screens = _useState2[0],
      setScreens = _useState2[1];

  (0, _react.useEffect)(function () {
    var token = _responsiveObserve["default"].subscribe(function (supportScreens) {
      setScreens(supportScreens);
    });

    return function () {
      return _responsiveObserve["default"].unsubscribe(token);
    };
  }, []);
  return screens;
}

var _default = useBreakpoint;
exports.default = _default;

/***/ }),

/***/ 4601:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useLocaleReceiver = useLocaleReceiver;
exports.default = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(7003));

var _createClass2 = _interopRequireDefault(__webpack_require__(9545));

var _inherits2 = _interopRequireDefault(__webpack_require__(5583));

var _createSuper2 = _interopRequireDefault(__webpack_require__(1917));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _default = _interopRequireDefault(__webpack_require__(8814));

var _context = _interopRequireDefault(__webpack_require__(7126));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var LocaleReceiver = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(LocaleReceiver, _React$Component);

  var _super = (0, _createSuper2["default"])(LocaleReceiver);

  function LocaleReceiver() {
    (0, _classCallCheck2["default"])(this, LocaleReceiver);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(LocaleReceiver, [{
    key: "getLocale",
    value: function getLocale() {
      var _this$props = this.props,
          componentName = _this$props.componentName,
          defaultLocale = _this$props.defaultLocale;
      var locale = defaultLocale || _default["default"][componentName !== null && componentName !== void 0 ? componentName : 'global'];
      var antLocale = this.context;
      var localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
      return (0, _extends2["default"])((0, _extends2["default"])({}, locale instanceof Function ? locale() : locale), localeFromContext || {});
    }
  }, {
    key: "getLocaleCode",
    value: function getLocaleCode() {
      var antLocale = this.context;
      var localeCode = antLocale && antLocale.locale; // Had use LocaleProvide but didn't set locale

      if (antLocale && antLocale.exist && !localeCode) {
        return _default["default"].locale;
      }

      return localeCode;
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children(this.getLocale(), this.getLocaleCode(), this.context);
    }
  }]);
  return LocaleReceiver;
}(React.Component);

exports.default = LocaleReceiver;
LocaleReceiver.defaultProps = {
  componentName: 'global'
};
LocaleReceiver.contextType = _context["default"];

function useLocaleReceiver(componentName, defaultLocale) {
  var antLocale = React.useContext(_context["default"]);
  var componentLocale = React.useMemo(function () {
    var locale = defaultLocale || _default["default"][componentName || 'global'];
    var localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
    return (0, _extends2["default"])((0, _extends2["default"])({}, typeof locale === 'function' ? locale() : locale), localeFromContext || {});
  }, [componentName, defaultLocale, antLocale]);
  return [componentLocale];
}

/***/ }),

/***/ 7126:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _react = __webpack_require__(3804);

var LocaleContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var _default = LocaleContext;
exports.default = _default;

/***/ }),

/***/ 8814:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _default2 = _interopRequireDefault(__webpack_require__(534));

var _default = _default2["default"];
exports.default = _default;

/***/ }),

/***/ 3602:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = exports.ANT_MARK = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(7003));

var _createClass2 = _interopRequireDefault(__webpack_require__(9545));

var _inherits2 = _interopRequireDefault(__webpack_require__(5583));

var _createSuper2 = _interopRequireDefault(__webpack_require__(1917));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _devWarning = _interopRequireDefault(__webpack_require__(6936));

var _locale = __webpack_require__(4799);

var _context = _interopRequireDefault(__webpack_require__(7126));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var ANT_MARK = 'internalMark';
exports.ANT_MARK = ANT_MARK;

var LocaleProvider = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(LocaleProvider, _React$Component);

  var _super = (0, _createSuper2["default"])(LocaleProvider);

  function LocaleProvider(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, LocaleProvider);
    _this = _super.call(this, props);
    (0, _locale.changeConfirmLocale)(props.locale && props.locale.Modal);
    (0, _devWarning["default"])(props._ANT_MARK__ === ANT_MARK, 'LocaleProvider', '`LocaleProvider` is deprecated. Please use `locale` with `ConfigProvider` instead: http://u.ant.design/locale');
    return _this;
  }

  (0, _createClass2["default"])(LocaleProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _locale.changeConfirmLocale)(this.props.locale && this.props.locale.Modal);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var locale = this.props.locale;

      if (prevProps.locale !== locale) {
        (0, _locale.changeConfirmLocale)(locale && locale.Modal);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, _locale.changeConfirmLocale)();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          locale = _this$props.locale,
          children = _this$props.children;
      return /*#__PURE__*/React.createElement(_context["default"].Provider, {
        value: (0, _extends2["default"])((0, _extends2["default"])({}, locale), {
          exist: true
        })
      }, children);
    }
  }]);
  return LocaleProvider;
}(React.Component);

exports.default = LocaleProvider;
LocaleProvider.defaultProps = {
  locale: {}
};

/***/ }),

/***/ 534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _en_US = _interopRequireDefault(__webpack_require__(671));

var _en_US2 = _interopRequireDefault(__webpack_require__(3279));

var _en_US3 = _interopRequireDefault(__webpack_require__(4924));

var _en_US4 = _interopRequireDefault(__webpack_require__(9708));
/* eslint-disable no-template-curly-in-string */


var typeTemplate = '${label} is not a valid ${type}';
var localeValues = {
  locale: 'en',
  Pagination: _en_US["default"],
  DatePicker: _en_US2["default"],
  TimePicker: _en_US3["default"],
  Calendar: _en_US4["default"],
  global: {
    placeholder: 'Please select'
  },
  Table: {
    filterTitle: 'Filter menu',
    filterConfirm: 'OK',
    filterReset: 'Reset',
    filterEmptyText: 'No filters',
    emptyText: 'No data',
    selectAll: 'Select current page',
    selectInvert: 'Invert current page',
    selectNone: 'Clear all data',
    selectionAll: 'Select all data',
    sortTitle: 'Sort',
    expand: 'Expand row',
    collapse: 'Collapse row',
    triggerDesc: 'Click to sort descending',
    triggerAsc: 'Click to sort ascending',
    cancelSort: 'Click to cancel sorting'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Cancel',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancel'
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Search here',
    itemUnit: 'item',
    itemsUnit: 'items',
    remove: 'Remove',
    selectCurrent: 'Select current page',
    removeCurrent: 'Remove current page',
    selectAll: 'Select all data',
    removeAll: 'Remove all data',
    selectInvert: 'Invert current page'
  },
  Upload: {
    uploading: 'Uploading...',
    removeFile: 'Remove file',
    uploadError: 'Upload error',
    previewFile: 'Preview file',
    downloadFile: 'Download file'
  },
  Empty: {
    description: 'No Data'
  },
  Icon: {
    icon: 'icon'
  },
  Text: {
    edit: 'Edit',
    copy: 'Copy',
    copied: 'Copied',
    expand: 'Expand'
  },
  PageHeader: {
    back: 'Back'
  },
  Form: {
    optional: '(optional)',
    defaultValidateMessages: {
      "default": 'Field validation error for ${label}',
      required: 'Please enter ${label}',
      "enum": '${label} must be one of [${enum}]',
      whitespace: '${label} cannot be a blank character',
      date: {
        format: '${label} date format is invalid',
        parse: '${label} cannot be converted to a date',
        invalid: '${label} is an invalid date'
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        "boolean": typeTemplate,
        integer: typeTemplate,
        "float": typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate
      },
      string: {
        len: '${label} must be ${len} characters',
        min: '${label} must be at least ${min} characters',
        max: '${label} must be up to ${max} characters',
        range: '${label} must be between ${min}-${max} characters'
      },
      number: {
        len: '${label} must be equal to ${len}',
        min: '${label} must be minimum ${min}',
        max: '${label} must be maximum ${max}',
        range: '${label} must be between ${min}-${max}'
      },
      array: {
        len: 'Must be ${len} ${label}',
        min: 'At least ${min} ${label}',
        max: 'At most ${max} ${label}',
        range: 'The amount of ${label} must be between ${min}-${max}'
      },
      pattern: {
        mismatch: '${label} does not match the pattern ${pattern}'
      }
    }
  },
  Image: {
    preview: 'Preview'
  }
};
var _default = localeValues;
exports.default = _default;

/***/ }),

/***/ 6698:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = createUseMessage;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(9855));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _useNotification = _interopRequireDefault(__webpack_require__(8157));

var _configProvider = __webpack_require__(2774);

var _ = __webpack_require__(6177);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function createUseMessage(getRcNotificationInstance, getRCNoticeProps) {
  var useMessage = function useMessage() {
    // We can only get content by render
    var getPrefixCls; // We create a proxy to handle delay created instance

    var innerInstance = null;
    var proxy = {
      add: function add(noticeProps, holderCallback) {
        innerInstance === null || innerInstance === void 0 ? void 0 : innerInstance.component.add(noticeProps, holderCallback);
      }
    };

    var _useRCNotification = (0, _useNotification["default"])(proxy),
        _useRCNotification2 = (0, _slicedToArray2["default"])(_useRCNotification, 2),
        hookNotify = _useRCNotification2[0],
        holder = _useRCNotification2[1];

    function notify(args) {
      var customizePrefixCls = args.prefixCls;
      var mergedPrefixCls = getPrefixCls('message', customizePrefixCls);
      var rootPrefixCls = getPrefixCls();
      var target = args.key || (0, _.getKeyThenIncreaseKey)();
      var closePromise = new Promise(function (resolve) {
        var callback = function callback() {
          if (typeof args.onClose === 'function') {
            args.onClose();
          }

          return resolve(true);
        };

        getRcNotificationInstance((0, _extends2["default"])((0, _extends2["default"])({}, args), {
          prefixCls: mergedPrefixCls,
          rootPrefixCls: rootPrefixCls
        }), function (_ref) {
          var prefixCls = _ref.prefixCls,
              instance = _ref.instance;
          innerInstance = instance;
          hookNotify(getRCNoticeProps((0, _extends2["default"])((0, _extends2["default"])({}, args), {
            key: target,
            onClose: callback
          }), prefixCls));
        });
      });

      var result = function result() {
        if (innerInstance) {
          innerInstance.removeNotice(target);
        }
      };

      result.then = function (filled, rejected) {
        return closePromise.then(filled, rejected);
      };

      result.promise = closePromise;
      return result;
    } // Fill functions


    var hookApiRef = React.useRef({});
    hookApiRef.current.open = notify;
    ['success', 'info', 'warning', 'error', 'loading'].forEach(function (type) {
      return (0, _.attachTypeApi)(hookApiRef.current, type);
    });
    return [hookApiRef.current, /*#__PURE__*/React.createElement(_configProvider.ConfigConsumer, {
      key: "holder"
    }, function (context) {
      getPrefixCls = context.getPrefixCls;
      return holder;
    })];
  };

  return useMessage;
}

/***/ }),

/***/ 6177:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getKeyThenIncreaseKey = getKeyThenIncreaseKey;
exports.attachTypeApi = attachTypeApi;
exports.default = exports.getInstance = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _classnames = _interopRequireDefault(__webpack_require__(7855));

var _rcNotification = _interopRequireDefault(__webpack_require__(5504));

var _LoadingOutlined = _interopRequireDefault(__webpack_require__(1610));

var _ExclamationCircleFilled = _interopRequireDefault(__webpack_require__(1817));

var _CloseCircleFilled = _interopRequireDefault(__webpack_require__(6617));

var _CheckCircleFilled = _interopRequireDefault(__webpack_require__(2692));

var _InfoCircleFilled = _interopRequireDefault(__webpack_require__(1753));

var _useMessage = _interopRequireDefault(__webpack_require__(6698));

var _configProvider = __webpack_require__(2774);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var messageInstance;
var defaultDuration = 3;
var defaultTop;
var key = 1;
var localPrefixCls = '';
var transitionName = 'move-up';
var hasTransitionName = false;
var getContainer;
var maxCount;
var rtl = false;

function getKeyThenIncreaseKey() {
  return key++;
}

function setMessageConfig(options) {
  if (options.top !== undefined) {
    defaultTop = options.top;
    messageInstance = null; // delete messageInstance for new defaultTop
  }

  if (options.duration !== undefined) {
    defaultDuration = options.duration;
  }

  if (options.prefixCls !== undefined) {
    localPrefixCls = options.prefixCls;
  }

  if (options.getContainer !== undefined) {
    getContainer = options.getContainer;
  }

  if (options.transitionName !== undefined) {
    transitionName = options.transitionName;
    messageInstance = null; // delete messageInstance for new transitionName

    hasTransitionName = true;
  }

  if (options.maxCount !== undefined) {
    maxCount = options.maxCount;
    messageInstance = null;
  }

  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
}

function getRCNotificationInstance(args, callback) {
  var customizePrefixCls = args.prefixCls;

  var _globalConfig = (0, _configProvider.globalConfig)(),
      getPrefixCls = _globalConfig.getPrefixCls,
      getRootPrefixCls = _globalConfig.getRootPrefixCls;

  var prefixCls = getPrefixCls('message', customizePrefixCls || localPrefixCls);
  var rootPrefixCls = getRootPrefixCls(args.rootPrefixCls, prefixCls);

  if (messageInstance) {
    callback({
      prefixCls: prefixCls,
      rootPrefixCls: rootPrefixCls,
      instance: messageInstance
    });
    return;
  }

  var instanceConfig = {
    prefixCls: prefixCls,
    transitionName: hasTransitionName ? transitionName : "".concat(rootPrefixCls, "-").concat(transitionName),
    style: {
      top: defaultTop
    },
    getContainer: getContainer,
    maxCount: maxCount
  };

  _rcNotification["default"].newInstance(instanceConfig, function (instance) {
    if (messageInstance) {
      callback({
        prefixCls: prefixCls,
        rootPrefixCls: rootPrefixCls,
        instance: messageInstance
      });
      return;
    }

    messageInstance = instance;

    if (false) {}

    callback({
      prefixCls: prefixCls,
      rootPrefixCls: rootPrefixCls,
      instance: instance
    });
  });
}

var typeToIcon = {
  info: _InfoCircleFilled["default"],
  success: _CheckCircleFilled["default"],
  error: _CloseCircleFilled["default"],
  warning: _ExclamationCircleFilled["default"],
  loading: _LoadingOutlined["default"]
};

function getRCNoticeProps(args, prefixCls) {
  var _classNames;

  var duration = args.duration !== undefined ? args.duration : defaultDuration;
  var IconComponent = typeToIcon[args.type];
  var messageClass = (0, _classnames["default"])("".concat(prefixCls, "-custom-content"), (_classNames = {}, (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-").concat(args.type), args.type), (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-rtl"), rtl === true), _classNames));
  return {
    key: args.key,
    duration: duration,
    style: args.style || {},
    className: args.className,
    content: /*#__PURE__*/React.createElement("div", {
      className: messageClass
    }, args.icon || IconComponent && /*#__PURE__*/React.createElement(IconComponent, null), /*#__PURE__*/React.createElement("span", null, args.content)),
    onClose: args.onClose,
    onClick: args.onClick
  };
}

function notice(args) {
  var target = args.key || key++;
  var closePromise = new Promise(function (resolve) {
    var callback = function callback() {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }

      return resolve(true);
    };

    getRCNotificationInstance(args, function (_ref) {
      var prefixCls = _ref.prefixCls,
          instance = _ref.instance;
      instance.notice(getRCNoticeProps((0, _extends2["default"])((0, _extends2["default"])({}, args), {
        key: target,
        onClose: callback
      }), prefixCls));
    });
  });

  var result = function result() {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };

  result.then = function (filled, rejected) {
    return closePromise.then(filled, rejected);
  };

  result.promise = closePromise;
  return result;
}

function isArgsProps(content) {
  return Object.prototype.toString.call(content) === '[object Object]' && !!content.content;
}

var api = {
  open: notice,
  config: setMessageConfig,
  destroy: function destroy(messageKey) {
    if (messageInstance) {
      if (messageKey) {
        var _messageInstance = messageInstance,
            removeNotice = _messageInstance.removeNotice;
        removeNotice(messageKey);
      } else {
        var _messageInstance2 = messageInstance,
            destroy = _messageInstance2.destroy;
        destroy();
        messageInstance = null;
      }
    }
  }
};

function attachTypeApi(originalApi, type) {
  originalApi[type] = function (content, duration, onClose) {
    if (isArgsProps(content)) {
      return originalApi.open((0, _extends2["default"])((0, _extends2["default"])({}, content), {
        type: type
      }));
    }

    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }

    return originalApi.open({
      content: content,
      duration: duration,
      type: type,
      onClose: onClose
    });
  };
}

['success', 'info', 'warning', 'error', 'loading'].forEach(function (type) {
  return attachTypeApi(api, type);
});
api.warn = api.warning;
api.useMessage = (0, _useMessage["default"])(getRCNotificationInstance, getRCNoticeProps);
/** @private test Only function. Not work on production */

var getInstance = function getInstance() {
  return  false ? 0 : null;
};

exports.getInstance = getInstance;
var _default = api;
exports.default = _default;

/***/ }),

/***/ 4799:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.changeConfirmLocale = changeConfirmLocale;
exports.getConfirmLocale = getConfirmLocale;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _default = _interopRequireDefault(__webpack_require__(534));

var runtimeLocale = (0, _extends2["default"])({}, _default["default"].Modal);

function changeConfirmLocale(newLocale) {
  if (newLocale) {
    runtimeLocale = (0, _extends2["default"])((0, _extends2["default"])({}, runtimeLocale), newLocale);
  } else {
    runtimeLocale = (0, _extends2["default"])({}, _default["default"].Modal);
  }
}

function getConfirmLocale() {
  return runtimeLocale;
}

/***/ }),

/***/ 1993:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = createUseNotification;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(9855));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _useNotification = _interopRequireDefault(__webpack_require__(8157));

var _configProvider = __webpack_require__(2774);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function createUseNotification(getNotificationInstance, getRCNoticeProps) {
  var useNotification = function useNotification() {
    // We can only get content by render
    var getPrefixCls; // We create a proxy to handle delay created instance

    var innerInstance = null;
    var proxy = {
      add: function add(noticeProps, holderCallback) {
        innerInstance === null || innerInstance === void 0 ? void 0 : innerInstance.component.add(noticeProps, holderCallback);
      }
    };

    var _useRCNotification = (0, _useNotification["default"])(proxy),
        _useRCNotification2 = (0, _slicedToArray2["default"])(_useRCNotification, 2),
        hookNotify = _useRCNotification2[0],
        holder = _useRCNotification2[1];

    function notify(args) {
      var customizePrefixCls = args.prefixCls;
      var mergedPrefixCls = getPrefixCls('notification', customizePrefixCls);
      getNotificationInstance((0, _extends2["default"])((0, _extends2["default"])({}, args), {
        prefixCls: mergedPrefixCls
      }), function (_ref) {
        var prefixCls = _ref.prefixCls,
            instance = _ref.instance;
        innerInstance = instance;
        hookNotify(getRCNoticeProps(args, prefixCls));
      });
    } // Fill functions


    var hookApiRef = React.useRef({});
    hookApiRef.current.open = notify;
    ['success', 'info', 'warning', 'error'].forEach(function (type) {
      hookApiRef.current[type] = function (args) {
        return hookApiRef.current.open((0, _extends2["default"])((0, _extends2["default"])({}, args), {
          type: type
        }));
      };
    });
    return [hookApiRef.current, /*#__PURE__*/React.createElement(_configProvider.ConfigConsumer, {
      key: "holder"
    }, function (context) {
      getPrefixCls = context.getPrefixCls;
      return holder;
    })];
  };

  return useNotification;
}

/***/ }),

/***/ 7395:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = exports.getInstance = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(8627));

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _rcNotification = _interopRequireDefault(__webpack_require__(5504));

var _CloseOutlined = _interopRequireDefault(__webpack_require__(8774));

var _classnames = _interopRequireDefault(__webpack_require__(7855));

var _CheckCircleOutlined = _interopRequireDefault(__webpack_require__(7129));

var _CloseCircleOutlined = _interopRequireDefault(__webpack_require__(200));

var _ExclamationCircleOutlined = _interopRequireDefault(__webpack_require__(2010));

var _InfoCircleOutlined = _interopRequireDefault(__webpack_require__(8425));

var _useNotification = _interopRequireDefault(__webpack_require__(1993));

var _configProvider = __webpack_require__(2774);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var notificationInstance = {};
var defaultDuration = 4.5;
var defaultTop = 24;
var defaultBottom = 24;
var defaultPrefixCls = '';
var defaultPlacement = 'topRight';
var defaultGetContainer;
var defaultCloseIcon;
var rtl = false;

function setNotificationConfig(options) {
  var duration = options.duration,
      placement = options.placement,
      bottom = options.bottom,
      top = options.top,
      getContainer = options.getContainer,
      closeIcon = options.closeIcon,
      prefixCls = options.prefixCls;

  if (prefixCls !== undefined) {
    defaultPrefixCls = prefixCls;
  }

  if (duration !== undefined) {
    defaultDuration = duration;
  }

  if (placement !== undefined) {
    defaultPlacement = placement;
  } else if (options.rtl) {
    defaultPlacement = 'topLeft';
  }

  if (bottom !== undefined) {
    defaultBottom = bottom;
  }

  if (top !== undefined) {
    defaultTop = top;
  }

  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }

  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }

  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
}

function getPlacementStyle(placement) {
  var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultTop;
  var bottom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultBottom;
  var style;

  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top: top,
        bottom: 'auto'
      };
      break;

    case 'topRight':
      style = {
        right: 0,
        top: top,
        bottom: 'auto'
      };
      break;

    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: bottom
      };
      break;

    default:
      style = {
        right: 0,
        top: 'auto',
        bottom: bottom
      };
      break;
  }

  return style;
}

function getNotificationInstance(args, callback) {
  var _args$placement = args.placement,
      placement = _args$placement === void 0 ? defaultPlacement : _args$placement,
      top = args.top,
      bottom = args.bottom,
      _args$getContainer = args.getContainer,
      getContainer = _args$getContainer === void 0 ? defaultGetContainer : _args$getContainer,
      _args$closeIcon = args.closeIcon,
      closeIcon = _args$closeIcon === void 0 ? defaultCloseIcon : _args$closeIcon,
      customizePrefixCls = args.prefixCls;

  var _globalConfig = (0, _configProvider.globalConfig)(),
      getPrefixCls = _globalConfig.getPrefixCls;

  var prefixCls = getPrefixCls('notification', customizePrefixCls || defaultPrefixCls);
  var cacheKey = "".concat(prefixCls, "-").concat(placement);
  var cacheInstance = notificationInstance[cacheKey];

  if (cacheInstance) {
    Promise.resolve(cacheInstance).then(function (instance) {
      callback({
        prefixCls: "".concat(prefixCls, "-notice"),
        instance: instance
      });
    });
    return;
  }

  var closeIconToRender = /*#__PURE__*/React.createElement("span", {
    className: "".concat(prefixCls, "-close-x")
  }, closeIcon || /*#__PURE__*/React.createElement(_CloseOutlined["default"], {
    className: "".concat(prefixCls, "-close-icon")
  }));
  var notificationClass = (0, _classnames["default"])("".concat(prefixCls, "-").concat(placement), (0, _defineProperty2["default"])({}, "".concat(prefixCls, "-rtl"), rtl === true));
  notificationInstance[cacheKey] = new Promise(function (resolve) {
    _rcNotification["default"].newInstance({
      prefixCls: prefixCls,
      className: notificationClass,
      style: getPlacementStyle(placement, top, bottom),
      getContainer: getContainer,
      closeIcon: closeIconToRender
    }, function (notification) {
      resolve(notification);
      callback({
        prefixCls: "".concat(prefixCls, "-notice"),
        instance: notification
      });
    });
  });
}

var typeToIcon = {
  success: _CheckCircleOutlined["default"],
  info: _InfoCircleOutlined["default"],
  error: _CloseCircleOutlined["default"],
  warning: _ExclamationCircleOutlined["default"]
};

function getRCNoticeProps(args, prefixCls) {
  var durationArg = args.duration,
      icon = args.icon,
      type = args.type,
      description = args.description,
      message = args.message,
      btn = args.btn,
      onClose = args.onClose,
      onClick = args.onClick,
      key = args.key,
      style = args.style,
      className = args.className;
  var duration = durationArg === undefined ? defaultDuration : durationArg;
  var iconNode = null;

  if (icon) {
    iconNode = /*#__PURE__*/React.createElement("span", {
      className: "".concat(prefixCls, "-icon")
    }, args.icon);
  } else if (type) {
    iconNode = /*#__PURE__*/React.createElement(typeToIcon[type] || null, {
      className: "".concat(prefixCls, "-icon ").concat(prefixCls, "-icon-").concat(type)
    });
  }

  var autoMarginTag = !description && iconNode ? /*#__PURE__*/React.createElement("span", {
    className: "".concat(prefixCls, "-message-single-line-auto-margin")
  }) : null;
  return {
    content: /*#__PURE__*/React.createElement("div", {
      className: iconNode ? "".concat(prefixCls, "-with-icon") : '',
      role: "alert"
    }, iconNode, /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-message")
    }, autoMarginTag, message), /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-description")
    }, description), btn ? /*#__PURE__*/React.createElement("span", {
      className: "".concat(prefixCls, "-btn")
    }, btn) : null),
    duration: duration,
    closable: true,
    onClose: onClose,
    onClick: onClick,
    key: key,
    style: style || {},
    className: (0, _classnames["default"])(className, (0, _defineProperty2["default"])({}, "".concat(prefixCls, "-").concat(type), !!type))
  };
}

function notice(args) {
  getNotificationInstance(args, function (_ref) {
    var prefixCls = _ref.prefixCls,
        instance = _ref.instance;
    instance.notice(getRCNoticeProps(args, prefixCls));
  });
}

var api = {
  open: notice,
  close: function close(key) {
    Object.keys(notificationInstance).forEach(function (cacheKey) {
      return Promise.resolve(notificationInstance[cacheKey]).then(function (instance) {
        instance.removeNotice(key);
      });
    });
  },
  config: setNotificationConfig,
  destroy: function destroy() {
    Object.keys(notificationInstance).forEach(function (cacheKey) {
      Promise.resolve(notificationInstance[cacheKey]).then(function (instance) {
        instance.destroy();
      });
      delete notificationInstance[cacheKey]; // lgtm[js/missing-await]
    });
  }
};
['success', 'info', 'warning', 'error'].forEach(function (type) {
  api[type] = function (args) {
    return api.open((0, _extends2["default"])((0, _extends2["default"])({}, args), {
      type: type
    }));
  };
});
api.warn = api.warning;
api.useNotification = (0, _useNotification["default"])(getNotificationInstance, getRCNoticeProps);
/** @private test Only function. Not work on production */

var getInstance = function getInstance(cacheKey) {
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return",  false ? 0 : null);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
};

exports.getInstance = getInstance;
var _default = api;
exports.default = _default;

/***/ }),

/***/ 694:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _select = _interopRequireDefault(__webpack_require__(9768));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var MiniSelect = function MiniSelect(props) {
  return /*#__PURE__*/React.createElement(_select["default"], (0, _extends2["default"])({
    size: "small"
  }, props));
};

MiniSelect.Option = _select["default"].Option;
var _default = MiniSelect;
exports.default = _default;

/***/ }),

/***/ 6945:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _rcPagination = _interopRequireDefault(__webpack_require__(5423));

var _en_US = _interopRequireDefault(__webpack_require__(671));

var _classnames = _interopRequireDefault(__webpack_require__(7855));

var _LeftOutlined = _interopRequireDefault(__webpack_require__(5338));

var _RightOutlined = _interopRequireDefault(__webpack_require__(2084));

var _DoubleLeftOutlined = _interopRequireDefault(__webpack_require__(3731));

var _DoubleRightOutlined = _interopRequireDefault(__webpack_require__(1431));

var _MiniSelect = _interopRequireDefault(__webpack_require__(694));

var _select = _interopRequireDefault(__webpack_require__(9768));

var _LocaleReceiver = _interopRequireDefault(__webpack_require__(4601));

var _configProvider = __webpack_require__(2774);

var _useBreakpoint2 = _interopRequireDefault(__webpack_require__(2676));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var Pagination = function Pagination(_a) {
  var customizePrefixCls = _a.prefixCls,
      customizeSelectPrefixCls = _a.selectPrefixCls,
      className = _a.className,
      size = _a.size,
      customLocale = _a.locale,
      restProps = __rest(_a, ["prefixCls", "selectPrefixCls", "className", "size", "locale"]);

  var _useBreakpoint = (0, _useBreakpoint2["default"])(),
      xs = _useBreakpoint.xs;

  var _React$useContext = React.useContext(_configProvider.ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction;

  var prefixCls = getPrefixCls('pagination', customizePrefixCls);

  var getIconsProps = function getIconsProps() {
    var ellipsis = /*#__PURE__*/React.createElement("span", {
      className: "".concat(prefixCls, "-item-ellipsis")
    }, "\u2022\u2022\u2022");
    var prevIcon = /*#__PURE__*/React.createElement("button", {
      className: "".concat(prefixCls, "-item-link"),
      type: "button",
      tabIndex: -1
    }, /*#__PURE__*/React.createElement(_LeftOutlined["default"], null));
    var nextIcon = /*#__PURE__*/React.createElement("button", {
      className: "".concat(prefixCls, "-item-link"),
      type: "button",
      tabIndex: -1
    }, /*#__PURE__*/React.createElement(_RightOutlined["default"], null));
    var jumpPrevIcon = /*#__PURE__*/React.createElement("a", {
      className: "".concat(prefixCls, "-item-link")
    }, /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-item-container")
    }, /*#__PURE__*/React.createElement(_DoubleLeftOutlined["default"], {
      className: "".concat(prefixCls, "-item-link-icon")
    }), ellipsis));
    var jumpNextIcon = /*#__PURE__*/React.createElement("a", {
      className: "".concat(prefixCls, "-item-link")
    }, /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-item-container")
    }, /*#__PURE__*/React.createElement(_DoubleRightOutlined["default"], {
      className: "".concat(prefixCls, "-item-link-icon")
    }), ellipsis)); // change arrows direction in right-to-left direction

    if (direction === 'rtl') {
      var _ref = [nextIcon, prevIcon];
      prevIcon = _ref[0];
      nextIcon = _ref[1];
      var _ref2 = [jumpNextIcon, jumpPrevIcon];
      jumpPrevIcon = _ref2[0];
      jumpNextIcon = _ref2[1];
    }

    return {
      prevIcon: prevIcon,
      nextIcon: nextIcon,
      jumpPrevIcon: jumpPrevIcon,
      jumpNextIcon: jumpNextIcon
    };
  };

  var renderPagination = function renderPagination(contextLocale) {
    var locale = (0, _extends2["default"])((0, _extends2["default"])({}, contextLocale), customLocale);
    var isSmall = size === 'small' || !!(xs && !size && restProps.responsive);
    var selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls);
    var extendedClassName = (0, _classnames["default"])((0, _defineProperty2["default"])({
      mini: isSmall
    }, "".concat(prefixCls, "-rtl"), direction === 'rtl'), className);
    return /*#__PURE__*/React.createElement(_rcPagination["default"], (0, _extends2["default"])({}, restProps, {
      prefixCls: prefixCls,
      selectPrefixCls: selectPrefixCls
    }, getIconsProps(), {
      className: extendedClassName,
      selectComponentClass: isSmall ? _MiniSelect["default"] : _select["default"],
      locale: locale
    }));
  };

  return /*#__PURE__*/React.createElement(_LocaleReceiver["default"], {
    componentName: "Pagination",
    defaultLocale: _en_US["default"]
  }, renderPagination);
};

var _default = Pagination;
exports.default = _default;

/***/ }),

/***/ 9983:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(4541);

__webpack_unused_export__ = ({
  value: true
});
__webpack_unused_export__ = void 0;

var _Pagination = _interopRequireDefault(__webpack_require__(6945));

var _default = _Pagination["default"];
__webpack_unused_export__ = _default;

/***/ }),

/***/ 9768:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _omit = _interopRequireDefault(__webpack_require__(4085));

var _classnames = _interopRequireDefault(__webpack_require__(7855));

var _rcSelect = _interopRequireWildcard(__webpack_require__(3103));

var _configProvider = __webpack_require__(2774);

var _iconUtil = _interopRequireDefault(__webpack_require__(2447));

var _SizeContext = _interopRequireDefault(__webpack_require__(2371));

var _motion = __webpack_require__(7901);

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
} // TODO: 4.0 - codemod should help to change `filterOption` to support node props.


var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';

var InternalSelect = function InternalSelect(_a, ref) {
  var _classNames2;

  var customizePrefixCls = _a.prefixCls,
      _a$bordered = _a.bordered,
      bordered = _a$bordered === void 0 ? true : _a$bordered,
      className = _a.className,
      getPopupContainer = _a.getPopupContainer,
      dropdownClassName = _a.dropdownClassName,
      _a$listHeight = _a.listHeight,
      listHeight = _a$listHeight === void 0 ? 256 : _a$listHeight,
      _a$listItemHeight = _a.listItemHeight,
      listItemHeight = _a$listItemHeight === void 0 ? 24 : _a$listItemHeight,
      customizeSize = _a.size,
      notFoundContent = _a.notFoundContent,
      props = __rest(_a, ["prefixCls", "bordered", "className", "getPopupContainer", "dropdownClassName", "listHeight", "listItemHeight", "size", "notFoundContent"]);

  var _React$useContext = React.useContext(_configProvider.ConfigContext),
      getContextPopupContainer = _React$useContext.getPopupContainer,
      getPrefixCls = _React$useContext.getPrefixCls,
      renderEmpty = _React$useContext.renderEmpty,
      direction = _React$useContext.direction,
      virtual = _React$useContext.virtual,
      dropdownMatchSelectWidth = _React$useContext.dropdownMatchSelectWidth;

  var size = React.useContext(_SizeContext["default"]);
  var prefixCls = getPrefixCls('select', customizePrefixCls);
  var rootPrefixCls = getPrefixCls();
  var mode = React.useMemo(function () {
    var m = props.mode;

    if (m === 'combobox') {
      return undefined;
    }

    if (m === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
      return 'combobox';
    }

    return m;
  }, [props.mode]);
  var isMultiple = mode === 'multiple' || mode === 'tags'; // ===================== Empty =====================

  var mergedNotFound;

  if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent;
  } else if (mode === 'combobox') {
    mergedNotFound = null;
  } else {
    mergedNotFound = renderEmpty('Select');
  } // ===================== Icons =====================


  var _getIcons = (0, _iconUtil["default"])((0, _extends2["default"])((0, _extends2["default"])({}, props), {
    multiple: isMultiple,
    prefixCls: prefixCls
  })),
      suffixIcon = _getIcons.suffixIcon,
      itemIcon = _getIcons.itemIcon,
      removeIcon = _getIcons.removeIcon,
      clearIcon = _getIcons.clearIcon;

  var selectProps = (0, _omit["default"])(props, ['suffixIcon', 'itemIcon']);
  var rcSelectRtlDropDownClassName = (0, _classnames["default"])(dropdownClassName, (0, _defineProperty2["default"])({}, "".concat(prefixCls, "-dropdown-").concat(direction), direction === 'rtl'));
  var mergedSize = customizeSize || size;
  var mergedClassName = (0, _classnames["default"])((_classNames2 = {}, (0, _defineProperty2["default"])(_classNames2, "".concat(prefixCls, "-lg"), mergedSize === 'large'), (0, _defineProperty2["default"])(_classNames2, "".concat(prefixCls, "-sm"), mergedSize === 'small'), (0, _defineProperty2["default"])(_classNames2, "".concat(prefixCls, "-rtl"), direction === 'rtl'), (0, _defineProperty2["default"])(_classNames2, "".concat(prefixCls, "-borderless"), !bordered), _classNames2), className);
  return /*#__PURE__*/React.createElement(_rcSelect["default"], (0, _extends2["default"])({
    ref: ref,
    virtual: virtual,
    dropdownMatchSelectWidth: dropdownMatchSelectWidth
  }, selectProps, {
    transitionName: (0, _motion.getTransitionName)(rootPrefixCls, 'slide-up', props.transitionName),
    listHeight: listHeight,
    listItemHeight: listItemHeight,
    mode: mode,
    prefixCls: prefixCls,
    direction: direction,
    inputIcon: suffixIcon,
    menuItemSelectedIcon: itemIcon,
    removeIcon: removeIcon,
    clearIcon: clearIcon,
    notFoundContent: mergedNotFound,
    className: mergedClassName,
    getPopupContainer: getPopupContainer || getContextPopupContainer,
    dropdownClassName: rcSelectRtlDropDownClassName
  }));
};

var SelectRef = /*#__PURE__*/React.forwardRef(InternalSelect);
var Select = SelectRef;
Select.SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE;
Select.Option = _rcSelect.Option;
Select.OptGroup = _rcSelect.OptGroup;
var _default = Select;
exports.default = _default;

/***/ }),

/***/ 2447:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

var _typeof = __webpack_require__(8705);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = getIcons;

var React = _interopRequireWildcard(__webpack_require__(3804));

var _DownOutlined = _interopRequireDefault(__webpack_require__(3055));

var _LoadingOutlined = _interopRequireDefault(__webpack_require__(1610));

var _CheckOutlined = _interopRequireDefault(__webpack_require__(4462));

var _CloseOutlined = _interopRequireDefault(__webpack_require__(8774));

var _CloseCircleFilled = _interopRequireDefault(__webpack_require__(6617));

var _SearchOutlined = _interopRequireDefault(__webpack_require__(4210));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function getIcons(_ref) {
  var suffixIcon = _ref.suffixIcon,
      clearIcon = _ref.clearIcon,
      menuItemSelectedIcon = _ref.menuItemSelectedIcon,
      removeIcon = _ref.removeIcon,
      loading = _ref.loading,
      multiple = _ref.multiple,
      prefixCls = _ref.prefixCls; // Clear Icon

  var mergedClearIcon = clearIcon;

  if (!clearIcon) {
    mergedClearIcon = /*#__PURE__*/React.createElement(_CloseCircleFilled["default"], null);
  } // Arrow item icon


  var mergedSuffixIcon = null;

  if (suffixIcon !== undefined) {
    mergedSuffixIcon = suffixIcon;
  } else if (loading) {
    mergedSuffixIcon = /*#__PURE__*/React.createElement(_LoadingOutlined["default"], {
      spin: true
    });
  } else {
    var iconCls = "".concat(prefixCls, "-suffix");

    mergedSuffixIcon = function mergedSuffixIcon(_ref2) {
      var open = _ref2.open,
          showSearch = _ref2.showSearch;

      if (open && showSearch) {
        return /*#__PURE__*/React.createElement(_SearchOutlined["default"], {
          className: iconCls
        });
      }

      return /*#__PURE__*/React.createElement(_DownOutlined["default"], {
        className: iconCls
      });
    };
  } // Checked item icon


  var mergedItemIcon = null;

  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon;
  } else if (multiple) {
    mergedItemIcon = /*#__PURE__*/React.createElement(_CheckOutlined["default"], null);
  } else {
    mergedItemIcon = null;
  }

  var mergedRemoveIcon = null;

  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = /*#__PURE__*/React.createElement(_CloseOutlined["default"], null);
  }

  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon
  };
}

/***/ }),

/***/ 4924:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
var locale = {
  placeholder: 'Select time',
  rangePlaceholder: ['Start time', 'End time']
};
var _default = locale;
exports.default = _default;

/***/ }),

/***/ 7855:
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

/* global define */
(function () {
  'use strict';

  var hasOwn = {}.hasOwnProperty;

  function classNames() {
    var classes = [];

    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (!arg) continue;
      var argType = typeof arg;

      if (argType === 'string' || argType === 'number') {
        classes.push(arg);
      } else if (Array.isArray(arg)) {
        if (arg.length) {
          var inner = classNames.apply(null, arg);

          if (inner) {
            classes.push(inner);
          }
        }
      } else if (argType === 'object') {
        if (arg.toString === Object.prototype.toString) {
          for (var key in arg) {
            if (hasOwn.call(arg, key) && arg[key]) {
              classes.push(key);
            }
          }
        } else {
          classes.push(arg.toString());
        }
      }
    }

    return classes.join(' ');
  }

  if ( true && module.exports) {
    classNames.default = classNames;
    module.exports = classNames;
  } else if (true) {
    // register as 'classnames', consistent with npm package name
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return classNames;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})();

/***/ }),

/***/ 3626:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Field": () => (/* reexport */ es_Field),
  "FormProvider": () => (/* reexport */ FormProvider),
  "List": () => (/* reexport */ es_List),
  "default": () => (/* binding */ es),
  "useForm": () => (/* reexport */ es_useForm)
});

// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(3804);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(6712);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js + 1 modules
var objectWithoutProperties = __webpack_require__(6980);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(2064);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__(3755);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js + 2 modules
var toConsumableArray = __webpack_require__(9041);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(4609);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(9389);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(8749);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js + 3 modules
var createSuper = __webpack_require__(3186);
// EXTERNAL MODULE: ./node_modules/rc-util/es/Children/toArray.js
var toArray = __webpack_require__(4371);
// EXTERNAL MODULE: ./node_modules/rc-util/es/warning.js
var warning = __webpack_require__(1381);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/FieldContext.js


var HOOK_MARK = 'RC_FORM_INTERNAL_HOOKS'; // eslint-disable-next-line @typescript-eslint/no-explicit-any

var warningFunc = function warningFunc() {
  (0,warning/* default */.ZP)(false, 'Can not find FormContext. Please make sure you wrap Field under Form.');
};

var Context = /*#__PURE__*/external_React_.createContext({
  getFieldValue: warningFunc,
  getFieldsValue: warningFunc,
  getFieldError: warningFunc,
  getFieldsError: warningFunc,
  isFieldsTouched: warningFunc,
  isFieldTouched: warningFunc,
  isFieldValidating: warningFunc,
  isFieldsValidating: warningFunc,
  resetFields: warningFunc,
  setFields: warningFunc,
  setFieldsValue: warningFunc,
  validateFields: warningFunc,
  submit: warningFunc,
  getInternalHooks: function getInternalHooks() {
    warningFunc();
    return {
      dispatch: warningFunc,
      initEntityValue: warningFunc,
      registerField: warningFunc,
      useSubscribe: warningFunc,
      setInitialValues: warningFunc,
      setCallbacks: warningFunc,
      getFields: warningFunc,
      setValidateMessages: warningFunc,
      setPreserve: warningFunc
    };
  }
});
/* harmony default export */ const FieldContext = (Context);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/utils/typeUtil.js
function typeUtil_toArray(value) {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(8627);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(9677);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__(4933);
;// CONCATENATED MODULE: ./node_modules/async-validator/dist-web/index.js
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}
/* eslint no-console:0 */


var formatRegExp = /%[sdj%]/g;

var dist_web_warning = function warning() {}; // don't print warning message when in production env or node runtime


if (typeof process !== 'undefined' && process.env && "production" !== 'production' && typeof window !== 'undefined' && typeof document !== 'undefined') {
  dist_web_warning = function warning(type, errors) {
    if (typeof console !== 'undefined' && console.warn) {
      if (errors.every(function (e) {
        return typeof e === 'string';
      })) {
        console.warn(type, errors);
      }
    }
  };
}

function convertFieldsError(errors) {
  if (!errors || !errors.length) return null;
  var fields = {};
  errors.forEach(function (error) {
    var field = error.field;
    fields[field] = fields[field] || [];
    fields[field].push(error);
  });
  return fields;
}

function format() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var i = 1;
  var f = args[0];
  var len = args.length;

  if (typeof f === 'function') {
    return f.apply(null, args.slice(1));
  }

  if (typeof f === 'string') {
    var str = String(f).replace(formatRegExp, function (x) {
      if (x === '%%') {
        return '%';
      }

      if (i >= len) {
        return x;
      }

      switch (x) {
        case '%s':
          return String(args[i++]);

        case '%d':
          return Number(args[i++]);

        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }

          break;

        default:
          return x;
      }
    });
    return str;
  }

  return f;
}

function isNativeStringType(type) {
  return type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'date' || type === 'pattern';
}

function isEmptyValue(value, type) {
  if (value === undefined || value === null) {
    return true;
  }

  if (type === 'array' && Array.isArray(value) && !value.length) {
    return true;
  }

  if (isNativeStringType(type) && typeof value === 'string' && !value) {
    return true;
  }

  return false;
}

function asyncParallelArray(arr, func, callback) {
  var results = [];
  var total = 0;
  var arrLength = arr.length;

  function count(errors) {
    results.push.apply(results, errors);
    total++;

    if (total === arrLength) {
      callback(results);
    }
  }

  arr.forEach(function (a) {
    func(a, count);
  });
}

function asyncSerialArray(arr, func, callback) {
  var index = 0;
  var arrLength = arr.length;

  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }

    var original = index;
    index = index + 1;

    if (original < arrLength) {
      func(arr[original], next);
    } else {
      callback([]);
    }
  }

  next([]);
}

function flattenObjArr(objArr) {
  var ret = [];
  Object.keys(objArr).forEach(function (k) {
    ret.push.apply(ret, objArr[k]);
  });
  return ret;
}

var AsyncValidationError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(AsyncValidationError, _Error);

  function AsyncValidationError(errors, fields) {
    var _this;

    _this = _Error.call(this, 'Async Validation Error') || this;
    _this.errors = errors;
    _this.fields = fields;
    return _this;
  }

  return AsyncValidationError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

function asyncMap(objArr, option, func, callback) {
  if (option.first) {
    var _pending = new Promise(function (resolve, reject) {
      var next = function next(errors) {
        callback(errors);
        return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve();
      };

      var flattenArr = flattenObjArr(objArr);
      asyncSerialArray(flattenArr, func, next);
    });

    _pending["catch"](function (e) {
      return e;
    });

    return _pending;
  }

  var firstFields = option.firstFields || [];

  if (firstFields === true) {
    firstFields = Object.keys(objArr);
  }

  var objArrKeys = Object.keys(objArr);
  var objArrLength = objArrKeys.length;
  var total = 0;
  var results = [];
  var pending = new Promise(function (resolve, reject) {
    var next = function next(errors) {
      results.push.apply(results, errors);
      total++;

      if (total === objArrLength) {
        callback(results);
        return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve();
      }
    };

    if (!objArrKeys.length) {
      callback(results);
      resolve();
    }

    objArrKeys.forEach(function (key) {
      var arr = objArr[key];

      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray(arr, func, next);
      } else {
        asyncParallelArray(arr, func, next);
      }
    });
  });
  pending["catch"](function (e) {
    return e;
  });
  return pending;
}

function complementError(rule) {
  return function (oe) {
    if (oe && oe.message) {
      oe.field = oe.field || rule.fullField;
      return oe;
    }

    return {
      message: typeof oe === 'function' ? oe() : oe,
      field: oe.field || rule.fullField
    };
  };
}

function deepMerge(target, source) {
  if (source) {
    for (var s in source) {
      if (source.hasOwnProperty(s)) {
        var value = source[s];

        if (typeof value === 'object' && typeof target[s] === 'object') {
          target[s] = _extends({}, target[s], value);
        } else {
          target[s] = value;
        }
      }
    }
  }

  return target;
}
/**
 *  Rule for validating required fields.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function required(rule, value, source, errors, options, type) {
  if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) {
    errors.push(format(options.messages.required, rule.fullField));
  }
}
/**
 *  Rule for validating whitespace.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function whitespace(rule, value, source, errors, options) {
  if (/^\s+$/.test(value) || value === '') {
    errors.push(format(options.messages.whitespace, rule.fullField));
  }
}
/* eslint max-len:0 */


var pattern = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$", 'i'),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
var types = {
  integer: function integer(value) {
    return types.number(value) && parseInt(value, 10) === value;
  },
  "float": function float(value) {
    return types.number(value) && !types.integer(value);
  },
  array: function array(value) {
    return Array.isArray(value);
  },
  regexp: function regexp(value) {
    if (value instanceof RegExp) {
      return true;
    }

    try {
      return !!new RegExp(value);
    } catch (e) {
      return false;
    }
  },
  date: function date(value) {
    return typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function' && !isNaN(value.getTime());
  },
  number: function number(value) {
    if (isNaN(value)) {
      return false;
    }

    return typeof value === 'number';
  },
  object: function object(value) {
    return typeof value === 'object' && !types.array(value);
  },
  method: function method(value) {
    return typeof value === 'function';
  },
  email: function email(value) {
    return typeof value === 'string' && !!value.match(pattern.email) && value.length < 255;
  },
  url: function url(value) {
    return typeof value === 'string' && !!value.match(pattern.url);
  },
  hex: function hex(value) {
    return typeof value === 'string' && !!value.match(pattern.hex);
  }
};
/**
 *  Rule for validating the type of a value.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */

function type(rule, value, source, errors, options) {
  if (rule.required && value === undefined) {
    required(rule, value, source, errors, options);
    return;
  }

  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'];
  var ruleType = rule.type;

  if (custom.indexOf(ruleType) > -1) {
    if (!types[ruleType](value)) {
      errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
    } // straight typeof check

  } else if (ruleType && typeof value !== rule.type) {
    errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
  }
}
/**
 *  Rule for validating minimum and maximum allowed values.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function range(rule, value, source, errors, options) {
  var len = typeof rule.len === 'number';
  var min = typeof rule.min === 'number';
  var max = typeof rule.max === 'number'; // 正则匹配码点范围从U+010000一直到U+10FFFF的文字（补充平面Supplementary Plane）

  var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var val = value;
  var key = null;
  var num = typeof value === 'number';
  var str = typeof value === 'string';
  var arr = Array.isArray(value);

  if (num) {
    key = 'number';
  } else if (str) {
    key = 'string';
  } else if (arr) {
    key = 'array';
  } // if the value is not of a supported type for range validation
  // the validation rule rule should use the
  // type property to also test for a particular type


  if (!key) {
    return false;
  }

  if (arr) {
    val = value.length;
  }

  if (str) {
    // 处理码点大于U+010000的文字length属性不准确的bug，如"𠮷𠮷𠮷".lenght !== 3
    val = value.replace(spRegexp, '_').length;
  }

  if (len) {
    if (val !== rule.len) {
      errors.push(format(options.messages[key].len, rule.fullField, rule.len));
    }
  } else if (min && !max && val < rule.min) {
    errors.push(format(options.messages[key].min, rule.fullField, rule.min));
  } else if (max && !min && val > rule.max) {
    errors.push(format(options.messages[key].max, rule.fullField, rule.max));
  } else if (min && max && (val < rule.min || val > rule.max)) {
    errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
  }
}

var ENUM = 'enum';
/**
 *  Rule for validating a value exists in an enumerable list.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */

function enumerable(rule, value, source, errors, options) {
  rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];

  if (rule[ENUM].indexOf(value) === -1) {
    errors.push(format(options.messages[ENUM], rule.fullField, rule[ENUM].join(', ')));
  }
}
/**
 *  Rule for validating a regular expression pattern.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function pattern$1(rule, value, source, errors, options) {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      // if a RegExp instance is passed, reset `lastIndex` in case its `global`
      // flag is accidentally set to `true`, which in a validation scenario
      // is not necessary and the result might be misleading
      rule.pattern.lastIndex = 0;

      if (!rule.pattern.test(value)) {
        errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    } else if (typeof rule.pattern === 'string') {
      var _pattern = new RegExp(rule.pattern);

      if (!_pattern.test(value)) {
        errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    }
  }
}

var rules = {
  required: required,
  whitespace: whitespace,
  type: type,
  range: range,
  "enum": enumerable,
  pattern: pattern$1
};
/**
 *  Performs validation for string types.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */

function string(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value, 'string') && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options, 'string');

    if (!isEmptyValue(value, 'string')) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
      rules.pattern(rule, value, source, errors, options);

      if (rule.whitespace === true) {
        rules.whitespace(rule, value, source, errors, options);
      }
    }
  }

  callback(errors);
}
/**
 *  Validates a function.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function method(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (value !== undefined) {
      rules.type(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates a number.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function number(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (value === '') {
      value = undefined;
    }

    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (value !== undefined) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates a boolean.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function _boolean(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (value !== undefined) {
      rules.type(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates the regular expression type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function regexp(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (!isEmptyValue(value)) {
      rules.type(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates a number is an integer.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function integer(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (value !== undefined) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates a number is a floating point number.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function floatFn(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (value !== undefined) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates an array.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function array(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if ((value === undefined || value === null) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options, 'array');

    if (value !== undefined && value !== null) {
      rules.type(rule, value, source, errors, options);
      rules.range(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates an object.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function object(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (value !== undefined) {
      rules.type(rule, value, source, errors, options);
    }
  }

  callback(errors);
}

var ENUM$1 = 'enum';
/**
 *  Validates an enumerable list.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */

function enumerable$1(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (value !== undefined) {
      rules[ENUM$1](rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Validates a regular expression pattern.
 *
 *  Performs validation when a rule only contains
 *  a pattern property but is not declared as a string type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function pattern$2(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value, 'string') && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (!isEmptyValue(value, 'string')) {
      rules.pattern(rule, value, source, errors, options);
    }
  }

  callback(errors);
}

function date(rule, value, callback, source, options) {
  // console.log('integer rule called %j', rule);
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field); // console.log('validate on %s value', value);

  if (validate) {
    if (isEmptyValue(value, 'date') && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);

    if (!isEmptyValue(value, 'date')) {
      var dateObject;

      if (value instanceof Date) {
        dateObject = value;
      } else {
        dateObject = new Date(value);
      }

      rules.type(rule, dateObject, source, errors, options);

      if (dateObject) {
        rules.range(rule, dateObject.getTime(), source, errors, options);
      }
    }
  }

  callback(errors);
}

function required$1(rule, value, callback, source, options) {
  var errors = [];
  var type = Array.isArray(value) ? 'array' : typeof value;
  rules.required(rule, value, source, errors, options, type);
  callback(errors);
}

function type$1(rule, value, callback, source, options) {
  var ruleType = rule.type;
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value, ruleType) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options, ruleType);

    if (!isEmptyValue(value, ruleType)) {
      rules.type(rule, value, source, errors, options);
    }
  }

  callback(errors);
}
/**
 *  Performs validation for any type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */


function any(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);

  if (validate) {
    if (isEmptyValue(value) && !rule.required) {
      return callback();
    }

    rules.required(rule, value, source, errors, options);
  }

  callback(errors);
}

var validators = {
  string: string,
  method: method,
  number: number,
  "boolean": _boolean,
  regexp: regexp,
  integer: integer,
  "float": floatFn,
  array: array,
  object: object,
  "enum": enumerable$1,
  pattern: pattern$2,
  date: date,
  url: type$1,
  hex: type$1,
  email: type$1,
  required: required$1,
  any: any
};

function newMessages() {
  return {
    "default": 'Validation error on field %s',
    required: '%s is required',
    "enum": '%s must be one of %s',
    whitespace: '%s cannot be empty',
    date: {
      format: '%s date %s is invalid for format %s',
      parse: '%s date could not be parsed, %s is invalid ',
      invalid: '%s date %s is invalid'
    },
    types: {
      string: '%s is not a %s',
      method: '%s is not a %s (function)',
      array: '%s is not an %s',
      object: '%s is not an %s',
      number: '%s is not a %s',
      date: '%s is not a %s',
      "boolean": '%s is not a %s',
      integer: '%s is not an %s',
      "float": '%s is not a %s',
      regexp: '%s is not a valid %s',
      email: '%s is not a valid %s',
      url: '%s is not a valid %s',
      hex: '%s is not a valid %s'
    },
    string: {
      len: '%s must be exactly %s characters',
      min: '%s must be at least %s characters',
      max: '%s cannot be longer than %s characters',
      range: '%s must be between %s and %s characters'
    },
    number: {
      len: '%s must equal %s',
      min: '%s cannot be less than %s',
      max: '%s cannot be greater than %s',
      range: '%s must be between %s and %s'
    },
    array: {
      len: '%s must be exactly %s in length',
      min: '%s cannot be less than %s in length',
      max: '%s cannot be greater than %s in length',
      range: '%s must be between %s and %s in length'
    },
    pattern: {
      mismatch: '%s value %s does not match pattern %s'
    },
    clone: function clone() {
      var cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    }
  };
}

var messages = newMessages();
/**
 *  Encapsulates a validation schema.
 *
 *  @param descriptor An object declaring validation rules
 *  for this schema.
 */

function Schema(descriptor) {
  this.rules = null;
  this._messages = messages;
  this.define(descriptor);
}

Schema.prototype = {
  messages: function messages(_messages) {
    if (_messages) {
      this._messages = deepMerge(newMessages(), _messages);
    }

    return this._messages;
  },
  define: function define(rules) {
    if (!rules) {
      throw new Error('Cannot configure a schema with no rules');
    }

    if (typeof rules !== 'object' || Array.isArray(rules)) {
      throw new Error('Rules must be an object');
    }

    this.rules = {};
    var z;
    var item;

    for (z in rules) {
      if (rules.hasOwnProperty(z)) {
        item = rules[z];
        this.rules[z] = Array.isArray(item) ? item : [item];
      }
    }
  },
  validate: function validate(source_, o, oc) {
    var _this = this;

    if (o === void 0) {
      o = {};
    }

    if (oc === void 0) {
      oc = function oc() {};
    }

    var source = source_;
    var options = o;
    var callback = oc;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (callback) {
        callback();
      }

      return Promise.resolve();
    }

    function complete(results) {
      var i;
      var errors = [];
      var fields = {};

      function add(e) {
        if (Array.isArray(e)) {
          var _errors;

          errors = (_errors = errors).concat.apply(_errors, e);
        } else {
          errors.push(e);
        }
      }

      for (i = 0; i < results.length; i++) {
        add(results[i]);
      }

      if (!errors.length) {
        errors = null;
        fields = null;
      } else {
        fields = convertFieldsError(errors);
      }

      callback(errors, fields);
    }

    if (options.messages) {
      var messages$1 = this.messages();

      if (messages$1 === messages) {
        messages$1 = newMessages();
      }

      deepMerge(messages$1, options.messages);
      options.messages = messages$1;
    } else {
      options.messages = this.messages();
    }

    var arr;
    var value;
    var series = {};
    var keys = options.keys || Object.keys(this.rules);
    keys.forEach(function (z) {
      arr = _this.rules[z];
      value = source[z];
      arr.forEach(function (r) {
        var rule = r;

        if (typeof rule.transform === 'function') {
          if (source === source_) {
            source = _extends({}, source);
          }

          value = source[z] = rule.transform(value);
        }

        if (typeof rule === 'function') {
          rule = {
            validator: rule
          };
        } else {
          rule = _extends({}, rule);
        }

        rule.validator = _this.getValidationMethod(rule);
        rule.field = z;
        rule.fullField = rule.fullField || z;
        rule.type = _this.getType(rule);

        if (!rule.validator) {
          return;
        }

        series[z] = series[z] || [];
        series[z].push({
          rule: rule,
          value: value,
          source: source,
          field: z
        });
      });
    });
    var errorFields = {};
    return asyncMap(series, options, function (data, doIt) {
      var rule = data.rule;
      var deep = (rule.type === 'object' || rule.type === 'array') && (typeof rule.fields === 'object' || typeof rule.defaultField === 'object');
      deep = deep && (rule.required || !rule.required && data.value);
      rule.field = data.field;

      function addFullfield(key, schema) {
        return _extends({}, schema, {
          fullField: rule.fullField + "." + key
        });
      }

      function cb(e) {
        if (e === void 0) {
          e = [];
        }

        var errors = e;

        if (!Array.isArray(errors)) {
          errors = [errors];
        }

        if (!options.suppressWarning && errors.length) {
          Schema.warning('async-validator:', errors);
        }

        if (errors.length && rule.message !== undefined) {
          errors = [].concat(rule.message);
        }

        errors = errors.map(complementError(rule));

        if (options.first && errors.length) {
          errorFields[rule.field] = 1;
          return doIt(errors);
        }

        if (!deep) {
          doIt(errors);
        } else {
          // if rule is required but the target object
          // does not exist fail at the rule level and don't
          // go deeper
          if (rule.required && !data.value) {
            if (rule.message !== undefined) {
              errors = [].concat(rule.message).map(complementError(rule));
            } else if (options.error) {
              errors = [options.error(rule, format(options.messages.required, rule.field))];
            }

            return doIt(errors);
          }

          var fieldsSchema = {};

          if (rule.defaultField) {
            for (var k in data.value) {
              if (data.value.hasOwnProperty(k)) {
                fieldsSchema[k] = rule.defaultField;
              }
            }
          }

          fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);

          for (var f in fieldsSchema) {
            if (fieldsSchema.hasOwnProperty(f)) {
              var fieldSchema = Array.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
              fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
            }
          }

          var schema = new Schema(fieldsSchema);
          schema.messages(options.messages);

          if (data.rule.options) {
            data.rule.options.messages = options.messages;
            data.rule.options.error = options.error;
          }

          schema.validate(data.value, data.rule.options || options, function (errs) {
            var finalErrors = [];

            if (errors && errors.length) {
              finalErrors.push.apply(finalErrors, errors);
            }

            if (errs && errs.length) {
              finalErrors.push.apply(finalErrors, errs);
            }

            doIt(finalErrors.length ? finalErrors : null);
          });
        }
      }

      var res;

      if (rule.asyncValidator) {
        res = rule.asyncValidator(rule, data.value, cb, data.source, options);
      } else if (rule.validator) {
        res = rule.validator(rule, data.value, cb, data.source, options);

        if (res === true) {
          cb();
        } else if (res === false) {
          cb(rule.message || rule.field + " fails");
        } else if (res instanceof Array) {
          cb(res);
        } else if (res instanceof Error) {
          cb(res.message);
        }
      }

      if (res && res.then) {
        res.then(function () {
          return cb();
        }, function (e) {
          return cb(e);
        });
      }
    }, function (results) {
      complete(results);
    });
  },
  getType: function getType(rule) {
    if (rule.type === undefined && rule.pattern instanceof RegExp) {
      rule.type = 'pattern';
    }

    if (typeof rule.validator !== 'function' && rule.type && !validators.hasOwnProperty(rule.type)) {
      throw new Error(format('Unknown rule type %s', rule.type));
    }

    return rule.type || 'string';
  },
  getValidationMethod: function getValidationMethod(rule) {
    if (typeof rule.validator === 'function') {
      return rule.validator;
    }

    var keys = Object.keys(rule);
    var messageIndex = keys.indexOf('message');

    if (messageIndex !== -1) {
      keys.splice(messageIndex, 1);
    }

    if (keys.length === 1 && keys[0] === 'required') {
      return validators.required;
    }

    return validators[this.getType(rule)] || false;
  }
};

Schema.register = function register(type, validator) {
  if (typeof validator !== 'function') {
    throw new Error('Cannot register a validator by type, validator is not a function');
  }

  validators[type] = validator;
};

Schema.warning = dist_web_warning;
Schema.messages = messages;
Schema.validators = validators;
/* harmony default export */ const dist_web = (Schema);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/utils/get.js
function get(entity, path) {
  var current = entity;

  for (var i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = current[path[i]];
  }

  return current;
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/toArray.js
var esm_toArray = __webpack_require__(723);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/utils/set.js





function internalSet(entity, paths, value, removeIfUndefined) {
  if (!paths.length) {
    return value;
  }

  var _paths = (0,esm_toArray/* default */.Z)(paths),
      path = _paths[0],
      restPath = _paths.slice(1);

  var clone;

  if (!entity && typeof path === 'number') {
    clone = [];
  } else if (Array.isArray(entity)) {
    clone = (0,toConsumableArray/* default */.Z)(entity);
  } else {
    clone = (0,objectSpread2/* default */.Z)({}, entity);
  } // Delete prop if `removeIfUndefined` and value is undefined


  if (removeIfUndefined && value === undefined && restPath.length === 1) {
    delete clone[path][restPath[0]];
  } else {
    clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined);
  }

  return clone;
}

function set(entity, paths, value) {
  var removeIfUndefined = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false; // Do nothing if `removeIfUndefined` and parent object not exist

  if (paths.length && removeIfUndefined && value === undefined && !get(entity, paths.slice(0, -1))) {
    return entity;
  }

  return internalSet(entity, paths, value, removeIfUndefined);
}
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/utils/valueUtil.js






/**
 * Convert name to internal supported format.
 * This function should keep since we still thinking if need support like `a.b.c` format.
 * 'a' => ['a']
 * 123 => [123]
 * ['a', 123] => ['a', 123]
 */

function getNamePath(path) {
  return typeUtil_toArray(path);
}
function getValue(store, namePath) {
  var value = get(store, namePath);
  return value;
}
function setValue(store, namePath, value) {
  var removeIfUndefined = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var newStore = set(store, namePath, value, removeIfUndefined);
  return newStore;
}
function cloneByNamePathList(store, namePathList) {
  var newStore = {};
  namePathList.forEach(function (namePath) {
    var value = getValue(store, namePath);
    newStore = setValue(newStore, namePath, value);
  });
  return newStore;
}
function containsNamePath(namePathList, namePath) {
  return namePathList && namePathList.some(function (path) {
    return matchNamePath(path, namePath);
  });
}

function isObject(obj) {
  return (0,esm_typeof/* default */.Z)(obj) === 'object' && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}
/**
 * Copy values into store and return a new values object
 * ({ a: 1, b: { c: 2 } }, { a: 4, b: { d: 5 } }) => { a: 4, b: { c: 2, d: 5 } }
 */


function internalSetValues(store, values) {
  var newStore = Array.isArray(store) ? (0,toConsumableArray/* default */.Z)(store) : (0,objectSpread2/* default */.Z)({}, store);

  if (!values) {
    return newStore;
  }

  Object.keys(values).forEach(function (key) {
    var prevValue = newStore[key];
    var value = values[key]; // If both are object (but target is not array), we use recursion to set deep value

    var recursive = isObject(prevValue) && isObject(value);
    newStore[key] = recursive ? internalSetValues(prevValue, value || {}) : value;
  });
  return newStore;
}

function setValues(store) {
  for (var _len = arguments.length, restValues = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    restValues[_key - 1] = arguments[_key];
  }

  return restValues.reduce(function (current, newStore) {
    return internalSetValues(current, newStore);
  }, store);
}
function matchNamePath(namePath, changedNamePath) {
  if (!namePath || !changedNamePath || namePath.length !== changedNamePath.length) {
    return false;
  }

  return namePath.every(function (nameUnit, i) {
    return changedNamePath[i] === nameUnit;
  });
}
function isSimilar(source, target) {
  if (source === target) {
    return true;
  }

  if (!source && target || source && !target) {
    return false;
  }

  if (!source || !target || (0,esm_typeof/* default */.Z)(source) !== 'object' || (0,esm_typeof/* default */.Z)(target) !== 'object') {
    return false;
  }

  var sourceKeys = Object.keys(source);
  var targetKeys = Object.keys(target);
  var keys = new Set([].concat((0,toConsumableArray/* default */.Z)(sourceKeys), (0,toConsumableArray/* default */.Z)(targetKeys)));
  return (0,toConsumableArray/* default */.Z)(keys).every(function (key) {
    var sourceValue = source[key];
    var targetValue = target[key];

    if (typeof sourceValue === 'function' && typeof targetValue === 'function') {
      return true;
    }

    return sourceValue === targetValue;
  });
}
function defaultGetValueFromEvent(valuePropName) {
  var event = arguments.length <= 1 ? undefined : arguments[1];

  if (event && event.target && valuePropName in event.target) {
    return event.target[valuePropName];
  }

  return event;
}
/**
 * Moves an array item from one position in an array to another.
 *
 * Note: This is a pure function so a new array will be returned, instead
 * of altering the array argument.
 *
 * @param array         Array in which to move an item.         (required)
 * @param moveIndex     The index of the item to move.          (required)
 * @param toIndex       The index to move item at moveIndex to. (required)
 */

function valueUtil_move(array, moveIndex, toIndex) {
  var length = array.length;

  if (moveIndex < 0 || moveIndex >= length || toIndex < 0 || toIndex >= length) {
    return array;
  }

  var item = array[moveIndex];
  var diff = moveIndex - toIndex;

  if (diff > 0) {
    // move left
    return [].concat((0,toConsumableArray/* default */.Z)(array.slice(0, toIndex)), [item], (0,toConsumableArray/* default */.Z)(array.slice(toIndex, moveIndex)), (0,toConsumableArray/* default */.Z)(array.slice(moveIndex + 1, length)));
  }

  if (diff < 0) {
    // move right
    return [].concat((0,toConsumableArray/* default */.Z)(array.slice(0, moveIndex)), (0,toConsumableArray/* default */.Z)(array.slice(moveIndex + 1, toIndex + 1)), [item], (0,toConsumableArray/* default */.Z)(array.slice(toIndex + 1, length)));
  }

  return array;
}
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/utils/messages.js
var typeTemplate = "'${name}' is not a valid ${type}";
var defaultValidateMessages = {
  default: "Validation error on field '${name}'",
  required: "'${name}' is required",
  enum: "'${name}' must be one of [${enum}]",
  whitespace: "'${name}' cannot be empty",
  date: {
    format: "'${name}' is invalid for format date",
    parse: "'${name}' could not be parsed as date",
    invalid: "'${name}' is invalid date"
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate
  },
  string: {
    len: "'${name}' must be exactly ${len} characters",
    min: "'${name}' must be at least ${min} characters",
    max: "'${name}' cannot be longer than ${max} characters",
    range: "'${name}' must be between ${min} and ${max} characters"
  },
  number: {
    len: "'${name}' must equal ${len}",
    min: "'${name}' cannot be less than ${min}",
    max: "'${name}' cannot be greater than ${max}",
    range: "'${name}' must be between ${min} and ${max}"
  },
  array: {
    len: "'${name}' must be exactly ${len} in length",
    min: "'${name}' cannot be less than ${min} in length",
    max: "'${name}' cannot be greater than ${max} in length",
    range: "'${name}' must be between ${min} and ${max} in length"
  },
  pattern: {
    mismatch: "'${name}' does not match pattern ${pattern}"
  }
};
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/utils/validateUtil.js










 // Remove incorrect original ts define

var AsyncValidator = dist_web;
/**
 * Replace with template.
 *   `I'm ${name}` + { name: 'bamboo' } = I'm bamboo
 */

function replaceMessage(template, kv) {
  return template.replace(/\$\{\w+\}/g, function (str) {
    var key = str.slice(2, -1);
    return kv[key];
  });
}
/**
 * We use `async-validator` to validate rules. So have to hot replace the message with validator.
 * { required: '${name} is required' } => { required: () => 'field is required' }
 */


function convertMessages(messages, name, rule, messageVariables) {
  var kv = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, rule), {}, {
    name: name,
    enum: (rule.enum || []).join(', ')
  });

  var replaceFunc = function replaceFunc(template, additionalKV) {
    return function () {
      return replaceMessage(template, (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, kv), additionalKV));
    };
  };
  /* eslint-disable no-param-reassign */


  function fillTemplate(source) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Object.keys(source).forEach(function (ruleName) {
      var value = source[ruleName];

      if (typeof value === 'string') {
        target[ruleName] = replaceFunc(value, messageVariables);
      } else if (value && (0,esm_typeof/* default */.Z)(value) === 'object') {
        target[ruleName] = {};
        fillTemplate(value, target[ruleName]);
      } else {
        target[ruleName] = value;
      }
    });
    return target;
  }
  /* eslint-enable */


  return fillTemplate(setValues({}, defaultValidateMessages, messages));
}

function validateRule(_x, _x2, _x3, _x4, _x5) {
  return _validateRule.apply(this, arguments);
}
/**
 * We use `async-validator` to validate the value.
 * But only check one value in a time to avoid namePath validate issue.
 */


function _validateRule() {
  _validateRule = (0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee2(name, value, rule, options, messageVariables) {
    var cloneRule, subRuleField, validator, messages, result, subResults;
    return regenerator_default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cloneRule = (0,objectSpread2/* default */.Z)({}, rule); // We should special handle array validate

            subRuleField = null;

            if (cloneRule && cloneRule.type === 'array' && cloneRule.defaultField) {
              subRuleField = cloneRule.defaultField;
              delete cloneRule.defaultField;
            }

            validator = new AsyncValidator((0,defineProperty/* default */.Z)({}, name, [cloneRule]));
            messages = convertMessages(options.validateMessages, name, cloneRule, messageVariables);
            validator.messages(messages);
            result = [];
            _context2.prev = 7;
            _context2.next = 10;
            return Promise.resolve(validator.validate((0,defineProperty/* default */.Z)({}, name, value), (0,objectSpread2/* default */.Z)({}, options)));

          case 10:
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](7);

            if (_context2.t0.errors) {
              result = _context2.t0.errors.map(function (_ref2, index) {
                var message = _ref2.message;
                return (// Wrap ReactNode with `key`

                  /*#__PURE__*/

                  /*#__PURE__*/
                  external_React_.isValidElement(message) ? /*#__PURE__*/external_React_.cloneElement(message, {
                    key: "error_".concat(index)
                  }) : message
                );
              });
            } else {
              console.error(_context2.t0);
              result = [messages.default()];
            }

          case 15:
            if (!(!result.length && subRuleField)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 18;
            return Promise.all(value.map(function (subValue, i) {
              return validateRule("".concat(name, ".").concat(i), subValue, subRuleField, options, messageVariables);
            }));

          case 18:
            subResults = _context2.sent;
            return _context2.abrupt("return", subResults.reduce(function (prev, errors) {
              return [].concat((0,toConsumableArray/* default */.Z)(prev), (0,toConsumableArray/* default */.Z)(errors));
            }, []));

          case 20:
            return _context2.abrupt("return", result);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 12]]);
  }));
  return _validateRule.apply(this, arguments);
}

function validateRules(namePath, value, rules, options, validateFirst, messageVariables) {
  var name = namePath.join('.'); // Fill rule with context

  var filledRules = rules.map(function (currentRule) {
    var originValidatorFunc = currentRule.validator;

    if (!originValidatorFunc) {
      return currentRule;
    }

    return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, currentRule), {}, {
      validator: function validator(rule, val, callback) {
        var hasPromise = false; // Wrap callback only accept when promise not provided

        var wrappedCallback = function wrappedCallback() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          } // Wait a tick to make sure return type is a promise


          Promise.resolve().then(function () {
            (0,warning/* default */.ZP)(!hasPromise, 'Your validator function has already return a promise. `callback` will be ignored.');

            if (!hasPromise) {
              callback.apply(void 0, args);
            }
          });
        }; // Get promise


        var promise = originValidatorFunc(rule, val, wrappedCallback);
        hasPromise = promise && typeof promise.then === 'function' && typeof promise.catch === 'function';
        /**
         * 1. Use promise as the first priority.
         * 2. If promise not exist, use callback with warning instead
         */

        (0,warning/* default */.ZP)(hasPromise, '`callback` is deprecated. Please return a promise instead.');

        if (hasPromise) {
          promise.then(function () {
            callback();
          }).catch(function (err) {
            callback(err || ' ');
          });
        }
      }
    });
  });
  var summaryPromise;

  if (validateFirst === true) {
    // >>>>> Validate by serialization
    summaryPromise = new Promise( /*#__PURE__*/function () {
      var _ref = (0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee(resolve, reject) {
        var i, errors;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                i = 0;

              case 1:
                if (!(i < filledRules.length)) {
                  _context.next = 11;
                  break;
                }

                _context.next = 4;
                return validateRule(name, value, filledRules[i], options, messageVariables);

              case 4:
                errors = _context.sent;

                if (!errors.length) {
                  _context.next = 8;
                  break;
                }

                reject(errors);
                return _context.abrupt("return");

              case 8:
                i += 1;
                _context.next = 1;
                break;

              case 11:
                /* eslint-enable */
                resolve([]);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x6, _x7) {
        return _ref.apply(this, arguments);
      };
    }());
  } else {
    // >>>>> Validate by parallel
    var rulePromises = filledRules.map(function (rule) {
      return validateRule(name, value, rule, options, messageVariables);
    });
    summaryPromise = (validateFirst ? finishOnFirstFailed(rulePromises) : finishOnAllFailed(rulePromises)).then(function (errors) {
      if (!errors.length) {
        return [];
      }

      return Promise.reject(errors);
    });
  } // Internal catch error to avoid console error log.


  summaryPromise.catch(function (e) {
    return e;
  });
  return summaryPromise;
}

function finishOnAllFailed(_x8) {
  return _finishOnAllFailed.apply(this, arguments);
}

function _finishOnAllFailed() {
  _finishOnAllFailed = (0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee3(rulePromises) {
    return regenerator_default().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", Promise.all(rulePromises).then(function (errorsList) {
              var _ref3;

              var errors = (_ref3 = []).concat.apply(_ref3, (0,toConsumableArray/* default */.Z)(errorsList));

              return errors;
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _finishOnAllFailed.apply(this, arguments);
}

function finishOnFirstFailed(_x9) {
  return _finishOnFirstFailed.apply(this, arguments);
}

function _finishOnFirstFailed() {
  _finishOnFirstFailed = (0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee4(rulePromises) {
    var count;
    return regenerator_default().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            count = 0;
            return _context4.abrupt("return", new Promise(function (resolve) {
              rulePromises.forEach(function (promise) {
                promise.then(function (errors) {
                  if (errors.length) {
                    resolve(errors);
                  }

                  count += 1;

                  if (count === rulePromises.length) {
                    resolve([]);
                  }
                });
              });
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _finishOnFirstFailed.apply(this, arguments);
}
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/Field.js


















function requireUpdate(shouldUpdate, prev, next, prevValue, nextValue, info) {
  if (typeof shouldUpdate === 'function') {
    return shouldUpdate(prev, next, 'source' in info ? {
      source: info.source
    } : {});
  }

  return prevValue !== nextValue;
} // We use Class instead of Hooks here since it will cost much code by using Hooks.


var Field = /*#__PURE__*/function (_React$Component) {
  (0,inherits/* default */.Z)(Field, _React$Component);

  var _super = (0,createSuper/* default */.Z)(Field); // ============================== Subscriptions ==============================


  function Field(props) {
    var _this;

    (0,classCallCheck/* default */.Z)(this, Field);

    _this = _super.call(this, props);
    _this.state = {
      resetCount: 0
    };
    _this.cancelRegisterFunc = null;
    _this.mounted = false;
    /**
     * Follow state should not management in State since it will async update by React.
     * This makes first render of form can not get correct state value.
     */

    _this.touched = false;
    /** Mark when touched & validated. Currently only used for `dependencies` */

    _this.dirty = false;
    _this.validatePromise = null;
    _this.errors = [];

    _this.cancelRegister = function () {
      var _this$props = _this.props,
          preserve = _this$props.preserve,
          isListField = _this$props.isListField,
          name = _this$props.name;

      if (_this.cancelRegisterFunc) {
        _this.cancelRegisterFunc(isListField, preserve, getNamePath(name));
      }

      _this.cancelRegisterFunc = null;
    }; // ================================== Utils ==================================


    _this.getNamePath = function () {
      var _this$props2 = _this.props,
          name = _this$props2.name,
          fieldContext = _this$props2.fieldContext;
      var _fieldContext$prefixN = fieldContext.prefixName,
          prefixName = _fieldContext$prefixN === void 0 ? [] : _fieldContext$prefixN;
      return name !== undefined ? [].concat((0,toConsumableArray/* default */.Z)(prefixName), (0,toConsumableArray/* default */.Z)(name)) : [];
    };

    _this.getRules = function () {
      var _this$props3 = _this.props,
          _this$props3$rules = _this$props3.rules,
          rules = _this$props3$rules === void 0 ? [] : _this$props3$rules,
          fieldContext = _this$props3.fieldContext;
      return rules.map(function (rule) {
        if (typeof rule === 'function') {
          return rule(fieldContext);
        }

        return rule;
      });
    };

    _this.refresh = function () {
      if (!_this.mounted) return;
      /**
       * Clean up current node.
       */

      _this.setState(function (_ref) {
        var resetCount = _ref.resetCount;
        return {
          resetCount: resetCount + 1
        };
      });
    }; // ========================= Field Entity Interfaces =========================
    // Trigger by store update. Check if need update the component


    _this.onStoreChange = function (prevStore, namePathList, info) {
      var _this$props4 = _this.props,
          shouldUpdate = _this$props4.shouldUpdate,
          _this$props4$dependen = _this$props4.dependencies,
          dependencies = _this$props4$dependen === void 0 ? [] : _this$props4$dependen,
          onReset = _this$props4.onReset;
      var store = info.store;

      var namePath = _this.getNamePath();

      var prevValue = _this.getValue(prevStore);

      var curValue = _this.getValue(store);

      var namePathMatch = namePathList && containsNamePath(namePathList, namePath); // `setFieldsValue` is a quick access to update related status

      if (info.type === 'valueUpdate' && info.source === 'external' && prevValue !== curValue) {
        _this.touched = true;
        _this.dirty = true;
        _this.validatePromise = null;
        _this.errors = [];
      }

      switch (info.type) {
        case 'reset':
          if (!namePathList || namePathMatch) {
            // Clean up state
            _this.touched = false;
            _this.dirty = false;
            _this.validatePromise = null;
            _this.errors = [];

            if (onReset) {
              onReset();
            }

            _this.refresh();

            return;
          }

          break;

        case 'setField':
          {
            if (namePathMatch) {
              var data = info.data;

              if ('touched' in data) {
                _this.touched = data.touched;
              }

              if ('validating' in data && !('originRCField' in data)) {
                _this.validatePromise = data.validating ? Promise.resolve([]) : null;
              }

              if ('errors' in data) {
                _this.errors = data.errors || [];
              }

              _this.dirty = true;

              _this.reRender();

              return;
            } // Handle update by `setField` with `shouldUpdate`


            if (shouldUpdate && !namePath.length && requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info)) {
              _this.reRender();

              return;
            }

            break;
          }

        case 'dependenciesUpdate':
          {
            /**
             * Trigger when marked `dependencies` updated. Related fields will all update
             */
            var dependencyList = dependencies.map(getNamePath); // No need for `namePathMath` check and `shouldUpdate` check, since `valueUpdate` will be
            // emitted earlier and they will work there
            // If set it may cause unnecessary twice rerendering

            if (dependencyList.some(function (dependency) {
              return containsNamePath(info.relatedFields, dependency);
            })) {
              _this.reRender();

              return;
            }

            break;
          }

        default:
          // 1. If `namePath` exists in `namePathList`, means it's related value and should update
          //      For example <List name="list"><Field name={['list', 0]}></List>
          //      If `namePathList` is [['list']] (List value update), Field should be updated
          //      If `namePathList` is [['list', 0]] (Field value update), List shouldn't be updated
          // 2.
          //   2.1 If `dependencies` is set, `name` is not set and `shouldUpdate` is not set,
          //       don't use `shouldUpdate`. `dependencies` is view as a shortcut if `shouldUpdate`
          //       is not provided
          //   2.2 If `shouldUpdate` provided, use customize logic to update the field
          //       else to check if value changed
          if (namePathMatch || (!dependencies.length || namePath.length || shouldUpdate) && requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info)) {
            _this.reRender();

            return;
          }

          break;
      }

      if (shouldUpdate === true) {
        _this.reRender();
      }
    };

    _this.validateRules = function (options) {
      // We should fixed namePath & value to avoid developer change then by form function
      var namePath = _this.getNamePath();

      var currentValue = _this.getValue(); // Force change to async to avoid rule OOD under renderProps field


      var rootPromise = Promise.resolve().then(function () {
        if (!_this.mounted) {
          return [];
        }

        var _this$props5 = _this.props,
            _this$props5$validate = _this$props5.validateFirst,
            validateFirst = _this$props5$validate === void 0 ? false : _this$props5$validate,
            messageVariables = _this$props5.messageVariables;

        var _ref2 = options || {},
            triggerName = _ref2.triggerName;

        var filteredRules = _this.getRules();

        if (triggerName) {
          filteredRules = filteredRules.filter(function (rule) {
            var validateTrigger = rule.validateTrigger;

            if (!validateTrigger) {
              return true;
            }

            var triggerList = typeUtil_toArray(validateTrigger);
            return triggerList.includes(triggerName);
          });
        }

        var promise = validateRules(namePath, currentValue, filteredRules, options, validateFirst, messageVariables);
        promise.catch(function (e) {
          return e;
        }).then(function () {
          var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          if (_this.validatePromise === rootPromise) {
            _this.validatePromise = null;
            _this.errors = errors;

            _this.reRender();
          }
        });
        return promise;
      });
      _this.validatePromise = rootPromise;
      _this.dirty = true;
      _this.errors = []; // Force trigger re-render since we need sync renderProps with new meta

      _this.reRender();

      return rootPromise;
    };

    _this.isFieldValidating = function () {
      return !!_this.validatePromise;
    };

    _this.isFieldTouched = function () {
      return _this.touched;
    };

    _this.isFieldDirty = function () {
      return _this.dirty;
    };

    _this.getErrors = function () {
      return _this.errors;
    };

    _this.isListField = function () {
      return _this.props.isListField;
    };

    _this.isList = function () {
      return _this.props.isList;
    };

    _this.isPreserve = function () {
      return _this.props.preserve;
    }; // ============================= Child Component =============================


    _this.getMeta = function () {
      // Make error & validating in cache to save perf
      _this.prevValidating = _this.isFieldValidating();
      var meta = {
        touched: _this.isFieldTouched(),
        validating: _this.prevValidating,
        errors: _this.errors,
        name: _this.getNamePath()
      };
      return meta;
    }; // Only return validate child node. If invalidate, will do nothing about field.


    _this.getOnlyChild = function (children) {
      // Support render props
      if (typeof children === 'function') {
        var meta = _this.getMeta();

        return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, _this.getOnlyChild(children(_this.getControlled(), meta, _this.props.fieldContext))), {}, {
          isFunction: true
        });
      } // Filed element only


      var childList = (0,toArray/* default */.Z)(children);

      if (childList.length !== 1 || ! /*#__PURE__*/external_React_.isValidElement(childList[0])) {
        return {
          child: childList,
          isFunction: false
        };
      }

      return {
        child: childList[0],
        isFunction: false
      };
    }; // ============================== Field Control ==============================


    _this.getValue = function (store) {
      var getFieldsValue = _this.props.fieldContext.getFieldsValue;

      var namePath = _this.getNamePath();

      return getValue(store || getFieldsValue(true), namePath);
    };

    _this.getControlled = function () {
      var childProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _this$props6 = _this.props,
          trigger = _this$props6.trigger,
          validateTrigger = _this$props6.validateTrigger,
          getValueFromEvent = _this$props6.getValueFromEvent,
          normalize = _this$props6.normalize,
          valuePropName = _this$props6.valuePropName,
          getValueProps = _this$props6.getValueProps,
          fieldContext = _this$props6.fieldContext;
      var mergedValidateTrigger = validateTrigger !== undefined ? validateTrigger : fieldContext.validateTrigger;

      var namePath = _this.getNamePath();

      var getInternalHooks = fieldContext.getInternalHooks,
          getFieldsValue = fieldContext.getFieldsValue;

      var _getInternalHooks = getInternalHooks(HOOK_MARK),
          dispatch = _getInternalHooks.dispatch;

      var value = _this.getValue();

      var mergedGetValueProps = getValueProps || function (val) {
        return (0,defineProperty/* default */.Z)({}, valuePropName, val);
      }; // eslint-disable-next-line @typescript-eslint/no-explicit-any


      var originTriggerFunc = childProps[trigger];

      var control = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, childProps), mergedGetValueProps(value)); // Add trigger


      control[trigger] = function () {
        // Mark as touched
        _this.touched = true;
        _this.dirty = true;
        var newValue;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (getValueFromEvent) {
          newValue = getValueFromEvent.apply(void 0, args);
        } else {
          newValue = defaultGetValueFromEvent.apply(void 0, [valuePropName].concat(args));
        }

        if (normalize) {
          newValue = normalize(newValue, value, getFieldsValue(true));
        }

        dispatch({
          type: 'updateValue',
          namePath: namePath,
          value: newValue
        });

        if (originTriggerFunc) {
          originTriggerFunc.apply(void 0, args);
        }
      }; // Add validateTrigger


      var validateTriggerList = typeUtil_toArray(mergedValidateTrigger || []);
      validateTriggerList.forEach(function (triggerName) {
        // Wrap additional function of component, so that we can get latest value from store
        var originTrigger = control[triggerName];

        control[triggerName] = function () {
          if (originTrigger) {
            originTrigger.apply(void 0, arguments);
          } // Always use latest rules


          var rules = _this.props.rules;

          if (rules && rules.length) {
            // We dispatch validate to root,
            // since it will update related data with other field with same name
            dispatch({
              type: 'validateField',
              namePath: namePath,
              triggerName: triggerName
            });
          }
        };
      });
      return control;
    }; // Register on init


    if (props.fieldContext) {
      var getInternalHooks = props.fieldContext.getInternalHooks;

      var _getInternalHooks2 = getInternalHooks(HOOK_MARK),
          initEntityValue = _getInternalHooks2.initEntityValue;

      initEntityValue((0,assertThisInitialized/* default */.Z)(_this));
    }

    return _this;
  }

  (0,createClass/* default */.Z)(Field, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props7 = this.props,
          shouldUpdate = _this$props7.shouldUpdate,
          fieldContext = _this$props7.fieldContext;
      this.mounted = true; // Register on init

      if (fieldContext) {
        var getInternalHooks = fieldContext.getInternalHooks;

        var _getInternalHooks3 = getInternalHooks(HOOK_MARK),
            registerField = _getInternalHooks3.registerField;

        this.cancelRegisterFunc = registerField(this);
      } // One more render for component in case fields not ready


      if (shouldUpdate === true) {
        this.reRender();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cancelRegister();
      this.mounted = false;
    }
  }, {
    key: "reRender",
    value: function reRender() {
      if (!this.mounted) return;
      this.forceUpdate();
    }
  }, {
    key: "render",
    value: function render() {
      var resetCount = this.state.resetCount;
      var children = this.props.children;

      var _this$getOnlyChild = this.getOnlyChild(children),
          child = _this$getOnlyChild.child,
          isFunction = _this$getOnlyChild.isFunction; // Not need to `cloneElement` since user can handle this in render function self


      var returnChildNode;

      if (isFunction) {
        returnChildNode = child;
      } else if ( /*#__PURE__*/external_React_.isValidElement(child)) {
        returnChildNode = /*#__PURE__*/external_React_.cloneElement(child, this.getControlled(child.props));
      } else {
        (0,warning/* default */.ZP)(!child, '`children` of Field is not validate ReactElement.');
        returnChildNode = child;
      }

      return /*#__PURE__*/external_React_.createElement(external_React_.Fragment, {
        key: resetCount
      }, returnChildNode);
    }
  }]);

  return Field;
}(external_React_.Component);

Field.contextType = FieldContext;
Field.defaultProps = {
  trigger: 'onChange',
  valuePropName: 'value'
};

function WrapperField(_ref4) {
  var name = _ref4.name,
      restProps = (0,objectWithoutProperties/* default */.Z)(_ref4, ["name"]);

  var fieldContext = external_React_.useContext(FieldContext);
  var namePath = name !== undefined ? getNamePath(name) : undefined;
  var key = 'keep';

  if (!restProps.isListField) {
    key = "_".concat((namePath || []).join('_'));
  } // Warning if it's a directly list field.
  // We can still support multiple level field preserve.


  if (false) {}

  return /*#__PURE__*/external_React_.createElement(Field, (0,esm_extends/* default */.Z)({
    key: key,
    name: namePath
  }, restProps, {
    fieldContext: fieldContext
  }));
}

/* harmony default export */ const es_Field = (WrapperField);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/List.js








var List = function List(_ref) {
  var name = _ref.name,
      initialValue = _ref.initialValue,
      children = _ref.children,
      rules = _ref.rules,
      validateTrigger = _ref.validateTrigger;
  var context = external_React_.useContext(FieldContext);
  var keyRef = external_React_.useRef({
    keys: [],
    id: 0
  });
  var keyManager = keyRef.current; // User should not pass `children` as other type.

  if (typeof children !== 'function') {
    (0,warning/* default */.ZP)(false, 'Form.List only accepts function as children.');
    return null;
  }

  var parentPrefixName = getNamePath(context.prefixName) || [];
  var prefixName = [].concat((0,toConsumableArray/* default */.Z)(parentPrefixName), (0,toConsumableArray/* default */.Z)(getNamePath(name)));

  var shouldUpdate = function shouldUpdate(prevValue, nextValue, _ref2) {
    var source = _ref2.source;

    if (source === 'internal') {
      return false;
    }

    return prevValue !== nextValue;
  };

  return /*#__PURE__*/external_React_.createElement(FieldContext.Provider, {
    value: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, context), {}, {
      prefixName: prefixName
    })
  }, /*#__PURE__*/external_React_.createElement(es_Field, {
    name: [],
    shouldUpdate: shouldUpdate,
    rules: rules,
    validateTrigger: validateTrigger,
    initialValue: initialValue,
    isList: true
  }, function (_ref3, meta) {
    var _ref3$value = _ref3.value,
        value = _ref3$value === void 0 ? [] : _ref3$value,
        onChange = _ref3.onChange;
    var getFieldValue = context.getFieldValue;

    var getNewValue = function getNewValue() {
      var values = getFieldValue(prefixName || []);
      return values || [];
    };
    /**
     * Always get latest value in case user update fields by `form` api.
     */


    var operations = {
      add: function add(defaultValue, index) {
        // Mapping keys
        var newValue = getNewValue();

        if (index >= 0 && index <= newValue.length) {
          keyManager.keys = [].concat((0,toConsumableArray/* default */.Z)(keyManager.keys.slice(0, index)), [keyManager.id], (0,toConsumableArray/* default */.Z)(keyManager.keys.slice(index)));
          onChange([].concat((0,toConsumableArray/* default */.Z)(newValue.slice(0, index)), [defaultValue], (0,toConsumableArray/* default */.Z)(newValue.slice(index))));
        } else {
          if (false) {}

          keyManager.keys = [].concat((0,toConsumableArray/* default */.Z)(keyManager.keys), [keyManager.id]);
          onChange([].concat((0,toConsumableArray/* default */.Z)(newValue), [defaultValue]));
        }

        keyManager.id += 1;
      },
      remove: function remove(index) {
        var newValue = getNewValue();
        var indexSet = new Set(Array.isArray(index) ? index : [index]);

        if (indexSet.size <= 0) {
          return;
        }

        keyManager.keys = keyManager.keys.filter(function (_, keysIndex) {
          return !indexSet.has(keysIndex);
        }); // Trigger store change

        onChange(newValue.filter(function (_, valueIndex) {
          return !indexSet.has(valueIndex);
        }));
      },
      move: function move(from, to) {
        if (from === to) {
          return;
        }

        var newValue = getNewValue(); // Do not handle out of range

        if (from < 0 || from >= newValue.length || to < 0 || to >= newValue.length) {
          return;
        }

        keyManager.keys = valueUtil_move(keyManager.keys, from, to); // Trigger store change

        onChange(valueUtil_move(newValue, from, to));
      }
    };
    var listValue = value || [];

    if (!Array.isArray(listValue)) {
      listValue = [];

      if (false) {}
    }

    return children(listValue.map(function (__, index) {
      var key = keyManager.keys[index];

      if (key === undefined) {
        keyManager.keys[index] = keyManager.id;
        key = keyManager.keys[index];
        keyManager.id += 1;
      }

      return {
        name: index,
        key: key,
        isListField: true
      };
    }), operations, meta);
  }));
};

/* harmony default export */ const es_List = (List);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js + 1 modules
var slicedToArray = __webpack_require__(6240);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/utils/asyncUtil.js
function allPromiseFinish(promiseList) {
  var hasError = false;
  var count = promiseList.length;
  var results = [];

  if (!promiseList.length) {
    return Promise.resolve([]);
  }

  return new Promise(function (resolve, reject) {
    promiseList.forEach(function (promise, index) {
      promise.catch(function (e) {
        hasError = true;
        return e;
      }).then(function (result) {
        count -= 1;
        results[index] = result;

        if (count > 0) {
          return;
        }

        if (hasError) {
          reject(results);
        }

        resolve(results);
      });
    });
  });
}
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/utils/NameMap.js





var SPLIT = '__@field_split__';
/**
 * Convert name path into string to fast the fetch speed of Map.
 */

function normalize(namePath) {
  return namePath.map(function (cell) {
    return "".concat((0,esm_typeof/* default */.Z)(cell), ":").concat(cell);
  }) // Magic split
  .join(SPLIT);
}
/**
 * NameMap like a `Map` but accepts `string[]` as key.
 */


var NameMap = /*#__PURE__*/function () {
  function NameMap() {
    (0,classCallCheck/* default */.Z)(this, NameMap);

    this.kvs = new Map();
  }

  (0,createClass/* default */.Z)(NameMap, [{
    key: "set",
    value: function set(key, value) {
      this.kvs.set(normalize(key), value);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.kvs.get(normalize(key));
    }
  }, {
    key: "update",
    value: function update(key, updater) {
      var origin = this.get(key);
      var next = updater(origin);

      if (!next) {
        this.delete(key);
      } else {
        this.set(key, next);
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      this.kvs.delete(normalize(key));
    } // Since we only use this in test, let simply realize this

  }, {
    key: "map",
    value: function map(callback) {
      return (0,toConsumableArray/* default */.Z)(this.kvs.entries()).map(function (_ref) {
        var _ref2 = (0,slicedToArray/* default */.Z)(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        var cells = key.split(SPLIT);
        return callback({
          key: cells.map(function (cell) {
            var _cell$match = cell.match(/^([^:]*):(.*)$/),
                _cell$match2 = (0,slicedToArray/* default */.Z)(_cell$match, 3),
                type = _cell$match2[1],
                unit = _cell$match2[2];

            return type === 'number' ? Number(unit) : unit;
          }),
          value: value
        });
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var json = {};
      this.map(function (_ref3) {
        var key = _ref3.key,
            value = _ref3.value;
        json[key.join('.')] = value;
        return null;
      });
      return json;
    }
  }]);

  return NameMap;
}();

/* harmony default export */ const utils_NameMap = (NameMap);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/useForm.js












var FormStore = function FormStore(forceRootUpdate) {
  var _this = this;

  (0,classCallCheck/* default */.Z)(this, FormStore);

  this.formHooked = false;
  this.subscribable = true;
  this.store = {};
  this.fieldEntities = [];
  this.initialValues = {};
  this.callbacks = {};
  this.validateMessages = null;
  this.preserve = null;
  this.lastValidatePromise = null;

  this.getForm = function () {
    return {
      getFieldValue: _this.getFieldValue,
      getFieldsValue: _this.getFieldsValue,
      getFieldError: _this.getFieldError,
      getFieldsError: _this.getFieldsError,
      isFieldsTouched: _this.isFieldsTouched,
      isFieldTouched: _this.isFieldTouched,
      isFieldValidating: _this.isFieldValidating,
      isFieldsValidating: _this.isFieldsValidating,
      resetFields: _this.resetFields,
      setFields: _this.setFields,
      setFieldsValue: _this.setFieldsValue,
      validateFields: _this.validateFields,
      submit: _this.submit,
      getInternalHooks: _this.getInternalHooks
    };
  }; // ======================== Internal Hooks ========================


  this.getInternalHooks = function (key) {
    if (key === HOOK_MARK) {
      _this.formHooked = true;
      return {
        dispatch: _this.dispatch,
        initEntityValue: _this.initEntityValue,
        registerField: _this.registerField,
        useSubscribe: _this.useSubscribe,
        setInitialValues: _this.setInitialValues,
        setCallbacks: _this.setCallbacks,
        setValidateMessages: _this.setValidateMessages,
        getFields: _this.getFields,
        setPreserve: _this.setPreserve
      };
    }

    (0,warning/* default */.ZP)(false, '`getInternalHooks` is internal usage. Should not call directly.');
    return null;
  };

  this.useSubscribe = function (subscribable) {
    _this.subscribable = subscribable;
  };
  /**
   * First time `setInitialValues` should update store with initial value
   */


  this.setInitialValues = function (initialValues, init) {
    _this.initialValues = initialValues || {};

    if (init) {
      _this.store = setValues({}, initialValues, _this.store);
    }
  };

  this.getInitialValue = function (namePath) {
    return getValue(_this.initialValues, namePath);
  };

  this.setCallbacks = function (callbacks) {
    _this.callbacks = callbacks;
  };

  this.setValidateMessages = function (validateMessages) {
    _this.validateMessages = validateMessages;
  };

  this.setPreserve = function (preserve) {
    _this.preserve = preserve;
  }; // ========================== Dev Warning =========================


  this.timeoutId = null;

  this.warningUnhooked = function () {
    if (false) {}
  }; // ============================ Fields ============================

  /**
   * Get registered field entities.
   * @param pure Only return field which has a `name`. Default: false
   */


  this.getFieldEntities = function () {
    var pure = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!pure) {
      return _this.fieldEntities;
    }

    return _this.fieldEntities.filter(function (field) {
      return field.getNamePath().length;
    });
  };

  this.getFieldsMap = function () {
    var pure = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var cache = new utils_NameMap();

    _this.getFieldEntities(pure).forEach(function (field) {
      var namePath = field.getNamePath();
      cache.set(namePath, field);
    });

    return cache;
  };

  this.getFieldEntitiesForNamePathList = function (nameList) {
    if (!nameList) {
      return _this.getFieldEntities(true);
    }

    var cache = _this.getFieldsMap(true);

    return nameList.map(function (name) {
      var namePath = getNamePath(name);
      return cache.get(namePath) || {
        INVALIDATE_NAME_PATH: getNamePath(name)
      };
    });
  };

  this.getFieldsValue = function (nameList, filterFunc) {
    _this.warningUnhooked();

    if (nameList === true && !filterFunc) {
      return _this.store;
    }

    var fieldEntities = _this.getFieldEntitiesForNamePathList(Array.isArray(nameList) ? nameList : null);

    var filteredNameList = [];
    fieldEntities.forEach(function (entity) {
      var _entity$isListField;

      var namePath = 'INVALIDATE_NAME_PATH' in entity ? entity.INVALIDATE_NAME_PATH : entity.getNamePath(); // Ignore when it's a list item and not specific the namePath,
      // since parent field is already take in count

      if (!nameList && ((_entity$isListField = entity.isListField) === null || _entity$isListField === void 0 ? void 0 : _entity$isListField.call(entity))) {
        return;
      }

      if (!filterFunc) {
        filteredNameList.push(namePath);
      } else {
        var meta = 'getMeta' in entity ? entity.getMeta() : null;

        if (filterFunc(meta)) {
          filteredNameList.push(namePath);
        }
      }
    });
    return cloneByNamePathList(_this.store, filteredNameList.map(getNamePath));
  };

  this.getFieldValue = function (name) {
    _this.warningUnhooked();

    var namePath = getNamePath(name);
    return getValue(_this.store, namePath);
  };

  this.getFieldsError = function (nameList) {
    _this.warningUnhooked();

    var fieldEntities = _this.getFieldEntitiesForNamePathList(nameList);

    return fieldEntities.map(function (entity, index) {
      if (entity && !('INVALIDATE_NAME_PATH' in entity)) {
        return {
          name: entity.getNamePath(),
          errors: entity.getErrors()
        };
      }

      return {
        name: getNamePath(nameList[index]),
        errors: []
      };
    });
  };

  this.getFieldError = function (name) {
    _this.warningUnhooked();

    var namePath = getNamePath(name);

    var fieldError = _this.getFieldsError([namePath])[0];

    return fieldError.errors;
  };

  this.isFieldsTouched = function () {
    _this.warningUnhooked();

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var arg0 = args[0],
        arg1 = args[1];
    var namePathList;
    var isAllFieldsTouched = false;

    if (args.length === 0) {
      namePathList = null;
    } else if (args.length === 1) {
      if (Array.isArray(arg0)) {
        namePathList = arg0.map(getNamePath);
        isAllFieldsTouched = false;
      } else {
        namePathList = null;
        isAllFieldsTouched = arg0;
      }
    } else {
      namePathList = arg0.map(getNamePath);
      isAllFieldsTouched = arg1;
    }

    var fieldEntities = _this.getFieldEntities(true);

    var isFieldTouched = function isFieldTouched(field) {
      return field.isFieldTouched();
    }; // ===== Will get fully compare when not config namePathList =====


    if (!namePathList) {
      return isAllFieldsTouched ? fieldEntities.every(isFieldTouched) : fieldEntities.some(isFieldTouched);
    } // Generate a nest tree for validate


    var map = new utils_NameMap();
    namePathList.forEach(function (shortNamePath) {
      map.set(shortNamePath, []);
    });
    fieldEntities.forEach(function (field) {
      var fieldNamePath = field.getNamePath(); // Find matched entity and put into list

      namePathList.forEach(function (shortNamePath) {
        if (shortNamePath.every(function (nameUnit, i) {
          return fieldNamePath[i] === nameUnit;
        })) {
          map.update(shortNamePath, function (list) {
            return [].concat((0,toConsumableArray/* default */.Z)(list), [field]);
          });
        }
      });
    }); // Check if NameMap value is touched

    var isNamePathListTouched = function isNamePathListTouched(entities) {
      return entities.some(isFieldTouched);
    };

    var namePathListEntities = map.map(function (_ref) {
      var value = _ref.value;
      return value;
    });
    return isAllFieldsTouched ? namePathListEntities.every(isNamePathListTouched) : namePathListEntities.some(isNamePathListTouched);
  };

  this.isFieldTouched = function (name) {
    _this.warningUnhooked();

    return _this.isFieldsTouched([name]);
  };

  this.isFieldsValidating = function (nameList) {
    _this.warningUnhooked();

    var fieldEntities = _this.getFieldEntities();

    if (!nameList) {
      return fieldEntities.some(function (testField) {
        return testField.isFieldValidating();
      });
    }

    var namePathList = nameList.map(getNamePath);
    return fieldEntities.some(function (testField) {
      var fieldNamePath = testField.getNamePath();
      return containsNamePath(namePathList, fieldNamePath) && testField.isFieldValidating();
    });
  };

  this.isFieldValidating = function (name) {
    _this.warningUnhooked();

    return _this.isFieldsValidating([name]);
  };
  /**
   * Reset Field with field `initialValue` prop.
   * Can pass `entities` or `namePathList` or just nothing.
   */


  this.resetWithFieldInitialValue = function () {
    var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}; // Create cache

    var cache = new utils_NameMap();

    var fieldEntities = _this.getFieldEntities(true);

    fieldEntities.forEach(function (field) {
      var initialValue = field.props.initialValue;
      var namePath = field.getNamePath(); // Record only if has `initialValue`

      if (initialValue !== undefined) {
        var records = cache.get(namePath) || new Set();
        records.add({
          entity: field,
          value: initialValue
        });
        cache.set(namePath, records);
      }
    }); // Reset

    var resetWithFields = function resetWithFields(entities) {
      entities.forEach(function (field) {
        var initialValue = field.props.initialValue;

        if (initialValue !== undefined) {
          var namePath = field.getNamePath();

          var formInitialValue = _this.getInitialValue(namePath);

          if (formInitialValue !== undefined) {
            // Warning if conflict with form initialValues and do not modify value
            (0,warning/* default */.ZP)(false, "Form already set 'initialValues' with path '".concat(namePath.join('.'), "'. Field can not overwrite it."));
          } else {
            var records = cache.get(namePath);

            if (records && records.size > 1) {
              // Warning if multiple field set `initialValue`and do not modify value
              (0,warning/* default */.ZP)(false, "Multiple Field with path '".concat(namePath.join('.'), "' set 'initialValue'. Can not decide which one to pick."));
            } else if (records) {
              var originValue = _this.getFieldValue(namePath); // Set `initialValue`


              if (!info.skipExist || originValue === undefined) {
                _this.store = setValue(_this.store, namePath, (0,toConsumableArray/* default */.Z)(records)[0].value);
              }
            }
          }
        }
      });
    };

    var requiredFieldEntities;

    if (info.entities) {
      requiredFieldEntities = info.entities;
    } else if (info.namePathList) {
      requiredFieldEntities = [];
      info.namePathList.forEach(function (namePath) {
        var records = cache.get(namePath);

        if (records) {
          var _requiredFieldEntitie;

          (_requiredFieldEntitie = requiredFieldEntities).push.apply(_requiredFieldEntitie, (0,toConsumableArray/* default */.Z)((0,toConsumableArray/* default */.Z)(records).map(function (r) {
            return r.entity;
          })));
        }
      });
    } else {
      requiredFieldEntities = fieldEntities;
    }

    resetWithFields(requiredFieldEntities);
  };

  this.resetFields = function (nameList) {
    _this.warningUnhooked();

    var prevStore = _this.store;

    if (!nameList) {
      _this.store = setValues({}, _this.initialValues);

      _this.resetWithFieldInitialValue();

      _this.notifyObservers(prevStore, null, {
        type: 'reset'
      });

      return;
    } // Reset by `nameList`


    var namePathList = nameList.map(getNamePath);
    namePathList.forEach(function (namePath) {
      var initialValue = _this.getInitialValue(namePath);

      _this.store = setValue(_this.store, namePath, initialValue);
    });

    _this.resetWithFieldInitialValue({
      namePathList: namePathList
    });

    _this.notifyObservers(prevStore, namePathList, {
      type: 'reset'
    });
  };

  this.setFields = function (fields) {
    _this.warningUnhooked();

    var prevStore = _this.store;
    fields.forEach(function (fieldData) {
      var name = fieldData.name,
          errors = fieldData.errors,
          data = (0,objectWithoutProperties/* default */.Z)(fieldData, ["name", "errors"]);

      var namePath = getNamePath(name); // Value

      if ('value' in data) {
        _this.store = setValue(_this.store, namePath, data.value);
      }

      _this.notifyObservers(prevStore, [namePath], {
        type: 'setField',
        data: fieldData
      });
    });
  };

  this.getFields = function () {
    var entities = _this.getFieldEntities(true);

    var fields = entities.map(function (field) {
      var namePath = field.getNamePath();
      var meta = field.getMeta();

      var fieldData = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, meta), {}, {
        name: namePath,
        value: _this.getFieldValue(namePath)
      });

      Object.defineProperty(fieldData, 'originRCField', {
        value: true
      });
      return fieldData;
    });
    return fields;
  }; // =========================== Observer ===========================

  /**
   * This only trigger when a field is on constructor to avoid we get initialValue too late
   */


  this.initEntityValue = function (entity) {
    var initialValue = entity.props.initialValue;

    if (initialValue !== undefined) {
      var namePath = entity.getNamePath();
      var prevValue = getValue(_this.store, namePath);

      if (prevValue === undefined) {
        _this.store = setValue(_this.store, namePath, initialValue);
      }
    }
  };

  this.registerField = function (entity) {
    _this.fieldEntities.push(entity); // Set initial values


    if (entity.props.initialValue !== undefined) {
      var prevStore = _this.store;

      _this.resetWithFieldInitialValue({
        entities: [entity],
        skipExist: true
      });

      _this.notifyObservers(prevStore, [entity.getNamePath()], {
        type: 'valueUpdate',
        source: 'internal'
      });
    } // un-register field callback


    return function (isListField, preserve) {
      var subNamePath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      _this.fieldEntities = _this.fieldEntities.filter(function (item) {
        return item !== entity;
      }); // Clean up store value if not preserve

      var mergedPreserve = preserve !== undefined ? preserve : _this.preserve;

      if (mergedPreserve === false && (!isListField || subNamePath.length > 1)) {
        var namePath = entity.getNamePath();
        var defaultValue = isListField ? undefined : getValue(_this.initialValues, namePath);

        if (namePath.length && _this.getFieldValue(namePath) !== defaultValue && _this.fieldEntities.every(function (field) {
          return (// Only reset when no namePath exist
            !matchNamePath(field.getNamePath(), namePath)
          );
        })) {
          _this.store = setValue(_this.store, namePath, defaultValue, true);
        }
      }
    };
  };

  this.dispatch = function (action) {
    switch (action.type) {
      case 'updateValue':
        {
          var namePath = action.namePath,
              value = action.value;

          _this.updateValue(namePath, value);

          break;
        }

      case 'validateField':
        {
          var _namePath = action.namePath,
              triggerName = action.triggerName;

          _this.validateFields([_namePath], {
            triggerName: triggerName
          });

          break;
        }

      default: // Currently we don't have other action. Do nothing.

    }
  };

  this.notifyObservers = function (prevStore, namePathList, info) {
    if (_this.subscribable) {
      var mergedInfo = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, info), {}, {
        store: _this.getFieldsValue(true)
      });

      _this.getFieldEntities().forEach(function (_ref2) {
        var onStoreChange = _ref2.onStoreChange;
        onStoreChange(prevStore, namePathList, mergedInfo);
      });
    } else {
      _this.forceRootUpdate();
    }
  };

  this.updateValue = function (name, value) {
    var namePath = getNamePath(name);
    var prevStore = _this.store;
    _this.store = setValue(_this.store, namePath, value);

    _this.notifyObservers(prevStore, [namePath], {
      type: 'valueUpdate',
      source: 'internal'
    }); // Notify dependencies children with parent update
    // We need delay to trigger validate in case Field is under render props


    var childrenFields = _this.getDependencyChildrenFields(namePath);

    if (childrenFields.length) {
      _this.validateFields(childrenFields);
    }

    _this.notifyObservers(prevStore, childrenFields, {
      type: 'dependenciesUpdate',
      relatedFields: [namePath].concat((0,toConsumableArray/* default */.Z)(childrenFields))
    }); // trigger callback function


    var onValuesChange = _this.callbacks.onValuesChange;

    if (onValuesChange) {
      var changedValues = cloneByNamePathList(_this.store, [namePath]);
      onValuesChange(changedValues, _this.getFieldsValue());
    }

    _this.triggerOnFieldsChange([namePath].concat((0,toConsumableArray/* default */.Z)(childrenFields)));
  }; // Let all child Field get update.


  this.setFieldsValue = function (store) {
    _this.warningUnhooked();

    var prevStore = _this.store;

    if (store) {
      _this.store = setValues(_this.store, store);
    }

    _this.notifyObservers(prevStore, null, {
      type: 'valueUpdate',
      source: 'external'
    });
  };

  this.getDependencyChildrenFields = function (rootNamePath) {
    var children = new Set();
    var childrenFields = [];
    var dependencies2fields = new utils_NameMap();
    /**
     * Generate maps
     * Can use cache to save perf if user report performance issue with this
     */

    _this.getFieldEntities().forEach(function (field) {
      var dependencies = field.props.dependencies;
      (dependencies || []).forEach(function (dependency) {
        var dependencyNamePath = getNamePath(dependency);
        dependencies2fields.update(dependencyNamePath, function () {
          var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
          fields.add(field);
          return fields;
        });
      });
    });

    var fillChildren = function fillChildren(namePath) {
      var fields = dependencies2fields.get(namePath) || new Set();
      fields.forEach(function (field) {
        if (!children.has(field)) {
          children.add(field);
          var fieldNamePath = field.getNamePath();

          if (field.isFieldDirty() && fieldNamePath.length) {
            childrenFields.push(fieldNamePath);
            fillChildren(fieldNamePath);
          }
        }
      });
    };

    fillChildren(rootNamePath);
    return childrenFields;
  };

  this.triggerOnFieldsChange = function (namePathList, filedErrors) {
    var onFieldsChange = _this.callbacks.onFieldsChange;

    if (onFieldsChange) {
      var fields = _this.getFields();
      /**
       * Fill errors since `fields` may be replaced by controlled fields
       */


      if (filedErrors) {
        var cache = new utils_NameMap();
        filedErrors.forEach(function (_ref3) {
          var name = _ref3.name,
              errors = _ref3.errors;
          cache.set(name, errors);
        });
        fields.forEach(function (field) {
          // eslint-disable-next-line no-param-reassign
          field.errors = cache.get(field.name) || field.errors;
        });
      }

      var changedFields = fields.filter(function (_ref4) {
        var fieldName = _ref4.name;
        return containsNamePath(namePathList, fieldName);
      });
      onFieldsChange(changedFields, fields);
    }
  }; // =========================== Validate ===========================


  this.validateFields = function (nameList, options) {
    _this.warningUnhooked();

    var provideNameList = !!nameList;
    var namePathList = provideNameList ? nameList.map(getNamePath) : []; // Collect result in promise list

    var promiseList = [];

    _this.getFieldEntities(true).forEach(function (field) {
      // Add field if not provide `nameList`
      if (!provideNameList) {
        namePathList.push(field.getNamePath());
      }
      /**
       * Recursive validate if configured.
       * TODO: perf improvement @zombieJ
       */


      if ((options === null || options === void 0 ? void 0 : options.recursive) && provideNameList) {
        var namePath = field.getNamePath();

        if ( // nameList[i] === undefined 说明是以 nameList 开头的
        // ['name'] -> ['name','list']
        namePath.every(function (nameUnit, i) {
          return nameList[i] === nameUnit || nameList[i] === undefined;
        })) {
          namePathList.push(namePath);
        }
      } // Skip if without rule


      if (!field.props.rules || !field.props.rules.length) {
        return;
      }

      var fieldNamePath = field.getNamePath(); // Add field validate rule in to promise list

      if (!provideNameList || containsNamePath(namePathList, fieldNamePath)) {
        var promise = field.validateRules((0,objectSpread2/* default */.Z)({
          validateMessages: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, defaultValidateMessages), _this.validateMessages)
        }, options)); // Wrap promise with field

        promiseList.push(promise.then(function () {
          return {
            name: fieldNamePath,
            errors: []
          };
        }).catch(function (errors) {
          return Promise.reject({
            name: fieldNamePath,
            errors: errors
          });
        }));
      }
    });

    var summaryPromise = allPromiseFinish(promiseList);
    _this.lastValidatePromise = summaryPromise; // Notify fields with rule that validate has finished and need update

    summaryPromise.catch(function (results) {
      return results;
    }).then(function (results) {
      var resultNamePathList = results.map(function (_ref5) {
        var name = _ref5.name;
        return name;
      });

      _this.notifyObservers(_this.store, resultNamePathList, {
        type: 'validateFinish'
      });

      _this.triggerOnFieldsChange(resultNamePathList, results);
    });
    var returnPromise = summaryPromise.then(function () {
      if (_this.lastValidatePromise === summaryPromise) {
        return Promise.resolve(_this.getFieldsValue(namePathList));
      }

      return Promise.reject([]);
    }).catch(function (results) {
      var errorList = results.filter(function (result) {
        return result && result.errors.length;
      });
      return Promise.reject({
        values: _this.getFieldsValue(namePathList),
        errorFields: errorList,
        outOfDate: _this.lastValidatePromise !== summaryPromise
      });
    }); // Do not throw in console

    returnPromise.catch(function (e) {
      return e;
    });
    return returnPromise;
  }; // ============================ Submit ============================


  this.submit = function () {
    _this.warningUnhooked();

    _this.validateFields().then(function (values) {
      var onFinish = _this.callbacks.onFinish;

      if (onFinish) {
        try {
          onFinish(values);
        } catch (err) {
          // Should print error if user `onFinish` callback failed
          console.error(err);
        }
      }
    }).catch(function (e) {
      var onFinishFailed = _this.callbacks.onFinishFailed;

      if (onFinishFailed) {
        onFinishFailed(e);
      }
    });
  };

  this.forceRootUpdate = forceRootUpdate;
};

function useForm(form) {
  var formRef = external_React_.useRef();

  var _React$useState = external_React_.useState({}),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      forceUpdate = _React$useState2[1];

  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      // Create a new FormStore if not provided
      var forceReRender = function forceReRender() {
        forceUpdate({});
      };

      var formStore = new FormStore(forceReRender);
      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current];
}

/* harmony default export */ const es_useForm = (useForm);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/FormContext.js



var FormContext = /*#__PURE__*/external_React_.createContext({
  triggerFormChange: function triggerFormChange() {},
  triggerFormFinish: function triggerFormFinish() {},
  registerForm: function registerForm() {},
  unregisterForm: function unregisterForm() {}
});

var FormProvider = function FormProvider(_ref) {
  var validateMessages = _ref.validateMessages,
      onFormChange = _ref.onFormChange,
      onFormFinish = _ref.onFormFinish,
      children = _ref.children;
  var formContext = external_React_.useContext(FormContext);
  var formsRef = external_React_.useRef({});
  return /*#__PURE__*/external_React_.createElement(FormContext.Provider, {
    value: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, formContext), {}, {
      validateMessages: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, formContext.validateMessages), validateMessages),
      // =========================================================
      // =                  Global Form Control                  =
      // =========================================================
      triggerFormChange: function triggerFormChange(name, changedFields) {
        if (onFormChange) {
          onFormChange(name, {
            changedFields: changedFields,
            forms: formsRef.current
          });
        }

        formContext.triggerFormChange(name, changedFields);
      },
      triggerFormFinish: function triggerFormFinish(name, values) {
        if (onFormFinish) {
          onFormFinish(name, {
            values: values,
            forms: formsRef.current
          });
        }

        formContext.triggerFormFinish(name, values);
      },
      registerForm: function registerForm(name, form) {
        if (name) {
          formsRef.current = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, formsRef.current), {}, (0,defineProperty/* default */.Z)({}, name, form));
        }

        formContext.registerForm(name, form);
      },
      unregisterForm: function unregisterForm(name) {
        var newForms = (0,objectSpread2/* default */.Z)({}, formsRef.current);

        delete newForms[name];
        formsRef.current = newForms;
        formContext.unregisterForm(name);
      }
    })
  }, children);
};


/* harmony default export */ const es_FormContext = (FormContext);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/Form.js










var Form = function Form(_ref, ref) {
  var name = _ref.name,
      initialValues = _ref.initialValues,
      fields = _ref.fields,
      form = _ref.form,
      preserve = _ref.preserve,
      children = _ref.children,
      _ref$component = _ref.component,
      Component = _ref$component === void 0 ? 'form' : _ref$component,
      validateMessages = _ref.validateMessages,
      _ref$validateTrigger = _ref.validateTrigger,
      validateTrigger = _ref$validateTrigger === void 0 ? 'onChange' : _ref$validateTrigger,
      onValuesChange = _ref.onValuesChange,
      _onFieldsChange = _ref.onFieldsChange,
      _onFinish = _ref.onFinish,
      onFinishFailed = _ref.onFinishFailed,
      restProps = (0,objectWithoutProperties/* default */.Z)(_ref, ["name", "initialValues", "fields", "form", "preserve", "children", "component", "validateMessages", "validateTrigger", "onValuesChange", "onFieldsChange", "onFinish", "onFinishFailed"]);

  var formContext = external_React_.useContext(es_FormContext); // We customize handle event since Context will makes all the consumer re-render:
  // https://reactjs.org/docs/context.html#contextprovider

  var _useForm = es_useForm(form),
      _useForm2 = (0,slicedToArray/* default */.Z)(_useForm, 1),
      formInstance = _useForm2[0];

  var _formInstance$getInte = formInstance.getInternalHooks(HOOK_MARK),
      useSubscribe = _formInstance$getInte.useSubscribe,
      setInitialValues = _formInstance$getInte.setInitialValues,
      setCallbacks = _formInstance$getInte.setCallbacks,
      setValidateMessages = _formInstance$getInte.setValidateMessages,
      setPreserve = _formInstance$getInte.setPreserve; // Pass ref with form instance


  external_React_.useImperativeHandle(ref, function () {
    return formInstance;
  }); // Register form into Context

  external_React_.useEffect(function () {
    formContext.registerForm(name, formInstance);
    return function () {
      formContext.unregisterForm(name);
    };
  }, [formContext, formInstance, name]); // Pass props to store

  setValidateMessages((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, formContext.validateMessages), validateMessages));
  setCallbacks({
    onValuesChange: onValuesChange,
    onFieldsChange: function onFieldsChange(changedFields) {
      formContext.triggerFormChange(name, changedFields);

      if (_onFieldsChange) {
        for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }

        _onFieldsChange.apply(void 0, [changedFields].concat(rest));
      }
    },
    onFinish: function onFinish(values) {
      formContext.triggerFormFinish(name, values);

      if (_onFinish) {
        _onFinish(values);
      }
    },
    onFinishFailed: onFinishFailed
  });
  setPreserve(preserve); // Set initial value, init store value when first mount

  var mountRef = external_React_.useRef(null);
  setInitialValues(initialValues, !mountRef.current);

  if (!mountRef.current) {
    mountRef.current = true;
  } // Prepare children by `children` type


  var childrenNode = children;
  var childrenRenderProps = typeof children === 'function';

  if (childrenRenderProps) {
    var values = formInstance.getFieldsValue(true);
    childrenNode = children(values, formInstance);
  } // Not use subscribe when using render props


  useSubscribe(!childrenRenderProps); // Listen if fields provided. We use ref to save prev data here to avoid additional render

  var prevFieldsRef = external_React_.useRef();
  external_React_.useEffect(function () {
    if (!isSimilar(prevFieldsRef.current || [], fields || [])) {
      formInstance.setFields(fields || []);
    }

    prevFieldsRef.current = fields;
  }, [fields, formInstance]);
  var formContextValue = external_React_.useMemo(function () {
    return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, formInstance), {}, {
      validateTrigger: validateTrigger
    });
  }, [formInstance, validateTrigger]);
  var wrapperNode = /*#__PURE__*/external_React_.createElement(FieldContext.Provider, {
    value: formContextValue
  }, childrenNode);

  if (Component === false) {
    return wrapperNode;
  }

  return /*#__PURE__*/external_React_.createElement(Component, (0,esm_extends/* default */.Z)({}, restProps, {
    onSubmit: function onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();
      formInstance.submit();
    },
    onReset: function onReset(event) {
      var _restProps$onReset;

      event.preventDefault();
      formInstance.resetFields();
      (_restProps$onReset = restProps.onReset) === null || _restProps$onReset === void 0 ? void 0 : _restProps$onReset.call(restProps, event);
    }
  }), wrapperNode);
};

/* harmony default export */ const es_Form = (Form);
;// CONCATENATED MODULE: ./node_modules/rc-field-form/es/index.js






var InternalForm = /*#__PURE__*/external_React_.forwardRef(es_Form);
var RefForm = InternalForm;
RefForm.FormProvider = FormProvider;
RefForm.Field = es_Field;
RefForm.List = es_List;
RefForm.useForm = es_useForm;

/* harmony default export */ const es = (RefForm);

/***/ }),

/***/ 567:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "V": () => (/* reexport */ CSSMotionList),
  "Z": () => (/* binding */ es)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(2064);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__(3755);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js + 1 modules
var slicedToArray = __webpack_require__(6240);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__(4933);
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(3804);
// EXTERNAL MODULE: ./node_modules/rc-util/es/Dom/findDOMNode.js
var findDOMNode = __webpack_require__(716);
// EXTERNAL MODULE: ./node_modules/rc-util/es/ref.js
var es_ref = __webpack_require__(2218);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(7855);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/rc-util/es/Dom/canUseDom.js
var canUseDom = __webpack_require__(2457);
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/util/motion.js

 // ================= Transition =================
// Event wrapper. Copy from react source code

function makePrefixMap(styleProp, eventName) {
  var prefixes = {};
  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes["Webkit".concat(styleProp)] = "webkit".concat(eventName);
  prefixes["Moz".concat(styleProp)] = "moz".concat(eventName);
  prefixes["ms".concat(styleProp)] = "MS".concat(eventName);
  prefixes["O".concat(styleProp)] = "o".concat(eventName.toLowerCase());
  return prefixes;
}

function getVendorPrefixes(domSupport, win) {
  var prefixes = {
    animationend: makePrefixMap('Animation', 'AnimationEnd'),
    transitionend: makePrefixMap('Transition', 'TransitionEnd')
  };

  if (domSupport) {
    if (!('AnimationEvent' in win)) {
      delete prefixes.animationend.animation;
    }

    if (!('TransitionEvent' in win)) {
      delete prefixes.transitionend.transition;
    }
  }

  return prefixes;
}
var vendorPrefixes = getVendorPrefixes((0,canUseDom/* default */.Z)(), typeof window !== 'undefined' ? window : {});
var style = {};

if ((0,canUseDom/* default */.Z)()) {
  var _document$createEleme = document.createElement('div');

  style = _document$createEleme.style;
}

var prefixedEventNames = {};
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  }

  var prefixMap = vendorPrefixes[eventName];

  if (prefixMap) {
    var stylePropList = Object.keys(prefixMap);
    var len = stylePropList.length;

    for (var i = 0; i < len; i += 1) {
      var styleProp = stylePropList[i];

      if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
        prefixedEventNames[eventName] = prefixMap[styleProp];
        return prefixedEventNames[eventName];
      }
    }
  }

  return '';
}
var internalAnimationEndName = getVendorPrefixedEventName('animationend');
var internalTransitionEndName = getVendorPrefixedEventName('transitionend');
var supportTransition = !!(internalAnimationEndName && internalTransitionEndName);
var animationEndName = internalAnimationEndName || 'animationend';
var transitionEndName = internalTransitionEndName || 'transitionend';
function getTransitionName(transitionName, transitionType) {
  if (!transitionName) return null;

  if ((0,esm_typeof/* default */.Z)(transitionName) === 'object') {
    var type = transitionType.replace(/-\w/g, function (match) {
      return match[1].toUpperCase();
    });
    return transitionName[type];
  }

  return "".concat(transitionName, "-").concat(transitionType);
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/interface.js
var STATUS_NONE = 'none';
var STATUS_APPEAR = 'appear';
var STATUS_ENTER = 'enter';
var STATUS_LEAVE = 'leave';
var STEP_NONE = 'none';
var STEP_PREPARE = 'prepare';
var STEP_START = 'start';
var STEP_ACTIVE = 'active';
var STEP_ACTIVATED = 'end';
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useState.js


function useMountStatus(defaultValue) {
  var destroyRef = (0,external_React_.useRef)(false);

  var _useState = (0,external_React_.useState)(defaultValue),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      val = _useState2[0],
      setVal = _useState2[1];

  function setValue(next) {
    if (!destroyRef.current) {
      setVal(next);
    }
  }

  (0,external_React_.useEffect)(function () {
    return function () {
      destroyRef.current = true;
    };
  }, []);
  return [val, setValue];
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useIsomorphicLayoutEffect.js

 // It's safe to use `useLayoutEffect` but the warning is annoying

var useIsomorphicLayoutEffect = (0,canUseDom/* default */.Z)() ? external_React_.useLayoutEffect : external_React_.useEffect;
/* harmony default export */ const hooks_useIsomorphicLayoutEffect = (useIsomorphicLayoutEffect);
// EXTERNAL MODULE: ./node_modules/rc-util/es/raf.js
var raf = __webpack_require__(5802);
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useNextFrame.js


/* harmony default export */ const useNextFrame = (function () {
  var nextFrameRef = external_React_.useRef(null);

  function cancelNextFrame() {
    raf/* default.cancel */.Z.cancel(nextFrameRef.current);
  }

  function nextFrame(callback) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    cancelNextFrame();
    var nextFrameId = (0,raf/* default */.Z)(function () {
      if (delay <= 1) {
        callback({
          isCanceled: function isCanceled() {
            return nextFrameId !== nextFrameRef.current;
          }
        });
      } else {
        nextFrame(callback, delay - 1);
      }
    });
    nextFrameRef.current = nextFrameId;
  }

  external_React_.useEffect(function () {
    return function () {
      cancelNextFrame();
    };
  }, []);
  return [nextFrame, cancelNextFrame];
});
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useStepQueue.js





var STEP_QUEUE = [STEP_PREPARE, STEP_START, STEP_ACTIVE, STEP_ACTIVATED];
/** Skip current step */

var SkipStep = false;
/** Current step should be update in */

var DoStep = true;
function isActive(step) {
  return step === STEP_ACTIVE || step === STEP_ACTIVATED;
}
/* harmony default export */ const useStepQueue = (function (status, callback) {
  var _React$useState = external_React_.useState(STEP_NONE),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      step = _React$useState2[0],
      setStep = _React$useState2[1];

  var _useNextFrame = useNextFrame(),
      _useNextFrame2 = (0,slicedToArray/* default */.Z)(_useNextFrame, 2),
      nextFrame = _useNextFrame2[0],
      cancelNextFrame = _useNextFrame2[1];

  function startQueue() {
    setStep(STEP_PREPARE);
  }

  hooks_useIsomorphicLayoutEffect(function () {
    if (step !== STEP_NONE && step !== STEP_ACTIVATED) {
      var index = STEP_QUEUE.indexOf(step);
      var nextStep = STEP_QUEUE[index + 1];
      var result = callback(step);

      if (result === SkipStep) {
        // Skip when no needed
        setStep(nextStep);
      } else {
        // Do as frame for step update
        nextFrame(function (info) {
          function doNext() {
            // Skip since current queue is ood
            if (info.isCanceled()) return;
            setStep(nextStep);
          }

          if (result === true) {
            doNext();
          } else {
            // Only promise should be async
            Promise.resolve(result).then(doNext);
          }
        });
      }
    }
  }, [status, step]);
  external_React_.useEffect(function () {
    return function () {
      cancelNextFrame();
    };
  }, []);
  return [startQueue, step];
});
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useDomMotionEvents.js



/* harmony default export */ const useDomMotionEvents = (function (callback) {
  var cacheElementRef = (0,external_React_.useRef)(); // Cache callback

  var callbackRef = (0,external_React_.useRef)(callback);
  callbackRef.current = callback; // Internal motion event handler

  var onInternalMotionEnd = external_React_.useCallback(function (event) {
    callbackRef.current(event);
  }, []); // Remove events

  function removeMotionEvents(element) {
    if (element) {
      element.removeEventListener(transitionEndName, onInternalMotionEnd);
      element.removeEventListener(animationEndName, onInternalMotionEnd);
    }
  } // Patch events


  function patchMotionEvents(element) {
    if (cacheElementRef.current && cacheElementRef.current !== element) {
      removeMotionEvents(cacheElementRef.current);
    }

    if (element && element !== cacheElementRef.current) {
      element.addEventListener(transitionEndName, onInternalMotionEnd);
      element.addEventListener(animationEndName, onInternalMotionEnd); // Save as cache in case dom removed trigger by `motionDeadline`

      cacheElementRef.current = element;
    }
  } // Clean up when removed


  external_React_.useEffect(function () {
    return function () {
      removeMotionEvents(cacheElementRef.current);
    };
  }, []);
  return [patchMotionEvents, removeMotionEvents];
});
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useStatus.js










function useStatus(supportMotion, visible, getElement, _ref) {
  var _ref$motionEnter = _ref.motionEnter,
      motionEnter = _ref$motionEnter === void 0 ? true : _ref$motionEnter,
      _ref$motionAppear = _ref.motionAppear,
      motionAppear = _ref$motionAppear === void 0 ? true : _ref$motionAppear,
      _ref$motionLeave = _ref.motionLeave,
      motionLeave = _ref$motionLeave === void 0 ? true : _ref$motionLeave,
      motionDeadline = _ref.motionDeadline,
      motionLeaveImmediately = _ref.motionLeaveImmediately,
      onAppearPrepare = _ref.onAppearPrepare,
      onEnterPrepare = _ref.onEnterPrepare,
      onLeavePrepare = _ref.onLeavePrepare,
      onAppearStart = _ref.onAppearStart,
      onEnterStart = _ref.onEnterStart,
      onLeaveStart = _ref.onLeaveStart,
      onAppearActive = _ref.onAppearActive,
      onEnterActive = _ref.onEnterActive,
      onLeaveActive = _ref.onLeaveActive,
      onAppearEnd = _ref.onAppearEnd,
      onEnterEnd = _ref.onEnterEnd,
      onLeaveEnd = _ref.onLeaveEnd,
      onVisibleChanged = _ref.onVisibleChanged; // Used for outer render usage to avoid `visible: false & status: none` to render nothing

  var _useState = useMountStatus(),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      asyncVisible = _useState2[0],
      setAsyncVisible = _useState2[1];

  var _useState3 = useMountStatus(STATUS_NONE),
      _useState4 = (0,slicedToArray/* default */.Z)(_useState3, 2),
      status = _useState4[0],
      setStatus = _useState4[1];

  var _useState5 = useMountStatus(null),
      _useState6 = (0,slicedToArray/* default */.Z)(_useState5, 2),
      style = _useState6[0],
      setStyle = _useState6[1];

  var mountedRef = (0,external_React_.useRef)(false);
  var deadlineRef = (0,external_React_.useRef)(null);
  var destroyedRef = (0,external_React_.useRef)(false); // =========================== Dom Node ===========================

  var cacheElementRef = (0,external_React_.useRef)(null);

  function getDomElement() {
    var element = getElement();
    return element || cacheElementRef.current;
  } // ========================== Motion End ==========================


  var activeRef = (0,external_React_.useRef)(false);

  function onInternalMotionEnd(event) {
    var element = getDomElement();

    if (event && !event.deadline && event.target !== element) {
      // event exists
      // not initiated by deadline
      // transitionEnd not fired by inner elements
      return;
    }

    var canEnd;

    if (status === STATUS_APPEAR && activeRef.current) {
      canEnd = onAppearEnd === null || onAppearEnd === void 0 ? void 0 : onAppearEnd(element, event);
    } else if (status === STATUS_ENTER && activeRef.current) {
      canEnd = onEnterEnd === null || onEnterEnd === void 0 ? void 0 : onEnterEnd(element, event);
    } else if (status === STATUS_LEAVE && activeRef.current) {
      canEnd = onLeaveEnd === null || onLeaveEnd === void 0 ? void 0 : onLeaveEnd(element, event);
    } // Only update status when `canEnd` and not destroyed


    if (canEnd !== false && !destroyedRef.current) {
      setStatus(STATUS_NONE);
      setStyle(null);
    }
  }

  var _useDomMotionEvents = useDomMotionEvents(onInternalMotionEnd),
      _useDomMotionEvents2 = (0,slicedToArray/* default */.Z)(_useDomMotionEvents, 1),
      patchMotionEvents = _useDomMotionEvents2[0]; // ============================= Step =============================


  var eventHandlers = external_React_.useMemo(function () {
    var _ref2, _ref3, _ref4;

    switch (status) {
      case 'appear':
        return _ref2 = {}, (0,defineProperty/* default */.Z)(_ref2, STEP_PREPARE, onAppearPrepare), (0,defineProperty/* default */.Z)(_ref2, STEP_START, onAppearStart), (0,defineProperty/* default */.Z)(_ref2, STEP_ACTIVE, onAppearActive), _ref2;

      case 'enter':
        return _ref3 = {}, (0,defineProperty/* default */.Z)(_ref3, STEP_PREPARE, onEnterPrepare), (0,defineProperty/* default */.Z)(_ref3, STEP_START, onEnterStart), (0,defineProperty/* default */.Z)(_ref3, STEP_ACTIVE, onEnterActive), _ref3;

      case 'leave':
        return _ref4 = {}, (0,defineProperty/* default */.Z)(_ref4, STEP_PREPARE, onLeavePrepare), (0,defineProperty/* default */.Z)(_ref4, STEP_START, onLeaveStart), (0,defineProperty/* default */.Z)(_ref4, STEP_ACTIVE, onLeaveActive), _ref4;

      default:
        return {};
    }
  }, [status]);

  var _useStepQueue = useStepQueue(status, function (newStep) {
    // Only prepare step can be skip
    if (newStep === STEP_PREPARE) {
      var onPrepare = eventHandlers[STEP_PREPARE];

      if (!onPrepare) {
        return SkipStep;
      }

      return onPrepare(getDomElement());
    } // Rest step is sync update
    // Rest step is sync update


    if (step in eventHandlers) {
      var _eventHandlers$step;

      setStyle(((_eventHandlers$step = eventHandlers[step]) === null || _eventHandlers$step === void 0 ? void 0 : _eventHandlers$step.call(eventHandlers, getDomElement(), null)) || null);
    }

    if (step === STEP_ACTIVE) {
      // Patch events when motion needed
      patchMotionEvents(getDomElement());

      if (motionDeadline > 0) {
        clearTimeout(deadlineRef.current);
        deadlineRef.current = setTimeout(function () {
          onInternalMotionEnd({
            deadline: true
          });
        }, motionDeadline);
      }
    }

    return DoStep;
  }),
      _useStepQueue2 = (0,slicedToArray/* default */.Z)(_useStepQueue, 2),
      startStep = _useStepQueue2[0],
      step = _useStepQueue2[1];

  var active = isActive(step);
  activeRef.current = active; // ============================ Status ============================
  // Update with new status

  hooks_useIsomorphicLayoutEffect(function () {
    setAsyncVisible(visible);
    var isMounted = mountedRef.current;
    mountedRef.current = true;

    if (!supportMotion) {
      return;
    }

    var nextStatus; // Appear

    if (!isMounted && visible && motionAppear) {
      nextStatus = STATUS_APPEAR;
    } // Enter


    if (isMounted && visible && motionEnter) {
      nextStatus = STATUS_ENTER;
    } // Leave


    if (isMounted && !visible && motionLeave || !isMounted && motionLeaveImmediately && !visible && motionLeave) {
      nextStatus = STATUS_LEAVE;
    } // Update to next status


    if (nextStatus) {
      setStatus(nextStatus);
      startStep();
    }
  }, [visible]); // ============================ Effect ============================
  // Reset when motion changed

  (0,external_React_.useEffect)(function () {
    if ( // Cancel appear
    status === STATUS_APPEAR && !motionAppear || // Cancel enter
    status === STATUS_ENTER && !motionEnter || // Cancel leave
    status === STATUS_LEAVE && !motionLeave) {
      setStatus(STATUS_NONE);
    }
  }, [motionAppear, motionEnter, motionLeave]);
  (0,external_React_.useEffect)(function () {
    return function () {
      clearTimeout(deadlineRef.current);
      destroyedRef.current = true;
    };
  }, []); // Trigger `onVisibleChanged`

  (0,external_React_.useEffect)(function () {
    if (asyncVisible !== undefined && status === STATUS_NONE) {
      onVisibleChanged === null || onVisibleChanged === void 0 ? void 0 : onVisibleChanged(asyncVisible);
    }
  }, [asyncVisible, status]); // ============================ Styles ============================

  var mergedStyle = style;

  if (eventHandlers[STEP_PREPARE] && step === STEP_START) {
    mergedStyle = (0,objectSpread2/* default */.Z)({
      transition: 'none'
    }, mergedStyle);
  }

  return [status, step, mergedStyle, asyncVisible !== null && asyncVisible !== void 0 ? asyncVisible : visible];
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(4609);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(8749);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js + 3 modules
var createSuper = __webpack_require__(3186);
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/DomWrapper.js






var DomWrapper = /*#__PURE__*/function (_React$Component) {
  (0,inherits/* default */.Z)(DomWrapper, _React$Component);

  var _super = (0,createSuper/* default */.Z)(DomWrapper);

  function DomWrapper() {
    (0,classCallCheck/* default */.Z)(this, DomWrapper);

    return _super.apply(this, arguments);
  }

  (0,createClass/* default */.Z)(DomWrapper, [{
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return DomWrapper;
}(external_React_.Component);

/* harmony default export */ const es_DomWrapper = (DomWrapper);
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/CSSMotion.js




/* eslint-disable react/default-props-match-prop-types, react/no-multi-comp, react/prop-types */











/**
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */

function genCSSMotion(config) {
  var transitionSupport = config;

  if ((0,esm_typeof/* default */.Z)(config) === 'object') {
    transitionSupport = config.transitionSupport;
  }

  function isSupportTransition(props) {
    return !!(props.motionName && transitionSupport);
  }

  var CSSMotion = /*#__PURE__*/external_React_.forwardRef(function (props, ref) {
    var _props$visible = props.visible,
        visible = _props$visible === void 0 ? true : _props$visible,
        _props$removeOnLeave = props.removeOnLeave,
        removeOnLeave = _props$removeOnLeave === void 0 ? true : _props$removeOnLeave,
        forceRender = props.forceRender,
        children = props.children,
        motionName = props.motionName,
        leavedClassName = props.leavedClassName,
        eventProps = props.eventProps;
    var supportMotion = isSupportTransition(props); // Ref to the react node, it may be a HTMLElement

    var nodeRef = (0,external_React_.useRef)(); // Ref to the dom wrapper in case ref can not pass to HTMLElement

    var wrapperNodeRef = (0,external_React_.useRef)();

    function getDomElement() {
      try {
        return (0,findDOMNode/* default */.Z)(nodeRef.current || wrapperNodeRef.current);
      } catch (e) {
        // Only happen when `motionDeadline` trigger but element removed.
        return null;
      }
    }

    var _useStatus = useStatus(supportMotion, visible, getDomElement, props),
        _useStatus2 = (0,slicedToArray/* default */.Z)(_useStatus, 4),
        status = _useStatus2[0],
        statusStep = _useStatus2[1],
        statusStyle = _useStatus2[2],
        mergedVisible = _useStatus2[3]; // Record whether content has rended
    // Will return null for un-rendered even when `removeOnLeave={false}`


    var renderedRef = external_React_.useRef(mergedVisible);

    if (mergedVisible) {
      renderedRef.current = true;
    } // ====================== Refs ======================


    var originRef = (0,external_React_.useRef)(ref);
    originRef.current = ref;
    var setNodeRef = external_React_.useCallback(function (node) {
      nodeRef.current = node;
      (0,es_ref/* fillRef */.mH)(originRef.current, node);
    }, []); // ===================== Render =====================

    var motionChildren;

    var mergedProps = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, eventProps), {}, {
      visible: visible
    });

    if (!children) {
      // No children
      motionChildren = null;
    } else if (status === STATUS_NONE || !isSupportTransition(props)) {
      // Stable children
      if (mergedVisible) {
        motionChildren = children((0,objectSpread2/* default */.Z)({}, mergedProps), setNodeRef);
      } else if (!removeOnLeave && renderedRef.current) {
        motionChildren = children((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, mergedProps), {}, {
          className: leavedClassName
        }), setNodeRef);
      } else if (forceRender) {
        motionChildren = children((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, mergedProps), {}, {
          style: {
            display: 'none'
          }
        }), setNodeRef);
      } else {
        motionChildren = null;
      }
    } else {
      var _classNames; // In motion


      var statusSuffix;

      if (statusStep === STEP_PREPARE) {
        statusSuffix = 'prepare';
      } else if (isActive(statusStep)) {
        statusSuffix = 'active';
      } else if (statusStep === STEP_START) {
        statusSuffix = 'start';
      }

      motionChildren = children((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, mergedProps), {}, {
        className: classnames_default()(getTransitionName(motionName, status), (_classNames = {}, (0,defineProperty/* default */.Z)(_classNames, getTransitionName(motionName, "".concat(status, "-").concat(statusSuffix)), statusSuffix), (0,defineProperty/* default */.Z)(_classNames, motionName, typeof motionName === 'string'), _classNames)),
        style: statusStyle
      }), setNodeRef);
    }

    return /*#__PURE__*/external_React_.createElement(es_DomWrapper, {
      ref: wrapperNodeRef
    }, motionChildren);
  });
  CSSMotion.displayName = 'CSSMotion';
  return CSSMotion;
}
/* harmony default export */ const es_CSSMotion = (genCSSMotion(supportTransition));
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(6712);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js + 1 modules
var objectWithoutProperties = __webpack_require__(6980);
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/util/diff.js


var STATUS_ADD = 'add';
var STATUS_KEEP = 'keep';
var STATUS_REMOVE = 'remove';
var STATUS_REMOVED = 'removed';
function wrapKeyToObject(key) {
  var keyObj;

  if (key && (0,esm_typeof/* default */.Z)(key) === 'object' && 'key' in key) {
    keyObj = key;
  } else {
    keyObj = {
      key: key
    };
  }

  return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, keyObj), {}, {
    key: String(keyObj.key)
  });
}
function parseKeys() {
  var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return keys.map(wrapKeyToObject);
}
function diffKeys() {
  var prevKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var currentKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var list = [];
  var currentIndex = 0;
  var currentLen = currentKeys.length;
  var prevKeyObjects = parseKeys(prevKeys);
  var currentKeyObjects = parseKeys(currentKeys); // Check prev keys to insert or keep

  prevKeyObjects.forEach(function (keyObj) {
    var hit = false;

    for (var i = currentIndex; i < currentLen; i += 1) {
      var currentKeyObj = currentKeyObjects[i];

      if (currentKeyObj.key === keyObj.key) {
        // New added keys should add before current key
        if (currentIndex < i) {
          list = list.concat(currentKeyObjects.slice(currentIndex, i).map(function (obj) {
            return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, obj), {}, {
              status: STATUS_ADD
            });
          }));
          currentIndex = i;
        }

        list.push((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, currentKeyObj), {}, {
          status: STATUS_KEEP
        }));
        currentIndex += 1;
        hit = true;
        break;
      }
    } // If not hit, it means key is removed


    if (!hit) {
      list.push((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, keyObj), {}, {
        status: STATUS_REMOVE
      }));
    }
  }); // Add rest to the list

  if (currentIndex < currentLen) {
    list = list.concat(currentKeyObjects.slice(currentIndex).map(function (obj) {
      return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, obj), {}, {
        status: STATUS_ADD
      });
    }));
  }
  /**
   * Merge same key when it remove and add again:
   *    [1 - add, 2 - keep, 1 - remove] -> [1 - keep, 2 - keep]
   */


  var keys = {};
  list.forEach(function (_ref) {
    var key = _ref.key;
    keys[key] = (keys[key] || 0) + 1;
  });
  var duplicatedKeys = Object.keys(keys).filter(function (key) {
    return keys[key] > 1;
  });
  duplicatedKeys.forEach(function (matchKey) {
    // Remove `STATUS_REMOVE` node.
    list = list.filter(function (_ref2) {
      var key = _ref2.key,
          status = _ref2.status;
      return key !== matchKey || status !== STATUS_REMOVE;
    }); // Update `STATUS_ADD` to `STATUS_KEEP`

    list.forEach(function (node) {
      if (node.key === matchKey) {
        // eslint-disable-next-line no-param-reassign
        node.status = STATUS_KEEP;
      }
    });
  });
  return list;
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/CSSMotionList.js







/* eslint react/prop-types: 0 */





var MOTION_PROP_NAMES = ['eventProps', 'visible', 'children', 'motionName', 'motionAppear', 'motionEnter', 'motionLeave', 'motionLeaveImmediately', 'motionDeadline', 'removeOnLeave', 'leavedClassName', 'onAppearStart', 'onAppearActive', 'onAppearEnd', 'onEnterStart', 'onEnterActive', 'onEnterEnd', 'onLeaveStart', 'onLeaveActive', 'onLeaveEnd'];
/**
 * Generate a CSSMotionList component with config
 * @param transitionSupport No need since CSSMotionList no longer depends on transition support
 * @param CSSMotion CSSMotion component
 */

function genCSSMotionList(transitionSupport) {
  var CSSMotion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : es_CSSMotion;

  var CSSMotionList = /*#__PURE__*/function (_React$Component) {
    (0,inherits/* default */.Z)(CSSMotionList, _React$Component);

    var _super = (0,createSuper/* default */.Z)(CSSMotionList);

    function CSSMotionList() {
      var _this;

      (0,classCallCheck/* default */.Z)(this, CSSMotionList);

      _this = _super.apply(this, arguments);
      _this.state = {
        keyEntities: []
      };

      _this.removeKey = function (removeKey) {
        _this.setState(function (_ref) {
          var keyEntities = _ref.keyEntities;
          return {
            keyEntities: keyEntities.map(function (entity) {
              if (entity.key !== removeKey) return entity;
              return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, entity), {}, {
                status: STATUS_REMOVED
              });
            })
          };
        });
      };

      return _this;
    }

    (0,createClass/* default */.Z)(CSSMotionList, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var keyEntities = this.state.keyEntities;

        var _this$props = this.props,
            component = _this$props.component,
            children = _this$props.children,
            _onVisibleChanged = _this$props.onVisibleChanged,
            restProps = (0,objectWithoutProperties/* default */.Z)(_this$props, ["component", "children", "onVisibleChanged"]);

        var Component = component || external_React_.Fragment;
        var motionProps = {};
        MOTION_PROP_NAMES.forEach(function (prop) {
          motionProps[prop] = restProps[prop];
          delete restProps[prop];
        });
        delete restProps.keys;
        return /*#__PURE__*/external_React_.createElement(Component, restProps, keyEntities.map(function (_ref2) {
          var status = _ref2.status,
              eventProps = (0,objectWithoutProperties/* default */.Z)(_ref2, ["status"]);

          var visible = status === STATUS_ADD || status === STATUS_KEEP;
          return /*#__PURE__*/external_React_.createElement(CSSMotion, (0,esm_extends/* default */.Z)({}, motionProps, {
            key: eventProps.key,
            visible: visible,
            eventProps: eventProps,
            onVisibleChanged: function onVisibleChanged(changedVisible) {
              _onVisibleChanged === null || _onVisibleChanged === void 0 ? void 0 : _onVisibleChanged(changedVisible, {
                key: eventProps.key
              });

              if (!changedVisible) {
                _this2.removeKey(eventProps.key);
              }
            }
          }), children);
        }));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(_ref3, _ref4) {
        var keys = _ref3.keys;
        var keyEntities = _ref4.keyEntities;
        var parsedKeyObjects = parseKeys(keys);
        var mixedKeyEntities = diffKeys(keyEntities, parsedKeyObjects);
        return {
          keyEntities: mixedKeyEntities.filter(function (entity) {
            var prevEntity = keyEntities.find(function (_ref5) {
              var key = _ref5.key;
              return entity.key === key;
            }); // Remove if already mark as removed

            if (prevEntity && prevEntity.status === STATUS_REMOVED && entity.status === STATUS_REMOVE) {
              return false;
            }

            return true;
          })
        };
      }
    }]);

    return CSSMotionList;
  }(external_React_.Component);

  CSSMotionList.defaultProps = {
    component: 'div'
  };
  return CSSMotionList;
}
/* harmony default export */ const CSSMotionList = (genCSSMotionList(supportTransition));
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/index.js



/* harmony default export */ const es = (es_CSSMotion);

/***/ }),

/***/ 5504:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ rc_notification_es)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js + 1 modules
var objectWithoutProperties = __webpack_require__(6980);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(6712);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__(3755);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(4609);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(8749);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js + 3 modules
var createSuper = __webpack_require__(3186);
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(3804);
// EXTERNAL MODULE: external "ReactDOM"
var external_ReactDOM_ = __webpack_require__(7196);
var external_ReactDOM_default = /*#__PURE__*/__webpack_require__.n(external_ReactDOM_);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(7855);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/rc-motion/es/index.js + 12 modules
var es = __webpack_require__(567);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(2064);
;// CONCATENATED MODULE: ./node_modules/rc-notification/es/Notice.js











var Notice = /*#__PURE__*/function (_Component) {
  (0,inherits/* default */.Z)(Notice, _Component);

  var _super = (0,createSuper/* default */.Z)(Notice);

  function Notice() {
    var _this;

    (0,classCallCheck/* default */.Z)(this, Notice);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.closeTimer = null;

    _this.close = function (e) {
      if (e) {
        e.stopPropagation();
      }

      _this.clearCloseTimer();

      var _this$props = _this.props,
          onClose = _this$props.onClose,
          noticeKey = _this$props.noticeKey;

      if (onClose) {
        onClose(noticeKey);
      }
    };

    _this.startCloseTimer = function () {
      if (_this.props.duration) {
        _this.closeTimer = window.setTimeout(function () {
          _this.close();
        }, _this.props.duration * 1000);
      }
    };

    _this.clearCloseTimer = function () {
      if (_this.closeTimer) {
        clearTimeout(_this.closeTimer);
        _this.closeTimer = null;
      }
    };

    return _this;
  }

  (0,createClass/* default */.Z)(Notice, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startCloseTimer();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.duration !== prevProps.duration || this.props.updateMark !== prevProps.updateMark || // Visible again need reset timer
      this.props.visible !== prevProps.visible && this.props.visible) {
        this.restartCloseTimer();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearCloseTimer();
    }
  }, {
    key: "restartCloseTimer",
    value: function restartCloseTimer() {
      this.clearCloseTimer();
      this.startCloseTimer();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          className = _this$props2.className,
          closable = _this$props2.closable,
          closeIcon = _this$props2.closeIcon,
          style = _this$props2.style,
          onClick = _this$props2.onClick,
          children = _this$props2.children,
          holder = _this$props2.holder;
      var componentClass = "".concat(prefixCls, "-notice");
      var dataOrAriaAttributeProps = Object.keys(this.props).reduce(function (acc, key) {
        if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
          acc[key] = _this2.props[key];
        }

        return acc;
      }, {});
      var node = /*#__PURE__*/external_React_.createElement("div", (0,esm_extends/* default */.Z)({
        className: classnames_default()(componentClass, className, (0,defineProperty/* default */.Z)({}, "".concat(componentClass, "-closable"), closable)),
        style: style,
        onMouseEnter: this.clearCloseTimer,
        onMouseLeave: this.startCloseTimer,
        onClick: onClick
      }, dataOrAriaAttributeProps), /*#__PURE__*/external_React_.createElement("div", {
        className: "".concat(componentClass, "-content")
      }, children), closable ? /*#__PURE__*/external_React_.createElement("a", {
        tabIndex: 0,
        onClick: this.close,
        className: "".concat(componentClass, "-close")
      }, closeIcon || /*#__PURE__*/external_React_.createElement("span", {
        className: "".concat(componentClass, "-close-x")
      })) : null);

      if (holder) {
        return /*#__PURE__*/external_ReactDOM_default().createPortal(node, holder);
      }

      return node;
    }
  }]);

  return Notice;
}(external_React_.Component);

Notice.defaultProps = {
  onClose: function onClose() {},
  duration: 1.5
};

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js + 2 modules
var toConsumableArray = __webpack_require__(9041);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js + 1 modules
var slicedToArray = __webpack_require__(6240);
;// CONCATENATED MODULE: ./node_modules/rc-notification/es/useNotification.js





function useNotification_useNotification(notificationInstance) {
  var createdRef = external_React_.useRef({});

  var _React$useState = external_React_.useState([]),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      elements = _React$useState2[0],
      setElements = _React$useState2[1];

  function notify(noticeProps) {
    var firstMount = true;
    notificationInstance.add(noticeProps, function (div, props) {
      var key = props.key;

      if (div && (!createdRef.current[key] || firstMount)) {
        var noticeEle = /*#__PURE__*/external_React_.createElement(Notice, (0,esm_extends/* default */.Z)({}, props, {
          holder: div
        }));
        createdRef.current[key] = noticeEle;
        setElements(function (originElements) {
          var index = originElements.findIndex(function (ele) {
            return ele.key === props.key;
          });

          if (index === -1) {
            return [].concat((0,toConsumableArray/* default */.Z)(originElements), [noticeEle]);
          }

          var cloneList = (0,toConsumableArray/* default */.Z)(originElements);

          cloneList[index] = noticeEle;
          return cloneList;
        });
      }

      firstMount = false;
    });
  }

  return [notify, /*#__PURE__*/external_React_.createElement(external_React_.Fragment, null, elements)];
}
;// CONCATENATED MODULE: ./node_modules/rc-notification/es/Notification.js














var seed = 0;
var now = Date.now();

function getUuid() {
  var id = seed;
  seed += 1;
  return "rcNotification_".concat(now, "_").concat(id);
}

var Notification = /*#__PURE__*/function (_Component) {
  (0,inherits/* default */.Z)(Notification, _Component);

  var _super = (0,createSuper/* default */.Z)(Notification);

  function Notification() {
    var _this;

    (0,classCallCheck/* default */.Z)(this, Notification);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      notices: []
    };
    _this.hookRefs = new Map();

    _this.add = function (originNotice, holderCallback) {
      var key = originNotice.key || getUuid();

      var notice = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, originNotice), {}, {
        key: key
      });

      var maxCount = _this.props.maxCount;

      _this.setState(function (previousState) {
        var notices = previousState.notices;
        var noticeIndex = notices.map(function (v) {
          return v.notice.key;
        }).indexOf(key);
        var updatedNotices = notices.concat();

        if (noticeIndex !== -1) {
          updatedNotices.splice(noticeIndex, 1, {
            notice: notice,
            holderCallback: holderCallback
          });
        } else {
          if (maxCount && notices.length >= maxCount) {
            // XXX, use key of first item to update new added (let React to move exsiting
            // instead of remove and mount). Same key was used before for both a) external
            // manual control and b) internal react 'key' prop , which is not that good.
            // eslint-disable-next-line no-param-reassign
            // zombieJ: Not know why use `updateKey`. This makes Notice infinite loop in jest.
            // Change to `updateMark` for compare instead.
            // https://github.com/react-component/notification/commit/32299e6be396f94040bfa82517eea940db947ece
            notice.key = updatedNotices[0].notice.key;
            notice.updateMark = getUuid(); // zombieJ: That's why. User may close by key directly.
            // We need record this but not re-render to avoid upper issue
            // https://github.com/react-component/notification/issues/129

            notice.userPassKey = key;
            updatedNotices.shift();
          }

          updatedNotices.push({
            notice: notice,
            holderCallback: holderCallback
          });
        }

        return {
          notices: updatedNotices
        };
      });
    };

    _this.remove = function (removeKey) {
      _this.setState(function (_ref) {
        var notices = _ref.notices;
        return {
          notices: notices.filter(function (_ref2) {
            var _ref2$notice = _ref2.notice,
                key = _ref2$notice.key,
                userPassKey = _ref2$notice.userPassKey;
            var mergedKey = userPassKey || key;
            return mergedKey !== removeKey;
          })
        };
      });
    };

    _this.noticePropsMap = {};
    return _this;
  }

  (0,createClass/* default */.Z)(Notification, [{
    key: "getTransitionName",
    value: function getTransitionName() {
      var _this$props = this.props,
          prefixCls = _this$props.prefixCls,
          animation = _this$props.animation;
      var transitionName = this.props.transitionName;

      if (!transitionName && animation) {
        transitionName = "".concat(prefixCls, "-").concat(animation);
      }

      return transitionName;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var notices = this.state.notices;
      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          className = _this$props2.className,
          closeIcon = _this$props2.closeIcon,
          style = _this$props2.style;
      var noticeKeys = [];
      notices.forEach(function (_ref3, index) {
        var notice = _ref3.notice,
            holderCallback = _ref3.holderCallback;
        var updateMark = index === notices.length - 1 ? notice.updateMark : undefined;
        var key = notice.key,
            userPassKey = notice.userPassKey;

        var noticeProps = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({
          prefixCls: prefixCls,
          closeIcon: closeIcon
        }, notice), notice.props), {}, {
          key: key,
          noticeKey: userPassKey || key,
          updateMark: updateMark,
          onClose: function onClose(noticeKey) {
            var _notice$onClose;

            _this2.remove(noticeKey);

            (_notice$onClose = notice.onClose) === null || _notice$onClose === void 0 ? void 0 : _notice$onClose.call(notice);
          },
          onClick: notice.onClick,
          children: notice.content
        }); // Give to motion


        noticeKeys.push(key);
        _this2.noticePropsMap[key] = {
          props: noticeProps,
          holderCallback: holderCallback
        };
      });
      return /*#__PURE__*/external_React_.createElement("div", {
        className: classnames_default()(prefixCls, className),
        style: style
      }, /*#__PURE__*/external_React_.createElement(es/* CSSMotionList */.V, {
        keys: noticeKeys,
        motionName: this.getTransitionName(),
        onVisibleChanged: function onVisibleChanged(changedVisible, _ref4) {
          var key = _ref4.key;

          if (!changedVisible) {
            delete _this2.noticePropsMap[key];
          }
        }
      }, function (_ref5) {
        var key = _ref5.key,
            motionClassName = _ref5.className,
            motionStyle = _ref5.style,
            visible = _ref5.visible;
        var _this2$noticePropsMap = _this2.noticePropsMap[key],
            noticeProps = _this2$noticePropsMap.props,
            holderCallback = _this2$noticePropsMap.holderCallback;

        if (holderCallback) {
          return /*#__PURE__*/external_React_.createElement("div", {
            key: key,
            className: classnames_default()(motionClassName, "".concat(prefixCls, "-hook-holder")),
            style: (0,objectSpread2/* default */.Z)({}, motionStyle),
            ref: function ref(div) {
              if (typeof key === 'undefined') {
                return;
              }

              if (div) {
                _this2.hookRefs.set(key, div);

                holderCallback(div, noticeProps);
              } else {
                _this2.hookRefs.delete(key);
              }
            }
          });
        }

        return /*#__PURE__*/external_React_.createElement(Notice, (0,esm_extends/* default */.Z)({}, noticeProps, {
          className: classnames_default()(motionClassName, noticeProps === null || noticeProps === void 0 ? void 0 : noticeProps.className),
          style: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, motionStyle), noticeProps === null || noticeProps === void 0 ? void 0 : noticeProps.style),
          visible: visible
        }));
      }));
    }
  }]);

  return Notification;
}(external_React_.Component);

Notification.newInstance = void 0;
Notification.defaultProps = {
  prefixCls: 'rc-notification',
  animation: 'fade',
  style: {
    top: 65,
    left: '50%'
  }
};

Notification.newInstance = function newNotificationInstance(properties, callback) {
  var _ref6 = properties || {},
      getContainer = _ref6.getContainer,
      props = (0,objectWithoutProperties/* default */.Z)(_ref6, ["getContainer"]);

  var div = document.createElement('div');

  if (getContainer) {
    var root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  var called = false;

  function ref(notification) {
    if (called) {
      return;
    }

    called = true;
    callback({
      notice: function notice(noticeProps) {
        notification.add(noticeProps);
      },
      removeNotice: function removeNotice(key) {
        notification.remove(key);
      },
      component: notification,
      destroy: function destroy() {
        external_ReactDOM_default().unmountComponentAtNode(div);

        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
      },
      // Hooks
      useNotification: function useNotification() {
        return useNotification_useNotification(notification);
      }
    });
  } // Only used for test case usage


  if (false) {}

  external_ReactDOM_default().render( /*#__PURE__*/external_React_.createElement(Notification, (0,esm_extends/* default */.Z)({}, props, {
    ref: ref
  })), div);
};

/* harmony default export */ const es_Notification = (Notification);
;// CONCATENATED MODULE: ./node_modules/rc-notification/es/index.js

/* harmony default export */ const rc_notification_es = (es_Notification);

/***/ }),

/***/ 8530:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireWildcard = __webpack_require__(2579);

var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(3985));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(7003));

var _createClass2 = _interopRequireDefault(__webpack_require__(9545));

var _inherits2 = _interopRequireDefault(__webpack_require__(5583));

var _createSuper2 = _interopRequireDefault(__webpack_require__(1917));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _reactDom = _interopRequireDefault(__webpack_require__(7196));

var _classnames = _interopRequireDefault(__webpack_require__(7855));

var Notice = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Notice, _Component);

  var _super = (0, _createSuper2.default)(Notice);

  function Notice() {
    var _this;

    (0, _classCallCheck2.default)(this, Notice);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.closeTimer = null;

    _this.close = function (e) {
      if (e) {
        e.stopPropagation();
      }

      _this.clearCloseTimer();

      var _this$props = _this.props,
          onClose = _this$props.onClose,
          noticeKey = _this$props.noticeKey;

      if (onClose) {
        onClose(noticeKey);
      }
    };

    _this.startCloseTimer = function () {
      if (_this.props.duration) {
        _this.closeTimer = window.setTimeout(function () {
          _this.close();
        }, _this.props.duration * 1000);
      }
    };

    _this.clearCloseTimer = function () {
      if (_this.closeTimer) {
        clearTimeout(_this.closeTimer);
        _this.closeTimer = null;
      }
    };

    return _this;
  }

  (0, _createClass2.default)(Notice, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startCloseTimer();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.duration !== prevProps.duration || this.props.updateMark !== prevProps.updateMark || // Visible again need reset timer
      this.props.visible !== prevProps.visible && this.props.visible) {
        this.restartCloseTimer();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearCloseTimer();
    }
  }, {
    key: "restartCloseTimer",
    value: function restartCloseTimer() {
      this.clearCloseTimer();
      this.startCloseTimer();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          className = _this$props2.className,
          closable = _this$props2.closable,
          closeIcon = _this$props2.closeIcon,
          style = _this$props2.style,
          onClick = _this$props2.onClick,
          children = _this$props2.children,
          holder = _this$props2.holder;
      var componentClass = "".concat(prefixCls, "-notice");
      var dataOrAriaAttributeProps = Object.keys(this.props).reduce(function (acc, key) {
        if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
          acc[key] = _this2.props[key];
        }

        return acc;
      }, {});
      var node = /*#__PURE__*/React.createElement("div", (0, _extends2.default)({
        className: (0, _classnames.default)(componentClass, className, (0, _defineProperty2.default)({}, "".concat(componentClass, "-closable"), closable)),
        style: style,
        onMouseEnter: this.clearCloseTimer,
        onMouseLeave: this.startCloseTimer,
        onClick: onClick
      }, dataOrAriaAttributeProps), /*#__PURE__*/React.createElement("div", {
        className: "".concat(componentClass, "-content")
      }, children), closable ? /*#__PURE__*/React.createElement("a", {
        tabIndex: 0,
        onClick: this.close,
        className: "".concat(componentClass, "-close")
      }, closeIcon || /*#__PURE__*/React.createElement("span", {
        className: "".concat(componentClass, "-close-x")
      })) : null);

      if (holder) {
        return /*#__PURE__*/_reactDom.default.createPortal(node, holder);
      }

      return node;
    }
  }]);
  return Notice;
}(React.Component);

exports.default = Notice;
Notice.defaultProps = {
  onClose: function onClose() {},
  duration: 1.5
};

/***/ }),

/***/ 8157:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireWildcard = __webpack_require__(2579);

var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = useNotification;

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(27));

var _extends2 = _interopRequireDefault(__webpack_require__(4772));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(9855));

var React = _interopRequireWildcard(__webpack_require__(3804));

var _Notice = _interopRequireDefault(__webpack_require__(8530));

function useNotification(notificationInstance) {
  var createdRef = React.useRef({});

  var _React$useState = React.useState([]),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      elements = _React$useState2[0],
      setElements = _React$useState2[1];

  function notify(noticeProps) {
    var firstMount = true;
    notificationInstance.add(noticeProps, function (div, props) {
      var key = props.key;

      if (div && (!createdRef.current[key] || firstMount)) {
        var noticeEle = /*#__PURE__*/React.createElement(_Notice.default, (0, _extends2.default)({}, props, {
          holder: div
        }));
        createdRef.current[key] = noticeEle;
        setElements(function (originElements) {
          var index = originElements.findIndex(function (ele) {
            return ele.key === props.key;
          });

          if (index === -1) {
            return [].concat((0, _toConsumableArray2.default)(originElements), [noticeEle]);
          }

          var cloneList = (0, _toConsumableArray2.default)(originElements);
          cloneList[index] = noticeEle;
          return cloneList;
        });
      }

      firstMount = false;
    });
  }

  return [notify, /*#__PURE__*/React.createElement(React.Fragment, null, elements)];
}

/***/ }),

/***/ 5423:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* reexport */ es_Pagination)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(6712);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(2064);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__(3755);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(4609);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(8749);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js + 3 modules
var createSuper = __webpack_require__(3186);
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(3804);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(7855);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
;// CONCATENATED MODULE: ./node_modules/rc-pagination/es/Pager.js

/* eslint react/prop-types: 0 */




var Pager = function Pager(props) {
  var _classNames;

  var prefixCls = "".concat(props.rootPrefixCls, "-item");
  var cls = classnames_default()(prefixCls, "".concat(prefixCls, "-").concat(props.page), (_classNames = {}, (0,defineProperty/* default */.Z)(_classNames, "".concat(prefixCls, "-active"), props.active), (0,defineProperty/* default */.Z)(_classNames, props.className, !!props.className), (0,defineProperty/* default */.Z)(_classNames, "".concat(prefixCls, "-disabled"), !props.page), _classNames));

  var handleClick = function handleClick() {
    props.onClick(props.page);
  };

  var handleKeyPress = function handleKeyPress(e) {
    props.onKeyPress(e, props.onClick, props.page);
  };

  return /*#__PURE__*/external_React_default().createElement("li", {
    title: props.showTitle ? props.page : null,
    className: cls,
    onClick: handleClick,
    onKeyPress: handleKeyPress,
    tabIndex: "0"
  }, props.itemRender(props.page, 'page', /*#__PURE__*/external_React_default().createElement("a", {
    rel: "nofollow"
  }, props.page)));
};

/* harmony default export */ const es_Pager = (Pager);
;// CONCATENATED MODULE: ./node_modules/rc-pagination/es/KeyCode.js
/* harmony default export */ const KeyCode = ({
  ZERO: 48,
  NINE: 57,
  NUMPAD_ZERO: 96,
  NUMPAD_NINE: 105,
  BACKSPACE: 8,
  DELETE: 46,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40
});
;// CONCATENATED MODULE: ./node_modules/rc-pagination/es/Options.js




/* eslint react/prop-types: 0 */




var Options = /*#__PURE__*/function (_React$Component) {
  (0,inherits/* default */.Z)(Options, _React$Component);

  var _super = (0,createSuper/* default */.Z)(Options);

  function Options() {
    var _this;

    (0,classCallCheck/* default */.Z)(this, Options);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      goInputText: ''
    };

    _this.buildOptionText = function (value) {
      return "".concat(value, " ").concat(_this.props.locale.items_per_page);
    };

    _this.changeSize = function (value) {
      _this.props.changeSize(Number(value));
    };

    _this.handleChange = function (e) {
      _this.setState({
        goInputText: e.target.value
      });
    };

    _this.handleBlur = function (e) {
      var _this$props = _this.props,
          goButton = _this$props.goButton,
          quickGo = _this$props.quickGo,
          rootPrefixCls = _this$props.rootPrefixCls;
      var goInputText = _this.state.goInputText;

      if (goButton || goInputText === '') {
        return;
      }

      _this.setState({
        goInputText: ''
      });

      if (e.relatedTarget && (e.relatedTarget.className.indexOf("".concat(rootPrefixCls, "-item-link")) >= 0 || e.relatedTarget.className.indexOf("".concat(rootPrefixCls, "-item")) >= 0)) {
        return;
      }

      quickGo(_this.getValidValue());
    };

    _this.go = function (e) {
      var goInputText = _this.state.goInputText;

      if (goInputText === '') {
        return;
      }

      if (e.keyCode === KeyCode.ENTER || e.type === 'click') {
        _this.setState({
          goInputText: ''
        });

        _this.props.quickGo(_this.getValidValue());
      }
    };

    return _this;
  }

  (0,createClass/* default */.Z)(Options, [{
    key: "getValidValue",
    value: function getValidValue() {
      var goInputText = this.state.goInputText; // eslint-disable-next-line no-restricted-globals

      return !goInputText || isNaN(goInputText) ? undefined : Number(goInputText);
    }
  }, {
    key: "getPageSizeOptions",
    value: function getPageSizeOptions() {
      var _this$props2 = this.props,
          pageSize = _this$props2.pageSize,
          pageSizeOptions = _this$props2.pageSizeOptions;

      if (pageSizeOptions.some(function (option) {
        return option.toString() === pageSize.toString();
      })) {
        return pageSizeOptions;
      }

      return pageSizeOptions.concat([pageSize.toString()]).sort(function (a, b) {
        // eslint-disable-next-line no-restricted-globals
        var numberA = isNaN(Number(a)) ? 0 : Number(a); // eslint-disable-next-line no-restricted-globals

        var numberB = isNaN(Number(b)) ? 0 : Number(b);
        return numberA - numberB;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          pageSize = _this$props3.pageSize,
          locale = _this$props3.locale,
          rootPrefixCls = _this$props3.rootPrefixCls,
          changeSize = _this$props3.changeSize,
          quickGo = _this$props3.quickGo,
          goButton = _this$props3.goButton,
          selectComponentClass = _this$props3.selectComponentClass,
          buildOptionText = _this$props3.buildOptionText,
          selectPrefixCls = _this$props3.selectPrefixCls,
          disabled = _this$props3.disabled;
      var goInputText = this.state.goInputText;
      var prefixCls = "".concat(rootPrefixCls, "-options");
      var Select = selectComponentClass;
      var changeSelect = null;
      var goInput = null;
      var gotoButton = null;

      if (!changeSize && !quickGo) {
        return null;
      }

      var pageSizeOptions = this.getPageSizeOptions();

      if (changeSize && Select) {
        var options = pageSizeOptions.map(function (opt, i) {
          return /*#__PURE__*/external_React_default().createElement(Select.Option, {
            key: i,
            value: opt.toString()
          }, (buildOptionText || _this2.buildOptionText)(opt));
        });
        changeSelect = /*#__PURE__*/external_React_default().createElement(Select, {
          disabled: disabled,
          prefixCls: selectPrefixCls,
          showSearch: false,
          className: "".concat(prefixCls, "-size-changer"),
          optionLabelProp: "children",
          dropdownMatchSelectWidth: false,
          value: (pageSize || pageSizeOptions[0]).toString(),
          onChange: this.changeSize,
          getPopupContainer: function getPopupContainer(triggerNode) {
            return triggerNode.parentNode;
          }
        }, options);
      }

      if (quickGo) {
        if (goButton) {
          gotoButton = typeof goButton === 'boolean' ? /*#__PURE__*/external_React_default().createElement("button", {
            type: "button",
            onClick: this.go,
            onKeyUp: this.go,
            disabled: disabled,
            className: "".concat(prefixCls, "-quick-jumper-button")
          }, locale.jump_to_confirm) : /*#__PURE__*/external_React_default().createElement("span", {
            onClick: this.go,
            onKeyUp: this.go
          }, goButton);
        }

        goInput = /*#__PURE__*/external_React_default().createElement("div", {
          className: "".concat(prefixCls, "-quick-jumper")
        }, locale.jump_to, /*#__PURE__*/external_React_default().createElement("input", {
          disabled: disabled,
          type: "text",
          value: goInputText,
          onChange: this.handleChange,
          onKeyUp: this.go,
          onBlur: this.handleBlur
        }), locale.page, gotoButton);
      }

      return /*#__PURE__*/external_React_default().createElement("li", {
        className: "".concat(prefixCls)
      }, changeSelect, goInput);
    }
  }]);

  return Options;
}((external_React_default()).Component);

Options.defaultProps = {
  pageSizeOptions: ['10', '20', '50', '100']
};
/* harmony default export */ const es_Options = (Options);
;// CONCATENATED MODULE: ./node_modules/rc-pagination/es/locale/zh_CN.js
/* harmony default export */ const zh_CN = ({
  // Options.jsx
  items_per_page: '条/页',
  jump_to: '跳至',
  jump_to_confirm: '确定',
  page: '页',
  // Pagination.jsx
  prev_page: '上一页',
  next_page: '下一页',
  prev_5: '向前 5 页',
  next_5: '向后 5 页',
  prev_3: '向前 3 页',
  next_3: '向后 3 页'
});
;// CONCATENATED MODULE: ./node_modules/rc-pagination/es/Pagination.js







/* eslint react/prop-types: 0 */








function noop() {}

function isInteger(value) {
  return (// eslint-disable-next-line no-restricted-globals
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  );
}

function defaultItemRender(page, type, element) {
  return element;
}

function calculatePage(p, state, props) {
  var pageSize = typeof p === 'undefined' ? state.pageSize : p;
  return Math.floor((props.total - 1) / pageSize) + 1;
}

var Pagination = /*#__PURE__*/function (_React$Component) {
  (0,inherits/* default */.Z)(Pagination, _React$Component);

  var _super = (0,createSuper/* default */.Z)(Pagination);

  function Pagination(props) {
    var _this;

    (0,classCallCheck/* default */.Z)(this, Pagination);

    _this = _super.call(this, props);

    _this.getJumpPrevPage = function () {
      return Math.max(1, _this.state.current - (_this.props.showLessItems ? 3 : 5));
    };

    _this.getJumpNextPage = function () {
      return Math.min(calculatePage(undefined, _this.state, _this.props), _this.state.current + (_this.props.showLessItems ? 3 : 5));
    };

    _this.getItemIcon = function (icon, label) {
      var prefixCls = _this.props.prefixCls;
      var iconNode = icon || /*#__PURE__*/external_React_default().createElement("button", {
        type: "button",
        "aria-label": label,
        className: "".concat(prefixCls, "-item-link")
      });

      if (typeof icon === 'function') {
        iconNode = /*#__PURE__*/external_React_default().createElement(icon, (0,objectSpread2/* default */.Z)({}, _this.props));
      }

      return iconNode;
    };

    _this.savePaginationNode = function (node) {
      _this.paginationNode = node;
    };

    _this.isValid = function (page) {
      return isInteger(page) && page !== _this.state.current;
    };

    _this.shouldDisplayQuickJumper = function () {
      var _this$props = _this.props,
          showQuickJumper = _this$props.showQuickJumper,
          pageSize = _this$props.pageSize,
          total = _this$props.total;

      if (total <= pageSize) {
        return false;
      }

      return showQuickJumper;
    };

    _this.handleKeyDown = function (e) {
      if (e.keyCode === KeyCode.ARROW_UP || e.keyCode === KeyCode.ARROW_DOWN) {
        e.preventDefault();
      }
    };

    _this.handleKeyUp = function (e) {
      var value = _this.getValidValue(e);

      var currentInputValue = _this.state.currentInputValue;

      if (value !== currentInputValue) {
        _this.setState({
          currentInputValue: value
        });
      }

      if (e.keyCode === KeyCode.ENTER) {
        _this.handleChange(value);
      } else if (e.keyCode === KeyCode.ARROW_UP) {
        _this.handleChange(value - 1);
      } else if (e.keyCode === KeyCode.ARROW_DOWN) {
        _this.handleChange(value + 1);
      }
    };

    _this.changePageSize = function (size) {
      var current = _this.state.current;
      var newCurrent = calculatePage(size, _this.state, _this.props);
      current = current > newCurrent ? newCurrent : current; // fix the issue:
      // Once 'total' is 0, 'current' in 'onShowSizeChange' is 0, which is not correct.

      if (newCurrent === 0) {
        // eslint-disable-next-line prefer-destructuring
        current = _this.state.current;
      }

      if (typeof size === 'number') {
        if (!('pageSize' in _this.props)) {
          _this.setState({
            pageSize: size
          });
        }

        if (!('current' in _this.props)) {
          _this.setState({
            current: current,
            currentInputValue: current
          });
        }
      }

      _this.props.onShowSizeChange(current, size);

      if ('onChange' in _this.props && _this.props.onChange) {
        _this.props.onChange(current, size);
      }
    };

    _this.handleChange = function (p) {
      var disabled = _this.props.disabled;
      var page = p;

      if (_this.isValid(page) && !disabled) {
        var currentPage = calculatePage(undefined, _this.state, _this.props);

        if (page > currentPage) {
          page = currentPage;
        } else if (page < 1) {
          page = 1;
        }

        if (!('current' in _this.props)) {
          _this.setState({
            current: page,
            currentInputValue: page
          });
        }

        var pageSize = _this.state.pageSize;

        _this.props.onChange(page, pageSize);

        return page;
      }

      return _this.state.current;
    };

    _this.prev = function () {
      if (_this.hasPrev()) {
        _this.handleChange(_this.state.current - 1);
      }
    };

    _this.next = function () {
      if (_this.hasNext()) {
        _this.handleChange(_this.state.current + 1);
      }
    };

    _this.jumpPrev = function () {
      _this.handleChange(_this.getJumpPrevPage());
    };

    _this.jumpNext = function () {
      _this.handleChange(_this.getJumpNextPage());
    };

    _this.hasPrev = function () {
      return _this.state.current > 1;
    };

    _this.hasNext = function () {
      return _this.state.current < calculatePage(undefined, _this.state, _this.props);
    };

    _this.runIfEnter = function (event, callback) {
      if (event.key === 'Enter' || event.charCode === 13) {
        for (var _len = arguments.length, restParams = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          restParams[_key - 2] = arguments[_key];
        }

        callback.apply(void 0, restParams);
      }
    };

    _this.runIfEnterPrev = function (e) {
      _this.runIfEnter(e, _this.prev);
    };

    _this.runIfEnterNext = function (e) {
      _this.runIfEnter(e, _this.next);
    };

    _this.runIfEnterJumpPrev = function (e) {
      _this.runIfEnter(e, _this.jumpPrev);
    };

    _this.runIfEnterJumpNext = function (e) {
      _this.runIfEnter(e, _this.jumpNext);
    };

    _this.handleGoTO = function (e) {
      if (e.keyCode === KeyCode.ENTER || e.type === 'click') {
        _this.handleChange(_this.state.currentInputValue);
      }
    };

    var hasOnChange = props.onChange !== noop;
    var hasCurrent = ('current' in props);

    if (hasCurrent && !hasOnChange) {
      // eslint-disable-next-line no-console
      console.warn('Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.');
    }

    var _current = props.defaultCurrent;

    if ('current' in props) {
      // eslint-disable-next-line prefer-destructuring
      _current = props.current;
    }

    var _pageSize = props.defaultPageSize;

    if ('pageSize' in props) {
      // eslint-disable-next-line prefer-destructuring
      _pageSize = props.pageSize;
    }

    _current = Math.min(_current, calculatePage(_pageSize, undefined, props));
    _this.state = {
      current: _current,
      currentInputValue: _current,
      pageSize: _pageSize
    };
    return _this;
  }

  (0,createClass/* default */.Z)(Pagination, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // When current page change, fix focused style of prev item
      // A hacky solution of https://github.com/ant-design/ant-design/issues/8948
      var prefixCls = this.props.prefixCls;

      if (prevState.current !== this.state.current && this.paginationNode) {
        var lastCurrentNode = this.paginationNode.querySelector(".".concat(prefixCls, "-item-").concat(prevState.current));

        if (lastCurrentNode && document.activeElement === lastCurrentNode) {
          lastCurrentNode.blur();
        }
      }
    }
  }, {
    key: "getValidValue",
    value: function getValidValue(e) {
      var inputValue = e.target.value;
      var allPages = calculatePage(undefined, this.state, this.props);
      var currentInputValue = this.state.currentInputValue;
      var value;

      if (inputValue === '') {
        value = inputValue; // eslint-disable-next-line no-restricted-globals
      } else if (isNaN(Number(inputValue))) {
        value = currentInputValue;
      } else if (inputValue >= allPages) {
        value = allPages;
      } else {
        value = Number(inputValue);
      }

      return value;
    }
  }, {
    key: "getShowSizeChanger",
    value: function getShowSizeChanger() {
      var _this$props2 = this.props,
          showSizeChanger = _this$props2.showSizeChanger,
          total = _this$props2.total,
          totalBoundaryShowSizeChanger = _this$props2.totalBoundaryShowSizeChanger;

      if (typeof showSizeChanger !== 'undefined') {
        return showSizeChanger;
      }

      return total > totalBoundaryShowSizeChanger;
    }
  }, {
    key: "renderPrev",
    value: function renderPrev(prevPage) {
      var _this$props3 = this.props,
          prevIcon = _this$props3.prevIcon,
          itemRender = _this$props3.itemRender;
      var prevButton = itemRender(prevPage, 'prev', this.getItemIcon(prevIcon, 'prev page'));
      var disabled = !this.hasPrev();
      return /*#__PURE__*/ /*#__PURE__*/(0,external_React_.isValidElement)(prevButton) ? /*#__PURE__*/(0,external_React_.cloneElement)(prevButton, {
        disabled: disabled
      }) : prevButton;
    }
  }, {
    key: "renderNext",
    value: function renderNext(nextPage) {
      var _this$props4 = this.props,
          nextIcon = _this$props4.nextIcon,
          itemRender = _this$props4.itemRender;
      var nextButton = itemRender(nextPage, 'next', this.getItemIcon(nextIcon, 'next page'));
      var disabled = !this.hasNext();
      return /*#__PURE__*/ /*#__PURE__*/(0,external_React_.isValidElement)(nextButton) ? /*#__PURE__*/(0,external_React_.cloneElement)(nextButton, {
        disabled: disabled
      }) : nextButton;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props5 = this.props,
          prefixCls = _this$props5.prefixCls,
          className = _this$props5.className,
          style = _this$props5.style,
          disabled = _this$props5.disabled,
          hideOnSinglePage = _this$props5.hideOnSinglePage,
          total = _this$props5.total,
          locale = _this$props5.locale,
          showQuickJumper = _this$props5.showQuickJumper,
          showLessItems = _this$props5.showLessItems,
          showTitle = _this$props5.showTitle,
          showTotal = _this$props5.showTotal,
          simple = _this$props5.simple,
          itemRender = _this$props5.itemRender,
          showPrevNextJumpers = _this$props5.showPrevNextJumpers,
          jumpPrevIcon = _this$props5.jumpPrevIcon,
          jumpNextIcon = _this$props5.jumpNextIcon,
          selectComponentClass = _this$props5.selectComponentClass,
          selectPrefixCls = _this$props5.selectPrefixCls,
          pageSizeOptions = _this$props5.pageSizeOptions;
      var _this$state = this.state,
          current = _this$state.current,
          pageSize = _this$state.pageSize,
          currentInputValue = _this$state.currentInputValue; // When hideOnSinglePage is true and there is only 1 page, hide the pager

      if (hideOnSinglePage === true && total <= pageSize) {
        return null;
      }

      var allPages = calculatePage(undefined, this.state, this.props);
      var pagerList = [];
      var jumpPrev = null;
      var jumpNext = null;
      var firstPager = null;
      var lastPager = null;
      var gotoButton = null;
      var goButton = showQuickJumper && showQuickJumper.goButton;
      var pageBufferSize = showLessItems ? 1 : 2;
      var prevPage = current - 1 > 0 ? current - 1 : 0;
      var nextPage = current + 1 < allPages ? current + 1 : allPages;
      var dataOrAriaAttributeProps = Object.keys(this.props).reduce(function (prev, key) {
        if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
          // eslint-disable-next-line no-param-reassign
          prev[key] = _this2.props[key];
        }

        return prev;
      }, {});

      if (simple) {
        if (goButton) {
          if (typeof goButton === 'boolean') {
            gotoButton = /*#__PURE__*/external_React_default().createElement("button", {
              type: "button",
              onClick: this.handleGoTO,
              onKeyUp: this.handleGoTO
            }, locale.jump_to_confirm);
          } else {
            gotoButton = /*#__PURE__*/external_React_default().createElement("span", {
              onClick: this.handleGoTO,
              onKeyUp: this.handleGoTO
            }, goButton);
          }

          gotoButton = /*#__PURE__*/external_React_default().createElement("li", {
            title: showTitle ? "".concat(locale.jump_to).concat(current, "/").concat(allPages) : null,
            className: "".concat(prefixCls, "-simple-pager")
          }, gotoButton);
        }

        return /*#__PURE__*/external_React_default().createElement("ul", (0,esm_extends/* default */.Z)({
          className: classnames_default()(prefixCls, "".concat(prefixCls, "-simple"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-disabled"), disabled), className),
          style: style,
          ref: this.savePaginationNode
        }, dataOrAriaAttributeProps), /*#__PURE__*/external_React_default().createElement("li", {
          title: showTitle ? locale.prev_page : null,
          onClick: this.prev,
          tabIndex: this.hasPrev() ? 0 : null,
          onKeyPress: this.runIfEnterPrev,
          className: classnames_default()("".concat(prefixCls, "-prev"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-disabled"), !this.hasPrev())),
          "aria-disabled": !this.hasPrev()
        }, this.renderPrev(prevPage)), /*#__PURE__*/external_React_default().createElement("li", {
          title: showTitle ? "".concat(current, "/").concat(allPages) : null,
          className: "".concat(prefixCls, "-simple-pager")
        }, /*#__PURE__*/external_React_default().createElement("input", {
          type: "text",
          value: currentInputValue,
          disabled: disabled,
          onKeyDown: this.handleKeyDown,
          onKeyUp: this.handleKeyUp,
          onChange: this.handleKeyUp,
          size: "3"
        }), /*#__PURE__*/external_React_default().createElement("span", {
          className: "".concat(prefixCls, "-slash")
        }, "/"), allPages), /*#__PURE__*/external_React_default().createElement("li", {
          title: showTitle ? locale.next_page : null,
          onClick: this.next,
          tabIndex: this.hasPrev() ? 0 : null,
          onKeyPress: this.runIfEnterNext,
          className: classnames_default()("".concat(prefixCls, "-next"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-disabled"), !this.hasNext())),
          "aria-disabled": !this.hasNext()
        }, this.renderNext(nextPage)), gotoButton);
      }

      if (allPages <= 3 + pageBufferSize * 2) {
        var pagerProps = {
          locale: locale,
          rootPrefixCls: prefixCls,
          onClick: this.handleChange,
          onKeyPress: this.runIfEnter,
          showTitle: showTitle,
          itemRender: itemRender
        };

        if (!allPages) {
          pagerList.push( /*#__PURE__*/external_React_default().createElement(es_Pager, (0,esm_extends/* default */.Z)({}, pagerProps, {
            key: "noPager",
            page: allPages,
            className: "".concat(prefixCls, "-disabled")
          })));
        }

        for (var i = 1; i <= allPages; i += 1) {
          var active = current === i;
          pagerList.push( /*#__PURE__*/external_React_default().createElement(es_Pager, (0,esm_extends/* default */.Z)({}, pagerProps, {
            key: i,
            page: i,
            active: active
          })));
        }
      } else {
        var prevItemTitle = showLessItems ? locale.prev_3 : locale.prev_5;
        var nextItemTitle = showLessItems ? locale.next_3 : locale.next_5;

        if (showPrevNextJumpers) {
          jumpPrev = /*#__PURE__*/external_React_default().createElement("li", {
            title: showTitle ? prevItemTitle : null,
            key: "prev",
            onClick: this.jumpPrev,
            tabIndex: "0",
            onKeyPress: this.runIfEnterJumpPrev,
            className: classnames_default()("".concat(prefixCls, "-jump-prev"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-jump-prev-custom-icon"), !!jumpPrevIcon))
          }, itemRender(this.getJumpPrevPage(), 'jump-prev', this.getItemIcon(jumpPrevIcon, 'prev page')));
          jumpNext = /*#__PURE__*/external_React_default().createElement("li", {
            title: showTitle ? nextItemTitle : null,
            key: "next",
            tabIndex: "0",
            onClick: this.jumpNext,
            onKeyPress: this.runIfEnterJumpNext,
            className: classnames_default()("".concat(prefixCls, "-jump-next"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-jump-next-custom-icon"), !!jumpNextIcon))
          }, itemRender(this.getJumpNextPage(), 'jump-next', this.getItemIcon(jumpNextIcon, 'next page')));
        }

        lastPager = /*#__PURE__*/external_React_default().createElement(es_Pager, {
          locale: locale,
          last: true,
          rootPrefixCls: prefixCls,
          onClick: this.handleChange,
          onKeyPress: this.runIfEnter,
          key: allPages,
          page: allPages,
          active: false,
          showTitle: showTitle,
          itemRender: itemRender
        });
        firstPager = /*#__PURE__*/external_React_default().createElement(es_Pager, {
          locale: locale,
          rootPrefixCls: prefixCls,
          onClick: this.handleChange,
          onKeyPress: this.runIfEnter,
          key: 1,
          page: 1,
          active: false,
          showTitle: showTitle,
          itemRender: itemRender
        });
        var left = Math.max(1, current - pageBufferSize);
        var right = Math.min(current + pageBufferSize, allPages);

        if (current - 1 <= pageBufferSize) {
          right = 1 + pageBufferSize * 2;
        }

        if (allPages - current <= pageBufferSize) {
          left = allPages - pageBufferSize * 2;
        }

        for (var _i = left; _i <= right; _i += 1) {
          var _active = current === _i;

          pagerList.push( /*#__PURE__*/external_React_default().createElement(es_Pager, {
            locale: locale,
            rootPrefixCls: prefixCls,
            onClick: this.handleChange,
            onKeyPress: this.runIfEnter,
            key: _i,
            page: _i,
            active: _active,
            showTitle: showTitle,
            itemRender: itemRender
          }));
        }

        if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
          pagerList[0] = /*#__PURE__*/(0,external_React_.cloneElement)(pagerList[0], {
            className: "".concat(prefixCls, "-item-after-jump-prev")
          });
          pagerList.unshift(jumpPrev);
        }

        if (allPages - current >= pageBufferSize * 2 && current !== allPages - 2) {
          pagerList[pagerList.length - 1] = /*#__PURE__*/(0,external_React_.cloneElement)(pagerList[pagerList.length - 1], {
            className: "".concat(prefixCls, "-item-before-jump-next")
          });
          pagerList.push(jumpNext);
        }

        if (left !== 1) {
          pagerList.unshift(firstPager);
        }

        if (right !== allPages) {
          pagerList.push(lastPager);
        }
      }

      var totalText = null;

      if (showTotal) {
        totalText = /*#__PURE__*/external_React_default().createElement("li", {
          className: "".concat(prefixCls, "-total-text")
        }, showTotal(total, [total === 0 ? 0 : (current - 1) * pageSize + 1, current * pageSize > total ? total : current * pageSize]));
      }

      var prevDisabled = !this.hasPrev() || !allPages;
      var nextDisabled = !this.hasNext() || !allPages;
      return /*#__PURE__*/external_React_default().createElement("ul", (0,esm_extends/* default */.Z)({
        className: classnames_default()(prefixCls, className, (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-disabled"), disabled)),
        style: style,
        unselectable: "unselectable",
        ref: this.savePaginationNode
      }, dataOrAriaAttributeProps), totalText, /*#__PURE__*/external_React_default().createElement("li", {
        title: showTitle ? locale.prev_page : null,
        onClick: this.prev,
        tabIndex: prevDisabled ? null : 0,
        onKeyPress: this.runIfEnterPrev,
        className: classnames_default()("".concat(prefixCls, "-prev"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-disabled"), prevDisabled)),
        "aria-disabled": prevDisabled
      }, this.renderPrev(prevPage)), pagerList, /*#__PURE__*/external_React_default().createElement("li", {
        title: showTitle ? locale.next_page : null,
        onClick: this.next,
        tabIndex: nextDisabled ? null : 0,
        onKeyPress: this.runIfEnterNext,
        className: classnames_default()("".concat(prefixCls, "-next"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-disabled"), nextDisabled)),
        "aria-disabled": nextDisabled
      }, this.renderNext(nextPage)), /*#__PURE__*/external_React_default().createElement(es_Options, {
        disabled: disabled,
        locale: locale,
        rootPrefixCls: prefixCls,
        selectComponentClass: selectComponentClass,
        selectPrefixCls: selectPrefixCls,
        changeSize: this.getShowSizeChanger() ? this.changePageSize : null,
        current: current,
        pageSize: pageSize,
        pageSizeOptions: pageSizeOptions,
        quickGo: this.shouldDisplayQuickJumper() ? this.handleChange : null,
        goButton: goButton
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      var newState = {};

      if ('current' in props) {
        newState.current = props.current;

        if (props.current !== prevState.current) {
          newState.currentInputValue = newState.current;
        }
      }

      if ('pageSize' in props && props.pageSize !== prevState.pageSize) {
        var current = prevState.current;
        var newCurrent = calculatePage(props.pageSize, prevState, props);
        current = current > newCurrent ? newCurrent : current;

        if (!('current' in props)) {
          newState.current = current;
          newState.currentInputValue = current;
        }

        newState.pageSize = props.pageSize;
      }

      return newState;
    }
  }]);

  return Pagination;
}((external_React_default()).Component);

Pagination.defaultProps = {
  defaultCurrent: 1,
  total: 0,
  defaultPageSize: 10,
  onChange: noop,
  className: '',
  selectPrefixCls: 'rc-select',
  prefixCls: 'rc-pagination',
  selectComponentClass: null,
  hideOnSinglePage: false,
  showPrevNextJumpers: true,
  showQuickJumper: false,
  showLessItems: false,
  showTitle: true,
  onShowSizeChange: noop,
  locale: zh_CN,
  style: {},
  itemRender: defaultItemRender,
  totalBoundaryShowSizeChanger: 50
};
/* harmony default export */ const es_Pagination = (Pagination);
;// CONCATENATED MODULE: ./node_modules/rc-pagination/es/index.js


/***/ }),

/***/ 671:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
var _default = {
  // Options.jsx
  items_per_page: '/ page',
  jump_to: 'Go to',
  jump_to_confirm: 'confirm',
  page: '',
  // Pagination.jsx
  prev_page: 'Previous Page',
  next_page: 'Next Page',
  prev_5: 'Previous 5 Pages',
  next_5: 'Next 5 Pages',
  prev_3: 'Previous 3 Pages',
  next_3: 'Next 3 Pages'
};
exports.default = _default;

/***/ }),

/***/ 8235:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
var locale = {
  locale: 'en_US',
  today: 'Today',
  now: 'Now',
  backToToday: 'Back to today',
  ok: 'Ok',
  clear: 'Clear',
  month: 'Month',
  year: 'Year',
  timeSelect: 'select time',
  dateSelect: 'select date',
  weekSelect: 'Choose a week',
  monthSelect: 'Choose a month',
  yearSelect: 'Choose a year',
  decadeSelect: 'Choose a decade',
  yearFormat: 'YYYY',
  dateFormat: 'M/D/YYYY',
  dayFormat: 'D',
  dateTimeFormat: 'M/D/YYYY HH:mm:ss',
  monthBeforeYear: true,
  previousMonth: 'Previous month (PageUp)',
  nextMonth: 'Next month (PageDown)',
  previousYear: 'Last year (Control + left)',
  nextYear: 'Next year (Control + right)',
  previousDecade: 'Last decade',
  nextDecade: 'Next decade',
  previousCentury: 'Last century',
  nextCentury: 'Next century'
};
var _default = locale;
exports.default = _default;

/***/ }),

/***/ 3103:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "OptGroup": () => (/* reexport */ es_OptGroup),
  "Option": () => (/* reexport */ es_Option),
  "default": () => (/* binding */ rc_select_es)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(6712);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(4609);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(8749);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js + 3 modules
var createSuper = __webpack_require__(3186);
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(3804);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(2064);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js + 1 modules
var objectWithoutProperties = __webpack_require__(6980);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js + 1 modules
var slicedToArray = __webpack_require__(6240);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/KeyCode.js
/**
 * @ignore
 * some key-codes definition and utils from closure-library
 * @author yiminghe@gmail.com
 */
var KeyCode = {
  /**
   * MAC_ENTER
   */
  MAC_ENTER: 3,

  /**
   * BACKSPACE
   */
  BACKSPACE: 8,

  /**
   * TAB
   */
  TAB: 9,

  /**
   * NUMLOCK on FF/Safari Mac
   */
  NUM_CENTER: 12,

  /**
   * ENTER
   */
  ENTER: 13,

  /**
   * SHIFT
   */
  SHIFT: 16,

  /**
   * CTRL
   */
  CTRL: 17,

  /**
   * ALT
   */
  ALT: 18,

  /**
   * PAUSE
   */
  PAUSE: 19,

  /**
   * CAPS_LOCK
   */
  CAPS_LOCK: 20,

  /**
   * ESC
   */
  ESC: 27,

  /**
   * SPACE
   */
  SPACE: 32,

  /**
   * PAGE_UP
   */
  PAGE_UP: 33,

  /**
   * PAGE_DOWN
   */
  PAGE_DOWN: 34,

  /**
   * END
   */
  END: 35,

  /**
   * HOME
   */
  HOME: 36,

  /**
   * LEFT
   */
  LEFT: 37,

  /**
   * UP
   */
  UP: 38,

  /**
   * RIGHT
   */
  RIGHT: 39,

  /**
   * DOWN
   */
  DOWN: 40,

  /**
   * PRINT_SCREEN
   */
  PRINT_SCREEN: 44,

  /**
   * INSERT
   */
  INSERT: 45,

  /**
   * DELETE
   */
  DELETE: 46,

  /**
   * ZERO
   */
  ZERO: 48,

  /**
   * ONE
   */
  ONE: 49,

  /**
   * TWO
   */
  TWO: 50,

  /**
   * THREE
   */
  THREE: 51,

  /**
   * FOUR
   */
  FOUR: 52,

  /**
   * FIVE
   */
  FIVE: 53,

  /**
   * SIX
   */
  SIX: 54,

  /**
   * SEVEN
   */
  SEVEN: 55,

  /**
   * EIGHT
   */
  EIGHT: 56,

  /**
   * NINE
   */
  NINE: 57,

  /**
   * QUESTION_MARK
   */
  QUESTION_MARK: 63,

  /**
   * A
   */
  A: 65,

  /**
   * B
   */
  B: 66,

  /**
   * C
   */
  C: 67,

  /**
   * D
   */
  D: 68,

  /**
   * E
   */
  E: 69,

  /**
   * F
   */
  F: 70,

  /**
   * G
   */
  G: 71,

  /**
   * H
   */
  H: 72,

  /**
   * I
   */
  I: 73,

  /**
   * J
   */
  J: 74,

  /**
   * K
   */
  K: 75,

  /**
   * L
   */
  L: 76,

  /**
   * M
   */
  M: 77,

  /**
   * N
   */
  N: 78,

  /**
   * O
   */
  O: 79,

  /**
   * P
   */
  P: 80,

  /**
   * Q
   */
  Q: 81,

  /**
   * R
   */
  R: 82,

  /**
   * S
   */
  S: 83,

  /**
   * T
   */
  T: 84,

  /**
   * U
   */
  U: 85,

  /**
   * V
   */
  V: 86,

  /**
   * W
   */
  W: 87,

  /**
   * X
   */
  X: 88,

  /**
   * Y
   */
  Y: 89,

  /**
   * Z
   */
  Z: 90,

  /**
   * META
   */
  META: 91,

  /**
   * WIN_KEY_RIGHT
   */
  WIN_KEY_RIGHT: 92,

  /**
   * CONTEXT_MENU
   */
  CONTEXT_MENU: 93,

  /**
   * NUM_ZERO
   */
  NUM_ZERO: 96,

  /**
   * NUM_ONE
   */
  NUM_ONE: 97,

  /**
   * NUM_TWO
   */
  NUM_TWO: 98,

  /**
   * NUM_THREE
   */
  NUM_THREE: 99,

  /**
   * NUM_FOUR
   */
  NUM_FOUR: 100,

  /**
   * NUM_FIVE
   */
  NUM_FIVE: 101,

  /**
   * NUM_SIX
   */
  NUM_SIX: 102,

  /**
   * NUM_SEVEN
   */
  NUM_SEVEN: 103,

  /**
   * NUM_EIGHT
   */
  NUM_EIGHT: 104,

  /**
   * NUM_NINE
   */
  NUM_NINE: 105,

  /**
   * NUM_MULTIPLY
   */
  NUM_MULTIPLY: 106,

  /**
   * NUM_PLUS
   */
  NUM_PLUS: 107,

  /**
   * NUM_MINUS
   */
  NUM_MINUS: 109,

  /**
   * NUM_PERIOD
   */
  NUM_PERIOD: 110,

  /**
   * NUM_DIVISION
   */
  NUM_DIVISION: 111,

  /**
   * F1
   */
  F1: 112,

  /**
   * F2
   */
  F2: 113,

  /**
   * F3
   */
  F3: 114,

  /**
   * F4
   */
  F4: 115,

  /**
   * F5
   */
  F5: 116,

  /**
   * F6
   */
  F6: 117,

  /**
   * F7
   */
  F7: 118,

  /**
   * F8
   */
  F8: 119,

  /**
   * F9
   */
  F9: 120,

  /**
   * F10
   */
  F10: 121,

  /**
   * F11
   */
  F11: 122,

  /**
   * F12
   */
  F12: 123,

  /**
   * NUMLOCK
   */
  NUMLOCK: 144,

  /**
   * SEMICOLON
   */
  SEMICOLON: 186,

  /**
   * DASH
   */
  DASH: 189,

  /**
   * EQUALS
   */
  EQUALS: 187,

  /**
   * COMMA
   */
  COMMA: 188,

  /**
   * PERIOD
   */
  PERIOD: 190,

  /**
   * SLASH
   */
  SLASH: 191,

  /**
   * APOSTROPHE
   */
  APOSTROPHE: 192,

  /**
   * SINGLE_QUOTE
   */
  SINGLE_QUOTE: 222,

  /**
   * OPEN_SQUARE_BRACKET
   */
  OPEN_SQUARE_BRACKET: 219,

  /**
   * BACKSLASH
   */
  BACKSLASH: 220,

  /**
   * CLOSE_SQUARE_BRACKET
   */
  CLOSE_SQUARE_BRACKET: 221,

  /**
   * WIN_KEY
   */
  WIN_KEY: 224,

  /**
   * MAC_FF_META
   */
  MAC_FF_META: 224,

  /**
   * WIN_IME
   */
  WIN_IME: 229,
  // ======================== Function ========================

  /**
   * whether text and modified key is entered at the same time.
   */
  isTextModifyingKeyEvent: function isTextModifyingKeyEvent(e) {
    var keyCode = e.keyCode;

    if (e.altKey && !e.ctrlKey || e.metaKey || // Function keys don't generate text
    keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) {
      return false;
    } // The following keys are quite harmless, even in combination with
    // CTRL, ALT or SHIFT.


    switch (keyCode) {
      case KeyCode.ALT:
      case KeyCode.CAPS_LOCK:
      case KeyCode.CONTEXT_MENU:
      case KeyCode.CTRL:
      case KeyCode.DOWN:
      case KeyCode.END:
      case KeyCode.ESC:
      case KeyCode.HOME:
      case KeyCode.INSERT:
      case KeyCode.LEFT:
      case KeyCode.MAC_FF_META:
      case KeyCode.META:
      case KeyCode.NUMLOCK:
      case KeyCode.NUM_CENTER:
      case KeyCode.PAGE_DOWN:
      case KeyCode.PAGE_UP:
      case KeyCode.PAUSE:
      case KeyCode.PRINT_SCREEN:
      case KeyCode.RIGHT:
      case KeyCode.SHIFT:
      case KeyCode.UP:
      case KeyCode.WIN_KEY:
      case KeyCode.WIN_KEY_RIGHT:
        return false;

      default:
        return true;
    }
  },

  /**
   * whether character is entered.
   */
  isCharacterKey: function isCharacterKey(keyCode) {
    if (keyCode >= KeyCode.ZERO && keyCode <= KeyCode.NINE) {
      return true;
    }

    if (keyCode >= KeyCode.NUM_ZERO && keyCode <= KeyCode.NUM_MULTIPLY) {
      return true;
    }

    if (keyCode >= KeyCode.A && keyCode <= KeyCode.Z) {
      return true;
    } // Safari sends zero key code for non-latin characters.


    if (window.navigator.userAgent.indexOf('WebKit') !== -1 && keyCode === 0) {
      return true;
    }

    switch (keyCode) {
      case KeyCode.SPACE:
      case KeyCode.QUESTION_MARK:
      case KeyCode.NUM_PLUS:
      case KeyCode.NUM_MINUS:
      case KeyCode.NUM_PERIOD:
      case KeyCode.NUM_DIVISION:
      case KeyCode.SEMICOLON:
      case KeyCode.DASH:
      case KeyCode.EQUALS:
      case KeyCode.COMMA:
      case KeyCode.PERIOD:
      case KeyCode.SLASH:
      case KeyCode.APOSTROPHE:
      case KeyCode.SINGLE_QUOTE:
      case KeyCode.OPEN_SQUARE_BRACKET:
      case KeyCode.BACKSLASH:
      case KeyCode.CLOSE_SQUARE_BRACKET:
        return true;

      default:
        return false;
    }
  }
};
/* harmony default export */ const es_KeyCode = (KeyCode);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__(3755);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/pickAttrs.js

var attributes = "accept acceptCharset accessKey action allowFullScreen allowTransparency\n    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge\n    charSet checked classID className colSpan cols content contentEditable contextMenu\n    controls coords crossOrigin data dateTime default defer dir disabled download draggable\n    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder\n    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity\n    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media\n    mediaGroup method min minLength multiple muted name noValidate nonce open\n    optimum pattern placeholder poster preload radioGroup readOnly rel required\n    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected\n    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style\n    summary tabIndex target title type useMap value width wmode wrap";
var eventsName = "onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown\n    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick\n    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown\n    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel\n    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough\n    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata\n    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError";
var propList = "".concat(attributes, " ").concat(eventsName).split(/[\s\n]+/);
/* eslint-enable max-len */

var ariaPrefix = 'aria-';
var dataPrefix = 'data-';

function match(key, prefix) {
  return key.indexOf(prefix) === 0;
}
/**
 * Picker props from exist props with filter
 * @param props Passed props
 * @param ariaOnly boolean | { aria?: boolean; data?: boolean; attr?: boolean; } filter config
 */


function pickAttrs(props) {
  var ariaOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var mergedConfig;

  if (ariaOnly === false) {
    mergedConfig = {
      aria: true,
      data: true,
      attr: true
    };
  } else if (ariaOnly === true) {
    mergedConfig = {
      aria: true
    };
  } else {
    mergedConfig = (0,objectSpread2/* default */.Z)({}, ariaOnly);
  }

  var attrs = {};
  Object.keys(props).forEach(function (key) {
    if ( // Aria
    mergedConfig.aria && (key === 'role' || match(key, ariaPrefix)) || // Data
    mergedConfig.data && match(key, dataPrefix) || // Attr
    mergedConfig.attr && propList.includes(key)) {
      attrs[key] = props[key];
    }
  });
  return attrs;
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useMemo.js

function useMemo(getValue, condition, shouldUpdate) {
  var cacheRef = external_React_.useRef({});

  if (!('value' in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
    cacheRef.current.value = getValue();
    cacheRef.current.condition = condition;
  }

  return cacheRef.current.value;
}
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(7855);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/rc-util/es/Dom/findDOMNode.js
var findDOMNode = __webpack_require__(716);
// EXTERNAL MODULE: ./node_modules/rc-util/es/Children/toArray.js
var toArray = __webpack_require__(4371);
// EXTERNAL MODULE: ./node_modules/rc-util/es/warning.js
var warning = __webpack_require__(1381);
// EXTERNAL MODULE: ./node_modules/rc-util/es/ref.js
var es_ref = __webpack_require__(2218);
;// CONCATENATED MODULE: ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */

/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = function () {
  if (typeof Map !== 'undefined') {
    return Map;
  }
  /**
   * Returns index in provided array that matches the specified key.
   *
   * @param {Array<Array>} arr
   * @param {*} key
   * @returns {number}
   */


  function getIndex(arr, key) {
    var result = -1;
    arr.some(function (entry, index) {
      if (entry[0] === key) {
        result = index;
        return true;
      }

      return false;
    });
    return result;
  }

  return (
    /** @class */
    function () {
      function class_1() {
        this.__entries__ = [];
      }

      Object.defineProperty(class_1.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function () {
          return this.__entries__.length;
        },
        enumerable: true,
        configurable: true
      });
      /**
       * @param {*} key
       * @returns {*}
       */

      class_1.prototype.get = function (key) {
        var index = getIndex(this.__entries__, key);
        var entry = this.__entries__[index];
        return entry && entry[1];
      };
      /**
       * @param {*} key
       * @param {*} value
       * @returns {void}
       */


      class_1.prototype.set = function (key, value) {
        var index = getIndex(this.__entries__, key);

        if (~index) {
          this.__entries__[index][1] = value;
        } else {
          this.__entries__.push([key, value]);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */


      class_1.prototype.delete = function (key) {
        var entries = this.__entries__;
        var index = getIndex(entries, key);

        if (~index) {
          entries.splice(index, 1);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */


      class_1.prototype.has = function (key) {
        return !!~getIndex(this.__entries__, key);
      };
      /**
       * @returns {void}
       */


      class_1.prototype.clear = function () {
        this.__entries__.splice(0);
      };
      /**
       * @param {Function} callback
       * @param {*} [ctx=null]
       * @returns {void}
       */


      class_1.prototype.forEach = function (callback, ctx) {
        if (ctx === void 0) {
          ctx = null;
        }

        for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
          var entry = _a[_i];
          callback.call(ctx, entry[1], entry[0]);
        }
      };

      return class_1;
    }()
  );
}();
/**
 * Detects whether window and document objects are available in current environment.
 */


var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document; // Returns global object of a current environment.

var global$1 = function () {
  if (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.Math === Math) {
    return __webpack_require__.g;
  }

  if (typeof self !== 'undefined' && self.Math === Math) {
    return self;
  }

  if (typeof window !== 'undefined' && window.Math === Math) {
    return window;
  } // eslint-disable-next-line no-new-func


  return Function('return this')();
}();
/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */


var requestAnimationFrame$1 = function () {
  if (typeof requestAnimationFrame === 'function') {
    // It's required to use a bounded function because IE sometimes throws
    // an "Invalid calling object" error if rAF is invoked without the global
    // object on the left hand side.
    return requestAnimationFrame.bind(global$1);
  }

  return function (callback) {
    return setTimeout(function () {
      return callback(Date.now());
    }, 1000 / 60);
  };
}(); // Defines minimum timeout before adding a trailing call.


var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */

function throttle(callback, delay) {
  var leadingCall = false,
      trailingCall = false,
      lastCallTime = 0;
  /**
   * Invokes the original callback function and schedules new invocation if
   * the "proxy" was called during current request.
   *
   * @returns {void}
   */

  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }

    if (trailingCall) {
      proxy();
    }
  }
  /**
   * Callback invoked after the specified delay. It will further postpone
   * invocation of the original function delegating it to the
   * requestAnimationFrame.
   *
   * @returns {void}
   */


  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  /**
   * Schedules invocation of the original function.
   *
   * @returns {void}
   */


  function proxy() {
    var timeStamp = Date.now();

    if (leadingCall) {
      // Reject immediately following calls.
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      } // Schedule new call to be in invoked when the pending one is resolved.
      // This is important for "transitions" which never actually start
      // immediately so there is a chance that we might miss one if change
      // happens amids the pending invocation.


      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }

    lastCallTime = timeStamp;
  }

  return proxy;
} // Minimum delay before invoking the update of observers.


var REFRESH_DELAY = 20; // A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.

var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight']; // Check if MutationObserver is available.

var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */

var ResizeObserverController =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserverController.
   *
   * @private
   */
  function ResizeObserverController() {
    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */
    this.connected_ = false;
    /**
     * Tells that controller has subscribed for Mutation Events.
     *
     * @private {boolean}
     */

    this.mutationEventsAdded_ = false;
    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */

    this.mutationsObserver_ = null;
    /**
     * A list of connected observers.
     *
     * @private {Array<ResizeObserverSPI>}
     */

    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
  }
  /**
   * Adds observer to observers list.
   *
   * @param {ResizeObserverSPI} observer - Observer to be added.
   * @returns {void}
   */


  ResizeObserverController.prototype.addObserver = function (observer) {
    if (!~this.observers_.indexOf(observer)) {
      this.observers_.push(observer);
    } // Add listeners if they haven't been added yet.


    if (!this.connected_) {
      this.connect_();
    }
  };
  /**
   * Removes observer from observers list.
   *
   * @param {ResizeObserverSPI} observer - Observer to be removed.
   * @returns {void}
   */


  ResizeObserverController.prototype.removeObserver = function (observer) {
    var observers = this.observers_;
    var index = observers.indexOf(observer); // Remove observer if it's present in registry.

    if (~index) {
      observers.splice(index, 1);
    } // Remove listeners if controller has no connected observers.


    if (!observers.length && this.connected_) {
      this.disconnect_();
    }
  };
  /**
   * Invokes the update of observers. It will continue running updates insofar
   * it detects changes.
   *
   * @returns {void}
   */


  ResizeObserverController.prototype.refresh = function () {
    var changesDetected = this.updateObservers_(); // Continue running updates if changes have been detected as there might
    // be future ones caused by CSS transitions.

    if (changesDetected) {
      this.refresh();
    }
  };
  /**
   * Updates every observer from observers list and notifies them of queued
   * entries.
   *
   * @private
   * @returns {boolean} Returns "true" if any observer has detected changes in
   *      dimensions of it's elements.
   */


  ResizeObserverController.prototype.updateObservers_ = function () {
    // Collect observers that have active observations.
    var activeObservers = this.observers_.filter(function (observer) {
      return observer.gatherActive(), observer.hasActive();
    }); // Deliver notifications in a separate cycle in order to avoid any
    // collisions between observers, e.g. when multiple instances of
    // ResizeObserver are tracking the same element and the callback of one
    // of them changes content dimensions of the observed target. Sometimes
    // this may result in notifications being blocked for the rest of observers.

    activeObservers.forEach(function (observer) {
      return observer.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  /**
   * Initializes DOM listeners.
   *
   * @private
   * @returns {void}
   */


  ResizeObserverController.prototype.connect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already added.
    if (!isBrowser || this.connected_) {
      return;
    } // Subscription to the "Transitionend" event is used as a workaround for
    // delayed transitions. This way it's possible to capture at least the
    // final state of an element.


    document.addEventListener('transitionend', this.onTransitionEnd_);
    window.addEventListener('resize', this.refresh);

    if (mutationObserverSupported) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    } else {
      document.addEventListener('DOMSubtreeModified', this.refresh);
      this.mutationEventsAdded_ = true;
    }

    this.connected_ = true;
  };
  /**
   * Removes DOM listeners.
   *
   * @private
   * @returns {void}
   */


  ResizeObserverController.prototype.disconnect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already removed.
    if (!isBrowser || !this.connected_) {
      return;
    }

    document.removeEventListener('transitionend', this.onTransitionEnd_);
    window.removeEventListener('resize', this.refresh);

    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }

    if (this.mutationEventsAdded_) {
      document.removeEventListener('DOMSubtreeModified', this.refresh);
    }

    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  /**
   * "Transitionend" event handler.
   *
   * @private
   * @param {TransitionEvent} event
   * @returns {void}
   */


  ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
    var _b = _a.propertyName,
        propertyName = _b === void 0 ? '' : _b; // Detect whether transition may affect dimensions of an element.

    var isReflowProperty = transitionKeys.some(function (key) {
      return !!~propertyName.indexOf(key);
    });

    if (isReflowProperty) {
      this.refresh();
    }
  };
  /**
   * Returns instance of the ResizeObserverController.
   *
   * @returns {ResizeObserverController}
   */


  ResizeObserverController.getInstance = function () {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController();
    }

    return this.instance_;
  };
  /**
   * Holds reference to the controller's instance.
   *
   * @private {ResizeObserverController}
   */


  ResizeObserverController.instance_ = null;
  return ResizeObserverController;
}();
/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */


var defineConfigurable = function (target, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var key = _a[_i];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }

  return target;
};
/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */


var getWindowOf = function (target) {
  // Assume that the element is an instance of Node, which means that it
  // has the "ownerDocument" property from which we can retrieve a
  // corresponding global object.
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView; // Return the local global object if it's not possible extract one from
  // provided element.

  return ownerGlobal || global$1;
}; // Placeholder of an empty content rectangle.


var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */

function toFloat(value) {
  return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */


function getBordersSize(styles) {
  var positions = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }

  return positions.reduce(function (size, position) {
    var value = styles['border-' + position + '-width'];
    return size + toFloat(value);
  }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */


function getPaddings(styles) {
  var positions = ['top', 'right', 'bottom', 'left'];
  var paddings = {};

  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles['padding-' + position];
    paddings[position] = toFloat(value);
  }

  return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */


function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */


function getHTMLElementContentRect(target) {
  // Client width & height properties can't be
  // used exclusively as they provide rounded values.
  var clientWidth = target.clientWidth,
      clientHeight = target.clientHeight; // By this condition we can catch all non-replaced inline, hidden and
  // detached elements. Though elements with width & height properties less
  // than 0.5 will be discarded as well.
  //
  // Without it we would need to implement separate methods for each of
  // those cases and it's not possible to perform a precise and performance
  // effective test for hidden elements. E.g. even jQuery's ':visible' filter
  // gives wrong results for elements with width & height less than 0.5.

  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }

  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom; // Computed styles of width & height are being used because they are the
  // only dimensions available to JS that contain non-rounded values. It could
  // be possible to utilize the getBoundingClientRect if only it's data wasn't
  // affected by CSS transformations let alone paddings, borders and scroll bars.

  var width = toFloat(styles.width),
      height = toFloat(styles.height); // Width & height include paddings and borders when the 'border-box' box
  // model is applied (except for IE).

  if (styles.boxSizing === 'border-box') {
    // Following conditions are required to handle Internet Explorer which
    // doesn't include paddings and borders to computed CSS dimensions.
    //
    // We can say that if CSS dimensions + paddings are equal to the "client"
    // properties then it's either IE, and thus we don't need to subtract
    // anything, or an element merely doesn't have paddings/borders styles.
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, 'left', 'right') + horizPad;
    }

    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
    }
  } // Following steps can't be applied to the document's root element as its
  // client[Width/Height] properties represent viewport area of the window.
  // Besides, it's as well not necessary as the <html> itself neither has
  // rendered scroll bars nor it can be clipped.


  if (!isDocumentElement(target)) {
    // In some browsers (only in Firefox, actually) CSS width & height
    // include scroll bars size which can be removed at this step as scroll
    // bars are the only difference between rounded dimensions + paddings
    // and "client" properties, though that is not always true in Chrome.
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight; // Chrome has a rather weird rounding of "client" properties.
    // E.g. for an element with content width of 314.2px it sometimes gives
    // the client width of 315px and for the width of 314.7px it may give
    // 314px. And it doesn't happen all the time. So just ignore this delta
    // as a non-relevant.

    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }

    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }

  return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


var isSVGGraphicsElement = function () {
  // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
  // interface.
  if (typeof SVGGraphicsElement !== 'undefined') {
    return function (target) {
      return target instanceof getWindowOf(target).SVGGraphicsElement;
    };
  } // If it's so, then check that element is at least an instance of the
  // SVGElement and that it has the "getBBox" method.
  // eslint-disable-next-line no-extra-parens


  return function (target) {
    return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function';
  };
}();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */


function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }

  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }

  return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */


function createReadOnlyRect(_a) {
  var x = _a.x,
      y = _a.y,
      width = _a.width,
      height = _a.height; // If DOMRectReadOnly is available use it as a prototype for the rectangle.

  var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype); // Rectangle's properties are not writable and non-enumerable.

  defineConfigurable(rect, {
    x: x,
    y: y,
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x
  });
  return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */


function createRectInit(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
}
/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */


var ResizeObservation =
/** @class */
function () {
  /**
   * Creates an instance of ResizeObservation.
   *
   * @param {Element} target - Element to be observed.
   */
  function ResizeObservation(target) {
    /**
     * Broadcasted width of content rectangle.
     *
     * @type {number}
     */
    this.broadcastWidth = 0;
    /**
     * Broadcasted height of content rectangle.
     *
     * @type {number}
     */

    this.broadcastHeight = 0;
    /**
     * Reference to the last observed content rectangle.
     *
     * @private {DOMRectInit}
     */

    this.contentRect_ = createRectInit(0, 0, 0, 0);
    this.target = target;
  }
  /**
   * Updates content rectangle and tells whether it's width or height properties
   * have changed since the last broadcast.
   *
   * @returns {boolean}
   */


  ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  /**
   * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
   * from the corresponding properties of the last observed content rectangle.
   *
   * @returns {DOMRectInit} Last observed content rectangle.
   */


  ResizeObservation.prototype.broadcastRect = function () {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };

  return ResizeObservation;
}();

var ResizeObserverEntry =
/** @class */
function () {
  /**
   * Creates an instance of ResizeObserverEntry.
   *
   * @param {Element} target - Element that is being observed.
   * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
   */
  function ResizeObserverEntry(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit); // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.

    defineConfigurable(this, {
      target: target,
      contentRect: contentRect
    });
  }

  return ResizeObserverEntry;
}();

var ResizeObserverSPI =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserver.
   *
   * @param {ResizeObserverCallback} callback - Callback function that is invoked
   *      when one of the observed elements changes it's content dimensions.
   * @param {ResizeObserverController} controller - Controller instance which
   *      is responsible for the updates of observer.
   * @param {ResizeObserver} callbackCtx - Reference to the public
   *      ResizeObserver instance which will be passed to callback function.
   */
  function ResizeObserverSPI(callback, controller, callbackCtx) {
    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * @private {Array<ResizeObservation>}
     */
    this.activeObservations_ = [];
    /**
     * Registry of the ResizeObservation instances.
     *
     * @private {Map<Element, ResizeObservation>}
     */

    this.observations_ = new MapShim();

    if (typeof callback !== 'function') {
      throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  /**
   * Starts observing provided element.
   *
   * @param {Element} target - Element to be observed.
   * @returns {void}
   */


  ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    } // Do nothing if current environment doesn't have the Element interface.


    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
      return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_; // Do nothing if element is already being observed.

    if (observations.has(target)) {
      return;
    }

    observations.set(target, new ResizeObservation(target));
    this.controller_.addObserver(this); // Force the update of observations.

    this.controller_.refresh();
  };
  /**
   * Stops observing provided element.
   *
   * @param {Element} target - Element to stop observing.
   * @returns {void}
   */


  ResizeObserverSPI.prototype.unobserve = function (target) {
    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    } // Do nothing if current environment doesn't have the Element interface.


    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
      return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_; // Do nothing if element is not being observed.

    if (!observations.has(target)) {
      return;
    }

    observations.delete(target);

    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  /**
   * Stops observing all elements.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  /**
   * Collects observation instances the associated element of which has changed
   * it's content rectangle.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.gatherActive = function () {
    var _this = this;

    this.clearActive();
    this.observations_.forEach(function (observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  /**
   * Invokes initial callback function with a list of ResizeObserverEntry
   * instances collected from active resize observations.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.broadcastActive = function () {
    // Do nothing if observer doesn't have active observations.
    if (!this.hasActive()) {
      return;
    }

    var ctx = this.callbackCtx_; // Create ResizeObserverEntry instance for every active observation.

    var entries = this.activeObservations_.map(function (observation) {
      return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  /**
   * Clears the collection of active observations.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
  };
  /**
   * Tells whether observer has active observations.
   *
   * @returns {boolean}
   */


  ResizeObserverSPI.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
  };

  return ResizeObserverSPI;
}(); // Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.


var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */

var ResizeObserver =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserver.
   *
   * @param {ResizeObserverCallback} callback - Callback that is invoked when
   *      dimensions of the observed elements change.
   */
  function ResizeObserver(callback) {
    if (!(this instanceof ResizeObserver)) {
      throw new TypeError('Cannot call a class as a function.');
    }

    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    }

    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);
    observers.set(this, observer);
  }

  return ResizeObserver;
}(); // Expose public methods of ResizeObserver.


['observe', 'unobserve', 'disconnect'].forEach(function (method) {
  ResizeObserver.prototype[method] = function () {
    var _a;

    return (_a = observers.get(this))[method].apply(_a, arguments);
  };
});

var index = function () {
  // Export existing implementation if available.
  if (typeof global$1.ResizeObserver !== 'undefined') {
    return global$1.ResizeObserver;
  }

  return ResizeObserver;
}();

/* harmony default export */ const ResizeObserver_es = (index);
;// CONCATENATED MODULE: ./node_modules/rc-resize-observer/es/index.js











var INTERNAL_PREFIX_KEY = 'rc-observer-key'; // Still need to be compatible with React 15, we use class component here

var ReactResizeObserver = /*#__PURE__*/function (_React$Component) {
  (0,inherits/* default */.Z)(ReactResizeObserver, _React$Component);

  var _super = (0,createSuper/* default */.Z)(ReactResizeObserver);

  function ReactResizeObserver() {
    var _this;

    (0,classCallCheck/* default */.Z)(this, ReactResizeObserver);

    _this = _super.apply(this, arguments);
    _this.resizeObserver = null;
    _this.childNode = null;
    _this.currentElement = null;
    _this.state = {
      width: 0,
      height: 0,
      offsetHeight: 0,
      offsetWidth: 0
    };

    _this.onResize = function (entries) {
      var onResize = _this.props.onResize;
      var target = entries[0].target;

      var _target$getBoundingCl = target.getBoundingClientRect(),
          width = _target$getBoundingCl.width,
          height = _target$getBoundingCl.height;

      var offsetWidth = target.offsetWidth,
          offsetHeight = target.offsetHeight;
      /**
       * Resize observer trigger when content size changed.
       * In most case we just care about element size,
       * let's use `boundary` instead of `contentRect` here to avoid shaking.
       */

      var fixedWidth = Math.floor(width);
      var fixedHeight = Math.floor(height);

      if (_this.state.width !== fixedWidth || _this.state.height !== fixedHeight || _this.state.offsetWidth !== offsetWidth || _this.state.offsetHeight !== offsetHeight) {
        var size = {
          width: fixedWidth,
          height: fixedHeight,
          offsetWidth: offsetWidth,
          offsetHeight: offsetHeight
        };

        _this.setState(size);

        if (onResize) {
          // defer the callback but not defer to next frame
          Promise.resolve().then(function () {
            onResize((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, size), {}, {
              offsetWidth: offsetWidth,
              offsetHeight: offsetHeight
            }), target);
          });
        }
      }
    };

    _this.setChildNode = function (node) {
      _this.childNode = node;
    };

    return _this;
  }

  (0,createClass/* default */.Z)(ReactResizeObserver, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.onComponentUpdated();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.onComponentUpdated();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.destroyObserver();
    }
  }, {
    key: "onComponentUpdated",
    value: function onComponentUpdated() {
      var disabled = this.props.disabled; // Unregister if disabled

      if (disabled) {
        this.destroyObserver();
        return;
      } // Unregister if element changed


      var element = (0,findDOMNode/* default */.Z)(this.childNode || this);
      var elementChanged = element !== this.currentElement;

      if (elementChanged) {
        this.destroyObserver();
        this.currentElement = element;
      }

      if (!this.resizeObserver && element) {
        this.resizeObserver = new ResizeObserver_es(this.onResize);
        this.resizeObserver.observe(element);
      }
    }
  }, {
    key: "destroyObserver",
    value: function destroyObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      var childNodes = (0,toArray/* default */.Z)(children);

      if (childNodes.length > 1) {
        (0,warning/* default */.ZP)(false, 'Find more than one child node with `children` in ResizeObserver. Will only observe first one.');
      } else if (childNodes.length === 0) {
        (0,warning/* default */.ZP)(false, '`children` of ResizeObserver is empty. Nothing is in observe.');
        return null;
      }

      var childNode = childNodes[0];

      if ( /*#__PURE__*/ /*#__PURE__*/external_React_.isValidElement(childNode) && (0,es_ref/* supportRef */.Yr)(childNode)) {
        var ref = childNode.ref;
        childNodes[0] = /*#__PURE__*/external_React_.cloneElement(childNode, {
          ref: (0,es_ref/* composeRef */.sQ)(ref, this.setChildNode)
        });
      }

      return childNodes.length === 1 ? childNodes[0] : childNodes.map(function (node, index) {
        if (! /*#__PURE__*/external_React_.isValidElement(node) || 'key' in node && node.key !== null) {
          return node;
        }

        return /*#__PURE__*/external_React_.cloneElement(node, {
          key: "".concat(INTERNAL_PREFIX_KEY, "-").concat(index)
        });
      });
    }
  }]);

  return ReactResizeObserver;
}(external_React_.Component);

ReactResizeObserver.displayName = 'ResizeObserver';
/* harmony default export */ const es = (ReactResizeObserver);
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/Filler.js
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}




/**
 * Fill component to provided the scroll content real height.
 */

var Filler = /*#__PURE__*/external_React_.forwardRef(function (_ref, ref) {
  var height = _ref.height,
      offset = _ref.offset,
      children = _ref.children,
      prefixCls = _ref.prefixCls,
      onInnerResize = _ref.onInnerResize;
  var outerStyle = {};
  var innerStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  if (offset !== undefined) {
    outerStyle = {
      height: height,
      position: 'relative',
      overflow: 'hidden'
    };
    innerStyle = _objectSpread(_objectSpread({}, innerStyle), {}, {
      transform: "translateY(".concat(offset, "px)"),
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0
    });
  }

  return /*#__PURE__*/external_React_.createElement("div", {
    style: outerStyle
  }, /*#__PURE__*/external_React_.createElement(es, {
    onResize: function onResize(_ref2) {
      var offsetHeight = _ref2.offsetHeight;

      if (offsetHeight && onInnerResize) {
        onInnerResize();
      }
    }
  }, /*#__PURE__*/external_React_.createElement("div", {
    style: innerStyle,
    className: classnames_default()(_defineProperty({}, "".concat(prefixCls, "-holder-inner"), prefixCls)),
    ref: ref
  }, children)));
});
Filler.displayName = 'Filler';
/* harmony default export */ const es_Filler = (Filler);
// EXTERNAL MODULE: ./node_modules/rc-util/es/raf.js
var raf = __webpack_require__(5802);
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/ScrollBar.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function ScrollBar_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}




var MIN_SIZE = 20;

function getPageY(e) {
  return 'touches' in e ? e.touches[0].pageY : e.pageY;
}

var ScrollBar = /*#__PURE__*/function (_React$Component) {
  _inherits(ScrollBar, _React$Component);

  var _super = _createSuper(ScrollBar);

  function ScrollBar() {
    var _this;

    _classCallCheck(this, ScrollBar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.moveRaf = null;
    _this.scrollbarRef = /*#__PURE__*/external_React_.createRef();
    _this.thumbRef = /*#__PURE__*/external_React_.createRef();
    _this.visibleTimeout = null;
    _this.state = {
      dragging: false,
      pageY: null,
      startTop: null,
      visible: false
    };

    _this.delayHidden = function () {
      clearTimeout(_this.visibleTimeout);

      _this.setState({
        visible: true
      });

      _this.visibleTimeout = setTimeout(function () {
        _this.setState({
          visible: false
        });
      }, 2000);
    };

    _this.onScrollbarTouchStart = function (e) {
      e.preventDefault();
    };

    _this.onContainerMouseDown = function (e) {
      e.stopPropagation();
      e.preventDefault();
    };

    _this.patchEvents = function () {
      window.addEventListener('mousemove', _this.onMouseMove);
      window.addEventListener('mouseup', _this.onMouseUp);

      _this.thumbRef.current.addEventListener('touchmove', _this.onMouseMove);

      _this.thumbRef.current.addEventListener('touchend', _this.onMouseUp);
    };

    _this.removeEvents = function () {
      window.removeEventListener('mousemove', _this.onMouseMove);
      window.removeEventListener('mouseup', _this.onMouseUp);

      _this.scrollbarRef.current.removeEventListener('touchstart', _this.onScrollbarTouchStart);

      _this.thumbRef.current.removeEventListener('touchstart', _this.onMouseDown);

      _this.thumbRef.current.removeEventListener('touchmove', _this.onMouseMove);

      _this.thumbRef.current.removeEventListener('touchend', _this.onMouseUp);

      raf/* default.cancel */.Z.cancel(_this.moveRaf);
    };

    _this.onMouseDown = function (e) {
      var onStartMove = _this.props.onStartMove;

      _this.setState({
        dragging: true,
        pageY: getPageY(e),
        startTop: _this.getTop()
      });

      onStartMove();

      _this.patchEvents();

      e.stopPropagation();
      e.preventDefault();
    };

    _this.onMouseMove = function (e) {
      var _this$state = _this.state,
          dragging = _this$state.dragging,
          pageY = _this$state.pageY,
          startTop = _this$state.startTop;
      var onScroll = _this.props.onScroll;
      raf/* default.cancel */.Z.cancel(_this.moveRaf);

      if (dragging) {
        var offsetY = getPageY(e) - pageY;
        var newTop = startTop + offsetY;

        var enableScrollRange = _this.getEnableScrollRange();

        var enableHeightRange = _this.getEnableHeightRange();

        var ptg = enableHeightRange ? newTop / enableHeightRange : 0;
        var newScrollTop = Math.ceil(ptg * enableScrollRange);
        _this.moveRaf = (0,raf/* default */.Z)(function () {
          onScroll(newScrollTop);
        });
      }
    };

    _this.onMouseUp = function () {
      var onStopMove = _this.props.onStopMove;

      _this.setState({
        dragging: false
      });

      onStopMove();

      _this.removeEvents();
    };

    _this.getSpinHeight = function () {
      var _this$props = _this.props,
          height = _this$props.height,
          count = _this$props.count;
      var baseHeight = height / count * 10;
      baseHeight = Math.max(baseHeight, MIN_SIZE);
      baseHeight = Math.min(baseHeight, height / 2);
      return Math.floor(baseHeight);
    };

    _this.getEnableScrollRange = function () {
      var _this$props2 = _this.props,
          scrollHeight = _this$props2.scrollHeight,
          height = _this$props2.height;
      return scrollHeight - height || 0;
    };

    _this.getEnableHeightRange = function () {
      var height = _this.props.height;

      var spinHeight = _this.getSpinHeight();

      return height - spinHeight || 0;
    };

    _this.getTop = function () {
      var scrollTop = _this.props.scrollTop;

      var enableScrollRange = _this.getEnableScrollRange();

      var enableHeightRange = _this.getEnableHeightRange();

      if (scrollTop === 0 || enableScrollRange === 0) {
        return 0;
      }

      var ptg = scrollTop / enableScrollRange;
      return ptg * enableHeightRange;
    };

    _this.showScroll = function () {
      var _this$props3 = _this.props,
          height = _this$props3.height,
          scrollHeight = _this$props3.scrollHeight;
      return scrollHeight > height;
    };

    return _this;
  }

  _createClass(ScrollBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.scrollbarRef.current.addEventListener('touchstart', this.onScrollbarTouchStart);
      this.thumbRef.current.addEventListener('touchstart', this.onMouseDown);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.scrollTop !== this.props.scrollTop) {
        this.delayHidden();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeEvents();
      clearTimeout(this.visibleTimeout);
    }
  }, {
    key: "render",
    value: // ====================== Render =======================
    function render() {
      var _this$state2 = this.state,
          dragging = _this$state2.dragging,
          visible = _this$state2.visible;
      var prefixCls = this.props.prefixCls;
      var spinHeight = this.getSpinHeight();
      var top = this.getTop();
      var canScroll = this.showScroll();
      var mergedVisible = canScroll && visible;
      return /*#__PURE__*/external_React_.createElement("div", {
        ref: this.scrollbarRef,
        className: classnames_default()("".concat(prefixCls, "-scrollbar"), ScrollBar_defineProperty({}, "".concat(prefixCls, "-scrollbar-show"), canScroll)),
        style: {
          width: 8,
          top: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: mergedVisible ? null : 'none'
        },
        onMouseDown: this.onContainerMouseDown,
        onMouseMove: this.delayHidden
      }, /*#__PURE__*/external_React_.createElement("div", {
        ref: this.thumbRef,
        className: classnames_default()("".concat(prefixCls, "-scrollbar-thumb"), ScrollBar_defineProperty({}, "".concat(prefixCls, "-scrollbar-thumb-moving"), dragging)),
        style: {
          width: '100%',
          height: spinHeight,
          top: top,
          left: 0,
          position: 'absolute',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 99,
          cursor: 'pointer',
          userSelect: 'none'
        },
        onMouseDown: this.onMouseDown
      }));
    }
  }]);

  return ScrollBar;
}(external_React_.Component);


;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/Item.js

function Item(_ref) {
  var children = _ref.children,
      setRef = _ref.setRef;
  var refFunc = external_React_.useCallback(function (node) {
    setRef(node);
  }, []);
  return /*#__PURE__*/external_React_.cloneElement(children, {
    ref: refFunc
  });
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/hooks/useChildren.js


function useChildren(list, startIndex, endIndex, setNodeRef, renderFunc, _ref) {
  var getKey = _ref.getKey;
  return list.slice(startIndex, endIndex + 1).map(function (item, index) {
    var eleIndex = startIndex + index;
    var node = renderFunc(item, eleIndex, {// style: status === 'MEASURE_START' ? { visibility: 'hidden' } : {},
    });
    var key = getKey(item);
    return /*#__PURE__*/external_React_.createElement(Item, {
      key: key,
      setRef: function setRef(ele) {
        return setNodeRef(item, ele);
      }
    }, node);
  });
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/utils/CacheMap.js
function CacheMap_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function CacheMap_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function CacheMap_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) CacheMap_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) CacheMap_defineProperties(Constructor, staticProps);
  return Constructor;
} // Firefox has low performance of map.


var CacheMap = /*#__PURE__*/function () {
  function CacheMap() {
    CacheMap_classCallCheck(this, CacheMap);

    this.maps = void 0;
    this.maps = {};
    this.maps.prototype = null;
  }

  CacheMap_createClass(CacheMap, [{
    key: "set",
    value: function set(key, value) {
      this.maps[key] = value;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.maps[key];
    }
  }]);

  return CacheMap;
}();

/* harmony default export */ const utils_CacheMap = (CacheMap);
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/hooks/useHeights.js
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}





function useHeights(getKey, onItemAdd, onItemRemove) {
  var _React$useState = external_React_.useState(0),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      updatedMark = _React$useState2[0],
      setUpdatedMark = _React$useState2[1];

  var instanceRef = (0,external_React_.useRef)(new Map());
  var heightsRef = (0,external_React_.useRef)(new utils_CacheMap());
  var heightUpdateIdRef = (0,external_React_.useRef)(0);

  function collectHeight() {
    heightUpdateIdRef.current += 1;
    var currentId = heightUpdateIdRef.current;
    Promise.resolve().then(function () {
      // Only collect when it's latest call
      if (currentId !== heightUpdateIdRef.current) return;
      instanceRef.current.forEach(function (element, key) {
        if (element && element.offsetParent) {
          var htmlElement = (0,findDOMNode/* default */.Z)(element);
          var offsetHeight = htmlElement.offsetHeight;

          if (heightsRef.current.get(key) !== offsetHeight) {
            heightsRef.current.set(key, htmlElement.offsetHeight);
          }
        }
      }); // Always trigger update mark to tell parent that should re-calculate heights when resized

      setUpdatedMark(function (c) {
        return c + 1;
      });
    });
  }

  function setInstanceRef(item, instance) {
    var key = getKey(item);
    var origin = instanceRef.current.get(key);

    if (instance) {
      instanceRef.current.set(key, instance);
      collectHeight();
    } else {
      instanceRef.current.delete(key);
    } // Instance changed


    if (!origin !== !instance) {
      if (instance) {
        onItemAdd === null || onItemAdd === void 0 ? void 0 : onItemAdd(item);
      } else {
        onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(item);
      }
    }
  }

  return [setInstanceRef, collectHeight, heightsRef.current, updatedMark];
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/hooks/useScrollTo.js
function useScrollTo_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    useScrollTo_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    useScrollTo_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return useScrollTo_typeof(obj);
}
/* eslint-disable no-param-reassign */




function useScrollTo(containerRef, data, heights, itemHeight, getKey, collectHeight, syncScrollTop, triggerFlash) {
  var scrollRef = external_React_.useRef();
  return function (arg) {
    // When not argument provided, we think dev may want to show the scrollbar
    if (arg === null || arg === undefined) {
      triggerFlash();
      return;
    } // Normal scroll logic


    raf/* default.cancel */.Z.cancel(scrollRef.current);

    if (typeof arg === 'number') {
      syncScrollTop(arg);
    } else if (arg && useScrollTo_typeof(arg) === 'object') {
      var index;
      var align = arg.align;

      if ('index' in arg) {
        index = arg.index;
      } else {
        index = data.findIndex(function (item) {
          return getKey(item) === arg.key;
        });
      }

      var _arg$offset = arg.offset,
          offset = _arg$offset === void 0 ? 0 : _arg$offset; // We will retry 3 times in case dynamic height shaking

      var syncScroll = function syncScroll(times, targetAlign) {
        if (times < 0 || !containerRef.current) return;
        var height = containerRef.current.clientHeight;
        var needCollectHeight = false;
        var newTargetAlign = targetAlign; // Go to next frame if height not exist

        if (height) {
          var mergedAlign = targetAlign || align; // Get top & bottom

          var stackTop = 0;
          var itemTop = 0;
          var itemBottom = 0;
          var maxLen = Math.min(data.length, index);

          for (var i = 0; i <= maxLen; i += 1) {
            var key = getKey(data[i]);
            itemTop = stackTop;
            var cacheHeight = heights.get(key);
            itemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);
            stackTop = itemBottom;

            if (i === index && cacheHeight === undefined) {
              needCollectHeight = true;
            }
          } // Scroll to


          var targetTop = null;

          switch (mergedAlign) {
            case 'top':
              targetTop = itemTop - offset;
              break;

            case 'bottom':
              targetTop = itemBottom - height + offset;
              break;

            default:
              {
                var scrollTop = containerRef.current.scrollTop;
                var scrollBottom = scrollTop + height;

                if (itemTop < scrollTop) {
                  newTargetAlign = 'top';
                } else if (itemBottom > scrollBottom) {
                  newTargetAlign = 'bottom';
                }
              }
          }

          if (targetTop !== null && targetTop !== containerRef.current.scrollTop) {
            syncScrollTop(targetTop);
          }
        } // We will retry since element may not sync height as it described


        scrollRef.current = (0,raf/* default */.Z)(function () {
          if (needCollectHeight) {
            collectHeight();
          }

          syncScroll(times - 1, newTargetAlign);
        });
      };

      syncScroll(3);
    }
  };
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/utils/algorithmUtil.js
/**
 * Get index with specific start index one by one. e.g.
 * min: 3, max: 9, start: 6
 *
 * Return index is:
 * [0]: 6
 * [1]: 7
 * [2]: 5
 * [3]: 8
 * [4]: 4
 * [5]: 9
 * [6]: 3
 */
function getIndexByStartLoc(min, max, start, index) {
  var beforeCount = start - min;
  var afterCount = max - start;
  var balanceCount = Math.min(beforeCount, afterCount) * 2; // Balance

  if (index <= balanceCount) {
    var stepIndex = Math.floor(index / 2);

    if (index % 2) {
      return start + stepIndex + 1;
    }

    return start - stepIndex;
  } // One is out of range


  if (beforeCount > afterCount) {
    return start - (index - afterCount);
  }

  return start + (index - beforeCount);
}
/**
 * We assume that 2 list has only 1 item diff and others keeping the order.
 * So we can use dichotomy algorithm to find changed one.
 */

function findListDiffIndex(originList, targetList, getKey) {
  var originLen = originList.length;
  var targetLen = targetList.length;
  var shortList;
  var longList;

  if (originLen === 0 && targetLen === 0) {
    return null;
  }

  if (originLen < targetLen) {
    shortList = originList;
    longList = targetList;
  } else {
    shortList = targetList;
    longList = originList;
  }

  var notExistKey = {
    __EMPTY_ITEM__: true
  };

  function getItemKey(item) {
    if (item !== undefined) {
      return getKey(item);
    }

    return notExistKey;
  } // Loop to find diff one


  var diffIndex = null;
  var multiple = Math.abs(originLen - targetLen) !== 1;

  for (var i = 0; i < longList.length; i += 1) {
    var shortKey = getItemKey(shortList[i]);
    var longKey = getItemKey(longList[i]);

    if (shortKey !== longKey) {
      diffIndex = i;
      multiple = multiple || shortKey !== getItemKey(longList[i + 1]);
      break;
    }
  }

  return diffIndex === null ? null : {
    index: diffIndex,
    multiple: multiple
  };
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/hooks/useDiffItem.js
function useDiffItem_slicedToArray(arr, i) {
  return useDiffItem_arrayWithHoles(arr) || useDiffItem_iterableToArrayLimit(arr, i) || useDiffItem_unsupportedIterableToArray(arr, i) || useDiffItem_nonIterableRest();
}

function useDiffItem_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function useDiffItem_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return useDiffItem_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return useDiffItem_arrayLikeToArray(o, minLen);
}

function useDiffItem_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function useDiffItem_iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function useDiffItem_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}



function useDiffItem(data, getKey, onDiff) {
  var _React$useState = external_React_.useState(data),
      _React$useState2 = useDiffItem_slicedToArray(_React$useState, 2),
      prevData = _React$useState2[0],
      setPrevData = _React$useState2[1];

  var _React$useState3 = external_React_.useState(null),
      _React$useState4 = useDiffItem_slicedToArray(_React$useState3, 2),
      diffItem = _React$useState4[0],
      setDiffItem = _React$useState4[1];

  external_React_.useEffect(function () {
    var diff = findListDiffIndex(prevData || [], data || [], getKey);

    if ((diff === null || diff === void 0 ? void 0 : diff.index) !== undefined) {
      onDiff === null || onDiff === void 0 ? void 0 : onDiff(diff.index);
      setDiffItem(data[diff.index]);
    }

    setPrevData(data);
  }, [data]);
  return [diffItem];
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/utils/isFirefox.js
function isFirefox_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    isFirefox_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    isFirefox_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return isFirefox_typeof(obj);
}

var isFF = (typeof navigator === "undefined" ? "undefined" : isFirefox_typeof(navigator)) === 'object' && /Firefox/i.test(navigator.userAgent);
/* harmony default export */ const isFirefox = (isFF);
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/hooks/useOriginScroll.js

/* harmony default export */ const useOriginScroll = (function (isScrollAtTop, isScrollAtBottom) {
  // Do lock for a wheel when scrolling
  var lockRef = (0,external_React_.useRef)(false);
  var lockTimeoutRef = (0,external_React_.useRef)(null);

  function lockScroll() {
    clearTimeout(lockTimeoutRef.current);
    lockRef.current = true;
    lockTimeoutRef.current = setTimeout(function () {
      lockRef.current = false;
    }, 50);
  } // Pass to ref since global add is in closure


  var scrollPingRef = (0,external_React_.useRef)({
    top: isScrollAtTop,
    bottom: isScrollAtBottom
  });
  scrollPingRef.current.top = isScrollAtTop;
  scrollPingRef.current.bottom = isScrollAtBottom;
  return function (deltaY) {
    var smoothOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var originScroll = // Pass origin wheel when on the top
    deltaY < 0 && scrollPingRef.current.top || // Pass origin wheel when on the bottom
    deltaY > 0 && scrollPingRef.current.bottom;

    if (smoothOffset && originScroll) {
      // No need lock anymore when it's smooth offset from touchMove interval
      clearTimeout(lockTimeoutRef.current);
      lockRef.current = false;
    } else if (!originScroll || lockRef.current) {
      lockScroll();
    }

    return !lockRef.current && originScroll;
  };
});
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/hooks/useFrameWheel.js




function useFrameWheel(inVirtual, isScrollAtTop, isScrollAtBottom, onWheelDelta) {
  var offsetRef = (0,external_React_.useRef)(0);
  var nextFrameRef = (0,external_React_.useRef)(null); // Firefox patch

  var wheelValueRef = (0,external_React_.useRef)(null);
  var isMouseScrollRef = (0,external_React_.useRef)(false); // Scroll status sync

  var originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom);

  function onWheel(event) {
    if (!inVirtual) return;
    raf/* default.cancel */.Z.cancel(nextFrameRef.current);
    var deltaY = event.deltaY;
    offsetRef.current += deltaY;
    wheelValueRef.current = deltaY; // Do nothing when scroll at the edge, Skip check when is in scroll

    if (originScroll(deltaY)) return; // Proxy of scroll events

    if (!isFirefox) {
      event.preventDefault();
    }

    nextFrameRef.current = (0,raf/* default */.Z)(function () {
      // Patch a multiple for Firefox to fix wheel number too small
      // ref: https://github.com/ant-design/ant-design/issues/26372#issuecomment-679460266
      var patchMultiple = isMouseScrollRef.current ? 10 : 1;
      onWheelDelta(offsetRef.current * patchMultiple);
      offsetRef.current = 0;
    });
  } // A patch for firefox


  function onFireFoxScroll(event) {
    if (!inVirtual) return;
    isMouseScrollRef.current = event.detail === wheelValueRef.current;
  }

  return [onWheel, onFireFoxScroll];
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/hooks/useMobileTouchMove.js


var SMOOTH_PTG = 14 / 15;
function useMobileTouchMove(inVirtual, listRef, callback) {
  var touchedRef = (0,external_React_.useRef)(false);
  var touchYRef = (0,external_React_.useRef)(0);
  var elementRef = (0,external_React_.useRef)(null); // Smooth scroll

  var intervalRef = (0,external_React_.useRef)(null);
  var cleanUpEvents;

  var onTouchMove = function onTouchMove(e) {
    if (touchedRef.current) {
      var currentY = Math.ceil(e.touches[0].pageY);
      var offsetY = touchYRef.current - currentY;
      touchYRef.current = currentY;

      if (callback(offsetY)) {
        e.preventDefault();
      } // Smooth interval


      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(function () {
        offsetY *= SMOOTH_PTG;

        if (!callback(offsetY, true) || Math.abs(offsetY) <= 0.1) {
          clearInterval(intervalRef.current);
        }
      }, 16);
    }
  };

  var onTouchEnd = function onTouchEnd() {
    touchedRef.current = false;
    cleanUpEvents();
  };

  var onTouchStart = function onTouchStart(e) {
    cleanUpEvents();

    if (e.touches.length === 1 && !touchedRef.current) {
      touchedRef.current = true;
      touchYRef.current = Math.ceil(e.touches[0].pageY);
      elementRef.current = e.target;
      elementRef.current.addEventListener('touchmove', onTouchMove);
      elementRef.current.addEventListener('touchend', onTouchEnd);
    }
  };

  cleanUpEvents = function cleanUpEvents() {
    if (elementRef.current) {
      elementRef.current.removeEventListener('touchmove', onTouchMove);
      elementRef.current.removeEventListener('touchend', onTouchEnd);
    }
  };

  external_React_.useLayoutEffect(function () {
    if (inVirtual) {
      listRef.current.addEventListener('touchstart', onTouchStart);
    }

    return function () {
      listRef.current.removeEventListener('touchstart', onTouchStart);
      cleanUpEvents();
      clearInterval(intervalRef.current);
    };
  }, [inVirtual]);
}
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/List.js
var _excluded = ["prefixCls", "className", "height", "itemHeight", "fullHeight", "style", "data", "children", "itemKey", "virtual", "component", "onScroll"];

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function List_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function List_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      List_ownKeys(Object(source), true).forEach(function (key) {
        List_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      List_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function List_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function List_slicedToArray(arr, i) {
  return List_arrayWithHoles(arr) || List_iterableToArrayLimit(arr, i) || List_unsupportedIterableToArray(arr, i) || List_nonIterableRest();
}

function List_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function List_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return List_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return List_arrayLikeToArray(o, minLen);
}

function List_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function List_iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function List_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}













var EMPTY_DATA = [];
var ScrollStyle = {
  overflowY: 'auto',
  overflowAnchor: 'none'
};
function RawList(props, ref) {
  var _props$prefixCls = props.prefixCls,
      prefixCls = _props$prefixCls === void 0 ? 'rc-virtual-list' : _props$prefixCls,
      className = props.className,
      height = props.height,
      itemHeight = props.itemHeight,
      _props$fullHeight = props.fullHeight,
      fullHeight = _props$fullHeight === void 0 ? true : _props$fullHeight,
      style = props.style,
      data = props.data,
      children = props.children,
      itemKey = props.itemKey,
      virtual = props.virtual,
      _props$component = props.component,
      Component = _props$component === void 0 ? 'div' : _props$component,
      onScroll = props.onScroll,
      restProps = _objectWithoutProperties(props, _excluded); // ================================= MISC =================================


  var useVirtual = !!(virtual !== false && height && itemHeight);
  var inVirtual = useVirtual && data && itemHeight * data.length > height;

  var _useState = (0,external_React_.useState)(0),
      _useState2 = List_slicedToArray(_useState, 2),
      scrollTop = _useState2[0],
      setScrollTop = _useState2[1];

  var _useState3 = (0,external_React_.useState)(false),
      _useState4 = List_slicedToArray(_useState3, 2),
      scrollMoving = _useState4[0],
      setScrollMoving = _useState4[1];

  var mergedClassName = classnames_default()(prefixCls, className);
  var mergedData = data || EMPTY_DATA;
  var componentRef = (0,external_React_.useRef)();
  var fillerInnerRef = (0,external_React_.useRef)();
  var scrollBarRef = (0,external_React_.useRef)(); // Hack on scrollbar to enable flash call
  // =============================== Item Key ===============================

  var getKey = external_React_.useCallback(function (item) {
    if (typeof itemKey === 'function') {
      return itemKey(item);
    }

    return item === null || item === void 0 ? void 0 : item[itemKey];
  }, [itemKey]);
  var sharedConfig = {
    getKey: getKey
  }; // ================================ Scroll ================================

  function syncScrollTop(newTop) {
    setScrollTop(function (origin) {
      var value;

      if (typeof newTop === 'function') {
        value = newTop(origin);
      } else {
        value = newTop;
      }

      var alignedTop = keepInRange(value);
      componentRef.current.scrollTop = alignedTop;
      return alignedTop;
    });
  } // ================================ Legacy ================================
  // Put ref here since the range is generate by follow


  var rangeRef = (0,external_React_.useRef)({
    start: 0,
    end: mergedData.length
  });
  var diffItemRef = (0,external_React_.useRef)();

  var _useDiffItem = useDiffItem(mergedData, getKey),
      _useDiffItem2 = List_slicedToArray(_useDiffItem, 1),
      diffItem = _useDiffItem2[0];

  diffItemRef.current = diffItem; // ================================ Height ================================

  var _useHeights = useHeights(getKey, null, null),
      _useHeights2 = List_slicedToArray(_useHeights, 4),
      setInstanceRef = _useHeights2[0],
      collectHeight = _useHeights2[1],
      heights = _useHeights2[2],
      heightUpdatedMark = _useHeights2[3]; // ========================== Visible Calculation =========================


  var _React$useMemo = external_React_.useMemo(function () {
    if (!useVirtual) {
      return {
        scrollHeight: undefined,
        start: 0,
        end: mergedData.length - 1,
        offset: undefined
      };
    } // Always use virtual scroll bar in avoid shaking
    // Always use virtual scroll bar in avoid shaking


    if (!inVirtual) {
      var _fillerInnerRef$curre;

      return {
        scrollHeight: ((_fillerInnerRef$curre = fillerInnerRef.current) === null || _fillerInnerRef$curre === void 0 ? void 0 : _fillerInnerRef$curre.offsetHeight) || 0,
        start: 0,
        end: mergedData.length - 1,
        offset: undefined
      };
    }

    var itemTop = 0;
    var startIndex;
    var startOffset;
    var endIndex;
    var dataLen = mergedData.length;

    for (var i = 0; i < dataLen; i += 1) {
      var item = mergedData[i];
      var key = getKey(item);
      var cacheHeight = heights.get(key);
      var currentItemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight); // Check item top in the range
      // Check item top in the range

      if (currentItemBottom >= scrollTop && startIndex === undefined) {
        startIndex = i;
        startOffset = itemTop;
      } // Check item bottom in the range. We will render additional one item for motion usage
      // Check item bottom in the range. We will render additional one item for motion usage


      if (currentItemBottom > scrollTop + height && endIndex === undefined) {
        endIndex = i;
      }

      itemTop = currentItemBottom;
    } // Fallback to normal if not match. This code should never reach

    /* istanbul ignore next */
    // Fallback to normal if not match. This code should never reach

    /* istanbul ignore next */


    if (startIndex === undefined) {
      startIndex = 0;
      startOffset = 0;
    }

    if (endIndex === undefined) {
      endIndex = mergedData.length - 1;
    } // Give cache to improve scroll experience
    // Give cache to improve scroll experience


    endIndex = Math.min(endIndex + 1, mergedData.length);
    return {
      scrollHeight: itemTop,
      start: startIndex,
      end: endIndex,
      offset: startOffset
    };
  }, [inVirtual, useVirtual, scrollTop, mergedData, heightUpdatedMark, height]),
      scrollHeight = _React$useMemo.scrollHeight,
      start = _React$useMemo.start,
      end = _React$useMemo.end,
      offset = _React$useMemo.offset;

  rangeRef.current.start = start;
  rangeRef.current.end = end; // =============================== In Range ===============================

  var maxScrollHeight = scrollHeight - height;
  var maxScrollHeightRef = (0,external_React_.useRef)(maxScrollHeight);
  maxScrollHeightRef.current = maxScrollHeight;

  function keepInRange(newScrollTop) {
    var newTop = newScrollTop;

    if (!Number.isNaN(maxScrollHeightRef.current)) {
      newTop = Math.min(newTop, maxScrollHeightRef.current);
    }

    newTop = Math.max(newTop, 0);
    return newTop;
  }

  var isScrollAtTop = scrollTop <= 0;
  var isScrollAtBottom = scrollTop >= maxScrollHeight;
  var originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom); // ================================ Scroll ================================

  function onScrollBar(newScrollTop) {
    var newTop = newScrollTop;
    syncScrollTop(newTop);
  } // When data size reduce. It may trigger native scroll event back to fit scroll position


  function onFallbackScroll(e) {
    var newScrollTop = e.currentTarget.scrollTop;

    if (newScrollTop !== scrollTop) {
      syncScrollTop(newScrollTop);
    } // Trigger origin onScroll


    onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
  } // Since this added in global,should use ref to keep update


  var _useFrameWheel = useFrameWheel(useVirtual, isScrollAtTop, isScrollAtBottom, function (offsetY) {
    syncScrollTop(function (top) {
      var newTop = top + offsetY;
      return newTop;
    });
  }),
      _useFrameWheel2 = List_slicedToArray(_useFrameWheel, 2),
      onRawWheel = _useFrameWheel2[0],
      onFireFoxScroll = _useFrameWheel2[1]; // Mobile touch move


  useMobileTouchMove(useVirtual, componentRef, function (deltaY, smoothOffset) {
    if (originScroll(deltaY, smoothOffset)) {
      return false;
    }

    onRawWheel({
      preventDefault: function preventDefault() {},
      deltaY: deltaY
    });
    return true;
  });
  external_React_.useLayoutEffect(function () {
    // Firefox only
    function onMozMousePixelScroll(e) {
      if (useVirtual) {
        e.preventDefault();
      }
    }

    componentRef.current.addEventListener('wheel', onRawWheel);
    componentRef.current.addEventListener('DOMMouseScroll', onFireFoxScroll);
    componentRef.current.addEventListener('MozMousePixelScroll', onMozMousePixelScroll);
    return function () {
      componentRef.current.removeEventListener('wheel', onRawWheel);
      componentRef.current.removeEventListener('DOMMouseScroll', onFireFoxScroll);
      componentRef.current.removeEventListener('MozMousePixelScroll', onMozMousePixelScroll);
    };
  }, [useVirtual]); // ================================= Ref ==================================

  var scrollTo = useScrollTo(componentRef, mergedData, heights, itemHeight, getKey, collectHeight, syncScrollTop, function () {
    var _scrollBarRef$current;

    (_scrollBarRef$current = scrollBarRef.current) === null || _scrollBarRef$current === void 0 ? void 0 : _scrollBarRef$current.delayHidden();
  });
  external_React_.useImperativeHandle(ref, function () {
    return {
      scrollTo: scrollTo
    };
  }); // ================================ Render ================================

  var listChildren = useChildren(mergedData, start, end, setInstanceRef, children, sharedConfig);
  var componentStyle = null;

  if (height) {
    componentStyle = List_objectSpread(List_defineProperty({}, fullHeight ? 'height' : 'maxHeight', height), ScrollStyle);

    if (useVirtual) {
      componentStyle.overflowY = 'hidden';

      if (scrollMoving) {
        componentStyle.pointerEvents = 'none';
      }
    }
  }

  return /*#__PURE__*/external_React_.createElement("div", _extends({
    style: List_objectSpread(List_objectSpread({}, style), {}, {
      position: 'relative'
    }),
    className: mergedClassName
  }, restProps), /*#__PURE__*/external_React_.createElement(Component, {
    className: "".concat(prefixCls, "-holder"),
    style: componentStyle,
    ref: componentRef,
    onScroll: onFallbackScroll
  }, /*#__PURE__*/external_React_.createElement(es_Filler, {
    prefixCls: prefixCls,
    height: scrollHeight,
    offset: offset,
    onInnerResize: collectHeight,
    ref: fillerInnerRef
  }, listChildren)), useVirtual && /*#__PURE__*/external_React_.createElement(ScrollBar, {
    ref: scrollBarRef,
    prefixCls: prefixCls,
    scrollTop: scrollTop,
    height: height,
    scrollHeight: scrollHeight,
    count: mergedData.length,
    onScroll: onScrollBar,
    onStartMove: function onStartMove() {
      setScrollMoving(true);
    },
    onStopMove: function onStopMove() {
      setScrollMoving(false);
    }
  }));
}
var List = /*#__PURE__*/external_React_.forwardRef(RawList);
List.displayName = 'List';
/* harmony default export */ const es_List = (List);
;// CONCATENATED MODULE: ./node_modules/rc-virtual-list/es/index.js

/* harmony default export */ const rc_virtual_list_es = (es_List);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/TransBtn.js



var TransBtn = function TransBtn(_ref) {
  var className = _ref.className,
      customizeIcon = _ref.customizeIcon,
      customizeIconProps = _ref.customizeIconProps,
      _onMouseDown = _ref.onMouseDown,
      onClick = _ref.onClick,
      children = _ref.children;
  var icon;

  if (typeof customizeIcon === 'function') {
    icon = customizeIcon(customizeIconProps);
  } else {
    icon = customizeIcon;
  }

  return /*#__PURE__*/external_React_.createElement("span", {
    className: className,
    onMouseDown: function onMouseDown(event) {
      event.preventDefault();

      if (_onMouseDown) {
        _onMouseDown(event);
      }
    },
    style: {
      userSelect: 'none',
      WebkitUserSelect: 'none'
    },
    unselectable: "on",
    onClick: onClick,
    "aria-hidden": true
  }, icon !== undefined ? icon : /*#__PURE__*/external_React_.createElement("span", {
    className: classnames_default()(className.split(/\s+/).map(function (cls) {
      return "".concat(cls, "-icon");
    }))
  }, children));
};

/* harmony default export */ const es_TransBtn = (TransBtn);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/OptionList.js











/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */

var OptionList = function OptionList(_ref, ref) {
  var prefixCls = _ref.prefixCls,
      id = _ref.id,
      flattenOptions = _ref.flattenOptions,
      childrenAsData = _ref.childrenAsData,
      values = _ref.values,
      searchValue = _ref.searchValue,
      multiple = _ref.multiple,
      defaultActiveFirstOption = _ref.defaultActiveFirstOption,
      height = _ref.height,
      itemHeight = _ref.itemHeight,
      notFoundContent = _ref.notFoundContent,
      open = _ref.open,
      menuItemSelectedIcon = _ref.menuItemSelectedIcon,
      virtual = _ref.virtual,
      onSelect = _ref.onSelect,
      onToggleOpen = _ref.onToggleOpen,
      onActiveValue = _ref.onActiveValue,
      onScroll = _ref.onScroll,
      onMouseEnter = _ref.onMouseEnter;
  var itemPrefixCls = "".concat(prefixCls, "-item");
  var memoFlattenOptions = useMemo(function () {
    return flattenOptions;
  }, [open, flattenOptions], function (prev, next) {
    return next[0] && prev[1] !== next[1];
  }); // =========================== List ===========================

  var listRef = external_React_.useRef(null);

  var onListMouseDown = function onListMouseDown(event) {
    event.preventDefault();
  };

  var scrollIntoView = function scrollIntoView(index) {
    if (listRef.current) {
      listRef.current.scrollTo({
        index: index
      });
    }
  }; // ========================== Active ==========================


  var getEnabledActiveIndex = function getEnabledActiveIndex(index) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var len = memoFlattenOptions.length;

    for (var i = 0; i < len; i += 1) {
      var current = (index + i * offset + len) % len;
      var _memoFlattenOptions$c = memoFlattenOptions[current],
          group = _memoFlattenOptions$c.group,
          data = _memoFlattenOptions$c.data;

      if (!group && !data.disabled) {
        return current;
      }
    }

    return -1;
  };

  var _React$useState = external_React_.useState(function () {
    return getEnabledActiveIndex(0);
  }),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      activeIndex = _React$useState2[0],
      setActiveIndex = _React$useState2[1];

  var setActive = function setActive(index) {
    var fromKeyboard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    setActiveIndex(index);
    var info = {
      source: fromKeyboard ? 'keyboard' : 'mouse'
    }; // Trigger active event

    var flattenItem = memoFlattenOptions[index];

    if (!flattenItem) {
      onActiveValue(null, -1, info);
      return;
    }

    onActiveValue(flattenItem.data.value, index, info);
  }; // Auto active first item when list length or searchValue changed


  external_React_.useEffect(function () {
    setActive(defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
  }, [memoFlattenOptions.length, searchValue]); // Auto scroll to item position in single mode

  external_React_.useEffect(function () {
    /**
     * React will skip `onChange` when component update.
     * `setActive` function will call root accessibility state update which makes re-render.
     * So we need to delay to let Input component trigger onChange first.
     */
    var timeoutId = setTimeout(function () {
      if (!multiple && open && values.size === 1) {
        var value = Array.from(values)[0];
        var index = memoFlattenOptions.findIndex(function (_ref2) {
          var data = _ref2.data;
          return data.value === value;
        });
        setActive(index);
        scrollIntoView(index);
      }
    }); // Force trigger scrollbar visible when open

    if (open) {
      var _listRef$current;

      (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.scrollTo(undefined);
    }

    return function () {
      return clearTimeout(timeoutId);
    };
  }, [open]); // ========================== Values ==========================

  var onSelectValue = function onSelectValue(value) {
    if (value !== undefined) {
      onSelect(value, {
        selected: !values.has(value)
      });
    } // Single mode should always close by select


    if (!multiple) {
      onToggleOpen(false);
    }
  }; // ========================= Keyboard =========================


  external_React_.useImperativeHandle(ref, function () {
    return {
      onKeyDown: function onKeyDown(event) {
        var which = event.which;

        switch (which) {
          // >>> Arrow keys
          case es_KeyCode.UP:
          case es_KeyCode.DOWN:
            {
              var offset = 0;

              if (which === es_KeyCode.UP) {
                offset = -1;
              } else if (which === es_KeyCode.DOWN) {
                offset = 1;
              }

              if (offset !== 0) {
                var nextActiveIndex = getEnabledActiveIndex(activeIndex + offset, offset);
                scrollIntoView(nextActiveIndex);
                setActive(nextActiveIndex, true);
              }

              break;
            }
          // >>> Select

          case es_KeyCode.ENTER:
            {
              // value
              var item = memoFlattenOptions[activeIndex];

              if (item && !item.data.disabled) {
                onSelectValue(item.data.value);
              } else {
                onSelectValue(undefined);
              }

              if (open) {
                event.preventDefault();
              }

              break;
            }
          // >>> Close

          case es_KeyCode.ESC:
            {
              onToggleOpen(false);

              if (open) {
                event.stopPropagation();
              }
            }
        }
      },
      onKeyUp: function onKeyUp() {},
      scrollTo: function scrollTo(index) {
        scrollIntoView(index);
      }
    };
  }); // ========================== Render ==========================

  if (memoFlattenOptions.length === 0) {
    return /*#__PURE__*/external_React_.createElement("div", {
      role: "listbox",
      id: "".concat(id, "_list"),
      className: "".concat(itemPrefixCls, "-empty"),
      onMouseDown: onListMouseDown
    }, notFoundContent);
  }

  function renderItem(index) {
    var item = memoFlattenOptions[index];
    if (!item) return null;
    var itemData = item.data || {};
    var value = itemData.value,
        label = itemData.label,
        children = itemData.children;
    var attrs = pickAttrs(itemData, true);
    var mergedLabel = childrenAsData ? children : label;
    return item ? /*#__PURE__*/external_React_.createElement("div", (0,esm_extends/* default */.Z)({
      "aria-label": typeof mergedLabel === 'string' ? mergedLabel : null
    }, attrs, {
      key: index,
      role: "option",
      id: "".concat(id, "_list_").concat(index),
      "aria-selected": values.has(value)
    }), value) : null;
  }

  return /*#__PURE__*/external_React_.createElement(external_React_.Fragment, null, /*#__PURE__*/external_React_.createElement("div", {
    role: "listbox",
    id: "".concat(id, "_list"),
    style: {
      height: 0,
      width: 0,
      overflow: 'hidden'
    }
  }, renderItem(activeIndex - 1), renderItem(activeIndex), renderItem(activeIndex + 1)), /*#__PURE__*/external_React_.createElement(rc_virtual_list_es, {
    itemKey: "key",
    ref: listRef,
    data: memoFlattenOptions,
    height: height,
    itemHeight: itemHeight,
    fullHeight: false,
    onMouseDown: onListMouseDown,
    onScroll: onScroll,
    virtual: virtual,
    onMouseEnter: onMouseEnter
  }, function (_ref3, itemIndex) {
    var _classNames;

    var group = _ref3.group,
        groupOption = _ref3.groupOption,
        data = _ref3.data;
    var label = data.label,
        key = data.key; // Group

    if (group) {
      return /*#__PURE__*/external_React_.createElement("div", {
        className: classnames_default()(itemPrefixCls, "".concat(itemPrefixCls, "-group"))
      }, label !== undefined ? label : key);
    }

    var disabled = data.disabled,
        value = data.value,
        title = data.title,
        children = data.children,
        style = data.style,
        className = data.className,
        otherProps = (0,objectWithoutProperties/* default */.Z)(data, ["disabled", "value", "title", "children", "style", "className"]); // Option


    var selected = values.has(value);
    var optionPrefixCls = "".concat(itemPrefixCls, "-option");
    var optionClassName = classnames_default()(itemPrefixCls, optionPrefixCls, className, (_classNames = {}, (0,defineProperty/* default */.Z)(_classNames, "".concat(optionPrefixCls, "-grouped"), groupOption), (0,defineProperty/* default */.Z)(_classNames, "".concat(optionPrefixCls, "-active"), activeIndex === itemIndex && !disabled), (0,defineProperty/* default */.Z)(_classNames, "".concat(optionPrefixCls, "-disabled"), disabled), (0,defineProperty/* default */.Z)(_classNames, "".concat(optionPrefixCls, "-selected"), selected), _classNames));
    var mergedLabel = childrenAsData ? children : label;
    var iconVisible = !menuItemSelectedIcon || typeof menuItemSelectedIcon === 'function' || selected;
    var content = mergedLabel || value; // https://github.com/ant-design/ant-design/issues/26717

    var optionTitle = typeof content === 'string' || typeof content === 'number' ? content.toString() : undefined;

    if (title !== undefined) {
      optionTitle = title;
    }

    return /*#__PURE__*/external_React_.createElement("div", (0,esm_extends/* default */.Z)({}, otherProps, {
      "aria-selected": selected,
      className: optionClassName,
      title: optionTitle,
      onMouseMove: function onMouseMove() {
        if (activeIndex === itemIndex || disabled) {
          return;
        }

        setActive(itemIndex);
      },
      onClick: function onClick() {
        if (!disabled) {
          onSelectValue(value);
        }
      },
      style: style
    }), /*#__PURE__*/external_React_.createElement("div", {
      className: "".concat(optionPrefixCls, "-content")
    }, content), /*#__PURE__*/ /*#__PURE__*/external_React_.isValidElement(menuItemSelectedIcon) || selected, iconVisible && /*#__PURE__*/external_React_.createElement(es_TransBtn, {
      className: "".concat(itemPrefixCls, "-option-state"),
      customizeIcon: menuItemSelectedIcon,
      customizeIconProps: {
        isSelected: selected
      }
    }, selected ? '✓' : null));
  }));
};

var RefOptionList = /*#__PURE__*/external_React_.forwardRef(OptionList);
RefOptionList.displayName = 'OptionList';
/* harmony default export */ const es_OptionList = (RefOptionList);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/Option.js
/** This is a placeholder, not real render in dom */
var Option = function Option() {
  return null;
};

Option.isSelectOption = true;
/* harmony default export */ const es_Option = (Option);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/OptGroup.js
/** This is a placeholder, not real render in dom */
var OptGroup = function OptGroup() {
  return null;
};

OptGroup.isSelectOptGroup = true;
/* harmony default export */ const es_OptGroup = (OptGroup);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/utils/legacyUtil.js





function convertNodeToOption(node) {
  var key = node.key,
      _node$props = node.props,
      children = _node$props.children,
      value = _node$props.value,
      restProps = (0,objectWithoutProperties/* default */.Z)(_node$props, ["children", "value"]);

  return (0,objectSpread2/* default */.Z)({
    key: key,
    value: value !== undefined ? value : key,
    children: children
  }, restProps);
}

function convertChildrenToData(nodes) {
  var optionOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (0,toArray/* default */.Z)(nodes).map(function (node, index) {
    if (! /*#__PURE__*/external_React_.isValidElement(node) || !node.type) {
      return null;
    }

    var isSelectOptGroup = node.type.isSelectOptGroup,
        key = node.key,
        _node$props2 = node.props,
        children = _node$props2.children,
        restProps = (0,objectWithoutProperties/* default */.Z)(_node$props2, ["children"]);

    if (optionOnly || !isSelectOptGroup) {
      return convertNodeToOption(node);
    }

    return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({
      key: "__RC_SELECT_GRP__".concat(key === null ? index : key, "__"),
      label: key
    }, restProps), {}, {
      options: convertChildrenToData(children)
    });
  }).filter(function (data) {
    return data;
  });
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/toArray.js
var esm_toArray = __webpack_require__(723);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js + 2 modules
var toConsumableArray = __webpack_require__(9041);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__(4933);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/utils/commonUtil.js

function commonUtil_toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return value !== undefined ? [value] : [];
}
/**
 * Convert outer props value into internal value
 */

function toInnerValue(value, _ref) {
  var labelInValue = _ref.labelInValue,
      combobox = _ref.combobox;
  var valueMap = new Map();

  if (value === undefined || value === '' && combobox) {
    return [[], valueMap];
  }

  var values = Array.isArray(value) ? value : [value];
  var rawValues = values;

  if (labelInValue) {
    rawValues = values.filter(function (item) {
      return item !== null;
    }).map(function (itemValue) {
      var key = itemValue.key,
          val = itemValue.value;
      var finalVal = val !== undefined ? val : key;
      valueMap.set(finalVal, itemValue);
      return finalVal;
    });
  }

  return [rawValues, valueMap];
}
/**
 * Convert internal value into out event value
 */

function toOuterValues(valueList, _ref2) {
  var optionLabelProp = _ref2.optionLabelProp,
      labelInValue = _ref2.labelInValue,
      prevValueMap = _ref2.prevValueMap,
      options = _ref2.options,
      getLabeledValue = _ref2.getLabeledValue;
  var values = valueList;

  if (labelInValue) {
    values = values.map(function (val) {
      return getLabeledValue(val, {
        options: options,
        prevValueMap: prevValueMap,
        labelInValue: labelInValue,
        optionLabelProp: optionLabelProp
      });
    });
  }

  return values;
}
function removeLastEnabledValue(measureValues, values) {
  var newValues = (0,toConsumableArray/* default */.Z)(values);

  var removeIndex;

  for (removeIndex = measureValues.length - 1; removeIndex >= 0; removeIndex -= 1) {
    if (!measureValues[removeIndex].disabled) {
      break;
    }
  }

  var removedValue = null;

  if (removeIndex !== -1) {
    removedValue = newValues[removeIndex];
    newValues.splice(removeIndex, 1);
  }

  return {
    values: newValues,
    removedValue: removedValue
  };
}
var isClient = typeof window !== 'undefined' && window.document && window.document.documentElement;
/** Is client side and not jsdom */

var isBrowserClient =  true && isClient;
var uuid = 0;
/** Get unique id for accessibility usage */

function getUUID() {
  var retId; // Test never reach

  /* istanbul ignore if */

  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = 'TEST_OR_SSR';
  }

  return retId;
}
;// CONCATENATED MODULE: ./node_modules/rc-select/es/utils/valueUtil.js








function getKey(data, index) {
  var key = data.key;
  var value;

  if ('value' in data) {
    value = data.value;
  }

  if (key !== null && key !== undefined) {
    return key;
  }

  if (value !== undefined) {
    return value;
  }

  return "rc-index-key-".concat(index);
}
/**
 * Flat options into flatten list.
 * We use `optionOnly` here is aim to avoid user use nested option group.
 * Here is simply set `key` to the index if not provided.
 */


function flattenOptions(options) {
  var flattenList = [];

  function dig(list, isGroupOption) {
    list.forEach(function (data) {
      if (isGroupOption || !('options' in data)) {
        // Option
        flattenList.push({
          key: getKey(data, flattenList.length),
          groupOption: isGroupOption,
          data: data
        });
      } else {
        // Option Group
        flattenList.push({
          key: getKey(data, flattenList.length),
          group: true,
          data: data
        });
        dig(data.options, true);
      }
    });
  }

  dig(options, false);
  return flattenList;
}
/**
 * Inject `props` into `option` for legacy usage
 */

function injectPropsWithOption(option) {
  var newOption = (0,objectSpread2/* default */.Z)({}, option);

  if (!('props' in newOption)) {
    Object.defineProperty(newOption, 'props', {
      get: function get() {
        (0,warning/* default */.ZP)(false, 'Return type is option instead of Option instance. Please read value directly instead of reading from `props`.');
        return newOption;
      }
    });
  }

  return newOption;
}

function findValueOption(values, options) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$prevValueOptions = _ref.prevValueOptions,
      prevValueOptions = _ref$prevValueOptions === void 0 ? [] : _ref$prevValueOptions;

  var optionMap = new Map();
  options.forEach(function (flattenItem) {
    if (!flattenItem.group) {
      var data = flattenItem.data; // Check if match

      optionMap.set(data.value, data);
    }
  });
  return values.map(function (val) {
    var option = optionMap.get(val); // Fallback to try to find prev options

    if (!option) {
      option = (0,objectSpread2/* default */.Z)({}, prevValueOptions.find(function (opt) {
        return opt._INTERNAL_OPTION_VALUE_ === val;
      }));
    }

    return injectPropsWithOption(option);
  });
}
var getLabeledValue = function getLabeledValue(value, _ref2) {
  var options = _ref2.options,
      prevValueMap = _ref2.prevValueMap,
      labelInValue = _ref2.labelInValue,
      optionLabelProp = _ref2.optionLabelProp;
  var item = findValueOption([value], options)[0];
  var result = {
    value: value
  };
  var prevValItem = labelInValue ? prevValueMap.get(value) : undefined;

  if (prevValItem && (0,esm_typeof/* default */.Z)(prevValItem) === 'object' && 'label' in prevValItem) {
    result.label = prevValItem.label;

    if (item && typeof prevValItem.label === 'string' && typeof item[optionLabelProp] === 'string' && prevValItem.label.trim() !== item[optionLabelProp].trim()) {
      (0,warning/* default */.ZP)(false, '`label` of `value` is not same as `label` in Select options.');
    }
  } else if (item && optionLabelProp in item) {
    result.label = item[optionLabelProp];
  } else {
    result.label = value;
    result.isCacheable = true;
  } // Used for motion control


  result.key = result.value;
  return result;
};

function toRawString(content) {
  return commonUtil_toArray(content).join('');
}
/** Filter single option if match the search text */


function getFilterFunction(optionFilterProp) {
  return function (searchValue, option) {
    var lowerSearchText = searchValue.toLowerCase(); // Group label search

    if ('options' in option) {
      return toRawString(option.label).toLowerCase().includes(lowerSearchText);
    } // Option value search


    var rawValue = option[optionFilterProp];
    var value = toRawString(rawValue).toLowerCase();
    return value.includes(lowerSearchText);
  };
}
/** Filter options and return a new options by the search text */


function filterOptions(searchValue, options, _ref3) {
  var optionFilterProp = _ref3.optionFilterProp,
      filterOption = _ref3.filterOption;
  var filteredOptions = [];
  var filterFunc;

  if (filterOption === false) {
    return (0,toConsumableArray/* default */.Z)(options);
  }

  if (typeof filterOption === 'function') {
    filterFunc = filterOption;
  } else {
    filterFunc = getFilterFunction(optionFilterProp);
  }

  options.forEach(function (item) {
    // Group should check child options
    if ('options' in item) {
      // Check group first
      var matchGroup = filterFunc(searchValue, item);

      if (matchGroup) {
        filteredOptions.push(item);
      } else {
        // Check option
        var subOptions = item.options.filter(function (subItem) {
          return filterFunc(searchValue, subItem);
        });

        if (subOptions.length) {
          filteredOptions.push((0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, item), {}, {
            options: subOptions
          }));
        }
      }

      return;
    }

    if (filterFunc(searchValue, injectPropsWithOption(item))) {
      filteredOptions.push(item);
    }
  });
  return filteredOptions;
}
function getSeparatedContent(text, tokens) {
  if (!tokens || !tokens.length) {
    return null;
  }

  var match = false;

  function separate(str, _ref4) {
    var _ref5 = (0,esm_toArray/* default */.Z)(_ref4),
        token = _ref5[0],
        restTokens = _ref5.slice(1);

    if (!token) {
      return [str];
    }

    var list = str.split(token);
    match = match || list.length > 1;
    return list.reduce(function (prevList, unitStr) {
      return [].concat((0,toConsumableArray/* default */.Z)(prevList), (0,toConsumableArray/* default */.Z)(separate(unitStr, restTokens)));
    }, []).filter(function (unit) {
      return unit;
    });
  }

  var list = separate(text, tokens);
  return match ? list : null;
}
function isValueDisabled(value, options) {
  var option = findValueOption([value], options)[0];
  return option.disabled;
}
/**
 * `tags` mode should fill un-list item into the option list
 */

function fillOptionsWithMissingValue(options, value, optionLabelProp, labelInValue) {
  var values = commonUtil_toArray(value).slice().sort();

  var cloneOptions = (0,toConsumableArray/* default */.Z)(options); // Convert options value to set


  var optionValues = new Set();
  options.forEach(function (opt) {
    if (opt.options) {
      opt.options.forEach(function (subOpt) {
        optionValues.add(subOpt.value);
      });
    } else {
      optionValues.add(opt.value);
    }
  }); // Fill missing value

  values.forEach(function (item) {
    var val = labelInValue ? item.value : item;

    if (!optionValues.has(val)) {
      var _ref6;

      cloneOptions.push(labelInValue ? (_ref6 = {}, (0,defineProperty/* default */.Z)(_ref6, optionLabelProp, item.label), (0,defineProperty/* default */.Z)(_ref6, "value", val), _ref6) : {
        value: val
      });
    }
  });
  return cloneOptions;
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/isMobile.js
/* harmony default export */ const isMobile = (function () {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  var agent = navigator.userAgent || navigator.vendor || window.opera;

  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(agent === null || agent === void 0 ? void 0 : agent.substr(0, 4))) {
    return true;
  }

  return false;
});
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useMergedState.js


function useControlledState(defaultStateValue, option) {
  var _ref = option || {},
      defaultValue = _ref.defaultValue,
      value = _ref.value,
      onChange = _ref.onChange,
      postState = _ref.postState;

  var _React$useState = external_React_.useState(function () {
    if (value !== undefined) {
      return value;
    }

    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }

    return typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
  }),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      innerValue = _React$useState2[0],
      setInnerValue = _React$useState2[1];

  var mergedValue = value !== undefined ? value : innerValue;

  if (postState) {
    mergedValue = postState(mergedValue);
  }

  function triggerChange(newValue) {
    setInnerValue(newValue);

    if (mergedValue !== newValue && onChange) {
      onChange(newValue, mergedValue);
    }
  } // Effect of reset value to `undefined`


  var firstRenderRef = external_React_.useRef(true);
  external_React_.useEffect(function () {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (value === undefined) {
      setInnerValue(value);
    }
  }, [value]);
  return [mergedValue, triggerChange];
}
;// CONCATENATED MODULE: ./node_modules/rc-overflow/es/Item.js





 // Use shared variable to save bundle size

var UNDEFINED = undefined;

function InternalItem(props, ref) {
  var prefixCls = props.prefixCls,
      invalidate = props.invalidate,
      item = props.item,
      renderItem = props.renderItem,
      responsive = props.responsive,
      registerSize = props.registerSize,
      itemKey = props.itemKey,
      className = props.className,
      style = props.style,
      children = props.children,
      display = props.display,
      order = props.order,
      _props$component = props.component,
      Component = _props$component === void 0 ? 'div' : _props$component,
      restProps = (0,objectWithoutProperties/* default */.Z)(props, ["prefixCls", "invalidate", "item", "renderItem", "responsive", "registerSize", "itemKey", "className", "style", "children", "display", "order", "component"]);

  var mergedHidden = responsive && !display; // ================================ Effect ================================

  function internalRegisterSize(width) {
    registerSize(itemKey, width);
  }

  external_React_.useEffect(function () {
    return function () {
      internalRegisterSize(null);
    };
  }, []); // ================================ Render ================================

  var childNode = renderItem && item !== UNDEFINED ? renderItem(item) : children;
  var overflowStyle;

  if (!invalidate) {
    overflowStyle = {
      opacity: mergedHidden ? 0 : 1,
      height: mergedHidden ? 0 : UNDEFINED,
      overflowY: mergedHidden ? 'hidden' : UNDEFINED,
      order: responsive ? order : UNDEFINED,
      pointerEvents: mergedHidden ? 'none' : UNDEFINED,
      position: mergedHidden ? 'absolute' : UNDEFINED
    };
  }

  var overflowProps = {};

  if (mergedHidden) {
    overflowProps['aria-hidden'] = true;
  }

  var itemNode = /*#__PURE__*/external_React_.createElement(Component, (0,esm_extends/* default */.Z)({
    className: classnames_default()(!invalidate && prefixCls, className),
    style: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, overflowStyle), style)
  }, overflowProps, restProps, {
    ref: ref
  }), childNode);

  if (responsive) {
    itemNode = /*#__PURE__*/external_React_.createElement(es, {
      onResize: function onResize(_ref) {
        var offsetWidth = _ref.offsetWidth;
        internalRegisterSize(offsetWidth);
      }
    }, itemNode);
  }

  return itemNode;
}

var Item_Item = /*#__PURE__*/external_React_.forwardRef(InternalItem);
Item_Item.displayName = 'Item';
/* harmony default export */ const es_Item = (Item_Item);
;// CONCATENATED MODULE: ./node_modules/rc-overflow/es/hooks/useBatchFrameState.js



/**
 * State generate. Return a `setState` but it will flush all state with one render to save perf.
 * This is not a realization of `unstable_batchedUpdates`.
 */

function useBatchFrameState() {
  var _useState = (0,external_React_.useState)({}),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      forceUpdate = _useState2[1];

  var statesRef = (0,external_React_.useRef)([]);
  var destroyRef = (0,external_React_.useRef)(false);
  var walkingIndex = 0;
  var beforeFrameId = 0;
  (0,external_React_.useEffect)(function () {
    return function () {
      destroyRef.current = true;
    };
  }, []);

  function createState(defaultValue) {
    var myIndex = walkingIndex;
    walkingIndex += 1; // Fill value if not exist yet

    if (statesRef.current.length < myIndex + 1) {
      statesRef.current[myIndex] = defaultValue;
    } // Return filled as `setState`


    var value = statesRef.current[myIndex];

    function setValue(val) {
      statesRef.current[myIndex] = typeof val === 'function' ? val(statesRef.current[myIndex]) : val;
      raf/* default.cancel */.Z.cancel(beforeFrameId); // Flush with batch

      beforeFrameId = (0,raf/* default */.Z)(function () {
        if (!destroyRef.current) {
          forceUpdate({});
        }
      });
    }

    return [value, setValue];
  }

  return createState;
}
;// CONCATENATED MODULE: ./node_modules/rc-overflow/es/RawItem.js







var InternalRawItem = function InternalRawItem(props, ref) {
  var context = external_React_.useContext(OverflowContext); // Render directly when context not provided

  if (!context) {
    var _props$component = props.component,
        Component = _props$component === void 0 ? 'div' : _props$component,
        _restProps = (0,objectWithoutProperties/* default */.Z)(props, ["component"]);

    return /*#__PURE__*/external_React_.createElement(Component, (0,esm_extends/* default */.Z)({}, _restProps, {
      ref: ref
    }));
  }

  var contextClassName = context.className,
      restContext = (0,objectWithoutProperties/* default */.Z)(context, ["className"]);

  var className = props.className,
      restProps = (0,objectWithoutProperties/* default */.Z)(props, ["className"]); // Do not pass context to sub item to avoid multiple measure


  return /*#__PURE__*/external_React_.createElement(OverflowContext.Provider, {
    value: null
  }, /*#__PURE__*/external_React_.createElement(es_Item, (0,esm_extends/* default */.Z)({
    ref: ref,
    className: classnames_default()(contextClassName, className)
  }, restContext, restProps)));
};

var RawItem = /*#__PURE__*/external_React_.forwardRef(InternalRawItem);
RawItem.displayName = 'RawItem';
/* harmony default export */ const es_RawItem = (RawItem);
;// CONCATENATED MODULE: ./node_modules/rc-overflow/es/Overflow.js











var OverflowContext = /*#__PURE__*/external_React_.createContext(null);
var RESPONSIVE = 'responsive';
var INVALIDATE = 'invalidate';

function defaultRenderRest(omittedItems) {
  return "+ ".concat(omittedItems.length, " ...");
}

function Overflow(props, ref) {
  var _props$prefixCls = props.prefixCls,
      prefixCls = _props$prefixCls === void 0 ? 'rc-overflow' : _props$prefixCls,
      _props$data = props.data,
      data = _props$data === void 0 ? [] : _props$data,
      renderItem = props.renderItem,
      renderRawItem = props.renderRawItem,
      itemKey = props.itemKey,
      _props$itemWidth = props.itemWidth,
      itemWidth = _props$itemWidth === void 0 ? 10 : _props$itemWidth,
      ssr = props.ssr,
      style = props.style,
      className = props.className,
      maxCount = props.maxCount,
      renderRest = props.renderRest,
      renderRawRest = props.renderRawRest,
      suffix = props.suffix,
      _props$component = props.component,
      Component = _props$component === void 0 ? 'div' : _props$component,
      itemComponent = props.itemComponent,
      onVisibleChange = props.onVisibleChange,
      restProps = (0,objectWithoutProperties/* default */.Z)(props, ["prefixCls", "data", "renderItem", "renderRawItem", "itemKey", "itemWidth", "ssr", "style", "className", "maxCount", "renderRest", "renderRawRest", "suffix", "component", "itemComponent", "onVisibleChange"]);

  var createUseState = useBatchFrameState();
  var fullySSR = ssr === 'full';

  var _createUseState = createUseState(null),
      _createUseState2 = (0,slicedToArray/* default */.Z)(_createUseState, 2),
      containerWidth = _createUseState2[0],
      setContainerWidth = _createUseState2[1];

  var mergedContainerWidth = containerWidth || 0;

  var _createUseState3 = createUseState(new Map()),
      _createUseState4 = (0,slicedToArray/* default */.Z)(_createUseState3, 2),
      itemWidths = _createUseState4[0],
      setItemWidths = _createUseState4[1];

  var _createUseState5 = createUseState(0),
      _createUseState6 = (0,slicedToArray/* default */.Z)(_createUseState5, 2),
      prevRestWidth = _createUseState6[0],
      setPrevRestWidth = _createUseState6[1];

  var _createUseState7 = createUseState(0),
      _createUseState8 = (0,slicedToArray/* default */.Z)(_createUseState7, 2),
      restWidth = _createUseState8[0],
      setRestWidth = _createUseState8[1];

  var _createUseState9 = createUseState(0),
      _createUseState10 = (0,slicedToArray/* default */.Z)(_createUseState9, 2),
      suffixWidth = _createUseState10[0],
      setSuffixWidth = _createUseState10[1];

  var _useState = (0,external_React_.useState)(null),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      suffixFixedStart = _useState2[0],
      setSuffixFixedStart = _useState2[1];

  var _useState3 = (0,external_React_.useState)(null),
      _useState4 = (0,slicedToArray/* default */.Z)(_useState3, 2),
      displayCount = _useState4[0],
      setDisplayCount = _useState4[1];

  var mergedDisplayCount = external_React_.useMemo(function () {
    if (displayCount === null && fullySSR) {
      return Number.MAX_SAFE_INTEGER;
    }

    return displayCount || 0;
  }, [displayCount, containerWidth]);

  var _useState5 = (0,external_React_.useState)(false),
      _useState6 = (0,slicedToArray/* default */.Z)(_useState5, 2),
      restReady = _useState6[0],
      setRestReady = _useState6[1];

  var itemPrefixCls = "".concat(prefixCls, "-item"); // Always use the max width to avoid blink

  var mergedRestWidth = Math.max(prevRestWidth, restWidth); // ================================= Data =================================

  var isResponsive = data.length && maxCount === RESPONSIVE;
  var invalidate = maxCount === INVALIDATE;
  /**
   * When is `responsive`, we will always render rest node to get the real width of it for calculation
   */

  var showRest = isResponsive || typeof maxCount === 'number' && data.length > maxCount;
  var mergedData = (0,external_React_.useMemo)(function () {
    var items = data;

    if (isResponsive) {
      if (containerWidth === null && fullySSR) {
        items = data;
      } else {
        items = data.slice(0, Math.min(data.length, mergedContainerWidth / itemWidth));
      }
    } else if (typeof maxCount === 'number') {
      items = data.slice(0, maxCount);
    }

    return items;
  }, [data, itemWidth, containerWidth, maxCount, isResponsive]);
  var omittedItems = (0,external_React_.useMemo)(function () {
    if (isResponsive) {
      return data.slice(mergedDisplayCount + 1);
    }

    return data.slice(mergedData.length);
  }, [data, mergedData, isResponsive, mergedDisplayCount]); // ================================= Item =================================

  var getKey = (0,external_React_.useCallback)(function (item, index) {
    var _ref;

    if (typeof itemKey === 'function') {
      return itemKey(item);
    }

    return (_ref = itemKey && (item === null || item === void 0 ? void 0 : item[itemKey])) !== null && _ref !== void 0 ? _ref : index;
  }, [itemKey]);
  var mergedRenderItem = (0,external_React_.useCallback)(renderItem || function (item) {
    return item;
  }, [renderItem]);

  function updateDisplayCount(count, notReady) {
    setDisplayCount(count);

    if (!notReady) {
      setRestReady(count < data.length - 1);
      onVisibleChange === null || onVisibleChange === void 0 ? void 0 : onVisibleChange(count);
    }
  } // ================================= Size =================================


  function onOverflowResize(_, element) {
    setContainerWidth(element.clientWidth);
  }

  function registerSize(key, width) {
    setItemWidths(function (origin) {
      var clone = new Map(origin);

      if (width === null) {
        clone.delete(key);
      } else {
        clone.set(key, width);
      }

      return clone;
    });
  }

  function registerOverflowSize(_, width) {
    setRestWidth(width);
    setPrevRestWidth(restWidth);
  }

  function registerSuffixSize(_, width) {
    setSuffixWidth(width);
  } // ================================ Effect ================================


  function getItemWidth(index) {
    return itemWidths.get(getKey(mergedData[index], index));
  }

  external_React_.useLayoutEffect(function () {
    if (mergedContainerWidth && mergedRestWidth && mergedData) {
      var totalWidth = suffixWidth;
      var len = mergedData.length;
      var lastIndex = len - 1; // When data count change to 0, reset this since not loop will reach

      if (!len) {
        updateDisplayCount(0);
        setSuffixFixedStart(null);
        return;
      }

      for (var i = 0; i < len; i += 1) {
        var currentItemWidth = getItemWidth(i); // Break since data not ready

        if (currentItemWidth === undefined) {
          updateDisplayCount(i - 1, true);
          break;
        } // Find best match


        totalWidth += currentItemWidth;

        if ( // Only one means `totalWidth` is the final width
        lastIndex === 0 && totalWidth <= mergedContainerWidth || // Last two width will be the final width
        i === lastIndex - 1 && totalWidth + getItemWidth(lastIndex) <= mergedContainerWidth) {
          // Additional check if match the end
          updateDisplayCount(lastIndex);
          setSuffixFixedStart(null);
          break;
        } else if (totalWidth + mergedRestWidth > mergedContainerWidth) {
          // Can not hold all the content to show rest
          updateDisplayCount(i - 1);
          setSuffixFixedStart(totalWidth - currentItemWidth - suffixWidth + restWidth);
          break;
        }
      }

      if (suffix && getItemWidth(0) + suffixWidth > mergedContainerWidth) {
        setSuffixFixedStart(null);
      }
    }
  }, [mergedContainerWidth, itemWidths, restWidth, suffixWidth, getKey, mergedData]); // ================================ Render ================================

  var displayRest = restReady && !!omittedItems.length;
  var suffixStyle = {};

  if (suffixFixedStart !== null && isResponsive) {
    suffixStyle = {
      position: 'absolute',
      left: suffixFixedStart,
      top: 0
    };
  }

  var itemSharedProps = {
    prefixCls: itemPrefixCls,
    responsive: isResponsive,
    component: itemComponent,
    invalidate: invalidate
  }; // >>>>> Choice render fun by `renderRawItem`

  var internalRenderItemNode = renderRawItem ? function (item, index) {
    var key = getKey(item, index);
    return /*#__PURE__*/external_React_.createElement(OverflowContext.Provider, {
      key: key,
      value: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, itemSharedProps), {}, {
        order: index,
        item: item,
        itemKey: key,
        registerSize: registerSize,
        display: index <= mergedDisplayCount
      })
    }, renderRawItem(item, index));
  } : function (item, index) {
    var key = getKey(item, index);
    return /*#__PURE__*/external_React_.createElement(es_Item, (0,esm_extends/* default */.Z)({}, itemSharedProps, {
      order: index,
      key: key,
      item: item,
      renderItem: mergedRenderItem,
      itemKey: key,
      registerSize: registerSize,
      display: index <= mergedDisplayCount
    }));
  }; // >>>>> Rest node

  var restNode;
  var restContextProps = {
    order: displayRest ? mergedDisplayCount : Number.MAX_SAFE_INTEGER,
    className: "".concat(itemPrefixCls, "-rest"),
    registerSize: registerOverflowSize,
    display: displayRest
  };

  if (!renderRawRest) {
    var mergedRenderRest = renderRest || defaultRenderRest;
    restNode = /*#__PURE__*/external_React_.createElement(es_Item, (0,esm_extends/* default */.Z)({}, itemSharedProps, restContextProps), typeof mergedRenderRest === 'function' ? mergedRenderRest(omittedItems) : mergedRenderRest);
  } else if (renderRawRest) {
    restNode = /*#__PURE__*/external_React_.createElement(OverflowContext.Provider, {
      value: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, itemSharedProps), restContextProps)
    }, renderRawRest(omittedItems));
  }

  var overflowNode = /*#__PURE__*/external_React_.createElement(Component, (0,esm_extends/* default */.Z)({
    className: classnames_default()(!invalidate && prefixCls, className),
    style: style,
    ref: ref
  }, restProps), mergedData.map(internalRenderItemNode), showRest ? restNode : null, suffix && /*#__PURE__*/external_React_.createElement(es_Item, (0,esm_extends/* default */.Z)({}, itemSharedProps, {
    order: mergedDisplayCount,
    className: "".concat(itemPrefixCls, "-suffix"),
    registerSize: registerSuffixSize,
    display: true,
    style: suffixStyle
  }), suffix));

  if (isResponsive) {
    overflowNode = /*#__PURE__*/external_React_.createElement(es, {
      onResize: onOverflowResize
    }, overflowNode);
  }

  return overflowNode;
}

var ForwardOverflow = /*#__PURE__*/external_React_.forwardRef(Overflow);
ForwardOverflow.displayName = 'Overflow';
ForwardOverflow.Item = es_RawItem;
ForwardOverflow.RESPONSIVE = RESPONSIVE;
ForwardOverflow.INVALIDATE = INVALIDATE; // Convert to generic type

/* harmony default export */ const es_Overflow = (ForwardOverflow);
;// CONCATENATED MODULE: ./node_modules/rc-overflow/es/index.js

/* harmony default export */ const rc_overflow_es = (es_Overflow);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/Selector/Input.js





var Input = function Input(_ref, ref) {
  var _inputNode2, _inputNode2$props;

  var prefixCls = _ref.prefixCls,
      id = _ref.id,
      inputElement = _ref.inputElement,
      disabled = _ref.disabled,
      tabIndex = _ref.tabIndex,
      autoFocus = _ref.autoFocus,
      autoComplete = _ref.autoComplete,
      editable = _ref.editable,
      accessibilityIndex = _ref.accessibilityIndex,
      value = _ref.value,
      maxLength = _ref.maxLength,
      _onKeyDown = _ref.onKeyDown,
      _onMouseDown = _ref.onMouseDown,
      _onChange = _ref.onChange,
      onPaste = _ref.onPaste,
      _onCompositionStart = _ref.onCompositionStart,
      _onCompositionEnd = _ref.onCompositionEnd,
      open = _ref.open,
      attrs = _ref.attrs;
  var inputNode = inputElement || /*#__PURE__*/external_React_.createElement("input", null);
  var _inputNode = inputNode,
      originRef = _inputNode.ref,
      _inputNode$props = _inputNode.props,
      onOriginKeyDown = _inputNode$props.onKeyDown,
      onOriginChange = _inputNode$props.onChange,
      onOriginMouseDown = _inputNode$props.onMouseDown,
      onOriginCompositionStart = _inputNode$props.onCompositionStart,
      onOriginCompositionEnd = _inputNode$props.onCompositionEnd,
      style = _inputNode$props.style;
  inputNode = /*#__PURE__*/external_React_.cloneElement(inputNode, (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({
    id: id,
    ref: (0,es_ref/* composeRef */.sQ)(ref, originRef),
    disabled: disabled,
    tabIndex: tabIndex,
    autoComplete: autoComplete || 'off',
    type: 'search',
    autoFocus: autoFocus,
    className: classnames_default()("".concat(prefixCls, "-selection-search-input"), (_inputNode2 = inputNode) === null || _inputNode2 === void 0 ? void 0 : (_inputNode2$props = _inputNode2.props) === null || _inputNode2$props === void 0 ? void 0 : _inputNode2$props.className),
    style: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, style), {}, {
      opacity: editable ? null : 0
    }),
    role: 'combobox',
    'aria-expanded': open,
    'aria-haspopup': 'listbox',
    'aria-owns': "".concat(id, "_list"),
    'aria-autocomplete': 'list',
    'aria-controls': "".concat(id, "_list"),
    'aria-activedescendant': "".concat(id, "_list_").concat(accessibilityIndex)
  }, attrs), {}, {
    value: editable ? value : '',
    maxLength: maxLength,
    readOnly: !editable,
    unselectable: !editable ? 'on' : null,
    onKeyDown: function onKeyDown(event) {
      _onKeyDown(event);

      if (onOriginKeyDown) {
        onOriginKeyDown(event);
      }
    },
    onMouseDown: function onMouseDown(event) {
      _onMouseDown(event);

      if (onOriginMouseDown) {
        onOriginMouseDown(event);
      }
    },
    onChange: function onChange(event) {
      _onChange(event);

      if (onOriginChange) {
        onOriginChange(event);
      }
    },
    onCompositionStart: function onCompositionStart(event) {
      _onCompositionStart(event);

      if (onOriginCompositionStart) {
        onOriginCompositionStart(event);
      }
    },
    onCompositionEnd: function onCompositionEnd(event) {
      _onCompositionEnd(event);

      if (onOriginCompositionEnd) {
        onOriginCompositionEnd(event);
      }
    },
    onPaste: onPaste
  }));
  return inputNode;
};

var RefInput = /*#__PURE__*/external_React_.forwardRef(Input);
RefInput.displayName = 'Input';
/* harmony default export */ const Selector_Input = (RefInput);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/hooks/useLayoutEffect.js
/* eslint-disable react-hooks/rules-of-hooks */


/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */

function useLayoutEffect(effect, deps) {
  // Never happen in test env
  if (isBrowserClient) {
    /* istanbul ignore next */
    external_React_.useLayoutEffect(effect, deps);
  } else {
    external_React_.useEffect(effect, deps);
  }
}
/* eslint-enable */
;// CONCATENATED MODULE: ./node_modules/rc-select/es/Selector/MultipleSelector.js











var onPreventMouseDown = function onPreventMouseDown(event) {
  event.preventDefault();
  event.stopPropagation();
};

var SelectSelector = function SelectSelector(props) {
  var id = props.id,
      prefixCls = props.prefixCls,
      values = props.values,
      open = props.open,
      searchValue = props.searchValue,
      inputRef = props.inputRef,
      placeholder = props.placeholder,
      disabled = props.disabled,
      mode = props.mode,
      showSearch = props.showSearch,
      autoFocus = props.autoFocus,
      autoComplete = props.autoComplete,
      accessibilityIndex = props.accessibilityIndex,
      tabIndex = props.tabIndex,
      removeIcon = props.removeIcon,
      maxTagCount = props.maxTagCount,
      maxTagTextLength = props.maxTagTextLength,
      _props$maxTagPlacehol = props.maxTagPlaceholder,
      maxTagPlaceholder = _props$maxTagPlacehol === void 0 ? function (omittedValues) {
    return "+ ".concat(omittedValues.length, " ...");
  } : _props$maxTagPlacehol,
      tagRender = props.tagRender,
      onToggleOpen = props.onToggleOpen,
      onSelect = props.onSelect,
      onInputChange = props.onInputChange,
      onInputPaste = props.onInputPaste,
      onInputKeyDown = props.onInputKeyDown,
      onInputMouseDown = props.onInputMouseDown,
      onInputCompositionStart = props.onInputCompositionStart,
      onInputCompositionEnd = props.onInputCompositionEnd;
  var measureRef = external_React_.useRef(null);

  var _useState = (0,external_React_.useState)(0),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      inputWidth = _useState2[0],
      setInputWidth = _useState2[1];

  var _useState3 = (0,external_React_.useState)(false),
      _useState4 = (0,slicedToArray/* default */.Z)(_useState3, 2),
      focused = _useState4[0],
      setFocused = _useState4[1];

  var selectionPrefixCls = "".concat(prefixCls, "-selection"); // ===================== Search ======================

  var inputValue = open || mode === 'tags' ? searchValue : '';
  var inputEditable = mode === 'tags' || showSearch && (open || focused); // We measure width and set to the input immediately

  useLayoutEffect(function () {
    setInputWidth(measureRef.current.scrollWidth);
  }, [inputValue]); // ===================== Render ======================
  // >>> Render Selector Node. Includes Item & Rest

  function defaultRenderSelector(content, itemDisabled, closable, onClose) {
    return /*#__PURE__*/external_React_.createElement("span", {
      className: classnames_default()("".concat(selectionPrefixCls, "-item"), (0,defineProperty/* default */.Z)({}, "".concat(selectionPrefixCls, "-item-disabled"), itemDisabled))
    }, /*#__PURE__*/external_React_.createElement("span", {
      className: "".concat(selectionPrefixCls, "-item-content")
    }, content), closable && /*#__PURE__*/external_React_.createElement(es_TransBtn, {
      className: "".concat(selectionPrefixCls, "-item-remove"),
      onMouseDown: onPreventMouseDown,
      onClick: onClose,
      customizeIcon: removeIcon
    }, "\xD7"));
  }

  function customizeRenderSelector(value, content, itemDisabled, closable, onClose) {
    var onMouseDown = function onMouseDown(e) {
      onPreventMouseDown(e);
      onToggleOpen(!open);
    };

    return /*#__PURE__*/external_React_.createElement("span", {
      onMouseDown: onMouseDown
    }, tagRender({
      label: content,
      value: value,
      disabled: itemDisabled,
      closable: closable,
      onClose: onClose
    }));
  }

  function renderItem(_ref) {
    var itemDisabled = _ref.disabled,
        label = _ref.label,
        value = _ref.value;
    var closable = !disabled && !itemDisabled;
    var displayLabel = label;

    if (typeof maxTagTextLength === 'number') {
      if (typeof label === 'string' || typeof label === 'number') {
        var strLabel = String(displayLabel);

        if (strLabel.length > maxTagTextLength) {
          displayLabel = "".concat(strLabel.slice(0, maxTagTextLength), "...");
        }
      }
    }

    var onClose = function onClose(event) {
      if (event) event.stopPropagation();
      onSelect(value, {
        selected: false
      });
    };

    return typeof tagRender === 'function' ? customizeRenderSelector(value, displayLabel, itemDisabled, closable, onClose) : defaultRenderSelector(displayLabel, itemDisabled, closable, onClose);
  }

  function renderRest(omittedValues) {
    var content = typeof maxTagPlaceholder === 'function' ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder;
    return defaultRenderSelector(content, false);
  } // >>> Input Node


  var inputNode = /*#__PURE__*/external_React_.createElement("div", {
    className: "".concat(selectionPrefixCls, "-search"),
    style: {
      width: inputWidth
    },
    onFocus: function onFocus() {
      setFocused(true);
    },
    onBlur: function onBlur() {
      setFocused(false);
    }
  }, /*#__PURE__*/external_React_.createElement(Selector_Input, {
    ref: inputRef,
    open: open,
    prefixCls: prefixCls,
    id: id,
    inputElement: null,
    disabled: disabled,
    autoFocus: autoFocus,
    autoComplete: autoComplete,
    editable: inputEditable,
    accessibilityIndex: accessibilityIndex,
    value: inputValue,
    onKeyDown: onInputKeyDown,
    onMouseDown: onInputMouseDown,
    onChange: onInputChange,
    onPaste: onInputPaste,
    onCompositionStart: onInputCompositionStart,
    onCompositionEnd: onInputCompositionEnd,
    tabIndex: tabIndex,
    attrs: pickAttrs(props, true)
  }), /*#__PURE__*/external_React_.createElement("span", {
    ref: measureRef,
    className: "".concat(selectionPrefixCls, "-search-mirror"),
    "aria-hidden": true
  }, inputValue, "\xA0")); // >>> Selections

  var selectionNode = /*#__PURE__*/external_React_.createElement(rc_overflow_es, {
    prefixCls: "".concat(selectionPrefixCls, "-overflow"),
    data: values,
    renderItem: renderItem,
    renderRest: renderRest,
    suffix: inputNode,
    itemKey: "key",
    maxCount: maxTagCount
  });
  return /*#__PURE__*/external_React_.createElement(external_React_.Fragment, null, selectionNode, !values.length && !inputValue && /*#__PURE__*/external_React_.createElement("span", {
    className: "".concat(selectionPrefixCls, "-placeholder")
  }, placeholder));
};

/* harmony default export */ const MultipleSelector = (SelectSelector);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/Selector/SingleSelector.js





var SingleSelector = function SingleSelector(props) {
  var inputElement = props.inputElement,
      prefixCls = props.prefixCls,
      id = props.id,
      inputRef = props.inputRef,
      disabled = props.disabled,
      autoFocus = props.autoFocus,
      autoComplete = props.autoComplete,
      accessibilityIndex = props.accessibilityIndex,
      mode = props.mode,
      open = props.open,
      values = props.values,
      placeholder = props.placeholder,
      tabIndex = props.tabIndex,
      showSearch = props.showSearch,
      searchValue = props.searchValue,
      activeValue = props.activeValue,
      maxLength = props.maxLength,
      onInputKeyDown = props.onInputKeyDown,
      onInputMouseDown = props.onInputMouseDown,
      onInputChange = props.onInputChange,
      onInputPaste = props.onInputPaste,
      onInputCompositionStart = props.onInputCompositionStart,
      onInputCompositionEnd = props.onInputCompositionEnd;

  var _React$useState = external_React_.useState(false),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      inputChanged = _React$useState2[0],
      setInputChanged = _React$useState2[1];

  var combobox = mode === 'combobox';
  var inputEditable = combobox || showSearch;
  var item = values[0];
  var inputValue = searchValue || '';

  if (combobox && activeValue && !inputChanged) {
    inputValue = activeValue;
  }

  external_React_.useEffect(function () {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]); // Not show text when closed expect combobox mode

  var hasTextInput = mode !== 'combobox' && !open ? false : !!inputValue;
  var title = item && (typeof item.label === 'string' || typeof item.label === 'number') ? item.label.toString() : undefined;
  return /*#__PURE__*/external_React_.createElement(external_React_.Fragment, null, /*#__PURE__*/external_React_.createElement("span", {
    className: "".concat(prefixCls, "-selection-search")
  }, /*#__PURE__*/external_React_.createElement(Selector_Input, {
    ref: inputRef,
    prefixCls: prefixCls,
    id: id,
    open: open,
    inputElement: inputElement,
    disabled: disabled,
    autoFocus: autoFocus,
    autoComplete: autoComplete,
    editable: inputEditable,
    accessibilityIndex: accessibilityIndex,
    value: inputValue,
    onKeyDown: onInputKeyDown,
    onMouseDown: onInputMouseDown,
    onChange: function onChange(e) {
      setInputChanged(true);
      onInputChange(e);
    },
    onPaste: onInputPaste,
    onCompositionStart: onInputCompositionStart,
    onCompositionEnd: onInputCompositionEnd,
    tabIndex: tabIndex,
    attrs: pickAttrs(props, true),
    maxLength: combobox ? maxLength : undefined
  })), !combobox && item && !hasTextInput && /*#__PURE__*/external_React_.createElement("span", {
    className: "".concat(prefixCls, "-selection-item"),
    title: title
  }, item.label), !item && !hasTextInput && /*#__PURE__*/external_React_.createElement("span", {
    className: "".concat(prefixCls, "-selection-placeholder")
  }, placeholder));
};

/* harmony default export */ const Selector_SingleSelector = (SingleSelector);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/hooks/useLock.js

/**
 * Locker return cached mark.
 * If set to `true`, will return `true` in a short time even if set `false`.
 * If set to `false` and then set to `true`, will change to `true`.
 * And after time duration, it will back to `null` automatically.
 */

function useLock() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 250;
  var lockRef = external_React_.useRef(null);
  var timeoutRef = external_React_.useRef(null); // Clean up

  external_React_.useEffect(function () {
    return function () {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function doLock(locked) {
    if (locked || lockRef.current === null) {
      lockRef.current = locked;
    }

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(function () {
      lockRef.current = null;
    }, duration);
  }

  return [function () {
    return lockRef.current;
  }, doLock];
}
;// CONCATENATED MODULE: ./node_modules/rc-select/es/Selector/index.js


/**
 * Cursor rule:
 * 1. Only `showSearch` enabled
 * 2. Only `open` is `true`
 * 3. When typing, set `open` to `true` which hit rule of 2
 *
 * Accessibility:
 * - https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
 */








var Selector = function Selector(props, ref) {
  var inputRef = (0,external_React_.useRef)(null);
  var compositionStatusRef = (0,external_React_.useRef)(false);
  var prefixCls = props.prefixCls,
      multiple = props.multiple,
      open = props.open,
      mode = props.mode,
      showSearch = props.showSearch,
      tokenWithEnter = props.tokenWithEnter,
      onSearch = props.onSearch,
      onSearchSubmit = props.onSearchSubmit,
      onToggleOpen = props.onToggleOpen,
      onInputKeyDown = props.onInputKeyDown,
      domRef = props.domRef; // ======================= Ref =======================

  external_React_.useImperativeHandle(ref, function () {
    return {
      focus: function focus() {
        inputRef.current.focus();
      },
      blur: function blur() {
        inputRef.current.blur();
      }
    };
  }); // ====================== Input ======================

  var _useLock = useLock(0),
      _useLock2 = (0,slicedToArray/* default */.Z)(_useLock, 2),
      getInputMouseDown = _useLock2[0],
      setInputMouseDown = _useLock2[1];

  var onInternalInputKeyDown = function onInternalInputKeyDown(event) {
    var which = event.which;

    if (which === es_KeyCode.UP || which === es_KeyCode.DOWN) {
      event.preventDefault();
    }

    if (onInputKeyDown) {
      onInputKeyDown(event);
    }

    if (which === es_KeyCode.ENTER && mode === 'tags' && !compositionStatusRef.current && !open) {
      // When menu isn't open, OptionList won't trigger a value change
      // So when enter is pressed, the tag's input value should be emitted here to let selector know
      onSearchSubmit(event.target.value);
    }

    if (![es_KeyCode.SHIFT, es_KeyCode.TAB, es_KeyCode.BACKSPACE, es_KeyCode.ESC].includes(which)) {
      onToggleOpen(true);
    }
  };
  /**
   * We can not use `findDOMNode` sine it will get warning,
   * have to use timer to check if is input element.
   */


  var onInternalInputMouseDown = function onInternalInputMouseDown() {
    setInputMouseDown(true);
  }; // When paste come, ignore next onChange


  var pastedTextRef = (0,external_React_.useRef)(null);

  var triggerOnSearch = function triggerOnSearch(value) {
    if (onSearch(value, true, compositionStatusRef.current) !== false) {
      onToggleOpen(true);
    }
  };

  var onInputCompositionStart = function onInputCompositionStart() {
    compositionStatusRef.current = true;
  };

  var onInputCompositionEnd = function onInputCompositionEnd(e) {
    compositionStatusRef.current = false; // Trigger search again to support `tokenSeparators` with typewriting

    if (mode !== 'combobox') {
      triggerOnSearch(e.target.value);
    }
  };

  var onInputChange = function onInputChange(event) {
    var value = event.target.value; // Pasted text should replace back to origin content

    if (tokenWithEnter && pastedTextRef.current && /[\r\n]/.test(pastedTextRef.current)) {
      // CRLF will be treated as a single space for input element
      var replacedText = pastedTextRef.current.replace(/[\r\n]+$/, '').replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
      value = value.replace(replacedText, pastedTextRef.current);
    }

    pastedTextRef.current = null;
    triggerOnSearch(value);
  };

  var onInputPaste = function onInputPaste(e) {
    var clipboardData = e.clipboardData;
    var value = clipboardData.getData('text');
    pastedTextRef.current = value;
  };

  var onClick = function onClick(_ref) {
    var target = _ref.target;

    if (target !== inputRef.current) {
      // Should focus input if click the selector
      var isIE = document.body.style.msTouchAction !== undefined;

      if (isIE) {
        setTimeout(function () {
          inputRef.current.focus();
        });
      } else {
        inputRef.current.focus();
      }
    }
  };

  var onMouseDown = function onMouseDown(event) {
    var inputMouseDown = getInputMouseDown();

    if (event.target !== inputRef.current && !inputMouseDown) {
      event.preventDefault();
    }

    if (mode !== 'combobox' && (!showSearch || !inputMouseDown) || !open) {
      if (open) {
        onSearch('', true, false);
      }

      onToggleOpen();
    }
  }; // ================= Inner Selector ==================


  var sharedProps = {
    inputRef: inputRef,
    onInputKeyDown: onInternalInputKeyDown,
    onInputMouseDown: onInternalInputMouseDown,
    onInputChange: onInputChange,
    onInputPaste: onInputPaste,
    onInputCompositionStart: onInputCompositionStart,
    onInputCompositionEnd: onInputCompositionEnd
  };
  var selectNode = multiple ? /*#__PURE__*/external_React_.createElement(MultipleSelector, (0,esm_extends/* default */.Z)({}, props, sharedProps)) : /*#__PURE__*/external_React_.createElement(Selector_SingleSelector, (0,esm_extends/* default */.Z)({}, props, sharedProps));
  return /*#__PURE__*/external_React_.createElement("div", {
    ref: domRef,
    className: "".concat(prefixCls, "-selector"),
    onClick: onClick,
    onMouseDown: onMouseDown
  }, selectNode);
};

var ForwardSelector = /*#__PURE__*/external_React_.forwardRef(Selector);
ForwardSelector.displayName = 'Selector';
/* harmony default export */ const es_Selector = (ForwardSelector);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(9389);
// EXTERNAL MODULE: external "ReactDOM"
var external_ReactDOM_ = __webpack_require__(7196);
var external_ReactDOM_default = /*#__PURE__*/__webpack_require__.n(external_ReactDOM_);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/contains.js
function contains(root, n) {
  if (!root) {
    return false;
  }

  return root.contains(n);
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/addEventListener.js

function addEventListenerWrap(target, eventType, cb, option) {
  /* eslint camelcase: 2 */
  var callback = (external_ReactDOM_default()).unstable_batchedUpdates ? function run(e) {
    external_ReactDOM_default().unstable_batchedUpdates(cb, e);
  } : cb;

  if (target.addEventListener) {
    target.addEventListener(eventType, callback, option);
  }

  return {
    remove: function remove() {
      if (target.removeEventListener) {
        target.removeEventListener(eventType, callback);
      }
    }
  };
}
// EXTERNAL MODULE: ./node_modules/rc-util/es/Dom/canUseDom.js
var canUseDom = __webpack_require__(2457);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/Portal.js



var Portal = /*#__PURE__*/(0,external_React_.forwardRef)(function (props, ref) {
  var didUpdate = props.didUpdate,
      getContainer = props.getContainer,
      children = props.children;
  var containerRef = (0,external_React_.useRef)(); // Ref return nothing, only for wrapper check exist

  (0,external_React_.useImperativeHandle)(ref, function () {
    return {};
  }); // Create container in client side with sync to avoid useEffect not get ref

  var initRef = (0,external_React_.useRef)(false);

  if (!initRef.current && (0,canUseDom/* default */.Z)()) {
    containerRef.current = getContainer();
    initRef.current = true;
  } // [Legacy] Used by `rc-trigger`


  (0,external_React_.useEffect)(function () {
    didUpdate === null || didUpdate === void 0 ? void 0 : didUpdate(props);
  });
  (0,external_React_.useEffect)(function () {
    return function () {
      var _containerRef$current, _containerRef$current2; // [Legacy] This should not be handle by Portal but parent PortalWrapper instead.
      // Since some component use `Portal` directly, we have to keep the logic here.


      (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : (_containerRef$current2 = _containerRef$current.parentNode) === null || _containerRef$current2 === void 0 ? void 0 : _containerRef$current2.removeChild(containerRef.current);
    };
  }, []);
  return containerRef.current ? /*#__PURE__*/external_ReactDOM_default().createPortal(children, containerRef.current) : null;
});
/* harmony default export */ const es_Portal = (Portal);
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/utils/alignUtil.js


function isPointsEq(a1, a2, isAlignPoint) {
  if (isAlignPoint) {
    return a1[0] === a2[0];
  }

  return a1[0] === a2[0] && a1[1] === a2[1];
}

function getAlignFromPlacement(builtinPlacements, placementStr, align) {
  var baseAlign = builtinPlacements[placementStr] || {};
  return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, baseAlign), align);
}
function getAlignPopupClassName(builtinPlacements, prefixCls, align, isAlignPoint) {
  var points = align.points;
  var placements = Object.keys(builtinPlacements);

  for (var i = 0; i < placements.length; i += 1) {
    var placement = placements[i];

    if (isPointsEq(builtinPlacements[placement].points, points, isAlignPoint)) {
      return "".concat(prefixCls, "-placement-").concat(placement);
    }
  }

  return '';
}
// EXTERNAL MODULE: ./node_modules/rc-motion/es/index.js + 12 modules
var rc_motion_es = __webpack_require__(567);
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/utils/legacyUtil.js
function getMotion(_ref) {
  var prefixCls = _ref.prefixCls,
      motion = _ref.motion,
      animation = _ref.animation,
      transitionName = _ref.transitionName;

  if (motion) {
    return motion;
  }

  if (animation) {
    return {
      motionName: "".concat(prefixCls, "-").concat(animation)
    };
  }

  if (transitionName) {
    return {
      motionName: transitionName
    };
  }

  return null;
}
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/Popup/Mask.js






function Mask(props) {
  var prefixCls = props.prefixCls,
      visible = props.visible,
      zIndex = props.zIndex,
      mask = props.mask,
      maskMotion = props.maskMotion,
      maskAnimation = props.maskAnimation,
      maskTransitionName = props.maskTransitionName;

  if (!mask) {
    return null;
  }

  var motion = {};

  if (maskMotion || maskTransitionName || maskAnimation) {
    motion = (0,objectSpread2/* default */.Z)({
      motionAppear: true
    }, getMotion({
      motion: maskMotion,
      prefixCls: prefixCls,
      transitionName: maskTransitionName,
      animation: maskAnimation
    }));
  }

  return /*#__PURE__*/external_React_.createElement(rc_motion_es/* default */.Z, (0,esm_extends/* default */.Z)({}, motion, {
    visible: visible,
    removeOnLeave: true
  }), function (_ref) {
    var className = _ref.className;
    return /*#__PURE__*/external_React_.createElement("div", {
      style: {
        zIndex: zIndex
      },
      className: classnames_default()("".concat(prefixCls, "-mask"), className)
    });
  });
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/isVisible.js
/* harmony default export */ const isVisible = (function (element) {
  if (!element) {
    return false;
  }

  if (element.offsetParent) {
    return true;
  }

  if (element.getBBox) {
    var box = element.getBBox();

    if (box.width || box.height) {
      return true;
    }
  }

  if (element.getBoundingClientRect) {
    var _box = element.getBoundingClientRect();

    if (_box.width || _box.height) {
      return true;
    }
  }

  return false;
});
;// CONCATENATED MODULE: ./node_modules/dom-align/dist-web/index.js
function dist_web_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      dist_web_ownKeys(Object(source), true).forEach(function (key) {
        dist_web_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      dist_web_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function dist_web_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    dist_web_typeof = function (obj) {
      return typeof obj;
    };
  } else {
    dist_web_typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return dist_web_typeof(obj);
}

function dist_web_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var vendorPrefix;
var jsCssMap = {
  Webkit: '-webkit-',
  Moz: '-moz-',
  // IE did it wrong again ...
  ms: '-ms-',
  O: '-o-'
};

function getVendorPrefix() {
  if (vendorPrefix !== undefined) {
    return vendorPrefix;
  }

  vendorPrefix = '';
  var style = document.createElement('p').style;
  var testProp = 'Transform';

  for (var key in jsCssMap) {
    if (key + testProp in style) {
      vendorPrefix = key;
    }
  }

  return vendorPrefix;
}

function getTransitionName() {
  return getVendorPrefix() ? "".concat(getVendorPrefix(), "TransitionProperty") : 'transitionProperty';
}

function getTransformName() {
  return getVendorPrefix() ? "".concat(getVendorPrefix(), "Transform") : 'transform';
}

function setTransitionProperty(node, value) {
  var name = getTransitionName();

  if (name) {
    node.style[name] = value;

    if (name !== 'transitionProperty') {
      node.style.transitionProperty = value;
    }
  }
}

function setTransform(node, value) {
  var name = getTransformName();

  if (name) {
    node.style[name] = value;

    if (name !== 'transform') {
      node.style.transform = value;
    }
  }
}

function getTransitionProperty(node) {
  return node.style.transitionProperty || node.style[getTransitionName()];
}

function getTransformXY(node) {
  var style = window.getComputedStyle(node, null);
  var transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName());

  if (transform && transform !== 'none') {
    var matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');
    return {
      x: parseFloat(matrix[12] || matrix[4], 0),
      y: parseFloat(matrix[13] || matrix[5], 0)
    };
  }

  return {
    x: 0,
    y: 0
  };
}

var matrix2d = /matrix\((.*)\)/;
var matrix3d = /matrix3d\((.*)\)/;

function setTransformXY(node, xy) {
  var style = window.getComputedStyle(node, null);
  var transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName());

  if (transform && transform !== 'none') {
    var arr;
    var match2d = transform.match(matrix2d);

    if (match2d) {
      match2d = match2d[1];
      arr = match2d.split(',').map(function (item) {
        return parseFloat(item, 10);
      });
      arr[4] = xy.x;
      arr[5] = xy.y;
      setTransform(node, "matrix(".concat(arr.join(','), ")"));
    } else {
      var match3d = transform.match(matrix3d)[1];
      arr = match3d.split(',').map(function (item) {
        return parseFloat(item, 10);
      });
      arr[12] = xy.x;
      arr[13] = xy.y;
      setTransform(node, "matrix3d(".concat(arr.join(','), ")"));
    }
  } else {
    setTransform(node, "translateX(".concat(xy.x, "px) translateY(").concat(xy.y, "px) translateZ(0)"));
  }
}

var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
var getComputedStyleX; // https://stackoverflow.com/a/3485654/3040605

function forceRelayout(elem) {
  var originalStyle = elem.style.display;
  elem.style.display = 'none';
  elem.offsetHeight; // eslint-disable-line

  elem.style.display = originalStyle;
}

function css(el, name, v) {
  var value = v;

  if (dist_web_typeof(name) === 'object') {
    for (var i in name) {
      if (name.hasOwnProperty(i)) {
        css(el, i, name[i]);
      }
    }

    return undefined;
  }

  if (typeof value !== 'undefined') {
    if (typeof value === 'number') {
      value = "".concat(value, "px");
    }

    el.style[name] = value;
    return undefined;
  }

  return getComputedStyleX(el, name);
}

function getClientPosition(elem) {
  var box;
  var x;
  var y;
  var doc = elem.ownerDocument;
  var body = doc.body;
  var docElem = doc && doc.documentElement; // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式

  box = elem.getBoundingClientRect(); // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
  // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
  // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

  x = box.left;
  y = box.top; // In IE, most of the time, 2 extra pixels are added to the top and left
  // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
  // IE6 standards mode, this border can be overridden by setting the
  // document element's border to zero -- thus, we cannot rely on the
  // offset always being 2 pixels.
  // In quirks mode, the offset can be determined by querying the body's
  // clientLeft/clientTop, but in standards mode, it is found by querying
  // the document element's clientLeft/clientTop.  Since we already called
  // getClientBoundingRect we have already forced a reflow, so it is not
  // too expensive just to query them all.
  // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
  // 窗口边框标准是设 documentElement ,quirks 时设置 body
  // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
  // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
  // 标准 ie 下 docElem.clientTop 就是 border-top
  // ie7 html 即窗口边框改变不了。永远为 2
  // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0

  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;
  return {
    left: x,
    top: y
  };
}

function getScroll(w, top) {
  var ret = w["page".concat(top ? 'Y' : 'X', "Offset")];
  var method = "scroll".concat(top ? 'Top' : 'Left');

  if (typeof ret !== 'number') {
    var d = w.document; // ie6,7,8 standard mode

    ret = d.documentElement[method];

    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method];
    }
  }

  return ret;
}

function getScrollLeft(w) {
  return getScroll(w);
}

function getScrollTop(w) {
  return getScroll(w, true);
}

function getOffset(el) {
  var pos = getClientPosition(el);
  var doc = el.ownerDocument;
  var w = doc.defaultView || doc.parentWindow;
  pos.left += getScrollLeft(w);
  pos.top += getScrollTop(w);
  return pos;
}
/**
 * A crude way of determining if an object is a window
 * @member util
 */


function isWindow(obj) {
  // must use == for ie8

  /* eslint eqeqeq:0 */
  return obj !== null && obj !== undefined && obj == obj.window;
}

function getDocument(node) {
  if (isWindow(node)) {
    return node.document;
  }

  if (node.nodeType === 9) {
    return node;
  }

  return node.ownerDocument;
}

function _getComputedStyle(elem, name, cs) {
  var computedStyle = cs;
  var val = '';
  var d = getDocument(elem);
  computedStyle = computedStyle || d.defaultView.getComputedStyle(elem, null); // https://github.com/kissyteam/kissy/issues/61

  if (computedStyle) {
    val = computedStyle.getPropertyValue(name) || computedStyle[name];
  }

  return val;
}

var _RE_NUM_NO_PX = new RegExp("^(".concat(RE_NUM, ")(?!px)[a-z%]+$"), 'i');

var RE_POS = /^(top|right|bottom|left)$/;
var CURRENT_STYLE = 'currentStyle';
var RUNTIME_STYLE = 'runtimeStyle';
var LEFT = 'left';
var PX = 'px';

function _getComputedStyleIE(elem, name) {
  // currentStyle maybe null
  // http://msdn.microsoft.com/en-us/library/ms535231.aspx
  var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name]; // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
  // 一开始就处理了! CUSTOM_STYLE.height,CUSTOM_STYLE.width ,cssHook 解决@2011-08-19
  // 在 ie 下不对，需要直接用 offset 方式
  // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了
  // From the awesome hack by Dean Edwards
  // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
  // If we're not dealing with a regular pixel number
  // but a number that has a weird ending, we need to convert it to pixels
  // exclude left right for relativity

  if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
    // Remember the original values
    var style = elem.style;
    var left = style[LEFT];
    var rsLeft = elem[RUNTIME_STYLE][LEFT]; // prevent flashing of content

    elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT]; // Put in the new values to get a computed value out

    style[LEFT] = name === 'fontSize' ? '1em' : ret || 0;
    ret = style.pixelLeft + PX; // Revert the changed values

    style[LEFT] = left;
    elem[RUNTIME_STYLE][LEFT] = rsLeft;
  }

  return ret === '' ? 'auto' : ret;
}

if (typeof window !== 'undefined') {
  getComputedStyleX = window.getComputedStyle ? _getComputedStyle : _getComputedStyleIE;
}

function getOffsetDirection(dir, option) {
  if (dir === 'left') {
    return option.useCssRight ? 'right' : dir;
  }

  return option.useCssBottom ? 'bottom' : dir;
}

function oppositeOffsetDirection(dir) {
  if (dir === 'left') {
    return 'right';
  } else if (dir === 'right') {
    return 'left';
  } else if (dir === 'top') {
    return 'bottom';
  } else if (dir === 'bottom') {
    return 'top';
  }
} // 设置 elem 相对 elem.ownerDocument 的坐标


function setLeftTop(elem, offset, option) {
  // set position first, in-case top/left are set even on static elem
  if (css(elem, 'position') === 'static') {
    elem.style.position = 'relative';
  }

  var presetH = -999;
  var presetV = -999;
  var horizontalProperty = getOffsetDirection('left', option);
  var verticalProperty = getOffsetDirection('top', option);
  var oppositeHorizontalProperty = oppositeOffsetDirection(horizontalProperty);
  var oppositeVerticalProperty = oppositeOffsetDirection(verticalProperty);

  if (horizontalProperty !== 'left') {
    presetH = 999;
  }

  if (verticalProperty !== 'top') {
    presetV = 999;
  }

  var originalTransition = '';
  var originalOffset = getOffset(elem);

  if ('left' in offset || 'top' in offset) {
    originalTransition = getTransitionProperty(elem) || '';
    setTransitionProperty(elem, 'none');
  }

  if ('left' in offset) {
    elem.style[oppositeHorizontalProperty] = '';
    elem.style[horizontalProperty] = "".concat(presetH, "px");
  }

  if ('top' in offset) {
    elem.style[oppositeVerticalProperty] = '';
    elem.style[verticalProperty] = "".concat(presetV, "px");
  } // force relayout


  forceRelayout(elem);
  var old = getOffset(elem);
  var originalStyle = {};

  for (var key in offset) {
    if (offset.hasOwnProperty(key)) {
      var dir = getOffsetDirection(key, option);
      var preset = key === 'left' ? presetH : presetV;
      var off = originalOffset[key] - old[key];

      if (dir === key) {
        originalStyle[dir] = preset + off;
      } else {
        originalStyle[dir] = preset - off;
      }
    }
  }

  css(elem, originalStyle); // force relayout

  forceRelayout(elem);

  if ('left' in offset || 'top' in offset) {
    setTransitionProperty(elem, originalTransition);
  }

  var ret = {};

  for (var _key in offset) {
    if (offset.hasOwnProperty(_key)) {
      var _dir = getOffsetDirection(_key, option);

      var _off = offset[_key] - originalOffset[_key];

      if (_key === _dir) {
        ret[_dir] = originalStyle[_dir] + _off;
      } else {
        ret[_dir] = originalStyle[_dir] - _off;
      }
    }
  }

  css(elem, ret);
}

function setTransform$1(elem, offset) {
  var originalOffset = getOffset(elem);
  var originalXY = getTransformXY(elem);
  var resultXY = {
    x: originalXY.x,
    y: originalXY.y
  };

  if ('left' in offset) {
    resultXY.x = originalXY.x + offset.left - originalOffset.left;
  }

  if ('top' in offset) {
    resultXY.y = originalXY.y + offset.top - originalOffset.top;
  }

  setTransformXY(elem, resultXY);
}

function setOffset(elem, offset, option) {
  if (option.ignoreShake) {
    var oriOffset = getOffset(elem);
    var oLeft = oriOffset.left.toFixed(0);
    var oTop = oriOffset.top.toFixed(0);
    var tLeft = offset.left.toFixed(0);
    var tTop = offset.top.toFixed(0);

    if (oLeft === tLeft && oTop === tTop) {
      return;
    }
  }

  if (option.useCssRight || option.useCssBottom) {
    setLeftTop(elem, offset, option);
  } else if (option.useCssTransform && getTransformName() in document.body.style) {
    setTransform$1(elem, offset);
  } else {
    setLeftTop(elem, offset, option);
  }
}

function each(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    fn(arr[i]);
  }
}

function isBorderBoxFn(elem) {
  return getComputedStyleX(elem, 'boxSizing') === 'border-box';
}

var BOX_MODELS = ['margin', 'border', 'padding'];
var CONTENT_INDEX = -1;
var PADDING_INDEX = 2;
var BORDER_INDEX = 1;
var MARGIN_INDEX = 0;

function swap(elem, options, callback) {
  var old = {};
  var style = elem.style;
  var name; // Remember the old values, and insert the new ones

  for (name in options) {
    if (options.hasOwnProperty(name)) {
      old[name] = style[name];
      style[name] = options[name];
    }
  }

  callback.call(elem); // Revert the old values

  for (name in options) {
    if (options.hasOwnProperty(name)) {
      style[name] = old[name];
    }
  }
}

function getPBMWidth(elem, props, which) {
  var value = 0;
  var prop;
  var j;
  var i;

  for (j = 0; j < props.length; j++) {
    prop = props[j];

    if (prop) {
      for (i = 0; i < which.length; i++) {
        var cssProp = void 0;

        if (prop === 'border') {
          cssProp = "".concat(prop).concat(which[i], "Width");
        } else {
          cssProp = prop + which[i];
        }

        value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
      }
    }
  }

  return value;
}

var domUtils = {
  getParent: function getParent(element) {
    var parent = element;

    do {
      if (parent.nodeType === 11 && parent.host) {
        parent = parent.host;
      } else {
        parent = parent.parentNode;
      }
    } while (parent && parent.nodeType !== 1 && parent.nodeType !== 9);

    return parent;
  }
};
each(['Width', 'Height'], function (name) {
  domUtils["doc".concat(name)] = function (refWin) {
    var d = refWin.document;
    return Math.max( // firefox chrome documentElement.scrollHeight< body.scrollHeight
    // ie standard mode : documentElement.scrollHeight> body.scrollHeight
    d.documentElement["scroll".concat(name)], // quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
    d.body["scroll".concat(name)], domUtils["viewport".concat(name)](d));
  };

  domUtils["viewport".concat(name)] = function (win) {
    // pc browser includes scrollbar in window.innerWidth
    var prop = "client".concat(name);
    var doc = win.document;
    var body = doc.body;
    var documentElement = doc.documentElement;
    var documentElementProp = documentElement[prop]; // 标准模式取 documentElement
    // backcompat 取 body

    return doc.compatMode === 'CSS1Compat' && documentElementProp || body && body[prop] || documentElementProp;
  };
});
/*
 得到元素的大小信息
 @param elem
 @param name
 @param {String} [extra]  'padding' : (css width) + padding
 'border' : (css width) + padding + border
 'margin' : (css width) + padding + border + margin
 */

function getWH(elem, name, ex) {
  var extra = ex;

  if (isWindow(elem)) {
    return name === 'width' ? domUtils.viewportWidth(elem) : domUtils.viewportHeight(elem);
  } else if (elem.nodeType === 9) {
    return name === 'width' ? domUtils.docWidth(elem) : domUtils.docHeight(elem);
  }

  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
  var borderBoxValue = name === 'width' ? elem.getBoundingClientRect().width : elem.getBoundingClientRect().height;
  var isBorderBox = isBorderBoxFn(elem);
  var cssBoxValue = 0;

  if (borderBoxValue === null || borderBoxValue === undefined || borderBoxValue <= 0) {
    borderBoxValue = undefined; // Fall back to computed then un computed css if necessary

    cssBoxValue = getComputedStyleX(elem, name);

    if (cssBoxValue === null || cssBoxValue === undefined || Number(cssBoxValue) < 0) {
      cssBoxValue = elem.style[name] || 0;
    } // Normalize '', auto, and prepare for extra


    cssBoxValue = parseFloat(cssBoxValue) || 0;
  }

  if (extra === undefined) {
    extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
  }

  var borderBoxValueOrIsBorderBox = borderBoxValue !== undefined || isBorderBox;
  var val = borderBoxValue || cssBoxValue;

  if (extra === CONTENT_INDEX) {
    if (borderBoxValueOrIsBorderBox) {
      return val - getPBMWidth(elem, ['border', 'padding'], which);
    }

    return cssBoxValue;
  } else if (borderBoxValueOrIsBorderBox) {
    if (extra === BORDER_INDEX) {
      return val;
    }

    return val + (extra === PADDING_INDEX ? -getPBMWidth(elem, ['border'], which) : getPBMWidth(elem, ['margin'], which));
  }

  return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra), which);
}

var cssShow = {
  position: 'absolute',
  visibility: 'hidden',
  display: 'block'
}; // fix #119 : https://github.com/kissyteam/kissy/issues/119

function getWHIgnoreDisplay() {
  for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var val;
  var elem = args[0]; // in case elem is window
  // elem.offsetWidth === undefined

  if (elem.offsetWidth !== 0) {
    val = getWH.apply(undefined, args);
  } else {
    swap(elem, cssShow, function () {
      val = getWH.apply(undefined, args);
    });
  }

  return val;
}

each(['width', 'height'], function (name) {
  var first = name.charAt(0).toUpperCase() + name.slice(1);

  domUtils["outer".concat(first)] = function (el, includeMargin) {
    return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX);
  };

  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

  domUtils[name] = function (elem, v) {
    var val = v;

    if (val !== undefined) {
      if (elem) {
        var isBorderBox = isBorderBoxFn(elem);

        if (isBorderBox) {
          val += getPBMWidth(elem, ['padding', 'border'], which);
        }

        return css(elem, name, val);
      }

      return undefined;
    }

    return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
  };
});

function mix(to, from) {
  for (var i in from) {
    if (from.hasOwnProperty(i)) {
      to[i] = from[i];
    }
  }

  return to;
}

var utils = {
  getWindow: function getWindow(node) {
    if (node && node.document && node.setTimeout) {
      return node;
    }

    var doc = node.ownerDocument || node;
    return doc.defaultView || doc.parentWindow;
  },
  getDocument: getDocument,
  offset: function offset(el, value, option) {
    if (typeof value !== 'undefined') {
      setOffset(el, value, option || {});
    } else {
      return getOffset(el);
    }
  },
  isWindow: isWindow,
  each: each,
  css: css,
  clone: function clone(obj) {
    var i;
    var ret = {};

    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }

    var overflow = obj.overflow;

    if (overflow) {
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          ret.overflow[i] = obj.overflow[i];
        }
      }
    }

    return ret;
  },
  mix: mix,
  getWindowScrollLeft: function getWindowScrollLeft(w) {
    return getScrollLeft(w);
  },
  getWindowScrollTop: function getWindowScrollTop(w) {
    return getScrollTop(w);
  },
  merge: function merge() {
    var ret = {};

    for (var i = 0; i < arguments.length; i++) {
      utils.mix(ret, i < 0 || arguments.length <= i ? undefined : arguments[i]);
    }

    return ret;
  },
  viewportWidth: 0,
  viewportHeight: 0
};
mix(utils, domUtils);
/**
 * 得到会导致元素显示不全的祖先元素
 */

var getParent = utils.getParent;

function getOffsetParent(element) {
  if (utils.isWindow(element) || element.nodeType === 9) {
    return null;
  } // ie 这个也不是完全可行

  /*
   <div style="width: 50px;height: 100px;overflow: hidden">
   <div style="width: 50px;height: 100px;position: relative;" id="d6">
   元素 6 高 100px 宽 50px<br/>
   </div>
   </div>
   */
  // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
  //  In other browsers it only includes elements with position absolute, relative or
  // fixed, not elements with overflow set to auto or scroll.
  //        if (UA.ie && ieMode < 8) {
  //            return element.offsetParent;
  //        }
  // 统一的 offsetParent 方法


  var doc = utils.getDocument(element);
  var body = doc.body;
  var parent;
  var positionStyle = utils.css(element, 'position');
  var skipStatic = positionStyle === 'fixed' || positionStyle === 'absolute';

  if (!skipStatic) {
    return element.nodeName.toLowerCase() === 'html' ? null : getParent(element);
  }

  for (parent = getParent(element); parent && parent !== body && parent.nodeType !== 9; parent = getParent(parent)) {
    positionStyle = utils.css(parent, 'position');

    if (positionStyle !== 'static') {
      return parent;
    }
  }

  return null;
}

var getParent$1 = utils.getParent;

function isAncestorFixed(element) {
  if (utils.isWindow(element) || element.nodeType === 9) {
    return false;
  }

  var doc = utils.getDocument(element);
  var body = doc.body;
  var parent = null;

  for (parent = getParent$1(element); // 修复元素位于 document.documentElement 下导致崩溃问题
  parent && parent !== body && parent !== doc; parent = getParent$1(parent)) {
    var positionStyle = utils.css(parent, 'position');

    if (positionStyle === 'fixed') {
      return true;
    }
  }

  return false;
}
/**
 * 获得元素的显示部分的区域
 */


function getVisibleRectForElement(element, alwaysByViewport) {
  var visibleRect = {
    left: 0,
    right: Infinity,
    top: 0,
    bottom: Infinity
  };
  var el = getOffsetParent(element);
  var doc = utils.getDocument(element);
  var win = doc.defaultView || doc.parentWindow;
  var body = doc.body;
  var documentElement = doc.documentElement; // Determine the size of the visible rect by climbing the dom accounting for
  // all scrollable containers.

  while (el) {
    // clientWidth is zero for inline block elements in ie.
    if ((navigator.userAgent.indexOf('MSIE') === -1 || el.clientWidth !== 0) && // body may have overflow set on it, yet we still get the entire
    // viewport. In some browsers, el.offsetParent may be
    // document.documentElement, so check for that too.
    el !== body && el !== documentElement && utils.css(el, 'overflow') !== 'visible') {
      var pos = utils.offset(el); // add border

      pos.left += el.clientLeft;
      pos.top += el.clientTop;
      visibleRect.top = Math.max(visibleRect.top, pos.top);
      visibleRect.right = Math.min(visibleRect.right, // consider area without scrollBar
      pos.left + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom, pos.top + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.left);
    } else if (el === body || el === documentElement) {
      break;
    }

    el = getOffsetParent(el);
  } // Set element position to fixed
  // make sure absolute element itself don't affect it's visible area
  // https://github.com/ant-design/ant-design/issues/7601


  var originalPosition = null;

  if (!utils.isWindow(element) && element.nodeType !== 9) {
    originalPosition = element.style.position;
    var position = utils.css(element, 'position');

    if (position === 'absolute') {
      element.style.position = 'fixed';
    }
  }

  var scrollX = utils.getWindowScrollLeft(win);
  var scrollY = utils.getWindowScrollTop(win);
  var viewportWidth = utils.viewportWidth(win);
  var viewportHeight = utils.viewportHeight(win);
  var documentWidth = documentElement.scrollWidth;
  var documentHeight = documentElement.scrollHeight; // scrollXXX on html is sync with body which means overflow: hidden on body gets wrong scrollXXX.
  // We should cut this ourself.

  var bodyStyle = window.getComputedStyle(body);

  if (bodyStyle.overflowX === 'hidden') {
    documentWidth = win.innerWidth;
  }

  if (bodyStyle.overflowY === 'hidden') {
    documentHeight = win.innerHeight;
  } // Reset element position after calculate the visible area


  if (element.style) {
    element.style.position = originalPosition;
  }

  if (alwaysByViewport || isAncestorFixed(element)) {
    // Clip by viewport's size.
    visibleRect.left = Math.max(visibleRect.left, scrollX);
    visibleRect.top = Math.max(visibleRect.top, scrollY);
    visibleRect.right = Math.min(visibleRect.right, scrollX + viewportWidth);
    visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + viewportHeight);
  } else {
    // Clip by document's size.
    var maxVisibleWidth = Math.max(documentWidth, scrollX + viewportWidth);
    visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth);
    var maxVisibleHeight = Math.max(documentHeight, scrollY + viewportHeight);
    visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight);
  }

  return visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null;
}

function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
  var pos = utils.clone(elFuturePos);
  var size = {
    width: elRegion.width,
    height: elRegion.height
  };

  if (overflow.adjustX && pos.left < visibleRect.left) {
    pos.left = visibleRect.left;
  } // Left edge inside and right edge outside viewport, try to resize it.


  if (overflow.resizeWidth && pos.left >= visibleRect.left && pos.left + size.width > visibleRect.right) {
    size.width -= pos.left + size.width - visibleRect.right;
  } // Right edge outside viewport, try to move it.


  if (overflow.adjustX && pos.left + size.width > visibleRect.right) {
    // 保证左边界和可视区域左边界对齐
    pos.left = Math.max(visibleRect.right - size.width, visibleRect.left);
  } // Top edge outside viewport, try to move it.


  if (overflow.adjustY && pos.top < visibleRect.top) {
    pos.top = visibleRect.top;
  } // Top edge inside and bottom edge outside viewport, try to resize it.


  if (overflow.resizeHeight && pos.top >= visibleRect.top && pos.top + size.height > visibleRect.bottom) {
    size.height -= pos.top + size.height - visibleRect.bottom;
  } // Bottom edge outside viewport, try to move it.


  if (overflow.adjustY && pos.top + size.height > visibleRect.bottom) {
    // 保证上边界和可视区域上边界对齐
    pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top);
  }

  return utils.mix(pos, size);
}

function getRegion(node) {
  var offset;
  var w;
  var h;

  if (!utils.isWindow(node) && node.nodeType !== 9) {
    offset = utils.offset(node);
    w = utils.outerWidth(node);
    h = utils.outerHeight(node);
  } else {
    var win = utils.getWindow(node);
    offset = {
      left: utils.getWindowScrollLeft(win),
      top: utils.getWindowScrollTop(win)
    };
    w = utils.viewportWidth(win);
    h = utils.viewportHeight(win);
  }

  offset.width = w;
  offset.height = h;
  return offset;
}
/**
 * 获取 node 上的 align 对齐点 相对于页面的坐标
 */


function getAlignOffset(region, align) {
  var V = align.charAt(0);
  var H = align.charAt(1);
  var w = region.width;
  var h = region.height;
  var x = region.left;
  var y = region.top;

  if (V === 'c') {
    y += h / 2;
  } else if (V === 'b') {
    y += h;
  }

  if (H === 'c') {
    x += w / 2;
  } else if (H === 'r') {
    x += w;
  }

  return {
    left: x,
    top: y
  };
}

function getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset) {
  var p1 = getAlignOffset(refNodeRegion, points[1]);
  var p2 = getAlignOffset(elRegion, points[0]);
  var diff = [p2.left - p1.left, p2.top - p1.top];
  return {
    left: Math.round(elRegion.left - diff[0] + offset[0] - targetOffset[0]),
    top: Math.round(elRegion.top - diff[1] + offset[1] - targetOffset[1])
  };
}
/**
 * align dom node flexibly
 * @author yiminghe@gmail.com
 */


function isFailX(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.left < visibleRect.left || elFuturePos.left + elRegion.width > visibleRect.right;
}

function isFailY(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.top < visibleRect.top || elFuturePos.top + elRegion.height > visibleRect.bottom;
}

function isCompleteFailX(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.left > visibleRect.right || elFuturePos.left + elRegion.width < visibleRect.left;
}

function isCompleteFailY(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.top > visibleRect.bottom || elFuturePos.top + elRegion.height < visibleRect.top;
}

function flip(points, reg, map) {
  var ret = [];
  utils.each(points, function (p) {
    ret.push(p.replace(reg, function (m) {
      return map[m];
    }));
  });
  return ret;
}

function flipOffset(offset, index) {
  offset[index] = -offset[index];
  return offset;
}

function convertOffset(str, offsetLen) {
  var n;

  if (/%$/.test(str)) {
    n = parseInt(str.substring(0, str.length - 1), 10) / 100 * offsetLen;
  } else {
    n = parseInt(str, 10);
  }

  return n || 0;
}

function normalizeOffset(offset, el) {
  offset[0] = convertOffset(offset[0], el.width);
  offset[1] = convertOffset(offset[1], el.height);
}
/**
 * @param el
 * @param tgtRegion 参照节点所占的区域: { left, top, width, height }
 * @param align
 */


function doAlign(el, tgtRegion, align, isTgtRegionVisible) {
  var points = align.points;
  var offset = align.offset || [0, 0];
  var targetOffset = align.targetOffset || [0, 0];
  var overflow = align.overflow;
  var source = align.source || el;
  offset = [].concat(offset);
  targetOffset = [].concat(targetOffset);
  overflow = overflow || {};
  var newOverflowCfg = {};
  var fail = 0;
  var alwaysByViewport = !!(overflow && overflow.alwaysByViewport); // 当前节点可以被放置的显示区域

  var visibleRect = getVisibleRectForElement(source, alwaysByViewport); // 当前节点所占的区域, left/top/width/height

  var elRegion = getRegion(source); // 将 offset 转换成数值，支持百分比

  normalizeOffset(offset, elRegion);
  normalizeOffset(targetOffset, tgtRegion); // 当前节点将要被放置的位置

  var elFuturePos = getElFuturePos(elRegion, tgtRegion, points, offset, targetOffset); // 当前节点将要所处的区域

  var newElRegion = utils.merge(elRegion, elFuturePos); // 如果可视区域不能完全放置当前节点时允许调整

  if (visibleRect && (overflow.adjustX || overflow.adjustY) && isTgtRegionVisible) {
    if (overflow.adjustX) {
      // 如果横向不能放下
      if (isFailX(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        var newPoints = flip(points, /[lr]/gi, {
          l: 'r',
          r: 'l'
        }); // 偏移量也反下

        var newOffset = flipOffset(offset, 0);
        var newTargetOffset = flipOffset(targetOffset, 0);
        var newElFuturePos = getElFuturePos(elRegion, tgtRegion, newPoints, newOffset, newTargetOffset);

        if (!isCompleteFailX(newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = newPoints;
          offset = newOffset;
          targetOffset = newTargetOffset;
        }
      }
    }

    if (overflow.adjustY) {
      // 如果纵向不能放下
      if (isFailY(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        var _newPoints = flip(points, /[tb]/gi, {
          t: 'b',
          b: 't'
        }); // 偏移量也反下


        var _newOffset = flipOffset(offset, 1);

        var _newTargetOffset = flipOffset(targetOffset, 1);

        var _newElFuturePos = getElFuturePos(elRegion, tgtRegion, _newPoints, _newOffset, _newTargetOffset);

        if (!isCompleteFailY(_newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = _newPoints;
          offset = _newOffset;
          targetOffset = _newTargetOffset;
        }
      }
    } // 如果失败，重新计算当前节点将要被放置的位置


    if (fail) {
      elFuturePos = getElFuturePos(elRegion, tgtRegion, points, offset, targetOffset);
      utils.mix(newElRegion, elFuturePos);
    }

    var isStillFailX = isFailX(elFuturePos, elRegion, visibleRect);
    var isStillFailY = isFailY(elFuturePos, elRegion, visibleRect); // 检查反下后的位置是否可以放下了，如果仍然放不下：
    // 1. 复原修改过的定位参数

    if (isStillFailX || isStillFailY) {
      var _newPoints2 = points; // 重置对应部分的翻转逻辑

      if (isStillFailX) {
        _newPoints2 = flip(points, /[lr]/gi, {
          l: 'r',
          r: 'l'
        });
      }

      if (isStillFailY) {
        _newPoints2 = flip(points, /[tb]/gi, {
          t: 'b',
          b: 't'
        });
      }

      points = _newPoints2;
      offset = align.offset || [0, 0];
      targetOffset = align.targetOffset || [0, 0];
    } // 2. 只有指定了可以调整当前方向才调整


    newOverflowCfg.adjustX = overflow.adjustX && isStillFailX;
    newOverflowCfg.adjustY = overflow.adjustY && isStillFailY; // 确实要调整，甚至可能会调整高度宽度

    if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
      newElRegion = adjustForViewport(elFuturePos, elRegion, visibleRect, newOverflowCfg);
    }
  } // need judge to in case set fixed with in css on height auto element


  if (newElRegion.width !== elRegion.width) {
    utils.css(source, 'width', utils.width(source) + newElRegion.width - elRegion.width);
  }

  if (newElRegion.height !== elRegion.height) {
    utils.css(source, 'height', utils.height(source) + newElRegion.height - elRegion.height);
  } // https://github.com/kissyteam/kissy/issues/190
  // 相对于屏幕位置没变，而 left/top 变了
  // 例如 <div 'relative'><el absolute></div>


  utils.offset(source, {
    left: newElRegion.left,
    top: newElRegion.top
  }, {
    useCssRight: align.useCssRight,
    useCssBottom: align.useCssBottom,
    useCssTransform: align.useCssTransform,
    ignoreShake: align.ignoreShake
  });
  return {
    points: points,
    offset: offset,
    targetOffset: targetOffset,
    overflow: newOverflowCfg
  };
}
/**
 *  2012-04-26 yiminghe@gmail.com
 *   - 优化智能对齐算法
 *   - 慎用 resizeXX
 *
 *  2011-07-13 yiminghe@gmail.com note:
 *   - 增加智能对齐，以及大小调整选项
 **/


function isOutOfVisibleRect(target, alwaysByViewport) {
  var visibleRect = getVisibleRectForElement(target, alwaysByViewport);
  var targetRegion = getRegion(target);
  return !visibleRect || targetRegion.left + targetRegion.width <= visibleRect.left || targetRegion.top + targetRegion.height <= visibleRect.top || targetRegion.left >= visibleRect.right || targetRegion.top >= visibleRect.bottom;
}

function alignElement(el, refNode, align) {
  var target = align.target || refNode;
  var refNodeRegion = getRegion(target);
  var isTargetNotOutOfVisible = !isOutOfVisibleRect(target, align.overflow && align.overflow.alwaysByViewport);
  return doAlign(el, refNodeRegion, align, isTargetNotOutOfVisible);
}

alignElement.__getOffsetParent = getOffsetParent;
alignElement.__getVisibleRectForElement = getVisibleRectForElement;
/**
 * `tgtPoint`: { pageX, pageY } or { clientX, clientY }.
 * If client position provided, will internal convert to page position.
 */

function alignPoint(el, tgtPoint, align) {
  var pageX;
  var pageY;
  var doc = utils.getDocument(el);
  var win = doc.defaultView || doc.parentWindow;
  var scrollX = utils.getWindowScrollLeft(win);
  var scrollY = utils.getWindowScrollTop(win);
  var viewportWidth = utils.viewportWidth(win);
  var viewportHeight = utils.viewportHeight(win);

  if ('pageX' in tgtPoint) {
    pageX = tgtPoint.pageX;
  } else {
    pageX = scrollX + tgtPoint.clientX;
  }

  if ('pageY' in tgtPoint) {
    pageY = tgtPoint.pageY;
  } else {
    pageY = scrollY + tgtPoint.clientY;
  }

  var tgtRegion = {
    left: pageX,
    top: pageY,
    width: 0,
    height: 0
  };
  var pointInView = pageX >= 0 && pageX <= scrollX + viewportWidth && pageY >= 0 && pageY <= scrollY + viewportHeight; // Provide default target point

  var points = [align.points[0], 'cc'];
  return doAlign(el, tgtRegion, _objectSpread2(_objectSpread2({}, align), {}, {
    points: points
  }), pointInView);
}

/* harmony default export */ const dist_web = ((/* unused pure expression or super */ null && (alignElement)));

;// CONCATENATED MODULE: ./node_modules/rc-align/es/util.js



function isSamePoint(prev, next) {
  if (prev === next) return true;
  if (!prev || !next) return false;

  if ('pageX' in next && 'pageY' in next) {
    return prev.pageX === next.pageX && prev.pageY === next.pageY;
  }

  if ('clientX' in next && 'clientY' in next) {
    return prev.clientX === next.clientX && prev.clientY === next.clientY;
  }

  return false;
}
function restoreFocus(activeElement, container) {
  // Focus back if is in the container
  if (activeElement !== document.activeElement && contains(container, activeElement) && typeof activeElement.focus === 'function') {
    activeElement.focus();
  }
}
function monitorResize(element, callback) {
  var prevWidth = null;
  var prevHeight = null;

  function onResize(_ref) {
    var _ref2 = (0,slicedToArray/* default */.Z)(_ref, 1),
        target = _ref2[0].target;

    if (!document.documentElement.contains(target)) return;

    var _target$getBoundingCl = target.getBoundingClientRect(),
        width = _target$getBoundingCl.width,
        height = _target$getBoundingCl.height;

    var fixedWidth = Math.floor(width);
    var fixedHeight = Math.floor(height);

    if (prevWidth !== fixedWidth || prevHeight !== fixedHeight) {
      // https://webkit.org/blog/9997/resizeobserver-in-webkit/
      Promise.resolve().then(function () {
        callback({
          width: fixedWidth,
          height: fixedHeight
        });
      });
    }

    prevWidth = fixedWidth;
    prevHeight = fixedHeight;
  }

  var resizeObserver = new ResizeObserver_es(onResize);

  if (element) {
    resizeObserver.observe(element);
  }

  return function () {
    resizeObserver.disconnect();
  };
}
;// CONCATENATED MODULE: ./node_modules/rc-align/es/hooks/useBuffer.js

/* harmony default export */ const useBuffer = (function (callback, buffer) {
  var calledRef = external_React_default().useRef(false);
  var timeoutRef = external_React_default().useRef(null);

  function cancelTrigger() {
    window.clearTimeout(timeoutRef.current);
  }

  function trigger(force) {
    if (!calledRef.current || force === true) {
      if (callback() === false) {
        // Not delay since callback cancelled self
        return;
      }

      calledRef.current = true;
      cancelTrigger();
      timeoutRef.current = window.setTimeout(function () {
        calledRef.current = false;
      }, buffer);
    } else {
      cancelTrigger();
      timeoutRef.current = window.setTimeout(function () {
        calledRef.current = false;
        trigger();
      }, buffer);
    }
  }

  return [trigger, function () {
    calledRef.current = false;
    cancelTrigger();
  }];
});
;// CONCATENATED MODULE: ./node_modules/rc-align/es/Align.js


/**
 * Removed props:
 *  - childrenProps
 */









function getElement(func) {
  if (typeof func !== 'function') return null;
  return func();
}

function getPoint(point) {
  if ((0,esm_typeof/* default */.Z)(point) !== 'object' || !point) return null;
  return point;
}

var Align = function Align(_ref, ref) {
  var children = _ref.children,
      disabled = _ref.disabled,
      target = _ref.target,
      align = _ref.align,
      onAlign = _ref.onAlign,
      monitorWindowResize = _ref.monitorWindowResize,
      _ref$monitorBufferTim = _ref.monitorBufferTime,
      monitorBufferTime = _ref$monitorBufferTim === void 0 ? 0 : _ref$monitorBufferTim;
  var cacheRef = external_React_default().useRef({});
  var nodeRef = external_React_default().useRef();
  var childNode = external_React_default().Children.only(children); // ===================== Align ======================
  // We save the props here to avoid closure makes props ood

  var forceAlignPropsRef = external_React_default().useRef({});
  forceAlignPropsRef.current.disabled = disabled;
  forceAlignPropsRef.current.target = target;
  forceAlignPropsRef.current.onAlign = onAlign;

  var _useBuffer = useBuffer(function () {
    var _forceAlignPropsRef$c = forceAlignPropsRef.current,
        latestDisabled = _forceAlignPropsRef$c.disabled,
        latestTarget = _forceAlignPropsRef$c.target,
        latestOnAlign = _forceAlignPropsRef$c.onAlign;

    if (!latestDisabled && latestTarget) {
      var source = nodeRef.current;
      var result;
      var element = getElement(latestTarget);
      var point = getPoint(latestTarget);
      cacheRef.current.element = element;
      cacheRef.current.point = point; // IE lose focus after element realign
      // We should record activeElement and restore later

      var _document = document,
          activeElement = _document.activeElement; // We only align when element is visible

      if (element && isVisible(element)) {
        result = alignElement(source, element, align);
      } else if (point) {
        result = alignPoint(source, point, align);
      }

      restoreFocus(activeElement, source);

      if (latestOnAlign && result) {
        latestOnAlign(source, result);
      }

      return true;
    }

    return false;
  }, monitorBufferTime),
      _useBuffer2 = (0,slicedToArray/* default */.Z)(_useBuffer, 2),
      _forceAlign = _useBuffer2[0],
      cancelForceAlign = _useBuffer2[1]; // ===================== Effect =====================
  // Listen for target updated


  var resizeMonitor = external_React_default().useRef({
    cancel: function cancel() {}
  }); // Listen for source updated

  var sourceResizeMonitor = external_React_default().useRef({
    cancel: function cancel() {}
  });
  external_React_default().useEffect(function () {
    var element = getElement(target);
    var point = getPoint(target);

    if (nodeRef.current !== sourceResizeMonitor.current.element) {
      sourceResizeMonitor.current.cancel();
      sourceResizeMonitor.current.element = nodeRef.current;
      sourceResizeMonitor.current.cancel = monitorResize(nodeRef.current, _forceAlign);
    }

    if (cacheRef.current.element !== element || !isSamePoint(cacheRef.current.point, point)) {
      _forceAlign(); // Add resize observer


      if (resizeMonitor.current.element !== element) {
        resizeMonitor.current.cancel();
        resizeMonitor.current.element = element;
        resizeMonitor.current.cancel = monitorResize(element, _forceAlign);
      }
    }
  }); // Listen for disabled change

  external_React_default().useEffect(function () {
    if (!disabled) {
      _forceAlign();
    } else {
      cancelForceAlign();
    }
  }, [disabled]); // Listen for window resize

  var winResizeRef = external_React_default().useRef(null);
  external_React_default().useEffect(function () {
    if (monitorWindowResize) {
      if (!winResizeRef.current) {
        winResizeRef.current = addEventListenerWrap(window, 'resize', _forceAlign);
      }
    } else if (winResizeRef.current) {
      winResizeRef.current.remove();
      winResizeRef.current = null;
    }
  }, [monitorWindowResize]); // Clear all if unmount

  external_React_default().useEffect(function () {
    return function () {
      resizeMonitor.current.cancel();
      sourceResizeMonitor.current.cancel();
      if (winResizeRef.current) winResizeRef.current.remove();
      cancelForceAlign();
    };
  }, []); // ====================== Ref =======================

  external_React_default().useImperativeHandle(ref, function () {
    return {
      forceAlign: function forceAlign() {
        return _forceAlign(true);
      }
    };
  }); // ===================== Render =====================

  if ( /*#__PURE__*/external_React_default().isValidElement(childNode)) {
    childNode = /*#__PURE__*/external_React_default().cloneElement(childNode, {
      ref: (0,es_ref/* composeRef */.sQ)(childNode.ref, nodeRef)
    });
  }

  return childNode;
};

var RefAlign = /*#__PURE__*/external_React_default().forwardRef(Align);
RefAlign.displayName = 'Align';
/* harmony default export */ const es_Align = (RefAlign);
;// CONCATENATED MODULE: ./node_modules/rc-align/es/index.js
// export this package's api

/* harmony default export */ const rc_align_es = (es_Align);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(8627);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(9677);
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/Popup/useVisibleStatus.js





var StatusQueue = ['measure', 'align', null, 'motion'];
/* harmony default export */ const useVisibleStatus = (function (visible, doMeasure) {
  var _useState = (0,external_React_.useState)(null),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      status = _useState2[0],
      setInternalStatus = _useState2[1];

  var rafRef = (0,external_React_.useRef)();
  var destroyRef = (0,external_React_.useRef)(false);

  function setStatus(nextStatus) {
    if (!destroyRef.current) {
      setInternalStatus(nextStatus);
    }
  }

  function cancelRaf() {
    raf/* default.cancel */.Z.cancel(rafRef.current);
  }

  function goNextStatus(callback) {
    cancelRaf();
    rafRef.current = (0,raf/* default */.Z)(function () {
      // Only align should be manually trigger
      setStatus(function (prev) {
        switch (status) {
          case 'align':
            return 'motion';

          case 'motion':
            return 'stable';

          default:
        }

        return prev;
      });
      callback === null || callback === void 0 ? void 0 : callback();
    });
  } // Init status


  (0,external_React_.useEffect)(function () {
    setStatus('measure');
  }, [visible]); // Go next status

  (0,external_React_.useEffect)(function () {
    switch (status) {
      case 'measure':
        doMeasure();
        break;

      default:
    }

    if (status) {
      rafRef.current = (0,raf/* default */.Z)( /*#__PURE__*/(0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee() {
        var index, nextStatus;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                index = StatusQueue.indexOf(status);
                nextStatus = StatusQueue[index + 1];

                if (nextStatus && index !== -1) {
                  setStatus(nextStatus);
                }

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })));
    }
  }, [status]);
  (0,external_React_.useEffect)(function () {
    return function () {
      destroyRef.current = true;
      cancelRaf();
    };
  }, []);
  return [status, goNextStatus];
});
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/Popup/useStretchStyle.js


/* harmony default export */ const useStretchStyle = (function (stretch) {
  var _React$useState = external_React_.useState({
    width: 0,
    height: 0
  }),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      targetSize = _React$useState2[0],
      setTargetSize = _React$useState2[1];

  function measureStretch(element) {
    setTargetSize({
      width: element.offsetWidth,
      height: element.offsetHeight
    });
  } // Merge stretch style


  var style = external_React_.useMemo(function () {
    var sizeStyle = {};

    if (stretch) {
      var width = targetSize.width,
          height = targetSize.height; // Stretch with target

      if (stretch.indexOf('height') !== -1 && height) {
        sizeStyle.height = height;
      } else if (stretch.indexOf('minHeight') !== -1 && height) {
        sizeStyle.minHeight = height;
      }

      if (stretch.indexOf('width') !== -1 && width) {
        sizeStyle.width = width;
      } else if (stretch.indexOf('minWidth') !== -1 && width) {
        sizeStyle.minWidth = width;
      }
    }

    return sizeStyle;
  }, [stretch, targetSize]);
  return [style, measureStretch];
});
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/Popup/PopupInner.js











var PopupInner = /*#__PURE__*/external_React_.forwardRef(function (props, ref) {
  var visible = props.visible,
      prefixCls = props.prefixCls,
      className = props.className,
      style = props.style,
      children = props.children,
      zIndex = props.zIndex,
      stretch = props.stretch,
      destroyPopupOnHide = props.destroyPopupOnHide,
      forceRender = props.forceRender,
      align = props.align,
      point = props.point,
      getRootDomNode = props.getRootDomNode,
      getClassNameFromAlign = props.getClassNameFromAlign,
      onAlign = props.onAlign,
      onMouseEnter = props.onMouseEnter,
      onMouseLeave = props.onMouseLeave,
      onMouseDown = props.onMouseDown,
      onTouchStart = props.onTouchStart;
  var alignRef = (0,external_React_.useRef)();
  var elementRef = (0,external_React_.useRef)();

  var _useState = (0,external_React_.useState)(),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      alignedClassName = _useState2[0],
      setAlignedClassName = _useState2[1]; // ======================= Measure ========================


  var _useStretchStyle = useStretchStyle(stretch),
      _useStretchStyle2 = (0,slicedToArray/* default */.Z)(_useStretchStyle, 2),
      stretchStyle = _useStretchStyle2[0],
      measureStretchStyle = _useStretchStyle2[1];

  function doMeasure() {
    if (stretch) {
      measureStretchStyle(getRootDomNode());
    }
  } // ======================== Status ========================


  var _useVisibleStatus = useVisibleStatus(visible, doMeasure),
      _useVisibleStatus2 = (0,slicedToArray/* default */.Z)(_useVisibleStatus, 2),
      status = _useVisibleStatus2[0],
      goNextStatus = _useVisibleStatus2[1]; // ======================== Aligns ========================


  var prepareResolveRef = (0,external_React_.useRef)(); // `target` on `rc-align` can accept as a function to get the bind element or a point.
  // ref: https://www.npmjs.com/package/rc-align

  function getAlignTarget() {
    if (point) {
      return point;
    }

    return getRootDomNode;
  }

  function forceAlign() {
    var _alignRef$current;

    (_alignRef$current = alignRef.current) === null || _alignRef$current === void 0 ? void 0 : _alignRef$current.forceAlign();
  }

  function onInternalAlign(popupDomNode, matchAlign) {
    if (status === 'align') {
      var nextAlignedClassName = getClassNameFromAlign(matchAlign);
      setAlignedClassName(nextAlignedClassName); // Repeat until not more align needed

      if (alignedClassName !== nextAlignedClassName) {
        Promise.resolve().then(function () {
          forceAlign();
        });
      } else {
        goNextStatus(function () {
          var _prepareResolveRef$cu;

          (_prepareResolveRef$cu = prepareResolveRef.current) === null || _prepareResolveRef$cu === void 0 ? void 0 : _prepareResolveRef$cu.call(prepareResolveRef);
        });
      }

      onAlign === null || onAlign === void 0 ? void 0 : onAlign(popupDomNode, matchAlign);
    }
  } // ======================== Motion ========================


  var motion = (0,objectSpread2/* default */.Z)({}, getMotion(props));

  ['onAppearEnd', 'onEnterEnd', 'onLeaveEnd'].forEach(function (eventName) {
    var originHandler = motion[eventName];

    motion[eventName] = function (element, event) {
      goNextStatus();
      return originHandler === null || originHandler === void 0 ? void 0 : originHandler(element, event);
    };
  });

  function onShowPrepare() {
    return new Promise(function (resolve) {
      prepareResolveRef.current = resolve;
    });
  } // Go to stable directly when motion not provided


  external_React_.useEffect(function () {
    if (!motion.motionName && status === 'motion') {
      goNextStatus();
    }
  }, [motion.motionName, status]); // ========================= Refs =========================

  external_React_.useImperativeHandle(ref, function () {
    return {
      forceAlign: forceAlign,
      getElement: function getElement() {
        return elementRef.current;
      }
    };
  }); // ======================== Render ========================

  var mergedStyle = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, stretchStyle), {}, {
    zIndex: zIndex,
    opacity: status === 'motion' || status === 'stable' || !visible ? undefined : 0,
    pointerEvents: status === 'stable' ? undefined : 'none'
  }, style); // Align status


  var alignDisabled = true;

  if ((align === null || align === void 0 ? void 0 : align.points) && (status === 'align' || status === 'stable')) {
    alignDisabled = false;
  }

  var childNode = children; // Wrapper when multiple children

  if (external_React_.Children.count(children) > 1) {
    childNode = /*#__PURE__*/external_React_.createElement("div", {
      className: "".concat(prefixCls, "-content")
    }, children);
  }

  return /*#__PURE__*/external_React_.createElement(rc_motion_es/* default */.Z, (0,esm_extends/* default */.Z)({
    visible: visible,
    ref: elementRef,
    leavedClassName: "".concat(prefixCls, "-hidden")
  }, motion, {
    onAppearPrepare: onShowPrepare,
    onEnterPrepare: onShowPrepare,
    removeOnLeave: destroyPopupOnHide,
    forceRender: forceRender
  }), function (_ref, motionRef) {
    var motionClassName = _ref.className,
        motionStyle = _ref.style;
    var mergedClassName = classnames_default()(prefixCls, className, alignedClassName, motionClassName);
    return /*#__PURE__*/external_React_.createElement(rc_align_es, {
      target: getAlignTarget(),
      key: "popup",
      ref: alignRef,
      monitorWindowResize: true,
      disabled: alignDisabled,
      align: align,
      onAlign: onInternalAlign
    }, /*#__PURE__*/external_React_.createElement("div", {
      ref: motionRef,
      className: mergedClassName,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onMouseDownCapture: onMouseDown,
      onTouchStartCapture: onTouchStart,
      style: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, motionStyle), mergedStyle)
    }, childNode));
  });
});
PopupInner.displayName = 'PopupInner';
/* harmony default export */ const Popup_PopupInner = (PopupInner);
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/Popup/MobilePopupInner.js





var MobilePopupInner = /*#__PURE__*/external_React_.forwardRef(function (props, ref) {
  var prefixCls = props.prefixCls,
      visible = props.visible,
      zIndex = props.zIndex,
      children = props.children,
      _props$mobile = props.mobile;
  _props$mobile = _props$mobile === void 0 ? {} : _props$mobile;
  var popupClassName = _props$mobile.popupClassName,
      popupStyle = _props$mobile.popupStyle,
      _props$mobile$popupMo = _props$mobile.popupMotion,
      popupMotion = _props$mobile$popupMo === void 0 ? {} : _props$mobile$popupMo,
      popupRender = _props$mobile.popupRender;
  var elementRef = external_React_.useRef(); // ========================= Refs =========================

  external_React_.useImperativeHandle(ref, function () {
    return {
      forceAlign: function forceAlign() {},
      getElement: function getElement() {
        return elementRef.current;
      }
    };
  }); // ======================== Render ========================

  var mergedStyle = (0,objectSpread2/* default */.Z)({
    zIndex: zIndex
  }, popupStyle);

  var childNode = children; // Wrapper when multiple children

  if (external_React_.Children.count(children) > 1) {
    childNode = /*#__PURE__*/external_React_.createElement("div", {
      className: "".concat(prefixCls, "-content")
    }, children);
  } // Mobile support additional render


  if (popupRender) {
    childNode = popupRender(childNode);
  }

  return /*#__PURE__*/external_React_.createElement(rc_motion_es/* default */.Z, (0,esm_extends/* default */.Z)({
    visible: visible,
    ref: elementRef,
    removeOnLeave: true
  }, popupMotion), function (_ref, motionRef) {
    var motionClassName = _ref.className,
        motionStyle = _ref.style;
    var mergedClassName = classnames_default()(prefixCls, popupClassName, motionClassName);
    return /*#__PURE__*/external_React_.createElement("div", {
      ref: motionRef,
      className: mergedClassName,
      style: (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, motionStyle), mergedStyle)
    }, childNode);
  });
});
MobilePopupInner.displayName = 'MobilePopupInner';
/* harmony default export */ const Popup_MobilePopupInner = (MobilePopupInner);
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/Popup/index.js










var Popup = /*#__PURE__*/external_React_.forwardRef(function (_ref, ref) {
  var visible = _ref.visible,
      mobile = _ref.mobile,
      props = (0,objectWithoutProperties/* default */.Z)(_ref, ["visible", "mobile"]);

  var _useState = (0,external_React_.useState)(visible),
      _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
      innerVisible = _useState2[0],
      serInnerVisible = _useState2[1];

  var _useState3 = (0,external_React_.useState)(false),
      _useState4 = (0,slicedToArray/* default */.Z)(_useState3, 2),
      inMobile = _useState4[0],
      setInMobile = _useState4[1];

  var cloneProps = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, props), {}, {
    visible: innerVisible
  }); // We check mobile in visible changed here.
  // And this also delay set `innerVisible` to avoid popup component render flash


  (0,external_React_.useEffect)(function () {
    serInnerVisible(visible);

    if (visible && mobile) {
      setInMobile(isMobile());
    }
  }, [visible, mobile]);
  var popupNode = inMobile ? /*#__PURE__*/external_React_.createElement(Popup_MobilePopupInner, (0,esm_extends/* default */.Z)({}, cloneProps, {
    mobile: mobile,
    ref: ref
  })) : /*#__PURE__*/external_React_.createElement(Popup_PopupInner, (0,esm_extends/* default */.Z)({}, cloneProps, {
    ref: ref
  })); // We can use fragment directly but this may failed some selector usage. Keep as origin logic

  return /*#__PURE__*/external_React_.createElement("div", null, /*#__PURE__*/external_React_.createElement(Mask, cloneProps), popupNode);
});
Popup.displayName = 'Popup';
/* harmony default export */ const es_Popup = (Popup);
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/context.js

var TriggerContext = /*#__PURE__*/external_React_.createContext(null);
/* harmony default export */ const context = (TriggerContext);
;// CONCATENATED MODULE: ./node_modules/rc-trigger/es/index.js




















function noop() {}

function returnEmptyString() {
  return '';
}

function returnDocument(element) {
  if (element) {
    return element.ownerDocument;
  }

  return window.document;
}

var ALL_HANDLERS = ['onClick', 'onMouseDown', 'onTouchStart', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur', 'onContextMenu'];
/**
 * Internal usage. Do not use in your code since this will be removed.
 */

function generateTrigger(PortalComponent) {
  var Trigger = /*#__PURE__*/function (_React$Component) {
    (0,inherits/* default */.Z)(Trigger, _React$Component);

    var _super = (0,createSuper/* default */.Z)(Trigger);

    function Trigger(props) {
      var _this;

      (0,classCallCheck/* default */.Z)(this, Trigger);

      _this = _super.call(this, props);
      _this.popupRef = /*#__PURE__*/external_React_.createRef();
      _this.triggerRef = /*#__PURE__*/external_React_.createRef();

      _this.onMouseEnter = function (e) {
        var mouseEnterDelay = _this.props.mouseEnterDelay;

        _this.fireEvents('onMouseEnter', e);

        _this.delaySetPopupVisible(true, mouseEnterDelay, mouseEnterDelay ? null : e);
      };

      _this.onMouseMove = function (e) {
        _this.fireEvents('onMouseMove', e);

        _this.setPoint(e);
      };

      _this.onMouseLeave = function (e) {
        _this.fireEvents('onMouseLeave', e);

        _this.delaySetPopupVisible(false, _this.props.mouseLeaveDelay);
      };

      _this.onPopupMouseEnter = function () {
        _this.clearDelayTimer();
      };

      _this.onPopupMouseLeave = function (e) {
        var _this$popupRef$curren; // https://github.com/react-component/trigger/pull/13
        // react bug?


        if (e.relatedTarget && !e.relatedTarget.setTimeout && contains((_this$popupRef$curren = _this.popupRef.current) === null || _this$popupRef$curren === void 0 ? void 0 : _this$popupRef$curren.getElement(), e.relatedTarget)) {
          return;
        }

        _this.delaySetPopupVisible(false, _this.props.mouseLeaveDelay);
      };

      _this.onFocus = function (e) {
        _this.fireEvents('onFocus', e); // incase focusin and focusout


        _this.clearDelayTimer();

        if (_this.isFocusToShow()) {
          _this.focusTime = Date.now();

          _this.delaySetPopupVisible(true, _this.props.focusDelay);
        }
      };

      _this.onMouseDown = function (e) {
        _this.fireEvents('onMouseDown', e);

        _this.preClickTime = Date.now();
      };

      _this.onTouchStart = function (e) {
        _this.fireEvents('onTouchStart', e);

        _this.preTouchTime = Date.now();
      };

      _this.onBlur = function (e) {
        _this.fireEvents('onBlur', e);

        _this.clearDelayTimer();

        if (_this.isBlurToHide()) {
          _this.delaySetPopupVisible(false, _this.props.blurDelay);
        }
      };

      _this.onContextMenu = function (e) {
        e.preventDefault();

        _this.fireEvents('onContextMenu', e);

        _this.setPopupVisible(true, e);
      };

      _this.onContextMenuClose = function () {
        if (_this.isContextMenuToShow()) {
          _this.close();
        }
      };

      _this.onClick = function (event) {
        _this.fireEvents('onClick', event); // focus will trigger click


        if (_this.focusTime) {
          var preTime;

          if (_this.preClickTime && _this.preTouchTime) {
            preTime = Math.min(_this.preClickTime, _this.preTouchTime);
          } else if (_this.preClickTime) {
            preTime = _this.preClickTime;
          } else if (_this.preTouchTime) {
            preTime = _this.preTouchTime;
          }

          if (Math.abs(preTime - _this.focusTime) < 20) {
            return;
          }

          _this.focusTime = 0;
        }

        _this.preClickTime = 0;
        _this.preTouchTime = 0; // Only prevent default when all the action is click.
        // https://github.com/ant-design/ant-design/issues/17043
        // https://github.com/ant-design/ant-design/issues/17291

        if (_this.isClickToShow() && (_this.isClickToHide() || _this.isBlurToHide()) && event && event.preventDefault) {
          event.preventDefault();
        }

        var nextVisible = !_this.state.popupVisible;

        if (_this.isClickToHide() && !nextVisible || nextVisible && _this.isClickToShow()) {
          _this.setPopupVisible(!_this.state.popupVisible, event);
        }
      };

      _this.onPopupMouseDown = function () {
        _this.hasPopupMouseDown = true;
        clearTimeout(_this.mouseDownTimeout);
        _this.mouseDownTimeout = window.setTimeout(function () {
          _this.hasPopupMouseDown = false;
        }, 0);

        if (_this.context) {
          var _this$context;

          (_this$context = _this.context).onPopupMouseDown.apply(_this$context, arguments);
        }
      };

      _this.onDocumentClick = function (event) {
        if (_this.props.mask && !_this.props.maskClosable) {
          return;
        }

        var target = event.target;

        var root = _this.getRootDomNode();

        var popupNode = _this.getPopupDomNode();

        if ( // mousedown on the target should also close popup when action is contextMenu.
        // https://github.com/ant-design/ant-design/issues/29853
        (!contains(root, target) || _this.isContextMenuOnly()) && !contains(popupNode, target) && !_this.hasPopupMouseDown) {
          _this.close();
        }
      };

      _this.getRootDomNode = function () {
        var getTriggerDOMNode = _this.props.getTriggerDOMNode;

        if (getTriggerDOMNode) {
          return getTriggerDOMNode(_this.triggerRef.current);
        }

        try {
          var domNode = (0,findDOMNode/* default */.Z)(_this.triggerRef.current);

          if (domNode) {
            return domNode;
          }
        } catch (err) {// Do nothing
        }

        return external_ReactDOM_default().findDOMNode((0,assertThisInitialized/* default */.Z)(_this));
      };

      _this.getPopupClassNameFromAlign = function (align) {
        var className = [];
        var _this$props = _this.props,
            popupPlacement = _this$props.popupPlacement,
            builtinPlacements = _this$props.builtinPlacements,
            prefixCls = _this$props.prefixCls,
            alignPoint = _this$props.alignPoint,
            getPopupClassNameFromAlign = _this$props.getPopupClassNameFromAlign;

        if (popupPlacement && builtinPlacements) {
          className.push(getAlignPopupClassName(builtinPlacements, prefixCls, align, alignPoint));
        }

        if (getPopupClassNameFromAlign) {
          className.push(getPopupClassNameFromAlign(align));
        }

        return className.join(' ');
      };

      _this.getComponent = function () {
        var _this$props2 = _this.props,
            prefixCls = _this$props2.prefixCls,
            destroyPopupOnHide = _this$props2.destroyPopupOnHide,
            popupClassName = _this$props2.popupClassName,
            onPopupAlign = _this$props2.onPopupAlign,
            popupMotion = _this$props2.popupMotion,
            popupAnimation = _this$props2.popupAnimation,
            popupTransitionName = _this$props2.popupTransitionName,
            popupStyle = _this$props2.popupStyle,
            mask = _this$props2.mask,
            maskAnimation = _this$props2.maskAnimation,
            maskTransitionName = _this$props2.maskTransitionName,
            maskMotion = _this$props2.maskMotion,
            zIndex = _this$props2.zIndex,
            popup = _this$props2.popup,
            stretch = _this$props2.stretch,
            alignPoint = _this$props2.alignPoint,
            mobile = _this$props2.mobile,
            forceRender = _this$props2.forceRender;
        var _this$state = _this.state,
            popupVisible = _this$state.popupVisible,
            point = _this$state.point;

        var align = _this.getPopupAlign();

        var mouseProps = {};

        if (_this.isMouseEnterToShow()) {
          mouseProps.onMouseEnter = _this.onPopupMouseEnter;
        }

        if (_this.isMouseLeaveToHide()) {
          mouseProps.onMouseLeave = _this.onPopupMouseLeave;
        }

        mouseProps.onMouseDown = _this.onPopupMouseDown;
        mouseProps.onTouchStart = _this.onPopupMouseDown;
        return /*#__PURE__*/external_React_.createElement(es_Popup, (0,esm_extends/* default */.Z)({
          prefixCls: prefixCls,
          destroyPopupOnHide: destroyPopupOnHide,
          visible: popupVisible,
          point: alignPoint && point,
          className: popupClassName,
          align: align,
          onAlign: onPopupAlign,
          animation: popupAnimation,
          getClassNameFromAlign: _this.getPopupClassNameFromAlign
        }, mouseProps, {
          stretch: stretch,
          getRootDomNode: _this.getRootDomNode,
          style: popupStyle,
          mask: mask,
          zIndex: zIndex,
          transitionName: popupTransitionName,
          maskAnimation: maskAnimation,
          maskTransitionName: maskTransitionName,
          maskMotion: maskMotion,
          ref: _this.popupRef,
          motion: popupMotion,
          mobile: mobile,
          forceRender: forceRender
        }), typeof popup === 'function' ? popup() : popup);
      };

      _this.attachParent = function (popupContainer) {
        raf/* default.cancel */.Z.cancel(_this.attachId);
        var _this$props3 = _this.props,
            getPopupContainer = _this$props3.getPopupContainer,
            getDocument = _this$props3.getDocument;

        var domNode = _this.getRootDomNode();

        var mountNode;

        if (!getPopupContainer) {
          mountNode = getDocument(_this.getRootDomNode()).body;
        } else if (domNode || getPopupContainer.length === 0) {
          // Compatible for legacy getPopupContainer with domNode argument.
          // If no need `domNode` argument, will call directly.
          // https://codesandbox.io/s/eloquent-mclean-ss93m?file=/src/App.js
          mountNode = getPopupContainer(domNode);
        }

        if (mountNode) {
          mountNode.appendChild(popupContainer);
        } else {
          // Retry after frame render in case parent not ready
          _this.attachId = (0,raf/* default */.Z)(function () {
            _this.attachParent(popupContainer);
          });
        }
      };

      _this.getContainer = function () {
        var getDocument = _this.props.getDocument;
        var popupContainer = getDocument(_this.getRootDomNode()).createElement('div'); // Make sure default popup container will never cause scrollbar appearing
        // https://github.com/react-component/trigger/issues/41

        popupContainer.style.position = 'absolute';
        popupContainer.style.top = '0';
        popupContainer.style.left = '0';
        popupContainer.style.width = '100%';

        _this.attachParent(popupContainer);

        return popupContainer;
      };

      _this.setPoint = function (point) {
        var alignPoint = _this.props.alignPoint;
        if (!alignPoint || !point) return;

        _this.setState({
          point: {
            pageX: point.pageX,
            pageY: point.pageY
          }
        });
      };

      _this.handlePortalUpdate = function () {
        if (_this.state.prevPopupVisible !== _this.state.popupVisible) {
          _this.props.afterPopupVisibleChange(_this.state.popupVisible);
        }
      };

      _this.triggerContextValue = {
        onPopupMouseDown: _this.onPopupMouseDown
      };
      var popupVisible;

      if ('popupVisible' in props) {
        popupVisible = !!props.popupVisible;
      } else {
        popupVisible = !!props.defaultPopupVisible;
      }

      _this.state = {
        prevPopupVisible: popupVisible,
        popupVisible: popupVisible
      };
      ALL_HANDLERS.forEach(function (h) {
        _this["fire".concat(h)] = function (e) {
          _this.fireEvents(h, e);
        };
      });
      return _this;
    }

    (0,createClass/* default */.Z)(Trigger, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.componentDidUpdate();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var props = this.props;
        var state = this.state; // We must listen to `mousedown` or `touchstart`, edge case:
        // https://github.com/ant-design/ant-design/issues/5804
        // https://github.com/react-component/calendar/issues/250
        // https://github.com/react-component/trigger/issues/50

        if (state.popupVisible) {
          var currentDocument;

          if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextMenuToShow())) {
            currentDocument = props.getDocument(this.getRootDomNode());
            this.clickOutsideHandler = addEventListenerWrap(currentDocument, 'mousedown', this.onDocumentClick);
          } // always hide on mobile


          if (!this.touchOutsideHandler) {
            currentDocument = currentDocument || props.getDocument(this.getRootDomNode());
            this.touchOutsideHandler = addEventListenerWrap(currentDocument, 'touchstart', this.onDocumentClick);
          } // close popup when trigger type contains 'onContextMenu' and document is scrolling.


          if (!this.contextMenuOutsideHandler1 && this.isContextMenuToShow()) {
            currentDocument = currentDocument || props.getDocument(this.getRootDomNode());
            this.contextMenuOutsideHandler1 = addEventListenerWrap(currentDocument, 'scroll', this.onContextMenuClose);
          } // close popup when trigger type contains 'onContextMenu' and window is blur.


          if (!this.contextMenuOutsideHandler2 && this.isContextMenuToShow()) {
            this.contextMenuOutsideHandler2 = addEventListenerWrap(window, 'blur', this.onContextMenuClose);
          }

          return;
        }

        this.clearOutsideHandler();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.clearDelayTimer();
        this.clearOutsideHandler();
        clearTimeout(this.mouseDownTimeout);
        raf/* default.cancel */.Z.cancel(this.attachId);
      }
    }, {
      key: "getPopupDomNode",
      value: function getPopupDomNode() {
        var _this$popupRef$curren2; // for test


        return ((_this$popupRef$curren2 = this.popupRef.current) === null || _this$popupRef$curren2 === void 0 ? void 0 : _this$popupRef$curren2.getElement()) || null;
      }
    }, {
      key: "getPopupAlign",
      value: function getPopupAlign() {
        var props = this.props;
        var popupPlacement = props.popupPlacement,
            popupAlign = props.popupAlign,
            builtinPlacements = props.builtinPlacements;

        if (popupPlacement && builtinPlacements) {
          return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
        }

        return popupAlign;
      }
      /**
       * @param popupVisible    Show or not the popup element
       * @param event           SyntheticEvent, used for `pointAlign`
       */

    }, {
      key: "setPopupVisible",
      value: function setPopupVisible(popupVisible, event) {
        var alignPoint = this.props.alignPoint;
        var prevPopupVisible = this.state.popupVisible;
        this.clearDelayTimer();

        if (prevPopupVisible !== popupVisible) {
          if (!('popupVisible' in this.props)) {
            this.setState({
              popupVisible: popupVisible,
              prevPopupVisible: prevPopupVisible
            });
          }

          this.props.onPopupVisibleChange(popupVisible);
        } // Always record the point position since mouseEnterDelay will delay the show


        if (alignPoint && event && popupVisible) {
          this.setPoint(event);
        }
      }
    }, {
      key: "delaySetPopupVisible",
      value: function delaySetPopupVisible(visible, delayS, event) {
        var _this2 = this;

        var delay = delayS * 1000;
        this.clearDelayTimer();

        if (delay) {
          var point = event ? {
            pageX: event.pageX,
            pageY: event.pageY
          } : null;
          this.delayTimer = window.setTimeout(function () {
            _this2.setPopupVisible(visible, point);

            _this2.clearDelayTimer();
          }, delay);
        } else {
          this.setPopupVisible(visible, event);
        }
      }
    }, {
      key: "clearDelayTimer",
      value: function clearDelayTimer() {
        if (this.delayTimer) {
          clearTimeout(this.delayTimer);
          this.delayTimer = null;
        }
      }
    }, {
      key: "clearOutsideHandler",
      value: function clearOutsideHandler() {
        if (this.clickOutsideHandler) {
          this.clickOutsideHandler.remove();
          this.clickOutsideHandler = null;
        }

        if (this.contextMenuOutsideHandler1) {
          this.contextMenuOutsideHandler1.remove();
          this.contextMenuOutsideHandler1 = null;
        }

        if (this.contextMenuOutsideHandler2) {
          this.contextMenuOutsideHandler2.remove();
          this.contextMenuOutsideHandler2 = null;
        }

        if (this.touchOutsideHandler) {
          this.touchOutsideHandler.remove();
          this.touchOutsideHandler = null;
        }
      }
    }, {
      key: "createTwoChains",
      value: function createTwoChains(event) {
        var childPros = this.props.children.props;
        var props = this.props;

        if (childPros[event] && props[event]) {
          return this["fire".concat(event)];
        }

        return childPros[event] || props[event];
      }
    }, {
      key: "isClickToShow",
      value: function isClickToShow() {
        var _this$props4 = this.props,
            action = _this$props4.action,
            showAction = _this$props4.showAction;
        return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
      }
    }, {
      key: "isContextMenuOnly",
      value: function isContextMenuOnly() {
        var action = this.props.action;
        return action === 'contextMenu' || action.length === 1 && action[0] === 'contextMenu';
      }
    }, {
      key: "isContextMenuToShow",
      value: function isContextMenuToShow() {
        var _this$props5 = this.props,
            action = _this$props5.action,
            showAction = _this$props5.showAction;
        return action.indexOf('contextMenu') !== -1 || showAction.indexOf('contextMenu') !== -1;
      }
    }, {
      key: "isClickToHide",
      value: function isClickToHide() {
        var _this$props6 = this.props,
            action = _this$props6.action,
            hideAction = _this$props6.hideAction;
        return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
      }
    }, {
      key: "isMouseEnterToShow",
      value: function isMouseEnterToShow() {
        var _this$props7 = this.props,
            action = _this$props7.action,
            showAction = _this$props7.showAction;
        return action.indexOf('hover') !== -1 || showAction.indexOf('mouseEnter') !== -1;
      }
    }, {
      key: "isMouseLeaveToHide",
      value: function isMouseLeaveToHide() {
        var _this$props8 = this.props,
            action = _this$props8.action,
            hideAction = _this$props8.hideAction;
        return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseLeave') !== -1;
      }
    }, {
      key: "isFocusToShow",
      value: function isFocusToShow() {
        var _this$props9 = this.props,
            action = _this$props9.action,
            showAction = _this$props9.showAction;
        return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
      }
    }, {
      key: "isBlurToHide",
      value: function isBlurToHide() {
        var _this$props10 = this.props,
            action = _this$props10.action,
            hideAction = _this$props10.hideAction;
        return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
      }
    }, {
      key: "forcePopupAlign",
      value: function forcePopupAlign() {
        if (this.state.popupVisible) {
          var _this$popupRef$curren3;

          (_this$popupRef$curren3 = this.popupRef.current) === null || _this$popupRef$curren3 === void 0 ? void 0 : _this$popupRef$curren3.forceAlign();
        }
      }
    }, {
      key: "fireEvents",
      value: function fireEvents(type, e) {
        var childCallback = this.props.children.props[type];

        if (childCallback) {
          childCallback(e);
        }

        var callback = this.props[type];

        if (callback) {
          callback(e);
        }
      }
    }, {
      key: "close",
      value: function close() {
        this.setPopupVisible(false);
      }
    }, {
      key: "render",
      value: function render() {
        var popupVisible = this.state.popupVisible;
        var _this$props11 = this.props,
            children = _this$props11.children,
            forceRender = _this$props11.forceRender,
            alignPoint = _this$props11.alignPoint,
            className = _this$props11.className,
            autoDestroy = _this$props11.autoDestroy;
        var child = external_React_.Children.only(children);
        var newChildProps = {
          key: 'trigger'
        }; // ============================== Visible Handlers ==============================
        // >>> ContextMenu

        if (this.isContextMenuToShow()) {
          newChildProps.onContextMenu = this.onContextMenu;
        } else {
          newChildProps.onContextMenu = this.createTwoChains('onContextMenu');
        } // >>> Click


        if (this.isClickToHide() || this.isClickToShow()) {
          newChildProps.onClick = this.onClick;
          newChildProps.onMouseDown = this.onMouseDown;
          newChildProps.onTouchStart = this.onTouchStart;
        } else {
          newChildProps.onClick = this.createTwoChains('onClick');
          newChildProps.onMouseDown = this.createTwoChains('onMouseDown');
          newChildProps.onTouchStart = this.createTwoChains('onTouchStart');
        } // >>> Hover(enter)


        if (this.isMouseEnterToShow()) {
          newChildProps.onMouseEnter = this.onMouseEnter; // Point align

          if (alignPoint) {
            newChildProps.onMouseMove = this.onMouseMove;
          }
        } else {
          newChildProps.onMouseEnter = this.createTwoChains('onMouseEnter');
        } // >>> Hover(leave)


        if (this.isMouseLeaveToHide()) {
          newChildProps.onMouseLeave = this.onMouseLeave;
        } else {
          newChildProps.onMouseLeave = this.createTwoChains('onMouseLeave');
        } // >>> Focus


        if (this.isFocusToShow() || this.isBlurToHide()) {
          newChildProps.onFocus = this.onFocus;
          newChildProps.onBlur = this.onBlur;
        } else {
          newChildProps.onFocus = this.createTwoChains('onFocus');
          newChildProps.onBlur = this.createTwoChains('onBlur');
        } // =================================== Render ===================================


        var childrenClassName = classnames_default()(child && child.props && child.props.className, className);

        if (childrenClassName) {
          newChildProps.className = childrenClassName;
        }

        var cloneProps = (0,objectSpread2/* default */.Z)({}, newChildProps);

        if ((0,es_ref/* supportRef */.Yr)(child)) {
          cloneProps.ref = (0,es_ref/* composeRef */.sQ)(this.triggerRef, child.ref);
        }

        var trigger = /*#__PURE__*/external_React_.cloneElement(child, cloneProps);
        var portal; // prevent unmounting after it's rendered

        if (popupVisible || this.popupRef.current || forceRender) {
          portal = /*#__PURE__*/external_React_.createElement(PortalComponent, {
            key: "portal",
            getContainer: this.getContainer,
            didUpdate: this.handlePortalUpdate
          }, this.getComponent());
        }

        if (!popupVisible && autoDestroy) {
          portal = null;
        }

        return /*#__PURE__*/external_React_.createElement(context.Provider, {
          value: this.triggerContextValue
        }, trigger, portal);
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(_ref, prevState) {
        var popupVisible = _ref.popupVisible;
        var newState = {};

        if (popupVisible !== undefined && prevState.popupVisible !== popupVisible) {
          newState.popupVisible = popupVisible;
          newState.prevPopupVisible = prevState.popupVisible;
        }

        return newState;
      }
    }]);

    return Trigger;
  }(external_React_.Component);

  Trigger.contextType = context;
  Trigger.defaultProps = {
    prefixCls: 'rc-trigger-popup',
    getPopupClassNameFromAlign: returnEmptyString,
    getDocument: returnDocument,
    onPopupVisibleChange: noop,
    afterPopupVisibleChange: noop,
    onPopupAlign: noop,
    popupClassName: '',
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0.1,
    focusDelay: 0,
    blurDelay: 0.15,
    popupStyle: {},
    destroyPopupOnHide: false,
    popupAlign: {},
    defaultPopupVisible: false,
    mask: false,
    maskClosable: true,
    action: [],
    showAction: [],
    hideAction: [],
    autoDestroy: false
  };
  return Trigger;
}
/* harmony default export */ const rc_trigger_es = (generateTrigger(es_Portal));
;// CONCATENATED MODULE: ./node_modules/rc-select/es/SelectTrigger.js








var getBuiltInPlacements = function getBuiltInPlacements(dropdownMatchSelectWidth) {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  var adjustX = typeof dropdownMatchSelectWidth !== 'number' ? 0 : 1;
  return {
    bottomLeft: {
      points: ['tl', 'bl'],
      offset: [0, 4],
      overflow: {
        adjustX: adjustX,
        adjustY: 1
      }
    },
    bottomRight: {
      points: ['tr', 'br'],
      offset: [0, 4],
      overflow: {
        adjustX: adjustX,
        adjustY: 1
      }
    },
    topLeft: {
      points: ['bl', 'tl'],
      offset: [0, -4],
      overflow: {
        adjustX: adjustX,
        adjustY: 1
      }
    },
    topRight: {
      points: ['br', 'tr'],
      offset: [0, -4],
      overflow: {
        adjustX: adjustX,
        adjustY: 1
      }
    }
  };
};

var SelectTrigger = function SelectTrigger(props, ref) {
  var prefixCls = props.prefixCls,
      disabled = props.disabled,
      visible = props.visible,
      children = props.children,
      popupElement = props.popupElement,
      containerWidth = props.containerWidth,
      animation = props.animation,
      transitionName = props.transitionName,
      dropdownStyle = props.dropdownStyle,
      dropdownClassName = props.dropdownClassName,
      _props$direction = props.direction,
      direction = _props$direction === void 0 ? 'ltr' : _props$direction,
      _props$dropdownMatchS = props.dropdownMatchSelectWidth,
      dropdownMatchSelectWidth = _props$dropdownMatchS === void 0 ? true : _props$dropdownMatchS,
      dropdownRender = props.dropdownRender,
      dropdownAlign = props.dropdownAlign,
      getPopupContainer = props.getPopupContainer,
      empty = props.empty,
      getTriggerDOMNode = props.getTriggerDOMNode,
      onPopupVisibleChange = props.onPopupVisibleChange,
      restProps = (0,objectWithoutProperties/* default */.Z)(props, ["prefixCls", "disabled", "visible", "children", "popupElement", "containerWidth", "animation", "transitionName", "dropdownStyle", "dropdownClassName", "direction", "dropdownMatchSelectWidth", "dropdownRender", "dropdownAlign", "getPopupContainer", "empty", "getTriggerDOMNode", "onPopupVisibleChange"]);

  var dropdownPrefixCls = "".concat(prefixCls, "-dropdown");
  var popupNode = popupElement;

  if (dropdownRender) {
    popupNode = dropdownRender(popupElement);
  }

  var builtInPlacements = external_React_.useMemo(function () {
    return getBuiltInPlacements(dropdownMatchSelectWidth);
  }, [dropdownMatchSelectWidth]); // ===================== Motion ======================

  var mergedTransitionName = animation ? "".concat(dropdownPrefixCls, "-").concat(animation) : transitionName; // ======================= Ref =======================

  var popupRef = external_React_.useRef(null);
  external_React_.useImperativeHandle(ref, function () {
    return {
      getPopupElement: function getPopupElement() {
        return popupRef.current;
      }
    };
  });

  var popupStyle = (0,objectSpread2/* default */.Z)({
    minWidth: containerWidth
  }, dropdownStyle);

  if (typeof dropdownMatchSelectWidth === 'number') {
    popupStyle.width = dropdownMatchSelectWidth;
  } else if (dropdownMatchSelectWidth) {
    popupStyle.width = containerWidth;
  }

  return /*#__PURE__*/external_React_.createElement(rc_trigger_es, (0,esm_extends/* default */.Z)({}, restProps, {
    showAction: onPopupVisibleChange ? ['click'] : [],
    hideAction: onPopupVisibleChange ? ['click'] : [],
    popupPlacement: direction === 'rtl' ? 'bottomRight' : 'bottomLeft',
    builtinPlacements: builtInPlacements,
    prefixCls: dropdownPrefixCls,
    popupTransitionName: mergedTransitionName,
    popup: /*#__PURE__*/external_React_.createElement("div", {
      ref: popupRef
    }, popupNode),
    popupAlign: dropdownAlign,
    popupVisible: visible,
    getPopupContainer: getPopupContainer,
    popupClassName: classnames_default()(dropdownClassName, (0,defineProperty/* default */.Z)({}, "".concat(dropdownPrefixCls, "-empty"), empty)),
    popupStyle: popupStyle,
    getTriggerDOMNode: getTriggerDOMNode,
    onPopupVisibleChange: onPopupVisibleChange
  }), children);
};

var RefSelectTrigger = /*#__PURE__*/external_React_.forwardRef(SelectTrigger);
RefSelectTrigger.displayName = 'SelectTrigger';
/* harmony default export */ const es_SelectTrigger = (RefSelectTrigger);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/interface/generator.js
var INTERNAL_PROPS_MARK = 'RC_SELECT_INTERNAL_PROPS_MARK';
;// CONCATENATED MODULE: ./node_modules/rc-select/es/hooks/useDelayReset.js


/**
 * Similar with `useLock`, but this hook will always execute last value.
 * When set to `true`, it will keep `true` for a short time even if `false` is set.
 */

function useDelayReset() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

  var _React$useState = external_React_.useState(false),
      _React$useState2 = (0,slicedToArray/* default */.Z)(_React$useState, 2),
      bool = _React$useState2[0],
      setBool = _React$useState2[1];

  var delayRef = external_React_.useRef(null);

  var cancelLatest = function cancelLatest() {
    window.clearTimeout(delayRef.current);
  };

  external_React_.useEffect(function () {
    return cancelLatest;
  }, []);

  var delaySetBool = function delaySetBool(value, callback) {
    cancelLatest();
    delayRef.current = window.setTimeout(function () {
      setBool(value);

      if (callback) {
        callback();
      }
    }, timeout);
  };

  return [bool, delaySetBool, cancelLatest];
}
;// CONCATENATED MODULE: ./node_modules/rc-select/es/hooks/useSelectTriggerControl.js

function useSelectTriggerControl(elements, open, triggerOpen) {
  var propsRef = external_React_.useRef(null);
  propsRef.current = {
    open: open,
    triggerOpen: triggerOpen
  };
  external_React_.useEffect(function () {
    function onGlobalMouseDown(event) {
      var target = event.target;

      if (target.shadowRoot && event.composed) {
        target = event.composedPath()[0] || target;
      }

      if (propsRef.current.open && elements().filter(function (element) {
        return element;
      }).every(function (element) {
        return !element.contains(target) && element !== target;
      })) {
        // Should trigger close
        propsRef.current.triggerOpen(false);
      }
    }

    window.addEventListener('mousedown', onGlobalMouseDown);
    return function () {
      return window.removeEventListener('mousedown', onGlobalMouseDown);
    };
  }, []);
}
;// CONCATENATED MODULE: ./node_modules/rc-select/es/hooks/useCacheDisplayValue.js


function useCacheDisplayValue(values) {
  var prevValuesRef = external_React_.useRef(values);
  var mergedValues = external_React_.useMemo(function () {
    // Create value - label map
    var valueLabels = new Map();
    prevValuesRef.current.forEach(function (_ref) {
      var value = _ref.value,
          label = _ref.label;

      if (value !== label) {
        valueLabels.set(value, label);
      }
    });
    var resultValues = values.map(function (item) {
      var cacheLabel = valueLabels.get(item.value);

      if (item.isCacheable && cacheLabel) {
        return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, item), {}, {
          label: cacheLabel
        });
      }

      return item;
    });
    prevValuesRef.current = resultValues;
    return resultValues;
  }, [values]);
  return mergedValues;
}
;// CONCATENATED MODULE: ./node_modules/rc-select/es/hooks/useCacheOptions.js

function useCacheOptions(options) {
  var prevOptionMapRef = external_React_.useRef(null);
  var optionMap = external_React_.useMemo(function () {
    var map = new Map();
    options.forEach(function (item) {
      var value = item.data.value;
      map.set(value, item);
    });
    return map;
  }, [options]);
  prevOptionMapRef.current = optionMap;

  var getValueOption = function getValueOption(vals) {
    return vals.map(function (value) {
      return prevOptionMapRef.current.get(value);
    }).filter(Boolean);
  };

  return getValueOption;
}
;// CONCATENATED MODULE: ./node_modules/rc-select/es/generate.js






/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 */




















var DEFAULT_OMIT_PROPS = ['removeIcon', 'placeholder', 'autoFocus', 'maxTagCount', 'maxTagTextLength', 'maxTagPlaceholder', 'choiceTransitionName', 'onInputKeyDown', 'tabIndex'];
/**
 * This function is in internal usage.
 * Do not use it in your prod env since we may refactor this.
 */

function generateSelector(config) {
  var defaultPrefixCls = config.prefixCls,
      OptionList = config.components.optionList,
      convertChildrenToData = config.convertChildrenToData,
      flattenOptions = config.flattenOptions,
      getLabeledValue = config.getLabeledValue,
      filterOptions = config.filterOptions,
      isValueDisabled = config.isValueDisabled,
      findValueOption = config.findValueOption,
      warningProps = config.warningProps,
      fillOptionsWithMissingValue = config.fillOptionsWithMissingValue,
      omitDOMProps = config.omitDOMProps; // Use raw define since `React.FC` not support generic

  function Select(props, ref) {
    var _classNames2;

    var _props$prefixCls = props.prefixCls,
        prefixCls = _props$prefixCls === void 0 ? defaultPrefixCls : _props$prefixCls,
        className = props.className,
        id = props.id,
        open = props.open,
        defaultOpen = props.defaultOpen,
        options = props.options,
        children = props.children,
        mode = props.mode,
        value = props.value,
        defaultValue = props.defaultValue,
        labelInValue = props.labelInValue,
        showSearch = props.showSearch,
        inputValue = props.inputValue,
        searchValue = props.searchValue,
        filterOption = props.filterOption,
        filterSort = props.filterSort,
        _props$optionFilterPr = props.optionFilterProp,
        optionFilterProp = _props$optionFilterPr === void 0 ? 'value' : _props$optionFilterPr,
        _props$autoClearSearc = props.autoClearSearchValue,
        autoClearSearchValue = _props$autoClearSearc === void 0 ? true : _props$autoClearSearc,
        onSearch = props.onSearch,
        allowClear = props.allowClear,
        clearIcon = props.clearIcon,
        showArrow = props.showArrow,
        inputIcon = props.inputIcon,
        menuItemSelectedIcon = props.menuItemSelectedIcon,
        disabled = props.disabled,
        loading = props.loading,
        defaultActiveFirstOption = props.defaultActiveFirstOption,
        _props$notFoundConten = props.notFoundContent,
        notFoundContent = _props$notFoundConten === void 0 ? 'Not Found' : _props$notFoundConten,
        optionLabelProp = props.optionLabelProp,
        backfill = props.backfill,
        tabIndex = props.tabIndex,
        getInputElement = props.getInputElement,
        getRawInputElement = props.getRawInputElement,
        getPopupContainer = props.getPopupContainer,
        _props$listHeight = props.listHeight,
        listHeight = _props$listHeight === void 0 ? 200 : _props$listHeight,
        _props$listItemHeight = props.listItemHeight,
        listItemHeight = _props$listItemHeight === void 0 ? 20 : _props$listItemHeight,
        animation = props.animation,
        transitionName = props.transitionName,
        virtual = props.virtual,
        dropdownStyle = props.dropdownStyle,
        dropdownClassName = props.dropdownClassName,
        dropdownMatchSelectWidth = props.dropdownMatchSelectWidth,
        dropdownRender = props.dropdownRender,
        dropdownAlign = props.dropdownAlign,
        _props$showAction = props.showAction,
        showAction = _props$showAction === void 0 ? [] : _props$showAction,
        direction = props.direction,
        tokenSeparators = props.tokenSeparators,
        tagRender = props.tagRender,
        onPopupScroll = props.onPopupScroll,
        onDropdownVisibleChange = props.onDropdownVisibleChange,
        onFocus = props.onFocus,
        onBlur = props.onBlur,
        onKeyUp = props.onKeyUp,
        onKeyDown = props.onKeyDown,
        onMouseDown = props.onMouseDown,
        onChange = props.onChange,
        onSelect = props.onSelect,
        onDeselect = props.onDeselect,
        onClear = props.onClear,
        _props$internalProps = props.internalProps,
        internalProps = _props$internalProps === void 0 ? {} : _props$internalProps,
        restProps = (0,objectWithoutProperties/* default */.Z)(props, ["prefixCls", "className", "id", "open", "defaultOpen", "options", "children", "mode", "value", "defaultValue", "labelInValue", "showSearch", "inputValue", "searchValue", "filterOption", "filterSort", "optionFilterProp", "autoClearSearchValue", "onSearch", "allowClear", "clearIcon", "showArrow", "inputIcon", "menuItemSelectedIcon", "disabled", "loading", "defaultActiveFirstOption", "notFoundContent", "optionLabelProp", "backfill", "tabIndex", "getInputElement", "getRawInputElement", "getPopupContainer", "listHeight", "listItemHeight", "animation", "transitionName", "virtual", "dropdownStyle", "dropdownClassName", "dropdownMatchSelectWidth", "dropdownRender", "dropdownAlign", "showAction", "direction", "tokenSeparators", "tagRender", "onPopupScroll", "onDropdownVisibleChange", "onFocus", "onBlur", "onKeyUp", "onKeyDown", "onMouseDown", "onChange", "onSelect", "onDeselect", "onClear", "internalProps"]);

    var useInternalProps = internalProps.mark === INTERNAL_PROPS_MARK;
    var domProps = omitDOMProps ? omitDOMProps(restProps) : restProps;
    DEFAULT_OMIT_PROPS.forEach(function (prop) {
      delete domProps[prop];
    });
    var containerRef = (0,external_React_.useRef)(null);
    var triggerRef = (0,external_React_.useRef)(null);
    var selectorRef = (0,external_React_.useRef)(null);
    var listRef = (0,external_React_.useRef)(null);
    var tokenWithEnter = (0,external_React_.useMemo)(function () {
      return (tokenSeparators || []).some(function (tokenSeparator) {
        return ['\n', '\r\n'].includes(tokenSeparator);
      });
    }, [tokenSeparators]);
    /** Used for component focused management */

    var _useDelayReset = useDelayReset(),
        _useDelayReset2 = (0,slicedToArray/* default */.Z)(_useDelayReset, 3),
        mockFocused = _useDelayReset2[0],
        setMockFocused = _useDelayReset2[1],
        cancelSetMockFocused = _useDelayReset2[2]; // Inner id for accessibility usage. Only work in client side


    var _useState = (0,external_React_.useState)(),
        _useState2 = (0,slicedToArray/* default */.Z)(_useState, 2),
        innerId = _useState2[0],
        setInnerId = _useState2[1];

    (0,external_React_.useEffect)(function () {
      setInnerId("rc_select_".concat(getUUID()));
    }, []);
    var mergedId = id || innerId; // optionLabelProp

    var mergedOptionLabelProp = optionLabelProp;

    if (mergedOptionLabelProp === undefined) {
      mergedOptionLabelProp = options ? 'label' : 'children';
    } // labelInValue


    var mergedLabelInValue = mode === 'combobox' ? false : labelInValue;
    var isMultiple = mode === 'tags' || mode === 'multiple';
    var mergedShowSearch = showSearch !== undefined ? showSearch : isMultiple || mode === 'combobox'; // ======================== Mobile ========================

    var _useState3 = (0,external_React_.useState)(false),
        _useState4 = (0,slicedToArray/* default */.Z)(_useState3, 2),
        mobile = _useState4[0],
        setMobile = _useState4[1];

    (0,external_React_.useEffect)(function () {
      // Only update on the client side
      setMobile(isMobile());
    }, []); // ============================== Ref ===============================

    var selectorDomRef = (0,external_React_.useRef)(null);
    external_React_.useImperativeHandle(ref, function () {
      var _selectorRef$current, _selectorRef$current2, _listRef$current;

      return {
        focus: (_selectorRef$current = selectorRef.current) === null || _selectorRef$current === void 0 ? void 0 : _selectorRef$current.focus,
        blur: (_selectorRef$current2 = selectorRef.current) === null || _selectorRef$current2 === void 0 ? void 0 : _selectorRef$current2.blur,
        scrollTo: (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.scrollTo
      };
    }); // ============================= Value ==============================

    var _useMergedState = useControlledState(defaultValue, {
      value: value
    }),
        _useMergedState2 = (0,slicedToArray/* default */.Z)(_useMergedState, 2),
        mergedValue = _useMergedState2[0],
        setMergedValue = _useMergedState2[1];
    /** Unique raw values */


    var _useMemo = (0,external_React_.useMemo)(function () {
      return toInnerValue(mergedValue, {
        labelInValue: mergedLabelInValue,
        combobox: mode === 'combobox'
      });
    }, [mergedValue, mergedLabelInValue]),
        _useMemo2 = (0,slicedToArray/* default */.Z)(_useMemo, 2),
        mergedRawValue = _useMemo2[0],
        mergedValueMap = _useMemo2[1];
    /** We cache a set of raw values to speed up check */


    var rawValues = (0,external_React_.useMemo)(function () {
      return new Set(mergedRawValue);
    }, [mergedRawValue]); // ============================= Option =============================
    // Set by option list active, it will merge into search input when mode is `combobox`

    var _useState5 = (0,external_React_.useState)(null),
        _useState6 = (0,slicedToArray/* default */.Z)(_useState5, 2),
        activeValue = _useState6[0],
        setActiveValue = _useState6[1];

    var _useState7 = (0,external_React_.useState)(''),
        _useState8 = (0,slicedToArray/* default */.Z)(_useState7, 2),
        innerSearchValue = _useState8[0],
        setInnerSearchValue = _useState8[1];

    var mergedSearchValue = innerSearchValue;

    if (mode === 'combobox' && mergedValue !== undefined) {
      mergedSearchValue = mergedValue;
    } else if (searchValue !== undefined) {
      mergedSearchValue = searchValue;
    } else if (inputValue) {
      mergedSearchValue = inputValue;
    }

    var mergedOptions = (0,external_React_.useMemo)(function () {
      var newOptions = options;

      if (newOptions === undefined) {
        newOptions = convertChildrenToData(children);
      }
      /**
       * `tags` should fill un-list item.
       * This is not cool here since TreeSelect do not need this
       */


      if (mode === 'tags' && fillOptionsWithMissingValue) {
        newOptions = fillOptionsWithMissingValue(newOptions, mergedValue, mergedOptionLabelProp, labelInValue);
      }

      return newOptions || [];
    }, [options, children, mode, mergedValue]);
    var mergedFlattenOptions = (0,external_React_.useMemo)(function () {
      return flattenOptions(mergedOptions, props);
    }, [mergedOptions]);
    var getValueOption = useCacheOptions(mergedFlattenOptions); // Display options for OptionList

    var displayOptions = (0,external_React_.useMemo)(function () {
      if (!mergedSearchValue || !mergedShowSearch) {
        return (0,toConsumableArray/* default */.Z)(mergedOptions);
      }

      var filteredOptions = filterOptions(mergedSearchValue, mergedOptions, {
        optionFilterProp: optionFilterProp,
        filterOption: mode === 'combobox' && filterOption === undefined ? function () {
          return true;
        } : filterOption
      });

      if (mode === 'tags' && filteredOptions.every(function (opt) {
        return opt[optionFilterProp] !== mergedSearchValue;
      })) {
        filteredOptions.unshift({
          value: mergedSearchValue,
          label: mergedSearchValue,
          key: '__RC_SELECT_TAG_PLACEHOLDER__'
        });
      }

      if (filterSort && Array.isArray(filteredOptions)) {
        return (0,toConsumableArray/* default */.Z)(filteredOptions).sort(filterSort);
      }

      return filteredOptions;
    }, [mergedOptions, mergedSearchValue, mode, mergedShowSearch, filterSort]);
    var displayFlattenOptions = (0,external_React_.useMemo)(function () {
      return flattenOptions(displayOptions, props);
    }, [displayOptions]);
    (0,external_React_.useEffect)(function () {
      if (listRef.current && listRef.current.scrollTo) {
        listRef.current.scrollTo(0);
      }
    }, [mergedSearchValue]); // ============================ Selector ============================

    var displayValues = (0,external_React_.useMemo)(function () {
      var tmpValues = mergedRawValue.map(function (val) {
        var valueOptions = getValueOption([val]);
        var displayValue = getLabeledValue(val, {
          options: valueOptions,
          prevValueMap: mergedValueMap,
          labelInValue: mergedLabelInValue,
          optionLabelProp: mergedOptionLabelProp
        });
        return (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, displayValue), {}, {
          disabled: isValueDisabled(val, valueOptions)
        });
      });

      if (!mode && tmpValues.length === 1 && tmpValues[0].value === null && tmpValues[0].label === null) {
        return [];
      }

      return tmpValues;
    }, [mergedValue, mergedOptions, mode]); // Polyfill with cache label

    displayValues = useCacheDisplayValue(displayValues);

    var triggerSelect = function triggerSelect(newValue, isSelect, source) {
      var newValueOption = getValueOption([newValue]);
      var outOption = findValueOption([newValue], newValueOption)[0];

      if (!internalProps.skipTriggerSelect) {
        // Skip trigger `onSelect` or `onDeselect` if configured
        var selectValue = mergedLabelInValue ? getLabeledValue(newValue, {
          options: newValueOption,
          prevValueMap: mergedValueMap,
          labelInValue: mergedLabelInValue,
          optionLabelProp: mergedOptionLabelProp
        }) : newValue;

        if (isSelect && onSelect) {
          onSelect(selectValue, outOption);
        } else if (!isSelect && onDeselect) {
          onDeselect(selectValue, outOption);
        }
      } // Trigger internal event


      if (useInternalProps) {
        if (isSelect && internalProps.onRawSelect) {
          internalProps.onRawSelect(newValue, outOption, source);
        } else if (!isSelect && internalProps.onRawDeselect) {
          internalProps.onRawDeselect(newValue, outOption, source);
        }
      }
    }; // We need cache options here in case user update the option list


    var _useState9 = (0,external_React_.useState)([]),
        _useState10 = (0,slicedToArray/* default */.Z)(_useState9, 2),
        prevValueOptions = _useState10[0],
        setPrevValueOptions = _useState10[1];

    var triggerChange = function triggerChange(newRawValues) {
      if (useInternalProps && internalProps.skipTriggerChange) {
        return;
      }

      var newRawValuesOptions = getValueOption(newRawValues);
      var outValues = toOuterValues(Array.from(newRawValues), {
        labelInValue: mergedLabelInValue,
        options: newRawValuesOptions,
        getLabeledValue: getLabeledValue,
        prevValueMap: mergedValueMap,
        optionLabelProp: mergedOptionLabelProp
      });
      var outValue = isMultiple ? outValues : outValues[0]; // Skip trigger if prev & current value is both empty

      if (onChange && (mergedRawValue.length !== 0 || outValues.length !== 0)) {
        var outOptions = findValueOption(newRawValues, newRawValuesOptions, {
          prevValueOptions: prevValueOptions
        }); // We will cache option in case it removed by ajax

        setPrevValueOptions(outOptions.map(function (option, index) {
          var clone = (0,objectSpread2/* default */.Z)({}, option);

          Object.defineProperty(clone, '_INTERNAL_OPTION_VALUE_', {
            get: function get() {
              return newRawValues[index];
            }
          });
          return clone;
        }));
        onChange(outValue, isMultiple ? outOptions : outOptions[0]);
      }

      setMergedValue(outValue);
    };

    var onInternalSelect = function onInternalSelect(newValue, _ref) {
      var selected = _ref.selected,
          source = _ref.source;

      if (disabled) {
        return;
      }

      var newRawValue;

      if (isMultiple) {
        newRawValue = new Set(mergedRawValue);

        if (selected) {
          newRawValue.add(newValue);
        } else {
          newRawValue.delete(newValue);
        }
      } else {
        newRawValue = new Set();
        newRawValue.add(newValue);
      } // Multiple always trigger change and single should change if value changed


      if (isMultiple || !isMultiple && Array.from(mergedRawValue)[0] !== newValue) {
        triggerChange(Array.from(newRawValue));
      } // Trigger `onSelect`. Single mode always trigger select


      triggerSelect(newValue, !isMultiple || selected, source); // Clean search value if single or configured

      if (mode === 'combobox') {
        setInnerSearchValue(String(newValue));
        setActiveValue('');
      } else if (!isMultiple || autoClearSearchValue) {
        setInnerSearchValue('');
        setActiveValue('');
      }
    };

    var onInternalOptionSelect = function onInternalOptionSelect(newValue, info) {
      onInternalSelect(newValue, (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, info), {}, {
        source: 'option'
      }));
    };

    var onInternalSelectionSelect = function onInternalSelectionSelect(newValue, info) {
      onInternalSelect(newValue, (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, info), {}, {
        source: 'selection'
      }));
    }; // ============================= Input ==============================
    // Only works in `combobox`


    var customizeInputElement = mode === 'combobox' && typeof getInputElement === 'function' && getInputElement() || null; // Used for customize replacement for `rc-cascader`

    var customizeRawInputElement = typeof getRawInputElement === 'function' && getRawInputElement(); // ============================== Open ==============================

    var _useMergedState3 = useControlledState(undefined, {
      defaultValue: defaultOpen,
      value: open
    }),
        _useMergedState4 = (0,slicedToArray/* default */.Z)(_useMergedState3, 2),
        innerOpen = _useMergedState4[0],
        setInnerOpen = _useMergedState4[1];

    var mergedOpen = innerOpen; // Not trigger `open` in `combobox` when `notFoundContent` is empty

    var emptyListContent = !notFoundContent && !displayOptions.length;

    if (disabled || emptyListContent && mergedOpen && mode === 'combobox') {
      mergedOpen = false;
    }

    var triggerOpen = emptyListContent ? false : mergedOpen;

    var onToggleOpen = function onToggleOpen(newOpen) {
      var nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;

      if (innerOpen !== nextOpen && !disabled) {
        setInnerOpen(nextOpen);

        if (onDropdownVisibleChange) {
          onDropdownVisibleChange(nextOpen);
        }
      }
    }; // Used for raw custom input trigger


    var onTriggerVisibleChange;

    if (customizeRawInputElement) {
      onTriggerVisibleChange = function onTriggerVisibleChange(newOpen) {
        onToggleOpen(newOpen);
      };
    }

    useSelectTriggerControl(function () {
      var _triggerRef$current;

      return [containerRef.current, (_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 ? void 0 : _triggerRef$current.getPopupElement()];
    }, triggerOpen, onToggleOpen); // ============================= Search =============================

    var triggerSearch = function triggerSearch(searchText, fromTyping, isCompositing) {
      var ret = true;
      var newSearchText = searchText;
      setActiveValue(null); // Check if match the `tokenSeparators`

      var patchLabels = isCompositing ? null : getSeparatedContent(searchText, tokenSeparators);
      var patchRawValues = patchLabels;

      if (mode === 'combobox') {
        // Only typing will trigger onChange
        if (fromTyping) {
          triggerChange([newSearchText]);
        }
      } else if (patchLabels) {
        newSearchText = '';

        if (mode !== 'tags') {
          patchRawValues = patchLabels.map(function (label) {
            var item = mergedFlattenOptions.find(function (_ref2) {
              var data = _ref2.data;
              return data[mergedOptionLabelProp] === label;
            });
            return item ? item.data.value : null;
          }).filter(function (val) {
            return val !== null;
          });
        }

        var newRawValues = Array.from(new Set([].concat((0,toConsumableArray/* default */.Z)(mergedRawValue), (0,toConsumableArray/* default */.Z)(patchRawValues))));
        triggerChange(newRawValues);
        newRawValues.forEach(function (newRawValue) {
          triggerSelect(newRawValue, true, 'input');
        }); // Should close when paste finish

        onToggleOpen(false); // Tell Selector that break next actions

        ret = false;
      }

      setInnerSearchValue(newSearchText);

      if (onSearch && mergedSearchValue !== newSearchText) {
        onSearch(newSearchText);
      }

      return ret;
    }; // Only triggered when menu is closed & mode is tags
    // If menu is open, OptionList will take charge
    // If mode isn't tags, press enter is not meaningful when you can't see any option


    var onSearchSubmit = function onSearchSubmit(searchText) {
      // prevent empty tags from appearing when you click the Enter button
      if (!searchText || !searchText.trim()) {
        return;
      }

      var newRawValues = Array.from(new Set([].concat((0,toConsumableArray/* default */.Z)(mergedRawValue), [searchText])));
      triggerChange(newRawValues);
      newRawValues.forEach(function (newRawValue) {
        triggerSelect(newRawValue, true, 'input');
      });
      setInnerSearchValue('');
    }; // Close dropdown when disabled change


    (0,external_React_.useEffect)(function () {
      if (innerOpen && !!disabled) {
        setInnerOpen(false);
      }
    }, [disabled]); // Close will clean up single mode search text

    (0,external_React_.useEffect)(function () {
      if (!mergedOpen && !isMultiple && mode !== 'combobox') {
        triggerSearch('', false, false);
      }
    }, [mergedOpen]); // ============================ Keyboard ============================

    /**
     * We record input value here to check if can press to clean up by backspace
     * - null: Key is not down, this is reset by key up
     * - true: Search text is empty when first time backspace down
     * - false: Search text is not empty when first time backspace down
     */

    var _useLock = useLock(),
        _useLock2 = (0,slicedToArray/* default */.Z)(_useLock, 2),
        getClearLock = _useLock2[0],
        setClearLock = _useLock2[1]; // KeyDown


    var onInternalKeyDown = function onInternalKeyDown(event) {
      var clearLock = getClearLock();
      var which = event.which;

      if (which === es_KeyCode.ENTER) {
        // Do not submit form when type in the input
        if (mode !== 'combobox') {
          event.preventDefault();
        } // We only manage open state here, close logic should handle by list component


        if (!mergedOpen) {
          onToggleOpen(true);
        }
      }

      setClearLock(!!mergedSearchValue); // Remove value by `backspace`

      if (which === es_KeyCode.BACKSPACE && !clearLock && isMultiple && !mergedSearchValue && mergedRawValue.length) {
        var removeInfo = removeLastEnabledValue(displayValues, mergedRawValue);

        if (removeInfo.removedValue !== null) {
          triggerChange(removeInfo.values);
          triggerSelect(removeInfo.removedValue, false, 'input');
        }
      }

      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      if (mergedOpen && listRef.current) {
        var _listRef$current2;

        (_listRef$current2 = listRef.current).onKeyDown.apply(_listRef$current2, [event].concat(rest));
      }

      if (onKeyDown) {
        onKeyDown.apply(void 0, [event].concat(rest));
      }
    }; // KeyUp


    var onInternalKeyUp = function onInternalKeyUp(event) {
      for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }

      if (mergedOpen && listRef.current) {
        var _listRef$current3;

        (_listRef$current3 = listRef.current).onKeyUp.apply(_listRef$current3, [event].concat(rest));
      }

      if (onKeyUp) {
        onKeyUp.apply(void 0, [event].concat(rest));
      }
    }; // ========================== Focus / Blur ==========================

    /** Record real focus status */


    var focusRef = (0,external_React_.useRef)(false);

    var onContainerFocus = function onContainerFocus() {
      setMockFocused(true);

      if (!disabled) {
        if (onFocus && !focusRef.current) {
          onFocus.apply(void 0, arguments);
        } // `showAction` should handle `focus` if set


        if (showAction.includes('focus')) {
          onToggleOpen(true);
        }
      }

      focusRef.current = true;
    };

    var onContainerBlur = function onContainerBlur() {
      setMockFocused(false, function () {
        focusRef.current = false;
        onToggleOpen(false);
      });

      if (disabled) {
        return;
      }

      if (mergedSearchValue) {
        // `tags` mode should move `searchValue` into values
        if (mode === 'tags') {
          triggerSearch('', false, false);
          triggerChange(Array.from(new Set([].concat((0,toConsumableArray/* default */.Z)(mergedRawValue), [mergedSearchValue]))));
        } else if (mode === 'multiple') {
          // `multiple` mode only clean the search value but not trigger event
          setInnerSearchValue('');
        }
      }

      if (onBlur) {
        onBlur.apply(void 0, arguments);
      }
    };

    var activeTimeoutIds = [];
    (0,external_React_.useEffect)(function () {
      return function () {
        activeTimeoutIds.forEach(function (timeoutId) {
          return clearTimeout(timeoutId);
        });
        activeTimeoutIds.splice(0, activeTimeoutIds.length);
      };
    }, []);

    var onInternalMouseDown = function onInternalMouseDown(event) {
      var _triggerRef$current2;

      var target = event.target;
      var popupElement = (_triggerRef$current2 = triggerRef.current) === null || _triggerRef$current2 === void 0 ? void 0 : _triggerRef$current2.getPopupElement(); // We should give focus back to selector if clicked item is not focusable

      if (popupElement && popupElement.contains(target)) {
        var timeoutId = setTimeout(function () {
          var index = activeTimeoutIds.indexOf(timeoutId);

          if (index !== -1) {
            activeTimeoutIds.splice(index, 1);
          }

          cancelSetMockFocused();

          if (!mobile && !popupElement.contains(document.activeElement)) {
            var _selectorRef$current3;

            (_selectorRef$current3 = selectorRef.current) === null || _selectorRef$current3 === void 0 ? void 0 : _selectorRef$current3.focus();
          }
        });
        activeTimeoutIds.push(timeoutId);
      }

      if (onMouseDown) {
        for (var _len3 = arguments.length, restArgs = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          restArgs[_key3 - 1] = arguments[_key3];
        }

        onMouseDown.apply(void 0, [event].concat(restArgs));
      }
    }; // ========================= Accessibility ==========================


    var _useState11 = (0,external_React_.useState)(0),
        _useState12 = (0,slicedToArray/* default */.Z)(_useState11, 2),
        accessibilityIndex = _useState12[0],
        setAccessibilityIndex = _useState12[1];

    var mergedDefaultActiveFirstOption = defaultActiveFirstOption !== undefined ? defaultActiveFirstOption : mode !== 'combobox';

    var onActiveValue = function onActiveValue(active, index) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref3$source = _ref3.source,
          source = _ref3$source === void 0 ? 'keyboard' : _ref3$source;

      setAccessibilityIndex(index);

      if (backfill && mode === 'combobox' && active !== null && source === 'keyboard') {
        setActiveValue(String(active));
      }
    }; // ============================= Popup ==============================


    var _useState13 = (0,external_React_.useState)(null),
        _useState14 = (0,slicedToArray/* default */.Z)(_useState13, 2),
        containerWidth = _useState14[0],
        setContainerWidth = _useState14[1];

    var _useState15 = (0,external_React_.useState)({}),
        _useState16 = (0,slicedToArray/* default */.Z)(_useState15, 2),
        forceUpdate = _useState16[1]; // We need force update here since popup dom is render async


    function onPopupMouseEnter() {
      forceUpdate({});
    }

    useLayoutEffect(function () {
      if (triggerOpen) {
        var _containerRef$current;

        var newWidth = Math.ceil((_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.offsetWidth);

        if (containerWidth !== newWidth && !Number.isNaN(newWidth)) {
          setContainerWidth(newWidth);
        }
      }
    }, [triggerOpen]);
    var popupNode = /*#__PURE__*/external_React_.createElement(OptionList, {
      ref: listRef,
      prefixCls: prefixCls,
      id: mergedId,
      open: mergedOpen,
      childrenAsData: !options,
      options: displayOptions,
      flattenOptions: displayFlattenOptions,
      multiple: isMultiple,
      values: rawValues,
      height: listHeight,
      itemHeight: listItemHeight,
      onSelect: onInternalOptionSelect,
      onToggleOpen: onToggleOpen,
      onActiveValue: onActiveValue,
      defaultActiveFirstOption: mergedDefaultActiveFirstOption,
      notFoundContent: notFoundContent,
      onScroll: onPopupScroll,
      searchValue: mergedSearchValue,
      menuItemSelectedIcon: menuItemSelectedIcon,
      virtual: virtual !== false && dropdownMatchSelectWidth !== false,
      onMouseEnter: onPopupMouseEnter
    }); // ============================= Clear ==============================

    var clearNode;

    var onClearMouseDown = function onClearMouseDown() {
      // Trigger internal `onClear` event
      if (useInternalProps && internalProps.onClear) {
        internalProps.onClear();
      }

      if (onClear) {
        onClear();
      }

      triggerChange([]);
      triggerSearch('', false, false);
    };

    if (!disabled && allowClear && (mergedRawValue.length || mergedSearchValue)) {
      clearNode = /*#__PURE__*/external_React_.createElement(es_TransBtn, {
        className: "".concat(prefixCls, "-clear"),
        onMouseDown: onClearMouseDown,
        customizeIcon: clearIcon
      }, "\xD7");
    } // ============================= Arrow ==============================


    var mergedShowArrow = showArrow !== undefined ? showArrow : loading || !isMultiple && mode !== 'combobox';
    var arrowNode;

    if (mergedShowArrow) {
      arrowNode = /*#__PURE__*/external_React_.createElement(es_TransBtn, {
        className: classnames_default()("".concat(prefixCls, "-arrow"), (0,defineProperty/* default */.Z)({}, "".concat(prefixCls, "-arrow-loading"), loading)),
        customizeIcon: inputIcon,
        customizeIconProps: {
          loading: loading,
          searchValue: mergedSearchValue,
          open: mergedOpen,
          focused: mockFocused,
          showSearch: mergedShowSearch
        }
      });
    } // ============================ Warning =============================


    if (false) {} // ============================= Render =============================


    var mergedClassName = classnames_default()(prefixCls, className, (_classNames2 = {}, (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-focused"), mockFocused), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-multiple"), isMultiple), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-single"), !isMultiple), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-allow-clear"), allowClear), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-show-arrow"), mergedShowArrow), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-disabled"), disabled), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-loading"), loading), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-open"), mergedOpen), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-customize-input"), customizeInputElement), (0,defineProperty/* default */.Z)(_classNames2, "".concat(prefixCls, "-show-search"), mergedShowSearch), _classNames2));
    var selectorNode = /*#__PURE__*/external_React_.createElement(es_SelectTrigger, {
      ref: triggerRef,
      disabled: disabled,
      prefixCls: prefixCls,
      visible: triggerOpen,
      popupElement: popupNode,
      containerWidth: containerWidth,
      animation: animation,
      transitionName: transitionName,
      dropdownStyle: dropdownStyle,
      dropdownClassName: dropdownClassName,
      direction: direction,
      dropdownMatchSelectWidth: dropdownMatchSelectWidth,
      dropdownRender: dropdownRender,
      dropdownAlign: dropdownAlign,
      getPopupContainer: getPopupContainer,
      empty: !mergedOptions.length,
      getTriggerDOMNode: function getTriggerDOMNode() {
        return selectorDomRef.current;
      },
      onPopupVisibleChange: onTriggerVisibleChange
    }, customizeRawInputElement ? /*#__PURE__*/external_React_.cloneElement(customizeRawInputElement, {
      ref: (0,es_ref/* composeRef */.sQ)(selectorDomRef, customizeRawInputElement.props.ref)
    }) : /*#__PURE__*/external_React_.createElement(es_Selector, (0,esm_extends/* default */.Z)({}, props, {
      domRef: selectorDomRef,
      prefixCls: prefixCls,
      inputElement: customizeInputElement,
      ref: selectorRef,
      id: mergedId,
      showSearch: mergedShowSearch,
      mode: mode,
      accessibilityIndex: accessibilityIndex,
      multiple: isMultiple,
      tagRender: tagRender,
      values: displayValues,
      open: mergedOpen,
      onToggleOpen: onToggleOpen,
      searchValue: mergedSearchValue,
      activeValue: activeValue,
      onSearch: triggerSearch,
      onSearchSubmit: onSearchSubmit,
      onSelect: onInternalSelectionSelect,
      tokenWithEnter: tokenWithEnter
    }))); // Render raw

    if (customizeRawInputElement) {
      return selectorNode;
    }

    return /*#__PURE__*/external_React_.createElement("div", (0,esm_extends/* default */.Z)({
      className: mergedClassName
    }, domProps, {
      ref: containerRef,
      onMouseDown: onInternalMouseDown,
      onKeyDown: onInternalKeyDown,
      onKeyUp: onInternalKeyUp,
      onFocus: onContainerFocus,
      onBlur: onContainerBlur
    }), mockFocused && !mergedOpen && /*#__PURE__*/external_React_.createElement("span", {
      style: {
        width: 0,
        height: 0,
        display: 'flex',
        overflow: 'hidden',
        opacity: 0
      },
      "aria-live": "polite"
    }, "".concat(mergedRawValue.join(', '))), selectorNode, arrowNode, clearNode);
  }

  var RefSelect = /*#__PURE__*/external_React_.forwardRef(Select);
  return RefSelect;
}
;// CONCATENATED MODULE: ./node_modules/rc-select/es/utils/warningPropsUtil.js







function warningProps(props) {
  var mode = props.mode,
      options = props.options,
      children = props.children,
      backfill = props.backfill,
      allowClear = props.allowClear,
      placeholder = props.placeholder,
      getInputElement = props.getInputElement,
      showSearch = props.showSearch,
      onSearch = props.onSearch,
      defaultOpen = props.defaultOpen,
      autoFocus = props.autoFocus,
      labelInValue = props.labelInValue,
      value = props.value,
      inputValue = props.inputValue,
      optionLabelProp = props.optionLabelProp;
  var multiple = mode === 'multiple' || mode === 'tags';
  var mergedShowSearch = showSearch !== undefined ? showSearch : multiple || mode === 'combobox';
  var mergedOptions = options || convertChildrenToData(children); // `tags` should not set option as disabled

  (0,warning/* default */.ZP)(mode !== 'tags' || mergedOptions.every(function (opt) {
    return !opt.disabled;
  }), 'Please avoid setting option to disabled in tags mode since user can always type text as tag.'); // `combobox` & `tags` should option be `string` type

  if (mode === 'tags' || mode === 'combobox') {
    var hasNumberValue = mergedOptions.some(function (item) {
      if (item.options) {
        return item.options.some(function (opt) {
          return typeof ('value' in opt ? opt.value : opt.key) === 'number';
        });
      }

      return typeof ('value' in item ? item.value : item.key) === 'number';
    });
    (0,warning/* default */.ZP)(!hasNumberValue, '`value` of Option should not use number type when `mode` is `tags` or `combobox`.');
  } // `combobox` should not use `optionLabelProp`


  (0,warning/* default */.ZP)(mode !== 'combobox' || !optionLabelProp, '`combobox` mode not support `optionLabelProp`. Please set `value` on Option directly.'); // Only `combobox` support `backfill`

  (0,warning/* default */.ZP)(mode === 'combobox' || !backfill, '`backfill` only works with `combobox` mode.'); // Only `combobox` support `getInputElement`

  (0,warning/* default */.ZP)(mode === 'combobox' || !getInputElement, '`getInputElement` only work with `combobox` mode.'); // Customize `getInputElement` should not use `allowClear` & `placeholder`

  (0,warning/* noteOnce */.ET)(mode !== 'combobox' || !getInputElement || !allowClear || !placeholder, 'Customize `getInputElement` should customize clear and placeholder logic instead of configuring `allowClear` and `placeholder`.'); // `onSearch` should use in `combobox` or `showSearch`

  if (onSearch && !mergedShowSearch && mode !== 'combobox' && mode !== 'tags') {
    (0,warning/* default */.ZP)(false, '`onSearch` should work with `showSearch` instead of use alone.');
  }

  (0,warning/* noteOnce */.ET)(!defaultOpen || autoFocus, '`defaultOpen` makes Select open without focus which means it will not close by click outside. You can set `autoFocus` if needed.');

  if (value !== undefined && value !== null) {
    var values = commonUtil_toArray(value);
    (0,warning/* default */.ZP)(!labelInValue || values.every(function (val) {
      return (0,esm_typeof/* default */.Z)(val) === 'object' && ('key' in val || 'value' in val);
    }), '`value` should in shape of `{ value: string | number, label?: ReactNode }` when you set `labelInValue` to `true`');
    (0,warning/* default */.ZP)(!multiple || Array.isArray(value), '`value` should be array when `mode` is `multiple` or `tags`');
  } // Syntactic sugar should use correct children type


  if (children) {
    var invalidateChildType = null;
    (0,toArray/* default */.Z)(children).some(function (node) {
      if (! /*#__PURE__*/external_React_.isValidElement(node) || !node.type) {
        return false;
      }

      var type = node.type;

      if (type.isSelectOption) {
        return false;
      }

      if (type.isSelectOptGroup) {
        var allChildrenValid = (0,toArray/* default */.Z)(node.props.children).every(function (subNode) {
          if (! /*#__PURE__*/external_React_.isValidElement(subNode) || !node.type || subNode.type.isSelectOption) {
            return true;
          }

          invalidateChildType = subNode.type;
          return false;
        });

        if (allChildrenValid) {
          return false;
        }

        return true;
      }

      invalidateChildType = type;
      return true;
    });

    if (invalidateChildType) {
      (0,warning/* default */.ZP)(false, "`children` should be `Select.Option` or `Select.OptGroup` instead of `".concat(invalidateChildType.displayName || invalidateChildType.name || invalidateChildType, "`."));
    }

    (0,warning/* default */.ZP)(inputValue === undefined, '`inputValue` is deprecated, please use `searchValue` instead.');
  }
}

/* harmony default export */ const warningPropsUtil = (warningProps);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/Select.js





/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 *
 * New api:
 * - listHeight
 * - listItemHeight
 * - component
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 * - openClassName (Not list in api)
 *
 * Update:
 * - `backfill` only support `combobox` mode
 * - `combobox` mode not support `labelInValue` since it's meaningless
 * - `getInputElement` only support `combobox` mode
 * - `onChange` return OptionData instead of ReactNode
 * - `filterOption` `onChange` `onSelect` accept OptionData instead of ReactNode
 * - `combobox` mode trigger `onChange` will get `undefined` if no `value` match in Option
 * - `combobox` mode not support `optionLabelProp`
 */









var RefSelect = generateSelector({
  prefixCls: 'rc-select',
  components: {
    optionList: es_OptionList
  },
  convertChildrenToData: convertChildrenToData,
  flattenOptions: flattenOptions,
  getLabeledValue: getLabeledValue,
  filterOptions: filterOptions,
  isValueDisabled: isValueDisabled,
  findValueOption: findValueOption,
  warningProps: warningPropsUtil,
  fillOptionsWithMissingValue: fillOptionsWithMissingValue
});
/**
 * Typescript not support generic with function component,
 * we have to wrap an class component to handle this.
 */

var Select = /*#__PURE__*/function (_React$Component) {
  (0,inherits/* default */.Z)(Select, _React$Component);

  var _super = (0,createSuper/* default */.Z)(Select);

  function Select() {
    var _this;

    (0,classCallCheck/* default */.Z)(this, Select);

    _this = _super.apply(this, arguments);
    _this.selectRef = /*#__PURE__*/external_React_.createRef();

    _this.focus = function () {
      _this.selectRef.current.focus();
    };

    _this.blur = function () {
      _this.selectRef.current.blur();
    };

    return _this;
  }

  (0,createClass/* default */.Z)(Select, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/external_React_.createElement(RefSelect, (0,esm_extends/* default */.Z)({
        ref: this.selectRef
      }, this.props));
    }
  }]);

  return Select;
}(external_React_.Component);

Select.Option = es_Option;
Select.OptGroup = es_OptGroup;
/* harmony default export */ const es_Select = (Select);
;// CONCATENATED MODULE: ./node_modules/rc-select/es/index.js




/* harmony default export */ const rc_select_es = (es_Select);

/***/ }),

/***/ 4371:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ toArray)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3804);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2723);


function toArray(children) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ret = [];
  react__WEBPACK_IMPORTED_MODULE_0___default().Children.forEach(children, function (child) {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return;
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if ((0,react_is__WEBPACK_IMPORTED_MODULE_1__.isFragment)(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });
  return ret;
}

/***/ }),

/***/ 2457:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ canUseDom)
/* harmony export */ });
function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

/***/ }),

/***/ 716:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ findDOMNode)
/* harmony export */ });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7196);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Return if a node is a DOM node. Else will return by `findDOMNode`
 */

function findDOMNode(node) {
  if (node instanceof HTMLElement) {
    return node;
  }

  return react_dom__WEBPACK_IMPORTED_MODULE_0___default().findDOMNode(node);
}

/***/ }),

/***/ 5802:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ wrapperRaf)
/* harmony export */ });
var raf = function raf(callback) {
  return +setTimeout(callback, 16);
};

var caf = function caf(num) {
  return clearTimeout(num);
};

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
  raf = function raf(callback) {
    return window.requestAnimationFrame(callback);
  };

  caf = function caf(handle) {
    return window.cancelAnimationFrame(handle);
  };
}

var rafUUID = 0;
var rafIds = new Map();

function cleanup(id) {
  rafIds.delete(id);
}

function wrapperRaf(callback) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  rafUUID += 1;
  var id = rafUUID;

  function callRef(leftTimes) {
    if (leftTimes === 0) {
      // Clean up
      cleanup(id); // Trigger

      callback();
    } else {
      // Next raf
      var realId = raf(function () {
        callRef(leftTimes - 1);
      }); // Bind real raf id

      rafIds.set(id, realId);
    }
  }

  callRef(times);
  return id;
}

wrapperRaf.cancel = function (id) {
  var realId = rafIds.get(id);
  cleanup(realId);
  return caf(realId);
};

/***/ }),

/***/ 2218:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mH": () => (/* binding */ fillRef),
/* harmony export */   "sQ": () => (/* binding */ composeRef),
/* harmony export */   "Yr": () => (/* binding */ supportRef)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4933);
/* harmony import */ var react_is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2723);


function fillRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z)(ref) === 'object' && ref && 'current' in ref) {
    ref.current = node;
  }
}
/**
 * Merge refs into one ref function to support ref passing.
 */

function composeRef() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return function (node) {
    refs.forEach(function (ref) {
      fillRef(ref, node);
    });
  };
}
function supportRef(nodeOrComponent) {
  var _type$prototype, _nodeOrComponent$prot;

  var type = (0,react_is__WEBPACK_IMPORTED_MODULE_0__.isMemo)(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type; // Function component node

  if (typeof type === 'function' && !((_type$prototype = type.prototype) === null || _type$prototype === void 0 ? void 0 : _type$prototype.render)) {
    return false;
  } // Class component


  if (typeof nodeOrComponent === 'function' && !((_nodeOrComponent$prot = nodeOrComponent.prototype) === null || _nodeOrComponent$prot === void 0 ? void 0 : _nodeOrComponent$prot.render)) {
    return false;
  }

  return true;
}
/* eslint-enable */

/***/ }),

/***/ 1381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ET": () => (/* binding */ noteOnce),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports warning, note, resetWarned, call, warningOnce */
/* eslint-disable no-console */
var warned = {};
function warning(valid, message) {
  // Support uglify
  if (false) {}
}
function note(valid, message) {
  // Support uglify
  if (false) {}
}
function resetWarned() {
  warned = {};
}
function call(method, valid, message) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}
function warningOnce(valid, message) {
  call(warning, valid, message);
}
function noteOnce(valid, message) {
  call(note, valid, message);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (warningOnce);
/* eslint-enable */

/***/ }),

/***/ 3440:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = canUseDom;

function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

/***/ }),

/***/ 4500:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.injectCSS = injectCSS;
exports.updateCSS = updateCSS;

var _canUseDom = _interopRequireDefault(__webpack_require__(3440));

var MARK_KEY = "rc-util-key";

function getContainer(option) {
  if (option.attachTo) {
    return option.attachTo;
  }

  var head = document.querySelector('head');
  return head || document.body;
}

function injectCSS(css) {
  var _option$csp;

  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0, _canUseDom.default)()) {
    return null;
  }

  var styleNode = document.createElement('style');

  if ((_option$csp = option.csp) === null || _option$csp === void 0 ? void 0 : _option$csp.nonce) {
    var _option$csp2;

    styleNode.nonce = (_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce;
  }

  styleNode.innerHTML = css;
  var container = getContainer(option);
  var firstChild = container.firstChild;

  if (option.prepend && container.prepend) {
    // Use `prepend` first
    container.prepend(styleNode);
  } else if (option.prepend && firstChild) {
    // Fallback to `insertBefore` like IE not support `prepend`
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }

  return styleNode;
}

var containerCache = new Map();

function updateCSS(css, key) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var container = getContainer(option); // Get real parent

  if (!containerCache.has(container)) {
    var placeholderStyle = injectCSS('', option);
    var parentNode = placeholderStyle.parentNode;
    containerCache.set(container, parentNode);
    parentNode.removeChild(placeholderStyle);
  }

  var existNode = Array.from(containerCache.get(container).children).find(function (node) {
    return node.tagName === 'STYLE' && node[MARK_KEY] === key;
  });

  if (existNode) {
    var _option$csp3, _option$csp4;

    if (((_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce) && existNode.nonce !== ((_option$csp4 = option.csp) === null || _option$csp4 === void 0 ? void 0 : _option$csp4.nonce)) {
      var _option$csp5;

      existNode.nonce = (_option$csp5 = option.csp) === null || _option$csp5 === void 0 ? void 0 : _option$csp5.nonce;
    }

    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }

    return existNode;
  }

  var newNode = injectCSS(css, option);
  newNode[MARK_KEY] = key;
  return newNode;
}

/***/ }),

/***/ 4750:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireWildcard = __webpack_require__(2579);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = useMemo;

var React = _interopRequireWildcard(__webpack_require__(3804));

function useMemo(getValue, condition, shouldUpdate) {
  var cacheRef = React.useRef({});

  if (!('value' in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
    cacheRef.current.value = getValue();
    cacheRef.current.condition = condition;
  }

  return cacheRef.current.value;
}

/***/ }),

/***/ 4085:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(4541);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = omit;

var _objectSpread2 = _interopRequireDefault(__webpack_require__(6928));

function omit(obj, fields) {
  var clone = (0, _objectSpread2.default)({}, obj);

  if (Array.isArray(fields)) {
    fields.forEach(function (key) {
      delete clone[key];
    });
  }

  return clone;
}

/***/ }),

/***/ 9836:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.warning = warning;
exports.note = note;
exports.resetWarned = resetWarned;
exports.call = call;
exports.warningOnce = warningOnce;
exports.noteOnce = noteOnce;
exports.default = void 0;
/* eslint-disable no-console */

var warned = {};

function warning(valid, message) {
  // Support uglify
  if (false) {}
}

function note(valid, message) {
  // Support uglify
  if (false) {}
}

function resetWarned() {
  warned = {};
}

function call(method, valid, message) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}

function warningOnce(valid, message) {
  call(warning, valid, message);
}

function noteOnce(valid, message) {
  call(note, valid, message);
}

var _default = warningOnce;
/* eslint-enable */

exports.default = _default;

/***/ }),

/***/ 5886:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var b = "function" === typeof Symbol && Symbol.for,
    c = b ? Symbol.for("react.element") : 60103,
    d = b ? Symbol.for("react.portal") : 60106,
    e = b ? Symbol.for("react.fragment") : 60107,
    f = b ? Symbol.for("react.strict_mode") : 60108,
    g = b ? Symbol.for("react.profiler") : 60114,
    h = b ? Symbol.for("react.provider") : 60109,
    k = b ? Symbol.for("react.context") : 60110,
    l = b ? Symbol.for("react.async_mode") : 60111,
    m = b ? Symbol.for("react.concurrent_mode") : 60111,
    n = b ? Symbol.for("react.forward_ref") : 60112,
    p = b ? Symbol.for("react.suspense") : 60113,
    q = b ? Symbol.for("react.suspense_list") : 60120,
    r = b ? Symbol.for("react.memo") : 60115,
    t = b ? Symbol.for("react.lazy") : 60116,
    v = b ? Symbol.for("react.block") : 60121,
    w = b ? Symbol.for("react.fundamental") : 60117,
    x = b ? Symbol.for("react.responder") : 60118,
    y = b ? Symbol.for("react.scope") : 60119;

function z(a) {
  if ("object" === typeof a && null !== a) {
    var u = a.$$typeof;

    switch (u) {
      case c:
        switch (a = a.type, a) {
          case l:
          case m:
          case e:
          case g:
          case f:
          case p:
            return a;

          default:
            switch (a = a && a.$$typeof, a) {
              case k:
              case n:
              case t:
              case r:
              case h:
                return a;

              default:
                return u;
            }

        }

      case d:
        return u;
    }
  }
}

function A(a) {
  return z(a) === m;
}

__webpack_unused_export__ = l;
__webpack_unused_export__ = m;
__webpack_unused_export__ = k;
__webpack_unused_export__ = h;
__webpack_unused_export__ = c;
__webpack_unused_export__ = n;
__webpack_unused_export__ = e;
__webpack_unused_export__ = t;
__webpack_unused_export__ = r;
__webpack_unused_export__ = d;
__webpack_unused_export__ = g;
__webpack_unused_export__ = f;
__webpack_unused_export__ = p;

__webpack_unused_export__ = function (a) {
  return A(a) || z(a) === l;
};

__webpack_unused_export__ = A;

__webpack_unused_export__ = function (a) {
  return z(a) === k;
};

__webpack_unused_export__ = function (a) {
  return z(a) === h;
};

__webpack_unused_export__ = function (a) {
  return "object" === typeof a && null !== a && a.$$typeof === c;
};

__webpack_unused_export__ = function (a) {
  return z(a) === n;
};

exports.isFragment = function (a) {
  return z(a) === e;
};

__webpack_unused_export__ = function (a) {
  return z(a) === t;
};

exports.isMemo = function (a) {
  return z(a) === r;
};

__webpack_unused_export__ = function (a) {
  return z(a) === d;
};

__webpack_unused_export__ = function (a) {
  return z(a) === g;
};

__webpack_unused_export__ = function (a) {
  return z(a) === f;
};

__webpack_unused_export__ = function (a) {
  return z(a) === p;
};

__webpack_unused_export__ = function (a) {
  return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
};

__webpack_unused_export__ = z;

/***/ }),

/***/ 2723:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(5886);
} else {}

/***/ }),

/***/ 2930:
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function () {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function (record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
 true ? module.exports : 0);

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ 3804:
/***/ ((module) => {

module.exports = (function() { return this["React"]; }());

/***/ }),

/***/ 7196:
/***/ ((module) => {

module.exports = (function() { return this["ReactDOM"]; }());

/***/ }),

/***/ 953:
/***/ ((module) => {

module.exports = (function() { return this["antd"]; }());

/***/ }),

/***/ 5805:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ 1112:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ 9389:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ 9677:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/***/ }),

/***/ 4609:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ 8620:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/***/ }),

/***/ 3186:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ _createSuper)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__(4933);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(9389);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && ((0,esm_typeof/* default */.Z)(call) === "object" || typeof call === "function")) {
    return call;
  }

  return (0,assertThisInitialized/* default */.Z)(self);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js



function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

/***/ }),

/***/ 2064:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _defineProperty)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ 6712:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ 8749:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ _inherits)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

/***/ }),

/***/ 1992:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ 5403:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ 3755:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _objectSpread2)
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2064);


function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__/* .default */ .Z)(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/***/ }),

/***/ 6980:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ _objectWithoutProperties)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/***/ }),

/***/ 6240:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ _slicedToArray)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
var arrayWithHoles = __webpack_require__(1112);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
var unsupportedIterableToArray = __webpack_require__(4923);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
var nonIterableRest = __webpack_require__(5403);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return (0,arrayWithHoles/* default */.Z)(arr) || _iterableToArrayLimit(arr, i) || (0,unsupportedIterableToArray/* default */.Z)(arr, i) || (0,nonIterableRest/* default */.Z)();
}

/***/ }),

/***/ 723:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _toArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1112);
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1992);
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4923);
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5403);




function _toArray(arr) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__/* .default */ .Z)(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z)(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z)(arr) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z)();
}

/***/ }),

/***/ 9041:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ _toConsumableArray)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
var arrayLikeToArray = __webpack_require__(5805);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,arrayLikeToArray/* default */.Z)(arr);
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
var iterableToArray = __webpack_require__(1992);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
var unsupportedIterableToArray = __webpack_require__(4923);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || (0,iterableToArray/* default */.Z)(arr) || (0,unsupportedIterableToArray/* default */.Z)(arr) || _nonIterableSpread();
}

/***/ }),

/***/ 4933:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ 4923:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5805);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__/* .default */ .Z)(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__/* .default */ .Z)(o, minLen);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd_lib_pagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9983);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  component: antd__WEBPACK_IMPORTED_MODULE_0__.Pagination,
  description: '采用分页的形式分隔长列表，适用场合当加载/渲染所有数据将花费很多时间时；可切换页码浏览数据。',
  d: antd_lib_pagination__WEBPACK_IMPORTED_MODULE_1__.PaginationProps
});
})();

this["display-ant/build/pagination.js.js"] = __webpack_exports__;
/******/ })()
;