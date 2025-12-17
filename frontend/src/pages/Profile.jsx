import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { profileService } from '../services/profileService';
import './Profile.css';

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfileData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        address: data.address || '',
      });
      if (data.profile_picture) {
        setProfilePicturePreview(data.profile_picture);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }
      
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: '', text: '' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
        address: profileData.address,
      };

      // If profile picture changed, convert to base64
      if (profilePicture) {
        updateData.profile_picture = profilePicturePreview;
      }

      await profileService.updateProfile(updateData);
      
      // Update user context
      updateUser({
        ...user,
        name: `${profileData.firstName} ${profileData.lastName}`,
        profilePicture: profilePicturePreview || user.profilePicture,
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Fetch updated profile to refresh data
      await fetchProfile();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      setSaving(false);
      return;
    }

    try {
      await profileService.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        <Card>
          <div className="profile-section">
            <h2>Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              {/* Profile Picture Section */}
              <div className="profile-picture-section">
                <label className="input-label">Profile Picture</label>
                <div className="profile-picture-container">
                  <div className="profile-picture-preview">
                    {profilePicturePreview ? (
                      <img src={profilePicturePreview} alt="Profile" className="profile-picture-img" />
                    ) : (
                      <div className="profile-picture-placeholder">
                        <span className="placeholder-icon">
                          {(profileData.firstName || user?.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="profile-picture-actions">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Picture
                    </Button>
                    {profilePicturePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveProfilePicture}
                      >
                        Remove
                      </Button>
                    )}
                    <small className="picture-hint">Max size: 5MB. Supported: JPG, PNG, GIF</small>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  placeholder="First name"
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  placeholder="Last name"
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Email address"
                disabled
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="Phone number"
              />

              <div className="input-group">
                <label htmlFor="bio" className="input-label">
                  Bio / Description
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  className="input-field textarea-field"
                  rows="4"
                />
              </div>

              {user?.role === 'patient' && (
                <div className="input-group">
                  <label htmlFor="address" className="input-label">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    placeholder="Your address"
                    className="input-field textarea-field"
                    rows="3"
                  />
                </div>
              )}

              <div className="profile-actions">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Profile'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  Change Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  Logout
                </Button>
              </div>
            </form>

            {/* Collapsible Password Change Section */}
            {showPasswordForm && (
              <div className="password-change-section">
                <h3>Change Password</h3>
                <form onSubmit={handleChangePassword} className="profile-form">
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />

                  <div className="password-form-actions">
                    <Button type="submit" variant="primary" disabled={saving}>
                      {saving ? 'Changing...' : 'Change Password'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleLogout}>
                Yes, Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
