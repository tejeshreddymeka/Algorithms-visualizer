
export class GraphNode {
    x: number;
    y: number;
    radius: number;
    value: number;
    edges: GraphEdge[] = [];

    isRoot = false;
    backgroudColor =  '#0d0d26';
    color = 'white';
    borderColor = 'white';
    shadowBlur = 6;
    shodowColor = 'grey';
    font = 'normal 12px Verdana';

    visited = false;
    persistVisualProperties = false;
    visitedAnimationFrame = 0;

    visitedAnimationColors: string[] = [
        '#e66750',
        '#11b1bd',
       // '#03ad9c','#03ad7d','#03ad58',
       // '#03ad58',
       '#03943b'
    ];

    constructor() {
    }

    resetMarkerProperties() {
        this.isRoot = false;
        this.visited = false;
        this.persistVisualProperties = false;
        this.visitedAnimationFrame = 0;
    }

    resetVisualProperties() {
        this.backgroudColor =  '#0d0d26';
        this.color = 'white';
        this.borderColor = 'white';
        this.shadowBlur = 6;
        this.shodowColor = 'grey';
        this.font = 'normal 12px Verdana';
    }

    visitedAnimationNextFrame() {
        if (this.isRoot) {
            this.color = 'white';
            this.backgroudColor = 'red';
            return;
        }
        if (this.visitedAnimationFrame >= this.visitedAnimationColors.length) {return; }
        this.backgroudColor = this.visitedAnimationColors[this.visitedAnimationFrame++];
        this.color = 'white';
    }

    doesEdgeExists(edge: GraphEdge) {
        return this.edges.includes(edge);
    }
}

export class GraphEdge {
    node: GraphNode;

    isDirected = false;
    color = 'rgba(255,255,255,0.1)';
    arrowColor = 'rgba(255,255,255,0.3)';

    constructor(node: GraphNode) {
        this.node = node;
    }
}
