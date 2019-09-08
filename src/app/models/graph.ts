export class GraphNode{
    x: number;
    y: number;
    radius: number;
    value: number;
    edges: GraphEdge[] = [];
    visited:boolean = false;

    backgroudColor: string =  "#0d0d26";
    color: string = "white"
    borderColor: string = "white"
    shadowBlur: number = 6;
    shodowColor: string = "grey";
    font: string = "normal 12px Verdana";

    persistVisualProperties: boolean = false;

    resetVisualProperties()
    {
        this.backgroudColor =  "#0d0d26";
        this.color = "white"
        this.borderColor = "white"
        this.shadowBlur = 6;
        this.shodowColor = "grey";
        this.font = "normal 12px Verdana";
    }
}

export class GraphEdge{
    node: GraphNode;

    color: string = "white";
    arrowColor: string = "white";
}
