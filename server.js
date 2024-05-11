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
                    name: 'addRole',
                    message: 'Enter the name of the new Employee: ',
                }
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
            addEmployee();
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

        // Assuming there's a single department with the given name
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

}

const addEmployee = () => {

}

const updateRole = () => {

}

const showList = () => {
    inquirer
        .prompt(menuQuestion)
        .then((response)=>listOptions(response))
}

showList();

