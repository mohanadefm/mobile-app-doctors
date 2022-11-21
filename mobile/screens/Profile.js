import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PROFILE_URL, API_URL, SIGNIN_URL, REMOVE_URL } from "../config/urls";
import axios from "axios";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "./styles/profileStyles";
import { transformName } from "../config/helpers";

function Profile(props) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    _getProfile();
  }, []);

  const _getProfile = () => {
    (async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("accessToken");
        axios.defaults.headers.common.Authorization = `JWT ${token}`;
        const response = await axios.get(`${API_URL}/account/profile`);
        setUser(response.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    })();
  };

  deleteUser = () => {
    Alert.alert(
      "",
      "تسجيل الخروج؟",
      [
        { text: "إغلاق", style: "cancle" },
        {
          text: "موافق",
          onPress: async () => {
            const res = await axios.delete(`${API_URL}/account/delete`); //(REMOVE_URL, { id });
            await AsyncStorage.clear();
            props.navigation.navigate("Home");
          },
        },
      ],
      { cancelable: false }
    );
  };

  signOut = () => {
    Alert.alert(
      "",
      "تسجيل الخروج؟",
      [
        { text: "إغلاق", style: "cancle" },
        {
          text: "موافق",
          onPress: async () => {
            await AsyncStorage.clear();
            props.navigation.navigate("Home");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Loader title="إحضار بيانات الملف الشخصي" loading={isLoading} />
      {user && (
        <View>
          <View style={styles.userMetaContainer}>
            <View style={styles.userAvtar}>
              <Text style={styles.userAvtarText}>
                {transformName(user.name)}
              </Text>
            </View>
            <View style={styles.userMeta}>
              <Text style={{ fontSize: 20 }}>{user.name}</Text>
              <Text style={{ fontSize: 20 }}>{user.email}</Text>
            </View>
          </View>
          {user.profile && (
            <View>
              <View style={styles.doctorInfo}>
                <View style={styles.infoCell}>
                  <Text style={styles.infoTitle}>الاختصاص</Text>
                  <Text style={styles.infoText}>
                    {user.profile.specialization}
                  </Text>
                </View>
                <View style={styles.infoCell}>
                  <Text style={styles.infoTitle}>العنوان</Text>
                  <Text style={styles.infoText}>{user.profile.address}</Text>
                </View>
                <View style={styles.infoCell}>
                  <Text style={styles.infoTitle}>ساعات العمل</Text>
                  <Text style={styles.infoText}>
                    {user.profile.workingHours}
                  </Text>
                </View>
                <View style={styles.infoCell}>
                  <Text style={styles.infoTitle}>رقم الهاتف</Text>
                  <Text style={styles.infoText}>{user.profile.phone}</Text>
                </View>
              </View>
            </View>
          )}
          <Button
            buttonStyles={styles.logoutButton}
            textStyles={styles.buttonText}
            text="إزالة الحساب"
            onPress={deleteUser}
          />
          <Button
            buttonStyles={styles.logoutButton}
            textStyles={styles.buttonText}
            text="تسجيل الخروج"
            onPress={signOut}
          />
        </View>
      )}
    </View>
  );
}

export default Profile;
