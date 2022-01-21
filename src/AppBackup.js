import "./App.css";
import db from "./firebase";
import { onSnapshot, collection, addDoc } from "@firebase/firestore";
// import { onSnapshot, collection, doc, setDoc } from "@firebase/firestore";

import { useState, useRef, useEffect } from "react"; //use effect will be used for the display website

//User inputs the message

//The message gets sent to a function that looks for appropriate keywords and attributes the emotion

//Attribute emotion function sends the data to firebase

const DisplayMessages = ({ message }) => {
  return (
    <>
      <h3>{message.message}</h3>
      <span>{message.emotion}</span>
    </>
  );
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const [emotion, setEmotion] = useState("");

  useEffect(
    () =>
      onSnapshot(collection(db, "messages"), (snapshot) =>
        setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  const emotionDetector = (message) => {
    const sad = ["sad", "triste", "pathetic", "ugly"];
    const happy = ["happy", "joy", "alegria", "feliz"];
    const messageChecker = (array) => {
      return (
        array.some((word) => message.includes(word)) &&
        setEmotion(`${array[0]}`)
      );
    };

    // message.includes("test") && setEmotion("success!");
    // message.split(" ").map((word) => word) && setEmotion("sad");
    // sad.some((word) => message.includes(word)) && setEmotion("sad");
    // happy.some((word) => message.includes(word)) && setEmotion("happy"); //refactor this later
    messageChecker(sad);
    messageChecker(happy);
  };

  const handleNewMessage = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, "messages");
    // emotionDetector(formValue);
    // setEmotion(formValue);
    const payload = { message: formValue, emotion: emotion };
    const docRef = await addDoc(collectionRef, payload);
    // console.log(formValue);
    setFormValue("");
    console.log(`The emotion is ${emotion}`);
    setEmotion("");
    console.log(`The ID of this message is ${docRef.id}`);
  };
  // const handleNewMessage = async (e) => {
  //   e.preventDefault();
  //   const docRef = doc(db, "messages", "message003");
  //   const payload = { message: formValue, emotion: "promising" };
  //   await setDoc(docRef, payload);
  //   setFormValue("");
  // };
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

        {/* <button onClick={handleNewMessage}>New Message</button> */}
        <h2>{formValue}</h2>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <DisplayMessages message={message} />
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default App;
