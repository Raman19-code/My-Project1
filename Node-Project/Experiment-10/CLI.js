// CLI.js
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// In-memory employee array
let employees = [];

// Show main menu
function showMenu() {
  console.log("\n=== Employee Management CLI ===");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");

  rl.question("Select an option (1-4): ", (option) => {
    switch(option.trim()) {
      case "1":
        addEmployee();
        break;
      case "2":
        listEmployees();
        break;
      case "3":
        removeEmployee();
        break;
      case "4":
        console.log("👋 Exiting... Goodbye!");
        rl.close();
        break;
      default:
        console.log("⚠️ Invalid option! Try again.");
        showMenu();
    }
  });
}

// Add new employee
function addEmployee() {
  rl.question("Enter Employee Name: ", (name) => {
    rl.question("Enter Employee ID: ", (id) => {
      // Check if ID already exists
      if (employees.some(emp => emp.id === id)) {
        console.log(`⚠️ Employee ID '${id}' already exists!`);
      } else {
        employees.push({ name, id });
        console.log(`✅ Employee '${name}' with ID '${id}' added successfully!`);
      }
      showMenu();
    });
  });
}

// List all employees
function listEmployees() {
  if (employees.length === 0) {
    console.log("ℹ️ No employees found.");
  } else {
    console.log("\n📋 Employee List:");
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. Name: ${emp.name}, ID: ${emp.id}`);
    });
  }
  showMenu();
}

// Remove employee by ID
function removeEmployee() {
  rl.question("Enter Employee ID to remove: ", (id) => {
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      console.log(`⚠️ Employee with ID '${id}' not found!`);
    } else {
      const removed = employees.splice(index, 1)[0];
      console.log(`🗑️ Employee '${removed.name}' removed successfully!`);
    }
    showMenu();
  });
}

// Start the app
showMenu();
