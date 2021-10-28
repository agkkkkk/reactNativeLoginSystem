import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import React, { useState } from "react";
import axios from "axios";

import * as Google from "expo-google-app-auth";

import {
  AntDesign,
  FontAwesome,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";

import {
  InnerContainer,
  LeftIcon,
  Logo,
  PageTitle,
  StyledContainer,
  StyledFormArea,
  SubTitle,
  Colors,
  StyledTextInput,
  StyledInputLabel,
  StyledButton,
  RightIcon,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from "../components/styles";

import { ActivityIndicator, View } from "react-native";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

const { primary, brand, darkLight } = Colors;

const UserTextInput = ({
  label,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  const mail = <Foundation name="mail" size={30} color={brand} />;
  const password = <FontAwesome name="lock" size={30} color={brand} />;
  return (
    <View>
      <LeftIcon>{label === "Email" ? mail : password}</LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "eye" : "eye-off"}
            size={30}
            color={darkLight}
          />
        </RightIcon>
      )}
    </View>
  );
};

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = "https://backend-authentication.herokuapp.com/user/signin";

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status !== "SUCCESS") {
          handleMessage(message, status);
        } else {
          navigation.navigate("Welcome", { ...data[0] });
        }
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error.JSON());
        setSubmitting(false);
        handleMessage("An error occurred. Check your Network and try again!");
      });
  };

  const handleMessage = (message, type = "FALIED") => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessageType(null);
      setMessage(null);
    }, 3000);
  };

  const handleGoogleSignIn = () => {
    setGoogleSubmitting(true);
    const config = {
      androidClientId: `659293926504-lckerucbdacm1pm5rm8n5toleo4bbnuj.apps.googleusercontent.com`,
      scopes: ["profile", "email"],
    };
    Google.logInAsync(config)
      .then((result) => {
        const { type, user } = result;
        if (type == "success") {
          const { email, name, photoUrl } = user;
          handleMessage("Google SignIn successful", "SUCCESS");
          setTimeout(
            () => navigation.navigate("Welcome", { email, name, photoUrl }),
            1000
          );
        } else {
          handleMessage("Google signIn was cancelled");
        }
        setGoogleSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        handleMessage("An error occurred. Check your network and try again!");
        setGoogleSubmitting(false);
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <Logo
            resizeMode="cover"
            source={require("../assets/Images/loginPerson.png")}
          />
          <PageTitle>Login</PageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == "" || values.password == "") {
                handleMessage("Input field empty");
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <StyledFormArea>
                <UserTextInput
                  label="Email"
                  icon="mail"
                  placeholder="name@domain.com"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
                <UserTextInput
                  label="Password"
                  icon="lock"
                  placeholder="******"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  isPassword={true}
                  secureTextEntry={hidePassword}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="small" color={primary} />
                  </StyledButton>
                )}
                <Line />
                {!googleSubmitting && (
                  <StyledButton google={true} onPress={handleGoogleSignIn}>
                    <AntDesign name="google" size={24} color="black" />
                    <ButtonText google={true}>Sign In with Google</ButtonText>
                  </StyledButton>
                )}
                {googleSubmitting && (
                  <StyledButton google={true} disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
                <ExtraView>
                  <ExtraText> Don't have an account? </ExtraText>
                  <TextLink onPress={() => navigation.navigate("SignUp")}>
                    <TextLinkContent> Sign Up </TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default Login;
