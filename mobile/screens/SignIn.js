import React, { useState, useEffect } from "react";
import { ScrollView, KeyboardAvoidingView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../config/axios";
import { SIGNIN_URL } from "../config/urls";
import styles from "./styles/authStyles";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import ScreenTitle from "../components/ScreenTitle";

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ message: null });
    }, 3000);
    return () => clearTimeout(timer);
  }, [alert.message]);

  const changeEmailHandler = (value) => {
    setEmail(value);
  };

  const changePasswordHandler = (value) => {
    setPassword(value);
  };

  const validate = () => {
    let validationErrors = [];
    let passed = true;
    if (!email) {
      validationErrors.push("الرجاء إدخال البريد الالكتروني");
      passed = false;
    }
    if (!password) {
      validationErrors.push("الرجاء إدخال كلمة المرور");
      passed = false;
    }
    if (validationErrors.length > 0) {
      setAlert({ message: validationErrors, type: "danger" });
    }
    return passed;
  };

  const _signIn = () => {
    (async () => {
      if (!validate()) return;
      setIsLoading(true);
      try {
        const response = await axios.post(SIGNIN_URL, { email, password });
        setIsLoading(false);
        setEmail("");
        setPassword("");
        AsyncStorage.setItem("accessToken", response.data.accessToken);
        props.navigation.navigate("Home");
      } catch (e) {
        setIsLoading(false);
        setAlert({ message: e.response.data.message, type: "danger" });
      }
    })();
  };

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
      <View style={styles.container}>
        <Loader title="جاري إنشاء حساب جديد" loading={isLoading} />
        <Alert messages={alert.message} type={alert.type} />
        <ScreenTitle title="تسجيل الدخول" icon="md-log-in" />
        <KeyboardAvoidingView behavior="padding" enabled>
          <Input
            placeholder="البريد الالكتروني"
            value={email.replace(" ", "")}
            onChangeText={changeEmailHandler}
          />
          <Input
            placeholder="كلمة المرور"
            value={password}
            onChangeText={changePasswordHandler}
          />
          <Button text="دخول" onPress={_signIn} />
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
}

export default SignIn;
