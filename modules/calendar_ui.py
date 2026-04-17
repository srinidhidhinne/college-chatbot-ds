import customtkinter as ctk
import calendar
import json
import os
from datetime import datetime

DATA_FILE = "DataFolder/events.json"


class CalendarUI(ctk.CTkFrame):

    def __init__(self, parent):

        super().__init__(parent)

        self.current_date = datetime.now()
        self.selected_day = None

        # Create file if not exists
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, "w") as f:
                json.dump({}, f)

        # =========================
        # HEADER
        # =========================

        header = ctk.CTkFrame(self)
        header.pack(pady=10)

        ctk.CTkButton(
            header,
            text="<",
            width=40,
            command=self.prev_month
        ).pack(side="left")

        self.month_label = ctk.CTkLabel(
            header,
            text="",
            font=("Arial", 18, "bold")
        )
        self.month_label.pack(side="left", padx=20)

        ctk.CTkButton(
            header,
            text=">",
            width=40,
            command=self.next_month
        ).pack(side="left")

        # =========================
        # CALENDAR FRAME
        # =========================

        self.calendar_frame = ctk.CTkFrame(self)
        self.calendar_frame.pack(pady=10)

        # =========================
        # EVENT BOX
        # =========================

        self.event_text = ctk.CTkTextbox(
            self,
            height=120
        )
        self.event_text.pack(
            fill="x",
            padx=10,
            pady=10
        )

        # Buttons

        btn_frame = ctk.CTkFrame(self)
        btn_frame.pack(pady=5)

        ctk.CTkButton(
            btn_frame,
            text="Add Event",
            command=self.add_event
        ).pack(side="left", padx=5)

        ctk.CTkButton(
            btn_frame,
            text="Edit Event",
            command=self.edit_event
        ).pack(side="left", padx=5)

        ctk.CTkButton(
            btn_frame,
            text="Delete Event",
            command=self.delete_event
        ).pack(side="left", padx=5)

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

        self.month_label.configure(
            text=f"{calendar.month_name[month]} {year}"
        )

        days = ["Mon", "Tue", "Wed", "Thu",
                "Fri", "Sat", "Sun"]

        for col, day in enumerate(days):

            ctk.CTkLabel(
                self.calendar_frame,
                text=day
            ).grid(row=0, column=col)

        cal = calendar.monthcalendar(year, month)

        data = self.load_data()

        for row, week in enumerate(cal):

            for col, day in enumerate(week):

                if day == 0:
                    continue

                date_str = f"{year}-{month}-{day}"

                # Highlight dates with events
                if date_str in data:
                    color = "#4CAF50"  # green
                else:
                    color = None

                btn = ctk.CTkButton(
                    self.calendar_frame,
                    text=str(day),
                    width=40,
                    fg_color=color,
                    command=lambda d=day:
                    self.show_events(d)
                )

                btn.grid(
                    row=row + 1,
                    column=col,
                    padx=5,
                    pady=5
                )

    # =========================

    def show_events(self, day):

        self.selected_day = day

        year = self.current_date.year
        month = self.current_date.month

        date_str = f"{year}-{month}-{day}"

        data = self.load_data()

        self.event_text.delete("1.0", "end")

        if date_str in data:

            for event in data[date_str]:

                self.event_text.insert(
                    "end",
                    event + "\n"
                )

        else:

            self.event_text.insert(
                "end",
                ""
            )

    # =========================

    def add_event(self):

        if not self.selected_day:
            return

        text = self.event_text.get(
            "1.0",
            "end"
        ).strip()

        if not text:
            return

        year = self.current_date.year
        month = self.current_date.month

        date_str = f"{year}-{month}-{self.selected_day}"

        data = self.load_data()

        if date_str not in data:
            data[date_str] = []

        data[date_str].append(text)

        self.save_data(data)

        self.draw_calendar()

    # =========================

    def edit_event(self):

        if not self.selected_day:
            return

        text = self.event_text.get(
            "1.0",
            "end"
        ).strip()

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
    def add_event_from_club(self, date_str, event_text):

          data = self.load_data()

          if date_str not in data:
              data[date_str] = []

          data[date_str].append(event_text)

          self.save_data(data)

          self.draw_calendar()
         

    # =========================

    def prev_month(self):

        month = self.current_date.month - 1

        if month == 0:
            month = 12
            year = self.current_date.year - 1
        else:
            year = self.current_date.year

        self.current_date = self.current_date.replace(
            year=year,
            month=month
        )

        self.draw_calendar()

    # =========================

    def next_month(self):

        month = self.current_date.month + 1

        if month == 13:
            month = 1
            year = self.current_date.year + 1
        else:
            year = self.current_date.year

        self.current_date = self.current_date.replace(
            year=year,
            month=month
        )

        self.draw_calendar()