// API service: read from public for static content, write via json-server for CRUD
const API_BASE_URL = ""; // public folder (read-only at runtime)
const JSON_SERVER_URL = "http://localhost:9999"; // json-server must watch public/database.json

// Fetch toàn bộ database
export const fetchDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/database.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching database:", error);
    throw error;
  }
};

// Fetch books
export const fetchBooks = async () => {
  const data = await fetchDatabase();
  return data.books || [];
};

// Fetch books by source (featured, new, bestseller)
export const fetchBooksBySource = async (source) => {
  const books = await fetchBooks();
  return books.filter(book => book.source === source);
};

// Fetch featured books
export const fetchFeaturedBooks = async () => {
  return fetchBooksBySource("featured");
};

// Fetch new books
export const fetchNewBooks = async () => {
  return fetchBooksBySource("new");
};

// Fetch bestseller books
export const fetchBestsellerBooks = async () => {
  return fetchBooksBySource("bestseller");
};

// Fetch categories
export const fetchCategories = async () => {
  const data = await fetchDatabase();
  return data.categories || [];
};

// Fetch promotions
export const fetchPromotions = async () => {
  const data = await fetchDatabase();
  return data.promotions || {};
};

// Fetch stats
export const fetchStats = async () => {
  const data = await fetchDatabase();
  return data.stats || {};
};

// Fetch users
export const fetchUsers = async () => {
  const data = await fetchDatabase();
  return data.users || [];
};

// Fetch user by email
export const fetchUserByEmail = async (email) => {
  const users = await fetchUsers();
  return users.find(user => user.email === email);
};

// Fetch book by id
export const fetchBookById = async (id) => {
  const books = await fetchBooks();
  return books.find(book => book.id === id);
};

// Fetch books by category
export const fetchBooksByCategory = async (category) => {
  const books = await fetchBooks();
  return books.filter(book => book.category === category);
};

// ---------- JSON-SERVER CRUD (books) ----------
export const fetchBooksFromServer = async () => {
  const res = await fetch(`${JSON_SERVER_URL}/books`);
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`);
  return await res.json();
};

export const fetchBookFromServer = async (id) => {
  const res = await fetch(`${JSON_SERVER_URL}/books/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch book ${id}: ${res.status}`);
  return await res.json();
};

export const createBookOnServer = async (book) => {
  const res = await fetch(`${JSON_SERVER_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error(`Failed to create book: ${res.status}`);
  return await res.json();
};

export const updateBookOnServer = async (id, book) => {
  const res = await fetch(`${JSON_SERVER_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error(`Failed to update book ${id}: ${res.status}`);
  return await res.json();
};

export const deleteBookOnServer = async (id) => {
  const res = await fetch(`${JSON_SERVER_URL}/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete book ${id}: ${res.status}`);
  return true;
};

// ---------- JSON-SERVER CRUD (feedbacks) ----------
export const fetchFeedbacksByBookId = async (bookId) => {
  const res = await fetch(`${JSON_SERVER_URL}/feedbacks?bookId=${encodeURIComponent(bookId)}`);
  if (!res.ok) throw new Error(`Failed to fetch feedbacks: ${res.status}`);
  return await res.json();
};

export const createFeedbackOnServer = async (feedback) => {
  const res = await fetch(`${JSON_SERVER_URL}/feedbacks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback),
  });
  if (!res.ok) throw new Error(`Failed to create feedback: ${res.status}`);
  return await res.json();
};

export const fetchAllFeedbacksFromServer = async () => {
  const res = await fetch(`${JSON_SERVER_URL}/feedbacks`);
  if (!res.ok) throw new Error(`Failed to fetch feedbacks: ${res.status}`);
  return await res.json();
};

export const updateFeedbackOnServer = async (id, patch) => {
  const res = await fetch(`${JSON_SERVER_URL}/feedbacks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update feedback ${id}: ${res.status}`);
  return await res.json();
};