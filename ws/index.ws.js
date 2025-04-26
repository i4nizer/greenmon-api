const expressWs = require('express-ws');
const { onWsEsp32Connect, attachWsEsp32Hooks } = require('./esp32/index.ws');
const { attachWsClientHooks } = require('./client/hook.ws');
const { onWsClientConnect } = require('./client/index.ws');



/**
 * An express app instance bind with ws.
 */
let _app = null;
let _binded = false;


/**
 * Binds web socket to the express app.
 * Note that this binds only to the first express app it was binded to.
 */
const bindExpressApp = (app) => {
	if (_binded) return

	// bind and save
	_app = expressWs(app).app
	_binded = true

	// init route handlers for esp32
	attachWsEsp32Hooks()
	_app.ws("/ws-esp32", onWsEsp32Connect)

	// init route handlers for client
	attachWsClientHooks()
	_app.ws("/ws-client", onWsClientConnect)
}



module.exports = {
    bindExpressApp,
}