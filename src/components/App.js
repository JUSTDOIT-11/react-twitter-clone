import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
function App() {
  //auth.currentUser의 초기상태가null이다.(데이터를 받아오는 시간 필요) 따라서 firebase가 프로그램을 초기화하길 기다려야한다.
  const [init, setInit] = useState(false); // 로그인상태를 확인하여 라우터를 출력하기 위함
  const [userObj, setUserObj] = useState(null); // 유저정보 obj
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user //user의 필요한 부분만 가져오기 -> 더 빠르고 관리하기 쉬움.
        ? setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) =>
              updateProfile(user, { displayName: user.displayName }),
          })
        : //setUserObj(user)
          setUserObj(null);
      setInit(true);
    });
  }, []);
  //userObj를 새로고침해주는 함수
  const refreshUser = () => {
    const user = auth.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) =>
        updateProfile(user, { displayName: user.displayName }),
    });
    //setUserObj(Object.assign({},user)) = 전체 오브젝트를 리랜더하는 방법. assign(타켓, 소스)
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "initializing..."
      )}
    </>
  );
}

export default App;
