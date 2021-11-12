import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as Google from "expo-google-app-auth";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from '@firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

const config = {
    androidClientId: "251317291067-aoqn3nbheb9lr09hb70nic8mji6u81ed.apps.googleusercontent.com",
    iosClientId: "251317291067-ag5kc7vu75ns0hf6nroj59abt7ueq7dl.apps.googleusercontent.com",
    clientId: "251317291067-aoqn3nbheb9lr09hb70nic8mji6u81ed.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"]
}

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLodaingInital] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLodaingInital(false);
        })
        return () => unSub();
    }, []);

    const logout = () => {
        setLoading(true);
        signOut(auth).catch(err => setError(err)).finally(() => setLoading(false));
    }

    const signInWithGoogle = async () => {
        setLoading(true)
        await Google.logInAsync(config).then(async loginResult => {
            if (loginResult.type === "success") {
                const { idToken, accessToken } = loginResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credential);
            }
            return Promise.reject();
        }).catch(err => setError(err)).finally(() => setLoading(false))
    }

    const memoedValue = useMemo(() => ({ user, loading, error, signInWithGoogle, logout }), [user, loading, error]);

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}