INSERT INTO department (name)
VALUES (`Finance`), 
       (`Conservation`), 
       (`Transactions`), 
       (`Marketing`);

INSERT INTO role (title, salary, department_id)
VALUES (`Accountant`, 60000, 1), 
       (`Managing Director`, 70000, 2), 
       (`Director of Real Estate`, 80000, 3), 
       (`Coordinator`, 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES (`Katherine`, `Nechaeva`, 1, 1), 
       (`Joe`, `Sambataro`, 2, null), 
       (`Jenna`, `Poe`, 3, null), 
       (`Kelsey`, `Bray`, 4, 2);