import react from "react";
import { attendArrangement, IArrangement } from "../firebase/dbUtils";
import styled from "styled-components";
import { UserCredential } from "firebase/auth";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";

type IArrangementProps = {
  arrangement: IArrangement;
  user: UserCredential
};

export const Arrangement = (props: IArrangementProps) => {


  const handleAttend = () => {
      const arrangementId = props.arrangement.id
      const email = props.user.user.email
      console.log(arrangementId, email)
      if (!arrangementId || !email) {
        return
      }
        
      return attendArrangement(arrangementId, email)
  }

  return (
    <ArrangementCard>
      <h2>{props.arrangement.title}</h2>
      <p>
        Når?: {props.arrangement.startTime} - {props.arrangement.endTime}
      </p>
      <p>Hva skjer?: {props.arrangement.description}</p>
      <p>laget av: {props.arrangement.createdByEmail}</p>
      <p>meldt på: {props.arrangement.attendingEmails?.join(',')}</p>
      <button onClick={handleAttend}>meld deg på</button>
      <p>id: {props.arrangement.id}</p>
    </ArrangementCard>
  );
};

const ArrangementCard = styled.div`
  width: 100%;
  background-color: yellow;
  margin: 10px;
  padding: 10px
`;
