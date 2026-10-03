def detect_bloom_level(question):
    question = question.lower().strip()

    if any(word in question for word in [
        "design", "create", "develop", "construct", "build", "propose"
    ]):
        return "Create"

    if any(word in question for word in [
        "evaluate", "justify", "critique", "assess", "defend"
    ]):
        return "Evaluate"

    if any(word in question for word in [
        "analyze", "analyse", "compare", "differentiate",
        "examine", "why does", "relationship"
    ]):
        return "Analyze"

    if any(word in question for word in [
        "solve", "calculate", "implement", "convert",
        "apply", "demonstrate", "use"
    ]):
        return "Apply"

    if any(word in question for word in [
        "explain", "describe", "summarize", "interpret",
        "discuss", "how does"
    ]):
        return "Understand"

    if any(word in question for word in [
        "what is", "define", "list", "name", "identify",
        "when", "who"
    ]):
        return "Remember"

    return "Understand"


if __name__ == "__main__":
    questions = [
        "What is a DBMS?",
        "Explain normalization.",
        "Convert this relation into 3NF.",
        "Analyze the anomalies in this database.",
        "Evaluate whether this schema is properly normalized.",
        "Design a database for a college system."
    ]

    for question in questions:
        level = detect_bloom_level(question)
        print(f"{level:10} | {question}")