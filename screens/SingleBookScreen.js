import { Ionicons, AntDesign } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { getAllUsers } from "../db/firestore";
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { createChat, checkChat, deleteBook } from "../db/firestore";
import { UserContext } from "../contexts/User";
import { LinearGradient } from "expo-linear-gradient";

export default function SingleBookScreen({ route, navigation }) {
  const { item } = route.params;

  const [userHasBook, setUserHasBook] = useState("");

  const { user, setUser } = useContext(UserContext);

  // console.log([user, userHasBook.uid], item);

  const handleChat = async () => {
    const chatID = await createChat([user, userHasBook.uid], item);
    navigation.navigate("SingleMessageScreen", {
      name: item.title,
      chatID: chatID,
    });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const result = await getAllUsers();
      // console.log(result, "<< all users");
      // setUserHasBook(result);
      for (let i = 0; i < result.length; i++) {
        if (result[i].uid === item.uid) {
          setUserHasBook(result[i]);
        }
      }
    };
    fetchUserDetails();
  }, [item]);

  const handleDelete = async () => {
    await deleteBook(item, user);
    navigation.navigate("UserProfileScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <LinearGradient
        // Background Linear Gradient
        colors={["#f7edf2", "#dee2ff", "white"]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={styles.background}
      /> */}
      <View style={styles.bookBox}>
        <View style={styles.imageBox}>
          <Image
            style={styles.image}
            source={{
              uri: item.highResImage,
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.bookInfo}>Average rating: {"TBD"}</Text>
          <Text style={styles.bookInfo}>{item.author}</Text>
          <Text style={styles.bookInfo}>{item.publishedDate}</Text>
          <Text style={styles.bookInfo}>{item.pageCount} Pages</Text>
          <Text style={styles.bookInfo}>Language: {item.language}</Text>
          {user === userHasBook.uid ? (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.messageOwnerButton}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View>
        <Text style={styles.descriptionHeader}>Description</Text>
        <View style={styles.descriptionContainer}>
          <ScrollView style={styles.descriptionBox}>
            <Text style={styles.description}>{item.description}</Text>
          </ScrollView>
        </View>
        {user === userHasBook.uid ? null : (
          <View style={styles.userHasBook}>
            <View style={styles.avatarShadow}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: userHasBook.avatar_url,
                  }}
                  style={styles.avatarImage}
                  resizeMode="center"
                ></Image>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userHasBook.username} has this!
              </Text>
              <Text style={styles.userDistance}>
                {item.distance} miles away
              </Text>
            </View>
            <View style={styles.messageIcon}>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={handleChat}
              >
                <AntDesign name="message1" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "120%",
  },
  bookBox: {
    flexDirection: "row",
    height: 285,
    marginTop: 15,
    paddingBottom: 10,
    marginBottom: 5,
    // borderColor: "red",
    // borderWidth: 1,
  },
  imageBox: {
    // flex: 1,
    // borderColor: "white",
    // borderWidth: 6,
    borderRadius: 15,
    height: 232,
    alignItems: "center",
    margin: 10,
    paddingBottom: 10,
    shadowColor: "#DCDCDC",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 17,

    elevation: 10,
  },
  image: {
    width: 150,
    height: 220,
    borderRadius: 12,
  },
  infoBox: {
    flex: 1,
    padding: 5,
    // borderColor: "white",
    // borderWidth: 2,
  },
  title: {
    marginTop: 5,
    fontFamily: "HelveticaNeue",
    color: "#52575D",
    fontWeight: "800",
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 15,
    // borderColor: "#8d99ae",
    // borderWidth: 0.5,
  },
  bookInfo: {
    paddingBottom: 6,
    fontFamily: "HelveticaNeue",
    color: "#52575D",
    fontWeight: "600",
    // borderColor: "#8d99ae",
    // borderWidth: 0.5,
  },
  messageOwnerButton: {
    alignSelf: "center",
    borderColor: "#52575D",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 5,
    padding: 10,
    width: 160,
    height: 40,
    backgroundColor: "#DCDCDC",
    shadowColor: "#DCDCDC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "HelveticaNeue",
    color: "#52575D",
    fontWeight: "700",
  },
  descriptionHeader: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 11,
    fontFamily: "HelveticaNeue",
    color: "#52575D",
    // borderColor: "#8d99ae",
    // borderWidth: 0.5,
  },
  descriptionBox: {
    height: 240,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    // borderColor: "#8d99ae",
    // borderWidth: 0.5,
  },
  descriptionContainer: {
    // borderColor: "#8d99ae",
    // borderWidth: 0.5,
    shadowColor: "#DCDCDC",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 3,
    shadowRadius: 5,

    elevation: 3,
  },
  description: {
    width: "100%",
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "white",
    overflow: "hidden",
    fontFamily: "HelveticaNeue",
    color: "#52575D",
    borderColor: "#8d99ae",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  userHasBook: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#8d99ae",
    borderWidth: 2,
    backgroundColor: "#DCDCDC",
  },
  avatarShadow: {
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 3,
  },
  avatarContainer: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
    overflow: "hidden",
    // borderColor: "#8d99ae",
    // borderWidth: 0.5,
  },
  avatarImage: {
    flex: 1,
    height: 43,
    width: 43,
    borderRadius: 20,
    alignItems: "center",
    resizeMode: "cover",
  },
  messageButton: {
    position: "absolute",
    top: -14,
    right: -10,
    height: 26,
    width: 26,
    borderRadius: 10,
    // backgroundColor: "#ffbd03"
  },
  messageIcon: {
    marginRight: 20,
    shadowColor: "#DCDCDC",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 3,
  },
});
