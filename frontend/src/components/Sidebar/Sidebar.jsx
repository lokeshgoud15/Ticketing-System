import "./Sidebar.css";
import { AiOutlineHome } from "react-icons/ai";
import hublyImage from "../../assets/hubly.png";
import { BiBarChart, BiBot, BiComment } from "react-icons/bi";
import { PiUsersThreeFill } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Slices/userSlice";
import { setActiveTab } from "../../Slices/ActiveTab";

const Sidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        dispatch(logout());
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during logout");
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={hublyImage} alt="" />
      </div>
      <div className="sidebar-content">
        <div className="sidebar-menu">
          <div
            onClick={() => dispatch(setActiveTab("Dashboard"))}
            className="sidebar-item"
          >
            <AiOutlineHome className="icon" />
            {activeTab === "Dashboard" ? <p>Dashboard</p> : null}
          </div>
          <div
            onClick={() => dispatch(setActiveTab("ContactCentre"))}
            className="sidebar-item"
          >
            <BiComment className="icon" />
            {activeTab === "ContactCentre" ? <p>Contact center</p> : null}
          </div>
          <div
            onClick={() => dispatch(setActiveTab("Analytics"))}
            className="sidebar-item"
          >
            <BiBarChart className="icon" />
            {activeTab === "Analytics" ? <p>Analytics</p> : null}
          </div>
          <div
            onClick={() => dispatch(setActiveTab("Chatbot"))}
            className="sidebar-item"
          >
            <BiBot className="icon" />
            {activeTab === "Chatbot" ? <p>Chat bot</p> : null}
          </div>
          <div
            onClick={() => dispatch(setActiveTab("Team"))}
            className="sidebar-item"
          >
            <PiUsersThreeFill className="icon" />
            {activeTab === "Team" ? <p>Team</p> : null}
          </div>
          <div
            onClick={() => dispatch(setActiveTab("Profile"))}
            className="sidebar-item"
          >
            <IoSettingsOutline className="icon" />
            {activeTab === "Profile" ? <p>Settings</p> : null}
          </div>
        </div>
        <div className="sidebar-bottom">
          <FaRegUserCircle className="icon profile-icon" />

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Sidebar;
