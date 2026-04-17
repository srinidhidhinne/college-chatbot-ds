import json
import tkinter as tk
from tkinter import messagebox
import sys
import speech_recognition as sr
from datetime import datetime

from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from ds.trie import Trie
from ds.stack import Stack
from chatbot.utils import find_closest


# =============================
# USER ROLE
# =============================

if len(sys.argv) > 1:
    user_role = sys.argv[1].strip().lower()
else:
    user_role = "user"

history_file = f"DataFolder/chat_history_{user_role}.txt"


# =============================
# LOAD FAQ
# =============================

def load_faqs():

    global faqs

    try:
        with open(
            "DataFolder/faqs.json",
            "r",
            encoding="utf-8"
        ) as f:

            faqs = json.load(f)

    except:
        faqs = {}


load_faqs()


# =============================
# BUILD TRIE
# =============================

trie = Trie()

for q in faqs:
    trie.insert(q)


# =============================
# BUILD CATEGORIES
# =============================

def build_categories():

    categories = {}

    for q in faqs:

        first_word = q.split()[0]

        if first_word not in categories:
            categories[first_word] = []

        categories[first_word].append(q)

    return categories


categories = build_categories()


# =============================
# GLOBAL VARIABLES
# =============================

history_stack = Stack()

pending_suggestion = None


# =============================
# MAIN WINDOW
# =============================

window = tk.Tk()

window.title(f"College Chatbot ({user_role})")

window.geometry("600x760")

window.configure(bg="#E8F0FE")


# =============================
# CHAT AREA
# =============================

chat_canvas = tk.Canvas(
    window,
    bg="#E8F0FE",
    height=400
)

scrollbar = tk.Scrollbar(
    window,
    command=chat_canvas.yview
)

chat_frame = tk.Frame(
    chat_canvas,
    bg="#E8F0FE"
)

chat_frame.bind(
    "<Configure>",
    lambda e:
    chat_canvas.configure(
        scrollregion=chat_canvas.bbox("all")
    )
)

chat_canvas.create_window(
    (0, 0),
    window=chat_frame,
    anchor="nw"
)

chat_canvas.configure(
    yscrollcommand=scrollbar.set
)

chat_canvas.pack(
    side="left",
    fill="both",
    expand=True,
    padx=10,
    pady=10
)

scrollbar.pack(
    side="right",
    fill="y"
)


# =============================
# TIME
# =============================

def current_time():

    return datetime.now().strftime("%H:%M")


# =============================
# DISPLAY
# =============================

def display_user(msg):

    bubble = tk.Label(
        chat_frame,
        text=f"You ({current_time()}): {msg}",
        bg="#DCF8C6",
        wraplength=300,
        padx=10,
        pady=6
    )

    bubble.pack(
        anchor="e",
        pady=4,
        padx=10
    )


def display_bot(msg):

    bubble = tk.Label(
        chat_frame,
        text=f"Bot ({current_time()}): {msg}",
        bg="#FFFFFF",
        wraplength=300,
        padx=10,
        pady=6
    )

    bubble.pack(
        anchor="w",
        pady=4,
        padx=10
    )

    chat_canvas.yview_moveto(1.0)


# =============================
# HISTORY
# =============================

def load_chat_history():

    try:

        with open(
            history_file,
            "r",
            encoding="utf-8"
        ) as f:

            for line in f:

                line = line.strip()

                if line:
                    display_bot(line)

    except:
        pass


def save_chat_history():

    try:

        with open(
            history_file,
            "w",
            encoding="utf-8"
        ) as f:

            for widget in chat_frame.winfo_children():

                if isinstance(widget, tk.Label):

                    f.write(
                        widget.cget("text") + "\n"
                    )

    except:
        pass


def clear_chat():

    for widget in chat_frame.winfo_children():
        widget.destroy()


# =============================
# SEARCH CHAT
# =============================

def search_chat():

    keyword = search_entry.get().lower()

    if not keyword:
        return

    results = []

    for widget in chat_frame.winfo_children():

        if isinstance(widget, tk.Label):

            text = widget.cget("text").lower()

            if keyword in text:
                results.append(text)

    if results:

        clear_chat()

        display_bot("Search Results:")

        for r in results:
            display_bot(r)

    else:

        messagebox.showinfo(
            "Search",
            "No matching messages found."
        )

# =============================
# VOICE INPUT FEATURE
# =============================

