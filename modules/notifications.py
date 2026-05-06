import customtkinter as ctk
import json
import os
from datetime import datetime
import winsound


# =============================
# FILE PATHS
# =============================

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

notifications_file = os.path.join(BASE_DIR, "DataFolder", "notifications.json")
sound_file = os.path.join(BASE_DIR, "DataFolder", "notification.wav")


# =============================
# LOAD / SAVE
# =============================

def load_notifications():
    try:
        with open(notifications_file, "r") as f:
            return json.load(f)
    except:
        return []

def save_notifications():
    with open(notifications_file, "w") as f:
        json.dump(notifications_data, f, indent=4)

notifications_data = load_notifications()


# =============================
# SOUND
# =============================

def play_notification_sound():
    try:
        if os.path.exists(sound_file):
            winsound.PlaySound(sound_file, winsound.SND_FILENAME | winsound.SND_ASYNC)
        else:
            winsound.Beep(1000, 200)
    except:
        pass


# =============================
# GLOBAL ADD
# =============================

def add_notification_global(message, priority="normal"):

    timestamp = datetime.now().strftime("%d-%m-%Y %I:%M %p")

    notifications_data.insert(0, {
        "message": message,
        "time": timestamp,
        "priority": priority
    })

    save_notifications()
    play_notification_sound()


# =============================
# UI CLASS
# =============================

class NotificationsUI(ctk.CTkFrame):

    def __init__(self, parent, user_role):

        super().__init__(parent)

        self.user_role = user_role
        self.pack(fill="both", expand=True)

        self.last_count = len(load_notifications())

        # =============================
        # HEADER
        # =============================

        header = ctk.CTkFrame(self)
        header.pack(fill="x", padx=10, pady=10)

        ctk.CTkLabel(
            header,
            text="🔔 Notifications",
            font=("Arial", 22, "bold")
        ).pack(side="left", padx=10)

        # CLEAR BUTTON
        ctk.CTkButton(
            header,
            text="Clear All",
            fg_color="red",
            command=self.clear_all
        ).pack(side="right", padx=10)

        # =============================
        # ADMIN PANEL
        # =============================

        if user_role == "admin":

            admin_frame = ctk.CTkFrame(self)
            admin_frame.pack(fill="x", padx=10, pady=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Normal",
                command=lambda: self.add_notification("normal")
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Important",
                fg_color="orange",
                command=lambda: self.add_notification("important")
            ).pack(side="left", padx=5)

        # =============================
        # SCROLL AREA
        # =============================

        self.display_frame = ctk.CTkScrollableFrame(self)
        self.display_frame.pack(fill="both", expand=True, padx=10, pady=10)

        self.refresh_notifications()

        self.check_new_notifications()

    # =============================
    # AUTO REFRESH
    # =============================

    def check_new_notifications(self):

        data = load_notifications()

        if len(data) > self.last_count:
            self.last_count = len(data)
            self.refresh_notifications()

        self.after(3000, self.check_new_notifications)

    # =============================
    # ADD
    # =============================

    def add_notification(self, priority):

        msg = ctk.CTkInputDialog(text="Enter Message").get_input()

        if msg:
            add_notification_global(msg, priority)
            self.refresh_notifications()

    # =============================
    # CLEAR ALL
    # =============================

    def clear_all(self):

        with open(notifications_file, "w") as f:
            json.dump([], f)

        self.refresh_notifications()

    # =============================
    # CARD UI
    # =============================

    def create_card(self, item):

        priority = item.get("priority", "normal")

        color = "#E5E7EB"
        border = None

        if priority == "important":
            color = "#FEF3C7"   # light yellow
            border = "orange"

        card = ctk.CTkFrame(
            self.display_frame,
            fg_color=color,
            corner_radius=12
        )

        card.pack(fill="x", pady=6, padx=5)

        # TIME
        ctk.CTkLabel(
            card,
            text=item["time"],
            text_color="gray",
            font=("Arial", 11)
        ).pack(anchor="w", padx=10, pady=(5, 0))

        # MESSAGE
        ctk.CTkLabel(
            card,
            text=item["message"],
            wraplength=600,
            font=("Arial", 13)
        ).pack(anchor="w", padx=10, pady=5)

        # TAG
        if priority == "important":
            ctk.CTkLabel(
                card,
                text="⚠ IMPORTANT",
                text_color="orange"
            ).pack(anchor="e", padx=10, pady=(0,5))

    # =============================
    # REFRESH
    # =============================

    def refresh_notifications(self):

        for widget in self.display_frame.winfo_children():
            widget.destroy()

        data = load_notifications()

        if not data:
            ctk.CTkLabel(
                self.display_frame,
                text="No Notifications Yet"
            ).pack(pady=20)
            return

        for item in data:
            self.create_card(item)