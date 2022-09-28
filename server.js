const inquirer = require(`inquirer`);
const mysql = require(`mysql2`);
const consoleTable = require(`console.table`);

require(`dotenv`).config();

const db_connection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: ``,
    database: `employee`
});

db_connection.connect(err => {
    if (err) throw err;
    init();
});

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
            `Update`
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
        }
    }   
)}

viewDepartments = () => {
    db_connection.query(),
    (err, answer) => {
        if (err) throw err;
        console.table(answer);
        init();
    }
}

viewRoles = () => {
    db_connection.query(),
    (err, answer) => {
        if (err) throw err;
        console.table(answer);
        init();
    }
}

viewEmployees = () => {
    db_connection.query(),
    (err, answer) => {
        if (err) throw err;
        console.table(answer);
        init();
    }
}

addDepartment = () => {
    db_connection.query(
        `SELECT department.name FROM department`, (err, data) => {
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

addRole = () => {
    db_connection.query(
        `SELECT role.name FROM role`, (err, data) => {
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
                message: `Whatis the role's salary?`
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

addEmployee = () => {
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
            choices: employeeRole()
        },
        {
            type: `rawlist`,
            name: `manager`,
            message: `Who is the employee's manager?`,
            choices: employeeManager()
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
          }, (err) => {
            if (err) throw err;
            console.table(answers)
            start();
          })
        });
      }

update = () => {
    db_connection.query(),
    (err, answer) => {
        if (err) throw err;
        console.table(answer);
        init();
    }
}