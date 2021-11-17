import React from 'react'
import { View, Text, Image } from 'react-native'
import tailwind from 'tailwind-rn'
import MessageScreen from '../screens/MessageScreen'

const ReceiverMessage = ({ message }) => {
    return (
        <View style={[tailwind("bg-red-400 rounded-lg rounded-tl-none px-5 py-3 my-2 ml-14"), { alignSelf: "flex-start" }]} >
            <Image style={tailwind("h-12 w-12 rounded-full absolute top-0 -left-14")} source={{ uri: message.photoURL }} />
            <Text>{message.message}</Text>
        </View>
    )
}

export default ReceiverMessage
