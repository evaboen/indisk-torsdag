/* eslint-disable no-undef */
// Service worker for background push. This file runs outside the React bundle,
// so the config has to be hardcoded - process.env is not available here.
importScripts("https://www.gstatic.com/firebasejs/11.2.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDc-9ZY-GkTctbdS02kLEia_csYfMeHyNQ",
  authDomain: "indisk-torsdag.firebaseapp.com",
  projectId: "indisk-torsdag",
  storageBucket: "indisk-torsdag.firebasestorage.app",
  messagingSenderId: "989609146773",
  appId: "1:989609146773:web:9c2bd9b530ead06ee49e9c",
  measurementId: "G-V9PH9BS0CR",
});

const messaging = firebase.messaging();

// The functions send data-only messages, so we draw the notification ourselves.
// (A "notification" payload would be shown by the browser *and* here - twice.)
messaging.onBackgroundMessage((payload) => {
  const { title, body, link } = payload.data || {};

  self.registration.showNotification(title || "Indisk torsdag", {
    body: body || "",
    icon: "/indisk-torsdag/logo192.png",
    badge: "/indisk-torsdag/logo192.png",
    tag: payload.data?.arrangementId || "indisk-torsdag",
    data: { link: link || "/indisk-torsdag/" },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link || "/indisk-torsdag/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes("/indisk-torsdag") && "focus" in client) {
            client.navigate(link);
            return client.focus();
          }
        }
        return clients.openWindow(link);
      })
  );
});
