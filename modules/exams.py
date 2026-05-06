import customtkinter as ctk
import json

FILE_PATH = "backend/DataFolder/exams.json"


class ExamsUI(ctk.CTkFrame):

    def __init__(self, parent):
        super().__init__(parent)

        self.pack(fill="both", expand=True)

        ctk.CTkLabel(
            self,
            text="📅 Exams",
            font=("Arial", 24, "bold")
        ).pack(anchor="w", padx=20, pady=10)

        self.container = ctk.CTkScrollableFrame(self)
        self.container.pack(fill="both", expand=True, padx=20)

        self.load_data()

    def load_data(self):
        try:
            with open(FILE_PATH) as f:
                data = json.load(f)
        except:
            data = []

        for exam in data:

            card = ctk.CTkFrame(self.container, fg_color="#ffffff10", corner_radius=15)
            card.pack(fill="x", pady=10)

            ctk.CTkLabel(card, text=exam["subject"]).pack(anchor="w", padx=10)
            ctk.CTkLabel(card, text=exam["date"]).pack(anchor="w", padx=10)