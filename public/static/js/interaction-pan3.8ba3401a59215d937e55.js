webpackJsonp([3],{H4Ae:function(t,e,n){function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var r=n("I3q/"),s=n("kbvp"),o=n("s7r6"),a=n("2Gtp"),h=n("HdNJ"),c=["touchstart","touchmove","touchend","touchStart","touchMove","touchEnd"],u=function(t){var e,n;n=t,(e=a).prototype=Object.create(n.prototype),e.prototype.constructor=e,e.__proto__=n;var o=a.prototype;function a(e,n){var s,o=i(i(s=t.call(this,e,n)||this)),a=o.hammer,c=o.panThreshold,u=o.pressThreshold,l=o.pressTime;a&&a.get("pan").set({threshold:c});var p=n.get("tooltipController");return p&&p.enable&&(n.tooltip(!1),a?(a.get("press").set({threshold:u,time:l}),a.on("press",r.wrapBehavior(i(i(s)),"_handlePress"))):r.addEventListener(s.el,"press",r.wrapBehavior(i(i(s)),"_handlePress"))),n.registerPlugins([h,{changeData:function(){o.limitRange={}},clear:function(){o.limitRange={}}}]),s}return o.getDefaultCfg=function(){var e=t.prototype.getDefaultCfg.call(this);return e=r.mix({},e,{startEvent:"panstart",processEvent:"panmove",endEvent:"panend",resetEvent:"touchend",mode:"x",panThreshold:10,pressThreshold:9,pressTime:251,currentDeltaX:null,currentDeltaY:null,panning:!1,limitRange:{},_timestamp:0,lastPoint:null}),(r.isWx||r.isMy)&&(e.startEvent="touchstart",e.processEvent="touchmove",e.endEvent="touchend"),e},o.start=function(t){this.pressed||(this.currentDeltaX=0,this.currentDeltaY=0,"touchstart"!==t.type&&"touchStart"!==t.type||(this.lastPoint=t.touches[0]),this._handlePan(t))},o.process=function(t){this.pressed||this._handlePan(t)},o.end=function(){this.pressed||(this.currentDeltaX=null,this.currentDeltaY=null,this.lastPoint=null)},o.reset=function(){var t=this.chart;t.get("tooltipController")&&(this.pressed=!1,t.hideTooltip(),t.tooltip(!1))},o._handlePress=function(t){this.pressed=!0;var e=t.center||t.touches[0];this.chart.tooltip(!0),this.chart.showTooltip(e)},o._handlePan=function(t){var e,n,i=this.currentDeltaX,s=this.currentDeltaY,o=this.lastPoint;if(-1!==c.indexOf(t.type)){var a=t.touches[0];e=a.x-o.x,n=a.y-o.y,this.lastPoint=a}else null!==i&&null!==s&&(this.panning=!0,e=t.deltaX-i,n=t.deltaY-s,this.currentDeltaX=t.deltaX,this.currentDeltaY=t.deltaY);if(!r.isNil(e)||!r.isNil(n)){var h=this._timestamp,u=+new Date;u-h>16&&(this._doPan(e,n),this._timestamp=u)}},o._doPan=function(t,e){var n=this,i=n.mode,o=n.chart,a=n.limitRange,h=o.get("coord"),c=h.start,u=h.end,l=o.get("data");if(s.directionEnabled(i,"x")&&0!==t){var p=o.getXScale(),f=p.field;a[f]||(a[f]=s._getLimitRange(l,p));var v=u.x-c.x;p.isCategory?n._panCatScale(p,t,v):p.isLinear&&n._panLinearScale(p,t,v,"x");var d=s.getColDef(o,f);this.xRange=s._getFieldRange(d,a[f],p.type)}if(s.directionEnabled(i,"y")&&0!==e){var m=c.y-u.y,g=o.getYScales();r.each(g,function(t){var i=t.field;a[i]||(a[i]=s._getLimitRange(l,t)),t.isLinear&&n._panLinearScale(t,e,m,"y")});var y=s.getColDef(o,g[0].field);this.yRange=s._getFieldRange(y,a[g[0].field],g[0].type)}o.repaint()},o._panLinearScale=function(t,e,n,i){var o=t.field,a=t.min,h=t.max,c=this.limitRange;if(a!==c[o].min||h!==c[o].max){var u=this.chart,l=e/n*(h-a),p="x"===i?h-l:h+l,f="x"===i?a-l:a+l;c[o]&&!r.isNil(c[o].min)&&f<=c[o].min&&(p=h-a+(f=c[o].min)),c[o]&&!r.isNil(c[o].max)&&p>=c[o].max&&(f=(p=c[o].max)-(h-a));var v=s.getColDef(u,o);u.scale(o,r.mix({},v,{min:f,max:p,nice:!1}))}},o._panCatScale=function(t,e,n){var i=this.chart,o=t.type,a=t.field,h=t.values,c=t.ticks,u=s.getColDef(i,a),l=this.limitRange[a],p=e/n,f=h.length,v=Math.max(1,Math.abs(parseInt(p*f))),d=l.indexOf(h[0]),m=l.indexOf(h[f-1]);if(e>0&&d>=0){for(var g=0;g<v&&d>0;g++)d-=1,m-=1;var y=l.slice(d,m+1),T=null;if("timeCat"===o){for(var E=c.length>2?c[1]-c[0]:864e5,_=c[0]-E;_>=y[0];_-=E)c.unshift(_);T=c}i.scale(a,r.mix({},u,{values:y,ticks:T}))}else if(e<0&&m<=l.length-1){for(var x=0;x<v&&m<l.length-1;x++)d+=1,m+=1;var I=l.slice(d,m+1),D=null;if("timeCat"===o){for(var b=c.length>2?c[1]-c[0]:864e5,P=c[c.length-1]+b;P<=I[I.length-1];P+=b)c.push(P);D=c}i.scale(a,r.mix({},u,{values:I,ticks:D}))}},a}(o);a.registerInteraction("pan",u),t.exports=u},HdNJ:function(t,e,n){var i=n("I3q/"),r=n("Cedb");t.exports={beforeGeomInit:function(t){t.set("limitInPlot",!0);var e=t.get("data"),n=t.get("colDefs");if(!n)return e;var s=t.get("geoms"),o=!1;i.each(s,function(t){if(-1!==["area","line","path"].indexOf(t.get("type")))return o=!0,!1});var a=[];if(i.each(n,function(t,e){!o&&t&&(t.values||t.min||t.max)&&a.push(e)}),0===a.length)return e;var h=[];i.each(e,function(t){var e=!0;i.each(a,function(s){var o=t[s];if(o){var a=n[s];if("timeCat"===a.type){var h=a.values;i.isNumber(h[0])&&(o=r.toTimeStamp(o))}(a.values&&-1===a.values.indexOf(o)||a.min&&o<a.min||a.max&&o>a.max)&&(e=!1)}}),e&&h.push(t)}),t.set("filteredData",h)}}},rxKx:function(t,e,n){var i;
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(r,s,o,a){"use strict";var h,c=["","webkit","Moz","MS","ms","o"],u=s.createElement("div"),l="function",p=Math.round,f=Math.abs,v=Date.now;function d(t,e,n){return setTimeout(x(t,n),e)}function m(t,e,n){return!!Array.isArray(t)&&(g(t,n[e],n),!0)}function g(t,e,n){var i;if(t)if(t.forEach)t.forEach(e,n);else if(t.length!==a)for(i=0;i<t.length;)e.call(n,t[i],i,t),i++;else for(i in t)t.hasOwnProperty(i)&&e.call(n,t[i],i,t)}function y(t,e,n){var i="DEPRECATED METHOD: "+e+"\n"+n+" AT \n";return function(){var e=new Error("get-stack-trace"),n=e&&e.stack?e.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",s=r.console&&(r.console.warn||r.console.log);return s&&s.call(r.console,i,n),t.apply(this,arguments)}}h="function"!=typeof Object.assign?function(t){if(t===a||null===t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var i=arguments[n];if(i!==a&&null!==i)for(var r in i)i.hasOwnProperty(r)&&(e[r]=i[r])}return e}:Object.assign;var T=y(function(t,e,n){for(var i=Object.keys(e),r=0;r<i.length;)(!n||n&&t[i[r]]===a)&&(t[i[r]]=e[i[r]]),r++;return t},"extend","Use `assign`."),E=y(function(t,e){return T(t,e,!0)},"merge","Use `assign`.");function _(t,e,n){var i,r=e.prototype;(i=t.prototype=Object.create(r)).constructor=t,i._super=r,n&&h(i,n)}function x(t,e){return function(){return t.apply(e,arguments)}}function I(t,e){return typeof t==l?t.apply(e&&e[0]||a,e):t}function D(t,e){return t===a?e:t}function b(t,e,n){g(R(e),function(e){t.addEventListener(e,n,!1)})}function P(t,e,n){g(R(e),function(e){t.removeEventListener(e,n,!1)})}function C(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1}function S(t,e){return t.indexOf(e)>-1}function R(t){return t.trim().split(/\s+/g)}function A(t,e,n){if(t.indexOf&&!n)return t.indexOf(e);for(var i=0;i<t.length;){if(n&&t[i][n]==e||!n&&t[i]===e)return i;i++}return-1}function w(t){return Array.prototype.slice.call(t,0)}function O(t,e,n){for(var i=[],r=[],s=0;s<t.length;){var o=e?t[s][e]:t[s];A(r,o)<0&&i.push(t[s]),r[s]=o,s++}return n&&(i=e?i.sort(function(t,n){return t[e]>n[e]}):i.sort()),i}function M(t,e){for(var n,i,r=e[0].toUpperCase()+e.slice(1),s=0;s<c.length;){if((i=(n=c[s])?n+r:e)in t)return i;s++}return a}var X=1;function Y(t){var e=t.ownerDocument||t;return e.defaultView||e.parentWindow||r}var N="ontouchstart"in r,z=M(r,"PointerEvent")!==a,L=N&&/mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),F=25,W=1,k=2,q=4,H=8,U=1,V=2,j=4,B=8,G=16,J=V|j,Z=B|G,K=J|Z,$=["x","y"],Q=["clientX","clientY"];function tt(t,e){var n=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,this.domHandler=function(e){I(t.options.enable,[t])&&n.handler(e)},this.init()}function et(t,e,n){var i=n.pointers.length,r=n.changedPointers.length,s=e&W&&i-r==0,o=e&(q|H)&&i-r==0;n.isFirst=!!s,n.isFinal=!!o,s&&(t.session={}),n.eventType=e,function(t,e){var n=t.session,i=e.pointers,r=i.length;n.firstInput||(n.firstInput=nt(e));r>1&&!n.firstMultiple?n.firstMultiple=nt(e):1===r&&(n.firstMultiple=!1);var s=n.firstInput,o=n.firstMultiple,h=o?o.center:s.center,c=e.center=it(i);e.timeStamp=v(),e.deltaTime=e.timeStamp-s.timeStamp,e.angle=at(h,c),e.distance=ot(h,c),function(t,e){var n=e.center,i=t.offsetDelta||{},r=t.prevDelta||{},s=t.prevInput||{};e.eventType!==W&&s.eventType!==q||(r=t.prevDelta={x:s.deltaX||0,y:s.deltaY||0},i=t.offsetDelta={x:n.x,y:n.y});e.deltaX=r.x+(n.x-i.x),e.deltaY=r.y+(n.y-i.y)}(n,e),e.offsetDirection=st(e.deltaX,e.deltaY);var u=rt(e.deltaTime,e.deltaX,e.deltaY);e.overallVelocityX=u.x,e.overallVelocityY=u.y,e.overallVelocity=f(u.x)>f(u.y)?u.x:u.y,e.scale=o?(l=o.pointers,p=i,ot(p[0],p[1],Q)/ot(l[0],l[1],Q)):1,e.rotation=o?function(t,e){return at(e[1],e[0],Q)+at(t[1],t[0],Q)}(o.pointers,i):0,e.maxPointers=n.prevInput?e.pointers.length>n.prevInput.maxPointers?e.pointers.length:n.prevInput.maxPointers:e.pointers.length,function(t,e){var n,i,r,s,o=t.lastInterval||e,h=e.timeStamp-o.timeStamp;if(e.eventType!=H&&(h>F||o.velocity===a)){var c=e.deltaX-o.deltaX,u=e.deltaY-o.deltaY,l=rt(h,c,u);i=l.x,r=l.y,n=f(l.x)>f(l.y)?l.x:l.y,s=st(c,u),t.lastInterval=e}else n=o.velocity,i=o.velocityX,r=o.velocityY,s=o.direction;e.velocity=n,e.velocityX=i,e.velocityY=r,e.direction=s}(n,e);var l,p;var d=t.element;C(e.srcEvent.target,d)&&(d=e.srcEvent.target);e.target=d}(t,n),t.emit("hammer.input",n),t.recognize(n),t.session.prevInput=n}function nt(t){for(var e=[],n=0;n<t.pointers.length;)e[n]={clientX:p(t.pointers[n].clientX),clientY:p(t.pointers[n].clientY)},n++;return{timeStamp:v(),pointers:e,center:it(e),deltaX:t.deltaX,deltaY:t.deltaY}}function it(t){var e=t.length;if(1===e)return{x:p(t[0].clientX),y:p(t[0].clientY)};for(var n=0,i=0,r=0;r<e;)n+=t[r].clientX,i+=t[r].clientY,r++;return{x:p(n/e),y:p(i/e)}}function rt(t,e,n){return{x:e/t||0,y:n/t||0}}function st(t,e){return t===e?U:f(t)>=f(e)?t<0?V:j:e<0?B:G}function ot(t,e,n){n||(n=$);var i=e[n[0]]-t[n[0]],r=e[n[1]]-t[n[1]];return Math.sqrt(i*i+r*r)}function at(t,e,n){n||(n=$);var i=e[n[0]]-t[n[0]],r=e[n[1]]-t[n[1]];return 180*Math.atan2(r,i)/Math.PI}tt.prototype={handler:function(){},init:function(){this.evEl&&b(this.element,this.evEl,this.domHandler),this.evTarget&&b(this.target,this.evTarget,this.domHandler),this.evWin&&b(Y(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&P(this.element,this.evEl,this.domHandler),this.evTarget&&P(this.target,this.evTarget,this.domHandler),this.evWin&&P(Y(this.element),this.evWin,this.domHandler)}};var ht={mousedown:W,mousemove:k,mouseup:q},ct="mousedown",ut="mousemove mouseup";function lt(){this.evEl=ct,this.evWin=ut,this.pressed=!1,tt.apply(this,arguments)}_(lt,tt,{handler:function(t){var e=ht[t.type];e&W&&0===t.button&&(this.pressed=!0),e&k&&1!==t.which&&(e=q),this.pressed&&(e&q&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:"mouse",srcEvent:t}))}});var pt={pointerdown:W,pointermove:k,pointerup:q,pointercancel:H,pointerout:H},ft={2:"touch",3:"pen",4:"mouse",5:"kinect"},vt="pointerdown",dt="pointermove pointerup pointercancel";function mt(){this.evEl=vt,this.evWin=dt,tt.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}r.MSPointerEvent&&!r.PointerEvent&&(vt="MSPointerDown",dt="MSPointerMove MSPointerUp MSPointerCancel"),_(mt,tt,{handler:function(t){var e=this.store,n=!1,i=t.type.toLowerCase().replace("ms",""),r=pt[i],s=ft[t.pointerType]||t.pointerType,o="touch"==s,a=A(e,t.pointerId,"pointerId");r&W&&(0===t.button||o)?a<0&&(e.push(t),a=e.length-1):r&(q|H)&&(n=!0),a<0||(e[a]=t,this.callback(this.manager,r,{pointers:e,changedPointers:[t],pointerType:s,srcEvent:t}),n&&e.splice(a,1))}});var gt={touchstart:W,touchmove:k,touchend:q,touchcancel:H},yt="touchstart",Tt="touchstart touchmove touchend touchcancel";function Et(){this.evTarget=yt,this.evWin=Tt,this.started=!1,tt.apply(this,arguments)}_(Et,tt,{handler:function(t){var e=gt[t.type];if(e===W&&(this.started=!0),this.started){var n=function(t,e){var n=w(t.touches),i=w(t.changedTouches);e&(q|H)&&(n=O(n.concat(i),"identifier",!0));return[n,i]}.call(this,t,e);e&(q|H)&&n[0].length-n[1].length==0&&(this.started=!1),this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t})}}});var _t={touchstart:W,touchmove:k,touchend:q,touchcancel:H},xt="touchstart touchmove touchend touchcancel";function It(){this.evTarget=xt,this.targetIds={},tt.apply(this,arguments)}_(It,tt,{handler:function(t){var e=_t[t.type],n=function(t,e){var n=w(t.touches),i=this.targetIds;if(e&(W|k)&&1===n.length)return i[n[0].identifier]=!0,[n,n];var r,s,o=w(t.changedTouches),a=[],h=this.target;if(s=n.filter(function(t){return C(t.target,h)}),e===W)for(r=0;r<s.length;)i[s[r].identifier]=!0,r++;r=0;for(;r<o.length;)i[o[r].identifier]&&a.push(o[r]),e&(q|H)&&delete i[o[r].identifier],r++;if(!a.length)return;return[O(s.concat(a),"identifier",!0),a]}.call(this,t,e);n&&this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t})}});var Dt=2500,bt=25;function Pt(){tt.apply(this,arguments);var t=x(this.handler,this);this.touch=new It(this.manager,t),this.mouse=new lt(this.manager,t),this.primaryTouch=null,this.lastTouches=[]}function Ct(t){var e=t.changedPointers[0];if(e.identifier===this.primaryTouch){var n={x:e.clientX,y:e.clientY};this.lastTouches.push(n);var i=this.lastTouches;setTimeout(function(){var t=i.indexOf(n);t>-1&&i.splice(t,1)},Dt)}}_(Pt,tt,{handler:function(t,e,n){var i="touch"==n.pointerType,r="mouse"==n.pointerType;if(!(r&&n.sourceCapabilities&&n.sourceCapabilities.firesTouchEvents)){if(i)(function(t,e){t&W?(this.primaryTouch=e.changedPointers[0].identifier,Ct.call(this,e)):t&(q|H)&&Ct.call(this,e)}).call(this,e,n);else if(r&&function(t){for(var e=t.srcEvent.clientX,n=t.srcEvent.clientY,i=0;i<this.lastTouches.length;i++){var r=this.lastTouches[i],s=Math.abs(e-r.x),o=Math.abs(n-r.y);if(s<=bt&&o<=bt)return!0}return!1}.call(this,n))return;this.callback(t,e,n)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var St=M(u.style,"touchAction"),Rt=St!==a,At="auto",wt="manipulation",Ot="none",Mt="pan-x",Xt="pan-y",Yt=function(){if(!Rt)return!1;var t={},e=r.CSS&&r.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(n){t[n]=!e||r.CSS.supports("touch-action",n)}),t}();function Nt(t,e){this.manager=t,this.set(e)}Nt.prototype={set:function(t){"compute"==t&&(t=this.compute()),Rt&&this.manager.element.style&&Yt[t]&&(this.manager.element.style[St]=t),this.actions=t.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var t=[];return g(this.manager.recognizers,function(e){I(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))}),function(t){if(S(t,Ot))return Ot;var e=S(t,Mt),n=S(t,Xt);if(e&&n)return Ot;if(e||n)return e?Mt:Xt;if(S(t,wt))return wt;return At}(t.join(" "))},preventDefaults:function(t){var e=t.srcEvent,n=t.offsetDirection;if(this.manager.session.prevented)e.preventDefault();else{var i=this.actions,r=S(i,Ot)&&!Yt[Ot],s=S(i,Xt)&&!Yt[Xt],o=S(i,Mt)&&!Yt[Mt];if(r){var a=1===t.pointers.length,h=t.distance<2,c=t.deltaTime<250;if(a&&h&&c)return}if(!o||!s)return r||s&&n&J||o&&n&Z?this.preventSrc(e):void 0}},preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault()}};var zt=1,Lt=2,Ft=4,Wt=8,kt=Wt,qt=16;function Ht(t){this.options=h({},this.defaults,t||{}),this.id=X++,this.manager=null,this.options.enable=D(this.options.enable,!0),this.state=zt,this.simultaneous={},this.requireFail=[]}function Ut(t){return t&qt?"cancel":t&Wt?"end":t&Ft?"move":t&Lt?"start":""}function Vt(t){return t==G?"down":t==B?"up":t==V?"left":t==j?"right":""}function jt(t,e){var n=e.manager;return n?n.get(t):t}function Bt(){Ht.apply(this,arguments)}function Gt(){Bt.apply(this,arguments),this.pX=null,this.pY=null}function Jt(){Bt.apply(this,arguments)}function Zt(){Ht.apply(this,arguments),this._timer=null,this._input=null}function Kt(){Bt.apply(this,arguments)}function $t(){Bt.apply(this,arguments)}function Qt(){Ht.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function te(t,e){return(e=e||{}).recognizers=D(e.recognizers,te.defaults.preset),new ee(t,e)}Ht.prototype={defaults:{},set:function(t){return h(this.options,t),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(t){if(m(t,"recognizeWith",this))return this;var e=this.simultaneous;return e[(t=jt(t,this)).id]||(e[t.id]=t,t.recognizeWith(this)),this},dropRecognizeWith:function(t){return m(t,"dropRecognizeWith",this)?this:(t=jt(t,this),delete this.simultaneous[t.id],this)},requireFailure:function(t){if(m(t,"requireFailure",this))return this;var e=this.requireFail;return-1===A(e,t=jt(t,this))&&(e.push(t),t.requireFailure(this)),this},dropRequireFailure:function(t){if(m(t,"dropRequireFailure",this))return this;t=jt(t,this);var e=A(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(t){return!!this.simultaneous[t.id]},emit:function(t){var e=this,n=this.state;function i(n){e.manager.emit(n,t)}n<Wt&&i(e.options.event+Ut(n)),i(e.options.event),t.additionalEvent&&i(t.additionalEvent),n>=Wt&&i(e.options.event+Ut(n))},tryEmit:function(t){if(this.canEmit())return this.emit(t);this.state=32},canEmit:function(){for(var t=0;t<this.requireFail.length;){if(!(this.requireFail[t].state&(32|zt)))return!1;t++}return!0},recognize:function(t){var e=h({},t);if(!I(this.options.enable,[this,e]))return this.reset(),void(this.state=32);this.state&(kt|qt|32)&&(this.state=zt),this.state=this.process(e),this.state&(Lt|Ft|Wt|qt)&&this.tryEmit(e)},process:function(t){},getTouchAction:function(){},reset:function(){}},_(Bt,Ht,{defaults:{pointers:1},attrTest:function(t){var e=this.options.pointers;return 0===e||t.pointers.length===e},process:function(t){var e=this.state,n=t.eventType,i=e&(Lt|Ft),r=this.attrTest(t);return i&&(n&H||!r)?e|qt:i||r?n&q?e|Wt:e&Lt?e|Ft:Lt:32}}),_(Gt,Bt,{defaults:{event:"pan",threshold:10,pointers:1,direction:K},getTouchAction:function(){var t=this.options.direction,e=[];return t&J&&e.push(Xt),t&Z&&e.push(Mt),e},directionTest:function(t){var e=this.options,n=!0,i=t.distance,r=t.direction,s=t.deltaX,o=t.deltaY;return r&e.direction||(e.direction&J?(r=0===s?U:s<0?V:j,n=s!=this.pX,i=Math.abs(t.deltaX)):(r=0===o?U:o<0?B:G,n=o!=this.pY,i=Math.abs(t.deltaY))),t.direction=r,n&&i>e.threshold&&r&e.direction},attrTest:function(t){return Bt.prototype.attrTest.call(this,t)&&(this.state&Lt||!(this.state&Lt)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=Vt(t.direction);e&&(t.additionalEvent=this.options.event+e),this._super.emit.call(this,t)}}),_(Jt,Bt,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Ot]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||this.state&Lt)},emit:function(t){if(1!==t.scale){var e=t.scale<1?"in":"out";t.additionalEvent=this.options.event+e}this._super.emit.call(this,t)}}),_(Zt,Ht,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[At]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,r=t.deltaTime>e.time;if(this._input=t,!i||!n||t.eventType&(q|H)&&!r)this.reset();else if(t.eventType&W)this.reset(),this._timer=d(function(){this.state=kt,this.tryEmit()},e.time,this);else if(t.eventType&q)return kt;return 32},reset:function(){clearTimeout(this._timer)},emit:function(t){this.state===kt&&(t&&t.eventType&q?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=v(),this.manager.emit(this.options.event,this._input)))}}),_(Kt,Bt,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Ot]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||this.state&Lt)}}),_($t,Bt,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:J|Z,pointers:1},getTouchAction:function(){return Gt.prototype.getTouchAction.call(this)},attrTest:function(t){var e,n=this.options.direction;return n&(J|Z)?e=t.overallVelocity:n&J?e=t.overallVelocityX:n&Z&&(e=t.overallVelocityY),this._super.attrTest.call(this,t)&&n&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers==this.options.pointers&&f(e)>this.options.velocity&&t.eventType&q},emit:function(t){var e=Vt(t.offsetDirection);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)}}),_(Qt,Ht,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[wt]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,r=t.deltaTime<e.time;if(this.reset(),t.eventType&W&&0===this.count)return this.failTimeout();if(i&&r&&n){if(t.eventType!=q)return this.failTimeout();var s=!this.pTime||t.timeStamp-this.pTime<e.interval,o=!this.pCenter||ot(this.pCenter,t.center)<e.posThreshold;if(this.pTime=t.timeStamp,this.pCenter=t.center,o&&s?this.count+=1:this.count=1,this._input=t,0===this.count%e.taps)return this.hasRequireFailures()?(this._timer=d(function(){this.state=kt,this.tryEmit()},e.interval,this),Lt):kt}return 32},failTimeout:function(){return this._timer=d(function(){this.state=32},this.options.interval,this),32},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==kt&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),te.VERSION="2.0.7",te.defaults={domEvents:!1,touchAction:"compute",enable:!0,inputTarget:null,inputClass:null,preset:[[Kt,{enable:!1}],[Jt,{enable:!1},["rotate"]],[$t,{direction:J}],[Gt,{direction:J},["swipe"]],[Qt],[Qt,{event:"doubletap",taps:2},["tap"]],[Zt]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};function ee(t,e){var n;this.options=h({},te.defaults,e||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=t,this.input=new((n=this).options.inputClass||(z?mt:L?It:N?Pt:lt))(n,et),this.touchAction=new Nt(this,this.options.touchAction),ne(this,!0),g(this.options.recognizers,function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])},this)}function ne(t,e){var n,i=t.element;i.style&&(g(t.options.cssProps,function(r,s){n=M(i.style,s),e?(t.oldCssProps[n]=i.style[n],i.style[n]=r):i.style[n]=t.oldCssProps[n]||""}),e||(t.oldCssProps={}))}ee.prototype={set:function(t){return h(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this},stop:function(t){this.session.stopped=t?2:1},recognize:function(t){var e=this.session;if(!e.stopped){var n;this.touchAction.preventDefaults(t);var i=this.recognizers,r=e.curRecognizer;(!r||r&&r.state&kt)&&(r=e.curRecognizer=null);for(var s=0;s<i.length;)n=i[s],2===e.stopped||r&&n!=r&&!n.canRecognizeWith(r)?n.reset():n.recognize(t),!r&&n.state&(Lt|Ft|Wt)&&(r=e.curRecognizer=n),s++}},get:function(t){if(t instanceof Ht)return t;for(var e=this.recognizers,n=0;n<e.length;n++)if(e[n].options.event==t)return e[n];return null},add:function(t){if(m(t,"add",this))return this;var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},remove:function(t){if(m(t,"remove",this))return this;if(t=this.get(t)){var e=this.recognizers,n=A(e,t);-1!==n&&(e.splice(n,1),this.touchAction.update())}return this},on:function(t,e){if(t!==a&&e!==a){var n=this.handlers;return g(R(t),function(t){n[t]=n[t]||[],n[t].push(e)}),this}},off:function(t,e){if(t!==a){var n=this.handlers;return g(R(t),function(t){e?n[t]&&n[t].splice(A(n[t],e),1):delete n[t]}),this}},emit:function(t,e){this.options.domEvents&&function(t,e){var n=s.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e,e.target.dispatchEvent(n)}(t,e);var n=this.handlers[t]&&this.handlers[t].slice();if(n&&n.length){e.type=t,e.preventDefault=function(){e.srcEvent.preventDefault()};for(var i=0;i<n.length;)n[i](e),i++}},destroy:function(){this.element&&ne(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(te,{INPUT_START:W,INPUT_MOVE:k,INPUT_END:q,INPUT_CANCEL:H,STATE_POSSIBLE:zt,STATE_BEGAN:Lt,STATE_CHANGED:Ft,STATE_ENDED:Wt,STATE_RECOGNIZED:kt,STATE_CANCELLED:qt,STATE_FAILED:32,DIRECTION_NONE:U,DIRECTION_LEFT:V,DIRECTION_RIGHT:j,DIRECTION_UP:B,DIRECTION_DOWN:G,DIRECTION_HORIZONTAL:J,DIRECTION_VERTICAL:Z,DIRECTION_ALL:K,Manager:ee,Input:tt,TouchAction:Nt,TouchInput:It,MouseInput:lt,PointerEventInput:mt,TouchMouseInput:Pt,SingleTouchInput:Et,Recognizer:Ht,AttrRecognizer:Bt,Tap:Qt,Pan:Gt,Swipe:$t,Pinch:Jt,Rotate:Kt,Press:Zt,on:b,off:P,each:g,merge:E,extend:T,assign:h,inherit:_,bindFn:x,prefixed:M}),(void 0!==r?r:"undefined"!=typeof self?self:{}).Hammer=te,(i=function(){return te}.call(e,n,e,t))===a||(t.exports=i)}(window,document)},s7r6:function(t,e,n){var i,r=n("I3q/"),s=n("2Gtp");r.isWx||r.isMy||(i=n("rxKx"));var o=["touchstart","touchmove","touchend"],a=function(){var t=e.prototype;function e(t,e){var n=this.getDefaultCfg();r.deepMix(this,n,t),this.chart=e,this.canvas=e.get("canvas"),this.el=e.get("canvas").get("el"),this._bindEvents()}return t.getDefaultCfg=function(){return{startEvent:o[0],processEvent:o[1],endEvent:o[2],resetEvent:null}},t._start=function(t){this.preStart&&this.preStart(t),this.start(t),this.onStart&&this.onStart(t)},t._process=function(t){this.preProcess&&this.preProcess(t),this.process(t),this.onProcess&&this.onProcess(t)},t._end=function(t){this.preEnd&&this.preEnd(t),this.end(t),this.onEnd&&this.onEnd(t)},t._reset=function(t){this.preReset&&this.preReset(t),this.reset(t),this.onReset&&this.onReset(t)},t.start=function(){},t.process=function(){},t.end=function(){},t.reset=function(){},t._bindEvents=function(){this._clearEvents();var t=this.startEvent,e=this.processEvent,n=this.endEvent,r=this.resetEvent,s=this.el;i&&(this.hammer=new i(s)),this._bindEvent(t,"_start"),this._bindEvent(e,"_process"),this._bindEvent(n,"_end"),this._bindEvent(r,"_reset")},t._clearEvents=function(){var t=this.startEvent,e=this.processEvent,n=this.endEvent,i=this.resetEvent;this.hammer&&(this.hammer.destroy(),this.hammer=null),this._clearTouchEvent(t,"_start"),this._clearTouchEvent(e,"_process"),this._clearTouchEvent(n,"_end"),this._clearTouchEvent(i,"_reset")},t._bindEvent=function(t,e){var n=this.el;t&&(-1!==o.indexOf(t)?r.addEventListener(n,t,r.wrapBehavior(this,e)):this.hammer&&this.hammer.on(t,r.wrapBehavior(this,e)))},t._clearTouchEvent=function(t,e){var n=this.el;t&&-1!==o.indexOf(t)&&r.removeEventListener(n,t,r.getWrapBehavior(this,e))},t.destroy=function(){this._clearEvents()},e}();s._Interactions={},s.registerInteraction=function(t,e){s._Interactions[t]=e},s.getInteraction=function(t){return s._Interactions[t]},s.prototype.interaction=function(t,e){var n=this._interactions||{};n[t]&&n[t].destroy();var i=new(s.getInteraction(t))(e,this);return n[t]=i,this._interactions=n,this},s.prototype.clearInteraction=function(t){var e=this._interactions;if(e)return t?(e[t]&&e[t].destroy(),delete e[t]):r.each(e,function(t,n){t.destroy(),delete e[n]}),this},t.exports=a}});