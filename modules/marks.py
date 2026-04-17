import customtkinter as ctk
import json
from tkinter import messagebox

FILE_PATH = "DataFolder/marks.json"


class MarksUI(ctk.CTkFrame):

    def __init__(self, parent):

        super().__init__(parent)

        # Important — ensures frame fills screen
        self.pack(fill="both", expand=True)

        self.marks_data = {}

        self.load_data()

        # =========================
        # TITLE
        # =========================

        title_label = ctk.CTkLabel(
            self,
            text="Marks Manager",
            font=("Arial", 22, "bold")
        )

        title_label.pack(pady=15)

        # =========================
        # INPUT FRAME
        # =========================

        input_frame = ctk.CTkFrame(self)

        input_frame.pack(pady=10)

        self.subject_entry = ctk.CTkEntry(
            input_frame,
            width=150,
            placeholder_text="Subject"
        )

        self.subject_entry.pack(
            side="left",
            padx=5
        )

        self.marks_entry = ctk.CTkEntry(
            input_frame,
            width=150,
            placeholder_text="Marks"
        )

        self.marks_entry.pack(
            side="left",
            padx=5
        )

        add_button = ctk.CTkButton(
            input_frame,
            text="Add Marks",
            command=self.add_marks
        )

        add_button.pack(
            side="left",
            padx=5
        )

        # =========================
        # BUTTON FRAME
        # =========================

        button_frame = ctk.CTkFrame(self)

        button_frame.pack(pady=10)

        report_button = ctk.CTkButton(
            button_frame,
            text="Show Report",
            command=self.show_report
        )

        report_button.pack(
            side="left",
            padx=5
        )

        gpa_button = ctk.CTkButton(
            button_frame,
            text="Calculate GPA",
            command=self.calculate_gpa
        )

        gpa_button.pack(
            side="left",
            padx=5
        )

        # =========================
        # DISPLAY BOX
        # =========================

        self.display_box = ctk.CTkTextbox(
            self,
            width=500,
            height=250
        )

        self.display_box.pack(
            pady=15,
            padx=10
        )

        self.refresh_display()

    # =========================

    def load_data(self):

        try:

            with open(
                FILE_PATH,
                "r"
            ) as f:

                self.marks_data = json.load(f)

        except:

            self.marks_data = {}

    # =========================

    def save_data(self):

        with open(
            FILE_PATH,
            "w"
        ) as f:

            json.dump(
                self.marks_data,
                f,
                indent=4
            )

    # =========================

    def add_marks(self):

        subject = self.subject_entry.get().lower()

        marks = self.marks_entry.get()

        if not subject or not marks:

            messagebox.showwarning(
                "Warning",
                "Enter subject and marks"
            )
            return

        try:

            marks = int(marks)

        except:

            messagebox.showwarning(
                "Warning",
                "Marks must be number"
            )
            return

        if subject not in self.marks_data:

            self.marks_data[subject] = []

        self.marks_data[subject].append(marks)

        self.save_data()

        self.subject_entry.delete(0, "end")

        self.marks_entry.delete(0, "end")

        self.refresh_display()

    # =========================

    def show_report(self):

        self.display_box.delete(
            "1.0",
            "end"
        )

        for subject in self.marks_data:

            marks_list = self.marks_data[subject]

            avg = sum(marks_list) / len(marks_list)

            self.display_box.insert(
                "end",
                f"{subject} → Average: {avg:.2f}\n"
            )

    # =========================

    def calculate_gpa(self):

        total_avg = 0

        subject_count = 0

        for subject in self.marks_data:

            marks_list = self.marks_data[subject]

            avg = sum(marks_list) / len(marks_list)

            total_avg += avg

            subject_count += 1

        if subject_count == 0:

            messagebox.showinfo(
                "GPA",
                "No marks available"
            )
            return

        overall_avg = total_avg / subject_count

        gpa = overall_avg / 10

        messagebox.showinfo(
            "GPA Result",
            f"Your GPA is: {gpa:.2f}"
        )

    # =========================

    def refresh_display(self):

        self.display_box.delete(
            "1.0",
            "end"
        )

        for subject in self.marks_data:

            marks_list = self.marks_data[subject]

            self.display_box.insert(
                "end",
                f"{subject}: {marks_list}\n"
            )