def voice_input():

    recognizer = sr.Recognizer()

    try:

        with sr.Microphone() as source:

            display_bot("Listening...")

            recognizer.adjust_for_ambient_noise(source)

            audio = recognizer.listen(source)

            text = recognizer.recognize_google(audio)

            text = text.lower()

            entry_box.delete(0, tk.END)

            entry_box.insert(0, text)

            display_bot(f"You said: {text}")

    except sr.UnknownValueError:

        messagebox.showerror(
            "Voice Error",
            "Could not understand audio"
        )

    except sr.RequestError:

        messagebox.showerror(
            "Voice Error",
            "Internet required for voice recognition"
        )

    except:

        messagebox.showerror(
            "Voice Error",
            "Microphone not detected"
        )
# =============================
# AUTOSUGGESTIONS
# =============================

def update_suggestions(event=None):

    typed = entry_box.get().lower()

    suggestion_list.delete(0, tk.END)

    if not typed:
        return

    suggestions = trie.get_suggestions(typed)

    for word in suggestions[:5]:

        suggestion_list.insert(
            tk.END,
            word
        )


def select_suggestion(event):

    try:

        selected = suggestion_list.get(
            suggestion_list.curselection()
        )

        entry_box.delete(0, tk.END)

        entry_box.insert(0, selected)

        suggestion_list.delete(0, tk.END)

    except:
        pass


# =============================
# CATEGORY
# =============================

def show_category(cat):

    display_bot(f"{cat} questions:")

    for q in categories[cat]:
        display_bot(q)


# =============================
# SEND MESSAGE
# =============================

def send_message():

    global pending_suggestion

    text = entry_box.get().lower()

    if not text:
        return

    display_user(text)

    entry_box.delete(0, tk.END)

    suggestion_list.delete(0, tk.END)

    history_stack.push(text)


    if pending_suggestion:

        if text == "yes":

            display_bot(
                faqs[pending_suggestion]
            )

            pending_suggestion = None

            return

        elif text == "no":

            display_bot(
                "Please type again."
            )

            pending_suggestion = None

            return


    if text in faqs:

        display_bot(faqs[text])

    else:

        suggestion = find_closest(
            text,
            list(faqs.keys())
        )

        if suggestion:

            pending_suggestion = suggestion

            display_bot(
                f"Did you mean {suggestion}? (yes/no)"
            )

        else:

            display_bot(
                "Sorry, not found."
            )


# =============================
# EXPORT CHAT PDF
# =============================

def export_chat_to_pdf():

    styles = getSampleStyleSheet()

    elements = []

    for widget in chat_frame.winfo_children():

        if isinstance(widget, tk.Label):

            elements.append(
                Paragraph(
                    widget.cget("text"),
                    styles["Normal"]
                )
            )

    pdf_name = f"chat_history_{user_role}.pdf"

    pdf = SimpleDocTemplate(pdf_name)

    pdf.build(elements)

    messagebox.showinfo(
        "Success",
        f"Exported {pdf_name}"
    )


# =============================
# EXPORT FAQ BACKUP ⭐
# =============================

def export_faq_backup():

    try:

        with open(
            "DataFolder/faqs_backup.json",
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                faqs,
                f,
                indent=4
            )

        messagebox.showinfo(
            "Backup",
            "FAQ Backup Created!"
        )

    except:

        messagebox.showerror(
            "Error",
            "Backup Failed"
        )


# =============================
# ADMIN FUNCTIONS
# =============================

