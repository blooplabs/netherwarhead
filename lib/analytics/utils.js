/*jshint node:true */
"use strict";

var utils = {
  // Split string in to n-grams (words).
  toNgrams: function (string, n) {
    var ngrams = [];

    // Sanitize string - remove punctionation, collapse whitespace, and convert to lower case.
    string = string.replace(/[^\w ]+/g, "").replace(/\s+/g, " ").toLowerCase();

    // Split on whitespace
    var stringArr = string.split(" ");

    // Compute n-grams
    var i, j, curr;
    for (i = 0; i + n <= stringArr.length; i++) {
      curr = stringArr[i];

      for (j = i + 1; j < i + n; j++) {
        curr += " " + stringArr[j];
      }

      ngrams.push(curr);
    }

    return ngrams;
  }
};

module.exports = utils;