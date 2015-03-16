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
        callback(err);
      } else if (results.length === 0) {
        client.createDatabase({id: databaseId}, callback);
      } else {
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
        callback(err);
      } else if (results.length === 0) {
        client.createCollection(databaseLink, {id: collectionId}, callback);
      } else {
        callback(null, results[0]);
      }
    });
  }
};

module.exports = DocDBUtils;
