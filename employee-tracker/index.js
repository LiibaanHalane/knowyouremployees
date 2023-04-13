const inquirer = require("inquirer");
const cTable = require("console.table");
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  getDepartments,
  getRoles,
  getEmployees,
} = require("./queries");

const mainMenu = async () => {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit",
    ],
  });

  switch (action) {
    case "View all departments":
      const departmentsData = await viewAllDepartments();
      console.table(departmentsData);
      mainMenu();
      break;
    case "View all roles":
      const rolesData = await viewAllRoles();
      console.table(rolesData);
      mainMenu();
      break;
    case "View all employees":
      const employeesData = await viewAllEmployees();
      console.table(employeesData);
      mainMenu();
      break;
    case "Add a department":
      const { departmentName } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "Enter the name of the new department:",
      });
      await addDepartment(departmentName);
      console.log("Department added successfully!");
      mainMenu();
      break;
    case "Add a role":
      const departments = await getDepartments();
      const newRole = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the role title:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the role salary:",
        },
        {
          type: "list",
          name: "department_id",
          message: "Select the department for the role:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ]);
      await addRole(newRole);
      console.log("Role added successfully!");
      mainMenu();
      break;
    case "Add an employee":
      const roles = await getRoles();
      const employees = await getEmployees();
      const newEmployee = await inquirer.prompt([
        {
          type: "input",
          name: "first_name",
          message: "Enter the employee's first name:",
        },
        {
          type: "input",
          name: "last_name",
          message: "Enter the employee's last name:",
        },
        {
          type: "list",
          name: "role_id",
          message: "Select the employee's role:",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
        {
          type: "list",
          name: "manager_id",
          message: "Select the employee's manager:",
          choices: [
            { name: "None", value: null },
            ...employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          ],
        },
      ]);
      await addEmployee(newEmployee);
      console.log("Employee added successfully!");
      mainMenu();
      break;
    case "Update an employee role":
      const employeeChoices = await getEmployees();
      const roleChoices = await getRoles();
      const { employeeId, newRoleId } = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee whose role you want to update:",
          choices: employeeChoices.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          type: "list",
          name: "newRoleId",
          message: "Select the new role for the employee:",
          choices: roleChoices.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ]);
      await updateEmployeeRole(employeeId, newRoleId);
      console.log("Employee role updated successfully!");
      mainMenu();
      break;
    case "Exit":
      console.log("Goodbye!");
      process.exit(0);
      break;
    default:
      console.log("Invalid option. Please try again.");
      mainMenu();
  }
};

mainMenu();

