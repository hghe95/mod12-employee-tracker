const inquirer = require(`inquirer`);
const mysql = require(`mysql2`);
const consoleTable = require('console.table');

const db_connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log(`Now connected to employee_db`)
);

db_connection.connect(function (err) {
    if(err) throw err;
    init();
});

consoleTable(`\n
,-------------------------------------------------------------;
|  _____                    _                                 |
| | ____|  __  __   _____  | |  _____   _   _   ____   _____  |
| | |_    | |_|  | |  _  | | | |  _  | | | | | | __ | | __  | |
| |  _|   |  __  | | |_| | | | | | | | | |_| | |  __| |  ___| |
| | |___  | |  | | |  ___| | | | |_| | |__,  | |  |_  |  |__  |
| |_____| |_|  |_| |  |    |_| |_____|  __|  | |____| |_____| |
|                  |__|                |_____|                |
|   __  __   __ __   _ ___    _____   __ __   ____   _ __     |
|  |  \\/  | /  _  | | '_  \\  /  _  | /  _  | | __ | | ' _|   |
|  | |\\/| | | | | | | | |  | | | | | | | | | |   _| |  |      |
|  | |  | | | |_| | | | |  | | |_| | | |_| | |  |_  |  |      |
|  |_|  |_| \\__,__| |_| |__| \\__,__| \\___, | |____| |__|      |
|                                     |____/                  |
,-------------------------------------------------------------;
\n`);

init = () => {
    inquirer.prompt ({
        name: `choices`,
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
    .then((answers) => {
        const choices = answers

        if (choices === `View all departments`) {
            viewDepartments();
        } else if (choices === `View all roles`) {
            viewRoles();
        } else if (choices === `View all employees`) {
            viewEmployees();
        } else if (choices === `Add a department`) {
            addDepartment();
        } else if (choices === `Add a role`) {
            addRole();
        } else if (choices === `Add an employee`) {
            addEmployee();
        } else if (choices === `Update`) {
            update();
        } else if (choices === `End`) {
            db_connection.end();
        }
    }   
)}

viewDepartments = async() => {
    db_connection.query(`SELECT dept_id AS Department_ID, department.name AS Department_Name FROM department`),
    (err, answer) => {
        if (err) throw err;
        consoleTable(answer);
        init();
    }
}

viewRoles = async() => {
    db_connection.query(
        `SELECT employee.first_name AS firstName, 
        employee.last_name AS lastName, 
        role.title AS roleTitle FROM employee JOIN role ON employee.role_id = role.id;`),
    (err, answer) => {
        if (err) throw err;
        consoleTable(answer);
        init();
    }
}

viewEmployees = async() => {
    db_connection.query(
        `SELECT employee.first_name AS firstName, 
        employee.last_name AS lastName, 
        role.title AS roleTitle, 
        department.name AS departmentName, 
        CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;`),
    (err, answer) => {
        if (err) throw err;
        consoleTable(answer);
        init();
    }
}

addDepartment = async() => {
    db_connection.query(
        `SELECT departmentName FROM department`, (err, data) => {
            if (err) throw err;
                inquirer.prompt([
                    {
                        name: `departmentName`,
                        type: `input`,
                        message: `What is the name of the Department?`
                    }
                ])
            .then((answer) => {
            connection.query(
                `INSERT INTO department SET ?`,
                {
                name: answer.departmentName
                },
                (err) => {
                if (err) throw err;
                console.log("\n New department has been added! \n");
                init();
                }
            );
        });
    })
}

addRole = async() => {
    db_connection.query(
        `SELECT roleName FROM role`, (err, data) => {
          if (err) throw err;
        inquirer.prompt([
            {
                name: `titleName`,
                type: `input`,
                message: `What is the role title?`
            },
            {
                name: `roleSalary`,
                type: `input`,
                message: `What is the role's salary?`
            }
            ])
            .then((answer) => {
            connection.query(
                `INSERT INTO role SET ?`,
                {
                title: answer.titleName,
                salary: answer.roleSalary,
                },
                (err) => {
                if (err) throw err;
                console.log("\n New role title has been added! \n");
                init();
                }
            );
        });
    })
}

addEmployee = async() => {
    inquirer.prompt([
        {
            type: `string`,
            name: `firstName`,
            message: `What is the employee's first name?`,
        },
        {
            type: `string`,
            name: `lastName`,
            message: `What is the employee's last name?`,
        },
        {
            type: `rawlist`,
            name: `role`,
            message: `What is the employee's role?`,
            choices: employeeRole
        },
        {
            type: `rawlist`,
            name: `manager`,
            message: `Who is the employee's manager?`,
            choices: employeeManager
        }
      ])
        .then((answers) => {
            const roleID = employeeRole().indexOf(answers.role);
            const managerID = empManager().indexOf(answers.manager);
            connection.query(`INSERT INTO employee SET ?`, 
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            manager_id: managerID,
            role_id: roleID
          }, 
            (err) => {
            if (err) throw err;
            consoleTable(answers)
            init();
          })
        });
      }

update = async() => {
    db_connection.query(`SELECT * FROM employee`, (err, employeeData) => {
        if (err) throw err;
    db_connection.query(`SELECT * FROM role`, (err, roleData) => {
        if (err) throw err;
            inquirer.prompt([
                {
                    name: `employeeName`,
                    type: `rawlist`,
                    message: `Select which employee's role you would like to update`,
                    choices: employeeData.map(function(data) {
                        return `${data.firstName} ${lastName}`
                    })
                },
                {
                    name: `employeeRole`,
                    type: `rawlist`,
                    message: `What is this employee's new role?`,
                    choices: roleData.map(function(data) {
                        return data.title
                    })
                }
            ])
            .then (answers => {
                db_connection.query(
                    `UPDATE employee SET ? Where ?`,
                [
                    {
                        role_id: employeeData.find(function(data) {
                            return data.title === answers.employeeRole
                        })
                    },
                    {
                        id: roleData.find(function(data) {
                            return `${data.firstName} ${data.lastName}` === answers.employeeName;
                        })
                    }    
                ],
                function(err) {
                    if (err) throw err;
                    console.log(`/n The empoloyee's role has been updated`);
                    init();
                }   
                )
            })
        })
    })      
}