import customtkinter as ctk


class ChatbotUI(ctk.CTkFrame):

    def __init__(self, parent):
        super().__init__(parent)

        self.pack(fill="both", expand=True)

        ctk.CTkLabel(
            self,
            text="🤖 Chatbot",
            font=("Arial", 24, "bold")
        ).pack(pady=10)

        self.chat = ctk.CTkTextbox(self)
        self.chat.pack(fill="both", expand=True, padx=20)

        self.entry = ctk.CTkEntry(self)
        self.entry.pack(fill="x", padx=20, pady=10)

        ctk.CTkButton(
            self,
            text="Send",
            command=self.send
        ).pack(pady=5)

    def send(self):
        msg = self.entry.get()
        self.chat.insert("end", f"You: {msg}\nBot: Working...\n")
        self.entry.delete(0, "end")