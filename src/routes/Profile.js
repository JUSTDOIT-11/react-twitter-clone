import React, { useEffect } from "react";
import { auth } from "fbase";
import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate(); // 위치조정 hook
  const onLogoutClick = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogoutClick}>Log out</button>
    </>
  );
}

export default Profile;
