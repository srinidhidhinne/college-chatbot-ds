import {

  Users,
  BookOpen,
  CalendarCheck,
  BarChart3,

} from "lucide-react";

function StatsCards() {

  const stats = [

    {
      title: "Total Students",
      value: "1,240",
      icon: <Users size={26} />,
      color: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    },

    {
      title: "Notes Available",
      value: "86",
      icon: <BookOpen size={26} />,
      color: "linear-gradient(135deg,#06b6d4,#2563eb)",
    },

    {
      title: "Attendance Avg",
      value: "85%",
      icon: <CalendarCheck size={26} />,
      color: "linear-gradient(135deg,#22c55e,#16a34a)",
    },

    {
      title: "Overall Performance",
      value: "8.7 CGPA",
      icon: <BarChart3 size={26} />,
      color: "linear-gradient(135deg,#f97316,#ef4444)",
    },

  ];

  return (

    <div className="cards">

      {stats.map((item, index) => (

        <div

          key={index}

          className="card"

          style={{
            border: "1px solid rgba(255,255,255,0.08)"
          }}

        >

          {/* ICON */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: item.color,
              marginBottom: "16px",
              color: "white"
            }}
          >
            {item.icon}
          </div>

          {/* TITLE */}
          <div className="card-title">
            {item.title}
          </div>

          {/* VALUE */}
          <div className="card-value">
            {item.value}
          </div>

        </div>

      ))}

    </div>

  );
}

export default StatsCards;