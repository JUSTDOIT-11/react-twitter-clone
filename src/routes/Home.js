import React, { useState, useEffect, useRef } from "react";

import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { db, storage } from "fbase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore"; //fbase에 할당하고 import해도 되지만...

function Home({ userObj }) {
  const [tweets, setTweets] = useState([]); //트윗 정보를 obj아이템으로 받는 배열

  //firestore 데이터 읽는 방법
  useEffect(() => {
    const q = query(
      collection(db, "tweets"),
      // where('text', '==', 'hehe') // 순서대로 'fieldPath'가 '연산자'인 'value' / text == hehe인
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
    });
  }, []);

  return (
    <div>
      <TweetFactory userObj={userObj} />
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
