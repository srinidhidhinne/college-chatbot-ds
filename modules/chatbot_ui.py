import customtkinter as ctk
import json
import os
import threading
import tempfile

import speech_recognition as sr
import sounddevice as sd
from scipy.io.wavfile import write

from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from ds.trie import Trie
from chatbot.utils import find_closest


# =============================
# FILE PATH
# =============================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

faq_file = os.path.join(
    BASE_DIR,
    "DataFolder",
    "faqs.json"
)


# =============================
# LOAD FAQ
# =============================

def load_faqs():

    try:

        with open(
            faq_file,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    except:

        return {}


faqs = load_faqs()


# =============================
# TRIE
# =============================

def rebuild_trie():

    global trie

    trie = Trie()

    for q in faqs:
        trie.insert(q)


rebuild_trie()


# =============================
# CHATBOT UI
# =============================

class ChatbotUI(ctk.CTkFrame):

    def __init__(self, parent, user_role):

        super().__init__(parent)

        self.user_role = user_role

        self.pack(fill="both", expand=True)

        # =============================
        # HEADER
        # =============================

        header = ctk.CTkFrame(self, height=50)

        header.pack(fill="x")

        ctk.CTkLabel(
            header,
            text="🤖 College AI Assistant",
            font=("Arial", 20, "bold")
        ).pack(pady=10)


        # =============================
        # CHAT AREA
        # =============================

        self.chat_frame = ctk.CTkScrollableFrame(
            self
        )

        self.chat_frame.pack(
            fill="both",
            expand=True,
            padx=10,
            pady=10
        )

        # Welcome message

        self.display_bot_message(
            "👋 Hello! I'm your college assistant.\n\n"
            "Try:\n"
            "• open clubs\n"
            "• open calendar\n"
            "• open profile"
        )


        # =============================
        # QUICK BUTTONS
        # =============================

        quick_frame = ctk.CTkFrame(self)

        quick_frame.pack(
            fill="x",
            padx=10,
            pady=5
        )

        quick_commands = [

            ("📅 Calendar", "open calendar"),
            ("🎭 Clubs", "open clubs"),
            ("🔔 Notifications", "open notifications"),
            ("👤 Profile", "open profile")

        ]

        for text, cmd in quick_commands:

            ctk.CTkButton(
                quick_frame,
                text=text,
                width=120,
                command=lambda c=cmd:
                self.quick_send(c)
            ).pack(
                side="left",
                padx=5
            )


        # =============================
        # INPUT AREA
        # =============================

        input_frame = ctk.CTkFrame(self)

        input_frame.pack(
            fill="x",
            padx=10,
            pady=5
        )

        self.entry_box = ctk.CTkEntry(
            input_frame,
            placeholder_text="Type your message..."
        )

        self.entry_box.pack(
            side="left",
            fill="x",
            expand=True,
            padx=5
        )

        self.entry_box.bind(
            "<Return>",
            lambda e: self.send_message()
        )

        ctk.CTkButton(
            input_frame,
            text="Send",
            width=80,
            command=self.send_message
        ).pack(side="left", padx=5)

        ctk.CTkButton(
            input_frame,
            text="🎤",
            width=40,
            command=self.start_voice_thread
        ).pack(side="left", padx=5)

        ctk.CTkButton(
            input_frame,
            text="📄",
            width=40,
            command=self.export_pdf
        ).pack(side="left", padx=5)


    # =============================
    # QUICK SEND
    # =============================

    def quick_send(self, command):

        self.entry_box.delete(0, "end")

        self.entry_box.insert(0, command)

        self.send_message()


    # =============================
    # USER MESSAGE
    # =============================

    def display_user_message(self, text):

        bubble = ctk.CTkFrame(
            self.chat_frame,
            fg_color="#3B82F6",
            corner_radius=12
        )

        bubble.pack(
            anchor="e",
            padx=5,
            pady=4
        )

        ctk.CTkLabel(
            bubble,
            text=text,
            text_color="white",
            wraplength=400
        ).pack(
            padx=12,
            pady=8
        )


    # =============================
    # BOT MESSAGE
    # =============================

    def display_bot_message(self, text):

        bubble = ctk.CTkFrame(
            self.chat_frame,
            fg_color="#E5E7EB",
            corner_radius=12
        )

        bubble.pack(
            anchor="w",
            padx=5,
            pady=4
        )

        ctk.CTkLabel(
            bubble,
            text=text,
            wraplength=400
        ).pack(
            padx=12,
            pady=8
        )


    # =============================
    # COMMAND HANDLER
    # =============================

    def handle_commands(self, text):

        commands = {

            "open clubs": "clubs",
            "open calendar": "calendar",
            "open profile": "profile",
            "open notifications": "notifications"

        }

        for cmd in commands:

            if cmd in text:

                self.display_bot_message(
                    f"Opening {commands[cmd]}..."
                )

                if hasattr(
                    self.master.master,
                    f"show_{commands[cmd]}"
                ):

                    getattr(
                        self.master.master,
                        f"show_{commands[cmd]}"
                    )()

                return True

        return False


    # =============================
    # SEND MESSAGE
    # =============================

    def send_message(self):

        text = self.entry_box.get().lower()

        if not text:
            return

        self.display_user_message(text)

        self.entry_box.delete(0, "end")

        # Smart commands

        if self.handle_commands(text):
            return

        # FAQ search

        if text in faqs:

            self.display_bot_message(
                faqs[text]
            )

        else:

            suggestion = find_closest(
                text,
                list(faqs.keys())
            )

            if suggestion:

                self.display_bot_message(
                    f"Did you mean '{suggestion}'?"
                )

            else:

                self.display_bot_message(
                    "Sorry, I couldn't find that."
                )


    # =============================
    # VOICE INPUT
    # =============================

    def start_voice_thread(self):

        thread = threading.Thread(
            target=self.voice_input
        )

        thread.daemon = True

        thread.start()


    def voice_input(self):

        try:

            duration = 5
            sample_rate = 44100

            self.display_bot_message(
                "🎤 Listening..."
            )

            recording = sd.rec(
                int(duration * sample_rate),
                samplerate=sample_rate,
                channels=1,
                dtype="int16"
            )

            sd.wait()

            temp_file = tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".wav"
            )

            write(
                temp_file.name,
                sample_rate,
                recording
            )

            recognizer = sr.Recognizer()

            with sr.AudioFile(temp_file.name) as source:

                audio = recognizer.record(source)

                text = recognizer.recognize_google(audio)

                text = text.lower()

                self.display_user_message(text)

                self.entry_box.insert(0, text)

                self.send_message()

        except Exception as e:

            self.display_bot_message(
                f"Voice error: {str(e)}"
            )


    # =============================
    # EXPORT PDF
    # =============================

    def export_pdf(self):

        messages = []

        for widget in self.chat_frame.winfo_children():

            label = widget.winfo_children()[0]

            messages.append(
                label.cget("text")
            )

        doc = SimpleDocTemplate(
            f"chat_{self.user_role}.pdf"
        )

        styles = getSampleStyleSheet()

        story = []

        for line in messages:

            story.append(
                Paragraph(
                    line,
                    styles["Normal"]
                )
            )

        doc.build(story)

        self.display_bot_message(
            "📄 Chat exported to PDF."
        )