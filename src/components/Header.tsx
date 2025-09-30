import { UserCredential } from "firebase/auth";
import styled from "styled-components";
import { logOut } from "../firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

type IHeaderProps = {
  setUser: (user: UserCredential | undefined) => void;
};

export function Header({ setUser }: IHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = async () => {
    await logOut();
    setUser(undefined);
    sessionStorage.removeItem("signedInUser");
    navigate("/"); // send back to home/login
  };

  // Check where we are now
  const isOnNewArrangement = location.pathname === "/arrangements/new";

  return (
    <HeaderLine>
      <h1>INDISKTORSDAG</h1>
      <button
        onClick={() =>
          navigate(isOnNewArrangement ? "/arrangements" : "/arrangements/new")
        }
      >
        {isOnNewArrangement ? "Til arrangementer" : "Ny Torsdag?"}
      </button>
      <button
        style={{ borderRadius: "20%" }}
        onClick={() => navigate("/profil")}
      >
        profil
      </button>
      <button style={{ borderRadius: "50%" }} onClick={handleLogOut}>
        logout
      </button>
    </HeaderLine>
  );
}

const HeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgb(104, 191, 213);
  padding: 10px;
  position: sticky;
  top: 0;
  border: 1px solid red;
`;

// import { UserCredential } from "firebase/auth";
// import styled from "styled-components";
// import { logOut } from '../firebase/auth';

// type IHeadeProps = {
//   onOpenModal: () => void;
//   newArrangmentOpen: boolean;
//   setUser: (user: UserCredential | undefined) => void
// };

// export function Header(props: IHeadeProps) {

//   const handleLogOut = async () => {
//     await logOut();
//     props.setUser(undefined)
//     sessionStorage.removeItem("signedInUser");

// };

//   return (
//     <HeaderLine>
//       <h1>INDISKTORSDAG</h1>
//       <button onClick={props.onOpenModal}>
//         {props.newArrangmentOpen ? "Til arrangementer" : "Ny Torsdag?"}
//       </button>
//       <button style={{borderRadius: '50%'}}onClick={handleLogOut} >logout</button>
//     </HeaderLine>
//   );
// }

// const HeaderLine = styled.div`
//   display: flex;
//   justify-content: space-between;
//   background-color: rgb(104,191,213);
//   padding: 10px;
//   position: sticky;
//   top: 0;
//   border: 1px solid red;
//   borderRadius: 50%
// `;
