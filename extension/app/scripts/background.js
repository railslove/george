'use strict';

!function(){"use strict";var e="undefined"!=typeof window?window:global;if("function"!=typeof e.require){var t={},n={},i=function(e,t){return{}.hasOwnProperty.call(e,t)},r=function(e,t){var n,i,r=[];n=/^\.\.?(\/|$)/.test(t)?[e,t].join("/").split("/"):t.split("/");for(var o=0,s=n.length;s>o;o++)i=n[o],".."===i?r.pop():"."!==i&&""!==i&&r.push(i);return r.join("/")},o=function(e){return e.split("/").slice(0,-1).join("/")},s=function(t){return function(n){var i=o(t),s=r(i,n);return e.require(s,t)}},a=function(e,t){var i={id:e,exports:{}};return n[e]=i,t(i.exports,s(e),i),i.exports},c=function(e,o){var s=r(e,".");if(null==o&&(o="/"),i(n,s))return n[s].exports;if(i(t,s))return a(s,t[s]);var c=r(s,"./index");if(i(n,c))return n[c].exports;if(i(t,c))return a(c,t[c]);throw new Error('Cannot find module "'+e+'" from "'+o+'"')},l=function(e,n){if("object"==typeof e)for(var r in e)i(e,r)&&(t[r]=e[r]);else t[e]=n},u=function(){var e=[];for(var n in t)i(t,n)&&e.push(n);return e};e.require=c,e.require.define=l,e.require.register=l,e.require.list=u,e.require.brunch=!0}}(),require.define({phoenix:function(e){"use strict";var t=function(e,t,n){t&&Object.defineProperties(e,t),n&&Object.defineProperties(e.prototype,n)},n=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},i={connecting:0,open:1,closing:2,closed:3},r=e.Channel=function(){function e(t,i,r,o){n(this,e),this.topic=t,this.message=i,this.callback=r,this.socket=o,this.bindings=null,this.reset()}return t(e,null,{reset:{value:function(){this.bindings=[]},writable:!0,configurable:!0},on:{value:function(e,t){this.bindings.push({event:e,callback:t})},writable:!0,configurable:!0},isMember:{value:function(e){return this.topic===e},writable:!0,configurable:!0},off:{value:function(e){this.bindings=this.bindings.filter(function(t){return t.event!==e})},writable:!0,configurable:!0},trigger:{value:function(e,t){this.bindings.filter(function(t){return t.event===e}).map(function(e){return e.callback(t)})},writable:!0,configurable:!0},send:{value:function(e,t){this.socket.send({topic:this.topic,event:e,payload:t})},writable:!0,configurable:!0},leave:{value:function(){var e=void 0===arguments[0]?{}:arguments[0];this.socket.leave(this.topic,e),this.reset()},writable:!0,configurable:!0}}),e}(),o=(e.Socket=function(){function e(t){var r=void 0===arguments[1]?{}:arguments[1];n(this,e),this.states=i,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.flushEveryMs=50,this.reconnectTimer=null,this.reconnectAfterMs=5e3,this.heartbeatIntervalMs=3e4,this.channels=[],this.sendBuffer=[],this.transport=r.transport||WebSocket||o,this.heartbeatIntervalMs=r.heartbeatIntervalMs||this.heartbeatIntervalMs,this.logger=r.logger||function(){},this.endPoint=this.expandEndpoint(t),this.resetBufferTimer(),this.reconnect()}return t(e,null,{protocol:{value:function(){return location.protocol.match(/^https/)?"wss":"ws"},writable:!0,configurable:!0},expandEndpoint:{value:function(e){return"/"!==e.charAt(0)?e:"/"===e.charAt(1)?""+this.protocol()+":"+e:""+this.protocol()+"://"+location.host+e},writable:!0,configurable:!0},close:{value:function(e,t,n){this.conn&&(this.conn.onclose=function(){},t?this.conn.close(t,n||""):this.conn.close(),this.conn=null),e&&e()},writable:!0,configurable:!0},reconnect:{value:function(){var e=this;this.close(function(){e.conn=new e.transport(e.endPoint),e.conn.onopen=function(){return e.onConnOpen()},e.conn.onerror=function(t){return e.onConnError(t)},e.conn.onmessage=function(t){return e.onConnMessage(t)},e.conn.onclose=function(t){return e.onConnClose(t)}})},writable:!0,configurable:!0},resetBufferTimer:{value:function(){var e=this;clearTimeout(this.sendBufferTimer),this.sendBufferTimer=setTimeout(function(){return e.flushSendBuffer()},this.flushEveryMs)},writable:!0,configurable:!0},log:{value:function(e){this.logger(e)},writable:!0,configurable:!0},onOpen:{value:function(e){this.stateChangeCallbacks.open.push(e)},writable:!0,configurable:!0},onClose:{value:function(e){this.stateChangeCallbacks.close.push(e)},writable:!0,configurable:!0},onError:{value:function(e){this.stateChangeCallbacks.error.push(e)},writable:!0,configurable:!0},onMessage:{value:function(e){this.stateChangeCallbacks.message.push(e)},writable:!0,configurable:!0},onConnOpen:{value:function(){var e=this;clearInterval(this.reconnectTimer),this.transport.skipHeartbeat||(this.heartbeatTimer=setInterval(function(){return e.sendHeartbeat()},this.heartbeatIntervalMs)),this.rejoinAll(),this.stateChangeCallbacks.open.forEach(function(e){return e()})},writable:!0,configurable:!0},onConnClose:{value:function(e){var t=this;this.log("WS close:"),this.log(e),clearInterval(this.reconnectTimer),clearInterval(this.heartbeatTimer),this.reconnectTimer=setInterval(function(){return t.reconnect()},this.reconnectAfterMs),this.stateChangeCallbacks.close.forEach(function(t){return t(e)})},writable:!0,configurable:!0},onConnError:{value:function(e){this.log("WS error:"),this.log(e),this.stateChangeCallbacks.error.forEach(function(t){return t(e)})},writable:!0,configurable:!0},connectionState:{value:function(){switch(this.conn&&this.conn.readyState){case this.states.connecting:return"connecting";case this.states.open:return"open";case this.states.closing:return"closing";default:return"closed"}},writable:!0,configurable:!0},isConnected:{value:function(){return"open"===this.connectionState()},writable:!0,configurable:!0},rejoinAll:{value:function(){var e=this;this.channels.forEach(function(t){return e.rejoin(t)})},writable:!0,configurable:!0},rejoin:{value:function(e){e.reset(),this.send({topic:e.topic,event:"join",payload:e.message}),e.callback(e)},writable:!0,configurable:!0},join:{value:function(e,t,n){var i=new r(e,t,n,this);this.channels.push(i),this.isConnected()&&this.rejoin(i)},writable:!0,configurable:!0},leave:{value:function(e){var t=void 0===arguments[1]?{}:arguments[1];this.send({topic:e,event:"leave",payload:t}),this.channels=this.channels.filter(function(t){return!t.isMember(e)})},writable:!0,configurable:!0},send:{value:function(e){var t=this,n=function(){return t.conn.send(JSON.stringify(e))};this.isConnected()?n():this.sendBuffer.push(n)},writable:!0,configurable:!0},sendHeartbeat:{value:function(){this.send({topic:"phoenix",event:"heartbeat",payload:{}})},writable:!0,configurable:!0},flushSendBuffer:{value:function(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(function(e){return e()}),this.sendBuffer=[]),this.resetBufferTimer()},writable:!0,configurable:!0},onConnMessage:{value:function(e){this.log("message received:"),this.log(e);var t=JSON.parse(e.data),n=t.topic,i=t.event,r=t.payload;this.channels.filter(function(e){return e.isMember(n)}).forEach(function(e){return e.trigger(i,r)}),this.stateChangeCallbacks.message.forEach(function(e){e(n,i,r)})},writable:!0,configurable:!0}}),e}(),e.LongPoller=function(){function e(t){n(this,e),this.retryInMs=5e3,this.endPoint=null,this.token=null,this.sig=null,this.skipHeartbeat=!0,this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.states=i,this.upgradeEndpoint=this.normalizeEndpoint(t),this.pollEndpoint=this.upgradeEndpoint+(/\/$/.test(t)?"poll":"/poll"),this.readyState=this.states.connecting,this.poll()}return t(e,null,{normalizeEndpoint:{value:function(e){return e.replace("ws://","http://").replace("wss://","https://")},writable:!0,configurable:!0},endpointURL:{value:function(){return this.pollEndpoint+("?token="+encodeURIComponent(this.token)+"&sig="+encodeURIComponent(this.sig))},writable:!0,configurable:!0},closeAndRetry:{value:function(){this.close(),this.readyState=this.states.connecting},writable:!0,configurable:!0},ontimeout:{value:function(){this.onerror("timeout"),this.closeAndRetry()},writable:!0,configurable:!0},poll:{value:function(){var e=this;(this.readyState===this.states.open||this.readyState===this.states.connecting)&&s.request("GET",this.endpointURL(),"application/json",null,this.ontimeout.bind(this),function(t,n){if(n&&""!==n){var i=JSON.parse(n),r=i.token,o=i.sig,s=i.messages;e.token=r,e.sig=o}switch(t){case 200:s.forEach(function(t){return e.onmessage({data:JSON.stringify(t)})}),e.poll();break;case 204:e.poll();break;case 410:e.readyState=e.states.open,e.onopen(),e.poll();break;case 0:case 500:e.onerror(),e.closeAndRetry();break;default:throw"unhandled poll status "+t}})},writable:!0,configurable:!0},send:{value:function(e){var t=this;s.request("POST",this.endpointURL(),"application/json",e,this.onerror.bind(this,"timeout"),function(e){200!==e&&t.onerror(e)})},writable:!0,configurable:!0},close:{value:function(){this.readyState=this.states.closed,this.onclose()},writable:!0,configurable:!0}}),e}()),s=e.Ajax={states:{complete:4},request:function(e,t,n,i,r,o){var s=this,a=XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");a.open(e,t,!0),a.setRequestHeader("Content-type",n),a.onerror=function(){o&&o(500,null)},a.onreadystatechange=function(){a.readyState===s.states.complete&&o&&o(a.status,a.responseText)},r&&(a.ontimeout=r),a.send(i)}};Object.defineProperty(e,"__esModule",{value:!0})}}),"object"!=typeof window||window.Phoenix||(window.Phoenix=require("phoenix"));
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);

// var Socket = Phoenix.Socket;
// var socket = new Socket("ws://" + "localhost:4000" + "/ws");

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'George'});

var user;

chrome.runtime.onMessage.addListener( function(req, sender, sendResponse) {
  user = md5(req.name)
});

chrome.tabs.onHighlighted.addListener(function (highlightInfo) {
  chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
     // since only one tab should be active and in the current window at once
     // the return variable should only have one entry
     var activeTab = arrayOfTabs[0];

     // console.log(activeTab.url)
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {

    console.log(tab.url)
    if (user) {
     chrome.tabs.executeScript(null, {code:"init('"+user+"')"});
    } else {
      console.log('please specify a name')
    }

  }
});

