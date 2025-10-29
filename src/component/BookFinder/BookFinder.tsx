import React, { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { ClipLoader } from "react-spinners";
import BookModal from "./Model";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

const BookFinder: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<"title" | "author">("title");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isDefaultMode, setIsDefaultMode] = useState<boolean>(true); // 👈 new state

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Fetch Books
  const fetchBooks = async (
    pageNum: number,
    search: string,
    reset = false,
    defaultMode = false
  ) => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        searchType === "title"
          ? `https://openlibrary.org/search.json?title=${encodeURIComponent(
              search
            )}&page=${pageNum}`
          : `https://openlibrary.org/search.json?author=${encodeURIComponent(
              search
            )}&page=${pageNum}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      const newBooks = defaultMode
        ? data.docs.slice(0, 20)
        : data.docs.slice(0, 20);

      setBooks((prev) => (reset ? newBooks : [...prev, ...newBooks]));
      setHasMore(!defaultMode && newBooks.length > 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1, "harry potter", true, true);
  }, []);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsDefaultMode(false);
    setPage(1);
    setBooks([]);
    fetchBooks(1, query, true);
  };

  useEffect(() => {
    if (isDefaultMode) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, isDefaultMode]);

  useEffect(() => {
    if (!isDefaultMode && page > 1) {
      fetchBooks(page, query);
    }
  }, [page]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Book Finder 📚
      </h1>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex justify-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="title"
              checked={searchType === "title"}
              onChange={() => setSearchType("title")}
            />
            <span>By Title</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="author"
              checked={searchType === "author"}
              onChange={() => setSearchType("author")}
            />
            <span>By Author</span>
          </label>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {error && <p className="text-center mt-4 text-red-600">{error}</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {books.map((book) => (
          <div
            key={book.key}
            onClick={() => setSelectedBook(book.key)}
            className="p-4 rounded-xl cursor-pointer shadow-xl hover:shadow-2xl transition bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {book.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Author: {book.author_name?.join(", ") || "Unknown"}
            </p>
            <p className="text-sm text-gray-500">
              Year: {book.first_publish_year || "N/A"}
            </p>
            {book.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="mt-3 rounded-lg w-32 h-auto mx-auto"
              />
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          <ClipLoader color="#2563eb" />
        </div>
      )}

      {!isDefaultMode && <div ref={loaderRef} style={{ height: 40 }} />}

      {!loading && !error && books.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          Try searching a book or author ✨
        </p>
      )}

      {selectedBook && (
        <BookModal
          workKey={selectedBook}
          open={!!selectedBook}
          onClose={() => setSelectedBook("")}
        />
      )}
    </div>
  );
};

export default BookFinder;
