import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, BookOpen, Award, Calendar, Edit2, Save, X } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/profile");
      const result = await response.json();
      setProfile(result);
      setFormData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading" />
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    // In a real app, you would make a PUT request to save to backend
  };

  const avatarInitials = profile?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'S';

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="hero" style={{ background: 'var(--gradient-primary)', marginBottom: '20px' }}>
        <div>
          <h1>👤 Student Profile</h1>
          <p>Manage your academic information and preferences</p>
        </div>
      </div>

      {/* PROFILE HEADER */}
      <div className="card glass" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
            {/* AVATAR */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '16px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: '800',
              color: 'white',
              flexShrink: 0,
            }}>
              {avatarInitials}
            </div>

            {/* PROFILE INFO */}
            {isEditing ? (
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{ marginBottom: '12px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{ marginBottom: '12px' }}
                />
                <input
                  type="text"
                  placeholder="Roll Number"
                  value={formData.roll || ''}
                  onChange={(e) => handleInputChange('roll', e.target.value)}
                  style={{ marginBottom: '12px' }}
                />
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{profile?.name || 'Student Name'}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>
                  Roll: {profile?.roll || 'N/A'} • {profile?.department || 'Department'} • Year {profile?.year || 'N/A'}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} />
                    {profile?.email || 'not-set'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EDIT BUTTON */}
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isEditing ? 'var(--gradient-success)' : 'var(--gradient-primary)',
            }}
          >
            {isEditing ? (
              <>
                <Save size={16} />
                Save
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Edit
              </>
            )}
          </button>

          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(profile);
              }}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* DETAILED INFO */}
      <div className="grid-2">
        {/* ACADEMIC INFO */}
        <div className="card glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <BookOpen size={24} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0 }}>Academic Information</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Department
              </label>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                {profile?.department || 'N/A'}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Year
              </label>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                Year {profile?.year || 'N/A'}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Roll Number
              </label>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                {profile?.roll || 'N/A'}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Admission Year
              </label>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                2023
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="card glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Mail size={24} style={{ color: 'var(--success)' }} />
            <h3 style={{ margin: 0 }}>Contact Information</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                  {profile?.email || 'not-set'}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Phone
              </label>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                +91 98765 43210
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Address
              </label>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                City, State - 000000
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Emergency Contact
              </label>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
                +91 99999 99999
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="card glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Award size={24} style={{ color: 'var(--warning)' }} />
          <h3 style={{ margin: 0 }}>Achievements & Awards</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {[
            { icon: '🏆', title: 'Dean\'s List', desc: 'Semester 1' },
            { icon: '🎖️', title: 'Excellence', desc: 'Programming' },
            { icon: '⭐', title: 'Star Student', desc: 'February 2024' },
            { icon: '🥇', title: 'Topper', desc: 'Mathematics' },
          ].map((achievement, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: 'var(--glass-hover)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{achievement.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                {achievement.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {achievement.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREFERENCES */}
      <div className="card glass">
        <h3 style={{ marginBottom: '20px' }}>⚙️ Preferences</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Email Notifications</label>
            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>SMS Alerts</label>
            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Push Notifications</label>
            <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </div>
  );
}