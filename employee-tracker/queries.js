const mysql = require("mysql2/promise");

const connectionConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ProteinPowder#3Mug",
  database: "employee_tracker",
};

// Function to establish a connection with the MySQL database
async function getConnection() {
  const connection = await mysql.createConnection(connectionConfig);
  return connection;
}

// Function to view all departments
async function viewAllDepartments() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM department");
  connection.end();
  return rows;
}

// Function to view all roles
async function viewAllRoles() {
  const connection = await getConnection();
  const query = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `;
  const [rows] = await connection.query(query);
  connection.end();
  return rows;
}

// Function to view all employees
async function viewAllEmployees() {
  const connection = await getConnection();
  const query = `
    SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    JOIN role ON e.role_id = role.id
    JOIN department ON role.department_id = department.id
  `;
  const [rows] = await connection.query(query);
  connection.end();
  return rows;
}

// Function to add a department
async function addDepartment(name) {
  const connection = await getConnection();
  const [result] = await connection.query("INSERT INTO department (name) VALUES (?)", [name]);
  connection.end();
  return result;
}

// Function to add a role
async function addRole(title, salary, department_id) {
  const connection = await getConnection();
  const [result] = await connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [title, salary, department_id]);
  connection.end();
  return result;
}

// Function to add an employee
async function addEmployee(first_name, last_name, role_id, manager_id) {
  const connection = await getConnection();
  const [result] = await connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role_id, manager_id]);
  connection.end();
  return result;
}

// Function to update an employee's role
async function updateEmployeeRole(employee_id, role_id) {
  const connection = await getConnection();
  const [result] = await connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, employee_id]);
  connection.end();
  return result;
}

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};

