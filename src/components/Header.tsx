import styled from "styled-components";

type IHeadeProps = {
  onOpenModal: () => void;
  newArrangmentOpen: boolean;
};

export function Header(props: IHeadeProps) {
  return (
    <HeaderLine>
      <h1>INDISKTORSDAG</h1>
      <button onClick={props.onOpenModal}>
        {props.newArrangmentOpen ? "Til arrangementer" : "Ny Torsdag?"}
      </button>
    </HeaderLine>
  );
}

const HeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: yellow;
  padding: 10px;
  position: sticky;
  top: 0;
  border: 1px solid red;
`;
