import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { addMessage, getChat, getUserDetails } from "../db/firestore";
import { getDoc, getFirestore, Timestamp } from "firebase/firestore";
import { UserContext } from "../contexts/User";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
const timestamp = require("time-stamp");
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

export default function SingleMessageScreen({ route, navigation }) {
  const { user } = useContext(UserContext);
  const { chatID } = route.params;
  const [currUser, setCurrUser] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [inputPressed, setInputPressed] = useState(false);
  const Comment = (props) => {
    const { item } = props;

    console.log(currUser, "<< user");

    const time = item.postedAt.slice(0, 10) + " " + item.postedAt.slice(11, 16);
    return (
      <View
        style={
          item.username === currUser.username
            ? styles.ownerCommentBox
            : styles.userCommentBox
        }
      >
        <View
          style={
            item.username === currUser.username
              ? styles.ownerComment
              : styles.userComment
          }
        >
          <Text styles={styles.commentSnippet}>
            {item.username} {time}
          </Text>
          <Text>{item.message}</Text>
        </View>
      </View>
    );
  };

  function handleChange(value) {
    setNewMessage(value);
  }

  function handleSubmit(event) {
    if (event.nativeEvent.key == "Enter") {
      addMessage(chatID, currUser.username, newMessage).then(() => {
        setMessages((curr) => [
          ...curr,
          {
            username: currUser.username,
            message: newMessage,
            postedAt: timestamp("DD/MM/YYYY:HH:mm:ss:ms"),
          },
        ]);
        setNewMessage("");
      });
      event.target.blur();
    }
  }

  useEffect(async () => {
    setIsLoading(true);
    const chat = await getChat(chatID);
    const currUser = await getUserDetails(user);
    setCurrUser(currUser);
    const msgs = [];
    console.log(chat);
    if (chat.messages.length > 0) {
      chat.messages.forEach((message) => {
        msgs.push(message);
      });
      setMessages(msgs);
    }
    for (const user of chat.members) {
      if (user !== currUser.uid) {
        const otherUserObj = await getUserDetails(user);
        setImage(chat.picture);
        setOtherUser(otherUserObj);
      }
    }

    setTitle(chat.book);

    setIsLoading(false);
  }, []);

  return isLoading ? (
    <Text>Loading...</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
        <View style={styles.header}>
          <View style={styles.imageBackground}>
            <Image
              style={styles.pic}
              source={{
                uri: image,
              }}
            />
          </View>
          <View style={styles.bookInfoBox}>
            <Text style={styles.bookInfo}>
              {/* {title} ||  */}
              {otherUser.username}
            </Text>
          </View>
        </View>
        <View style={inputPressed ? styles.listPressed : styles.list}>
          <FlatList
            data={messages}
            renderItem={Comment}
            keyExtractor={(item, index) => item.postedAt + index}
          />
        </View>

        <View style={styles.bottomContainer}>
          <TextInput
            onFocus={() => setInputPressed(true)}
            onBlur={() => setInputPressed(false)}
            placeholder="New message"
            style={styles.textInput}
            onChangeText={handleChange}
            value={newMessage}
            multiline={true}
            onKeyPress={handleSubmit}
            returnKeyType={"send"}
            // blurOnSubmit={true}
          />

          {/* <TouchableOpacity>
            <Pressable style={styles.submit} onPress={handleSubmit}>
            <Text>Send</Text>
          </Pressable>
</TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    //justifyContent: "flex-end",
    paddingTop: 0,
    // backgroundColor: "white",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "120%",
    width: "100%",
  },
  header: {
    height: 200,
    //flex: 1,
    alignItems: "center",
    // justifyContent: "space-between",
    margin: 0,
    // borderColor: "red",
    // borderWidt: 2,
  },
  imageBackground: {
    borderColor: "red",
    borderWidth: 6,
    marginTop: 50,
    height: 104,
    width: 104,
    borderRadius: 100,
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 3,
    borderColor: "white",
    borderWidth: 2,
  },
  pic: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  bookInfoBox: {
    marginTop: 15,
  },
  bookInfo: {
    fontFamily: "HelveticaNeue",
    color: "#52575D",
    fontWeight: "800",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  list: {
    height: "60%",
    marginVertical: 5,
    // borderColor: "red",
    // borderWidth: 6,
  },
  listPressed: {
    height: "30%",
    marginVertical: 5,
  },
  userCommentBox: {
    flex: 1,
    alignSelf: "flex-start",
    marginVertical: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    // shadowColor: "black",
    width: "auto",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 5,
    // shadowRadius: 4,
    // elevation: 3,
  },
  ownerCommentBox: {
    flex: 1,
    alignSelf: "flex-end",
    marginVertical: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    // shadowColor: "black",
    width: "auto",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 5,
    // shadowRadius: 4,
    // elevation: 3,
  },
  ownerComment: {
    margin: 0,
    // width: "50%",
    backgroundColor: "#357DD0",
    // borderColor: "white",
    // borderWidth: 3,
    // borderColor: "red",
    // borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  userComment: {
    margin: 0,
    backgroundColor: "#DCDCDC",
    // width: "50%",
    // borderColor: "white",
    // borderWidth: 3,
    // borderColor: "red",
    // borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  commentSnippet: {
    fontFamily: "HelveticaNeue",
    fontSize: 16,
  },
  bottomContainer: {
    // flex: 1,
    //height: 100,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
    // borderColor: "red",
    // borderWidth: 2,
    paddingBottom: 20,
  },
  textInput: {
    borderWidth: 2,
    width: "100%",
    height: 80,
    marginTop: 5,
    backgroundColor: "white",
    padding: 10,
    // borderRadius: 10,
    borderColor: "#ECECEC",
    // shadowColor: "white",
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 4,
    // shadowRadius: 17,

    // elevation: 10,
    // borderColor: "red",
    // borderWidth: 6,
  },

  submit: {
    borderRadius: 25,
    borderColor: "#76c893",
    borderWidth: 3,
    width: 75,
    height: 55,

    backgroundColor: "#76c893",
    margin: 20,
    padding: 8,

    backgroundColor: "white",
    margin: 0,

    alignItems: "center",
    justifyContent: "center",
  },
  sendText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "HelveticaNeue",
    color: "white",
    padding: 6,
  },
});
