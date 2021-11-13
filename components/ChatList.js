import { collection, doc, onSnapshot, query, where } from '@firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import tailwind from 'tailwind-rn'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import ChatRow from './ChatRow'

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const unSub = onSnapshot(query(collection(db, "matches"), where("usersMatched", "array-contains", user.uid)), snapshot => setMatches(snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
        }))));
        return () => unSub();
    }, [user])

    return matches.length > 0 ? <FlatList style={tailwind("h-full")} data={matches} keyExtractor={item => item.id} renderItem={({ item }) => <ChatRow matchDetail={item} />} /> : <View style={tailwind("p-5")}>
        <Text style={tailwind("text-center text-lg")}>No matches at the moment...</Text>
    </View>
}

export default ChatList
