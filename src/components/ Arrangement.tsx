import react from "react";
import { IArrangement } from "../firebase/dbUtils";
import styled from "styled-components";

type IArrangementProps = {
  arrangement: IArrangement;
};

export const Arrangement = (props: IArrangementProps) => {
  return (
    <ArrangementCard>
      <h2>{props.arrangement.title}</h2>
      <p>
        Når?: {props.arrangement.startTime} - {props.arrangement.endTime}
      </p>
      <p>Hva skjer?: {props.arrangement.description}</p>
    </ArrangementCard>
  );
};

const ArrangementCard = styled.div`
  width: 100%;
  background-color: yellow;
  margin: 10px;
  padding: 10px
`;
