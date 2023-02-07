import React, { useState, useRef } from "react";
import { db, storage } from "fbase";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; //랜덤 파일명을 만들기 위한 npm

function TweetFactory({ userObj }) {
  const [tweet, setTweet] = useState(""); //input으로 받는 트윗내용
  const [imgFile, setImgFile] = useState(""); //업로드할 이미지파일 텍스트 주소
  const imgInput = useRef(); //
  const onSubmit = async (event) => {
    event.preventDefault();
    let imgFileUrl = ""; //if문에 있는 imgFileUrl를 받아서 다시 tweetObj에 갱신된다.
    //이미지 파일이 ""이 아닐 때에만 이미지url문자열을 업로드하고, 그 주소를 다운(갱신한다.)받는다
    if (imgFile !== "") {
      const imgFileRef = ref(storage, `${userObj.uid}/${uuidv4()}`); // 폴더이름(유저아이디) / 파일명(랜덤네임)
      const uploadFile = await uploadString(imgFileRef, imgFile, "data_url");
      imgFileUrl = await getDownloadURL(uploadFile.ref); //img파일 url을 갱신함
    }
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      imgFileUrl,
    };
    await addDoc(collection(db, "tweets"), tweetObj);
    setTweet(""); // 트윗 후 텍스트 초기화
    setImgFile(""); //예시 이미지 숨김
    imgInput.current.value = ""; //선택파일 텍스트 초기화
  };
  const onTweetChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  //파일 읽기 / input type="File" / FileReader() 사용
  const onImgChange = (event) => {
    const {
      target: { files },
    } = event;

    const pickedImg = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImgFile(result);
    };
    reader.readAsDataURL(pickedImg);
  };
  const onClearClick = () => {
    setImgFile(""); //예시 이미지 숨김
    imgInput.current.value = ""; ////선택파일 텍스트 초기화
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={onTweetChange}
        value={tweet}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        onChange={onImgChange}
        type="file"
        accept="image/*"
        ref={imgInput}
      />
      <input type="submit" value="Tweet"></input>
      {imgFile && (
        <div>
          <img src={imgFile} width="50px" height="50px" />
          <button onClick={onClearClick}>Clear</button>
        </div>
      )}
    </form>
  );
}
export default TweetFactory;
