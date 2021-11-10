import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react'
import { View, ImageBackground, Text, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import tailwind from 'tailwind-rn';

const LoginScreen = () => {
    const { signInWithGoogle } = useAuth();
    const navigation = useNavigation();

    // useLayoutEffect(() => { // same as useEffect but useEffect runs before this function. this function runs after everything's done rendering.
    //     navigation.setOptions({
    //         headerShown: false,
    //     })
    // }, [])

    return (
        <View style={tailwind("flex-1")}>
            <ImageBackground resizeMode="cover" style={tailwind("flex-1")} source={{ uri: "https://tinder.com/static/tinder.png" }}>
                <TouchableOpacity style={tailwind("absolute bottom-40 bg-white p-4 rounded-2xl self-center")} onPress={signInWithGoogle}>
                    <Text style={tailwind("font-semibold text-center")}>Sign in & get swiping</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

export default LoginScreen
