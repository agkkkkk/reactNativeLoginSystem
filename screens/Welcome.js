import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Avatar,
  ButtonText,
  InnerContainer,
  Line,
  PageTitle,
  StyledButton,
  StyledFormArea,
  SubTitle,
  WelcomeContainer,
  WelcomeImage,
} from "../components/styles";

const Welcome = ({ navigation, route }) => {
  const { email, name, photoUrl } = route.params;
  const avatarImg = photoUrl
    ? { uri: photoUrl }
    : require("../assets/Images/avatar.png");
  return (
    <>
      <StatusBar style="light" />
      <InnerContainer>
        <WelcomeImage
          resizeMode="cover"
          source={require("../assets/Images/milky-way.jpg")}
        />
        <WelcomeContainer>
          <PageTitle>Welcome!</PageTitle>
          <SubTitle>{name}</SubTitle>
          <SubTitle>{email}</SubTitle>
          <StyledFormArea>
            <Avatar resizeMode="cover" source={avatarImg} />
            <Line />
            <StyledButton
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <ButtonText>Log Out</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </>
  );
};

export default Welcome;
