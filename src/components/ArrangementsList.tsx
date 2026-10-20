import { useEffect, useState } from "react";
import { fetchData, IArrangement, IUserProfile } from "../firebase/dbUtils";
import { Arrangement } from "./ Arrangement";
import styled from "styled-components";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface IProps {
  user: IUserProfile;
}
export default function ArrangementsList(props: IProps) {
  const [arrangements, setArrangements] = useState<IArrangement[]>([]);

  useEffect(() => {
    const loadArrangements = async () => {
      const data = await fetchData(props.user.email);
      setArrangements(data);
    };

    loadArrangements();
  }, [props.user.email]);

  return (
    <ArrangementListWrapper>
      {arrangements.map((arrangement: IArrangement) => {
        return (
          <Arrangement
            key={arrangement.id}
            arrangement={arrangement}
            user={props.user}
          />
        );
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
