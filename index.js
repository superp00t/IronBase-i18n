const enUS = require("./enUS");
const de   = require("./de");
const esCO = require("./esCO");
const el =   require("./el");

const defaultLang = "en-US";

const localizationStrings = {
  "en-us": {
    flagSrc: "img/flags/United-States.png",
    locale: enUS
  },

  "de": {
    flagSrc: "img/flags/Germany.png",
    locale: de
  },

  "es-co": {
    flagSrc: "img/flags/Colombia.png",
    locale: esCO
  },

  "el": {
    flagSrc: "img/flags/Greece.png",
    locale: el
  }
};

function joinLocalID(o) {
  if (o.minor) {
    return o.major + "-" + o.minor;
  }

  return o.major;
}

function splitLocalID(str) {
  var o = {};
  var e = str.split("-");

  o.major = e[0];
  
  if (e.length == 1) {
    o.minor = ""
    return o;
  }

  o.major = str[1];
  return o;
}

function lExists(s) {
  return typeof localizationStrings[s] !== "undefined";
}

function lGet(o) {
  var full = localizationStrings[joinLocalID(o)];
  if (typeof full !== "undefined") {
    return { key: joinLocalID(o), object: full };
  }

  var basic = localizationStrings[o.major];
  if (typeof basic !== "undefined") {
    return { key: o.major, object: basic };
  }

  /** 
   * Major localization could not be found for this language.
   * Search for minor localizations.
   * */
  var ks = Object.keys(localizationStrings);

  for (var i = 0; i < ks.length; i++) {
    var os = splitLocalID(ks[i]);

    if (os.major == o.major) {
      return { key: ks[i], object: localizationStrings[ks[i]] };
    }
  }

  // The supplied locale ID is completely unsupported, so default to American English.
  return { key: defaultLang, object: localizationStrings[defaultLang] };
}

// Acquire relevant localization object using supplided locale ID str. 
function AcquireLocalization(str) {
  var e = splitLocalID(str);

  return lGet(e)
}

// Detect and acquire localization object using variables present in the JS environment.
function DetectLocalization() {
  if (typeof navigator == "undefined") {
    return AcquireLocalization(defaultLang.toLowerCase());
  }

  if (typeof document !== "undefined") {
    // this code is running in a web page
    return AcquireLocalization(navigator.language.toLowerCase());
  } else if (navigator.product == "ReactNative") {
    // react native support ? https://github.com/facebook/react-native/pull/14568
    return AcquireLocalization(navigator.language.toLowerCase());
  }

  return AcquireLocalization(defaultLang);
}

module.exports = {
  DetectLocalization,
  AcquireLocalization,
  localizationStrings
};