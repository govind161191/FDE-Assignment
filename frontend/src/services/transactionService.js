import api from "../api";

export const borrowBook = (book_id, borrower_id) =>
  api.post("/borrow", { book_id, borrower_id }).then((r) => r.data);
export const returnBook = (transaction_id) =>
  api.post("/return", { transaction_id }).then((r) => r.data);
export const getTransactions = (activeOnly = false) =>
  api.get("/transactions", { params: { active_only: activeOnly } }).then((r) => r.data);
export const getDashboardStats = () =>
  api.get("/dashboard/stats").then((r) => r.data);
