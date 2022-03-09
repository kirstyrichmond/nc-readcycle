import * as React from "react";
import { useCallback, useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { api } from "../api";
import { Formik } from "formik";
import * as yup from "yup";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { getUserDetails, sendBook } from "../db/firestore";
import { UserContext } from "../contexts/User";
import { LinearGradient } from "expo-linear-gradient";
import { Center } from "native-base";

export default function ListBookScreen({ navigation, route }) {
  const { user, setUser } = useContext(UserContext);
  const [ISBN, setISBN] = useState("");
  const [addBookButton, setAddBookButton] = useState(false);
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");
  const [highResImageLink, setHighResImageLink] = useState(
    "https://wallpapercave.com/dwp2x/wp5209035.jpg"
  );
  const [altImageLink, setAltImageLink] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [language, setLanguage] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [searchISBN, setSearchISBN] = useState("");
  const [coordinates, setCoordinates] = useState();

  useEffect(async () => {
    if (route.params?.ISBN) {
      setISBN(route.params?.ISBN);
      APIcall(route.params?.ISBN);
    }
    const { coordinates } = await getUserDetails(user);
    setCoordinates(coordinates);
  }, [route.params?.ISBN]);

  // API call after barcode is scanned
  const APIcall = (searchISBN) => {
    api
      .get(
        `/books/v1/volumes?q=isbn:${searchISBN}&key=AIzaSyAVVkhe8oG7Y5vOVfzbb4tiSNuq5r0mbhQ`
      )
      .then((response) => {
        setISBN(searchISBN);
        setTitle(response.data.items[0].volumeInfo.title);
        setId(response.data.items[0].id);
        setHighResImageLink(
          `https://books.google.com/books/publisher/content/images/frontcover/${response.data.items[0].id}?fife=w400-h600&source=gbs_api`
        );
        setAltImageLink(response.data.items[0].volumeInfo.imageLinks.thumbnail);
        setAuthor(response.data.items[0].volumeInfo.authors[0]);
        setCategory(response.data.items[0].volumeInfo.categories[0]);
        setDescription(response.data.items[0].volumeInfo.description);
        setPageCount(response.data.items[0].volumeInfo.pageCount);
        setLanguage(response.data.items[0].volumeInfo.language);
        setPublishedDate(response.data.items[0].volumeInfo.publishedDate);
        setAddBookButton(true);
      });
  };

  // Take object from form
  const afterSubmit = (ISBN) => {
    const bookObj = {
      title: title,
      id: id,
      highResImage: highResImageLink,
      altImage: altImageLink,
      author: author,
      category: category,
      description: description,
      pageCount: pageCount,
      language: language,
      publishedDate: publishedDate,
      uid: user,
      ISBN: ISBN,
      coordinates: coordinates,
    };
    console.log(bookObj);
    sendBook(bookObj, user);
    resetState();
  };

  const resetState = () => {
    setTitle("");
    setHighResImageLink("https://wallpapercave.com/dwp2x/wp5209035.jpg");
    setAltImageLink("");
    setAuthor("");
    setCategory("");
    setDescription("");
    setPageCount("");
    setLanguage("");
    setPublishedDate("");
    setISBN("");
    setSearchISBN("");
    setAddBookButton(false);
  };

  // Validation schema
  // const bookSchema = yup.object({
  //   title: yup.string().required().min(2),
  //   author: yup.string().required().min(5),
  //   category: yup.string().required().min(2),
  //   ISBN: yup.string().required().min(10),
  // });

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
      <ScrollView>
        {/* Barcode Button */}
        <TouchableOpacity
          style={styles.barcodeButton}
          onPress={() => navigation.navigate("ScannerScreen")}
        >
          <Text style={styles.barcodeText}>Scan a barcode</Text>
          <MaterialCommunityIcons
            style={{ margin: 0, padding: 0 }}
            name="barcode"
            size={40}
            color="black"
          />
        </TouchableOpacity>

        {/* Text */}
        <Text style={styles.searchByISBN}>or Search by ISBN:</Text>

        {/* ISBN Search Box */}
        <View style={styles.searchByISBNBox}>
          <TextInput
            style={styles.searchTextbox}
            value={searchISBN}
            onChangeText={(value) => setSearchISBN(value)}
            placeholder="e.g. 9780198829195"
          />
          <View style={styles.searchButtonContainer}>
            <TouchableOpacity onPress={() => APIcall(searchISBN)}>
              <Ionicons
                style={styles.searchButtonIcon}
                name="ios-search"
                size={34}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Book picture box  */}
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image
              style={styles.image}
              source={{
                uri: highResImageLink,
              }}
            />
          </View>
          <Text style={styles.bookTitle}>{title}</Text>
        </View>

        {/* Submit Button */}
        {addBookButton && (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => afterSubmit(ISBN)}
            title="Submit"
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
        {addBookButton && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => resetState()}
            title="Clear"
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "120%",
  },
  barcodeButton: {
    // flex: 1,
    // flexDirection: "row",
    height: 75,
    width: 270,
    alignSelf: "center",
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderColor: "white",
    borderRadius: 40,
    borderWidth: 2,
    // borderColor: "red",
    // borderWidth: 1,
  },
  barcodeText: {
    fontFamily: "HelveticaNeue",
    color: "black",
    fontSize: 22,
    paddingTop: 10,
  },
  searchByISBN: {
    textAlign: "center",
    fontFamily: "HelveticaNeue",
    color: "black",
    fontSize: 18,
  },
  searchByISBNBox: {
    width: 260,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 10,
    // borderColor: "red",
    // borderWidth: 1,
  },
  searchButtonContainer: {
    position: "absolute",
    height: 60,
    width: 60,
    backgroundColor: "#E0E0E0",
    borderRadius: 40,
    left: 200,
    borderColor: "white",
    borderWidth: 2,
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 3,
  },
  searchButtonIcon: {
    position: "absolute",
    left: 11,
    top: 10,
  },
  searchTextbox: {
    alignSelf: "center",
    flex: 1,
    width: 230,
    height: 40,
    paddingLeft: 20,
    borderRadius: 25,
    borderWidth: 2,
    margin: 0,
    fontFamily: "HelveticaNeue",
    color: "black",
    fontSize: 18,
    // borderColor: "red",
    // borderWidth: 1,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
  },
  imageBox: {
    // flex: 1,
    width: 270,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "dashed",
    borderRadius: 10,
    // borderColor: "red",
    // borderWidth: 1,
  },
  image: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //width: "70%",
    height: 270,
    aspectRatio: 0.75,
    margin: 10,
    padding: 0,
    borderRadius: 10,
    // borderColor: "red",
    borderWidth: 1,
  },

  bookTitle: {
    color: "red",
    fontWeight: "500",
    fontFamily: "HelveticaNeue",
    color: "black",
    fontSize: 18,
    width: "80%",
    textAlign: "center",
    paddingTop: 5,

    // borderColor: "red",
    // borderWidth: 1,
  },
  submitButton: {
    height: 50,
    width: 80,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderColor: "white",
    borderRadius: 40,
    borderWidth: 2,
    marginTop: 10,
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 3,
  },
  submitButtonText: {
    fontFamily: "HelveticaNeue",
    color: "black",
    fontSize: 18,
  },
  clearButton: {
    height: 50,
    width: 80,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#ffbd03",
    borderColor: "white",
    borderRadius: 40,
    borderWidth: 2,
    marginTop: 15,
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 3,
  },
  clearButtonText: {
    fontFamily: "HelveticaNeue",
    color: "black",
    fontSize: 18,
  },
});
