import customtkinter as ctk
import json
import os
from tkinter import filedialog, messagebox
from PIL import Image

# =============================
# FILE PATH
# =============================

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

profile_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "profile.json"
)

# =============================
# LOAD / SAVE
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


def save_profile(data):
    with open(profile_file, "w") as f:
        json.dump(data, f, indent=4)


# =============================
# UI
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
            font=("Arial", 26, "bold")
        ).pack(pady=15)

        # =============================
        # MAIN CARD
        # =============================

        main_card = ctk.CTkFrame(self, corner_radius=15)
        main_card.pack(padx=20, pady=10, fill="both", expand=True)

        content_frame = ctk.CTkFrame(main_card)
        content_frame.pack(pady=20, padx=20, fill="both", expand=True)

        # =============================
        # LEFT (PHOTO)
        # =============================

        left_frame = ctk.CTkFrame(content_frame)
        left_frame.pack(side="left", padx=20)

        self.photo_label = ctk.CTkLabel(left_frame, text="")
        self.photo_label.pack(pady=10)

        self.load_photo()

        ctk.CTkButton(
            left_frame,
            text="📷 Upload Photo",
            command=self.upload_photo
        ).pack(pady=5)

        # =============================
        # RIGHT (FORM)
        # =============================

        right_frame = ctk.CTkFrame(content_frame)
        right_frame.pack(side="left", padx=20, fill="both", expand=True)

        self.name_entry = self.create_field(
            right_frame, "Name", self.profile_data.get("name", "")
        )

        self.roll_entry = self.create_field(
            right_frame, "Roll Number", self.profile_data.get("roll", "")
        )

        self.dept_entry = self.create_field(
            right_frame, "Department", self.profile_data.get("department", "")
        )

        self.year_entry = self.create_field(
            right_frame, "Year", self.profile_data.get("year", "")
        )

        # =============================
        # SAVE BUTTON
        # =============================

        ctk.CTkButton(
            right_frame,
            text="💾 Save Profile",
            fg_color="#22C55E",
            command=self.save_profile_data
        ).pack(pady=15)

        # =============================
        # STATUS
        # =============================

        self.status_label = ctk.CTkLabel(self, text="")
        self.status_label.pack()

        # =============================
        # LOGOUT BUTTON
        # =============================

        ctk.CTkButton(
            self,
            text="🚪 Logout",
            fg_color="red",
            command=self.logout
        ).pack(pady=10)

    # =============================
    # FIELD CREATOR
    # =============================

    def create_field(self, parent, label, value):

        ctk.CTkLabel(parent, text=label).pack(anchor="w")

        entry = ctk.CTkEntry(parent)
        entry.pack(fill="x", pady=5)

        entry.insert(0, value)

        return entry

    # =============================
    # PHOTO
    # =============================

    def upload_photo(self):

        file = filedialog.askopenfilename(
            filetypes=[("Image Files", "*.png *.jpg *.jpeg")]
        )

        if file:
            self.profile_data["photo"] = file
            self.load_photo()

    def load_photo(self):

        path = self.profile_data.get("photo", "")

        if path and os.path.exists(path):

            img = Image.open(path)
            img = img.resize((150, 150))

        else:

            img = Image.new("RGB", (150, 150), "gray")

        photo = ctk.CTkImage(light_image=img, size=(150, 150))

        self.photo_label.configure(image=photo)
        self.photo_label.image = photo

    # =============================
    # SAVE
    # =============================

    def save_profile_data(self):

        self.profile_data["name"] = self.name_entry.get()
        self.profile_data["roll"] = self.roll_entry.get()
        self.profile_data["department"] = self.dept_entry.get()
        self.profile_data["year"] = self.year_entry.get()

        save_profile(self.profile_data)

        self.status_label.configure(
            text="✅ Profile saved successfully!",
            text_color="green"
        )

    # =============================
    # LOGOUT
    # =============================

    def logout(self):

        confirm = messagebox.askyesno(
            "Logout",
            "Are you sure you want to logout?"
        )

        if confirm:
            os.system("python login.py")
            self.master.destroy()