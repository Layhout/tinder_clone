import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Foundation, Ionicons } from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import { useNavigation } from '@react-navigation/core';

const Header = ({ title, callEnabled }) => {
    const navigation = useNavigation();

    return (
        <View style={tailwind("p-2 flex-row items-center justify-between")}>
            <View style={tailwind("flex-row items-center")}>
                <TouchableOpacity style={tailwind("p-2")} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={34} color="#ff5864" />
                </TouchableOpacity>
                <Text style={tailwind("text-2xl font-bold pl-2")}>{title}</Text>
            </View>
            {callEnabled && <TouchableOpacity style={tailwind("rounded-full mr-4 p-3 bg-red-200")}>
                <Foundation name="telephone" style={tailwind("")} size={20} color="red" />
            </TouchableOpacity>}
        </View>
    )
}

export default Header
