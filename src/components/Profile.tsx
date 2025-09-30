import { UserCredential } from "firebase/auth";
import styled from "styled-components";

type IProps = {
  user: UserCredential;
};
export const Profile = (props: IProps) => {
  return <Wrapper>{props.user.user.email}</Wrapper>;
};

const Wrapper = styled.div`
  width: 100%;
  background-color: rgb(134, 300, 202);
  margin: 4px;
  padding: 4px;
  border-radius: 5px;
`;
