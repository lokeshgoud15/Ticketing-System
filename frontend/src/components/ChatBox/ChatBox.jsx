import ellipse from "../../assets/ellipse.png";
import status from "../../assets/Status.png";
import { FiSend } from "react-icons/fi";
import "./ChatBox.css";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import profile from "../../assets/profile.png";

const ChatBox = ({ customisations }) => {
  const user = useSelector((store) => store.user.user);
  const [Allmessages, setAllMessages] = useState([]);
  const [introSubmitted, setIntroSubmitted] = useState(false);
  const lastMessageRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [Allmessages]);

  const [newTicket, setNewTicket] = useState(() => {
    try {
      const mydetails = JSON.parse(sessionStorage.getItem("mydetails"));
      return {
        createdBy: mydetails || { name: "", phone: "", email: "" },
        description: "",
        title: "",
      };
    } catch (error) {
      console.error("Error parsing sessionStorage data:", error);
      return {
        createdBy: { name: "", phone: "", email: "" },
        description: "",
        title: "",
      };
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newTicket.createdBy.name ||
      !newTicket.createdBy.phone ||
      !newTicket.createdBy.email
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    sessionStorage.setItem("mydetails", JSON.stringify(newTicket.createdBy));
    toast.success("Details saved successfully!");
    setIntroSubmitted(true);
  };

  const newTicketSubmit = async () => {
    if (!newTicket.description.trim()) {
      return;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const TodaysMonth = String(now.getMonth() + 1).padStart(2, "0");
    const TodaysDate = String(now.getDate()).padStart(2, "0");
    const currentHours = String(now.getHours()).padStart(2, "0");
    const currentMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentSeconds = String(now.getSeconds()).padStart(2, "0");

    const ticketTitle = `Ticket#${currentYear}-0${TodaysMonth}${TodaysDate}-${currentHours}${currentMinutes}${currentSeconds}`;

    const mydetails = JSON.parse(sessionStorage.getItem("mydetails")) || {
      name: "",
      phone: "",
      email: "",
    };

    const ticketData = {
      ...newTicket,
      createdBy: mydetails,
      title: ticketTitle,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/create-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(ticketData),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);

        setNewTicket((prev) => ({ ...prev, description: "" }));
        fetchMessages(ticketData);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setNewTicket((prev) => ({ ...prev, description: "" }));
  };

  const fetchMessages = async (ticketData = newTicket) => {
    if (ticketData.createdBy.email) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ newTicket: ticketData }),
          }
        );
        const data = await res.json();
        setAllMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };

  useEffect(() => {
    const mydetails = JSON.parse(sessionStorage.getItem("mydetails"));
    if (mydetails) {
      setNewTicket((prev) => ({ ...prev, createdBy: mydetails }));
      setIntroSubmitted(true);
      !user && fetchMessages({ ...newTicket, createdBy: mydetails });
    }
  }, []);

  useEffect(() => {
    if (introSubmitted) {
      !user && fetchMessages();
    }
  }, [introSubmitted, user]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      newTicketSubmit();
    }
  };

  const handleInputFocus = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="chat-box" ref={chatBoxRef}>
      <div
        className="chat-head"
        style={{
          backgroundColor: customisations?.headerColor,
          color: customisations?.headerColor === "#ffffff" ? "black" : "",
        }}
      >
        <div className="profile-image">
          <img src={ellipse} alt="" className="ellipse" />
          <img className="status" src={status} alt="" />
        </div>
        <p>Hubly</p>
      </div>
      <div
        className="chat-body"
        style={{ backgroundColor: customisations?.bgcolor }}
      >
        <div className="sender-chat">
          <img src={ellipse} alt="" className="ellipse" />
          <div className="messages">
            <p
              className="each-message"
              style={{
                backgroundColor:
                  customisations?.bgcolor === "#ffffff" ? "black" : "",
                color: customisations?.bgcolor === "#ffffff" ? "white" : "",
              }}
            >
              {customisations?.message1}
            </p>
            <p
              style={{
                backgroundColor:
                  customisations?.bgcolor === "#ffffff" ? "black" : "",
                color: customisations?.bgcolor === "#ffffff" ? "white" : "",
              }}
              className="each-message"
            >
              {customisations?.message2}
            </p>
            {!user && (
              <p
                style={{
                  backgroundColor:
                    customisations?.bgcolor === "#ffffff" ? "black" : "",
                  color: customisations?.bgcolor === "#ffffff" ? "white" : "",
                }}
                className="each-message"
              >
                {"Do you want ask something? "}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            backgroundColor:
              customisations?.bgcolor === "#ffffff" ? "black" : "",
            color: customisations?.bgcolor === "#ffffff" ? "white" : "",
            display: !user && introSubmitted ? "none" : "",
          }}
          className="receiver-chat"
        >
          {!introSubmitted && !user && (
            <div className="introduction-home">
              {" "}
              <div
                style={{
                  backgroundColor:
                    customisations?.bgcolor === "#ffffff" ? "black" : "",
                  color: customisations?.bgcolor === "#ffffff" ? "white" : "",
                }}
                className="introduction"
              >
                Introduction Yourself
              </div>
              <form className="intro" onSubmit={handleSubmit} action="">
                <div className="name">
                  <label htmlFor="">Your name</label>
                  <input
                    value={newTicket?.createdBy?.name || ""}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        createdBy: { ...prev.createdBy, name: e.target.value },
                      }))
                    }
                    type="text"
                    className="name-input"
                    placeholder="your name"
                    style={{
                      backgroundColor:
                        customisations?.bgcolor === "#ffffff" ? "black" : "",
                      color:
                        customisations?.bgcolor === "#ffffff" ? "white" : "",
                    }}
                  />
                </div>
                <div className="phone">
                  <label htmlFor="">Your Phone</label>
                  <input
                    value={newTicket?.createdBy?.phone || ""}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        createdBy: { ...prev.createdBy, phone: e.target.value },
                      }))
                    }
                    style={{
                      backgroundColor:
                        customisations?.bgcolor === "#ffffff" ? "black" : "",
                      color:
                        customisations?.bgcolor === "#ffffff" ? "white" : "",
                    }}
                    type="text"
                    placeholder="your phone"
                    className="phone-input"
                  />
                </div>
                <div className="email">
                  <label htmlFor="">Your Email</label>
                  <input
                    value={newTicket?.createdBy?.email || ""}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        createdBy: { ...prev.createdBy, email: e.target.value },
                      }))
                    }
                    style={{
                      backgroundColor:
                        customisations?.bgcolor === "#ffffff" ? "black" : "",
                      color:
                        customisations?.bgcolor === "#ffffff" ? "white" : "",
                    }}
                    type="text"
                    placeholder="example@gmail.com"
                    className="email-input"
                  />
                </div>
                <button type="submit" className="thanks-btn">
                  Thank You!
                </button>
              </form>
            </div>
          )}

          {user && (
            <div className="introduction-user">
              {" "}
              <div
                style={{
                  backgroundColor:
                    customisations?.bgcolor === "#ffffff" ? "black" : "",
                  color: customisations?.bgcolor === "#ffffff" ? "white" : "",
                }}
                className="introduction"
              >
                Introduction Yourself
              </div>
              <form className="intro" onSubmit={handleSubmit} action="">
                <div className="name">
                  <label htmlFor="">Your name</label>
                  <input
                    value={user?.firstname || ""}
                    readOnly={!!user}
                    type="text"
                    className="name-input"
                    placeholder="your name"
                    style={{
                      backgroundColor:
                        customisations?.bgcolor === "#ffffff" ? "black" : "",
                      color:
                        customisations?.bgcolor === "#ffffff" ? "white" : "",
                    }}
                  />
                </div>
                <div className="phone">
                  <label htmlFor="">Your Phone</label>
                  <input
                    readOnly={!!user}
                    value={user.phone || "+91 1234567890"}
                    style={{
                      backgroundColor:
                        customisations?.bgcolor === "#ffffff" ? "black" : "",
                      color:
                        customisations?.bgcolor === "#ffffff" ? "white" : "",
                    }}
                    type="text"
                    placeholder="your phone"
                    className="phone-input"
                  />
                </div>
                <div className="email">
                  <label htmlFor="">Your Email</label>
                  <input
                    readOnly={!!user}
                    value={user?.email || ""}
                    style={{
                      backgroundColor:
                        customisations?.bgcolor === "#ffffff" ? "black" : "",
                      color:
                        customisations?.bgcolor === "#ffffff" ? "white" : "",
                    }}
                    type="text"
                    placeholder="example@gmail.com"
                    className="email-input"
                  />
                </div>
                <button type="submit" className="thanks-btn">
                  Thank You!
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="message-container">
          {introSubmitted &&
            !user &&
            Allmessages?.length > 0 &&
            Allmessages?.map((message, index) => (
              <div
                ref={index === Allmessages.length - 1 ? lastMessageRef : null}
                key={index}
                className={
                  message.senderEmail === newTicket?.createdBy?.email
                    ? "sender-messages-in-home"
                    : "reciever-messages-in-home"
                }
              >
                <div
                  className={
                    message.senderEmail === newTicket?.createdBy?.email
                      ? "each-person-message-sender-in-home"
                      : "each-person-message-reciever-in-home"
                  }
                >
                  <img src={profile} alt="" />
                  <div className="message-name">
                    <span>{message.content}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="chat-input-body">
        <input
          disabled={!introSubmitted}
          value={newTicket.description}
          type="text"
          className="chat-input"
          placeholder="Write a message"
          onChange={(e) =>
            setNewTicket((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
        />
        <FiSend onClick={newTicketSubmit} className="icon send-icon" />
      </div>
    </div>
  );
};
export default ChatBox;
