import "./Ticket.css";
import profile from "../../assets/profile.png";

import { useDispatch } from "react-redux";
import {
  setActiveChat,
  setActiveChatTicket,
  setActiveTab,
} from "../../Slices/ActiveTab";

const Ticket = ({ eachTicket }) => {
  const dispatch = useDispatch();
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  const timeSinceCreated = (timestamp) => {
    const createdTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime - createdTime);

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
  };

  const openTicketInContact = async (openThisTicket) => {
    if (openThisTicket.status === "resolved") {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ticket/open/${
            openThisTicket._id
          }`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              status: "unresolved",
            }),
          }
        );
        const data = await res.json();
        if (data.success) {
          dispatch(setActiveTab("ContactCentre"));
          dispatch(setActiveChat(openThisTicket.createdBy));
          dispatch(setActiveChatTicket(openThisTicket));
        }
      } catch (error) {
        console.error(error);
        console.error(error.message);
      }
    }
    dispatch(setActiveTab("ContactCentre"));
    dispatch(setActiveChat(openThisTicket.createdBy));
    dispatch(setActiveChatTicket(openThisTicket));
  };

  return (
    <div className="ticket-container">
      <div className="ticket-info">
        <div className="ticket-info-header">
          <div className="ticket-info-header-title">
            <p className="color"></p>
            <p className="ticket-number">{eachTicket.title.slice(0, 17)}</p>
          </div>
          <div className="ticket-posted">
            Posted at {formatTime(eachTicket.createdAt)}
          </div>
        </div>
        <div className="ticket-desc">
          <p className="ticket-desc-text">{eachTicket.description}</p>
          <p className="ticket-deadline">
            {timeSinceCreated(eachTicket.createdAt)}
          </p>
        </div>
      </div>
      <hr className="ticket-hr" />

      <div className="ticket-assigned-info">
        <div className="ticket-assigned-info-header">
          <div>
            <img src={profile} alt="" />
          </div>
          <div>
            <p>{eachTicket.createdBy.name}</p>
            <p>+91 {eachTicket.createdBy.phone}</p>
            <p>{eachTicket.createdBy.email}</p>
          </div>
        </div>
        <div>
          <div
            onClick={() => openTicketInContact(eachTicket)}
            className="open-ticket"
          >
            Open Ticket
          </div>
        </div>
      </div>
    </div>
  );
};
export default Ticket;
