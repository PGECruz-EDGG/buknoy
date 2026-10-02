/* BUKNOY push alerts — service worker (Firebase Cloud Messaging). Keep this file next to index.html. */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyB6CnmjSlv7Q6-FiulCoNQrmZc0QY49bWM",authDomain:"edgg-monitor.firebaseapp.com",databaseURL:"https://edgg-monitor-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"edgg-monitor",storageBucket:"edgg-monitor.firebasestorage.app",messagingSenderId:"694214407857",appId:"1:694214407857:web:158238dacce968f2cf9490"});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(p=>{const d=(p&&p.data)||{};return self.registration.showNotification(d.title||"BUKNOY",{body:d.body||"",icon:"buknoy-192.png",badge:"buknoy-192.png",tag:d.tag||"buknoy",renotify:true,requireInteraction:true,vibrate:[700,250,700,250,700,250,1400],data:{url:d.url||self.registration.scope}});});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(ws=>{for(const w of ws){if(w.url.indexOf(self.registration.scope)===0&&"focus" in w)return w.focus();}return clients.openWindow(url);}));});
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
