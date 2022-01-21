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

import { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

const App = () => {
  const [formValue, setFormValue] = useState("");
  const [emotion, setEmotion] = useState("");
  const [emotionStrength, setEmotionStrength] = useState(new Map());
  const [animate, setAnimate] = useState(false);

  const [styles, api] = useSpring(() => ({
    // to: [
    //   { x: 0, y: -100 },
    //   { x: 0, y: -600 },
    //   { x: 0, y: -200 },
    // ],
    from: { x: 0, y: -200 },
    // to: async (next, cancel) => {
    //   await next({ x: 0, y: -100 });
    //   await next({ x: 0, y: -600 });
    //   await next({ x: 0, y: -200 });
    // },
    // from: { x: 0, y: -200 },
    // config: config.molasses,
    // onRest: () => setAnimate((v) => !v),
  }));
  useEffect(() => {
    api.start({
      // from: { x: 0, y: -200 },
      to: [
        { x: 0, y: -100 },
        { x: 0, y: -600 },
        { x: 0, y: -200 },
      ],
    });
  }, [animate]);

  function emotionDetector(message) {
    const lowerCaseMsg = message.toLowerCase();

    const messageChecker = (array) => {
      let wordCount = 0;
      const lowerCaseDict = array.join(",").toLowerCase().split(",");
      lowerCaseDict.map((word) => lowerCaseMsg.includes(word) && wordCount++);
      setEmotionStrength(emotionStrength.set(array[0], wordCount));
    };

    const emotionStrengthEvaluator = (map) => {
      const filteredEmotionStrength = [...map].filter((arr) => arr[1] > 0);
      const sortedEmotionStrength = filteredEmotionStrength.sort(
        (a, b) => b[1] - a[1]
      );
      setEmotion(
        sortedEmotionStrength.length
          ? sortedEmotionStrength[0][0]
          : "indifferent"
      );
    };

    messageChecker(sad);
    messageChecker(happy);
    messageChecker(disgusted);
    messageChecker(love);
    messageChecker(surprised);
    messageChecker(afraid);
    messageChecker(angry);

    emotionStrengthEvaluator(emotionStrength);
  }

  const handleNewMessage = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, "messages");
    let finalMsg = formValue.charAt(0).toUpperCase() + formValue.slice(1);

    const payload = {
      message: finalMsg,
      emotion: emotion,
    };
    const docRef = await addDoc(collectionRef, payload);

    setTimeout(() => {
      setFormValue("");
      setEmotion("");
    }, 1000);

    // console.log(`The emotion is ${emotion}`);

    // console.log(`The ID of this message is ${docRef.id}`);
  };

  const submitBtn = () => {
    emotionDetector(formValue);
    setAnimate((v) => !v);
    // setTimeout(() => {
    //   setAnimate((v) => !v);
    // }, 1000);
  };

  return (
    <div className="App">
      <main
        className="App-header"
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <animated.div style={styles}>
          <div className="msg-bubble">
            <h2>{formValue}</h2>
          </div>
        </animated.div>

        <form onSubmit={handleNewMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />

          <button
            type="submit"
            onClick={() => submitBtn()}
            disabled={!formValue}
          >
            🕊️
          </button>
        </form>
      </main>
    </div>
  );
};

export default App;
