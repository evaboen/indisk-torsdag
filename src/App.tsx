import { useState } from "react";
import ArrangementsList from "./components/ArrangementsList";
import { Header } from "./components/Header";
import { NewArrangementFormModal } from "./components/newArrangementForm";
import styled from "styled-components";
import Auth from "./components/auth";
import { UserCredential } from "firebase/auth";

function App() {
  const [newArrangmentOpen, setNewArrangmentOpen] = useState(false);
  const [user, setUser] = useState<UserCredential | undefined>(() => {
    const stored = sessionStorage.getItem("signedInUser");
    console.log(stored);
    return stored ? JSON.parse(stored) : undefined;
  });

  const toggleNewArrangementOpen = () =>
    setNewArrangmentOpen(!newArrangmentOpen);

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <AppWrapper>
      <Header
        newArrangmentOpen={newArrangmentOpen}
        onOpenModal={toggleNewArrangementOpen}
        setUser={setUser}
      />
      {newArrangmentOpen ? (
        <NewArrangementFormModal
          user={user}
          closeModal={() => setNewArrangmentOpen(false)}
        />
      ) : (
        <ArrangementsList user={user} />
      )}
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export default App;
