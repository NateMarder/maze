import EventEmitter2 from 'eventemitter2';

let eventServer;
function getInstance(options = {}) {
  if (!eventServer) {
    const initParams = {
      wildcard: true,
      delimiter: '::',
      newListener: false,
      maxListeners: 0,
      verboseMemoryLeak: true,
      ...options,
    };
    eventServer = new EventEmitter2(initParams);
  }

  return eventServer;
}


export default getInstance;
