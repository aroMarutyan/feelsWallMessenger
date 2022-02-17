import "./App.css";
import db from "./core/firebase";
import { collection, addDoc } from "@firebase/firestore";
import {
  sad,
  happy,
  disgusted,
  love,
  surprised,
  afraid,
  angry,
} from "./core/dictionary";

import { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

import Spraycan from "./Spraycan";

const App = () => {
  const [formValue, setFormValue] = useState("");
  // Map with the emotion score. Used by emotionDetector function
  const [emotionStrength, setEmotionStrength] = useState(new Map());
  // Emotion state attributed to each message. Used by emotionDetector function
  const [emotion, setEmotion] = useState("");
  // Animation state. Used by reactSpring animation library
  const [animate, setAnimate] = useState(false);

  // Message bubble animation
  const [styles, api] = useSpring(() => ({
    //Accidentally fixed the animation on refresh bug. Still need to adjust position of bubble. Use Stitches
    // from: { x: 0, y: -200 },
  }));
  useEffect(() => {
    api.start({
      to: [
        { x: 0, y: -100 },
        { x: 0, y: -600 },
        { x: 0, y: -200 },
      ],
    });
  }, [animate]);

  /**
   * General function to determine emotion of the message and asign appropriate color
   * Emotion detection involves comparing each individual message word against 7 distinct dictionaries
   * An "emotional score" Map is created where the occurrence of each emotion within the message is tracked
   * The emotion with the most points "wins" and the message is assigned that color
   * @param  {} message - instance of message
   */
  function emotionDetector(message) {
    const lowerCaseMsg = message.toLowerCase();
    /**
     * First subfunction. Responsible for tracking the emotional score and adding them to the emotionStrength Map
     * @param  {} array - dictionary of words. Total of 7 arrays with words corresponding to the appropriate emotion
     */
    const messageChecker = (array) => {
      let wordCount = 0;
      const lowerCaseDict = array.join(",").toLowerCase().split(",");
      lowerCaseDict.map((word) => lowerCaseMsg.includes(word) && wordCount++);
      setEmotionStrength(emotionStrength.set(array[0], wordCount));
    };
    /**
     * Second subfunction. Responsible for sorting the emotionStrength Map and deciding the winner
     * If there was no emtion detected the "indifferent" emotion is attributed
     * If there is a tie between two emotions, the instance with the higher order in the Map is selected
     * @param  {} map - emotionStrength Map. Contents filled by the messageChecker subfunction
     */
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
  /**
   * Function responsible for sending the message to the Firestore database
   * Capitalizes each message
   * Resets the contents of the message bubble after the message has been sent to the database
   * @param  {} e
   */
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
  };

  const submitBtn = () => {
    emotionDetector(formValue);
    setAnimate((v) => !v);
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
        <Spraycan canColor={"red"} handColor={25} />
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
