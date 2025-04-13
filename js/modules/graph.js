/**
 * Knowledge Graph Visualization Module
 * Contains the core functionality for creating and updating the graph
 */

import { getNodeSize, dragstarted, dragged, dragended } from './utils.js';

export class KnowledgeGraph {
    constructor(svgSelector, data, options = {}) {
        // Default configuration
        this.config = {
            width: 900,
            height: 600,
            nodeColor: d3.scaleOrdinal(d3.schemeCategory10),
            ...options
        };
        
        this.data = data;
        this.svg = d3.select(svgSelector);
        this.g = null;
        this.simulation = null;
        this.link = null;
        this.nodeGroup = null;
        this.node = null;
        this.labels = null;
        this.zoom = null;
        
        // Initialize the graph
        this.init();
    }
    
    /**
     * Initialize the graph visualization
     */
    init() {
        const { width, height } = this.config;
        
        // Set up SVG
        this.svg.attr("viewBox", [0, 0, width, height]);
        
        // Add zoom functionality
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });
        
        this.svg.call(this.zoom);
        
        // Create a group for all elements
        this.g = this.svg.append("g");
        
        // Create a force simulation
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force("link", d3.forceLink(this.data.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(60));
        
        // Draw links
        this.link = this.g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.data.links)
            .enter()
            .append("line")
            .attr("class", "link");
        
        // Create a custom drag behavior that maintains the space effect
        const dragBehavior = d3.drag()
            .on("start", (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                // Don't remove the space effect when starting to drag
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
                // Don't remove the space effect during drag
            })
            .on("end", (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                // Only remove the space effect if the mouse is up
                if (!event.sourceEvent.buttons) {
                    this.handleNodeMouseUp(event, d);
                }
            });
        
        // Create a group for each node
        this.nodeGroup = this.g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(this.data.nodes)
            .enter()
            .append("g")
            .call(dragBehavior);
        
        // Draw nodes
        this.node = this.nodeGroup.append("circle")
            .attr("class", "node")
            .attr("r", d => getNodeSize(d, this.data.links))
            .attr("fill", "white")
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
            .on("click", (event, d) => this.handleNodeClick(event, d))
            .on("mousedown", (event, d) => this.handleNodeMouseDown(event, d))
            .on("mouseup", (event, d) => this.handleNodeMouseUp(event, d))
            .on("mouseleave", (event, d) => this.handleNodeMouseUp(event, d));
        
        // Add node labels
        this.labels = this.nodeGroup.append("text")
            .attr("class", "node-label")
            .attr("dy", 4)
            .text(d => d.id);
        
        // Add tooltips
        this.node.append("title")
            .text(d => d.id);
        
        // Update positions on each tick of the simulation
        this.simulation.on("tick", () => this.ticked());
    }
    
    /**
     * Update positions on each tick
     */
    ticked() {
        this.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        this.nodeGroup.attr("transform", d => `translate(${d.x}, ${d.y})`);
    }
    
    /**
     * Handle node click event
     * @param {Object} event - The click event
     * @param {Object} d - The node data
     */
    handleNodeClick(event, d) {
        // Toggle selection for regular clicks
        // We're keeping this for compatibility, but the main interaction
        // will now be through mousedown/mouseup for press-and-hold
        event.stopPropagation(); // Prevent click from bubbling
        
        // Highlight connections
        this.highlightConnections(d);
    }
    
    /**
     * Handle node mouse down event
     * @param {Object} event - The mouse down event
     * @param {Object} d - The node data
     */
    handleNodeMouseDown(event, d) {
        const node = d3.select(event.currentTarget);
        
        // Get the node size to scale the aura appropriately
        const nodeSize = parseFloat(node.attr("r"));
        const auraSize = nodeSize * 3;
        
        // Find the parent group and add the aura circle behind the node
        const parentGroup = d3.select(node.node().parentNode);
        
        // Remove any existing aura first
        parentGroup.selectAll(".space-aura").remove();
        
        // Add the new aura
        parentGroup.insert("circle", ":first-child")
            .attr("class", "space-aura")
            .attr("r", auraSize)
            .attr("cx", 0)
            .attr("cy", 0);
            
        // Apply the glow filter to the node
        node.classed("selected", true);
        
        // Highlight connected nodes and links
        this.highlightConnections(d);
    }
    
    /**
     * Handle node mouse up event
     * @param {Object} event - The mouse up event
     * @param {Object} d - The node data
     */
    handleNodeMouseUp(event, d) {
        const node = d3.select(event.currentTarget);
        
        // Remove the space aura
        const parentGroup = d3.select(node.node().parentNode);
        parentGroup.selectAll(".space-aura").remove();
        
        // Remove the glow filter
        node.classed("selected", false);
        
        // Reset highlights
        this.resetHighlights();
    }
    
    /**
     * Highlight connections for a node
     * @param {Object} d - The node data
     */
    highlightConnections(d) {
        // Find connected nodes
        const connectedLinks = this.data.links.filter(link => 
            link.source.id === d.id || link.target.id === d.id
        );
        
        const connectedNodes = new Set();
        connectedLinks.forEach(link => {
            connectedNodes.add(link.source.id);
            connectedNodes.add(link.target.id);
        });
        
        // Highlight connected nodes
        this.node.each(function(nodeData) {
            if (connectedNodes.has(nodeData.id)) {
                d3.select(this).attr("stroke", "#ff0000").attr("stroke-width", 2);
            } else if (nodeData.id !== d.id) {
                d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
            }
        });
        
        // Highlight connected links
        this.link.each(function(linkData) {
            if (linkData.source.id === d.id || linkData.target.id === d.id) {
                d3.select(this).attr("stroke", "#ff0000").attr("stroke-width", 2);
            } else {
                d3.select(this).attr("stroke", "#3498db").attr("stroke-width", 1.5).attr("stroke-dasharray", "5, 3");
            }
        });
    }
    
    /**
     * Reset all highlights
     */
    resetHighlights() {
        this.node.attr("stroke", "#000").attr("stroke-width", 2);
        this.link.attr("stroke", "#3498db").attr("stroke-width", 1.5).attr("stroke-dasharray", "5, 3");
    }
    
    /**
     * Reset the graph view
     */
    resetView() {
        // Reset zoom
        this.svg.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity
        );
        
        // Reset node highlights
        this.resetHighlights();
        this.node.classed("selected", false);
        
        // Remove all space auras
        this.g.selectAll(".space-aura").remove();
        
        // Reset simulation
        this.simulation.alpha(1).restart();
    }
    
    /**
     * Add a random node to the graph
     * @param {Array} additionalTopics - Array of additional topics to choose from
     */
    addRandomNode(additionalTopics) {
        // Get random topic that's not already in the graph
        const existingIds = new Set(this.data.nodes.map(n => n.id));
        const availableTopics = additionalTopics.filter(t => !existingIds.has(t));
        
        if (availableTopics.length === 0) return;
        
        const newTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
        const newGroup = Math.floor(Math.random() * 4) + 1;
        
        // Add new node
        const newNode = { id: newTopic, group: newGroup };
        this.data.nodes.push(newNode);
        
        // Connect to 1-2 random existing nodes
        const numConnections = Math.floor(Math.random() * 2) + 1;
        const possibleTargets = [...this.data.nodes].filter(n => n.id !== newTopic);
        
        for (let i = 0; i < numConnections; i++) {
            if (possibleTargets.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * possibleTargets.length);
            const target = possibleTargets[randomIndex];
            possibleTargets.splice(randomIndex, 1);
            
            this.data.links.push({
                source: newTopic,
                target: target.id,
                value: 1
            });
        }
        
        // Update visualization
        this.updateVisualization();
    }
    
    /**
     * Update the visualization after data changes
     */
    updateVisualization() {
        // Create the custom drag behavior for new nodes
        const dragBehavior = d3.drag()
            .on("start", (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                // Don't remove the space effect when starting to drag
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
                // Don't remove the space effect during drag
            })
            .on("end", (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                // Only remove the space effect if the mouse is up
                if (!event.sourceEvent.buttons) {
                    this.handleNodeMouseUp(event, d);
                }
            });
            
        // Update links
        this.link = this.link.data(this.data.links, d => `${d.source.id}-${d.target.id}`);
        this.link.exit().remove();
        const linkEnter = this.link.enter()
            .append("line")
            .attr("class", "link");
        this.link = linkEnter.merge(this.link);
        
        // Update nodes
        this.nodeGroup = this.nodeGroup.data(this.data.nodes, d => d.id);
        this.nodeGroup.exit().remove();
        
        const nodeGroupEnter = this.nodeGroup.enter()
            .append("g")
            .call(dragBehavior);
        
        nodeGroupEnter.append("circle")
            .attr("class", "node")
            .attr("r", d => getNodeSize(d, this.data.links))
            .attr("fill", "white")
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
            .on("click", (event, d) => this.handleNodeClick(event, d))
            .on("mousedown", (event, d) => this.handleNodeMouseDown(event, d))
            .on("mouseup", (event, d) => this.handleNodeMouseUp(event, d))
            .on("mouseleave", (event, d) => this.handleNodeMouseUp(event, d))
            .append("title")
            .text(d => d.id);
        
        nodeGroupEnter.append("text")
            .attr("class", "node-label")
            .attr("dy", 4)
            .text(d => d.id);
        
        this.nodeGroup = nodeGroupEnter.merge(this.nodeGroup);
        this.node = this.svg.selectAll(".node");
        
        // Update simulation
        this.simulation.nodes(this.data.nodes);
        this.simulation.force("link").links(this.data.links);
        this.simulation.alpha(1).restart();
    }
}
