// API service để fetch dữ liệu từ database.json trong public folder
const API_BASE_URL = ""; // Sử dụng public folder

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

