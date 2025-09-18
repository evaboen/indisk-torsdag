import { UserCredential } from "firebase/auth";
import styled from "styled-components";
import { logOut } from '../firebase/auth';


type IHeadeProps = {
  onOpenModal: () => void;
  newArrangmentOpen: boolean;
  setUser: (user: UserCredential | undefined) => void
};

export function Header(props: IHeadeProps) {

  const handleLogOut = async () => {
    await logOut();
    props.setUser(undefined)
    sessionStorage.removeItem("signedInUser");

};

  return (
    <HeaderLine>
      <h1>INDISKTORSDAG</h1>
      <button onClick={props.onOpenModal}>
        {props.newArrangmentOpen ? "Til arrangementer" : "Ny Torsdag?"}
      </button>
      <button style={{borderRadius: '50%'}}onClick={handleLogOut} >logout</button>
    </HeaderLine>
  );
}

const HeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgb(104,191,213);
  padding: 10px;
  position: sticky;
  top: 0;
  border: 1px solid red;
  borderRadius: 50%
`;
