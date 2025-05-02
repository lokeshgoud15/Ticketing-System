import "./ChatBot.css";
import ellipse from "../../assets/ellipse.png";
import ChatBox from "../ChatBox/ChatBox";
import { MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";


let colors = ["#ffffff", "#000000", "#33475b"];
let bgcolors = ["#ffffff", "#000000", "#eeeeee"];

const Chatbot = () => {
  const [customisations, setCustomisations] = useState(null);
  const user = useSelector((store) => store.user.user);


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
    setCustomisations((prev) => ({
      ...prev,
      missedChatTimer: `${hours < 10 ? "0" + hours : hours}-${
        minutes < 10 ? "0" + minutes : minutes
      }-${seconds < 10 ? "0" + seconds : seconds}`,
    }));
  };

  const generateOptions = (max) => {
    return Array.from({ length: max }, (_, i) => (
      <option key={i} value={i}>
        {i.toString().padStart(2, "0")}
      </option>
    ));
  };

  useEffect(() => {
    const fetchCustomisations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/chatbox/customisations`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chatbox customisations");
        }
        const data = await response.json();
        setCustomisations(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomisations();
  }, []);

  useEffect(() => {
    if (!customisations) return;
    const timer = setTimeout(() => {
      const updateCustomisationsAPI = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/chatbox/customisations/${user._id}`,
            {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(customisations),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to update customisations");
          }
          const result = await response.json();
          setCustomisations(result?.customisations);
        } catch (error) {
          console.error("Error updating customisations:", error);
        }
      };
      updateCustomisationsAPI();
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    customisations?.headerColor,
    customisations?.bgcolor,
    customisations?.message1,
    customisations?.message2,
    customisations?.welcomeMsg,
    customisations?.missedChatTimer,
  ]);

  return (
    <div className="chatbot-container">
      <h3 className="chatbot-text">Chat Bot</h3>
      <div className="chatbot-box">
        <div className="chatbot-left">
          <ChatBox customisations={customisations} />
          <div className="chatbot-intro">
            <button className="close">X</button>
            <img src={ellipse} alt="" className="ellipse-image" />
            <p> {customisations?.welcomeMsg}</p>
          </div>
        </div>
        <div className="chatbot-right">
          <div className="headers">
            <p>Header Color</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {colors.map((each, index) => (
                <div className="index" key={index}>
                  <p
                    onClick={() =>
                      setCustomisations((prev) => ({
                        ...prev,
                        headerColor: each,
                      }))
                    }
                    className="each-color"
                    style={{ backgroundColor: each }}
                  ></p>
                </div>
              ))}
            </div>
            <div className="color-input">
              <p
                className="selected-color"
                style={{ backgroundColor: customisations?.headerColor }}
              ></p>
              <input
                readOnly
                type="text"
                value={customisations?.headerColor?.toUpperCase()}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="headers">
            <p>Custom Background Color</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {bgcolors.map((each, index) => (
                <div key={index} className="index">
                  <p
                    onClick={() =>
                      setCustomisations((prev) => ({
                        ...prev,
                        bgcolor: each,
                      }))
                    }
                    className="each-color"
                    style={{ backgroundColor: each }}
                  ></p>
                </div>
              ))}
            </div>
            <div className="color-input">
              <p
                className="selected-color"
                style={{ backgroundColor: customisations?.bgcolor }}
              ></p>
              <input
                readOnly
                type="text"
                value={customisations?.bgcolor.toUpperCase()}
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
                value={customisations?.message1}
                onChange={(e) =>
                  setCustomisations((prev) => ({
                    ...prev,
                    message1: e.target.value,
                  }))
                }
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
                value={customisations?.message2}
                onChange={(e) =>
                  setCustomisations((prev) => ({
                    ...prev,
                    message2: e.target.value,
                  }))
                }
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

          <div className="intro-form-user">
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
                className="thanks-btn-user"
              >
                Thank You!
              </button>
            </form>
          </div>

          <div className="headers">
            <p>Welcome Message</p>
            <div style={{ position: "relative" }}>
              <textarea
                value={customisations?.welcomeMsg}
                onChange={(e) =>
                  setCustomisations((prev) => ({
                    ...prev,
                    welcomeMsg: e.target.value,
                  }))
                }
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
            <p>Missed chat timer</p>
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
