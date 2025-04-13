/**
 * Knowledge Graph Utilities Module
 * Contains helper functions for the knowledge graph
 */

/**
 * Determines node size based on number of connections
 * @param {Object} node - The node to calculate size for
 * @param {Array} links - Array of link objects
 * @returns {number} - The calculated node size
 */
export function getNodeSize(node, links) {
    const connections = links.filter(link => 
        link.source.id === node.id || link.target.id === node.id
    ).length;
    return 10 + connections * 2;
}

/**
 * Drag started event handler
 * @param {Object} event - The drag event
 * @param {Object} d - The node data
 * @param {Object} simulation - The force simulation
 */
export function dragstarted(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

/**
 * Drag event handler
 * @param {Object} event - The drag event
 * @param {Object} d - The node data
 */
export function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

/**
 * Drag ended event handler
 * @param {Object} event - The drag event
 * @param {Object} d - The node data
 * @param {Object} simulation - The force simulation
 */
export function dragended(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
