def edit_distance(word1, word2):

    len1 = len(word1)
    len2 = len(word2)

    dp = [[0 for _ in range(len2 + 1)]
          for _ in range(len1 + 1)]

    for i in range(len1 + 1):
        dp[i][0] = i

    for j in range(len2 + 1):
        dp[0][j] = j

    for i in range(1, len1 + 1):

        for j in range(1, len2 + 1):

            if word1[i - 1] == word2[j - 1]:

                dp[i][j] = dp[i - 1][j - 1]

            else:

                dp[i][j] = 1 + min(
                    dp[i - 1][j],
                    dp[i][j - 1],
                    dp[i - 1][j - 1]
                )

    return dp[len1][len2]


# =============================
# IMPROVED CLOSEST MATCH
# =============================

def find_closest(word, word_list):

    best_match = None
    min_distance = float("inf")

    for w in word_list:

        distance = edit_distance(word, w)

        if distance < min_distance:

            min_distance = distance
            best_match = w

    # IMPORTANT FILTER
    # Only return if similarity reasonable

    if min_distance <= max(2, len(word)//2):
        return best_match

    return None


# =============================
# KEYWORD MATCHING
# =============================

def keyword_match(user_input, faq_list):

    user_words = user_input.split()

    best_match = None
    best_score = 0

    for faq in faq_list:

        faq_words = faq.split()

        score = 0

        for word in user_words:

            if word in faq_words:
                score += 1

        if score > best_score:

            best_score = score
            best_match = faq

    # Only return if meaningful match
    if best_score > 0:
        return best_match

    return None