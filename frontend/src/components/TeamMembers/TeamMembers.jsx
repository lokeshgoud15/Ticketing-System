import "./TeamMembers.css";
import profile from "../../assets/profile.png";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setIsEditable } from "../../Slices/userSlice";
import { useState } from "react";

const TeamMembers = ({
  person,
  role,
  firstname,
  lastname,
  email,
  setAllMembers,
  showToast,
}) => {
  const user = useSelector((store) => store.user.user);
  const [deleteActive, setDeleteActive] = useState(false);

  const dispatch = useDispatch();

  const deleteMember = async (person) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/team/${person._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();

      if (data.success) {
        setAllMembers((prevMembers) =>
          prevMembers.filter((member) => member._id !== person._id)
        );
        showToast("success", data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to delete member");
    }
  };
  const editMember = () => {
    dispatch(setIsEditable(true));
  };

  return (
    <div className="team-member-container">
      <div className="team-member-header">
        <div className="team-member-headings team-member-image">
          <img src={profile} alt="" />
        </div>
        <div className="team-member-headings">{`${firstname}${" "}${lastname}`}</div>
        <div className="team-member-headings">+1 (000) 000-0000</div>
        <div className="team-member-headings email">{email}</div>
        <div className="team-member-headings">{role}</div>
      </div>
      <div className="team-member-actions">
        {role === "admin" ? (
          ""
        ) : (
          <>
            {user.role === "admin" && (
              <div className="actions">
                <AiTwotoneEdit
                  className="edit-btn"
                  onClick={() => editMember()}
                />

                <MdDeleteOutline
                  className="dlt-btn"
                  onClick={() => setDeleteActive(true)}
                />
              </div>
            )}
          </>
        )}
      </div>
      {deleteActive && (
        <div className="delete-modal">
          <div className="delete-modal-container">
            <h1 style={{ fontSize: "16px", fontWeight: "400" }}>
              this teammate will be deleted.
            </h1>
          </div>
          <div className="delete-modal-btns">
            <button
              className="cancel-btn"
              onClick={() => setDeleteActive(false)}
            >
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={() => deleteMember(person)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeamMembers;
