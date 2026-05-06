# Reusable Components

This directory contains reusable React components for the College Chatbot Dashboard.

## Components

### StatCard
A component for displaying statistics with an icon, label, value, and description.

```jsx
import { StatCard } from './components';

<StatCard
  icon="📊"
  label="Attendance"
  value="95%"
  description="Overall attendance rate"
/>
```

**Props:**
- `icon`: Icon emoji or text
- `label`: Card label
- `value`: Main value to display
- `description`: Optional description text
- `onClick`: Optional click handler
- `style`: Optional style object

---

### Card
A wrapper component for creating glass-morphism cards.

```jsx
import { Card } from './components';

<Card variant="glass">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

**Props:**
- `children`: Card content
- `className`: Additional CSS classes (default: 'glass')
- `style`: Optional style object

---

### Button
A button component with multiple variants and sizes.

```jsx
import { Button } from './components';

<Button variant="primary" size="md">
  Click me
</Button>
```

**Props:**
- `children`: Button text/content
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `className`: Additional CSS classes
- `style`: Optional style object

---

### Badge
A badge component for tags and labels.

```jsx
import { Badge } from './components';

<Badge variant="success">Active</Badge>
```

**Props:**
- `children`: Badge text
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
- `style`: Optional style object

---

### NotificationItem
A component for displaying individual notifications.

```jsx
import { NotificationItem } from './components';
import { Bell } from 'lucide-react';

<NotificationItem
  icon={Bell}
  title="Assignment Due"
  message="Your assignment is due tomorrow"
  timestamp="2 hours ago"
  type="alert"
  isRead={false}
  onDelete={() => handleDelete()}
/>
```

**Props:**
- `icon`: Lucide icon component
- `title`: Notification title
- `message`: Notification message
- `timestamp`: Optional timestamp text
- `type`: 'alert' | 'success' | 'exam' | 'assignment' | 'info'
- `isRead`: Boolean indicating if read
- `onDelete`: Optional delete callback
- `style`: Optional style object

---

### ProgressBar
A component for displaying progress.

```jsx
import { ProgressBar } from './components';

<ProgressBar
  value={75}
  max={100}
  label="Attendance"
  variant="success"
  showPercentage={true}
/>
```

**Props:**
- `value`: Current value
- `max`: Maximum value (default: 100)
- `variant`: 'primary' | 'success' | 'warning' | 'danger'
- `label`: Optional label text
- `showPercentage`: Show percentage (default: true)
- `style`: Optional style object

---

### DataTable
A component for displaying tabular data.

```jsx
import { DataTable } from './components';

<DataTable
  headers={['Name', 'Marks', 'Grade']}
  rows={[
    ['Math', '85', 'A'],
    ['Physics', '92', 'A+'],
    ['Chemistry', '78', 'B+'],
  ]}
/>
```

**Props:**
- `headers`: Array of header names
- `rows`: Array of arrays containing row data
- `className`: Additional CSS classes (default: 'glass')
- `style`: Optional style object

---

## Usage

Import components from the index file:

```jsx
import { StatCard, Card, Button, Badge, NotificationItem, ProgressBar, DataTable } from './components';
```

Or import individually:

```jsx
import StatCard from './components/StatCard';
import Button from './components/Button';
```

---

## CSS Classes

All components use CSS classes defined in `src/index.css`. Make sure to include the CSS file in your application.

Key classes:
- `.stat-card`: Container for stat cards
- `.card`: Base card styling
- `.btn`: Base button styling
- `.badge`: Badge styling
- `.progress`: Progress bar styling
