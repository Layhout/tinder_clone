import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, } from 'react-native'
import tailwind from 'tailwind-rn';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchUserInfo from '../lib/getMatchUserInfo';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchUserInfo, setMatchUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState("");

    useEffect(() => {
        setMatchUserInfo(getMatchUserInfo(matchDetails.users, user.uid))
    }, [matchDetails, user]);

    useEffect(() => {
        const unSub = onSnapshot(query(collection(db, "matches", matchDetails, id, "messages"), orderBy("timestamp", "desc")), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message));
        return () => unSub();
    }, [matchDetails, db])

    return (
        <TouchableOpacity style={[tailwind("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"), styles.cardShadow]} onPress={() => navigation.navigate("Message", { matchUserInfo })} >
            <Image style={tailwind("rounded-full w-16 h-16 mr-4")} source={{ uri: matchUserInfo?.photoURL }} />
            <View>
                <Text style={tailwind("text-lg font-semibold")}>
                    {matchUserInfo?.displayName}
                </Text>
                <Text>{lastMessage || "Say Hi!"}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    }
})