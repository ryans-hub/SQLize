const inquirer = require('inquirer');
const mysql = require('./config/connection');

const menuQuestion = [
    {
        type: 'list',
        name: 'menuChoice',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']
    }
]


const addNewQuestion = (menuChoice) => {
    switch(menuChoice) {
        case 'Add a Department':
            return [
                {
                    type: 'input',
                    name: 'addDepartment',
                    message: 'Enter the name of the new Department: ',
                }
            ];
        case 'Add a Role':
            return [
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'Enter the name of the new Role: ',
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter the salary of the new Role:',
                },
                {
                    type: 'list',
                    name: 'roleDepartment',
                    message: 'Choose the name of the department for the new Role:',
                    choices: ['Engineering', 'Finance', 'Marketing', 'Sales'],
                }
            ];
        case 'Add an Employee':
            return [
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the first name of the new Employee: ',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the last name of the new Employee: ',
                },
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'Enter the name of the new Role: ',
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter the salary of the new Role:',
                },
                {
                    type: 'list',
                    name: 'roleDepartment',
                    message: 'Choose the name of the department for the new Role:',
                    choices: ['Engineering', 'Finance', 'Marketing', 'Sales'],
                }, 
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Choose the name of the manager for the new Employee:',
                    choices: ['Michael Scott', 'Dwight Schrute'],
                },
            ];
    }
}

const listOptions = (response)=>{
    switch(response.menuChoice){
        case 'View All Departments':
            viewDepartment();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add a Department':
            inquirer.prompt(addNewQuestion(response.menuChoice)).then((answer) => {
                addDepartment(answer);
            })
            break;
        case 'Add a Role':
            inquirer.prompt(addNewQuestion(response.menuChoice)).then((answer) =>{
                addRole(answer);
            })
            break;
        case 'Add an Employee':
            inquirer.prompt(addNewQuestion(response.menuChoice)).then((answer) => {
                addEmployee(answer);
            })
            break;
        case 'Update an Employee Role':
            updateRole();
            break;
        case 'Quit':
            mysql.end();
            break;
    }
}

const viewDepartment = () => {

    mysql.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.error('Error fetching departments:', err);
            return;
        }

        console.table(results);

        showList();

    });
}

const viewRoles = () => {

    mysql.query('SELECT * FROM role', function (err, results) {
        if (err) {
            console.error('Error fetching roles:', err);
            return;
        }

        console.table(results);

        showList();

    });

}

const viewEmployees = () => {
        const query = `
            SELECT 
                employee.id AS employee_id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.name AS department,
                role.salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM 
                employee
            LEFT JOIN 
                role ON employee.role_id = role.id
            LEFT JOIN 
                department ON role.department_id = department.id
            LEFT JOIN 
                employee AS manager ON employee.manager_id = manager.id
        `;
    
        mysql.query(query, function (err, results) {
            if (err) {
                console.error('Error fetching employees:', err);
                return;
            }
    
            console.table(results);
    
            showList();
        });
    }

const addDepartment = (answer) => {

    const departmentName = answer.addDepartment; 
    // console.log(departmentName);

    mysql.query('INSERT INTO department SET ?', {name: departmentName}, function (err, results) {
        if(err) {
            console.error('Error adding department:', err);
            return;
        } else {
            mysql.query('SELECT * FROM department', function (err, results) {
                if (err) {
                    console.error('Error fetching departments:', err);
                    return;
                }
                console.log(`New department ${departmentName} added successfully.`)
                console.table(results);
            });
        } 
    });

    showList();
}

const addRole = (answer) => {

    const roleName = answer.roleName;
    // console.log('New role name:', roleName);
    const roleSalary = answer.roleSalary;
    // console.log('New Role salary:', roleSalary);
    const roleDepartment = answer.roleDepartment;
    // console.log('New role department:', roleDepartment);

    mysql.query('SELECT id FROM department WHERE name = ?', [roleDepartment], (err, results) => {
        if (err) {
            console.error('Error fetching department ID:', err);
            return;
        }

        const departmentId = results[0].id;


    mysql.query('INSERT INTO role SET ?', {title: roleName, salary: roleSalary, department_id: departmentId}, (err, results) => {
        if(err) {
            console.log('Error adding new role', err);
            return;
        } else {
            console.log(`New role ${roleName} added successfully!`)
            viewRoles();
        }
    })
})

showList();

}

const addEmployee = (answer) => {
    const firstName = answer.firstName;
    const lastName = answer.lastName;
    const manager = answer.manager;
    const roleName = answer.roleName;
    const roleSalary = answer.roleSalary;
    const roleDepartment = answer.roleDepartment;

    mysql.query('SELECT id FROM department WHERE name = ?', [roleDepartment], (err, departmentResults) => {
        if (err) {
            console.error('Error fetching department ID:', err);
            return;
        }

        const departmentId = departmentResults[0].id;

       mysql.query('INSERT INTO role SET ?', { title: roleName, salary: roleSalary, department_id: departmentId }, (err, roleResults) => {
            if (err) {
                console.error('Error adding new role:', err);
                return;
            }

            const roleId = roleResults.insertId;

            mysql.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [manager.split(' ')[0], manager.split(' ')[1]], (err, managerResults) => {
                if (err) {
                    console.error('Error fetching manager ID:', err);
                    return;
                }

                const managerId = managerResults[0].id;

                mysql.query('INSERT INTO employee SET ?', { first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId }, (err, employeeResults) => {
                    if (err) {
                        console.error('Error adding new employee:', err);
                        return;
                    }

                    console.log(`Employee ${firstName} ${lastName} added successfully!`);
                    viewEmployees();
                    showList(); // Return to the main menu
                });
            });
        });
    });
};


const updateRole = () => {

}

const showList = () => {
    inquirer
        .prompt(menuQuestion)
        .then((response)=>listOptions(response))
}

showList();

