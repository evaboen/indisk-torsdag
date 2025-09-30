import styled from "styled-components";
import { logOut } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { IUserProfile } from "../firebase/dbUtils";

type IHeaderProps = {
  setUser: (user: IUserProfile | undefined) => void;
};

export function Header({ setUser }: IHeaderProps) {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logOut();
    setUser(undefined);
    sessionStorage.removeItem("signedInUser");
    navigate("/"); // send back to home/login
  };

  return (
    <HeaderLine>
      <h1>INDISKTORSDAG</h1>{" "}
      <button onClick={() => navigate("/arrangements")}>arrangemanter</button>
      <button onClick={() => navigate("/arrangements/new")}>Ny Torsdag?</button>
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
