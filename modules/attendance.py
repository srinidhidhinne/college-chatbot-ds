import customtkinter as ctk
import json
from tkinter import messagebox

FILE_PATH = "DataFolder/attendance.json"


class AttendanceUI(ctk.CTkFrame):

    def __init__(self, parent):

        super().__init__(parent)

        self.attendance_data = {}

        self.load_data()

        # =========================
        # TITLE
        # =========================

        ctk.CTkLabel(
            self,
            text="Attendance Tracker",
            font=("Arial", 20, "bold")
        ).pack(pady=10)

        # =========================
        # ADD SUBJECT
        # =========================

        input_frame = ctk.CTkFrame(self)
        input_frame.pack(pady=10)

        self.subject_entry = ctk.CTkEntry(
            input_frame,
            placeholder_text="Enter Subject"
        )
        self.subject_entry.pack(
            side="left",
            padx=5
        )

        ctk.CTkButton(
            input_frame,
            text="Add Subject",
            command=self.add_subject
        ).pack(
            side="left",
            padx=5
        )

        # =========================
        # SUBJECT LIST
        # =========================

        self.subject_list = ctk.CTkTextbox(
            self,
            width=300,
            height=120
        )

        self.subject_list.pack(pady=10)

        # =========================
        # BUTTONS
        # =========================

        button_frame = ctk.CTkFrame(self)
        button_frame.pack(pady=10)

        ctk.CTkButton(
            button_frame,
            text="Mark Present",
            fg_color="green",
            command=self.mark_present
        ).pack(
            side="left",
            padx=5
        )

        ctk.CTkButton(
            button_frame,
            text="Mark Absent",
            fg_color="red",
            command=self.mark_absent
        ).pack(
            side="left",
            padx=5
        )

        ctk.CTkButton(
            button_frame,
            text="Show Report",
            command=self.show_report
        ).pack(
            side="left",
            padx=5
        )

        # =========================
        # DISPLAY AREA
        # =========================

        self.display_box = ctk.CTkTextbox(
            self,
            width=500,
            height=200
        )

        self.display_box.pack(pady=10)

        self.selected_subject = None

        self.refresh_display()

    # =========================

    def load_data(self):

        try:

            with open(FILE_PATH, "r") as f:

                self.attendance_data = json.load(f)

        except:

            self.attendance_data = {}

    # =========================

    def save_data(self):

        with open(FILE_PATH, "w") as f:

            json.dump(
                self.attendance_data,
                f,
                indent=4
            )

    # =========================

    def add_subject(self):

        subject = self.subject_entry.get().lower()

        if not subject:

            messagebox.showwarning(
                "Warning",
                "Enter subject name"
            )
            return

        if subject not in self.attendance_data:

            self.attendance_data[subject] = {
                "present": 0,
                "total": 0
            }

            self.save_data()

            self.refresh_display()

        self.subject_entry.delete(0, "end")

    # =========================

    def get_selected_subject(self):

        subject = self.subject_entry.get().lower()

        if subject not in self.attendance_data:

            messagebox.showwarning(
                "Warning",
                "Enter valid subject name"
            )
            return None

        return subject

    # =========================

    def mark_present(self):

        subject = self.get_selected_subject()

        if not subject:
            return

        self.attendance_data[subject]["present"] += 1
        self.attendance_data[subject]["total"] += 1

        self.save_data()

        self.refresh_display()

    # =========================

    def mark_absent(self):

        subject = self.get_selected_subject()

        if not subject:
            return

        self.attendance_data[subject]["total"] += 1

        self.save_data()

        self.refresh_display()

    # =========================

    def show_report(self):

        self.display_box.delete("1.0", "end")

        for subject in self.attendance_data:

            present = self.attendance_data[
                subject
            ]["present"]

            total = self.attendance_data[
                subject
            ]["total"]

            percent = 0

            if total > 0:

                percent = (
                    present / total
                ) * 100

            warning = ""

            if percent < 75:

                warning = " ⚠ Low Attendance"

            self.display_box.insert(
                "end",
                f"{subject} → "
                f"{percent:.2f}%"
                f"{warning}\n"
            )

    # =========================

    def refresh_display(self):

        self.subject_list.delete(
            "1.0",
            "end"
        )

        self.display_box.delete(
            "1.0",
            "end"
        )

        for subject in self.attendance_data:

            data = self.attendance_data[subject]

            self.subject_list.insert(
                "end",
                f"{subject}: "
                f"{data['present']}/"
                f"{data['total']}\n"
            )