'use strict';

const { newMessage, getFolders } = require('../helpers');
const co = require('co');

const _ = require('lodash');
const ApiClient = require('../apiClient');


async function processAction(msg, cfg, snapshot)
{
    snapshot.lastModifiedDateTime = snapshot.lastModifiedDateTime || new Date(0).toISOString();
    const iamToken = process.env.ELASTICIO_IAM_TOKEN;
    const self = this;

    const { oihUid, recordUid } = msg.metadata;

    return co(async function* mainLoop()
    {
        const instance = new ApiClient(cfg, self);

        const order = encodeURIComponent('lastModifiedDateTime asc');
        const filter = encodeURIComponent(`lastModifiedDateTime gt ${snapshot.lastModifiedDateTime}`);
        const contacts = await apiClient.get(`/me/contacts?$filter=${filter}&$orderby=${order}&$top=900`);

        const values = contacts.value;

        const getApplicationUid = {
            uri: `http://component-repository.openintegrationhub.com/components/${process.env.ELASTICIO_COMP_ID}`,
            json: true,
            headers: {
                "Authorization" : `Bearer ${iamToken}`,
                }
        };

        const applicationUidResponse = await request.get(getApplicationUid);

        const appUid = applicationUidResponse.data.applicationUid;

        let meta = {
            applicationUid: (appUid!=undefined && appUid!=null) ? appUid : 'appUid not set yet',
            iamToken: (iamToken!=undefined && iamToken!=null) ? iamToken : 'iamToken not set yet',
        }
        let contentWithMeta;

        if (values.length > 0)
        {
            values.forEach((elem)=>
            {
                meta.recordUid = "id";
                delete elem.id;
                const messageBody = _.omitBy(elem, (value, key) => key.startsWith('@odata.'));
                messageBody.calendarId = cfg.calendarId;

                contentWithMeta = {
                    metadata: meta,
                    data: messageBody
                };

                // this.emit('data', newMessage(messageBody));
                this.emit('data', messageBody);
            });

            let lmdate = new Date(values[values.length - 1].lastModifiedDateTime);

            lmdate.setMilliseconds(999);
            snapshot.lastModifiedDateTime = lmdate.toISOString();
        }

        this.emit('snapshot', snapshot);
    }.bind(this));
}

module.exports.process = processAction;
