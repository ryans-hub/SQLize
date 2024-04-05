INSERT INTO department (name)
VALUES
    ("Engineering"),
    ("Finance"),
    ("Marketing"),
    ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Jr. Software Engineer", 75000, 1),
    ("Accountant", 60000, 2),
    ("Product Specialist", 70000, 3),
    ("Sales Associate", 50000, 4),
    ("Sales Vice President", 80000, 4),
    ("Sr. Software Engineer", 110000, 1),
    ("Financial Analyst", 68000, 2),
    ("Product Manager", 79000, 1),
    ("Marketing Manager", 85000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Scott", 1, NULL),
    ("Dwight", "Schrute", 2, 1),
    ("Jim", "Halpert", 3, 1),
    ("Pam", "Beesly", 4, 1),
    ("Kelly", "Kapoor", 5, 1),
    ("Erin", "Hannon", 6, 2),
    ("Kevin", "Malone", 7, 2),
    ("Angela", "Martin", 8, 2),
    ("Oscar", "Martinez", 7, 2),
    ("Meredith", "Palmer", 8, 3),
    ("Phyllis", "Vance", 3, 3),
    ("Stanley", "Hudson", 4, 4),
    ("Andy", "Bernard", 3, 2),
    ("Toby", "Flenderson", 4, 4),
    ("Ryan", "Howard", 7, 1);


