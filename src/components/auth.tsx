// src/components/Auth.tsx

import React, { useState } from "react";
import { signInWithGoogle } from "../firebase/auth";
import { UserCredential } from "firebase/auth";
import styled from "styled-components";

interface IProps {
  setUser: (user: UserCredential | undefined) => void;
}

const Auth = (props: IProps) => {
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      props.setUser(user);
      sessionStorage.setItem("signedInUser", JSON.stringify(user));

      console.log("User signed in with Google:", user);
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
