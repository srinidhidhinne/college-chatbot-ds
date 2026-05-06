import customtkinter as ctk
import json
import os
import webbrowser
from tkinter import filedialog

# =============================
# FILE PATHS
# =============================

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

notes_file = os.path.join(BASE_DIR, "DataFolder", "notes.json")
pdf_folder = os.path.join(BASE_DIR, "DataFolder", "notes_pdfs")

os.makedirs(pdf_folder, exist_ok=True)

# =============================
# LOAD / SAVE
# =============================

def load_notes():
    try:
        with open(notes_file, "r") as f:
            data = json.load(f)
            if not isinstance(data, dict):
                return {}
            return data
    except:
        return {}

def save_notes():
    with open(notes_file, "w") as f:
        json.dump(notes_data, f, indent=4)

notes_data = load_notes()

# =============================
# NOTES UI
# =============================

class NotesUI(ctk.CTkFrame):

    def __init__(self, parent, user_role):
        super().__init__(parent)

        self.user_role = user_role
        self.pack(fill="both", expand=True)

        # =============================
        # HEADER
        # =============================

        ctk.CTkLabel(
            self,
            text="📚 Notes Hub",
            font=("Arial", 24, "bold")
        ).pack(anchor="w", padx=20, pady=15)

        # =============================
        # ADMIN BAR
        # =============================

        if user_role == "admin":

            admin_frame = ctk.CTkFrame(self)
            admin_frame.pack(fill="x", padx=20, pady=10)

            ctk.CTkButton(admin_frame, text="Add Branch", command=self.add_branch).pack(side="left", padx=5)
            ctk.CTkButton(admin_frame, text="Add Subject", command=self.add_subject).pack(side="left", padx=5)
            ctk.CTkButton(admin_frame, text="Upload PDF", command=self.upload_pdf).pack(side="left", padx=5)
            ctk.CTkButton(admin_frame, text="Add Notes Link", command=self.add_notes_link).pack(side="left", padx=5)
            ctk.CTkButton(admin_frame, text="Add Book Link", command=self.add_book_link).pack(side="left", padx=5)

        # =============================
        # MAIN DISPLAY
        # =============================

        self.display_frame = ctk.CTkScrollableFrame(self)
        self.display_frame.pack(fill="both", expand=True, padx=20, pady=10)

        self.refresh_notes()

    # =============================
    # ADMIN FUNCTIONS
    # =============================

    def add_branch(self):
        branch = ctk.CTkInputDialog(text="Enter Branch Name:").get_input()
        if branch:
            if branch not in notes_data:
                notes_data[branch] = {}
                save_notes()
                self.refresh_notes()

    def add_subject(self):
        branch = ctk.CTkInputDialog(text="Branch:").get_input()
        subject = ctk.CTkInputDialog(text="Subject:").get_input()

        if branch and subject:

            if branch not in notes_data:
                notes_data[branch] = {}

            if subject not in notes_data[branch]:
                notes_data[branch][subject] = {"notes": [], "books": []}

            save_notes()
            self.refresh_notes()

    def upload_pdf(self):

        branch = ctk.CTkInputDialog(text="Branch:").get_input()
        subject = ctk.CTkInputDialog(text="Subject:").get_input()

        if not branch or not subject:
            return

        file_path = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])

        if not file_path:
            return

        filename = os.path.basename(file_path)
        new_path = os.path.join(pdf_folder, filename)

        with open(file_path, "rb") as src:
            with open(new_path, "wb") as dst:
                dst.write(src.read())

        if branch not in notes_data:
            notes_data[branch] = {}

        if subject not in notes_data[branch]:
            notes_data[branch][subject] = {"notes": [], "books": []}

        notes_data[branch][subject]["notes"].append({
            "title": filename,
            "link": new_path
        })

        save_notes()
        self.refresh_notes()

    def add_notes_link(self):

        branch = ctk.CTkInputDialog(text="Branch:").get_input()
        subject = ctk.CTkInputDialog(text="Subject:").get_input()
        title = ctk.CTkInputDialog(text="Title:").get_input()
        link = ctk.CTkInputDialog(text="Link:").get_input()

        if branch and subject and title and link:

            if branch not in notes_data:
                notes_data[branch] = {}

            if subject not in notes_data[branch]:
                notes_data[branch][subject] = {"notes": [], "books": []}

            notes_data[branch][subject]["notes"].append({
                "title": title,
                "link": link
            })

            save_notes()
            self.refresh_notes()

    def add_book_link(self):

        branch = ctk.CTkInputDialog(text="Branch:").get_input()
        subject = ctk.CTkInputDialog(text="Subject:").get_input()
        title = ctk.CTkInputDialog(text="Book Title:").get_input()
        link = ctk.CTkInputDialog(text="Link:").get_input()

        if branch and subject and title and link:

            if branch not in notes_data:
                notes_data[branch] = {}

            if subject not in notes_data[branch]:
                notes_data[branch][subject] = {"notes": [], "books": []}

            notes_data[branch][subject]["books"].append({
                "title": title,
                "link": link
            })

            save_notes()
            self.refresh_notes()

    # =============================
    # UI CARDS
    # =============================

    def create_file_button(self, parent, title, link):

        def open_file():
            if link.startswith("http"):
                webbrowser.open(link)
            else:
                os.startfile(link)

        ctk.CTkButton(
            parent,
            text=f"📄 {title}",
            command=open_file,
            anchor="w"
        ).pack(fill="x", padx=10, pady=3)

    def create_subject_card(self, parent, subject, data):

        card = ctk.CTkFrame(parent, corner_radius=12)
        card.pack(fill="x", pady=5, padx=10)

        ctk.CTkLabel(
            card,
            text=f"📘 {subject}",
            font=("Arial", 14, "bold")
        ).pack(anchor="w", padx=10, pady=5)

        for item in data.get("notes", []):
            self.create_file_button(card, item["title"], item["link"])

        for item in data.get("books", []):
            self.create_file_button(card, f"📚 {item['title']}", item["link"])

    def create_branch_card(self, branch, subjects):

        card = ctk.CTkFrame(self.display_frame, corner_radius=15)
        card.pack(fill="x", pady=10)

        ctk.CTkLabel(
            card,
            text=f"📁 {branch}",
            font=("Arial", 16, "bold")
        ).pack(anchor="w", padx=10, pady=5)

        for subject, data in subjects.items():
            self.create_subject_card(card, subject, data)

    # =============================
    # REFRESH
    # =============================

    def refresh_notes(self):

        for widget in self.display_frame.winfo_children():
            widget.destroy()

        if not notes_data:

            ctk.CTkLabel(
                self.display_frame,
                text="No notes available."
            ).pack(pady=20)

            return

        for branch, subjects in notes_data.items():
            self.create_branch_card(branch, subjects)