import customtkinter as ctk
from modules.attendance import AttendanceUI
from modules.marks import MarksUI
from modules.exams import ExamsUI
from modules.chatbot_ui import ChatbotUI


class DashboardLayout(ctk.CTkFrame):

    def __init__(self, parent, colors):
        super().__init__(parent)

        self.colors = colors

        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # SIDEBAR
        self.sidebar = ctk.CTkFrame(
            self,
            width=220,
            corner_radius=20,
            fg_color=colors["sidebar"]
        )
        self.sidebar.grid(row=0, column=0, sticky="ns", padx=10, pady=10)
        

        ctk.CTkLabel(
            self.sidebar,
            text="🎓 Dashboard",
            font=("Arial", 20, "bold")
        ).pack(pady=20)

        # BUTTONS
        self.add_btn("Chatbot", ChatbotUI)
        self.add_btn("Attendance", AttendanceUI)
        self.add_btn("Marks", MarksUI)
        self.add_btn("Exams", ExamsUI)

        # MAIN AREA
        self.main_frame = ctk.CTkFrame(
            self,
            fg_color=colors["card"],
            corner_radius=20
        )
        self.main_frame.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)

        self.show_page(ChatbotUI)

    def add_btn(self, name, page):
        ctk.CTkButton(
            self.sidebar,
            text=name,
            corner_radius=10,
            command=lambda: self.show_page(page)
        ).pack(fill="x", padx=15, pady=5)

    def show_page(self, page):
        for widget in self.main_frame.winfo_children():
            widget.destroy()

        page(self.main_frame).pack(fill="both", expand=True)