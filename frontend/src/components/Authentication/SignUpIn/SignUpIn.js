import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SignUpIn.css";

// Components
import Input from "../../Input/Input.js";
import Button from "../../Button/Button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

export default function SignUpIn({ isSignUp, setIsSignUp }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");

  const [loading, setLoading] = useState(false);

  function uploadProfilePicture(picture) {
    console.log(picture);
    setLoading(true);

    if (picture === undefined) {
      toast({
        title: "Select a Profile Picture",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (picture.type === "image/jpeg" || picture.type === "image/png") {
      const data = new FormData();

      data.append("file", picture);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dwmdwm");
      fetch("https://api.cloudinary.com/v1_1/dwmdwm/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfilePictureURL(data.url.toString());
          setLoading(false);
          toast({
            title: "Profile picture added successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }

  async function signUpWithEmail(e) {
    e.preventDefault();
    setLoading(true);

    if (!firstName || !email || !password || !confirmPassword) {
      toast({
        title: "All required fields must be filled",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/register",
        { firstName, lastName, email, password, profilePictureURL },
        config
      );

      toast({
        title: "User has been created successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      // localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      // navigate("/chats");
    } catch (error) {
      toast({
        title: "An error occured while trying to create this user",
        description: error.response.data.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    }
  }
  async function loginWithEmail(e) {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Email or Password field cannot be left empty",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: `Logged in successfully! Good to see you again, ${data.firstName}!`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      // localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      // navigate("/chats");
    } catch (error) {
      toast({
        title: "Oh snap! An error occured while trying to log you in.",
        description: error.response.data.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    }
  }

  function loginAsGuest(e) {
    e.preventDefault();
    setLoading(true);
  }

  return (
    <div className="signup-wrapper">
      <div className="brand-card">
        <div className="logo">Beacon</div>

        <div className="brand-card-header">
          {isSignUp ? "Create a Beacon Account" : "Use your Beacon Account"}
        </div>
      </div>

      <div className="form-card">
        <form>
          <div className="form-title-container">
            {isSignUp ? "Sign Up" : "Sign In"}
          </div>

          {isSignUp && (
            <>
              <div className="form-input-container">
                <Input
                  placeholder={"First Name*"}
                  isRequired={true}
                  onChange={setFirstName}
                />
              </div>

              <div className="form-input-container">
                <Input placeholder={"Last Name"} onChange={setLastName} />
              </div>
            </>
          )}

          <div className="form-input-container">
            <Input
              type="email"
              placeholder={isSignUp ? "Email*" : "Email"}
              isRequired={true}
              onChange={setEmail}
            />
          </div>

          <div className="form-input-container">
            <Input
              type="password"
              placeholder={isSignUp ? "Password*" : "Password"}
              isRequired={true}
              onChange={setPassword}
            />
          </div>

          {isSignUp && (
            <div className="form-input-container">
              <Input
                type="password"
                placeholder={"Confirm Password*"}
                isRequired={true}
                onChange={setConfirmPassword}
              />
            </div>
          )}

          {isSignUp && (
            <div className="form-input-container">
              <label>Profile Picture</label>
              <Input type="file" onChange={uploadProfilePicture} />
            </div>
          )}

          <div className="form-input-container">
            <Button
              type="button"
              btnName={
                loading
                  ? "Please Wait..."
                  : isSignUp
                  ? "Create Account"
                  : "Continue"
              }
              isLoading={loading}
              isPrimary={true}
              onClick={isSignUp ? signUpWithEmail : loginWithEmail}
            />
          </div>

          <div>or</div>

          <div className="form-input-container">
            <Button
              type="button"
              btnName={loading ? "Please Wait..." : "Login as Guest"}
              isLoading={loading}
              isPrimary={false}
              onClick={loginAsGuest}
            />
          </div>

          <div
            className="form-toggle-container"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Click here"
              : "Don't have an account? Click here"}
          </div>
        </form>
      </div>
    </div>
  );
}
