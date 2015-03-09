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
  // Initialize the db - gets and caches a reference to the collection so we don't have to query for it later.
  init: function () {
    if (host && authKey && databaseId && collectionId) {
      DocumentDBUtils.getOrCreateDatabase(docDbClient, databaseId, function (err, db) {
        if (err) {
          console.log("Error encountered while initializing db - retrieving database.");
          console.log(err);
        } else {
          databaseLink = db._self;
          DocumentDBUtils.getOrCreateCollection(docDbClient, databaseLink, collectionId, function (err, coll) {
            if (err) {
              console.log("Error encountered while initializing db - retrieving collection.");
              console.log(err);
            } else {
              collectionLink = coll._self;
              console.log("Established connection to DB.");
            }
          });
        }
      });
    } else {
      console.log("Warning: Environment variables for DB are not defined.");
    }
  },

  // Persists a JSON document to the database.
  store: function (doc, callback) {
    if (host && authKey && collectionLink) {
      docDbClient.createDocument(collectionLink, doc, function (err, doc, headers) {
        if (err) {
          console.log("Error encountered while storing document database.");
          console.log(err);
        }

        // Output DB Stats.
        console.log("Stored document: " + doc.id);
        console.log("Date: " + headers["date"]);
        console.log("Activity Id: " + headers["x-ms-activity-id"]);
        console.log("RU Charge: " + headers["x-ms-request-charge"]);

        if (callback) {
          callback(doc);
        }
      });
    } else {
      console.log("Warning: Can not persist to database because it wasn't initialized.");
    }
  }
};

module.exports = db;
