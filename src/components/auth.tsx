// src/components/Auth.tsx

import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase/auth';
import { UserCredential } from 'firebase/auth';

interface IProps {
    setUser: (user: UserCredential | undefined) => void
}

const Auth = (props: IProps) => {


    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            props.setUser(user)
            sessionStorage.setItem("signedInUser", JSON.stringify(user));

            console.log('User signed in with Google:', user);
        } catch (error) {
            console.error('Google sign in error:', error);
        }
    };

 

    return (
        <div>
            <h2>Authentication</h2>
            <button onClick={handleGoogleSignIn}>Sign In with Google</button>
        </div>
    );
};

export default Auth;
