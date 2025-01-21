import React, { useEffect, useState } from "react"; // Import useState and useEffect
import axios from "axios";
import Navbar from "./Navbar"; // Import your Navbar component
import "./UserManagement.css"; // Import the corresponding CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]); // Now you can use useState

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/users/unverified");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching unverified users:", error);
      }
    };

    fetchUnverifiedUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.patch(`http://127.0.0.1:5000/users/approve/${userId}`);
      alert("User approved successfully!");
      setUsers(users.map((user) => 
        user.id === userId ? { ...user, isVerified: "True" } : user
      ));
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Error approving user.");
    }
  };

  const handleDisapprove = async (userId) => {
    try {
      await axios.patch(`http://127.0.0.1:5000/users/disapprove/${userId}`);
      alert("User disapproved successfully!");
      setUsers(users.map((user) => 
        user.id === userId ? { ...user, isVerified: "False" } : user
      ));
    } catch (error) {
      console.error("Error disapproving user:", error);
      alert("Error disapproving user.");
    }
  };

  return (
    <div className="user-management-container">
      <Navbar />
      <div className="user-management-content">
        <h2>User Management</h2>
        <img src="./src/assets/bgmu.png" alt="User management image" srcSet="" />
        {users.length === 0 ? (
          <p>No unverified users at the moment.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={`approve-button ${user.isVerified === "True" ? "approved" : ""}`}
                      onClick={() => handleApprove(user.id)}
                      disabled={user.isVerified === "True"}
                    >
                      Approve
                    </button>
                    <button
                      className={`disapprove-button ${user.isVerified === "False" ? "disapproved" : ""}`}
                      onClick={() => handleDisapprove(user.id)}
                      disabled={user.isVerified === "False"}
                    >
                      Disapprove
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
