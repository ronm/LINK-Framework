"use strict";var $http=function e(t){var n=function e(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return new Promise(function(e,a){var o=new XMLHttpRequest,u=[];if(o.addEventListener("load",function(){return o.status>=200&&o.status<300?e(o):a(o)}),r.data){for(var d in r.data)r.data.hasOwnProperty(d)&&u.push(encodeURI(d)+"="+encodeURI(r.data[d]));t+="?"+u.join("&")}o.addEventListener("error",function(){return a(o)}),o.open(n,t),r.data&&o.setRequestHeader("Content-type","application/x-www-form-urlencoded"),r.headers&&r.headers.forEach(function(e){var t=Object.keys(e)[0];o.setRequestHeader(t,e[t])}),o.send()})},r={};return["get","post","put","delete"].forEach(function(e){return r[e]=function(t){return n(e,t)}}),r};module.exports=$http;