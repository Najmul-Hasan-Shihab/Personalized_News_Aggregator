import React, { useState, useEffect } from "react";
import "./profile.css";

const initialUser = {
  name: "John Doe",
  email: "john@example.com",
  contact: "+1234567890",
  school: "Greenwood High School",
  college: "City College",
  university: "State University",
  work: "Software Developer at OpenAI",
  bio: "News lover & open-source contributor.",
  profilePic: "https://via.placeholder.com/120",
  coverPic: "https://via.placeholder.com/800x200"
};

const userPosts = [
  { id: 1, content: "My first post on Echorithm!", date: "Aug 5, 2025" },
  { id: 2, content: "Exploring the new editor!", date: "Aug 6, 2025" }
];

const allCategories = ["Technology",
  "Science",
  "Health",
  "Travel",
  "Entertainment",
  "Sports",
  "Business",
  "Politics",
  "Environment",
  "General",
];

const Profile = () => {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...initialUser });
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch("http://localhost:8000/preferences/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setSelectedCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch preferences", err);
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePreferences = async () => {
    const token = localStorage.getItem("access");
    try {
      await fetch("http://localhost:8000/preferences/update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ categories: selectedCategories })
      });
    } catch (err) {
      console.error("Error saving preferences", err);
    }
  };

  const handleSave = async () => {
    setUser(editData);
    await handleSavePreferences();
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <div className="cover-image">
        <img src={user.coverPic} alt="Cover" />
        <label className="edit-image-btn">
          📷
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "coverPic")}
          />
        </label>
      </div>

      <div className="profile-info">
        <div className="profile-pic-wrapper">
          <img className="profile-pic" src={user.profilePic} alt="Profile" />
          <label className="edit-image-btn profile-btn">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "profilePic")}
            />
          </label>
        </div>
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>

      <div className="profile-layout">
        <div className="intro-section">
          <h3>Intro</h3>
          <ul>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Contact:</strong> {user.contact}</li>
            <li><strong>School:</strong> {user.school}</li>
            <li><strong>College:</strong> {user.college}</li>
            <li><strong>University:</strong> {user.university}</li>
            <li><strong>Work:</strong> {user.work}</li>
          </ul>
          <div className="preferences">
            <h4>Your Preferences</h4>
            <ul>
              {selectedCategories.length > 0 ? (
                selectedCategories.map((cat) => <li key={cat}>{cat}</li>)
              ) : (
                <li>No preferences selected</li>
              )}
            </ul>
          </div>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Info</button>
        </div>

        <div className="post-section">
          <h3>Your Posts</h3>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post.id} className="post-card">
                <p>{post.content}</p>
                <span className="post-date">{post.date}</span>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="edit-modal">
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Name" required />
            <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="contact" value={editData.contact} onChange={handleChange} placeholder="Contact" />
            <input type="text" name="school" value={editData.school} onChange={handleChange} placeholder="School" />
            <input type="text" name="college" value={editData.college} onChange={handleChange} placeholder="College" />
            <input type="text" name="university" value={editData.university} onChange={handleChange} placeholder="University" />
            <input type="text" name="work" value={editData.work} onChange={handleChange} placeholder="Work" />
            <textarea name="bio" value={editData.bio} onChange={handleChange} placeholder="Short bio..." rows="3" />

            <div className="category-selection">
              <h4>Select Your Interests</h4>
              {allCategories.map((cat) => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCategories((prev) =>
                        prev.includes(value)
                          ? prev.filter((c) => c !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  {cat}
                </label>
              ))}
            </div>

            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;