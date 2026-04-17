# ds/stack.py

class Stack:

    def __init__(self):

        self.items = []


    # Push item
    def push(self, item):

        self.items.append(item)


    # Pop item
    def pop(self):

        if not self.is_empty():

            return self.items.pop()

        return None


    # Check empty
    def is_empty(self):

        return len(self.items) == 0


    # Get last N items
    def get_last_items(self, n=5):

        return self.items[-n:]