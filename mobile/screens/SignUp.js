import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  CheckBox,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import styles from "./styles/authStyles";
import ScreenTitle from "../components/ScreenTitle";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import axios from "../config/axios";
import { SIGNUP_URL, API_URL } from "../config/urls";

function SignUp(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    address: "",
    workingHours: "",
    userType: false,
    location: null,
  });
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ message: null });
    }, 3000);
    return () => clearTimeout(timer);
  }, [alert.message]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const changeFormValue = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validate = () => {
    const {
      name,
      email,
      password,
      specialization,
      phone,
      address,
      workingHours,
      userType,
    } = formData;
    let validationErrors = [];
    let passed = true;

    if (!name) {
      validationErrors.push("الرجاء إدخال الاسم");
      passed = false;
    }
    if (!email) {
      validationErrors.push("الرجاء إدخال البريد الالكتروني");
      passed = false;
    }
    if (!password) {
      validationErrors.push("الرجاء إدخال كلمة المرور");
      passed = false;
    }

    if (userType) {
      if (!specialization) {
        validationErrors.push("الرجاء إدخال التخصص");
        passed = false;
      }
      if (!workingHours) {
        validationErrors.push("الرجاء إدخال ساعات العمل");
        passed = false;
      }
      if (!phone) {
        validationErrors.push("الرجاء إدخال رقم الهاتف");
        passed = false;
      }
      if (!address) {
        validationErrors.push("الرجاء إدخال العنوان");
        passed = false;
      }
    }

    if (validationErrors.length > 0) {
      setAlert({ message: validationErrors, type: "danger" });
    }

    return passed;
  };

  // We wrote function this way to refer that is an async function
  const _signUp = () => {
    (async () => {
      if (!validate()) return;
      setIsLoading(true);
      const {
        name,
        email,
        password,
        specialization,
        phone,
        address,
        workingHours,
        userType,
      } = formData;

      const body = {
        name,
        email,
        password,
        userType: userType ? "doctor" : "normal",
        specialization,
        phone,
        address,
        workingHours,
        location: {
          latitude: location ? location.coords.latitude : null,
          longitude: location ? location.coords.longitude : null,
        },
      };

      try {
        await axios.post(SIGNUP_URL, body);
        setFormData({
          name: "",
          email: "",
          password: "",
          specialization: "",
          address: "",
          phone: "",
          workingHours: "",
          location: null,
          userType: false,
        });
        setIsLoading(false);
        props.navigation.navigate("SignIn");
      } catch (e) {
        setAlert({
          message: e.response.data.errors[0].message,
          type: "danger",
        });
        setIsLoading(false);
      }
    })();
  };

  const {
    name,
    email,
    password,
    specialization,
    phone,
    address,
    workingHours,
    userType,
  } = formData;

  // -------------------------------------------------------------

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
      <Loader title="إنشاء حساب جديد" loading={isLoading} />
      <Alert messages={alert.message} type={alert.type} />

      <View style={styles.container}>
        <ScreenTitle title="إنشاء حساب جديد" icon="md-person-add" />

        <KeyboardAvoidingView behavior="padding" enabled>
          <Input
            placeholder="الاسم"
            value={name}
            onChangeText={(text) => changeFormValue("name", text)}
          />
          <Input
            placeholder="البريد الالكتروني"
            value={email.replace(" ", "")}
            onChangeText={(text) => changeFormValue("email", text)}
          />
          <Input
            secureTextEntry
            placeholder="كلمة المرور"
            value={password}
            onChangeText={(text) => changeFormValue("password", text)}
          />

          <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              value={userType}
              onChange={() => changeFormValue("userType", !formData.userType)}
            />
            <Text style={styles.checkboxLabel}> طبيب </Text>
          </View>

          {userType && (
            <React.Fragment>
              <Input
                placeholder="التخصص"
                value={specialization}
                onChangeText={(text) => changeFormValue("specialization", text)}
              />
              <Input
                placeholder="ساعات العمل"
                value={workingHours}
                onChangeText={(text) => changeFormValue("workingHours", text)}
              />
              <Input
                placeholder="العنوان"
                value={address}
                onChangeText={(text) => changeFormValue("address", text)}
              />
              <Input
                placeholder="الهاتف"
                value={phone}
                onChangeText={(text) => changeFormValue("phone", text)}
              />
            </React.Fragment>
          )}

          <Button text="إنشاء" onPress={_signUp} />
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
}

export default SignUp;
