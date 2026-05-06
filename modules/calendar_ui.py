import customtkinter as ctk
import calendar
import json
import os
from datetime import datetime

DATA_FILE = "DataFolder/events.json"


class CalendarUI(ctk.CTkFrame):

    def __init__(self, parent):

        super().__init__(parent)

        self.pack(fill="both", expand=True)

        self.current_date = datetime.now()
        self.selected_day = None

        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, "w") as f:
                json.dump({}, f)

        # =========================
        # MAIN LAYOUT (2 COLUMN)
        # =========================

        main_frame = ctk.CTkFrame(self)
        main_frame.pack(fill="both", expand=True, padx=10, pady=10)

        self.left_frame = ctk.CTkFrame(main_frame)
        self.left_frame.pack(side="left", fill="both", expand=True)

        self.right_frame = ctk.CTkFrame(main_frame, width=300)
        self.right_frame.pack(side="right", fill="y", padx=10)

        # =========================
        # HEADER
        # =========================

        header = ctk.CTkFrame(self.left_frame)
        header.pack(pady=10)

        ctk.CTkButton(header, text="<", width=40, command=self.prev_month).pack(side="left")

        self.month_label = ctk.CTkLabel(
            header,
            text="",
            font=("Arial", 20, "bold")
        )
        self.month_label.pack(side="left", padx=20)

        ctk.CTkButton(header, text=">", width=40, command=self.next_month).pack(side="left")

        # =========================
        # CALENDAR GRID
        # =========================

        self.calendar_frame = ctk.CTkFrame(self.left_frame)
        self.calendar_frame.pack(pady=10)

        # =========================
        # RIGHT PANEL (EVENTS)
        # =========================

        ctk.CTkLabel(
            self.right_frame,
            text="📅 Events",
            font=("Arial", 18, "bold")
        ).pack(pady=10)

        self.event_text = ctk.CTkTextbox(self.right_frame, height=200)
        self.event_text.pack(fill="x", padx=10, pady=10)

        btn_frame = ctk.CTkFrame(self.right_frame)
        btn_frame.pack(pady=5)

        ctk.CTkButton(btn_frame, text="Add", command=self.add_event).pack(side="left", padx=5)
        ctk.CTkButton(btn_frame, text="Edit", command=self.edit_event).pack(side="left", padx=5)
        ctk.CTkButton(btn_frame, text="Delete", fg_color="red", command=self.delete_event).pack(side="left", padx=5)

        self.draw_calendar()

    # =========================

    def load_data(self):
        with open(DATA_FILE, "r") as f:
            return json.load(f)

    def save_data(self, data):
        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=4)

    # =========================

    def draw_calendar(self):

        for widget in self.calendar_frame.winfo_children():
            widget.destroy()

        year = self.current_date.year
        month = self.current_date.month

        self.month_label.configure(text=f"{calendar.month_name[month]} {year}")

        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

        for col, day in enumerate(days):
            ctk.CTkLabel(self.calendar_frame, text=day).grid(row=0, column=col, pady=5)

        cal = calendar.monthcalendar(year, month)
        data = self.load_data()

        for row, week in enumerate(cal):
            for col, day in enumerate(week):

                if day == 0:
                    continue

                date_str = f"{year}-{month}-{day}"

                has_event = date_str in data

                btn = ctk.CTkButton(
                    self.calendar_frame,
                    text=str(day),
                    width=45,
                    height=45,
                    corner_radius=10,
                    fg_color="#3B82F6" if self.selected_day == day else None,
                    command=lambda d=day: self.select_day(d)
                )

                btn.grid(row=row + 1, column=col, padx=6, pady=6)

                # small dot for events
                if has_event:
                    dot = ctk.CTkLabel(
                        self.calendar_frame,
                        text="●",
                        text_color="green"
                    )
                    dot.grid(row=row + 1, column=col, sticky="s")

    # =========================

    def select_day(self, day):

        self.selected_day = day
        self.draw_calendar()
        self.show_events(day)

    # =========================

    def show_events(self, day):

        year = self.current_date.year
        month = self.current_date.month

        date_str = f"{year}-{month}-{day}"

        data = self.load_data()

        self.event_text.delete("1.0", "end")

        if date_str in data:
            for event in data[date_str]:
                self.event_text.insert("end", f"• {event}\n")

    # =========================

    def add_event(self):

        if not self.selected_day:
            return

        text = self.event_text.get("1.0", "end").strip()
        if not text:
            return

        year = self.current_date.year
        month = self.current_date.month

        date_str = f"{year}-{month}-{self.selected_day}"

        data = self.load_data()
        data.setdefault(date_str, []).append(text)

        self.save_data(data)
        self.draw_calendar()

    # =========================

    def edit_event(self):

        if not self.selected_day:
            return

        text = self.event_text.get("1.0", "end").strip()

        year = self.current_date.year
        month = self.current_date.month

        date_str = f"{year}-{month}-{self.selected_day}"

        data = self.load_data()

        if date_str in data:
            data[date_str] = [text]
            self.save_data(data)
            self.draw_calendar()

    # =========================

    def delete_event(self):

        if not self.selected_day:
            return

        year = self.current_date.year
        month = self.current_date.month

        date_str = f"{year}-{month}-{self.selected_day}"

        data = self.load_data()

        if date_str in data:
            del data[date_str]
            self.save_data(data)

        self.event_text.delete("1.0", "end")
        self.draw_calendar()

    # =========================

    def prev_month(self):

        month = self.current_date.month - 1

        if month == 0:
            month = 12
            year = self.current_date.year - 1
        else:
            year = self.current_date.year

        self.current_date = self.current_date.replace(year=year, month=month)
        self.draw_calendar()

    def next_month(self):

        month = self.current_date.month + 1

        if month == 13:
            month = 1
            year = self.current_date.year + 1
        else:
            year = self.current_date.year

        self.current_date = self.current_date.replace(year=year, month=month)
        self.draw_calendar()