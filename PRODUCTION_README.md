# 🎓 College Chatbot - Production SaaS Dashboard

A modern, production-ready academic management system with AI-powered chatbot, built with React, FastAPI, and Groq AI.

## 🌟 Features

### Core Dashboard Features
- **📊 Dashboard**: Comprehensive academic overview with charts and analytics
- **🤖 Chatbot**: AI-powered assistant for student queries (powered by Groq)
- **📅 Attendance**: Subject-wise attendance tracking with progress indicators
- **📈 Marks**: Academic performance analysis with grading system
- **📝 Exams**: Exam schedule management with urgency indicators
- **📚 Notes**: Study materials and resources organization
- **🎭 Clubs**: Club discovery and membership management
- **🔔 Notifications**: Academic alerts and announcements
- **👤 Profile**: Student information and preferences

### Technical Highlights
✅ **Glassmorphism Design** - Modern UI with blur effects and transparency
✅ **Real Data Visualization** - Interactive charts with Recharts
✅ **Responsive Design** - Mobile-first approach with breakpoints
✅ **AI Integration** - Groq API for intelligent chatbot
✅ **Dark Theme** - Eye-friendly professional color scheme
✅ **Production Ready** - Error handling, loading states, CORS enabled
✅ **Reusable Components** - StatCard, Card, Button, Badge, NotificationItem, ProgressBar, DataTable

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ & npm
- Python 3.8+
- Groq API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn groq python-multipart
```

4. Run FastAPI server:
```bash
python app.py
```

Server will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
college_chatbot/
├── backend/
│   ├── app.py                 # FastAPI server with Groq integration
│   ├── theme.py              # UI customization
│   ├── DataFolder/           # JSON data files
│   │   ├── attendance.json
│   │   ├── marks.json
│   │   ├── exams.json
│   │   ├── clubs.json
│   │   ├── profile.json
│   │   ├── notifications.json
│   │   ├── events.json
│   │   ├── faqs.json
│   │   └── notes.json
│   └── chatbot/              # AI engine modules
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application
│   │   ├── index.css         # Design system & styles
│   │   ├── main.jsx          # Entry point
│   │   ├── api/
│   │   │   └── chat.js
│   │   ├── components/       # Reusable components
│   │   │   ├── StatCard.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── NotificationItem.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── index.js
│   │   └── pages/            # Page components
│   │       ├── Dashboard.jsx
│   │       ├── Chatbot.jsx
│   │       ├── Attendance.jsx
│   │       ├── Marks.jsx
│   │       ├── Exams.jsx
│   │       ├── Notes.jsx
│   │       ├── Clubs.jsx
│   │       ├── Notifications.jsx
│   │       └── Profile.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 🔌 API Endpoints

### Base URL
`http://localhost:8000`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/chat` | Chat with AI (Groq) |
| GET | `/attendance` | Get attendance data |
| GET | `/attendance/overall` | Get overall attendance |
| GET | `/marks` | Get marks data |
| GET | `/marks/average` | Get average marks |
| GET | `/exams` | Get exam schedule |
| GET | `/clubs` | Get clubs list |
| GET | `/profile` | Get student profile |
| GET | `/notifications` | Get notifications |
| GET | `/events` | Get events |
| GET | `/analytics` | Get analytics data |
| GET | `/faqs` | Get FAQs |
| GET | `/notes` | Get notes |

### Request Examples

