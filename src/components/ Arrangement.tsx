import react, { useState } from "react";
import {
  attendArrangement,
  deleteArrangement,
  IArrangement,
} from "../firebase/dbUtils";
import styled from "styled-components";
import { UserCredential } from "firebase/auth";
import moment from "moment";
import { Comments } from "./Comments";

type IArrangementProps = {
  arrangement: IArrangement;
  user: UserCredential;
};

export const Arrangement = (props: IArrangementProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleAttend = () => {
    const arrangementId = props.arrangement.id;
    const email = props.user.user.email;
    if (!arrangementId || !email) {
      return;
    }

    attendArrangement(arrangementId, email);
  };

  const handleDelete = () => {
    const arrangementId = props.arrangement.id;
    if (!arrangementId) {
      return;
    }
    deleteArrangement(arrangementId);
    setDeleteModalOpen(false);
  };

  const startTime = moment(props.arrangement.startTime).format(
    "dd.mm.yy HH:mm"
  );

  const deleteVisible =
    props.user.user.email === "erlendvaboen@gmail.com" ||
    props.user.user.email === props.arrangement.createdByEmail;

  const Confirmation = () => {
    if (deleteModalOpen) {
      return (
        <div>
          <button onClick={handleDelete}>ja slett den</button>
          <button onClick={() => setDeleteModalOpen(false)}>
            nei, ombestemt meg
          </button>
        </div>
      );
    }
    return (
      <div>
        <button onClick={() => setDeleteModalOpen(true)}>slett den!</button>
      </div>
    );
  };

  return (
    <ArrangementCard>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{props.arrangement.title}</h2> {deleteVisible && <Confirmation />}
      </div>
      <p>Når?: {startTime}</p>
      <p>Hva skjer?: {props.arrangement.description}</p>
      <p>laget av: {props.arrangement.createdByEmail}</p>
      <p>meldt på: {props.arrangement.attendingEmails?.join(", ")}</p>
      <button onClick={handleAttend}>meld deg på</button>
      <Comments user={props.user} arrangement={props.arrangement} />
    </ArrangementCard>
  );
};

const ArrangementCard = styled.div`
  width: 100%;
  background-color: yellow;
  margin: 10px;
  padding: 10px;
`;
