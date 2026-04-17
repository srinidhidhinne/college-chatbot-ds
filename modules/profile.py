import customtkinter as ctk
import json
import os
from tkinter import filedialog
from PIL import Image


# =============================
# FILE PATH
# =============================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

profile_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "profile.json"
)


# =============================
# LOAD PROFILE
# =============================

def load_profile():

    try:

        with open(profile_file, "r") as f:
            return json.load(f)

    except:

        return {

            "name": "",
            "roll": "",
            "department": "",
            "year": "",
            "photo": ""

        }


# =============================
# SAVE PROFILE
# =============================

def save_profile(data):

    with open(profile_file, "w") as f:
        json.dump(data, f, indent=4)


# =============================
# PROFILE UI
# =============================

class ProfileUI(ctk.CTkFrame):

    def __init__(self, parent):

        super().__init__(parent)

        self.pack(fill="both", expand=True)

        self.profile_data = load_profile()

        # =============================
        # TITLE
        # =============================

        ctk.CTkLabel(
            self,
            text="👤 Student Profile",
            font=("Arial", 24, "bold")
        ).pack(pady=15)

        # =============================
        # PHOTO FRAME
        # =============================

        self.photo_label = ctk.CTkLabel(
            self,
            text=""
        )
        self.photo_label.pack(pady=10)

        self.load_photo()

        ctk.CTkButton(
            self,
            text="Upload Photo",
            command=self.upload_photo
        ).pack(pady=5)

        # =============================
        # FORM FRAME
        # =============================

        form_frame = ctk.CTkFrame(self)
        form_frame.pack(pady=15)

        # Name

        ctk.CTkLabel(
            form_frame,
            text="Name"
        ).pack(anchor="w")

        self.name_entry = ctk.CTkEntry(
            form_frame,
            width=250
        )
        self.name_entry.pack(pady=5)

        # Roll

        ctk.CTkLabel(
            form_frame,
            text="Roll Number"
        ).pack(anchor="w")

        self.roll_entry = ctk.CTkEntry(
            form_frame,
            width=250
        )
        self.roll_entry.pack(pady=5)

        # Department

        ctk.CTkLabel(
            form_frame,
            text="Department"
        ).pack(anchor="w")

        self.dept_entry = ctk.CTkEntry(
            form_frame,
            width=250
        )
        self.dept_entry.pack(pady=5)

        # Year

        ctk.CTkLabel(
            form_frame,
            text="Year"
        ).pack(anchor="w")

        self.year_entry = ctk.CTkEntry(
            form_frame,
            width=250
        )
        self.year_entry.pack(pady=5)

        # Fill existing data

        self.name_entry.insert(
            0,
            self.profile_data.get("name", "")
        )

        self.roll_entry.insert(
            0,
            self.profile_data.get("roll", "")
        )

        self.dept_entry.insert(
            0,
            self.profile_data.get("department", "")
        )

        self.year_entry.insert(
            0,
            self.profile_data.get("year", "")
        )

        # =============================
        # SAVE BUTTON
        # =============================

        self.status_label = ctk.CTkLabel(
            self,
            text=""
        )
        self.status_label.pack()

        ctk.CTkButton(
            self,
            text="Save Profile",
            command=self.save_profile_data
        ).pack(pady=10)


    # =============================
    # UPLOAD PHOTO
    # =============================

    def upload_photo(self):

        file = filedialog.askopenfilename(
            filetypes=[
                ("Image Files", "*.png *.jpg *.jpeg")
            ]
        )

        if file:

            self.profile_data["photo"] = file

            self.load_photo()


    # =============================
    # LOAD PHOTO
    # =============================

    def load_photo(self):

        path = self.profile_data.get("photo", "")

        if path and os.path.exists(path):

            img = Image.open(path)

            img = img.resize((140, 140))

        else:

            # Default gray image

            img = Image.new(
                "RGB",
                (140, 140),
                color="gray"
            )

        photo = ctk.CTkImage(
            light_image=img,
            size=(140, 140)
        )

        self.photo_label.configure(
            image=photo
        )

        self.photo_label.image = photo


    # =============================
    # SAVE PROFILE
    # =============================

    def save_profile_data(self):

        self.profile_data["name"] = (
            self.name_entry.get()
        )

        self.profile_data["roll"] = (
            self.roll_entry.get()
        )

        self.profile_data["department"] = (
            self.dept_entry.get()
        )

        self.profile_data["year"] = (
            self.year_entry.get()
        )

        save_profile(self.profile_data)

        self.status_label.configure(
            text="✅ Profile Saved Successfully",
            text_color="green"
        )