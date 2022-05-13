INSERT INTO department (name)
VALUES  ("HR"),
        ("Payroll"),
        ("Finance"),
        ("Board of Trustee");

INSERT INTO role (title, salary, department_id)
VALUES  ("HR Director", 85000, 1),
        ("HR Assistant", 70000, 1),
        ("Payroll Manager", 80000, 2),
        ("Payroll Assistant", 65000, 2),
        ("Lead Accountant", 100000, 3),
        ("Assistant Accountant", 75000, 3),
        ("CEO", 300000, 4),
        ("CFO", 200000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES  ("Bryan", "Fury", null, 1),
        ("Jin", "Kazama", null, 3),
        ("Titus", "Knox", null, 5),
        ("Paul", "Phoenix", null, 7),
        ("Nina", "Williams", 1, 2),
        ("Lei", "Wulong", 2, 4),
        ("Eddy", "Gordo", 3, 6),
        ("Julia", "Chang", 4, 8);