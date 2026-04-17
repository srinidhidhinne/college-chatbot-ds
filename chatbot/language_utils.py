# from googletrans import Translator

# translator = Translator()

# # Supported languages
# LANGUAGES = {
#     "English": "en",
#     "Hindi": "hi",
#     "Telugu": "te"
# }

# current_language = "en"


# def set_language(lang_name):

#     global current_language

#     if lang_name in LANGUAGES:
#         current_language = LANGUAGES[lang_name]


# def translate_to_selected(text):

#     if current_language == "en":
#         return text

#     try:

#         result = translator.translate(
#             text,
#             dest=current_language
#         )

#         return result.text

#     except:

#         return text


# def translate_to_english(text):

#     try:

#         result = translator.translate(
#             text,
#             dest="en"
#         )

#         return result.text.lower()

#     except:

#         return text.lower()