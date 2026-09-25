import { useEffect, useState } from "react";
import styled from "styled-components";

import { IUserProfile } from "../firebase/dbUtils";
import {
  enableNotifications,
  listenForForegroundMessages,
  notificationPermission,
  notificationsSupported,
} from "../firebase/messaging";

const DISMISSED_KEY = "notificationsPromptDismissed";

type IProps = {
  user: IUserProfile;
};

export const NotificationPrompt = (props: IProps) => {
  const { user } = props;
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!user.email) return;
      if (!(await notificationsSupported())) return;

      const permission = notificationPermission();

      // Already said yes: quietly refresh the token, it can rotate.
      if (permission === "granted") {
        enableNotifications(user.email);
        return;
      }

      const dismissed = localStorage.getItem(DISMISSED_KEY) === "true";
      if (permission === "default" && !dismissed && !cancelled) {
        setVisible(true);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [user.email]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    listenForForegroundMessages().then((fn) => {
      unsubscribe = fn;
    });
    return () => unsubscribe?.();
  }, []);

  const handleAccept = async () => {
    if (!user.email) return;
    setBusy(true);
    await enableNotifications(user.email);
    setBusy(false);
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Banner>
      <span>Vil du ha varsel når noen kommenterer på noe du skal på?</span>
      <Buttons>
        <AcceptButton onClick={handleAccept} disabled={busy}>
          {busy ? "Et øyeblikk..." : "Ja takk"}
        </AcceptButton>
        <DismissButton onClick={handleDismiss} disabled={busy}>
          Nei
        </DismissButton>
      </Buttons>
    </Banner>
  );
};

const Banner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background-color: rgb(134, 255, 202);
  padding: 10px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const AcceptButton = styled.button`
  padding: 8px 12px;
  background-color: rgb(169, 69, 169);
  color: white;
  border: none;
  border-radius: 5px;
`;

const DismissButton = styled.button`
  padding: 8px 12px;
  background: none;
  border: none;
  text-decoration: underline;
`;
