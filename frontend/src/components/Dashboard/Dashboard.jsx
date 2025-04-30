import { FaTicket } from "react-icons/fa6";
import "./Dashboard.css";
import { CiSearch } from "react-icons/ci";
import { LuTicketCheck, LuTicketX } from "react-icons/lu";
import { useEffect, useState } from "react";
import Ticket from "../Ticket/Ticket";

const Dashboard = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeButton, setActiveButton] = useState("all-tickets");
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [unresolvedTickets, setUnresolvedTickets] = useState([]);

  // Fetch all tickets
  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ticket/alltickets`,
          {
            method: "GET",
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setAllTickets(data);
        setFilteredTickets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllTickets();
  }, []);

  // Fetch resolved tickets
  useEffect(() => {
    const fetchResolvedTickets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ticket/resolvedtickets`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setResolvedTickets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResolvedTickets();
  }, []);

  // Fetch unresolved tickets
  useEffect(() => {
    const fetchUnresolvedTickets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ticket/unresolvedtickets`,
          {
            method: "GET",
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUnresolvedTickets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnresolvedTickets();
  }, []);

  useEffect(() => {
    const filterTickets = () => {
      const ticketsToFilter =
        activeButton === "all-tickets"
          ? allTickets
          : activeButton === "resolved"
          ? resolvedTickets
          : activeButton === "unresolved"
          ? unresolvedTickets
          : [];

      const filtered = ticketsToFilter.filter((ticket) => {
        const ticketTitle = ticket.title?.toLowerCase() || "";
        const email = ticket?.createdBy?.email?.toLowerCase() || "";
        const personName = ticket?.createdBy?.name?.toLowerCase() || "";
        const message = ticket?.description?.toLowerCase() || "";

        return (
          ticketTitle.includes(searchInput.toLowerCase()) ||
          email.includes(searchInput.toLowerCase()) ||
          personName.includes(searchInput.toLowerCase()) ||
          message.includes(searchInput.toLowerCase())
        );
      });

      setFilteredTickets(filtered);
    };

    filterTickets();
  }, [
    searchInput,
    activeButton,
    allTickets,
    resolvedTickets,
    unresolvedTickets,
  ]);

  return (
    <div className="dashboard-container">
      <p className="dashboard-text">Dashboard</p>
      <div className="search-bar">
        <CiSearch className="search-icon" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search for ticket"
        />
      </div>

      <div className="ticket-status">
        <div
          onClick={() => setActiveButton("all-tickets")}
          className={`ticket-status-text ${
            activeButton === "all-tickets" ? "activeTab" : ""
          }`}
        >
          {activeButton === "all-tickets" && <FaTicket />}
          <p>All Tickets</p>
        </div>
        <div
          onClick={() => setActiveButton("resolved")}
          className={`ticket-status-text ${
            activeButton === "resolved" ? "activeTab" : ""
          }`}
        >
          {activeButton === "resolved" && <LuTicketCheck />}
          <p>Resolved</p>
        </div>
        <div
          onClick={() => setActiveButton("unresolved")}
          className={`ticket-status-text ${
            activeButton === "unresolved" ? "activeTab" : ""
          }`}
        >
          {activeButton === "unresolved" && <LuTicketX />}
          <p>Unresolved</p>
        </div>
      </div>
      <hr className="dashboard-hr" />
      <div className="ticket-list">
        {filteredTickets?.map((eachTicket, index) => (
          <div key={index}>
            <Ticket eachTicket={eachTicket} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
