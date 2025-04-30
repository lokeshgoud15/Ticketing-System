import Dashboard from "../../components/Dashboard/Dashboard";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./MainContainer.css";
import ContactCentre from "./../../components/ContactCentre/ContactCentre";

import Analytics from "./../../components/Analytics/Analytics";

import Profile from "./../../components/Profile/Profile";
import Team from "./../../components/Team/Team";
import Chatbot from "../../components/ChatBot/Chatbot";
import { useSelector } from "react-redux";

const allComps = [
  {
    name: "Dashboard",
    component: <Dashboard />,
  },
  {
    name: "ContactCentre",
    component: <ContactCentre />,
  },
  {
    name: "Chatbot",
    component: <Chatbot />,
  },
  {
    name: "Analytics",
    component: <Analytics />,
  },
  {
    name: "Profile",
    component: <Profile />,
  },
  {
    name: "Team",
    component: <Team />,
  },
];
const MainContainer = () => {
  const activeTab = useSelector((store) => store.activeTab.activeTab);
  const activeComponent = allComps.find(
    (comp) => comp.name === activeTab
  )?.component;

  return (
    <div className="main-container">
      <Sidebar activeTab={activeTab} />
      <div className="main-content">{activeComponent}</div>
    </div>
  );
};
export default MainContainer;
