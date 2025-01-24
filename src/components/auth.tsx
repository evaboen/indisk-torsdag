// src/components/Auth.tsx

import React, { useState } from 'react';
import {  logOut, signInWithGoogle } from '../firebase/auth';

const Auth: React.FC = () => {


    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            console.log('User signed in with Google:', user.user);
        } catch (error) {
            console.error('Google sign in error:', error);
        }
    };

    const handleLogOut = async () => {
        await logOut();
    };

    return (
        <div>
            <h2>Authentication</h2>
            <button onClick={handleGoogleSignIn}>Sign In with Google</button>
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    );
};

export default Auth;
