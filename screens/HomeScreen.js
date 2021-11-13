import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SafeAreaView, Text, Button, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import tailwind from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from '@firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const swiperRef = useRef(null);
    const [profiles, setProfiles] = useState([]);

    useLayoutEffect(() => {
        const unSub = onSnapshot(doc(db, "users", user.uid), snapshot => {
            if (!snapshot.exists()) {
                navigation.navigate("Modal");
            }
        });
        return () => unSub();
    }, []);

    useEffect(() => {
        let unSub;
        const fetchCards = async () => {
            const passes = await getDocs(collection(db, "users", user.uid, "passes")).then(snapshot => snapshot.docs.map(d => d.id));
            const swipes = await getDocs(collection(db, "users", user.uid, "swipes")).then(snapshot => snapshot.docs.map(d => d.id));
            const passedUserIds = passes.length > 0 ? passes : ["test"];
            const swipedUserIds = swipes.length > 0 ? swipes : ["test"];
            unSub = onSnapshot(query(collection(db, "users"), where("id", "not-in", [...passedUserIds, ...swipedUserIds])), snapshot => {
                setProfiles(snapshot.docs.filter(d => d.id !== user.uid).map(d => ({
                    id: d.id,
                    ...d.data(),
                })))
            })
        }
        fetchCards();
        return () => unSub();
    }, [db]);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        console.log(`You swiped PASS on ${userSwiped.displayName}`);
        setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
    }

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        const loggedInProfile = await (await getDocs(doc(db, "users", user.uid))).data();
        // Check if the user swiped on you...
        getDoc(dic(db, "users", userSwiped.id, "swipes", user.uid)).then(documentSnapshot => {
            if (documentSnapshot.exists()) {
                // user has matched with you before you matched with them...
                console.log(`you matched with with ${userSwiped.displayName}`);
                setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
                // Create a match
                setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
                    users: {
                        [user.uid]: loggedInProfile,
                        [userSwiped.id]: userSwiped
                    },
                    usersMatched: [user.uid, userSwiped.id],
                    timestamp: serverTimestamp()
                });
                navigation.navigate("Match", {
                    loggedInProfile, userSwiped
                });
            } else {
                // user has swiped as first interaction between with the two or didn't get swiped on...
                console.log(`You swiped on ${userSwiped.displayName} (${userSwiped.job})`);
                setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
            }
        })
    }

    return (
        <SafeAreaView style={tailwind("flex-1")}>
            {/* Header */}
            <View style={tailwind("flex-row items-center justify-between px-5")}>
                <TouchableOpacity onPress={logout}>
                    <Image source={{ uri: user.photoURL }} style={tailwind("h-10 w-10 rounded-full")} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
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
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    verticalSwipe={false}
                    animateCardOpacity
                    onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
                    onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
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
                    renderCard={card => card ?
                        <View style={[tailwind("bg-white h-3/4 rounded-xl relative"), styles.cardShadow]} key={card.id}>
                            <Image source={{ uri: card.photoURL }} style={tailwind("h-full w-full rounded-xl absolute top-0")} />
                            <View style={tailwind("bg-white w-full h-20 absolute bottom-0 justify-between items-center flex-row px-6 py-2 rounded-b-xl")}>
                                <View>
                                    <Text style={tailwind("text-xl font-bold")}>{card.displayName}</Text>
                                    <Text>{card.job}</Text>
                                </View>
                                <Text style={tailwind("text-2xl font-bold")}>{card.age}</Text>
                            </View>
                        </View>
                        : <View style={[tailwind("relative bg-white h-3/4 rounded-xl justify-center items-center"), styles.cardShadow]}>
                            <Text style={tailwind("font-bold mb-5")}>No more profiles</Text>
                            <Image style={tailwind("h-20 w-full")} height={100} width={100} source={{ uri: 'https://links.papareact.com/6gb' }} />
                        </View>} />
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