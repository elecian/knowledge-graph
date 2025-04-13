# Knowledge Graph with D3.js

An interactive knowledge graph visualization built with D3.js, featuring a modular JavaScript architecture and space-like visual effects.

## Features

- Interactive node visualization with draggable nodes
- Space-like floating effect when pressing and holding on nodes
- Dotted blue connection lines between related concepts
- Highlighting of connections between nodes
- Ability to add random nodes to expand the graph
- Zoom and pan functionality

## Project Structure

```
├── index.html              # Main HTML file
├── js/                     # JavaScript files
│   ├── main.js             # Entry point
│   └── modules/            # Modular components
│       ├── data.js         # Graph data
│       ├── graph.js        # Graph visualization
│       └── utils.js        # Utility functions
├── cypress/                # End-to-end tests
│   ├── e2e/                # Test specifications
│   └── support/            # Test helpers
├── package.json            # Project configuration
└── cypress.config.js       # Cypress configuration
```

## Running the Application

To run the application locally:

```bash
# Start a local web server
npm start
# Or alternatively
python -m http.server 8000
```

Then open your browser to http://localhost:8000

## Running End-to-End Tests

The project includes comprehensive end-to-end tests using Cypress to verify the functionality of the knowledge graph.

### Prerequisites

Make sure you have Node.js and npm installed. Then install the dependencies:

```bash
npm install
```

### Running Tests

1. Start the application in one terminal:

```bash
npm start
```

2. Run the tests in another terminal:

```bash
# Open Cypress Test Runner (interactive mode)
npm test

# Or run tests headlessly
npm run test:headless
```

### Test Coverage

The end-to-end tests verify:

- Proper rendering of nodes and links
- Space effect when pressing and holding on nodes
- Persistence of space effect during dragging
- Adding new nodes to the graph
- Resetting the view
- Highlighting connections between nodes

## Customizing the Graph

You can customize the graph by modifying the data in `js/modules/data.js` or by creating your own data module and importing it into your application.
