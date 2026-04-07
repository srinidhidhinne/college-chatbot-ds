import json
from ds.trie import Trie

# Load FAQ data
with open("DataFolder/faqs.json", "r") as file:
    faqs = json.load(file)

# Create Trie
trie = Trie()

# Insert questions into Trie
for question in faqs.keys():
    trie.insert(question)

print("College Chatbot Started!")
print("Type 'exit' to stop")

while True:

    user_input = input("You: ").lower()

    if user_input == "exit":
        break

    # Show suggestions if not exact match
    if user_input not in faqs:

        suggestions = trie.get_suggestions(user_input)

        if suggestions:
            print("Did you mean:")

            for s in suggestions[:5]:
                print("-", s)

        else:
            print("Bot: Sorry, I don't know that")

    else:

        print("Bot:", faqs[user_input])