import customtkinter as ctk
import sys

# =========================
# IMPORT MODULES
# =========================

from modules.chatbot_ui import ChatbotUI
from modules.attendance import AttendanceUI
from modules.marks import MarksUI
from modules.exams import ExamsUI
from modules.notes import NotesUI
from modules.clubs import ClubsUI
from modules.notifications import NotificationsUI
from modules.calendar_ui import CalendarUI
from modules.profile import ProfileUI   # NEW


# =========================
# THEME
# =========================

ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")


# =========================
# USER ROLE
# =========================

user_role = "user"

if len(sys.argv) > 1:
    user_role = sys.argv[1].lower()

print("Running as:", user_role)


# =========================
# MAIN WINDOW
# =========================

class Dashboard(ctk.CTk):

    def __init__(self):

        super().__init__()

        self.user_role = user_role

        self.title(
            f"College Assistant Dashboard ({self.user_role.upper()})"
        )

        self.geometry("1100x650")

        # =========================
        # SIDEBAR
        # =========================

        self.sidebar = ctk.CTkFrame(
            self,
            width=220,
            corner_radius=0
        )

        self.sidebar.pack(
            side="left",
            fill="y"
        )

        # Title

        ctk.CTkLabel(
            self.sidebar,
            text="College Assistant",
            font=("Arial", 18, "bold")
        ).pack(pady=20)

        # =========================
        # SIDEBAR BUTTONS
        # =========================

        self.create_sidebar_button(
            "🤖 Chatbot",
            self.show_chatbot
        )

        self.create_sidebar_button(
            "📅 Attendance",
            self.show_attendance
        )

        self.create_sidebar_button(
            "📊 Marks",
            self.show_marks
        )

        self.create_sidebar_button(
            "📢 Exams",
            self.show_exams
        )

        self.create_sidebar_button(
            "📚 Notes",
            self.show_notes
        )

        self.create_sidebar_button(
            "🎭 Clubs",
            self.show_clubs
        )

        self.create_sidebar_button(
            "🔔 Notifications",
            self.show_notifications
        )

        self.create_sidebar_button(
            "📅 Calendar",
            self.show_calendar
        )

        # =========================
        # NEW PROFILE BUTTON
        # =========================

        self.create_sidebar_button(
            "👤 Profile",
            self.show_profile
        )

        # =========================
        # MAIN FRAME
        # =========================

        self.main_frame = ctk.CTkFrame(self)

        self.main_frame.pack(
            side="right",
            fill="both",
            expand=True
        )

        self.current_frame = None

        # Default page

        self.show_chatbot()

    # =========================
    # CREATE BUTTON
    # =========================

    def create_sidebar_button(
        self,
        text,
        command
    ):

        ctk.CTkButton(
            self.sidebar,
            text=text,
            width=200,
            command=command
        ).pack(pady=6)

    # =========================
    # CLEAR FRAME
    # =========================

    def clear_main_frame(self):

        if self.current_frame:

            self.current_frame.destroy()

    # =========================
    # PAGE SWITCHING
    # =========================

    def show_chatbot(self):

        self.clear_main_frame()

        self.current_frame = ChatbotUI(
            self.main_frame,
            self.user_role
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================

    def show_attendance(self):

        self.clear_main_frame()

        self.current_frame = AttendanceUI(
            self.main_frame
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================

    def show_marks(self):

        self.clear_main_frame()

        self.current_frame = MarksUI(
            self.main_frame
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================

    def show_exams(self):

        self.clear_main_frame()

        self.current_frame = ExamsUI(
            self.main_frame
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================

    def show_notes(self):

        self.clear_main_frame()

        self.current_frame = NotesUI(
            self.main_frame,
            self.user_role
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================

    def show_clubs(self):

        self.clear_main_frame()

        self.current_frame = ClubsUI(
            self.main_frame,
            self.user_role
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================

    def show_notifications(self):

        self.clear_main_frame()

        self.current_frame = NotificationsUI(
            self.main_frame,
            self.user_role
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================

    def show_calendar(self):

        self.clear_main_frame()

        self.current_frame = CalendarUI(
            self.main_frame
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )

    # =========================
    # NEW PROFILE FUNCTION
    # =========================

    def show_profile(self):

        self.clear_main_frame()

        self.current_frame = ProfileUI(
            self.main_frame
        )

        self.current_frame.pack(
            fill="both",
            expand=True
        )


# =========================
# RUN APP
# =========================

app = Dashboard()

app.mainloop()