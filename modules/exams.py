import customtkinter as ctk
import json
from tkinter import messagebox
import sys

FILE_PATH = "DataFolder/exams.json"


# Detect role
if len(sys.argv) > 1:
    user_role = sys.argv[1].lower()
else:
    user_role = "user"


class ExamsUI(ctk.CTkFrame):

    def __init__(self, parent):

        super().__init__(parent)

        self.pack(fill="both", expand=True)

        self.exam_data = {}

        self.load_data()

        # =========================
        # TITLE
        # =========================

        title = ctk.CTkLabel(
            self,
            text="Exam Manager",
            font=("Arial", 22, "bold")
        )

        title.pack(pady=10)

        # =========================
        # ADMIN INPUT
        # =========================

        if user_role == "admin":

            input_frame = ctk.CTkFrame(self)

            input_frame.pack(pady=10)

            self.subject_entry = ctk.CTkEntry(
                input_frame,
                placeholder_text="Subject"
            )

            self.subject_entry.pack(
                side="left",
                padx=5
            )

            self.date_entry = ctk.CTkEntry(
                input_frame,
                placeholder_text="Date (DD-MM)"
            )

            self.date_entry.pack(
                side="left",
                padx=5
            )

            add_btn = ctk.CTkButton(
                input_frame,
                text="Add Exam",
                command=self.add_exam
            )

            add_btn.pack(
                side="left",
                padx=5
            )

        # =========================
        # DISPLAY BOX
        # =========================

        self.display_box = ctk.CTkTextbox(
            self,
            width=500,
            height=300
        )

        self.display_box.pack(
            pady=10,
            padx=10
        )

        # =========================
        # DELETE BUTTON (ADMIN)
        # =========================

        if user_role == "admin":

            delete_btn = ctk.CTkButton(
                self,
                text="Delete Last Exam",
                fg_color="red",
                command=self.delete_exam
            )

            delete_btn.pack(pady=5)

        self.refresh_display()

    # =========================

    def load_data(self):

        try:

            with open(FILE_PATH, "r") as f:

                self.exam_data = json.load(f)

        except:

            self.exam_data = {}

    # =========================

    def save_data(self):

        with open(FILE_PATH, "w") as f:

            json.dump(
                self.exam_data,
                f,
                indent=4
            )

    # =========================

    def add_exam(self):

        subject = self.subject_entry.get()
        date = self.date_entry.get()

        if not subject or not date:

            messagebox.showwarning(
                "Warning",
                "Enter subject and date"
            )
            return

        self.exam_data[subject] = date

        self.save_data()

        self.subject_entry.delete(0, "end")
        self.date_entry.delete(0, "end")

        self.refresh_display()

    # =========================

    def delete_exam(self):

        if not self.exam_data:

            messagebox.showinfo(
                "Info",
                "No exams to delete"
            )
            return

        last_key = list(
            self.exam_data.keys()
        )[-1]

        del self.exam_data[last_key]

        self.save_data()

        self.refresh_display()

    # =========================

    def refresh_display(self):

        self.display_box.delete(
            "1.0",
            "end"
        )

        if not self.exam_data:

            self.display_box.insert(
                "end",
                "No Exams Scheduled\n"
            )

            return

        for subject in self.exam_data:

            date = self.exam_data[subject]

            self.display_box.insert(
                "end",
                f"{subject} → {date}\n"
            )