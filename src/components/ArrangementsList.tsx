import { useEffect, useState } from "react";
import {  fetchData, IArrangement } from "../firebase/dbUtils";
import { Arrangement } from "./ Arrangement";
import styled from 'styled-components';


export default function ArrangementsList() {
  const [arrangements, setArrangements] = useState<IArrangement[]>([]);

  useEffect(() => {
    fetchData().then((d) => {
      if (d !== undefined) {
        setArrangements(d);
      }
    });
  }, []);

  return (
    <ArrangementListWrapper>
      {arrangements.map((arrangement: IArrangement) => {
        return <Arrangement arrangement={arrangement}/>
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
