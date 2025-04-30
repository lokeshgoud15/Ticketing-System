import { useEffect, useState } from "react";
import { setAddMembersBtn } from "../../Slices/userSlice";
import "./AddMembers.css";
import { useDispatch, useSelector } from "react-redux";
const AddMembers = ({ showToast }) => {
  const user = useSelector((store) => store.user.user);
  const isEditable = useSelector((store) => store.user.isEditable);
  const [memberInfo, setMemberInfo] = useState({
    username: "",
    emailId: "",
    designation: "member",
  });

  const addMembersBtn = useSelector((state) => state.user.addMembersBtn);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { emailId, username, designation } = memberInfo;
    if (!emailId) {
      showToast("error", "Please fill the Email field");
      return;
    }

    if (!username) {
      showToast("error", "Username can't be empty");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/team/${user._id}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            emailId: emailId,
            designation: designation,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        showToast("success", data.message);
        setMemberInfo({
          username: "",
          emailId: "",
          designation: "member",
        });
        setTimeout(() => {
          dispatch(setAddMembersBtn(false));
        }, 1000);
      }
    } catch (error) {
      showToast("error", "An error occurred while adding the member");
      console.error(error);
    }
  };

  return (
    <div
      className={`add-members-container
        ${addMembersBtn ? "add-active" : ""} ${isEditable ? "add-active" : ""}`}
    >
      <h2>Add Team Members</h2>
      <div className="add-members-description">
        Talk with colleagues in a group chat. Messages in this group are only
        visible to it's participants. New teammates may only be invited by the
        administrators.
      </div>
      <form onSubmit={handleSubmit} action="" className="form">
        <div className="form-group">
          <label htmlFor="">User name</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="User name"
            value={memberInfo.username}
            onChange={(e) => {
              setMemberInfo((prev) => ({ ...prev, username: e.target.value }));
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Email ID</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email ID"
            value={memberInfo.emailId}
            onChange={(e) =>
              setMemberInfo((prev) => ({ ...prev, emailId: e.target.value }))
            }
          />
        </div>
        <div className="form-group input-field">
          <label htmlFor="designation">Designation</label>
          <select
            name="designation"
            id="designation"
            value={memberInfo.designation}
            onChange={(e) =>
              setMemberInfo((prev) => ({
                ...prev,
                designation: e.target.value,
              }))
            }
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="add-members-btns">
          <button
            type="button"
            onClick={() => dispatch(setAddMembersBtn(false))}
            className="cancel-member-btn"
          >
            Cancel
          </button>
          <button type="submit" className="save-member-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddMembers;
