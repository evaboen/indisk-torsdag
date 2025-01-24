import { useState } from "react";
import ArrangementsList from "./components/ArrangementsList";
import { Header } from "./components/Header";
import { NewArrangementFormModal } from "./components/newArrangementForm";
import styled from "styled-components";

function App() {
  const [newArrangmentOpen, setNewArrangmentOpen] = useState(false);

  const toggleNewArrangementOpen = () =>
    setNewArrangmentOpen(!newArrangmentOpen);

  return (
    <AppWrapper>
      <Header
        newArrangmentOpen={newArrangmentOpen}
        onOpenModal={toggleNewArrangementOpen}
      />
      {newArrangmentOpen ? <NewArrangementFormModal /> : <ArrangementsList />}
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
