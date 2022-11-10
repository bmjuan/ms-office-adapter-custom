/**
 * Copyright 2019 Wice GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const { transform } = require('@openintegrationhub/ferryman');
const Q = require('q');
const ApiClient = require('../apiClient');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param msg - incoming message object that contains ``body`` with payload
 * @param cfg - configuration that is account information and configuration field values
 * @param snapshot - saves the current state of integration step for the future reference
 */
async function processTrigger(msg, cfg, snapshot = {}) {
  // Authenticate and get the token from Snazzy Contacts
  const instance = new ApiClient(cfg, this);
  console.info(cfg);
  // Set the snapshot if it is not provided
  snapshot.lastUpdated = snapshot.lastUpdated || (new Date()).getTime();
  const actionUrl = '/me';

  try {
    // const filter = `start/dateTime ge ${from} and end/dateTime le ${until}`.replace(/ /g, '%20');
    // let result = await instance.get(`${actionUrl}?$filter=${filter}&$top=100&$skip=0`);
    let result = await instance.get(`${actionUrl}`);
    this.emit('data', result);
    console.log('Finished execution');
    this.emit('end');
  } catch(e) {
    console.log(`ERROR: ${e}`);
    this.emit('error', e);  
 }

}

module.exports = {
  process: processTrigger,
};
