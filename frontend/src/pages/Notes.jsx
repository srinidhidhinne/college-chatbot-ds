import { useState, useEffect } from "react";
import { Download, BookOpen, Share2, Trash2, Plus } from "lucide-react";

export default function Notes() {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [formData, setFormData] = useState({ title: '', subject: '', type: 'pdf' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:8000/notes");
      const result = await response.json();
      setNotes(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading notes:", error);
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

  // Default notes if none loaded
  const defaultNotes = [
    {
      id: 1,
      title: 'Introduction to Programming',
      subject: 'PPS',
      type: 'pdf',
      size: '2.4 MB',
      date: '2024-01-10',
      chapters: ['Variables', 'Loops', 'Functions'],
    },
    {
      id: 2,
      title: 'Advanced Data Structures',
      subject: 'ADS',
      type: 'pdf',
      size: '5.1 MB',
      date: '2024-01-09',
      chapters: ['Trees', 'Graphs', 'Hashing'],
    },
    {
      id: 3,
      title: 'Web Development Basics',
      subject: 'WebDev',
      type: 'pdf',
      size: '3.8 MB',
      date: '2024-01-08',
      chapters: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 4,
      title: 'Database Management Systems',
      subject: 'DBMS',
      type: 'pdf',
      size: '4.2 MB',
      date: '2024-01-07',
      chapters: ['SQL', 'Normalization', 'Transactions'],
    },
  ];

  const normalizeNotes = (notesData) => {
    if (!notesData) return [];
    if (Array.isArray(notesData)) return notesData;

    const normalized = [];

    Object.values(notesData).forEach((value) => {
      if (Array.isArray(value)) {
        normalized.push(...value);
      } else if (value && typeof value === 'object') {
        Object.values(value).forEach((item) => {
          if (Array.isArray(item)) {
            normalized.push(...item);
          } else if (item && typeof item === 'object' && Array.isArray(item.notes)) {
            normalized.push(...item.notes);
          }
        });
      }
    });

    return normalized;
  };

  const notesList = notes ? normalizeNotes(notes) : defaultNotes;
  const noteItems = notesList.length > 0 ? notesList : defaultNotes;

  const filteredNotes = noteItems.filter((note) => {
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    const matchesSearch = searchQuery
      ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.chapters || []).some((chapter) => chapter.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesSubject && matchesSearch;
  });

  const handleAddNote = () => {
    if (formData.title && formData.subject) {
      setNotes([...noteItems, { ...formData, id: Date.now() }]);
      setFormData({ title: '', subject: '', type: 'pdf' });
      setShowAddForm(false);
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(noteItems.filter(n => n.id !== id));
  };

  const subjects = [...new Set(noteItems.map(n => n.subject))];

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="hero" style={{ background: 'var(--gradient-success)', marginBottom: '20px' }}>
        <div>
          <h1>📚 Study Notes & Resources</h1>
          <p>Access all your course materials and study resources</p>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-label">Total Notes</div>
          <div className="stat-value">{noteItems.length}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Study materials
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-label">Subjects</div>
          <div className="stat-value">{subjects.length}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Covered
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-label">Total Size</div>
          <div className="stat-value">
            {(noteItems.reduce((sum, n) => sum + (parseInt(n.size) || 0), 0)).toFixed(1)} MB
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Storage used
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Latest</div>
          <div className="stat-value">Today</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Updated
          </p>
        </div>
      </div>

      {/* ADD NOTE FORM */}
      {showAddForm && (
        <div className="card glass" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>➕ Add New Note</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Note Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ background: 'var(--glass-base)', padding: '12px 16px', borderRadius: '12px' }}
            >
              <option value="pdf">PDF</option>
              <option value="doc">Document</option>
              <option value="image">Image</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn" onClick={handleAddNote} style={{ flex: 1 }}>
                Add Note
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowAddForm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!showAddForm && (
        <button className="btn" onClick={() => setShowAddForm(true)} style={{ marginBottom: '20px' }}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Add New Note
        </button>
      )}

      {/* SEARCH + FILTER */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search notes by title, subject or chapter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--glass-base)' }}
        />
        <button
          className="btn btn-sm"
          onClick={() => setSelectedSubject('All')}
          style={{ background: selectedSubject === 'All' ? 'var(--glass-active)' : 'var(--glass-hover)', border: '1px solid var(--border-color)' }}
        >
          All
        </button>
        {subjects.map(subject => (
          <button
            key={subject}
            className="btn btn-sm"
            onClick={() => setSelectedSubject(subject)}
            style={{
              background: selectedSubject === subject ? 'var(--glass-active)' : 'var(--glass-hover)',
              border: '1px solid var(--border-color)'
            }}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* NOTES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredNotes.length === 0 ? (
          <div className="card glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔎</div>
            <p style={{ color: 'var(--text-muted)' }}>No notes found for that search or filter.</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="card glass">
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>
                  {note.type === 'pdf' ? '📕' : note.type === 'doc' ? '📗' : '🖼️'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                    {note.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                      {note.subject}
                    </span>
                    <span className="badge badge-secondary" style={{ fontSize: '10px', background: 'rgba(240, 126, 194, 0.2)', color: '#f093fb' }}>
                      {note.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* CHAPTERS */}
              {note.chapters && (
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Chapters
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {note.chapters.map((chapter, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: 'var(--glass-hover)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {chapter}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* INFO */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span>{note.size}</span>
                <span>{note.date}</span>
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-sm"
                  style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => window.open(`http://localhost:8000/notes/download/${note.id}`, "_blank")}
                >
                  <Download size={14} style={{ marginRight: '4px' }} />
                  Download
                </button>
                <button className="btn btn-sm btn-outline" style={{ flex: 1, fontSize: '12px' }}>
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TIPS */}
      <div className="card glass" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '12px' }}>💡 Tips for Better Learning</h3>
        <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
          <li>Download notes in advance and review them before class</li>
          <li>Make handwritten notes to reinforce your learning</li>
          <li>Organize notes by subject for easy access</li>
          <li>Share notes with peers for collaborative learning</li>
          <li>Review notes regularly for better retention</li>
        </ul>
      </div>
    </div>
  );
}