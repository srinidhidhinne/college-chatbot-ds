class TrieNode:

    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:

    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):

        node = self.root

        for char in word:

            if char not in node.children:
                node.children[char] = TrieNode()

            node = node.children[char]

        node.is_end = True

    # Search prefix node
    def search_prefix(self, prefix):

        node = self.root

        for char in prefix:

            if char not in node.children:
                return None

            node = node.children[char]

        return node

    # Collect suggestions
    def suggestions_helper(self, node, prefix, results):

        if node.is_end:
            results.append(prefix)

        for char in node.children:
            self.suggestions_helper(
                node.children[char],
                prefix + char,
                results
            )

    # Get suggestions
    def get_suggestions(self, prefix):

        results = []

        node = self.search_prefix(prefix)

        if node:
            self.suggestions_helper(node, prefix, results)

        return results