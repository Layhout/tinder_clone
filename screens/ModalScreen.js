import { doc, serverTimestamp, setDoc } from '@firebase/firestore'
import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import tailwind from 'tailwind-rn'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'

const ModalScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    const incompletedForm = !image || !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job,
            age,
            timestamp: serverTimestamp(),
        }).then(() => {
            navigation.navigate("Home");
        }).catch(err => {
            alert(err.message);
        })
    }

    return (
        <View style={tailwind("flex-1 items-center mt-1")}>
            <Image style={tailwind("h-20 w-full")} resizeMode="contain" source={{ uri: "https://links.papareact.com/2pf" }} />
            <Text style={tailwind("text-xl text-gray-500 m-2 font-bold")}>Welcome {user.displayName}</Text>
            <Text style={tailwind("text-center m-4 font-bold text-red-400")}>Step 1: The Profile Pic</Text>
            <TextInput value={image} onChangeText={text => setImage(text)} style={tailwind("text-center text-xl mb-2")} placeholder="Enter a Profile Pic URL" />
            <Text style={tailwind("text-center m-4 font-bold text-red-400")}>Step 2: The Job</Text>
            <TextInput value={job} onChangeText={text => setJob(text)} style={tailwind("text-center text-xl mb-2")} placeholder="Enter your occupation" />
            <Text style={tailwind("text-center m-4 font-bold text-red-400")}>Step 3: The Age</Text>
            <TextInput value={age} onChangeText={text => setAge(text)} keyboardType="numeric" style={tailwind("text-center text-xl mb-2")} placeholder="Enter your age" />
            <TouchableOpacity style={[tailwind("w-64 p-3 rounded-xl absolute bottom-10"), incompletedForm ? tailwind("bg-gray-400") : tailwind("bg-red-400")]} disabled={incompletedForm} onPress={updateUserProfile} >
                <Text style={tailwind("text-center text-white text-xl")} >Update Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ModalScreen
