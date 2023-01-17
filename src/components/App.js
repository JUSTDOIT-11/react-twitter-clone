import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
function App() {
  //auth.currentUser의 초기상태가null이다.(데이터를 받아오는 시간 필요) 따라서 firebase가 프로그램을 초기화하길 기다려야한다.
  const [init, setInit] = useState(false); // 로그인상태를 확인하여 라우터를 출력하기 위함
  const [isLoggedIn, setIsLoggedIn] = useState(false); //로그인 상태 확인
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Twitter Clone</footer>
    </>
  );
}

export default App;
