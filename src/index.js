const iotalib = require('@dojot/iotagent-nodejs');
const express = require('express');
const util = require('util');
const app = express()
app.use(express.json());

const iotaPort = 8083;

console.log("Initializing custom IoT agent...");
const iota = new iotalib.IoTAgent();
iota.init();
console.log("... custom IoT agent was initialized", iota);

console.log(iota.messenger.tenants)

app.get('/', (req, res) => {
	res.status(200).send({message: 'customIoTAgent is on', iota: util.inspect(iota)});
});

app.get('/tenants', (req, res) => {
	let tenants = iota.messenger.tenants;
	res.status(200).send({tenants});
});

app.post('/tenants/:tenant/devices/:device/messages', (req, res) => {
	let {tenant, device} = req.params;
	let message = req.body;

	let metadata = {
		timestamp: Date.now(),
	}

	iota.updateAttrs(device, tenant, message, metadata);
	res.status(200).send({tenant, device, message, metadata});
});

app.listen(iotaPort, () => {
	console.log('iotagent listening on port', iotaPort);
});
