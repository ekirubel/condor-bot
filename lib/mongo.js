'use strict';

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

class MongoDB {

    constructor(url) {
        this.url = url;
    }

    /**
     * Performs an upsert operation: Update if existing, otherwise insert
     */
    upsert(collection, id, update) {
        MongoClient.connect(this.url, function (err, db) {
            assert.equal(null, err);
            db.collection(collection).update({_id: id}, update, {upsert: true});
            db.close();
        });
    }

    /**
     * Performs a query on the given collection
     */
    query(collection, query, fields, options, callback) {
        MongoClient.connect(this.url, function (err, db) {
            assert.equal(null, err);

            db.collection(collection).find(query, fields, options).toArray(function(err, results) {
                callback(results);
            });

            db.close();
        });
    }
}

module.exports = MongoDB;
