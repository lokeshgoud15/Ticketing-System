import "./ContactCentre.css";
import profile from "../../assets/profile.png";
import { useEffect, useRef, useState } from "react";
import { RiHome4Line } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { MdOutlineContactPage } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import {
  setActiveChat,
  setActiveChatTicket,
  setActiveTab,
} from "../../Slices/ActiveTab";

const ContactCentre = () => {
  const { activeChatTicket, activeChat } = useSelector(
    (store) => store.activeTab
  );
  const customisations = useSelector((store) => store.chatbox.customisations);
  const user = useSelector((store) => store.user.user);
  const [allTicketCreatedUsers, setAllTicketCreatedUser] = useState([]);
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [Allmessages, setAllMessages] = useState([]);
  const chatMiddleSectionRef = useRef(null);
  const [teamMates, setTeamMates] = useState([]);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [teammateDropdownValue, setTeammateDropdownValue] = useState("");
  const [statusDropdownValue, setStatusDropdownValue] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (chatMiddleSectionRef.current) {
      chatMiddleSectionRef.current.scrollTop =
        chatMiddleSectionRef.current.scrollHeight;
    }
  }, [Allmessages]);
  useEffect(() => {
    const getAllUserCreatedTickets = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/ticket/allusers",
          { credentials: "include" }
        );

        const data = await response.json();
        setAllTicketCreatedUser(data);
        if (data.length > 0) {
          dispatch(setActiveChat(activeChat ? activeChat : data[0]));
        }
      } catch (error) {
        console.error(error.message);
        console.error("error ocurred");
      }
    };
    getAllUserCreatedTickets();
  }, [statusUpdated]);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/ticket/alltickets",
          { credentials: "include" }
        );
        const data = await response.json();
        setTickets(data);

        if (data.length > 0 && activeChat) {
          const ticketTitle = data.find(
            (ticket) =>
              ticket.createdBy.name === activeChat.name &&
              ticket.status === "unresolved"
          );
          dispatch(setActiveChatTicket(activeChatTicket || ticketTitle));
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAllTickets();
  }, [activeChat, statusUpdated]);

  const sendNewMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/messages/newmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: activeChatTicket._id,
          content: message,
          recieverId: activeChat._id,
        }),
        credentials: "include",
      });

      const data = await res.json();
      toast.success(data.message);
      const newMessage = {
        senderEmail: user.email,
        content: message,
        createdAt: new Date().toISOString(),
      };

      setAllMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessage("");
    } catch (error) {}
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendNewMessage();
    }
  };

  useEffect(() => {
    if (activeChatTicket) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `http://localhost:5000/api/messages/${activeChatTicket._id}`,
            {
              method: "GET",

              credentials: "include",
            }
          );
          const data = await res.json();
          setTimeout(() => {
            setAllMessages(data);
            setLoading(false);
          }, 300);
        } catch (error) {
          console.erro(error.message);
        }
      };
      fetchMessages();
    }
  }, [activeChatTicket, statusUpdated]);

  const handlePersonClick = (person) => {
    dispatch(setActiveChat(person));

    const ticketTitle = tickets.find((ticket) => {
      return (
        ticket.createdBy.name === person.name && ticket.status === "unresolved"
      );
    });
    dispatch(setActiveChatTicket(ticketTitle));
  };

  useEffect(() => {
    const fetchTeamMates = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/team/all-members",
          { credentials: "include" }
        );

        const data = await response.json();
        if (data && Array.isArray(data.registeredMembers)) {
          setTeamMates(data.registeredMembers);
        }
      } catch (error) {
        console.error("Error fetching team members:", error.message);
        setTeamMates([]);
      }
    };

    fetchTeamMates();
  }, []);

  const handleChange = (e) => {
    const selectedTeammate = teamMates.find(
      (person) => person._id === e.target.value
    );
    if (!selectedTeammate) {
      toast.error("Invalid teammate selected");
      return;
    }
    assignTicket(selectedTeammate._id);

    setTeammateDropdownValue("");
  };

  const assignTicket = async (teammateId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ticket/assign/${activeChatTicket._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedTo: teammateId,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(
          "the ticket is assigned to " + data.assignedToUser.firstname
        );
        dispatch(
          setActiveChatTicket({
            ...activeChatTicket,
            assignedTo: teammateId,
          })
        );
      } else {
        toast.error(data.message || "Failed to assign ticket");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while assigning the ticket");
    }
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    updateTicketStatus(selectedStatus);

    setStatusDropdownValue("");
  };

  const updateTicketStatus = async (status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ticket/status/${activeChatTicket._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setStatusUpdated((prev) => !prev);

        if (allTicketCreatedUsers.length > 1) {
          const updatedUsers = allTicketCreatedUsers.filter(
            (user) => user.email !== activeChat.email
          );
          setAllTicketCreatedUser(updatedUsers);

          const nextActiveChat = updatedUsers[0];
         
          dispatch(setActiveChat(nextActiveChat));
          const nextTicket = tickets.find(
            (ticket) =>
              ticket.createdBy.email === nextActiveChat.email &&
              ticket.status === "unresolved"
          );
        
          dispatch(setActiveChatTicket(nextTicket));
        } else {
          dispatch(setActiveChat(null));
          dispatch(setActiveChatTicket(null));
        }
      } else {
        toast.error(data.message || "Failed to update ticket status");
      }
    } catch (error) {
      toast.error("An error occurred while updating the ticket status");
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const chatDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      chatDate.getDate() === today.getDate() &&
      chatDate.getMonth() === today.getMonth() &&
      chatDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    if (
      chatDate.getDate() === yesterday.getDate() &&
      chatDate.getMonth() === yesterday.getMonth() &&
      chatDate.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    return chatDate.toLocaleDateString();
  };

  return (
    <div className="contact-center-container">
      <div className="chat-persons">
        {" "}
        <p className="contact-center-text">Contact Center</p>
        <span style={{ borderBottom: "4px solid #ccc" }}>Chats</span>
        <hr />
        <div className="persons">
          {allTicketCreatedUsers?.length > 0
            ? allTicketCreatedUsers.map((person, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handlePersonClick(person)}
                    className={`each-person ${
                      person.email === activeChat?.email ? "active-chat" : ""
                    }`}
                  >
                    <div
                      className={`${
                        person.email === activeChat?.email ? "active" : ""
                      }`}
                    ></div>
                    <img src={profile} alt="" />
                    <div className="message-name">
                      <p className="person-name">{person.name}</p>
                      <p>
                        {Allmessages?.filter(
                          (message) => message.senderEmail === person.email
                        )?.slice(-1)[0]?.content
                          ? Allmessages.filter(
                              (message) => message.senderEmail === person.email
                            )
                              ?.slice(-1)[0]
                              .content.slice(0, 20) + "............."
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })
            : "No Ticket is Assigned"}
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-top-section">
          <p>
            {allTicketCreatedUsers?.length > 0 && activeChat
              ? activeChatTicket?.title.slice(0, 17)
              : ""}
          </p>

          <RiHome4Line
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(setActiveTab("Dashboard"))}
          />
        </div>
        <div className="chat-middle-section" ref={chatMiddleSectionRef}>
          {allTicketCreatedUsers?.length > 0 && (
            <div className={"sender-messages"}>
              <div className={"each-person-message-sender"}>
                <img src={profile} alt="" />
                <div className="message-name">
                  <span>{activeChatTicket?.description}</span>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <Loader />
          ) : (
            allTicketCreatedUsers?.length > 0 &&
            Allmessages?.map((message, index) => (
              <div className="chat-middle" key={index}>
                {(index === 0 ||
                  new Date(Allmessages[index - 1]?.createdAt).toDateString() !==
                    new Date(message.createdAt).toDateString()) && (
                  <div className="chat-date">
                    {formatDate(message.createdAt)}
                  </div>
                )}
                <div
                  className={
                    message.senderEmail === activeChat?.email
                      ? "sender-messages"
                      : "reciever-messages"
                  }
                >
                  <div
                    className={
                      message.senderEmail === activeChat?.email
                        ? "each-person-message-sender"
                        : "each-person-message-reciever"
                    }
                  >
                    <img src={profile} alt="" />
                    <div className="message-name">
                      <span>{message.content}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {activeChatTicket?.assignedTo === user._id && (
          <div>
            {(() => {
              if (Allmessages?.length > 0) {
                const lastMessage = Allmessages.slice(-1)[0];
                const lastMessageTime = new Date(lastMessage.createdAt);
                const currentTime = new Date();
                const timeDifferenceInHours =
                  (currentTime - lastMessageTime) / (1000 * 60 * 60);
                if (
                  timeDifferenceInHours >
                  customisations?.missedChatTimer?.slice(0, 2)
                ) {
                  return (
                    <p
                      style={{
                        fontSize: "14px",
                        textAlign: "center",
                        color: "red",
                      }}
                    >
                      Replying to Missing chat
                    </p>
                  );
                }
              }
            })()}
          </div>
        )}
        {activeChatTicket?.assignedTo === user._id && (
          <div className="chat-bottom-section">
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="type here"
              name=""
              id=""
              onKeyDown={handleKeyPress}
            ></textarea>
            <IoSend onClick={sendNewMessage} className="sendBtn" />
          </div>
        )}

        {activeChatTicket?.assignedTo !== user._id &&
          allTicketCreatedUsers?.length > 0 && (
            <p
              className="chat-bottom-section"
              style={{ fontSize: "14px", textAlign: "center" }}
            >
              This chat is assigned to new team member. you no longer have
              access .
            </p>
          )}
      </div>

      <div className="opened-teammate-details">
        {allTicketCreatedUsers?.length > 0 && activeChat ? (
          <div className="opened-teammate">
            <img src={profile} alt="" />
            <p>{activeChat.name}</p>
          </div>
        ) : (
          <p>No active chat selected</p>
        )}

        <div style={{ color: "#184E7F", fontSize: "14px", margin: "10px" }}>
          Details
        </div>
        <div className="teammate-profile">
          <div className="teammate-name">
            <MdOutlineContactPage className="name-icon" />

            <input
              readOnly
              type="text"
              value={
                (allTicketCreatedUsers?.length > 0 &&
                  activeChatTicket?.createdBy?.name) ||
                ""
              }
            />
          </div>
          <div className="teammate-number">
            <FaPhone className="contact-icon" />
            <input
              readOnly
              type="tel"
              value={
                (allTicketCreatedUsers?.length > 0 &&
                  activeChatTicket?.createdBy?.phone) ||
                ""
              }
            />
          </div>
          <div className="teammate-email">
            <MdOutlineEmail className="email-icon" />
            <input
              readOnly
              type="email"
              value={
                (allTicketCreatedUsers?.length > 0 &&
                  activeChatTicket?.createdBy?.email) ||
                ""
              }
            />
          </div>
        </div>
        <div style={{ color: "#184E7F", fontSize: "14px", margin: "10px" }}>
          {" "}
          Teammates
        </div>
        <div className="other-teammates">
          <select
            value={teammateDropdownValue}
            name=""
            id=""
            className="teammates-select"
            onChange={(e) => {
              handleChange(e);
            }}
          >
            <option value="">Select Teammate</option>

            {teamMates && teamMates.length > 0 ? (
              teamMates.map((person, index) => (
                <option
                  disabled={allTicketCreatedUsers?.length > 0 ? false : true}
                  key={index}
                  value={person?._id}
                >
                  {person?.firstname}
                </option>
              ))
            ) : (
              <option value="">No teammates available</option>
            )}
          </select>

          <select
            value={statusDropdownValue}
            onChange={(e) => handleStatusChange(e)}
            name=""
            id=""
            className="status-select"
          >
            <option readOnly value="">
              Ticket Status
            </option>
            <option
              disabled={allTicketCreatedUsers?.length > 0 ? false : true}
              value="resolved"
            >
              Resolved
            </option>
            <option
              disabled={allTicketCreatedUsers?.length > 0 ? false : true}
              value="unresolved"
            >
              Unresolved
            </option>
          </select>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default ContactCentre;
