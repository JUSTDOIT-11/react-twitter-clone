import React from "react";
import { auth } from "fbase"; // auth = getAuth();
import {
  signInWithPopup, //팝업창으로 로그인화면 출력 기능
  GithubAuthProvider, //깃허브로 회원가입 기능
  GoogleAuthProvider, //구글로 회원가입 기능
} from "firebase/auth";

function LogginButton() {
  //구글 & 깃허브 팝업 회원가입 기능
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };
  return (
    <>
      <button onClick={onSocialClick} name="google">
        Continue with Google
      </button>
      <button onClick={onSocialClick} name="github">
        Continue with Github
      </button>
    </>
  );
}

export default LogginButton;
