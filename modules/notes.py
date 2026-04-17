import customtkinter as ctk
import json
import os
import webbrowser
from tkinter import filedialog


# =============================
# FILE PATHS
# =============================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

notes_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "notes.json"
)

pdf_folder = os.path.join(
    BASE_DIR,
    "DataFolder",
    "notes_pdfs"
)

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

        json.dump(
            notes_data,
            f,
            indent=4
        )


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
        # TITLE
        # =============================

        ctk.CTkLabel(
            self,
            text="Branch-wise Notes",
            font=("Arial", 22, "bold")
        ).pack(pady=10)

        # =============================
        # ADMIN CONTROLS
        # =============================

        if user_role == "admin":

            admin_frame = ctk.CTkFrame(self)
            admin_frame.pack(pady=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Branch",
                command=self.add_branch
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Subject",
                command=self.add_subject
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                admin_frame,
                text="Upload PDF",
                command=self.upload_pdf
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Notes Link",
                command=self.add_notes_link
            ).pack(side="left", padx=5)

            ctk.CTkButton(
                admin_frame,
                text="Add Book Link",
                command=self.add_book_link
            ).pack(side="left", padx=5)

        # =============================
        # DISPLAY AREA
        # =============================

        self.display_frame = ctk.CTkScrollableFrame(
            self
        )

        self.display_frame.pack(
            fill="both",
            expand=True,
            padx=10,
            pady=10
        )

        self.refresh_notes()


    # =============================
    # ADMIN FUNCTIONS
    # =============================

    def add_branch(self):

        branch = ctk.CTkInputDialog(
            text="Enter Branch Name:"
        ).get_input()

        if branch:

            if branch not in notes_data:

                notes_data[branch] = {}

                save_notes()

                self.refresh_notes()


    def add_subject(self):

        branch = ctk.CTkInputDialog(
            text="Branch:"
        ).get_input()

        subject = ctk.CTkInputDialog(
            text="Subject:"
        ).get_input()

        if branch and subject:

            if branch not in notes_data:
                notes_data[branch] = {}

            if subject not in notes_data[branch]:

                notes_data[branch][subject] = {
                    "notes": [],
                    "books": []
                }

                save_notes()

                self.refresh_notes()


    def upload_pdf(self):

        branch = ctk.CTkInputDialog(
            text="Branch:"
        ).get_input()

        subject = ctk.CTkInputDialog(
            text="Subject:"
        ).get_input()

        if not branch or not subject:
            return

        file_path = filedialog.askopenfilename(
            filetypes=[("PDF Files", "*.pdf")]
        )

        if not file_path:
            return

        filename = os.path.basename(file_path)

        new_path = os.path.join(
            pdf_folder,
            filename
        )

        # Copy file
        with open(file_path, "rb") as src:
            with open(new_path, "wb") as dst:
                dst.write(src.read())

        if branch not in notes_data:
            notes_data[branch] = {}

        if subject not in notes_data[branch]:

            notes_data[branch][subject] = {
                "notes": [],
                "books": []
            }

        notes_data[branch][subject]["notes"].append({

            "title": filename,
            "link": new_path

        })

        save_notes()

        self.refresh_notes()


    def add_notes_link(self):

        branch = ctk.CTkInputDialog(
            text="Branch:"
        ).get_input()

        subject = ctk.CTkInputDialog(
            text="Subject:"
        ).get_input()

        title = ctk.CTkInputDialog(
            text="Notes Title:"
        ).get_input()

        link = ctk.CTkInputDialog(
            text="Paste Link:"
        ).get_input()

        if branch and subject and title and link:

            if branch not in notes_data:
                notes_data[branch] = {}

            if subject not in notes_data[branch]:

                notes_data[branch][subject] = {
                    "notes": [],
                    "books": []
                }

            notes_data[branch][subject]["notes"].append({

                "title": title,
                "link": link

            })

            save_notes()

            self.refresh_notes()


    def add_book_link(self):

        branch = ctk.CTkInputDialog(
            text="Branch:"
        ).get_input()

        subject = ctk.CTkInputDialog(
            text="Subject:"
        ).get_input()

        title = ctk.CTkInputDialog(
            text="Book Title:"
        ).get_input()

        link = ctk.CTkInputDialog(
            text="Paste Link:"
        ).get_input()

        if branch and subject and title and link:

            if branch not in notes_data:
                notes_data[branch] = {}

            if subject not in notes_data[branch]:

                notes_data[branch][subject] = {
                    "notes": [],
                    "books": []
                }

            notes_data[branch][subject]["books"].append({

                "title": title,
                "link": link

            })

            save_notes()

            self.refresh_notes()


    # =============================
    # DISPLAY NOTES
    # =============================

    def refresh_notes(self):

        for widget in self.display_frame.winfo_children():
            widget.destroy()

        if not notes_data:

            ctk.CTkLabel(
                self.display_frame,
                text="No notes available."
            ).pack()

            return

        for branch in notes_data:

            ctk.CTkLabel(
                self.display_frame,
                text=f"📁 {branch}",
                font=("Arial", 16, "bold")
            ).pack(anchor="w", pady=5)

            for subject in notes_data[branch]:

                ctk.CTkLabel(
                    self.display_frame,
                    text=f"📘 {subject}",
                    font=("Arial", 14)
                ).pack(anchor="w", padx=20)

                subject_data = notes_data[branch][subject]

                # NOTES

                for item in subject_data.get("notes", []):

                    ctk.CTkButton(
                        self.display_frame,
                        text=f"📄 {item['title']}",
                        command=lambda url=item["link"]:
                        webbrowser.open(url)
                    ).pack(anchor="w", padx=40)

                # BOOKS

                for item in subject_data.get("books", []):

                    ctk.CTkButton(
                        self.display_frame,
                        text=f"📚 {item['title']}",
                        command=lambda url=item["link"]:
                        webbrowser.open(url)
                    ).pack(anchor="w", padx=40)