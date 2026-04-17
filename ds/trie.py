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


    def get_suggestions(self, prefix):

        node = self.root

        for char in prefix:

            if char not in node.children:
                return []

            node = node.children[char]

        words = []
        self._dfs(node, prefix, words)

        return words


    def _dfs(self, node, prefix, words):

        if node.is_end:
            words.append(prefix)

        for char in node.children:
            self._dfs(
                node.children[char],
                prefix + char,
                words
            )