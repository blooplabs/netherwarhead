/*jshint node:true */
"use strict";

var DocumentDBClient = require('documentdb').DocumentClient;
var DocumentDBUtils = require('./docdb-utils');

var host = process.env.DOCDB_HOST,
  authKey = process.env.DOCDB_AUTH_KEY,
  databaseId = process.env.DOCDB_DATABASE,
  collectionId = process.env.DOCDB_COLLECTION,
  databaseLink = "",
  collectionLink = "";

var docDbClient = new DocumentDBClient(host, {masterKey: authKey});

var db = {
  init: function () {
    if (host && authKey && databaseId && collectionId) {
      DocumentDBUtils.getOrCreateDatabase(docDbClient, databaseId, function (err, db) {
        if (err) {
          console.log(err);
        } else {
          databaseLink = db._self;
          DocumentDBUtils.getOrCreateCollection(docDbClient, databaseLink, collectionId, function (err, coll) {
            if (err) {
              console.log(err);
            } else {
              collectionLink = coll._self;
              console.log("Established connection to DB.");
            }
          })
        }
      })
    } else {
      console.log("Warning: Environment variables for DB are not defined.")
    }
  },

  store: function (doc, callback) {
    docDbClient.createDocument(collectionLink, doc, function (err, doc) {
      if (err) {
        console.log(err);
      } else if (callback) {
        callback(doc);
      }
    });
  }
};

module.exports = db;
