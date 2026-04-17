class TreeNode:

    def __init__(self, data):
        self.data = data
        self.children = []


class CategoryTree:

    def __init__(self):
        self.root = TreeNode("College")


    def add_category(self, category):

        new_node = TreeNode(category)
        self.root.children.append(new_node)


    def add_question(self, category, question):

        for node in self.root.children:

            if node.data == category:
                node.children.append(TreeNode(question))


    def show_categories(self):

        print("\nCategories:")

        for node in self.root.children:
            print("-", node.data)


    def show_questions(self, category):

        for node in self.root.children:

            if node.data.lower() == category.lower():

                print("\nQuestions under", category, ":")

                for child in node.children:
                    print("-", child.data)

                return

        print("Category not found.")


    def search_category(self, category):

        for node in self.root.children:

            if node.data.lower() == category.lower():

                print("\nResults in", category, ":")

                for child in node.children:
                    print("-", child.data)

                return

        print("Category not found.")