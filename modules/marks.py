import customtkinter as ctk
import json

FILE_PATH = "backend/DataFolder/marks.json"


class MarksUI(ctk.CTkFrame):

    def __init__(self, parent):
        super().__init__(parent)

        self.pack(fill="both", expand=True)

        ctk.CTkLabel(
            self,
            text="📈 Marks",
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
            data = {}

        for sub, marks in data.items():

            avg = sum(marks) / len(marks)

            card = ctk.CTkFrame(self.container, fg_color="#ffffff10", corner_radius=15)
            card.pack(fill="x", pady=10)

            ctk.CTkLabel(card, text=sub.upper()).pack(anchor="w", padx=10)

            ctk.CTkLabel(card, text=f"{avg:.1f}%").pack(anchor="w", padx=10)

            bar = ctk.CTkProgressBar(card)
            bar.pack(fill="x", padx=10, pady=5)
            bar.set(avg / 100)