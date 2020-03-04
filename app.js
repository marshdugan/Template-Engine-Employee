const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeArray = [];

const newEmployeeQuestion = [
    {
        type: "list",
        message: "Which team member would you like to add?",
        name: "teamMember",
        default: "Use arrow keys",
        choices: ["Engineer", "Intern", "I don't want to add anymore team members"]
    }
]
const managerQuestions = [
    {
        type: "input",
        message: "What is your manager's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your manager's id?",
        name: "id"
    },
    {
        type: "input",
        message: "What is your manager's email?",
        name: "email"
    },
    {
        type: "input",
        message: "What is yout manager's office number?",
        name: "officeNumber"
    }
];

const engineerQuestions = [
    {
        type: "input",
        message: "What is your engineer's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your engineer's id?",
        name: "id",
        validate: validateInput
    },
    {
        type: "input",
        message: "What is your engineer's email?",
        name: "email",
        validate: validateInput
    },
    {
        type: "input",
        message: "What is your engineer's GitHub username?",
        name: "github",
        validate: validateInput
    }
];

const internQuestions = [
    {
        type: "input",
        message: "What is your intern's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your intern's id?",
        name: "id",
        validate: validateInput
    },
    {
        type: "input",
        message: "What is your intern's email?",
        name: "email",
        validate: validateInput
    },
    {
        type: "input",
        message: "What is your intern's school?",
        name: "school",
    }
];


inquirer.prompt(managerQuestions).then(function(managerRes) {
    const manager = new Manager(managerRes.name, managerRes.id, managerRes.email, managerRes.officeNumber);
    employeeArray.push(manager);
    createEmployee(); 
});



function createEmployee() {
    inquirer.prompt(newEmployeeQuestion).then(function(employee) {
        if (employee.teamMember === "Engineer") {
            inquirer.prompt(engineerQuestions).then(function(engineerRes) {
                const engineer = new Engineer(engineerRes.name, engineerRes.id, engineerRes.email, engineerRes.github);
                employeeArray.push(engineer);
                createEmployee();
            });
        } else if (employee.teamMember === "Intern") {
            inquirer.prompt(internQuestions).then(function(internRes) {
                const intern = new Intern(internRes.name, internRes.id, internRes.email, internRes.school);
                employeeArray.push(intern);
                createEmployee();
            });
        } else {
            const createHTML = render(employeeArray);
            if (!fs.existsSync(OUTPUT_DIR)) {
                console.log("No output folder...creating one now");
                fs.mkdir(OUTPUT_DIR, error => {
                    if (error) throw error;
                });
            }
            fs.writeFile(outputPath, createHTML, function(error) {
                if (error) throw error;
            })
        }
    });
}

function validateInput(data) {
    for (let i = 0; i < employeeArray.length; i++) {
        if (employeeArray[i].id === data || data < 0) {
            return "That is not a valid id";
        }
        if (employeeArray[i].email === data) {
            return "That is not a valid email"
        }
        if (employeeArray[i].github === data) {
            return "That github username is already taken by another employee"
        }
    }
    return true;
}