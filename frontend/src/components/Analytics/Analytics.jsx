import "./Analytics.css";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
import { CircularProgress, Box, Typography } from "@mui/material";
import { getAvgReplyTime } from "../../../../backend/controllers/Messages.Controller";

const Analytics = () => {
  const [totalChats, setTotalChats] = useState(0);
  const [totalTickets, setTotalTickets] = useState(1);
  const [resolvedTickets, setResolvedTickets] = useState(1);
  const [avgReplyTime, setAvgReplyTime] = useState(0);
  const [missedChatTime, setMissedChatTime] = useState([]);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages/all-messages/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const output = await res.json();
        setTotalChats(output?.allMessages.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllMessages();
  }, []);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ticket/alltickets`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        setTotalTickets(data?.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllTickets();
  }, []);

  useEffect(() => {
    const fetchResolvedTickets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ticket/resolvedtickets`,
          { credentials: "include" }
        );
        const data = await response.json();

        setResolvedTickets(data?.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResolvedTickets();
  }, []);

  const data = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
      "Week 9",
      "Week 10",
    ],
    datasets: [
      {
        label: "Chats",
        data: missedChatTime && missedChatTime,
        borderColor: "green",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "white",
        pointBorderColor: "black",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Chats: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Weeks",
        },
      },
      y: {
        title: {
          display: true,
          text: "Chats",
        },
        beginAtZero: true,
        suggestedMax: 25,
      },
    },
  };

  useEffect(() => {
    const getAvgReplyTime = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages/avg-reply-time/all`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const ans = await response.json();

        setAvgReplyTime(ans.formattedAvgReplyTimes);
      } catch (error) {
        console.error(error);
      }
    };

    getAvgReplyTime();
  }, []);
  useEffect(() => {
    const getMissedChatTime = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages/missed-chat-time/all`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const ans = await response.json();
        setMissedChatTime(ans.missedChatTimes);
      } catch (error) {
        console.error(error);
      }
    };

    getMissedChatTime();
  }, []);

  return (
    <div className="analytics-container">
      <p className="analytics-text">Analytics</p>
      <div className="analytics-head">
        <div className="analytics-graph">
          <h2>Missed Chats</h2>

          <div style={{ paddingTop: "30px" }}>
            <Line data={data} options={options} />
          </div>
        </div>

        <div className="avg-reply-time">
          <div className="analytics-desc">
            <h2>Average Reply time</h2>
            <p>
              For highest customer satisfaction rates you should aim to reply to
              an incoming customer's message in 15 seconds or less. Quick
              responses will get you more conversations, help you earn customers
              trust and make more sales.
            </p>
          </div>
          <span>{avgReplyTime} </span>
        </div>
        <div className="analytics-resolved-tickets">
          <div className="analytics-desc">
            <h2>Resolved Tickets</h2>
            <p>
              A callback system on a website, as well as proactive invitations,
              help to attract even more customers. A separate round button for
              ordering a call with a small animation helps to motivate more
              customers to make calls.
            </p>
          </div>
          <div className="analytics-percentage">
            <Box
              position="relative"
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress
                variant="determinate"
                value={
                  ((resolvedTickets * 100) / totalTickets).toFixed(2)
                    ? ((resolvedTickets * 100) / totalTickets).toFixed(2)
                    : 0
                }
                thickness={4}
                size={60}
                sx={{
                  color: "#00d907",
                  "& .MuiCircularProgress-circle": {
                    transition: "stroke-dashoffset 0.8s ease-in-out",
                  },
                }}
              />
              <Box
                position="absolute"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="p" component="div" color="text.primary">
                  {`${Math.round(
                    ((resolvedTickets * 100) / totalTickets).toFixed(2)
                  )}% `}
                </Typography>
              </Box>
            </Box>
          </div>{" "}
        </div>
        <div className="analytics-total-chats">
          <div className="analytics-desc">
            <h2>Total Chats</h2>
            <p>
              This metric Shows the total number of chats for all Channels for
              the selected the selected period{" "}
            </p>
          </div>
          <span>{totalChats} Chats</span>
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default Analytics;
