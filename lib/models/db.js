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

var dbInitError = new Error("Database is not initialized.");

var db = {
  // Initialize the db - gets and caches a reference to the collection so we don't have to query for it later.
  init: function () {
    if (host && authKey && databaseId && collectionId) {
      DocumentDBUtils.getOrCreateDatabase(docDbClient, databaseId, function (err, db) {
        if (err) {
          console.log("Error encountered while initializing database.");
          console.log(err);
        } else {
          databaseLink = db._self;
          DocumentDBUtils.getOrCreateCollection(docDbClient, databaseLink, collectionId, function (err, coll) {
            if (err) {
              console.log("Error encountered while initializing collection.");
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
  store: function (doc) {
    if (host && authKey && collectionLink) {
      docDbClient.createDocument(collectionLink, doc, function (err, doc, headers) {
        if (err) {
          console.log("Error encountered while storing document.");
        } else {
          console.log("Stored document: " + doc.id);
          console.log("Date: " + headers["date"]);
          console.log("Activity Id: " + headers["x-ms-activity-id"]);
          console.log("RU Charge: " + headers["x-ms-request-charge"]);
        }
      });
    } else {
      console.log("Warning: Can not persist to database because it wasn't initialized.");
    }
  },

  // Query the database by Id.
  queryById: function (id, callback) {
    if (host && authKey && collectionLink) {
      var querySpec = {
        query: 'SELECT * FROM collection c WHERE  c.id = @id',
        parameters: [{name: '@id', value: id}]
      };

      // TODO: Re-implement QueryIterator.toArray() to surface request charge.
      docDbClient.queryDocuments(collectionLink, querySpec).toArray(function (err, docs) {
        if (!err && docs.length > 0) {
          callback(null, docs[0]);
        } else {
          callback(err);
        }
      });
    } else {
      callback(dbInitError);
    }
  }
};

module.exports = db;
