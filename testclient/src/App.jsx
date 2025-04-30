import './App.css'
import player from "../../frontend/src/assets/player.png"; 
import displayImage from "../../frontend/src/assets/displayImage.png"; 
import messageImage from "../../frontend/src/assets/Group.png"; 
import ellipse from "../../frontend/src/assets/ellipse.png"; 
import exampleChart from "../../frontend/src/assets/exampleChart.png"; 

import { FaArrowRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../../frontend/src/components/ChatBox/ChatBox";
import { setIsChatBoxOpen } from "../../frontend/src/Slices/ChatbotcustomSlice";
import { useEffect, useState } from "react";
import Header from '../../frontend/src/components/Header/Header';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const App = () => {
  const [close, setClose] = useState(false);
  const { customisations, isChatBoxOpen } = useSelector(
    (store) => store.chatbox
  );
  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setIsChatBoxOpen(false));
    }
  }, [user, dispatch]);
  useEffect(() => {
    if (!isChatBoxOpen) {
      setTimeout(() => {
        setClose(false);
      }, 5000);
    }
  }, [close]);

  return (
    <div className="body">
      <Header/>
      <div className="middle-body">
        {" "}
        <div className="text-section">
          <h1>Grow Your Business Faster with Hubly CRM</h1>
          <p className="hubly-text">
            Manage leads, automate workflows, and close deals effortlessly—all
            in one powerful platform
          </p>
          <div className="body-buttons">
            <div className="get-started-btn">
              <button className="btn">Get Started</button>
              <FaArrowRight />
            </div>

            <div className="watch-video">
              <img src={player} alt="" />
              <p className="video-btn">Watch Video</p>
            </div>
          </div>
        </div>
        <div className="image-section">
          <img src={displayImage} alt="" />
          <div className="calendar">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                sx={{
                  width: "243px",
                  height: "173px !important",
                  "& .MuiPickersCalendarHeader-root": {
                    height: "10px !important",
                    minHeight: "15px",
                    padding: "0",
                  },
                  "& .MuiPickersDay-root": {
                    height: "18px",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="example-chart">
            <img  src={exampleChart} alt="" />
          </div>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setIsChatBoxOpen());
        }}
        className="chatbot-logo"
      >
        {!isChatBoxOpen ? (
          <img src={messageImage} alt="" />
        ) : (
          <div
            style={{
              color: "white",
              fontSize: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="cancel"
          >
            X
          </div>
        )}
      </div>
      {!isChatBoxOpen && (
        <div
          className="chatbot-intro-1"
          style={close === true ? { display: "none" } : {}}
        >
          <button onClick={() => setClose(true)} className="closed">
            X
          </button>
          <img src={ellipse} alt="" className="ellipse-images" />
          <p> {customisations.welcomeMsg}</p>
        </div>
      )}
      <div className="modalbox">{isChatBoxOpen && <ChatBox />}</div>
      
    </div>
  );
};
export default App;
