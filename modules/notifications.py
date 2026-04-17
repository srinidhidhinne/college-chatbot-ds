import customtkinter as ctk
import json
import os
from datetime import datetime
import winsound


# =============================
# FILE PATHS
# =============================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
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
# LOAD / SAVE
# =============================

def load_notifications():

    try:

        with open(notifications_file, "r") as f:

            data = json.load(f)

            if not isinstance(data, list):
                return []

            return data

    except:

        return []


def save_notifications():

    with open(notifications_file, "w") as f:

        json.dump(
            notifications_data,
            f,
            indent=4
        )


notifications_data = load_notifications()


# =============================
# SOUND
# =============================

def play_notification_sound():

    try:

        if os.path.exists(sound_file):

            winsound.PlaySound(
                sound_file,
                winsound.SND_FILENAME | winsound.SND_ASYNC
            )

        else:

            winsound.Beep(1000, 300)

    except Exception as e:

        print("Sound error:", e)


# =============================
# POPUP
# =============================

def show_popup(message):

    popup = ctk.CTkToplevel()

    popup.title("🔔 New Notification")

    popup.geometry("320x150")

    popup.attributes("-topmost", True)

    ctk.CTkLabel(
        popup,
        text="🔔 New Notification",
        font=("Arial", 16, "bold")
    ).pack(pady=10)

    ctk.CTkLabel(
        popup,
        text=message,
        wraplength=280
    ).pack(pady=5)

    ctk.CTkButton(
        popup,
        text="OK",
        command=popup.destroy
    ).pack(pady=10)


# =============================
# GLOBAL ADD
# =============================

def add_notification_global(message):

    timestamp = datetime.now().strftime(
        "%d-%m-%Y %I:%M %p"
    )

    notifications_data.insert(0, {

        "message": message,
        "time": timestamp

    })

    save_notifications()

    play_notification_sound()

    try:
        show_popup(message)
    except:
        pass


# =============================
# UI CLASS
# =============================

class NotificationsUI(ctk.CTkFrame):

    def __init__(self, parent, user_role):

        super().__init__(parent)

        self.user_role = user_role

        self.pack(fill="both", expand=True)

        self.last_count = len(load_notifications())

        # TITLE

        ctk.CTkLabel(
            self,
            text="🔔 College Notifications",
            font=("Arial", 22, "bold")
        ).pack(pady=10)

        # ADMIN BUTTONS

        if user_role == "admin":

            admin_frame = ctk.CTkFrame(self)
            admin_frame.pack(pady=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Notification",
                command=self.add_notification
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                admin_frame,
                text="Delete Notification",
                command=self.delete_notification_window
            ).pack(side="left", padx=5)

        # DISPLAY

        self.display_frame = ctk.CTkScrollableFrame(
            self,
            width=700,
            height=450
        )

        self.display_frame.pack(
            fill="both",
            expand=True,
            padx=10,
            pady=10
        )

        self.refresh_notifications()

        # 🔁 Start auto-check

        self.check_new_notifications()


    # =============================

    def check_new_notifications(self):

        data = load_notifications()

        if len(data) > self.last_count:

            new_items = data[:len(data)-self.last_count]

            for item in new_items:

                play_notification_sound()

                show_popup(
                    item["message"]
                )

            self.last_count = len(data)

            self.refresh_notifications()

        self.after(3000, self.check_new_notifications)


    # =============================

    def add_notification(self):

        message = ctk.CTkInputDialog(
            text="Enter Notification Message:"
        ).get_input()

        if message:

            add_notification_global(message)

            self.refresh_notifications()


    # =============================

    def delete_notification_window(self):

        window = ctk.CTkToplevel(self)

        window.title("Delete Notification")

        window.geometry("400x400")

        scroll = ctk.CTkScrollableFrame(window)

        scroll.pack(
            fill="both",
            expand=True,
            padx=10,
            pady=10
        )

        data = load_notifications()

        for i, item in enumerate(data):

            text = f"{item['time']} - {item['message']}"

            ctk.CTkButton(
                scroll,
                text=text,
                command=lambda index=i:
                self.delete_notification(index, window)
            ).pack(fill="x", pady=3)


    # =============================

    def delete_notification(self, index, window):

        data = load_notifications()

        if 0 <= index < len(data):

            del data[index]

            with open(notifications_file, "w") as f:

                json.dump(data, f, indent=4)

            window.destroy()

            self.refresh_notifications()


    # =============================

    def refresh_notifications(self):

        for widget in self.display_frame.winfo_children():
            widget.destroy()

        data = load_notifications()

        if not data:

            ctk.CTkLabel(
                self.display_frame,
                text="No Notifications Yet"
            ).pack()

            return

        for item in data:

            card = ctk.CTkFrame(
                self.display_frame
            )

            card.pack(
                fill="x",
                pady=5,
                padx=5
            )

            ctk.CTkLabel(
                card,
                text=item["time"],
                text_color="gray"
            ).pack(anchor="w", padx=10)

            ctk.CTkLabel(
                card,
                text=item["message"],
                wraplength=600
            ).pack(anchor="w", padx=10, pady=5)