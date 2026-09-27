import { useState } from "react";
import {
  attendArrangement,
  notAttendArrangement,
  deleteArrangement,
  IArrangement,
  IUserProfile,
} from "../firebase/dbUtils";
import styled from "styled-components";
import moment from "moment";
import { Comments } from "./Comments";
import { ProfilePictureAndName } from "./PrfilePictreAndName";
import { AttendingList } from "./AtendingList";

type IArrangementProps = {
  arrangement: IArrangement;
  user: IUserProfile;
};

export const Arrangement = (props: IArrangementProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleAttend = () => {
    const arrangementId = props.arrangement.id;
    const email = props.user.email;
    if (!arrangementId || !email) {
      return;
    }
    attendArrangement(arrangementId, email);
  };
  const handleNotAttend = () => {
    const arrangementId = props.arrangement.id;
    const email = props.user.email;
    if (!arrangementId || !email) {
      return;
    }
    notAttendArrangement(arrangementId, email);
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
    "dddd DD.MMM HH:mm"
  );

  const isAttending = props.arrangement.attendingEmails?.includes(
    props.user.email
  );
  const isNotAttending = props.arrangement.notAttendingEmails?.includes(
    props.user.email
  );
  const isUnansward = !isAttending && !isNotAttending;

  const deleteVisible =
    props.user.email === "erlendvaboen@gmail.com" ||
    props.user.email === props.arrangement.createdByEmail;

  const Confirmation = () => {
    if (deleteModalOpen) {
      return (
        <div>
          <DeleteButton onClick={handleDelete}>ja slett den</DeleteButton>
          <DeleteButton onClick={() => setDeleteModalOpen(false)}>
            nei, ombestemt meg
          </DeleteButton>
        </div>
      );
    }
    return (
      <div>
        <DeleteButton onClick={() => setDeleteModalOpen(true)}>
          slett den!
        </DeleteButton>
      </div>
    );
  };

  const attendingCount = props.arrangement.attendingEmails?.length ?? 0;

  return (
    <ArrangementCard>
      <TitleDiv>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>{props.arrangement.title}</h2> <p>{startTime}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ProfilePictureAndName email={props.arrangement.createdByEmail} />
          {deleteVisible && <Confirmation />}
        </div>
      </TitleDiv>

      <p>{props.arrangement.description}</p>
      <div style={{ display: "flex" }}>
        <AttendingList
          header="På meldt"
          emails={props.arrangement.attendingEmails}
        />
        <AttendingList
          header="meldt av"
          emails={props.arrangement.notAttendingEmails}
        />
      </div>
      <div style={{ display: "flex" }}>
        {(isNotAttending || isUnansward) && (
          <AttendButton onClick={handleAttend}>meld deg på</AttendButton>
        )}
        {(isAttending || isUnansward) && (
          <NotAttendButton onClick={handleNotAttend}>
            Dette vil jeg IKKE på!
          </NotAttendButton>
        )}
      </div>
      <Comments user={props.user} arrangement={props.arrangement} />
    </ArrangementCard>
  );
};

const ArrangementCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: yellow;
  margin: 10px;
  padding: 10px;
`;

const TitleDiv = styled.div`
  width: 100%;
  border-color: red;
  border-bottom: 1px;
`;
const AttendButton = styled.button`
  width: 120px;
  background: rgb(9, 230, 20);
`;
const NotAttendButton = styled.button`
  width: 120px;
  background: rgb(136, 38, 38);
`;
const DeleteButton = styled.button`
  width: 120px;
  background: rgb(201, 17, 137);
  color: white;
`;
