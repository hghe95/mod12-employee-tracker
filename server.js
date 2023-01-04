const inquirer = require(`inquirer`);
const mysql = require(`mysql2`);
const consoleTable = require('console.table');
const { connection } = require('mongoose');

const db_connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'employee_db'
    },
);

db_connection.connect(function (err) {
    if(err) throw err;
    init();
});

console.table(`\n
,-------------------------------------------------------------;
|  _____                    _                                 |
| | ____|  __  __   _____  | |  _____   _   _   ____   _____  |
| | |_    | |_|  | |  _  | | | |  _  | | | | | | __ | | __  | |
| |  _|   |  __  | | |_| | | | | | | | | |_| | |  __| |  ___| |
| | |___  | |  | | |  ___| | | | |_| | |__,  | |  |_  |  |__  |
| |_____| |_|  |_| |  |    |_| |_____|  __|  | |____| |_____| |
|                  |__|                |_____|                |
|   __   __   __ __   _ ___     _____    __ __  ____   _ __   |
|  |  \\/  | /  _  | | '_  \\  /  _  |  /  _  || __ | | ' _|  |
|  | |\\/| | | | | | | | |  | | | | |  | | |  ||  __| |  |    |
|  | |   | | | |_| | | | |  | | |_| |  | |_|  || |__  |  |    |
|  |_|   |_| \\__,__||_| |__| \\__,__|  \\___,||____| |__|    |
|                                        |____/               |
,-------------------------------------------------------------;
\n`);

init = () => {
    inquirer.prompt ({
        name: `action`,
        type: `list`,
        message: `Please select an action`,
        choices: 
        [
            `View all departments`,
            `View all roles`,
            `View all employees`,
            `Add a department`,
            `Add a role`,
            `Add an employee`,
            `Update`,
            `End`
        ]
    })
    .then((choices) => {
        switch(choices.action) {
            case `View all departments`:
                viewDepartments();
                break;
            case `View all roles`:
                viewRoles();
                break;
            case `View all employees`:
                viewEmployees();
                break;
            case `Add a department`:
                addDepartment();
                break;
            case `Add a role`:
                addRole();
                break;
            case `Add an employee`:
                addEmployee();
                break;
            case `Update`:
                update();
                break;
            case `End`:
                db_connection.end();
                break;
        }
    });
}

viewDepartments = async() => {
    db_connection.query(`SELECT * FROM department`,
    (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`All departments have been viewed. \n`);
        init();
    });
    
}

viewRoles = async() => {
    db_connection.query(
        `SELECT * FROM role`,
    (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`All employee roles have been viewed. \n`);
        init();
    });
    
}

viewEmployees = async() => {
    db_connection.query(
        `SELECT * FROM employee`,
    (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`All current employees have been viewed. \n`);
        init();
    });
}

addDepartment = async() => {
    db_connection.query(
        `SELECT name FROM department`, (err, res) => {
            if (err) throw err;
                inquirer.prompt([
                    {
                        name: `name`,
                        type: `input`,
                        message: `What is the name of the Department?`
                    }
                ])
            .then((answer) => {
            db_connection.query(
                `INSERT INTO department SET name`,
                {
                name: answer.name
                },
                (err) => {
                    if (err) throw err;
                    console.log("\n New department has been added! \n");
                    init();
                },
            );
        });
    });
}

addRole = async() => {
    db_connection.query(
        `SELECT title, salary FROM role`, (err, res) => {
          if (err) throw err;
            inquirer.prompt([
                {
                    name: `title`,
                    type: `input`,
                    message: `What is the role title?`
                },
                {
                    name: `salary`,
                    type: `input`,
                    message: `What is the role's salary?`
                },
                ])
                .then((answer) => {
                    const roleInfo = [answer.title, answer.salary];
                    db_connection.query(
                        `SELECT id, name FROM department`, (err, res) => {
                            if (err) throw err;
                            const deptInfo = res.map(({ id, title}) => ({ name: title, value: id}));
                            inquirer.prompt([
                                {
                                    type: `list`,
                                    name: `department`,
                                    message: `What is the role's department?`,
                                    choices: deptInfo
                                }
                            ])
                            .then((roleDept) => {
                                const deptChoice = roleDept;
                                roleInfo.push(deptChoice);
                                db_connection.query(
                                    `INSERT INTO role SET ?`,
                                    {
                                        title: answer.title,
                                        salary: answer.salary,
                                    },
                                    (err) => {
                                        if (err) throw err;
                                        console.log(`\n New role title has been added! \n`);
                                        init();
                                    })
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}

addEmployee = async() => {
    inquirer.prompt([
        {
            type: `input`,
            name: `firstName`,
            message: `What is the employee's first name?`,
        },
        {
            type: `input`,
            name: `lastName`,
            message: `What is the employee's last name?`,
        },
      ])
        .then((answer) => {
        const employeeInfo = [answer.firstName, answer.lastName];
                db_connection.query(
                    `SELECT role.id, role.title FROM role`, (err, res) => {
                        if (err) throw err;
                        const roles = res.map(({ id, title}) => ({ name: title, value: id}));
                        inquirer.prompt([
                            {
                                type: `list`,
                                name: `role`,
                                message: `What is the employee's role?`,
                                choices: roles
                            }
                        ])
                        .then((roleChoice) => {
                            const chosenRole = roleChoice;
                            employeeInfo.push(chosenRole);
                            db_connection.query(
                                `SELECT * FROM employee`, (err, res) => {
                                    if (err) throw err;
                                    const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));
                                    inquirer.prompt([
                                        {
                                            type: `list`,
                                            name: `manager`,
                                            message: `Who is the manager of the employee?`,
                                            choies: managers
                                        }
                                    ])
                                    .then(managerChoice => {
                                        const chosenManager = managerChoice.chosenManager;
                                        employeeInfo.push(chosenManager);
                                        connection.query(
                                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, 
                                            employeeInfo, 
                                            (err) => {
                                                if (err) throw err;
                                                console.log(`\n New employee has been added! \n`);
                                                init();
                                            })
                                            } 
                                        )
                                    }
                                    )
                                }   
                            )}
                        );
                    }
            );
}


update = async() => {
    db_connection.query(
        `SELECT * FROM employee`, (err, res) => {
          if (err) throw err;
        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            inquirer.prompt([
                {
                    name: `title`,
                    type: `input`,
                    message: `What is the name of the employee who needs to update?`,
                    choices: employees
                },
            ])
                .then((answer) => {
                    const employee = answer.name;
                    const employeeInfo = [];
                    employeeInfo.push(employee);
                    
                    db_connection.query(
                        `SELECT * FROM role`, (err, res) => {
                            if (err) throw err;
                            const roles = res.map(({ id, title}) => ({ name: title, value: id}));
                            inquirer.prompt([
                                {
                                    type: `list`,
                                    name: `department`,
                                    message: `What will be the emperor's new role?`,
                                    choices: roles
                                }
                            ])
                            .then((roleChoice) => {
                                const chosenRole = roleChoice.chosenRole;
                                employeeInfo.push(chosenRole);
                                db_connection.query(
                                    `UPDATE employee SET role_id = ? WHERE id = ?`,
                                    employeeInfo,
                                    (err) => {
                                        if (err) throw err;
                                        console.log(`\n New role title has been added! \n`);
                                        init();
                                    })
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}