import customtkinter as ctk
import json
import os
import webbrowser
import winsound

# =============================
# FILE PATHS
# =============================

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

clubs_file = os.path.join(BASE_DIR, "DataFolder", "clubs.json")
events_file = os.path.join(BASE_DIR, "DataFolder", "events.json")
notifications_file = os.path.join(BASE_DIR, "DataFolder", "notifications.json")
sound_file = os.path.join(BASE_DIR, "DataFolder", "notification.wav")


# =============================
# LOAD / SAVE
# =============================

def load_clubs():
    try:
        with open(clubs_file, "r") as f:
            return json.load(f)
    except:
        return {}

def save_clubs():
    with open(clubs_file, "w") as f:
        json.dump(clubs_data, f, indent=4)

clubs_data = load_clubs()


# =============================
# CALENDAR + NOTIFICATIONS
# =============================

def add_event_to_calendar(date_str, event_text):

    if not os.path.exists(events_file):
        with open(events_file, "w") as f:
            json.dump({}, f)

    with open(events_file, "r") as f:
        data = json.load(f)

    data.setdefault(date_str, []).append(event_text)

    with open(events_file, "w") as f:
        json.dump(data, f, indent=4)


def add_notification(text):

    if not os.path.exists(notifications_file):
        with open(notifications_file, "w") as f:
            json.dump([], f)

    with open(notifications_file, "r") as f:
        data = json.load(f)

    data.append(text)

    with open(notifications_file, "w") as f:
        json.dump(data, f, indent=4)

    try:
        if os.path.exists(sound_file):
            winsound.PlaySound(sound_file, winsound.SND_FILENAME)
    except:
        pass


# =============================
# UI
# =============================

class ClubsUI(ctk.CTkFrame):

    def __init__(self, parent, user_role):
        super().__init__(parent)

        self.user_role = user_role
        self.pack(fill="both", expand=True)

        # HEADER
        ctk.CTkLabel(
            self,
            text="🎭 Clubs & Activities",
            font=("Arial", 24, "bold")
        ).pack(anchor="w", padx=20, pady=15)

        # ADMIN BAR
        if user_role == "admin":

            bar = ctk.CTkFrame(self)
            bar.pack(fill="x", padx=20, pady=10)

            ctk.CTkButton(bar, text="Add Club", command=self.add_club).pack(side="left", padx=5)
            ctk.CTkButton(bar, text="Add Event", command=self.add_event).pack(side="left", padx=5)

        # MAIN AREA
        self.container = ctk.CTkScrollableFrame(self)
        self.container.pack(fill="both", expand=True, padx=20, pady=10)

        self.refresh_clubs()

    # =============================
    # ADMIN
    # =============================

    def add_club(self):

        name = ctk.CTkInputDialog(text="Club Name").get_input()
        desc = ctk.CTkInputDialog(text="Description").get_input()
        pres = ctk.CTkInputDialog(text="President").get_input()
        contact = ctk.CTkInputDialog(text="Email").get_input()

        if name:
            clubs_data[name] = {
                "description": desc,
                "president": pres,
                "contact": contact,
                "events": []
            }
            save_clubs()
            self.refresh_clubs()

    def add_event(self):

        club = ctk.CTkInputDialog(text="Club").get_input()
        event = ctk.CTkInputDialog(text="Event Name").get_input()
        date = ctk.CTkInputDialog(text="Date (YYYY-M-D)").get_input()

        if club in clubs_data and event and date:

            clubs_data[club]["events"].append(f"{date} - {event}")
            save_clubs()

            add_event_to_calendar(date, f"{club}: {event}")
            add_notification(f"{club} Event on {date}: {event}")

            self.refresh_clubs()

    # =============================
    # UI CARDS
    # =============================

    def create_club_card(self, name, data):

        card = ctk.CTkFrame(self.container, corner_radius=15)
        card.pack(fill="x", pady=10)

        # Title
        ctk.CTkLabel(
            card,
            text=f"🎭 {name}",
            font=("Arial", 16, "bold")
        ).pack(anchor="w", padx=15, pady=(10, 0))

        # Description
        ctk.CTkLabel(
            card,
            text=data.get("description", ""),
            text_color="gray"
        ).pack(anchor="w", padx=15)

        # President
        ctk.CTkLabel(
            card,
            text=f"👤 {data.get('president', '')}"
        ).pack(anchor="w", padx=15, pady=2)

        # Buttons row
        btn_frame = ctk.CTkFrame(card, fg_color="transparent")
        btn_frame.pack(anchor="w", padx=15, pady=5)

        contact = data.get("contact", "")

        if contact:
            ctk.CTkButton(
                btn_frame,
                text="📧 Contact",
                command=lambda email=contact: webbrowser.open(f"mailto:{email}")
            ).pack(side="left", padx=5)

        # Fake join button (UI enhancement)
        ctk.CTkButton(
            btn_frame,
            text="Join",
            fg_color="#22C55E"
        ).pack(side="left", padx=5)

        # Events
        events = data.get("events", [])

        if events:

            ctk.CTkLabel(
                card,
                text="📅 Events",
                font=("Arial", 14, "bold")
            ).pack(anchor="w", padx=15, pady=(5, 0))

            for e in events:
                ctk.CTkLabel(
                    card,
                    text=f"• {e}"
                ).pack(anchor="w", padx=25)

    # =============================
    # REFRESH
    # =============================

    def refresh_clubs(self):

        for w in self.container.winfo_children():
            w.destroy()

        if not clubs_data:
            ctk.CTkLabel(self.container, text="No clubs available").pack(pady=20)
            return

        for name, data in clubs_data.items():
            self.create_club_card(name, data)