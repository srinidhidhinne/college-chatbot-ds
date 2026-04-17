import json
from ds.trie import Trie
from chatbot.utils import find_closest
from chatbot.utils import keyword_match
from ds.linked_list import LinkedList
from ds.tree import CategoryTree


# Load FAQ data
with open("DataFolder/faqs.json", "r") as file:
    faqs = json.load(file)


# Create Trie
trie = Trie()

for question in faqs.keys():
    trie.insert(question)


# Create Linked List
history = LinkedList()


# Create Tree
tree = CategoryTree()


# Add categories
tree.add_category("Hostel")
tree.add_category("Library")
tree.add_category("Admission")


# Add questions
tree.add_question("Hostel", "hostel fees")
tree.add_question("Hostel", "hostel rules")

tree.add_question("Library", "library timing")
tree.add_question("Library", "library location")

tree.add_question("Admission", "admission fees")
tree.add_question("Admission", "admission process")


# Load old history
try:
    with open("DataFolder/history.txt", "r") as file:

        for line in file:
            history.append(line.strip())

except FileNotFoundError:
    pass


def ask_question():

    user_input = input("Enter your question: ").lower()

    history.append(user_input)

    # Exact match
    if user_input in faqs:

        print("Bot:", faqs[user_input])
        return

    # Trie suggestions
    suggestions = trie.get_suggestions(user_input)

    if suggestions:

        print("Did you mean:")

        for s in suggestions[:5]:
            print("-", s)

        return

    # Keyword match
    keyword_result = keyword_match(
        user_input,
        list(faqs.keys())
    )

    if keyword_result:

        print("Did you mean:", keyword_result)
        return

    # Spell correction
    closest = find_closest(
        user_input,
        list(faqs.keys())
    )

    if closest:

        print("Did you mean:", closest)

    else:

        print("Bot: Sorry, I don't know that")


# MAIN MENU LOOP
while True:

    print("\n====== COLLEGE CHATBOT ======")
    print("1. Ask Question")
    print("2. Show Categories")
    print("3. Search Category")
    print("4. View History")
    print("5. Exit")

    choice = input("Enter choice: ")


    if choice == "1":

        ask_question()


    elif choice == "2":

        tree.show_categories()


    elif choice == "3":

        category = input(
            "Enter category name: "
        )

        tree.search_category(category)


    elif choice == "4":

        print("\nChat History:")
        history.display()


    elif choice == "5":

        history.save_to_file(
            "DataFolder/history.txt"
        )

        print("Goodbye!")
        break


    else:

        print("Invalid choice!")