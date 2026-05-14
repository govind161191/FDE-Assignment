-- Sample data — works on both SQLite and PostgreSQL.
INSERT INTO books (title, author, category, isbn, availability_status) VALUES
  ('Clean Code', 'Robert C. Martin', 'Programming', '9780132350884', 'Available'),
  ('The Pragmatic Programmer', 'Andrew Hunt', 'Programming', '9780201616224', 'Available'),
  ('Designing Data-Intensive Applications', 'Martin Kleppmann', 'Databases', '9781449373320', 'Available'),
  ('Atomic Habits', 'James Clear', 'Self-help', '9780735211292', 'Available'),
  ('Sapiens', 'Yuval Noah Harari', 'History', '9780062316097', 'Available'),
  ('Deep Learning', 'Ian Goodfellow', 'AI/ML', '9780262035613', 'Available'),
  ('The Lean Startup', 'Eric Ries', 'Business', '9780307887894', 'Available'),
  ('Introduction to Algorithms', 'Thomas H. Cormen', 'Algorithms', '9780262033848', 'Available'),
  ('Fluent Python', 'Luciano Ramalho', 'Programming', '9781491946008', 'Available'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '9780743273565', 'Available');

INSERT INTO borrowers (borrower_name, email, phone) VALUES
  ('Govind Kumar', 'govind@example.com', '9876543210'),
  ('Priya Sharma', 'priya@example.com', '9123456780'),
  ('Rahul Verma', 'rahul@example.com', '9988776655');
