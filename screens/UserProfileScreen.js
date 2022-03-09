import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../contexts/User";
import {
  StyleSheet,
  Text,
  Modal,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  Foundation,
} from "@expo/vector-icons";
import MapButton from "./MapButton";
import TreeIcon from "./TreeIconLink";
import BooksOfferedLink from "./BooksOfferedLink";
import BooksHomedLink from "./BooksRehomedLink";
import {
  getUserDetails,
  uploadProfilePic,
  updateLocation,
  convertPostcode,
} from "../db/firestore";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

export default function UserProfileScreen({ route, navigation }) {
  const [currentUser, setCurrentUser] = useState({ books: [] });
  const [modalVisible, setModalVisible] = useState(false);
  const [locationEditable, setLocationEditable] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [cityChanged, setCityChanged] = useState(false);
  const [newPostcode, setNewPostcode] = useState("");
  const [errorMessageDisabled, setErrorMessageDisabled] = useState(true);
  const [postcodeVerified, setPostcodeVerified] = useState(false);
  const [currentUserBooks, setCurrentUserBooks] = useState({});
  const { user, setUser } = useContext(UserContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const result = await getUserDetails(user);
      setCurrentUser(result);
      setCurrentUserBooks(result.books);
    };
    if (isFocused) {
      fetchUserDetails();
    }
  }, [user, getUserDetails, isFocused]);

  function getTreeCount(user) {
    let total = 0;
    for (let i = 0; i < user.books.length; i++) {
      total += user.books[i].pageCount / 8000;
    }
    return total.toFixed(2);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const { message } = await uploadProfilePic(result.uri);
    }
  };

  const api = axios.create({
    baseURL: "https://api.postcodes.io",
  });

  async function handleEditButton() {
    setLocationEditable(true);

    // Firebase.
  }

  function handlePostcodeChange(text) {
    setNewPostcode(text);
    setErrorMessageDisabled(true);
  }

  function handleCityChange(text) {
    setNewCity(text);
    setErrorMessageDisabled(true);
  }

  async function handleEditLocation() {
    const response = await api.get(`/postcodes/${newPostcode}/validate`);
    if (response.data.result === true) {
      const location = await convertPostcode(newPostcode);
      const { message } = await updateLocation(user, location, newCity);
      if (message === "Successful") {
        setPostcodeVerified(true);
        setTimeout(() => {
          setModalVisible(!modalVisible);
          setCityChanged(true);
          setPostcodeVerified(false);
        }, 1500);
      }
    } else setErrorMessageDisabled(false);
  }

  function ItemView({ item }) {
    return (
      <View style={styles.bookCoverContainerShadow}>
        <View style={styles.bookCoverContainer}>
          <TouchableOpacity
            key={item.id}
            style={styles.image}
            onPress={() => {
              navigation.navigate("SingleBookScreen", {
                name: item.title,
                item,
              });
            }}
          >
            <Image
              source={{
                uri: item.highResImage,
              }}
              style={styles.coverImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
      <View style={styles.scrollView}>
        <View style={styles.profileShadow}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: currentUser.avatar_url
                  ? currentUser.avatar_url
                  : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E",
              }}
              style={styles.profileImage}
            ></Image>
            <Pressable onPress={pickImage}>
              <Ionicons name="camera-outline" size={25}></Ionicons>
            </Pressable>
          </View>

          {/* <View style={styles.activeDot}></View> */}
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.locationDataBox}>
          {/* <Text>🌎 </Text> */}

          <Text style={styles.locationDataText}>
            <Ionicons
              name="ios-location-outline"
              size={26}
              color="black"
              style={{ marginTop: 0, marginLeft: 1 }}
            ></Ionicons>{" "}
            {cityChanged ? newCity : currentUser.city}
          </Text>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                  <Pressable
                    style={{ marginLeft: 120, paddingBottom: 20 }}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Ionicons name="close-circle-outline" size={25}></Ionicons>
                  </Pressable>
                  <TextInput
                    placeholder={"Enter new postcode..."}
                    style={modalStyles.modalText}
                    onChangeText={(text) => handlePostcodeChange(text)}
                  ></TextInput>
                  <TextInput
                    placeholder={"Enter city..."}
                    style={modalStyles.modalText}
                    onChangeText={(text) => handleCityChange(text)}
                  ></TextInput>
                  <Pressable
                    style={
                      postcodeVerified
                        ? [modalStyles.button, modalStyles.buttonSubmitted]
                        : [modalStyles.button, modalStyles.buttonClose]
                    }
                    onPress={handleEditLocation}
                  >
                    <Text style={modalStyles.textStyle}>
                      {postcodeVerified ? "Submitted!" : "Update"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text
                style={{
                  fontFamily: "HelveticaNeue",
                  color: "blue",
                  textDecorationLine: "underline",
                }}
              >
                Edit your location
              </Text>
            </Pressable>
          </View>
          <TouchableOpacity onPress={handleEditButton}></TouchableOpacity>
        </View>
        {/* <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "black",
            }}
          >
            📚 {currentUser.books.length} books on offer.
          </Text>
        </View> */}

        <View style={styles.treeDataBox}>
          <Text style={styles.treeDataText}>
            <Foundation name="trees" size={23} color="black" />{" "}
            {getTreeCount(currentUser)} trees saved
          </Text>
        </View>

        {/* Current Styling }
        {/* <View style={styles.usernameContainer}>
          <Text style={styles.username}>
            {currentUser ? currentUser.username : "Loading..."}
          </Text>
        </View> */}

        {/* <View style={styles.iconsContainer}>
          <View style={styles.iconBox}>
            <BooksHomedLink />
          </View>
          <View
            style={[
              styles.iconBox,
              {
                borderColor: "#DFD8C8",
                borderLeftWidth: 1,
                borderRightWidth: 1,
              },
            ]}
          >
            <BooksOfferedLink />
          </View>
          <View
            style={[
              styles.iconBox,
              {
                borderColor: "#DFD8C8",
                borderRightWidth: 1,
              },
            ]}
          >
            <MapButton />
          </View>
          <View style={styles.iconBox}>
            <TreeIcon />
          </View>
        </View> */}

        <View style={{ marginTop: 32 }}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_item, index) => index}
            data={currentUserBooks}
            renderItem={ItemView}
          ></FlatList>

          <View style={styles.bookCount}>
            <Text style={styles.bookCountText}>
              {currentUser.books.length} books on offer
            </Text>
          </View>
        </View>

        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.avatarContainer}></View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "white",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "120%",
  },
  scrollView: {
    flex: 1,
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D",
  },
  // headerIconBar: {
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   marginTop: 10,
  //   marginHorizontal: 16,
  // },
  // ios_settings_outline: {
  //   marginTop: 10,
  //   backgroundColor: "#41444B",
  //   width: 31,
  //   height: 31,
  //   borderColor: "white",
  //   borderWidth: 3,
  //   borderRadius: 20,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   shadowColor: "white",
  //   shadowOffset: {
  //     width: 2,
  //     height: 4,
  //   },
  //   position: "absolute",
  //   left: 300,
  //   shadowOpacity: 5,
  //   shadowRadius: 15,
  //   elevation: 7,
  // },
  profileShadow: {
    alignItems: "center",
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 15,

    elevation: 7,
  },
  profileImageContainer: {
    width: 152,
    height: 152,
    borderRadius: 100,
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 0,
    borderColor: "white",
    borderWidth: 4,
  },
  profileImage: {
    flex: 1,
    height: 150,
    width: 150,
    alignItems: "center",
    resizeMode: "cover",
  },
  usernameContainer: {
    alignSelf: "center",
    alignItems: "center",
    // backgroundColor: "#DCDCDC",
    // borderColor: "white",
    // borderWidth: 3,
    marginTop: 5,
    marginBottom: 5,
    // borderRadius: 25,
    // shadowColor: "grey",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 10,

    // elevation: 10,
  },
  username: {
    fontSize: 18,
    fontFamily: "HelveticaNeue",
    color: "black",
    fontWeight: "600",
    margin: 5,
    padding: 2,
  },
  locationDataBox: {
    paddingVertical: 5,
    paddingHorizontal: 2,
    //flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: 172,
    // backgroundColor: "white",
    // borderColor: "#DCDCDC",
    // borderWidth: 2,
    marginTop: 2,
    marginBottom: 0,
    // borderRadius: 25,
    // shadowColor: "grey",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 10,

    // elevation: 5,
  },
  locationDataText: {
    fontSize: 14,
    fontFamily: "HelveticaNeue",
    color: "black",
    fontWeight: "600",
  },
  treeDataBox: {
    paddingVertical: 5,
    paddingHorizontal: 2,
    //flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: 172,
    // backgroundColor: "#DCDCDC",
    // borderColor: "#DCDCDC",
    // borderWidth: 2,
    marginTop: 4,
    marginBottom: 5,
    // borderRadius: 25,
    // shadowColor: "grey",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 7,

    // elevation: 10,
  },
  treeDataText: {
    fontSize: 14,
    fontFamily: "HelveticaNeue",
    color: "black",
    fontWeight: "500",
    margin: 0,
    padding: 0,
  },
  // subText: {
  //   fontSize: 12,
  //   color: "#AEB5BC",
  //   textTransform: "uppercase",
  //   fontWeight: "500",
  // },
  // iconsContainer: {
  //   flexDirection: "row",
  //   alignSelf: "center",
  //   marginTop: 10,
  //   marginBottom: 15,
  // },
  // iconBox: {
  //   alignItems: "center",
  //   flex: 1,
  //   paddingLeft: 30,
  //   paddingRight: 30,
  // },
  bookCount: {
    // backgroundColor: "white",
    position: "absolute",
    marginTop: -33,
    alignSelf: "center",
    width: 170,
    height: 42,
    // borderColor: "#DCDCDC",
    // borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    flexDirection: "row",
    // shadowColor: "grey",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 10,

    // elevation: 10,
  },
  bookCountText: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    color: "grey",
    fontWeight: "500",
  },
  bookCoverContainerShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 7,

    elevation: 10,
  },
  bookCoverContainer: {
    borderRadius: 10,
    // borderColor: "white",
    // borderWidth: 6,
    overflow: "hidden",
    width: "90%",
    // height: 260,
    marginHorizontal: 5,
    marginTop: 18,
    // marginBottom: 10,
  },
  coverImage: {
    width: 170,
    height: 260,

    borderRadius: 5,
  },

  // removeBookIcon: {
  //   marginBottom: 5,
  // },
  // removeBookIconCover: {
  //   position: "absolute",
  //   alignSelf: "center",
  //   zIndex: 100,
  //   right: 1,
  // },
  iconBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    width: 25,
    borderRadius: 12.5,
    position: "absolute",
    top: 3,
    zIndex: 105,
    right: 1,
    backgroundColor: "#41444B",
    shadowColor: "#f6f4f3",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },

  // modal
  modalContainer: {
    // flex: 1,
    justifyContent: "center",
    // marginTop: 250,
    // marginBottom: 250,
    // marginLeft: 50,
    // marginRight: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalInfo: {
    alignItems: "center",
  },
  yesButton: {
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    width: 80,
    marginBottom: 10,
  },
  noButton: {
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    width: 80,
  },
  yesText: {
    fontSize: 20,
  },
  noText: {
    fontSize: 20,
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 5,
    paddingBottom: 35,
    paddingLeft: 35,
    paddingRight: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "60%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginRight: 20,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#76c893",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 4,

    elevation: 10,
  },
  buttonSubmitted: {
    backgroundColor: "#03C04A",
  },
  textStyle: {
    color: "#76c893",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    marginRight: 20,
    textAlign: "center",
  },
});
