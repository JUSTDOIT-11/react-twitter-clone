import React, { useState } from "react";
import { auth } from "fbase"; // auth = getAuth();
import {
  createUserWithEmailAndPassword, //이메일 & 패스워드로 회원가입 기능
  signInWithEmailAndPassword, //이메일 & 패스워드로 로그인 기능
  signInWithPopup, //팝업창으로 로그인화면 출력 기능
  GithubAuthProvider, //깃허브로 회원가입 기능
  GoogleAuthProvider, //구글로 회원가입 기능
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState(""); //이메일 정보
  const [password, setPassword] = useState(""); //패스워드 정보
  const [newAccount, setNewAccount] = useState(true); //회원정보
  const [error, setError] = useState(""); //에러

  //회원가입 & 로그인 submit 기능
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };
  //로그인 or 회원가입 버튼 변경 함수
  const toggleAccount = () => setNewAccount((prev) => !prev);
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
    const data = await signInWithPopup(auth, provider);
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign in" : "Create Account"}
      </span>
      <button onClick={onSocialClick} name="google">
        Continue with Google
      </button>
      <button onClick={onSocialClick} name="github">
        Continue with Github
      </button>
    </div>
  );
}

export default Auth;
