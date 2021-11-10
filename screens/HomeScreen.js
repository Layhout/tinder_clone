import { useNavigation } from '@react-navigation/core'
import React, { useLayoutEffect, useRef } from 'react'
import { SafeAreaView, Text, Button, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import tailwind from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";

const DUMMY_DATA = [
    {
        firstName: "Hello",
        lastName: "World",
        occupation: "Hi universe",
        photoURL: "https://images.unsplash.com/photo-1636447670364-9dc6c2a0f489?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        age: 30,
        id: 1,
    },
    {
        firstName: "Hello",
        lastName: "World",
        occupation: "Hi universe",
        photoURL: "https://images.unsplash.com/photo-1636479230397-4e641521dd56?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        age: 30,
        id: 2,
    },
    {
        firstName: "Hello",
        lastName: "World",
        occupation: "Hi universe",
        photoURL: "https://images.unsplash.com/photo-1636524390936-5ef600dd1a8d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        age: 30,
        id: 3,
    },
]

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const swiperRef = useRef(null);

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            {/* Header */}
            <View style={tailwind("flex-row items-center justify-between px-5")}>
                <TouchableOpacity onPress={logout}>
                    <Image source={{ uri: user.photoURL }} style={tailwind("h-10 w-10 rounded-full")} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={tailwind("h-10 w-10")} resizeMode="contain" source={require("../logo.png")} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#ff5860" />
                </TouchableOpacity>
            </View>
            {/* End Header */}

            {/* Cards */}
            <View style={tailwind("flex-1 -mt-6")}>
                <Swiper
                    ref={swiperRef}
                    containerStyle={{ backgroundColor: "tranparent" }}
                    cards={DUMMY_DATA}
                    stackSize={5}
                    cardIndex={0}
                    verticalSwipe={false}
                    animateCardOpacity
                    onSwipedLeft={() => console.log("swiper pass")}
                    onSwipedRight={() => console.log("swiper match")}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red"
                                }
                            }
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "#4ded30"
                                }
                            }
                        }
                    }}
                    renderCard={card => (
                        <View style={[tailwind("bg-white h-3/4 rounded-xl relative"), styles.cardShadow]} key={card.id}>
                            <Image source={{ uri: card.photoURL }} style={tailwind("h-full w-full rounded-xl absolute top-0")} />
                            <View style={tailwind("bg-white w-full h-20 absolute bottom-0 justify-between items-center flex-row px-6 py-2 rounded-b-xl")}>
                                <View>
                                    <Text style={tailwind("text-xl font-bold")}>{card.firstName} {card.lastName}</Text>
                                    <Text>{card.occupation}</Text>
                                </View>
                                <Text style={tailwind("text-2xl font-bold")}>{card.age}</Text>
                            </View>
                        </View>
                    )} />
            </View>
            <View style={tailwind("flex-row justify-evenly")}>
                <TouchableOpacity style={tailwind("items-center justify-center rounded-full w-16 h-16 bg-red-200")} onPress={() => swiperRef.current.swipeLeft()} >
                    <Entypo name="cross" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity style={tailwind("items-center justify-center rounded-full w-16 h-16 bg-green-200")} onPress={() => swiperRef.current.swipeRight()}>
                    <AntDesign name="heart" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

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