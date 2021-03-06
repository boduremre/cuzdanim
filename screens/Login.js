import React from "react";
import {
  Text,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import { Input, Button, Icon } from "react-native-elements";
import Firebase from "../Firebase";
import styles from "../styles/LoginStyle";

const { width } = Dimensions.get("window").width;

export default class Login extends React.Component {
  state = {
    email: "",
    password: "",
    loading: true,
  };

  componentDidMount = () => {
    Firebase.auth().onAuthStateChanged((auth) => {
      if (auth) {
        //this.props.navigation.dispatch(StackActions.replace("Anasayfa"));
      } else {
        this.setState({ loading: false });
      }
    });
  };

  loginApp = () => {
    if (
      this.state.email == null ||
      this.state.email == "" ||
      this.state.password == null ||
      this.state.password == ""
    ) {
      Alert.alert("Hata", "Kullanıcı Adı veya Şifre boş geçilemez!", [
        { text: "Tamam" },
      ]);
    } else {
      this.setState({ loading: false });

      Firebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch((err) => {
          this.setState({ loading: false });
          if (err.code === "auth/user-not-found") {
            Alert.alert(
              "Oops",
              "Eposta adresi ile kayıtlı kullanıcı bulunamadı!",
              [{ text: "Tamam" }]
            );
          }
        });
    }
  };

  goSignUp = () => {
    const pushAction = StackActions.push("CreateAccount");
    this.props.navigation.dispatch(pushAction);
  };

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              marginTop: 200,
              justifyContent: "center",
              alignItems: "center",
              margin: 25,
            }}
          >
            <Icon
              name="wallet"
              size={50}
              type="material-community"
              color="#00aced"
            />
            <Text style={styles.logoText}>Cüzdanım</Text>
            <Input
              placeholder="E-posta adresi"
              style={{
                paddingVertical: 5,
                borderBottomWidth: 0.5,
                borderColor: "lightgray",
                color: "#00aced",
                width: width,
              }}
              errorStyle={{ color: "red" }}
              underlineColorAndroid="transparent"
              onChangeText={(email) => this.setState({ email: email })}
              value={this.state.email}
              keyboardType="email-address"
              placeholderTextColor="gray"
              autoCapitalize="none"
            />
            <Input
              placeholder="Şifre"
              style={{
                paddingVertical: 5,
                borderBottomWidth: 0.5,
                borderColor: "lightgray",
                color: "#00aced",
              }}
              underlineColorAndroid="transparent"
              onChangeText={(password) => this.setState({ password: password })}
              value={this.state.password}
              secureTextEntry
              placeholderTextColor="gray"
            />
          </View>
          <View style={{ width: width, alignItems: "center" }}>
            <Button
              onPress={() => this.loginApp()}
              title="Giriş"
              buttonStyle={{ width: width, alignItems: "center" }}
            />
            <TouchableOpacity
              onPress={() => this.goSignUp()}
              style={{ marginTop: 15 }}
            >
              <Text style={{ fontSize: 12, color: "#000" }}>
                Hesabınız mı yok?{" "}
                <Text
                  style={{ fontWeight: "bold", fontSize: 12, color: "#000" }}
                >
                  Kayıt Ol
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}
