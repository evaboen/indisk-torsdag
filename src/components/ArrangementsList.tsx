import { useEffect, useState } from "react";
import {  fetchData, IArrangement } from "../firebase/dbUtils";
import { Arrangement } from "./ Arrangement";
import styled from 'styled-components';
import { UserCredential } from "firebase/auth";

interface IProps {
  user: UserCredential
}
export default function ArrangementsList(props: IProps) {
  const [arrangements, setArrangements] = useState<IArrangement[]>([]);

  useEffect(() => {
    fetchData().then((d) => {
      if (d !== undefined) {
        d.sort((a,b )=> b.startTime.localeCompare(a.startTime))
        setArrangements(d);
      }
    });
  }, []);

  return (
    <ArrangementListWrapper>
      {arrangements.map((arrangement: IArrangement) => {
        return <Arrangement key={arrangement.id} arrangement={arrangement} user={props.user}/>
      })}
    </ArrangementListWrapper>
  );
}

const ArrangementListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: blue;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 100%;
`;
