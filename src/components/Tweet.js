import React, { useState } from "react";
import { db, storage } from "fbase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

function Tweet({ tweetObj, isOwner }) {
  const [editing, setEditing] = useState(false); //edit상태 on-off
  const [newTweet, setNewTweet] = useState(tweetObj.text); // 트윗텍스트 변경을 위한
  const tweetRef = doc(db, "tweets", tweetObj.id); //트윗선택 주소 정의, tweets/tweetObj.id(문서경로)의 의미이다.
  const fileUrl = ref(storage, tweetObj.imgFileUrl);
  //트윗 지우기
  const delClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this Tweet?");
    if (ok) {
      await deleteDoc(tweetRef);
      if (tweetObj.imgFileUrl !== "") await deleteObject(fileUrl); //파일 삭제 in storage
    }
  };
  //edit 상태 변경함수
  const toggleEditing = async () => {
    setNewTweet("");
    setEditing((prev) => !prev);
  };
  //edit상태일 때 edit하려는 text를 newTweet에 갱신하기 위해 value를 받는 함수
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  //edit 텍스트 submit 함수
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(tweetRef, {
      text: newTweet,
    });
    setEditing(false);
  };
  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  onChange={onChange}
                  type="text"
                  placeholder="Edit your Tweet!"
                  value={newTweet}
                  required
                />
                <input type="submit" value="Update" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          {tweetObj.imgFileUrl && (
            <img src={tweetObj.imgFileUrl} width="50px" height="50px" />
          )}
          <h3>{tweetObj.text}</h3>
          {isOwner && (
            <>
              <button onClick={delClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Tweet;
