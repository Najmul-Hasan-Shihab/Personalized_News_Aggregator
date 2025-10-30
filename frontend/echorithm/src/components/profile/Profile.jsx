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
  // Initialize user data from localStorage or use defaults
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userProfile");
    return savedUser ? JSON.parse(savedUser) : initialUser;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });
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

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(user));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setUser((prev) => ({ ...prev, [type]: imageData }));
        setEditData((prev) => ({ ...prev, [type]: imageData }));
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
    localStorage.setItem("userProfile", JSON.stringify(editData));
    await handleSavePreferences();
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Cover and Profile Picture Card */}
        <div className="profile-header-card">
          <div className="cover-image">
            <img src={user.coverPic} alt="Cover" />
            <label className="edit-image-btn">
              📷 Edit Cover
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
            <div className="profile-details">
              <h2>{user.name}</h2>
              <p className="profile-bio">{user.bio}</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="profile-layout">
          {/* Left Sidebar - Intro Card */}
          <aside className="profile-sidebar">
            <div className="intro-card">
              <h3>About</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📱</span>
                  <div className="info-content">
                    <span className="info-label">Contact</span>
                    <span className="info-value">{user.contact}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏫</span>
                  <div className="info-content">
                    <span className="info-label">School</span>
                    <span className="info-value">{user.school}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🎓</span>
                  <div className="info-content">
                    <span className="info-label">College</span>
                    <span className="info-value">{user.college}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏛️</span>
                  <div className="info-content">
                    <span className="info-label">University</span>
                    <span className="info-value">{user.university}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">💼</span>
                  <div className="info-content">
                    <span className="info-label">Work</span>
                    <span className="info-value">{user.work}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="preferences-card">
              <h3>Your Interests</h3>
              <div className="category-tags">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((cat) => (
                    <span key={cat} className="category-tag">{cat}</span>
                  ))
                ) : (
                  <p className="no-preferences">No preferences selected</p>
                )}
              </div>
            </div>

            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          </aside>

          {/* Right Content - Posts Section */}
          <main className="profile-main">
            <div className="posts-card">
              <h3>Your Posts</h3>
              <div className="posts-list">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post.id} className="post-card">
                      <p className="post-content">{post.content}</p>
                      <span className="post-date">📅 {post.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-posts">
                    <p>📝 No posts yet.</p>
                    <span>Start sharing your thoughts about the news!</span>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <div className="edit-modal-header">
              <h2>Edit Profile</h2>
              <button className="close-btn" onClick={() => setIsEditing(false)}>✕</button>
            </div>
            
            <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="your@email.com" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Contact</label>
                  <input type="text" name="contact" value={editData.contact} onChange={handleChange} placeholder="Phone number" />
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  <textarea name="bio" value={editData.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows="3" />
                </div>
              </div>

              <div className="form-section">
                <h3>Education & Work</h3>
                <div className="form-group">
                  <label>School</label>
                  <input type="text" name="school" value={editData.school} onChange={handleChange} placeholder="School name" />
                </div>
                <div className="form-group">
                  <label>College</label>
                  <input type="text" name="college" value={editData.college} onChange={handleChange} placeholder="College name" />
                </div>
                <div className="form-group">
                  <label>University</label>
                  <input type="text" name="university" value={editData.university} onChange={handleChange} placeholder="University name" />
                </div>
                <div className="form-group">
                  <label>Work</label>
                  <input type="text" name="work" value={editData.work} onChange={handleChange} placeholder="Current position" />
                </div>
              </div>

              <div className="form-section">
                <h3>News Interests</h3>
                <div className="category-selection">
                  {allCategories.map((cat) => (
                    <label key={cat} className="category-checkbox">
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
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="edit-buttons">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;