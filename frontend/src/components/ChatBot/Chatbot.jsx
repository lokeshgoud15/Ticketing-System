import "./ChatBot.css";
import ellipse from "../../assets/ellipse.png";
import ChatBox from "../ChatBox/ChatBox";
import { MdEdit } from "react-icons/md";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBgColor,
  setHeaderColor,
  setMessage1,
  setMessage2,
  setMissedChatTimer,
  setWelcomeMsg,
} from "../../Slices/ChatbotcustomSlice";

let colors = ["#ffffff", "#000000", "#33475b"];
let bgcolors = ["#ffffff", "#000000", "#eeeeee"];



const Chatbot = () => {
  const customisations = useSelector((store) => store.chatbox.customisations);
  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();

  const [edit1, setEdit1] = useState(false);
  const [edit2, setEdit2] = useState(false);

  const inputfocus1 = useRef();
  const inputfocus2 = useRef();

  const handleEdit = (e) => {
    setEdit1(true);
    if (edit1) {
      inputfocus1.current.focus();
    }
  };
  const handleEdit2 = (e) => {
    setEdit2(true);
    if (edit2) {
      inputfocus2.current.focus();
    }
  };

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const handleSave = () => {
    dispatch(
      setMissedChatTimer(
        `${hours < 10 ? "0" + hours : hours}-${
          minutes < 10 ? "0" + minutes : minutes
        }-${seconds < 10 ? "0" + seconds : seconds}`
      )
    );
  };

  const generateOptions = (max) => {
    return Array.from({ length: max }, (_, i) => (
      <option key={i} value={i}>
        {i.toString().padStart(2, "0")}
      </option>
    ));
  };

  return (
    <div className="chatbot-container">
      <h3 className="chatbot-text">Chat Bot</h3>
      <div className="chatbot-box">
        <div className="chatbot-left">
          <ChatBox />
          <div className="chatbot-intro">
            <button className="close">X</button>
            <img src={ellipse} alt="" className="ellipse-image" />
            <p> {customisations.welcomeMsg}</p>
          </div>
        </div>
        <div className="chatbot-right">
          <div className="headers">
            <p>Header Color</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {colors.map((each, index) => (
                <div className="index" key={index}>
                  <p
                    onClick={() => {
                      dispatch(setHeaderColor(each));
                    }}
                    className="each-color"
                    style={{ backgroundColor: each }}
                  ></p>
                </div>
              ))}
            </div>
            <div className="color-input">
              <p
                className="selected-color"
                style={{ backgroundColor: customisations.headerColor }}
              ></p>
              <input
                readOnly
                type="text"
                value={customisations.headerColor.toUpperCase()}
              />
            </div>
          </div>

          <div className="headers">
            <p>Custom Background Color</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {bgcolors.map((each, index) => (
                <div key={index} className="index">
                  <p
                    onClick={() => {
                      dispatch(setBgColor(each));
                    }}
                    className="each-color"
                    style={{ backgroundColor: each }}
                  ></p>
                </div>
              ))}
            </div>
            <div className="color-input">
              <p
                className="selected-color"
                style={{ backgroundColor: customisations.bgcolor }}
              ></p>
              <input
                readOnly
                type="text"
                value={customisations.bgcolor.toUpperCase()}
              />
            </div>
          </div>

          <div className="headers">
            <p>Customize Message</p>
            <div style={{ position: "relative" }}>
              <input
                disabled={!edit1}
                ref={inputfocus1}
                type="text"
                className="intro-text"
                value={customisations.message1}
                onChange={(e) => {
                  dispatch(setMessage1(e.target.value));
                }}
              />
              <MdEdit
                onClick={(e) => {
                  handleEdit(e);
                }}
                style={{
                  position: "absolute",
                  right: "70px",
                  top: "5px",
                  cursor: "pointer",
                }}
                className="first-message-edit-btn"
              />
            </div>
            <div style={{ position: "relative" }}>
              <input
                disabled={!edit2}
                ref={inputfocus2}
                type="text"
                className="intro-text"
                value={customisations.message2}
                onChange={(e) => {
                  dispatch(setMessage2(e.target.value));
                }}
              />
              <MdEdit
                onClick={(e) => {
                  handleEdit2(e);
                }}
                style={{
                  position: "absolute",
                  right: "70px",
                  top: "5px",
                  cursor: "pointer",
                }}
                className="second-message-edit-btn"
              />
            </div>
          </div>

          <div className="intro-form">
            <p>Introduction Form</p>
            <form action="">
              <div className="name">
                <label htmlFor="">Your name</label>
                <input
                  type="text"
                  className="name-input"
                  placeholder="your name"
                />
              </div>
              <div className="phone">
                <label htmlFor="">Your Phone</label>
                <input
                  type="text"
                  placeholder="your phone"
                  className="phone-input"
                />
              </div>
              <div className="email">
                <label htmlFor="">Your Email</label>
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  className="email-input"
                />
              </div>
              <button
                disabled={user ? true : false}
                type="submit"
                className="thanks-btn"
              >
                Thank You!
              </button>
            </form>
          </div>

          <div className="headers">
            <p>Welcome Message</p>
            <div style={{ position: "relative" }}>
              <textarea
                value={customisations.welcomeMsg}
                onChange={(e) => {
                  dispatch(setWelcomeMsg(e.target.value));
                }}
                name=""
                id=""
              ></textarea>
              <MdEdit
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "30px",
                  color: "#33475b",
                }}
                className="welcome-edit-btn"
              />
            </div>
          </div>

          <div className="timer-container headers">
            <h3>Missed chat timer</h3>
            <div className="picker-row">
              <select
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              >
                {generateOptions(24)}
              </select>
              <span>:</span>
              <select
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              >
                {generateOptions(60)}
              </select>
              <span>:</span>
              <select
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
              >
                {generateOptions(60)}
              </select>
            </div>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chatbot;
