class Node:

    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:

    def __init__(self):
        self.head = None


    def append(self, data):

        new_node = Node(data)

        if not self.head:
            self.head = new_node
            return

        current = self.head

        while current.next:
            current = current.next

        current.next = new_node


    def display(self):

        current = self.head
        count = 1

        while current:

            print(count, ".", current.data)

            current = current.next
            count += 1


    def save_to_file(self, filename):

        current = self.head

        with open(filename, "w") as file:

            while current:

                file.write(current.data + "\n")
                current = current.next