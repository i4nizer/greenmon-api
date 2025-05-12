
//

/** A class to hold meta data of a connected web socket client. */
class WebSocketClient {
    
    static #counter = 0;

    /**
     * 
     * @param {WebSocket} ws The web socket client, web socket instance.
     * @param {String} key The raw token provided.
     * @param {Object} payload The parsed token, the content.
     * @param {Boolean} init Tells whether initialization is needed.
     */
    constructor(ws, key, payload, init = false) {
        this.id = WebSocketClient.#counter++;
        this.ws = ws;
        this.key = key;
        this.payload = payload
        this.init = init;
    }

    send(event, data, query = 'Update', force = false) {
        if (!force && !this.init) return -2
        else if (this.ws.readyState != this.ws.OPEN) return -1

        this.ws.send(JSON.stringify({ event, data, query }))
        return data?.length || 0
    }

    sendChunked(event, data, query, size = 10, delay = 50, force = false) {
        if (!force && !this.init) return
        const copy = [...data]
        const firstData = copy.splice(0, size)
        this.send(event, firstData, query)
        
        const interval = setInterval(() => {
            if (copy.length <= 0) return clearInterval(interval)
            this.send(event, copy.splice(0, size), query)
        }, delay)
    }
    
    async sendChunkedAsync(event, data, query, size = 10, delay = 50, force = false) {
        if (!force && !this.init) return
        const copy = [...data]
        
        while (copy.length > 0) {
            this.send(event, copy.splice(0, size), query, force)
            await new Promise(res => setTimeout(() => res(), delay))
        }
    }
}

//

module.exports = {
    WebSocketClient,
}