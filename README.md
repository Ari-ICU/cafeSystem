# Product Management Application

Welcome to the Product Management Application! This is a React-based web application designed to manage products, including listing, adding, editing, and deleting products with category filtering and search functionality.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [API Services](#api-services)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- Display a list of products with details (ID, Image, Name, Description, Price, Stock, Category).
- Search products by name or description.
- Filter products by category.
- Add new products.
- Edit existing products.
- Delete products with confirmation.
- Responsive design with horizontal and vertical scrolling for the product table.
- Loading and error handling states.

## Installation

1. **Clone the repository:**
  
  git clone https://github.com/your-username/product-management-app.git
  cd product-management-app

2. **Install dependencies:**

    ## npm install 

3. **Set up environment variables:**
    .Create a .env file in the root directory.
    .Add the following variables (replace with your actual API endpoints)

4. **Start the development server:**

    ## npm run dev

    The app will be available .
    
## Usage
    .Navigate to the product list page to view all products.
    .Use the search bar to filter by name or description.
    .Use the category dropdown to filter by category.
    .Click "Add Product" to create a new product.
    .Click "Edit" to modify an existing product.
    .Click "Delete" to remove a product (with confirmation).
    .Scroll horizontally and vertically to view all columns and rows in the table.

## Technologies Used
    .Frontend: React, Material-UI (MUI)
    .Routing: React Router
    .API Calls: Fetch or Axios (via custom services)
    .Styling: CSS-in-JS (MUI sx prop)
    .Build Tool: Vite or Create React App
