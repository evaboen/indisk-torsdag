import { useState } from "react";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { IUserProfile } from "../firebase/dbUtils";

type IProps = {
  user: IUserProfile;
  onProfileUpdated?: (updated: IUserProfile) => void; // optional callback
};

export const Profile = (props: IProps) => {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(props.user.nickname || "");
  const [profilePicture, setProfilePicture] = useState(
    props.user.profilePicture || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!props.user.email) return;

    setLoading(true);
    try {
      const userRef = doc(db, "Users", props.user.email);
      await updateDoc(userRef, { nickname, profilePicture });
      setEditing(false);

      if (props.onProfileUpdated) {
        props.onProfileUpdated({ ...props.user, nickname, profilePicture });
      }

      console.log("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h1>Profilend din</h1>
      {editing ? (
        <>
          <div>
            <label>
              Nickname:{" "}
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Profile picture URL:{" "}
              <input
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
              />
            </label>
          </div>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          {props.user.profilePicture && (
            <img
              src={props.user.profilePicture}
              alt="Profile"
              style={{ width: 150, height: 150, borderRadius: "50%" }}
            />
          )}
          <div> {props.user.nickname}</div>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: rgb(150, 160, 200);
  margin: 4px;
  padding: 4px;
  border-radius: 5px;
`;
