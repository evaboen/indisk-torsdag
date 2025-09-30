import { signInWithGoogle } from "../firebase/auth";
import styled from "styled-components";
import {
  createUserIfNotExists,
  getUserProfile,
  IUserProfile,
} from "../firebase/dbUtils";

interface IProps {
  setUser: (user: IUserProfile | undefined) => void;
}

const Auth = (props: IProps) => {
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      const email = user.user.email;
      if (email) {
        // Only create if not exists
        await createUserIfNotExists(
          email,
          user.user.displayName ?? "",
          user.user.photoURL ?? ""
        );

        // Fetch profile if you want to use it immediately
        const profile = await getUserProfile(email);
        if (profile) {
          props.setUser(profile);
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  return (
    <AuthCard>
      <h2>Lobbyen</h2>
      <button onClick={handleGoogleSignIn}>Logg inn på denne</button>
    </AuthCard>
  );
};

export default Auth;

const AuthCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: rgb(169, 69, 169);
`;
