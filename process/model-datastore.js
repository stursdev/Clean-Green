/* jshint esversion: 6 */
/* jshint node: true */

'use strict';


const Datastore = require('@google-cloud/datastore');
const config = require('../config/config');
const request = require('request');
const path = require('path');
const ds = Datastore({
  projectId: config.get('GCLOUD_PROJECT')
});
const kindRecyclables = "Recyclables";
const kindProcessed = "Processed";
const kindDriver = "Driver";

function fromDatastore (obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

function toDatastore (obj) {
  const results = [];
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k]
    });
  });
  return results;
}

function processItemAsArray(itemAsString) {
  var a = itemAsString;
  var result = [];
  result.push(a);
  return result;
}

function processRequest(email, address) {
  const query = ds.createQuery(kindRecyclables).filter('street', '=', address);
  const q2 = ds.createQuery(kindDriver).filter('email', '=', email);

  ds.runQuery(query).then(results => {
    const entries = results[0];
    entries.forEach(entry => {
      const entryKey = entry[ds.KEY];
      entry.processed = true;
      ds.runQuery(q2).then( r => {
        const driver = r[0];
        const driverId = driver[0][ds.KEY].id;
        entry.pickedUpBy = driverId;
        var d = new Date();
        entry.processedTime = d.getTime();
        const entity = {
          key: entryKey,
          data: entry
        };
        ds.update(entity);
      });
    });
  });

}


module.exports = { processRequest };
