import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";

const auth = getAuth();

export default function LogOutScreen({ navigation }) {
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate("SignUpScreen");
    });
  };

  return (
    <View style={styles.pageContainer}>
       {/* <LinearGradient
        // Background Linear Gradient
        colors={["#f7edf2","#dee2ff",  "white"]}
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
<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.text}>Log Out.</Text>
      </TouchableOpacity>
    </View>

    </View>
    
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: "100%",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  button: {
    // backgroundColor: "#FFC0CB",
    backgroundColor: "#DCDCDC",
    borderRadius: 30,
    width: "30%",
    height: 45,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 2,
    shadowColor: "#DCDCDC",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 17,

    elevation: 10,
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  }
});
