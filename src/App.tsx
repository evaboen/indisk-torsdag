import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ArrangementsList from "./components/ArrangementsList";
import { Header } from "./components/Header";
import { NewArrangementFormModal } from "./components/newArrangementForm";
import styled from "styled-components";
import Auth from "./components/auth";
import { UserCredential } from "firebase/auth";
import { Profile } from "./components/Profile";

function App() {
  const [user, setUser] = useState<UserCredential | undefined>(() => {
    const stored = sessionStorage.getItem("signedInUser");
    return stored ? JSON.parse(stored) : undefined;
  });

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <AppWrapper>
      <Header setUser={setUser} />

      <Routes>
        <Route path="/" element={<Navigate to="/arrangements" replace />} />
        <Route
          path="/arrangements"
          element={<ArrangementsList user={user} />}
        />
        <Route
          path="/arrangements/new"
          element={<NewArrangementFormModal user={user} />}
        />
        <Route path="/profil" element={<Profile user={user} />} />
        <Route
          path="*"
          element={<h2>404 Noe feil her, hmmm? prøv igjen kanskje?</h2>}
        />
      </Routes>
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
