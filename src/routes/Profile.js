import React, { useState, useEffect } from "react";
import { auth, db } from "fbase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile({ userObj }) {
  const [newNameValue, setNewNameValue] = useState(userObj.displayName);
  const navigate = useNavigate(); // 위치조정 hook
  //로그아웃
  const onLogoutClick = () => {
    auth.signOut();
    navigate("/"); //로그아웃 시에 홈으로 돌아감
  };
  //자기 프로필페이지에 자기가 작성한 트윗을 나타내는
  const getMyTweet = async () => {
    const q = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      where("creatorId", "==", userObj.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });
  };
  useEffect(() => {
    getMyTweet();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNameValue(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newNameValue) {
      await updateProfile(userObj, { displayName: newNameValue });
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={newNameValue}
          type="text"
          placeholder="Display Name"
        />
        <input type="submit" value="Update Name" />
      </form>
      <button onClick={onLogoutClick}>Log out</button>
    </>
  );
}

export default Profile;
