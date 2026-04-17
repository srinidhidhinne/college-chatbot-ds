import customtkinter as ctk
import json
import os
import webbrowser
import winsound   # 🔊 sound module (Windows)

# =============================
# FILE PATHS
# =============================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

clubs_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "clubs.json"
)

events_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "events.json"
)

notifications_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "notifications.json"
)

sound_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "notification.wav"
)

# =============================
# LOAD / SAVE CLUBS
# =============================

def load_clubs():

    try:

        with open(clubs_file, "r") as f:

            data = json.load(f)

            if not isinstance(data, dict):
                return {}

            return data

    except:

        return {}


def save_clubs():

    with open(clubs_file, "w") as f:

        json.dump(
            clubs_data,
            f,
            indent=4
        )


clubs_data = load_clubs()

# =============================
# CALENDAR SAVE
# =============================

def add_event_to_calendar(date_str, event_text):

    if not os.path.exists(events_file):

        with open(events_file, "w") as f:
            json.dump({}, f)

    with open(events_file, "r") as f:

        data = json.load(f)

    if date_str not in data:

        data[date_str] = []

    data[date_str].append(event_text)

    with open(events_file, "w") as f:

        json.dump(data, f, indent=4)


# =============================
# NOTIFICATION SAVE + SOUND
# =============================

def add_notification(text):

    if not os.path.exists(notifications_file):

        with open(notifications_file, "w") as f:
            json.dump([], f)

    with open(notifications_file, "r") as f:

        data = json.load(f)

    data.append(text)

    with open(notifications_file, "w") as f:

        json.dump(data, f, indent=4)

    # 🔊 Play sound
    try:

        if os.path.exists(sound_file):

            winsound.PlaySound(
                sound_file,
                winsound.SND_FILENAME
            )

    except Exception as e:

        print("Sound error:", e)


# =============================
# CLUBS UI
# =============================

class ClubsUI(ctk.CTkFrame):

    def __init__(self, parent, user_role):

        super().__init__(parent)

        self.user_role = user_role

        self.pack(fill="both", expand=True)

        # TITLE

        ctk.CTkLabel(
            self,
            text="🎭 College Clubs",
            font=("Arial", 22, "bold")
        ).pack(pady=10)

        # ADMIN BUTTONS

        if user_role == "admin":

            admin_frame = ctk.CTkFrame(self)
            admin_frame.pack(pady=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Club",
                command=self.add_club
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Event",
                command=self.add_event
            ).pack(side="left", padx=5)

        # DISPLAY FRAME

        self.display_frame = ctk.CTkScrollableFrame(
            self,
            width=600,
            height=400
        )

        self.display_frame.pack(
            fill="both",
            expand=True,
            pady=10
        )

        self.refresh_clubs()

    # =============================

    def add_club(self):

        name = ctk.CTkInputDialog(
            text="Enter Club Name:"
        ).get_input()

        description = ctk.CTkInputDialog(
            text="Enter Club Description:"
        ).get_input()

        president = ctk.CTkInputDialog(
            text="Enter President Name:"
        ).get_input()

        contact = ctk.CTkInputDialog(
            text="Enter Contact Email:"
        ).get_input()

        if name:

            clubs_data[name] = {

                "description": description,
                "president": president,
                "contact": contact,
                "events": []

            }

            save_clubs()

            self.refresh_clubs()

    # =============================

    def add_event(self):

        club = ctk.CTkInputDialog(
            text="Enter Club Name:"
        ).get_input()

        event = ctk.CTkInputDialog(
            text="Enter Event Name:"
        ).get_input()

        date = ctk.CTkInputDialog(
            text="Enter Event Date (YYYY-M-D):"
        ).get_input()

        if club in clubs_data and event and date:

            # Save inside club

            clubs_data[club]["events"].append(
                f"{date} - {event}"
            )

            save_clubs()

            # Save inside calendar

            calendar_text = (
                f"{club}: {event}"
            )

            add_event_to_calendar(
                date,
                calendar_text
            )

            # Add notification

            notification_text = (
                f"{club} Event on {date}: {event}"
            )

            add_notification(
                notification_text
            )

            self.refresh_clubs()

    # =============================

    def refresh_clubs(self):

        for widget in self.display_frame.winfo_children():
            widget.destroy()

        if not clubs_data:

            ctk.CTkLabel(
                self.display_frame,
                text="No clubs available."
            ).pack()

            return

        for club in clubs_data:

            data = clubs_data[club]

            club_frame = ctk.CTkFrame(
                self.display_frame,
                corner_radius=10
            )

            club_frame.pack(
                fill="x",
                pady=5,
                padx=10
            )

            ctk.CTkLabel(
                club_frame,
                text=f"🎭 {club}",
                font=("Arial", 16, "bold")
            ).pack(anchor="w", padx=10, pady=2)

            ctk.CTkLabel(
                club_frame,
                text=f"📖 {data.get('description','')}"
            ).pack(anchor="w", padx=20)

            ctk.CTkLabel(
                club_frame,
                text=f"👤 President: {data.get('president','')}"
            ).pack(anchor="w", padx=20)

            contact = data.get("contact","")

            if contact:

                ctk.CTkButton(
                    club_frame,
                    text="📧 Contact",
                    width=120,
                    command=lambda email=contact:
                    webbrowser.open(
                        f"mailto:{email}"
                    )
                ).pack(anchor="w", padx=20, pady=2)

            events = data.get("events", [])

            if events:

                ctk.CTkLabel(
                    club_frame,
                    text="📅 Events:",
                    font=("Arial", 14)
                ).pack(anchor="w", padx=20)

                for e in events:

                    ctk.CTkLabel(
                        club_frame,
                        text=f"• {e}"
                    ).pack(anchor="w", padx=40)