**Chat Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are my marks?"}'
```

**Response:**
```json
{
  "response": "Your latest marks are..."
}
```

---

## 🎨 Design System

### Colors
- **Primary**: #667eea → #764ba2 (Purple gradient)
- **Secondary**: #f093fb → #f5576c (Pink-Red gradient)
- **Success**: #4facfe → #00f2fe (Blue gradient)
- **Warning**: #fa709a → #fee140 (Orange gradient)
- **Dark**: #1a1a2e → #16213e (Dark gradient)

### Components

All components support:
- Glassmorphism effect with blur and transparency
- Hover animations
- Responsive design
- Dark theme colors

### Typography
- **Headlines**: Segoe UI / Apple System Font
- **Body**: -apple-system, BlinkMacSystemFont, Segoe UI
- **Monospace**: Courier New

---

## 📊 Data Format

### Attendance JSON
```json
{
  "students": [
    {
      "id": 1,
      "name": "Student Name",
      "subjects": [
        {
          "name": "Mathematics",
          "attended": 35,
          "total": 40,
          "percentage": 87.5
        }
      ]
    }
  ]
}
```

### Marks JSON
```json
{
  "data": {
    "mathematics": 85,
    "physics": 92,
    "chemistry": 78
  }
}
```

### Exams JSON
```json
{
  "exams": [
    {
      "subject": "Mathematics",
      "date": "15-02-2024",
      "time": "10:00 AM"
    }
  ]
}
```

---

## 🤖 AI Chatbot

The chatbot uses **Groq's Mixtral 8x7B** model for intelligent responses.

### Features
- Context-aware responses using student data
- Markdown formatting support
- Error handling for API failures
- Suggested questions for first-time users
- Real-time typing indicators

### Configuration
- Model: `mixtral-8x7b-32768`
- Temperature: 0.7
- Max Tokens: 512

To use your own API key, update in `backend/app.py`:
```python
client = Groq(api_key="your-api-key-here")
```

---

## 📱 Responsive Breakpoints

```css
Desktop (1024px+): Sidebar navigation, full charts
Tablet (768px-1023px): Adjusted layout, smaller charts
Mobile (320px-767px): Bottom navbar, stacked layout
```

---

## 🛠️ Development

### Adding New Features

1. **Create a new page component** in `frontend/src/pages/`
2. **Add API endpoint** in `backend/app.py`
3. **Update menu** in `frontend/src/App.jsx`
4. **Use reusable components** from `frontend/src/components/`

### Using Reusable Components

```jsx
import { StatCard, Card, Button, Badge } from './components';

<StatCard
  icon="📊"
  label="Attendance"
  value="95%"
  description="Overall attendance"
/>

<Card>
  <h3>Title</h3>
  <Button variant="primary">Click</Button>
</Card>
```

---

## 🔒 Security

- ✅ CORS middleware enabled
- ✅ Input validation via Pydantic
- ✅ Error handling prevents data leaks
- ✅ API key managed via environment (in production)
- ✅ No sensitive data in frontend

**For production:**
1. Move API key to environment variables
2. Add authentication/authorization
3. Enable HTTPS
4. Implement rate limiting
5. Add request logging

---

## 📈 Performance

- Fast initial load with Vite
- Lazy loading for pages
- Efficient data fetching
- Memoized components
- Optimized CSS with custom properties

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows
```

**Module not found:**
```bash
pip install fastapi uvicorn groq python-multipart
```

### Frontend Issues

**Dependencies not installed:**
```bash
npm install
```

**Port conflict:**
```bash
npm run dev -- --port 3000
```

### API Connection Issues

- Verify backend is running on `http://localhost:8000`
- Check CORS is enabled in FastAPI
- Verify JSON files exist in `backend/DataFolder/`
- Check Groq API key is valid

---

## 📚 Technologies Used

**Frontend:**
- React 19.2.5
- Vite 8.0.10
- Tailwind CSS 4.2.4
- Recharts 3.8.1
- Lucide React 1.14.0
- Framer Motion 12.38.0

**Backend:**
- FastAPI (Python)
- Uvicorn
- Groq Python SDK
- Pydantic

---

## 📄 License

This project is for educational purposes.

---

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and design patterns.

---

## 📧 Support

For issues, questions, or suggestions, please contact the development team.

---

## ✨ Future Enhancements

- [ ] User authentication & role-based access
- [ ] Real database integration (PostgreSQL)
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] File upload for notes and documents
- [ ] Integration with college APIs
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)
- [ ] Advanced search functionality

---

**Built with ❤️ for students and educators**
