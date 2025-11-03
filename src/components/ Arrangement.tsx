import { useState } from "react";
import {
  attendArrangement,
  deleteArrangement,
  IArrangement,
  IUserProfile,
} from "../firebase/dbUtils";
import styled from "styled-components";
import moment from "moment";
import { Comments } from "./Comments";
import { ProfilePictureAndName } from "./PrfilePictreAndName";

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
      <b>
        {attendingCount > 0
          ? `meldt på (${attendingCount}):`
          : "...ingen påmeldte :("}
      </b>
      {props.arrangement.attendingEmails?.map((email) => (
        <ProfilePictureAndName notBold imageSize={30} email={email} />
      ))}
      <AttendButton onClick={handleAttend}>meld deg på</AttendButton>
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
const DeleteButton = styled.button`
  width: 120px;
  background: rgb(201, 17, 137);
  color: white;
`;
