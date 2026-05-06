import { useMemo, useState, useEffect } from "react";
import { Users, Mail, Heart, Search, CalendarDays } from "lucide-react";

const defaultClubs = [
  {
    id: 1,
    name: 'Computer Science Initiative (CSI)',
    description: 'Community for passionate developers and tech enthusiasts.',
    president: 'Srinidhi',
    contact: 'csi@college.com',
    members: 234,
    events: [
      { title: 'Hackathon Sprint', date: '2026-05-20', time: '11:00 AM' },
      { title: 'AI Study Jam', date: '2026-06-02', time: '4:00 PM' },
    ],
    category: 'Technical',
    interests: ['Programming', 'Web Dev', 'AI/ML'],
    image: '💻',
  },
  {
    id: 2,
    name: 'Robotics Club',
    description: 'Build and innovate with robotics and automation.',
    president: 'Arjun',
    contact: 'robotics@college.com',
    members: 156,
    events: [
      { title: 'Drone Build Workshop', date: '2026-05-24', time: '2:00 PM' },
      { title: 'Automation Demo Day', date: '2026-06-09', time: '10:30 AM' },
    ],
    category: 'Technical',
    interests: ['Robotics', 'Electronics', 'Coding'],
    image: '🤖',
  },
  {
    id: 3,
    name: 'Photography Club',
    description: 'Capture moments and express creativity through the lens.',
    president: 'Priya',
    contact: 'photo@college.com',
    members: 128,
    events: [
      { title: 'Portrait Session', date: '2026-05-28', time: '5:00 PM' },
      { title: 'Editing Masterclass', date: '2026-06-11', time: '3:00 PM' },
    ],
    category: 'Creative',
    interests: ['Photography', 'Art', 'Design'],
    image: '📸',
  },
];

export default function Clubs() {
  const [clubs, setClubs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch("http://localhost:8000/clubs");
      const result = await response.json();
      const clubData = Array.isArray(result) ? result : [result];
      setClubs(clubData.map((club, idx) => ({ id: idx + 1, ...club })));
      setLoading(false);
    } catch (error) {
      console.error("Error loading clubs:", error);
      setClubs(defaultClubs);
      setLoading(false);
    }
  };

  const clubList = clubs || defaultClubs;
  const categories = useMemo(() => [
    'All',
    ...new Set(clubList.map(c => c.category || 'General'))
  ], [clubList]);

  const filteredClubs = useMemo(() => {
    return clubList.filter((club) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = [club.name, club.description, club.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);

      const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [clubList, search, selectedCategory]);

  const handleJoinClub = (clubId) => {
    setJoined((prev) => (prev.includes(clubId) ? prev : [...prev, clubId]));
  };

  const handleLeaveClub = (clubId) => {
    setJoined((prev) => prev.filter((id) => id !== clubId));
  };

  if (loading) {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="hero" style={{ background: 'var(--gradient-warning)', marginBottom: '20px', color: '#000' }}>
        <div>
          <h1>🎭 College Clubs & Organizations</h1>
          <p style={{ color: 'rgba(0, 0, 0, 0.75)' }}>Discover activity groups, join communities, and grow your campus network.</p>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-icon">🏛️</div>
          <div className="stat-label">Total Clubs</div>
          <div className="stat-value">{clubList.length}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Active organizations</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Your Clubs</div>
          <div className="stat-value">{joined.length}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Memberships</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Upcoming Events</div>
          <div className="stat-value">{clubList.reduce((sum, club) => sum + (Array.isArray(club.events) ? club.events.length : 0), 0)}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Scheduled this term</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👫</div>
          <div className="stat-label">Total Members</div>
          <div className="stat-value">{clubList.reduce((sum, club) => sum + (club.members || 0), 0)}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Campus engagement</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 320px' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs, categories, or keywords"
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              background: 'var(--glass-base)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn btn-sm ${selectedCategory === category ? 'active' : ''}`}
              style={{
                background: selectedCategory === category ? 'var(--gradient-primary)' : 'var(--glass-hover)',
                border: '1px solid var(--border-color)',
                color: selectedCategory === category ? 'white' : 'var(--text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredClubs.length === 0 ? (
          <div className="card glass" style={{ padding: '40px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '12px' }}>No clubs match your search</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try a different keyword or choose another category.</p>
          </div>
        ) : (
          filteredClubs.map((club) => {
            const isJoined = joined.includes(club.id);
            const events = Array.isArray(club.events) ? club.events : [];

            return (
              <div key={club.id} className="card glass" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div style={{
                    fontSize: '36px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'var(--glass-hover)',
                    display: 'grid',
                    placeItems: 'center',
                  }}>
                    {club.image || '🎯'}
                  </div>
                  <button
                    onClick={() => (isJoined ? handleLeaveClub(club.id) : handleJoinClub(club.id))}
                    className="btn btn-sm"
                    style={{
                      padding: '10px 14px',
                      minWidth: '100px',
                      background: isJoined ? 'var(--danger)' : 'transparent',
                      color: isJoined ? '#fff' : 'var(--text-primary)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{club.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '14px' }}>{club.description}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                    <span className="badge badge-primary">{club.category || 'General'}</span>
                    {club.interests?.slice(0, 3).map((interest, idx) => (
                      <span key={idx} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '999px', background: 'var(--glass-hover)', color: 'var(--text-muted)' }}>
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ padding: '14px', borderRadius: '16px', background: 'var(--glass-hover)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Members</div>
                      <div style={{ fontSize: '16px', fontWeight: '700' }}>{club.members || 0}</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '16px', background: 'var(--glass-hover)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Events</div>
                      <div style={{ fontSize: '16px', fontWeight: '700' }}>{events.length}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '16px', background: 'var(--glass-hover)', marginBottom: '18px' }}>
                    <Mail size={16} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{club.contact || 'contact@club.com'}</span>
                  </div>

                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarDays size={16} />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Upcoming events</span>
                  </div>

                  {events.length > 0 ? (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {events.slice(0, 3).map((event, idx) => (
                        <div key={idx} style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600' }}>{event.title}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No upcoming events. Check back later for new activity.</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="card glass" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '14px' }}>💡 Club Growth Tips</h3>
        <ul style={{ listStyle: 'disc inside', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <li>Choose clubs that complement your academic goals and personal interests.</li>
          <li>Attend at least one event per week to stay connected and visible.</li>
          <li>Volunteer for leadership tasks to strengthen practical experience.</li>
          <li>Share your ideas during planning sessions and help build community.</li>
        </ul>
      </div>
    </div>
  );
}