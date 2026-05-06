import customtkinter as ctk


# =============================
# PAGE HEADER
# =============================

def create_header(parent, title):

    header = ctk.CTkFrame(parent, fg_color="transparent")
    header.pack(fill="x", pady=10, padx=20)

    ctk.CTkLabel(
        header,
        text=title,
        font=("Arial", 24, "bold")
    ).pack(anchor="w")

    return header


# =============================
# CARD COMPONENT
# =============================

def create_card(parent, title, value, subtitle=""):

    card = ctk.CTkFrame(
        parent,
        corner_radius=15
    )
    card.pack(fill="x", padx=20, pady=10)

    ctk.CTkLabel(
        card,
        text=title,
        font=("Arial", 14)
    ).pack(anchor="w", padx=15, pady=(10, 0))

    ctk.CTkLabel(
        card,
        text=value,
        font=("Arial", 22, "bold")
    ).pack(anchor="w", padx=15)

    if subtitle:
        ctk.CTkLabel(
            card,
            text=subtitle,
            font=("Arial", 12),
            text_color="gray"
        ).pack(anchor="w", padx=15, pady=(0, 10))

    return card