import TeamMembers from "../TeamMembers/TeamMembers";
import { CiCirclePlus } from "react-icons/ci";
import "./Team.css";
import AddMembers from "../AddMembers/AddMembers";
import { useDispatch, useSelector } from "react-redux";
import { setAddMembersBtn } from "../../Slices/userSlice";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Team = () => {
  const addMembersBtn = useSelector((state) => state.user.addMembersBtn);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    const fetchAllMembers = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/team/all-members`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();

      setAllMembers(data.registeredMembers);
    };

    fetchAllMembers();
  }, []);

  const handleToast = (type, message) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="team-container">
      <div className={`team-content ${addMembersBtn ? "blur" : ""}`}>
        <p>Team</p>
        <div className="team-header">
          <div className="team-headings empty"></div>
          <div className="team-headings empty">Full Name</div>
          <div className="team-headings empty">Phone</div>
          <div className="team-headings">Email</div>
          <div className="team-headings empty">role</div>
        </div>

        {allMembers?.map((person, index) => (
          <div key={index}>
            <TeamMembers
              person={person}
              role={person.role}
              firstname={person.firstname}
              lastname={person.lastname}
              email={person.email}
              setAllMembers={setAllMembers}
              showToast={handleToast}
            />
          </div>
        ))}
        {user.role === "admin" && (
          <div
            onClick={() => dispatch(setAddMembersBtn(true))}
            className="add-members-btn"
          >
            <CiCirclePlus className="icon" />
            <button className="add-btn">Add Team Members</button>
          </div>
        )}
      </div>
      {addMembersBtn && <AddMembers showToast={handleToast} />}
      <ToastContainer />
    </div>
  );
};

export default Team;
