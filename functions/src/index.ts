import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// Firestore is in eur3, so functions live in the closest supported region.
setGlobalOptions({ region: "europe-west1", maxInstances: 10 });

initializeApp();
const db = getFirestore();

const APP_LINK = "https://evaboen.github.io/indisk-torsdag/#/arrangements";

/** FCM rejects these tokens for good - drop them from the user document. */
const DEAD_TOKEN_CODES = [
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument",
];

export const notifyOnNewComment = onDocumentCreated(
  "comments/{commentId}",
  async (event) => {
    const comment = event.data?.data();
    if (!comment) return;

    const { arrangementId, createdBy, text } = comment as {
      arrangementId?: string;
      createdBy?: string;
      text?: string;
    };

    if (!arrangementId || !createdBy) {
      logger.warn("Comment is missing arrangementId or createdBy", {
        commentId: event.params.commentId,
      });
      return;
    }

    const arrangementSnap = await db
      .collection("Arrangements")
      .doc(arrangementId)
      .get();

    if (!arrangementSnap.exists) {
      logger.warn("Comment points at an arrangement that is gone", {
        arrangementId,
      });
      return;
    }

    const arrangement = arrangementSnap.data() ?? {};
    const attending: string[] = arrangement.attendingEmails ?? [];

    // Only people attending, and never the person who just wrote the comment.
    const recipients = attending.filter((email) => email !== createdBy);
    if (recipients.length === 0) return;

    const userSnaps = await db.getAll(
      ...recipients.map((email) => db.collection("Users").doc(email))
    );

    // Keep the email next to each token so a dead token can be cleaned up.
    const targets: { email: string; token: string }[] = [];
    for (const snap of userSnaps) {
      const tokens: string[] = snap.data()?.fcmTokens ?? [];
      for (const token of tokens) {
        targets.push({ email: snap.id, token });
      }
    }

    if (targets.length === 0) {
      logger.info("Nobody attending has a registered device", {
        arrangementId,
      });
      return;
    }

    const authorSnap = await db.collection("Users").doc(createdBy).get();
    const authorName = authorSnap.data()?.nickname || createdBy;
    const title = `Ny kommentar på ${arrangement.title ?? "et arrangement"}`;
    const body = `${authorName}: ${text ?? ""}`.slice(0, 200);

    // Data-only on purpose: the service worker draws the notification, so it
    // does not appear twice.
    const response = await getMessaging().sendEachForMulticast({
      tokens: targets.map((target) => target.token),
      data: { title, body, link: APP_LINK, arrangementId },
      webpush: { headers: { Urgency: "high" } },
    });

    logger.info("Sent comment notifications", {
      arrangementId,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

    const cleanups = new Map<string, string[]>();
    response.responses.forEach((result, index) => {
      const code = result.error?.code;
      if (result.success || !code || !DEAD_TOKEN_CODES.includes(code)) return;

      const { email, token } = targets[index];
      cleanups.set(email, [...(cleanups.get(email) ?? []), token]);
    });

    await Promise.all(
      Array.from(cleanups.entries()).map(([email, tokens]) =>
        db
          .collection("Users")
          .doc(email)
          .update({ fcmTokens: FieldValue.arrayRemove(...tokens) })
      )
    );
  }
);
