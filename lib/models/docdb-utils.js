/*jshint node:true */
"use strict";

/*
 * General utility methods for interacting with DocumentDB.
 */
var DocDBUtils = {
  // Gets or creates (if it doesn't already exist) a database by id.
  getOrCreateDatabase: function (client, databaseId, callback) {
    var query = {
      query: 'SELECT * FROM root r WHERE r.id=@id',
      parameters: [{name: '@id', value: databaseId}]
    };

    client.queryDatabases(query).toArray(function (err, results) {
      if (err) {
        console.log("Error encountered while querying for a database.");
        console.log(err);
      } else if (results.length === 0) {
        client.createDatabase({id: databaseId}, function (err, created) {
          if (err) {
            console.log("Error encountered while creating a database.");
            console.log(err);
          } else if (callback) {
            callback(null, created);
          }
        });
      } else if (callback) {
        callback(null, results[0]);
      }
    });
  },

  // Gets or creates (if it doesn't already exist) a collection by id.
  getOrCreateCollection: function (client, databaseLink, collectionId, callback) {
    var query = {
      query: 'SELECT * FROM root r WHERE r.id=@id',
      parameters: [{name: '@id', value: collectionId}]
    };

    client.queryCollections(databaseLink, query).toArray(function (err, results) {
      if (err) {
        console.log("Error encountered while querying for a collection.");
        console.log(err);
      } else if (results.length === 0) {
        client.createCollection(databaseLink, {id: collectionId}, function (err, created) {
          if (err) {
            console.log("Error encountered while creating a collection.");
            console.log(err);
          } else if (callback) {
            callback(null, created);
          }
        });
      } else if (callback) {
        callback(null, results[0]);
      }
    });
  }
};

module.exports = DocDBUtils;
