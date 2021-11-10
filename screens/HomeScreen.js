import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, Button } from 'react-native'
import useAuth from '../hooks/useAuth';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();

    return (
        <View>
            <Text>Home Screem</Text>
            <Button title="go to chat screen" onPress={() => navigation.navigate("Chat")} />
            <Button title="logout" onPress={logout} />
        </View>
    )
}

export default HomeScreen
