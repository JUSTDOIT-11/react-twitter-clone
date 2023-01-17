import React, { useState, useEffect } from "react";
import Tweet from "components/Tweet";
import { db } from "fbase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore"; //fbase에 할당하고 import해도 되지만...

function Home({ userObj }) {
  const [tweet, setTweet] = useState(""); //input으로 받는 트윗내용
  const [tweets, setTweets] = useState([]); //트윗 정보를 obj아이템으로 받는 배열
  //firestore 데이터 읽는 방법
  useEffect(() => {
    const q = query(
      collection(db, "tweets"),
      // where('text', '==', 'hehe') // where뿐만아니라 각종 조건 이 영역에 때려부우면 됨
      orderBy("createdAt", "desc") // desc:오름차순 / asc:내림차순
    );
    onSnapshot(q, (querySnapshot) => {
      const tweetArray = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setTweets(tweetArray);
      //console.log("Current tweets : ", tweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    //firestore에 데이터 추가하는 법
    try {
      const docRef = await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      //console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setTweet(""); // 트윗 후 텍스트 초기화
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={tweet}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        ></input>
        <input type="submit" value="Tweet"></input>
      </form>
      <div>
        {tweets.map((tweet) => {
          return (
            <Tweet
              key={tweet.id}
              tweetObj={tweet}
              isOwner={tweet.creatorId === userObj.uid}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
