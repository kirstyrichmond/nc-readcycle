import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/User";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Icon,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { getDistance, convertDistance } from "geolib";
import { getAllUsers, getUserDetails } from "../db/firestore";
import styled from "styled-components/native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation, route }) {
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allBooks, setAllBooks] = useState();
  const [currentUser, setCurrentUser] = useState();
  const { user, setUser } = useContext(UserContext);
  const [multiSliderValue, setMultiSliderValue] = useState([0, 20]);
  const [distance, setDistance] = useState(100);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = filteredDataSource.filter((book) => {
        return book.title.toLowerCase().includes(text.toLowerCase());
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(allBooks);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.bookBox}>
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
          <View style={styles.imagebox}>
            <Image
              style={styles.image}
              source={{
                uri: item.highResImage,
              }}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.textshadow}>
          <View style={styles.textBox}>
            <Text style={styles.bookText}>{item.title}</Text>
            <Text style={styles.bookText}>{item.distance} mi</Text>
          </View>
        </View>
      </View>
    );
  };

  function calculateBookDistance(book, userLocation) {
    const result = convertDistance(
      getDistance(userLocation, {
        latitude: book.coordinates.latitude,
        longitude: book.coordinates.longitude,
      }),
      "mi"
    ).toFixed(2);
    return result;
  }
  useEffect(() => {
    const fetchCurrentUser = async (user) => {
      const result = await getUserDetails(user);
      setCurrentUser(result);
    };
    const fetchAllBooks = async (user) => {
      const result = await getAllUsers();
      const books = [];
      let userLocation = {};
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].books.length; j++) {
          if (user !== result[i].books[j].uid) {
            books.push(result[i].books[j]);
          } else {
            userLocation = result[i].books[j].coordinates;
          }
        }
      }
      for (let i = 0; i < books.length; i++) {
        books[i].distance = Number(
          calculateBookDistance(books[i], userLocation)
        );
      }
      const sortedBooks = books.sort((a, b) => {
        return a.distance - b.distance;
      });
      setAllBooks(sortedBooks);
      setAllUsers(result);
      setFilteredDataSource(sortedBooks);
    };
    fetchCurrentUser(user);
    fetchAllBooks(user);
  }, [user, getAllUsers, getUserDetails]);

  function handleChange(distance) {
    setDistance(distance);
    const array = allBooks.filter((book) => distance > book.distance);
    setFilteredDataSource(array);
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.pageContainer}>
        <View style={styles.searchbarContainer}>
          <TextInput
            style={styles.searchbarInput}
            value={search}
            placeholder="search books..."
            onChangeText={(text) => {
              searchFilterFunction(text);
            }}
          />
          <View style={styles.sliderHeaderContainer}>
            <Text style={styles.sliderHeader}>
              up to {Math.round(distance)} miles
            </Text>

            <Slider
              style={{ width: 200, height: 40 }}
              value={distance}
              onValueChange={(distance) => handleChange(distance)}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#D1D1D1"
              maximumTrackTintColor="#D1D1D1"
            />
          </View>
        </View>
        <View style={styles.bookFilter}>
          {/* <Text>112 trees saved</Text> */}
          <Text>{filteredDataSource.length} books</Text>
          <View style={styles.sliderContainer}></View>
        </View>
        <View></View>
        <View style={styles.list}>
          {!filteredDataSource.length ? (
            <Text style={styles.sliderMessage}>
              Sorry we couldn't find any books that close to you, please expand
              your radius.
            </Text>
          ) : (
            <FlatList
              numColumns={3}
              keyExtractor={(_item, index) => index}
              data={filteredDataSource}
              renderItem={ItemView}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F8F8F8",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    // height: "120%",
  },
  searchbarContainer: {
    width: "100%",
    marginTop: -20,
  },
  searchbarInput: {
    borderColor: "#1323",
    borderWidth: 2,
    // borderRadius: 20,
    marginTop: 0,
    padding: 7,
    textAlign: "center",
    backgroundColor: "white",
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 15,

    elevation: 7,
  },
  sliderHeaderContainer: {
    // backgroundColor: "white",
    // borderRadius: 20,
    marginTop: 5,
    alignItems: "center",
    // shadowColor: "white",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 5,
    // shadowRadius: 15,

    // elevation: 7,
  },
  sliderHeader: {
    width: "40%",
    justifyContent: "center",
    fontFamily: "HelveticaNeue",
    color: "#41444B",
    fontWeight: "600",
    fontSize: 16,
    // borderColor: "#1323",
    // borderWidth: 2,
    // borderRadius: 20,
    padding: 2,
    textAlign: "center",
  },
  sliderMessage: {
    fontFamily: "HelveticaNeue",
    color: "#41444B",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    padding: 4,
    borderColor: "white",
    borderWidth: 2,
    // borderRadius: 20,
    margin: 15,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 15,

    elevation: 7,
  },
  bookFilter: {
    marginTop: 5,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 2,
    padding: 10,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#DCDCDC",
    shadowColor: "#DCDCDC",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 15,

    elevation: 7,
  },
  list: {
    width: "100%",
    marginBottom: 0,
  },
  bookBox: {
    flex: 1,
    overflow: "hidden",
    marginTop: 5,
    paddingTop: 0,
    paddingRight: 10,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "#8d99ae",
    // borderWidth: 0.5,
  },
  imagebox: {
    // backgroundColor: "white",
    width: 128,
    height: 198,
    // borderRadius: 10,
    // borderColor: "white",
    // borderWidth: 4,
    // shadowColor: "pink",
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 17,

    // elevation: 10,
  },
  image: {
    marginTop: 0,
    marginHorizontal: 0,
    marginBottom: 3,
    width: 118,
    height: 180,
    borderRadius: 5,
  },
  textBox: {
    // backgroundColor: "#edf6f9",
    marginLeft: 11,
    // marginTop: 10,
    marginBottom: 0,
    // borderColor: "white",
    // borderWidth: 6,
    // borderRadius: 15,
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 128,
    height: 60,
    // shadowColor: "pink",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 4,

    // elevation: 10,
  },
  bookText: {
    fontFamily: "HelveticaNeue",
    color: "#41444B",
    fontWeight: "600",
    fontSize: 10,
    margin: 3,
    padding: 0,
  },
});
