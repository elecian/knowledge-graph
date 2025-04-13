/**
 * Knowledge Graph Data Module
 * Contains the data structure for the knowledge graph
 */

export const graphData = {
    nodes: [
        { id: "Artificial Intelligence", group: 1 },
        { id: "Machine Learning", group: 1 },
        { id: "Deep Learning", group: 1 },
        { id: "Neural Networks", group: 1 },
        { id: "Natural Language Processing", group: 2 },
        { id: "Computer Vision", group: 2 },
        { id: "Reinforcement Learning", group: 1 },
        { id: "Supervised Learning", group: 1 },
        { id: "Unsupervised Learning", group: 1 },
        { id: "Convolutional Neural Networks", group: 3 },
        { id: "Recurrent Neural Networks", group: 3 },
        { id: "Transformers", group: 3 },
        { id: "BERT", group: 4 },
        { id: "GPT", group: 4 },
        { id: "ResNet", group: 4 }
    ],
    links: [
        { source: "Artificial Intelligence", target: "Machine Learning", value: 1 },
        { source: "Machine Learning", target: "Deep Learning", value: 1 },
        { source: "Machine Learning", target: "Supervised Learning", value: 1 },
        { source: "Machine Learning", target: "Unsupervised Learning", value: 1 },
        { source: "Machine Learning", target: "Reinforcement Learning", value: 1 },
        { source: "Deep Learning", target: "Neural Networks", value: 1 },
        { source: "Neural Networks", target: "Convolutional Neural Networks", value: 1 },
        { source: "Neural Networks", target: "Recurrent Neural Networks", value: 1 },
        { source: "Neural Networks", target: "Transformers", value: 1 },
        { source: "Artificial Intelligence", target: "Natural Language Processing", value: 1 },
        { source: "Artificial Intelligence", target: "Computer Vision", value: 1 },
        { source: "Natural Language Processing", target: "Transformers", value: 1 },
        { source: "Transformers", target: "BERT", value: 1 },
        { source: "Transformers", target: "GPT", value: 1 },
        { source: "Computer Vision", target: "Convolutional Neural Networks", value: 1 },
        { source: "Convolutional Neural Networks", target: "ResNet", value: 1 }
    ]
};

// Additional topics for random node generation
export const additionalTopics = [
    "Gradient Descent", "Backpropagation", "Transfer Learning",
    "Feature Engineering", "Data Augmentation", "Ensemble Methods",
    "Random Forests", "Support Vector Machines", "K-means Clustering"
];
