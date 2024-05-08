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


const addnewquestion = [
    {

    }
]

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

    mysql.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.error('Error fetching employees:', err);
            return;
        }

        console.table(results);

        showList();

    });

}

const showList = () => {
    inquirer
        .prompt(menuQuestion)
        .then((response)=>listOptions(response))
}

showList();

