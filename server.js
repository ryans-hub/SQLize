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
                    name: 'addRole',
                    message: 'Enter the name of the new Role: ',
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
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
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

const addDepartment = () => {

}

const addRole = () => {

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

