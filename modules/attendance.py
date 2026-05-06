import customtkinter as ctk
import json

FILE_PATH = "backend/DataFolder/attendance.json"


class AttendanceUI(ctk.CTkFrame):

    def __init__(self, parent):
        super().__init__(parent)

        self.pack(fill="both", expand=True)

        ctk.CTkLabel(
            self,
            text="📊 Attendance",
            font=("Arial", 24, "bold")
        ).pack(anchor="w", padx=20, pady=10)

        self.container = ctk.CTkScrollableFrame(self)
        self.container.pack(fill="both", expand=True, padx=20)

        self.load_data()

    def load_data(self):
        try:
            with open(FILE_PATH) as f:
                data = json.load(f)["subjects"]
        except:
            data = []

        for sub in data:

            percent = sub["percentage"]

            card = ctk.CTkFrame(
                self.container,
                fg_color="#ffffff10",
                corner_radius=15
            )
            card.pack(fill="x", pady=10)

            ctk.CTkLabel(card, text=sub["name"], font=("Arial", 16)).pack(anchor="w", padx=10)

            ctk.CTkLabel(
                card,
                text=f"{percent}%",
                text_color="green" if percent >= 75 else "red"
            ).pack(anchor="w", padx=10)

            bar = ctk.CTkProgressBar(card)
            bar.pack(fill="x", padx=10, pady=5)
            bar.set(percent / 100)