def open_add():

    win = tk.Toplevel(window)

    tk.Label(win, text="Question").pack()

    q_entry = tk.Entry(win, width=40)
    q_entry.pack()

    tk.Label(win, text="Answer").pack()

    a_entry = tk.Entry(win, width=40)
    a_entry.pack()

    def save():

        q = q_entry.get().lower()
        a = a_entry.get()

        faqs[q] = a

        with open(
            "DataFolder/faqs.json",
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(faqs, f, indent=4)

        trie.insert(q)

        win.destroy()

    tk.Button(
        win,
        text="Save",
        command=save
    ).pack(pady=5)


def open_delete():

    win = tk.Toplevel(window)

    lb = tk.Listbox(win)
    lb.pack()

    for q in faqs:
        lb.insert(tk.END, q)

    def delete():

        selected = lb.get(lb.curselection())

        del faqs[selected]

        with open(
            "DataFolder/faqs.json",
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(faqs, f, indent=4)

        win.destroy()

    tk.Button(
        win,
        text="Delete",
        command=delete
    ).pack()


def open_edit():

    win = tk.Toplevel(window)

    lb = tk.Listbox(win, width=50)
    lb.pack()

    for q in faqs:
        lb.insert(tk.END, q)

    def edit_selected():

        selected = lb.get(lb.curselection())

        edit_win = tk.Toplevel(win)

        ans_entry = tk.Entry(
            edit_win,
            width=40
        )

        ans_entry.insert(
            0,
            faqs[selected]
        )

        ans_entry.pack()

        def save_edit():

            faqs[selected] = ans_entry.get()

            with open(
                "DataFolder/faqs.json",
                "w",
                encoding="utf-8"
            ) as f:

                json.dump(faqs, f, indent=4)

            edit_win.destroy()

        tk.Button(
            edit_win,
            text="Save",
            command=save_edit
        ).pack()

    tk.Button(
        win,
        text="Edit",
        command=edit_selected
    ).pack()


# =============================
# CATEGORY BUTTONS
# =============================

category_frame = tk.Frame(window)
category_frame.pack(pady=5)

for cat in categories:

    tk.Button(
        category_frame,
        text=cat.capitalize(),
        width=10,
        bg="#2196F3",
        fg="white",
        command=lambda c=cat:
        show_category(c)
    ).pack(side=tk.LEFT, padx=3)


# =============================
# SEARCH UI
# =============================

search_frame = tk.Frame(window)
search_frame.pack(pady=5)

search_entry = tk.Entry(
    search_frame,
    width=30
)
search_entry.pack(side=tk.LEFT, padx=5)

tk.Button(
    search_frame,
    text="Search Chat",
    command=search_chat,
    bg="#607D8B",
    fg="white"
).pack(side=tk.LEFT)


# =============================
# INPUT
# =============================

entry_box = tk.Entry(
    window,
    width=55
)

entry_box.pack(pady=8)

entry_box.bind("<KeyRelease>", update_suggestions)

entry_box.bind(
    "<Return>",
    lambda e: send_message()
)


suggestion_list = tk.Listbox(
    window,
    height=5,
    width=55
)

suggestion_list.pack(pady=5)

suggestion_list.bind(
    "<<ListboxSelect>>",
    select_suggestion
)


# =============================
# BUTTONS
# =============================

button_frame = tk.Frame(window)
button_frame.pack(pady=5)

tk.Button(
    button_frame,
    text="Send",
    command=send_message,
    bg="#4CAF50",
    fg="white"
).pack(side=tk.LEFT, padx=4)

tk.Button(
    button_frame,
    text="🎤 Voice",
    command=voice_input,
    bg="#03A9F4",
    fg="white"
).pack(side=tk.LEFT, padx=4)

tk.Button(
    button_frame,
    text="Clear Chat",
    command=clear_chat,
    bg="#9C27B0",
    fg="white"
).pack(side=tk.LEFT, padx=4)


tk.Button(
    button_frame,
    text="Export PDF",
    command=export_chat_to_pdf,
    bg="#FF9800",
    fg="white"
).pack(side=tk.LEFT, padx=4)


tk.Button(
    button_frame,
    text="Exit",
    command=lambda:
    [save_chat_history(), window.destroy()],
    bg="#F44336",
    fg="white"
).pack(side=tk.LEFT, padx=4)


# =============================
# ADMIN PANEL
# =============================

if user_role == "admin":

    admin_frame = tk.Frame(window)
    admin_frame.pack(pady=10)

    tk.Button(
        admin_frame,
        text="Add FAQ",
        command=open_add,
        bg="#673AB7",
        fg="white"
    ).pack(side=tk.LEFT, padx=5)

    tk.Button(
        admin_frame,
        text="Delete FAQ",
        command=open_delete,
        bg="#F44336",
        fg="white"
    ).pack(side=tk.LEFT, padx=5)

    tk.Button(
        admin_frame,
        text="Edit FAQ",
        command=open_edit,
        bg="#009688",
        fg="white"
    ).pack(side=tk.LEFT, padx=5)

    tk.Button(
        admin_frame,
        text="Export FAQs Backup",
        command=export_faq_backup,
        bg="#3F51B5",
        fg="white"
    ).pack(side=tk.LEFT, padx=5)


# =============================
# STARTUP
# =============================

load_chat_history()

display_bot(f"Welcome {user_role}!")

window.mainloop()