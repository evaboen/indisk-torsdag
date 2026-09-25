import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import { app, db } from "./firebase";

const VAPID_KEY = process.env.REACT_APP_VAPID_KEY;

// CRA sets PUBLIC_URL from the "homepage" field, so this resolves to
// /indisk-torsdag on GitHub Pages and "" when running locally.
const SW_URL = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
const SW_SCOPE = `${process.env.PUBLIC_URL}/`;

export const notificationsSupported = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return false;
  }
  return isSupported();
};

export const notificationPermission = (): NotificationPermission | "unsupported" => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
};

/**
 * Asks for permission (if not already answered), fetches an FCM token and
 * stores it on the user's Firestore document. Safe to call again on every
 * app start - tokens rotate, and arrayUnion keeps the list free of duplicates.
 */
export const enableNotifications = async (email: string): Promise<boolean> => {
  if (!(await notificationsSupported())) {
    console.warn("Push notifications are not supported in this browser.");
    return false;
  }

  if (!VAPID_KEY) {
    console.warn("REACT_APP_VAPID_KEY is missing - cannot register for push.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    const registration = await navigator.serviceWorker.register(SW_URL, {
      scope: SW_SCOPE,
    });

    const token = await getToken(getMessaging(app), {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return false;

    await updateDoc(doc(db, "Users", email), { fcmTokens: arrayUnion(token) });
    return true;
  } catch (error) {
    console.error("Could not enable notifications:", error);
    return false;
  }
};

/**
 * Shows a notification while the tab is in the foreground - the service
 * worker only gets the message when the page is in the background.
 */
export const listenForForegroundMessages = async (): Promise<() => void> => {
  if (!(await notificationsSupported())) return () => {};

  return onMessage(getMessaging(app), (payload) => {
    const { title, body, link, arrangementId } = payload.data ?? {};
    if (Notification.permission !== "granted") return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title || "Indisk torsdag", {
        body: body || "",
        icon: `${process.env.PUBLIC_URL}/logo192.png`,
        tag: arrangementId || "indisk-torsdag",
        data: { link: link || SW_SCOPE },
      });
    });
  });
};
