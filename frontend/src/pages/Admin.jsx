import { useState, useEffect } from "react";
import { getFaqs, getNotes, addFaq, deleteFaq, uploadNote, deleteNote } from "../api/chat";

export default function Admin() {
  const [faqs, setFaqs] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [noteForm, setNoteForm] = useState({ title: "", subject: "", type: "pdf", size: "1 MB", date: "2026-05-05", chapters: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const faqData = await getFaqs();
      const noteData = await getNotes();
      setFaqs(faqData || {});
      setNotes(Array.isArray(noteData) ? noteData : []);
      setLoading(false);
    }
    loadData();
  }, []);

  const refreshData = async () => {
    const faqData = await getFaqs();
    const noteData = await getNotes();
    setFaqs(faqData || {});
    setNotes(Array.isArray(noteData) ? noteData : []);
  };

  const handleAddFaq = async () => {
    if (!faqForm.question || !faqForm.answer) return;
    try {
      await addFaq(faqForm);
      setMessage("FAQ added successfully.");
      setFaqForm({ question: "", answer: "" });
      await refreshData();
    } catch (error) {
      setMessage("Unable to save FAQ.");
    }
  };

  const handleDeleteFaq = async (question) => {
    try {
      await deleteFaq(question);
      setMessage("FAQ removed.");
      await refreshData();
    } catch (error) {
      setMessage("Unable to delete FAQ.");
    }
  };

  const handleUploadNote = async () => {
    const chapters = noteForm.chapters
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      await uploadNote({
        title: noteForm.title,
        subject: noteForm.subject,
        type: noteForm.type,
        size: noteForm.size,
        date: noteForm.date,
        chapters,
      });
      setMessage("Note uploaded successfully.");
      setNoteForm({ title: "", subject: "", type: "pdf", size: "1 MB", date: new Date().toISOString().slice(0, 10), chapters: "" });
      await refreshData();
    } catch (error) {
      setMessage("Unable to upload note.");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setMessage("Note deleted.");
      await refreshData();
    } catch (error) {
      setMessage("Unable to delete note.");
    }
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
      <div className="hero" style={{ background: 'var(--gradient-info)', marginBottom: '20px' }}>
        <div>
          <h1>Admin Control Panel</h1>
          <p>Manage FAQs, upload notes, and keep your student dashboard up to date.</p>
        </div>
      </div>

      {message && (
        <div className="card glass" style={{ padding: '16px', marginBottom: '20px', color: 'var(--text-primary)' }}>
          {message}
        </div>
      )}

      <div className="grid">
        <div className="card glass">
          <h3>New FAQ</h3>
          <input
            placeholder="Question"
            value={faqForm.question}
            onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
          />
          <textarea
            placeholder="Answer"
            value={faqForm.answer}
            onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
            rows={3}
          />
          <button className="btn" onClick={handleAddFaq} style={{ marginTop: '12px' }}>
            Save FAQ
          </button>
        </div>

        <div className="card glass">
          <h3>Upload Note</h3>
          <input
            placeholder="Title"
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
          />
          <input
            placeholder="Subject"
            value={noteForm.subject}
            onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
          />
          <input
            placeholder="Type (pdf/doc/image)"
            value={noteForm.type}
            onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
          />
          <input
            placeholder="Size"
            value={noteForm.size}
            onChange={(e) => setNoteForm({ ...noteForm, size: e.target.value })}
          />
          <input
            type="date"
            value={noteForm.date}
            onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })}
          />
          <textarea
            placeholder="Chapters (one per line)"
            value={noteForm.chapters}
            onChange={(e) => setNoteForm({ ...noteForm, chapters: e.target.value })}
            rows={4}
          />
          <button className="btn" onClick={handleUploadNote} style={{ marginTop: '12px' }}>
            Upload Note
          </button>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '20px' }}>
        <div className="card glass" style={{ padding: '20px' }}>
          <h3>Existing FAQs</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(faqs).map(([question, answer]) => (
              <div key={question} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                <div>
                  <strong>{question}</strong>
                  <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>{answer}</p>
                </div>
                <button className="btn btn-sm btn-outline" onClick={() => handleDeleteFaq(question)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card glass" style={{ padding: '20px' }}>
          <h3>Uploaded Notes</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {notes.map((note) => (
              <div key={note.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                  <strong>{note.title}</strong>
                  <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>{note.subject} • {note.type.toUpperCase()}</p>
                </div>
                <button className="btn btn-sm btn-outline" onClick={() => handleDeleteNote(note.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
