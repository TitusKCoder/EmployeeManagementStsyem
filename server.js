const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Dusty825$$",
        database: "ems_db",
    },
    console.log('connected')
);

db.connect(function () {
    console.log(`Connected to Employee Tracker Database`),
        init()
});

function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "selection",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Update Employee",
                "Add Employee",
                "Add Role",
                "Add Department"
            ]
        }
    ]).then(function (val) {
        switch (val.selection) {
            case "View All Employees":
                viewEmployees();
                break;

            case "View All Roles":
                viewRoles();
                break;

            case "View All Departments":
                viewDept();
                break;

            case "Update Employee":
                updateEmp();
                break;

            case "Add Employee":
                addEmp();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Department":
                addDept();
                break;
        }
    })
};

function viewEmployees() {
    db.connect(function (err) {
        if (err) throw err;
        db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT (manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;",
            function (err, result) {
                if (err) throw err;
                console.table(result);
                init();
            });
    })
};

function viewRoles() {
    db.connect(function (err) {
        if (err) throw err;
        db.query("SELECT role.title, role.id, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;",
            function (err, result) {
                if (err) throw err;
                console.table(result);
                init();
            });
    })
}

function viewDept() {
    db.connect(function (err) {
        if (err) throw err;
        db.query("SELECT department.name, department.id FROM department;", function (err, result) {
            if (err) throw err;
            console.table(result);
            init();
        });
    });
};

var roleArr = [];
function selectRole() {
    db.query("SELECT * FROM role", (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            roleArr.push(result[i].title);
        }
    })
    return roleArr;
}

var managerArr = [];
function selectManager() {
    db.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL", (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            managerArr.push(result[i].id + ' ' + result[i].first_name + " " + result[i].last_name)
        };
    })
    return managerArr;
}

function updateEmp() {
    db.connect(function (err) {
        if (err) throw err;
        db.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id", (err, result) => {
            if (err) throw err;
            console.table(result);
            inquirer.prompt([
                {
                    type: "list",
                    message: "Select Employee to update",
                    name: "lastName",
                    choices: function () {
                        var lastName = [];
                        for (let i = 0; i < result.length; i++) {
                            lastName.push(result[i].last_name);
                        }
                        return lastName;
                    }
                },
                {
                    type: "list",
                    message: "Select the new role for this employee",
                    name: "role",
                    choices: selectRole()
                }
            ]).then(data => {
                db.query(`UPDATE employee SET role_id = ${selectRole().indexOf(data.role) + 1} WHERE last_name = "${data.lastName}"`,
                    function (err) {
                        if (err) throw err;
                        console.table(data)
                        init()
                    })
            });
        })
    })
}

function addEmp() {
    db.connect(function (err) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "firstname",
                type: "input",
                message: "Enter their first name "
            },
            {
                name: "lastname",
                type: "input",
                message: "Enter their last name "
            },
            {
                name: "role",
                type: "list",
                message: "What is their role? ",
                choices: selectRole()
            },
            {
                name: "choice",
                type: "list",
                message: "Whats their managers name?",
                choices: selectManager()
            }
        ]).then(data => {
            db.query("INSERT INTO employee SET ?",
                {
                    first_name: data.firstname,
                    last_name: data.lastname,
                    manager_id: selectManager().indexOf(data.choice) + 1,
                    role_id: selectRole().indexOf(data.role) + 1

                }, function (err) {
                    if (err) throw err
                    console.table(data)
                    init()
                })

        })
    })

}

function addRole() {
    db.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (res, err) {
        inquirer.prompt([
            {
                name: "Title",
                type: "input",
                message: "What is the Title for the new role?"
            },
            {
                name: "Salary",
                type: "input",
                message: "What is the Salary for the new role?"
            }
        ]).then(function (res) {
            db.query("INSERT INTO role SET ?", {
                title: res.Title,
                salary: res.Salary
            }, function (err) {
                if (err) throw err
                console.table(res)
                init()
            })
        })
    })

}

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the Department you would like to add?"
        }
    ]).then(function (res) {
        db.query("INSERT INTO department SET ?", {
            name: res.name
        },
            function (err) {
                if (err) throw err
                console.table(res);
                init();
            })
    }
    )

}