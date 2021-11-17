import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore'
import React, { useState } from 'react'
import { View, Text, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react/cjs/react.development'
import tailwind from 'tailwind-rn'
import Header from '../components/Header'
import ReceiverMessage from '../components/ReceiverMessage'
import SenderMessage from '../components/SenderMessage'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import getMatchUserInfo from '../lib/getMatchUserInfo'

const MessageScreen = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const { matchDetails } = params;
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const unSub = onSnapshot(query(collection(db, "matches", matchDetails.id, "messages"), orderBy("timestamp", "desc")), snapshot => {
            setMessages(snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
            })))
        });
        return () => unSub();
    }, [matchDetails, db])
    const sendMessage = () => {
        addDoc(collection(db, "matches", matchDetails.id, "messages"), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input
        });
        setInput("");
    }
    return (
        <SafeAreaView style={tailwind("flex-1")}>
            <Header title={getMatchUserInfo(matchDetails.users, user.uid).displayName} callEnabled />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tailwind("flex-1")} keyboardVerticalOffset={10} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList data={messages} style={tailwind("pl-4")} keyExtractor={item => item.id} inverted={-1} renderItem={({ item }) => {
                        item.userId === user.uid ? <SenderMessage key={item.id} message={item} /> : <ReceiverMessage key={item.id} message={item} />
                    }} />
                </TouchableWithoutFeedback>
                <View style={tailwind("flex-row justify-between items-center border-t border-gray-200 px-5 py-2")}>
                    <TextInput style={tailwind("h-10 text-lg")} placeholder="Send Message..." onChangeText={setInput} onSubmitEditing={sendMessage} value={input} />
                    <Button title="Send" color="#ff5864" onPress={sendMessage} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default MessageScreen
