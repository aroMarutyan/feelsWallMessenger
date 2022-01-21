import "./App.css";
import db from "./firebase";
import { collection, addDoc } from "@firebase/firestore";
import {
  sad,
  happy,
  disgusted,
  love,
  surprised,
  afraid,
  angry,
} from "./dictionary";

import { useState, useRef } from "react";

const App = () => {
  const [formValue, setFormValue] = useState("");
  const [emotion, setEmotion] = useState("");
  // const [count, setCount] = useState(0);
  const [emotionStrength, setEmotionStrength] = useState(new Map());
  // const [emotionStrength, setEmotionStrength] = useState({
  //   sad: 0,
  //   happy: 0,
  //   disgusted: 0,
  //   love: 0,
  //   surprised: 0,
  //   afraid: 0,
  //   angry: 0,
  // });

  //if no emotion, use "other"

  const emotionDetector = (message) => {
    const lowerCaseMsg = message.toLowerCase();

    const messageChecker = (array) => {
      let wordCount = 0;
      const lowerCaseDict = array.join(",").toLowerCase().split(",");
      const resultArr = lowerCaseDict.map(
        (word) => lowerCaseMsg.includes(word) && wordCount++
      );
      setEmotionStrength(emotionStrength.set(array[0], wordCount));
      return console.log(wordCount, emotionStrength);
      //  &&
      // // lowerCaseDict.some((word) => lowerCaseMsg.includes(word) && count++) &&
      // setEmotion(`${array[0]}`) &&
      // console.log()
      // setEmotionStrength((prevState) => ({
      //   ...prevState,
      //   sad: (sad.value = count),
      // }))
    };
    // const messageChecker = (array) => {
    //   const lowerCaseDict = array.join(",").toLowerCase().split(",");
    //   return (
    //     lowerCaseDict.some((word) => lowerCaseMsg.includes(word) && count++) &&
    //     setEmotion(`${array[0]}`)
    //     // setEmotionStrength((prevState) => ({
    //     //   ...prevState,
    //     //   sad: (sad.value = count),
    //     // }))
    //   );
    // };

    messageChecker(sad);
    messageChecker(happy);
    messageChecker(disgusted);
    messageChecker(love);
    messageChecker(surprised);
    messageChecker(afraid);
    messageChecker(angry);
  };

  const handleNewMessage = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, "messages");

    const payload = { message: formValue, emotion: emotion };
    const docRef = await addDoc(collectionRef, payload);

    setFormValue("");
    console.log(`The emotion is ${emotion}`);
    setEmotion("");
    console.log(`The ID of this message is ${docRef.id}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>OnlyFarts</h1>
        <form onSubmit={handleNewMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />

          <button
            type="submit"
            onClick={() => emotionDetector(formValue)}
            disabled={!formValue}
          >
            🕊️
          </button>
        </form>

        <h2>{formValue}</h2>
      </header>
    </div>
  );
};

export default App;
