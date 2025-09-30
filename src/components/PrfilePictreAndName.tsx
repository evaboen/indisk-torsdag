import { useEffect, useState } from "react";
import { getUserProfile, IUserProfile } from "../firebase/dbUtils";
import styled from "styled-components";
import DefaultProfileIcon from "../assets/default-profile.png";

interface IProps {
  email: string;
  imageSize?: number;
  notBold?: boolean;
}

export const ProfilePictureAndName = (props: IProps) => {
  const { imageSize = 50 } = props;
  const [user, setUser] = useState<IUserProfile | null>(null);

  useEffect(() => {
    getUserProfile(props.email).then(setUser);
  }, [props.email]);

  const imgStyle = {
    width: imageSize,
    height: imageSize,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <StyledImage
        src={user?.profilePicture || DefaultProfileIcon}
        alt="Profile"
        style={imgStyle}
      />
      {props.notBold ? (
        <p>{user?.nickname ?? props.email}</p>
      ) : (
        <b>{user?.nickname ?? props.email}</b>
      )}
    </div>
  );
};

const StyledImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
