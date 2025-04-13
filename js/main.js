/**
 * Main JavaScript file for the Knowledge Graph application
 * This file initializes the graph and sets up event handlers
 */

import { graphData, additionalTopics } from './modules/data.js';
import { KnowledgeGraph } from './modules/graph.js';

// Initialize the graph when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create a new knowledge graph instance
    const graph = new KnowledgeGraph('svg', graphData);
    
    // Set up event handlers for buttons
    document.getElementById('resetButton').addEventListener('click', () => {
        graph.resetView();
    });
    
    document.getElementById('addNodeButton').addEventListener('click', () => {
        graph.addRandomNode(additionalTopics);
    });
});
