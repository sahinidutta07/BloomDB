import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [bloomLevel, setBloomLevel] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestedQuestions = [
    {
      level: "Remember",
      question: "What is a DBMS?",
    },
    {
      level: "Understand",
      question: "Explain database normalization.",
    },
    {
      level: "Apply",
      question: "Convert this relation into 3NF.",
    },
    {
      level: "Analyze",
      question: "Analyze the anomalies in a database relation.",
    },
    {
      level: "Evaluate",
      question: "Evaluate this database schema.",
    },
    {
      level: "Create",
      question: "Design a database for a university.",
    },
  ];

  const askBloomDB = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setBloomLevel("");
    setSources([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from BloomDB.");
      }

      const data = await response.json();

      setAnswer(data.answer || "");
      setBloomLevel(data.bloom_level || "");
      setSources(data.source || []);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to BloomDB backend. Make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askBloomDB();
    }
  };

  const selectSuggestedQuestion = (selectedQuestion) => {
    setQuestion(selectedQuestion);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-gray-900">

      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              BloomDB
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Bloom's Taxonomy-Aware DBMS Learning Assistant
            </p>
          </div>

          <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">
            RAG + LLM
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-4xl px-6 py-12">

        {/* HERO */}
        <section className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">
            Ask your DBMS question
          </p>

          <h2 className="text-4xl font-bold tracking-tight">
            Learn DBMS with Bloom's Taxonomy
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Ask a question and BloomDB retrieves relevant textbook
            content, identifies the Bloom's Taxonomy level, and
            generates a grounded answer.
          </p>
        </section>

        {/* SUGGESTED QUESTIONS */}
        <section className="mb-6">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700">
              Try a question
            </p>

            <p className="text-xs text-gray-400">
              Explore questions across Bloom's Taxonomy levels
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {suggestedQuestions.map((item) => (
              <button
                key={item.question}
                onClick={() =>
                  selectSuggestedQuestion(item.question)
                }
                className="group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {item.level}
                  </span>

                  <span className="text-gray-300 transition group-hover:text-gray-500">
                    →
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-800">
                  {item.question}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* QUESTION BOX */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. What is a DBMS?"
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Press Enter to ask
            </p>

            <button
              onClick={askBloomDB}
              disabled={loading || !question.trim()}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Thinking..." : "Ask BloomDB"}
            </button>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* RESULTS */}
        {answer && (
          <section className="mt-8 space-y-5">

            {/* BLOOM LEVEL */}
            {bloomLevel && (
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Bloom's Taxonomy
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {bloomLevel}
                  </p>
                </div>

                <div className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600">
                  Detected Level
                </div>
              </div>
            )}

            {/* ANSWER */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Answer
                </h3>

                <span className="text-xs text-gray-400">
                  BloomDB
                </span>
              </div>

              <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {answer}
              </div>
            </div>

            {/* SOURCES */}
            {sources.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h3 className="text-lg font-bold">
                    Sources
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Retrieved from the BloomDB textbook knowledge base
                  </p>
                </div>

                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <div
                      key={`${source.source}-${source.page}-${index}`}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {getBookDisplayName(source.source)}
                      </p>

                      {source.page && (
                        <p className="mt-1 text-xs text-gray-500">
                          Page {source.page}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-gray-400">
          BloomDB • Bloom's Taxonomy + RAG + DBMS Textbooks
        </div>
      </footer>

    </div>
  );
}


/* BOOK NAME FORMATTER */
function getBookDisplayName(filename) {
  const bookNames = {
    "fundamentals-of-database-systems.pdf":
      "Fundamentals of Database Systems — Elmasri & Navathe",

    "Abraham-Silberschatz-Henry-F.-Korth-S.-Sudarshan-Database-System-Concepts-McGraw-Hill-Education-2019.pdf":
      "Database System Concepts — Silberschatz, Korth & Sudarshan",

    "An-Introduction-to-Database-Systems-8e-By-C-J-Date-CodeBlah.com_.pdf":
      "An Introduction to Database Systems — C. J. Date",

    "ullman_the_complete_book.pdf":
      "The Complete Book — Ullman & Widom",
  };

  return (
    bookNames[filename] ||
    filename
      .replace(".pdf", "")
      .replaceAll("_", " ")
      .replaceAll("-", " ")
  );
}

export default App;