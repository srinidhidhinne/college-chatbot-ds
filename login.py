import tkinter as tk
from tkinter import messagebox
import subprocess
import sys

users = {
    "admin": "admin123",
    "user": "user123"
}

def login():

    username = username_entry.get().strip().lower()
    password = password_entry.get().strip()

    if username in users and users[username] == password:

        messagebox.showinfo(
            "Login Success",
            f"Welcome {username}"
        )

        window.destroy()

        subprocess.Popen(
            [sys.executable, "gui.py", username]
        )

    else:

        messagebox.showerror(
            "Error",
            "Invalid Username or Password"
        )

window = tk.Tk()

window.title("College Chatbot Login")

window.geometry("350x250")

window.configure(bg="#E8F0FE")

tk.Label(
    window,
    text="College Chatbot Login",
    font=("Arial", 14, "bold"),
    bg="#E8F0FE"
).pack(pady=15)

tk.Label(window, text="Username", bg="#E8F0FE").pack()

username_entry = tk.Entry(window, width=30)
username_entry.pack(pady=5)

tk.Label(window, text="Password", bg="#E8F0FE").pack()

password_entry = tk.Entry(
    window,
    width=30,
    show="*"
)
password_entry.pack(pady=5)

tk.Button(
    window,
    text="Login",
    command=login,
    bg="#4CAF50",
    fg="white"
).pack(pady=15)

window.mainloop()