import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import React, { useState } from "react";
import axios from "axios";

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

import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { NavigationContainer } from "@react-navigation/native";

const { primary, brand, darkLight } = Colors;

const SignUp = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date("2000-01-01"));

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleSignUp = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = "https://backend-authentication.herokuapp.com/user/signup";

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status !== "SUCCESS") {
          handleMessage(message, status);
        } else {
          navigation.navigate("Welcome", { ...data });
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

  const [dob, setDob] = useState();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageTitle>Sign Up</PageTitle>
          <SubTitle>Account Sign Up</SubTitle>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <Formik
            initialValues={{
              name: "",
              email: "",
              dateOfBirth: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              values = { values, dateOfBirth: dob };
              if (
                values.name == "" ||
                values.email == "" ||
                values.dateOfBirth == "" ||
                values.password == "" ||
                values.confirmPassword == ""
              ) {
                handleMessage("Please fill all the inputs !!!");
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage("Password do not match");
                setSubmitting(false);
              } else {
                handleSignUp(values, setSubmitting);
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
                  label="Full Name"
                  icon="person"
                  placeholder="Full Name"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
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
                  label="Date of Birth"
                  icon="calendar"
                  placeholder="YYYY-MM-DD"
                  onChangeText={handleChange("dateOfBirth")}
                  onBlur={handleBlur("dateOfBirth")}
                  value={dob ? dob.toDateString() : ""}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
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
                <UserTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="******"
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  isPassword={true}
                  secureTextEntry={hidePassword}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Sign Up </ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
                <Line />

                <ExtraView>
                  <ExtraText> Already have an account? </ExtraText>
                  <TextLink onPress={() => navigation.navigate("Login")}>
                    <TextLinkContent> Log In </TextLinkContent>
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

const UserTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  isDate,
  showDatePicker,
  ...props
}) => {
  const mail = <Foundation name="mail" size={30} color={brand} />;
  const password = <FontAwesome name="lock" size={30} color={brand} />;
  const calendar = <AntDesign name="calendar" size={30} color={brand} />;
  const person = <Ionicons name="person" size={30} color={brand} />;
  return (
    <View>
      <LeftIcon>
        {icon === "mail"
          ? mail
          : icon === "lock"
          ? password
          : icon === "calendar"
          ? calendar
          : person}
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
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

export default SignUp;
