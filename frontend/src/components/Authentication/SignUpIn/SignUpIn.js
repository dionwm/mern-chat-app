import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SignUpIn.css";

// Components
import Input from "../../Input/Input.js";
import Button from "../../Button/Button";

export default function SignUpIn({ isSignUp, setIsSignUp }) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [loading, setLoading] = useState(false);

  function signUpWithEmail(e) {
    e.preventDefault();
    setLoading(true);
  }
  function loginWithEmail(e) {
    e.preventDefault();
    setLoading(true);
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
                  setState={setFirstName}
                />
              </div>

              <div className="form-input-container">
                <Input placeholder={"Last Name"} setState={setLastName} />
              </div>
            </>
          )}

          <div className="form-input-container">
            <Input
              type="email"
              placeholder={"Email*"}
              isRequired={true}
              setState={setEmail}
            />
          </div>

          <div className="form-input-container">
            <Input
              type="password"
              placeholder={"Password*"}
              isRequired={true}
              setState={setPassword}
            />
          </div>

          {isSignUp && (
            <div className="form-input-container">
              <Input
                type="password"
                placeholder={"Confirm Password*"}
                isRequired={true}
                setState={setConfirmPassword}
              />
            </div>
          )}

          {isSignUp && (
            <div className="form-input-container">
              <Input type="file" setState={setProfilePicture} />
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
