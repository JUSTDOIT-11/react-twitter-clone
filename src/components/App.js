import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
function App() {
  //auth.currentUser의 초기상태가null이다.(데이터를 받아오는 시간 필요) 따라서 firebase가 프로그램을 초기화하길 기다려야한다.
  const [init, setInit] = useState(false); // 로그인상태를 확인하여 라우터를 출력하기 위함
  const [userObj, setUserObj] = useState(null); // 유저정보 obj
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setUserObj(user) : setUserObj(null);
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "initializing..."
      )}
    </>
  );
}

export default App;
