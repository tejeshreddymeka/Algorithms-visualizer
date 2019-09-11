import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { GraphNode } from 'src/app/models/graph';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnInit {

  public nodes: GraphNode[] = [];
  @Output() graphReady = new EventEmitter<HTMLCanvasElement>();
  @Output() nodeSelected = new EventEmitter<GraphNode>();

  @ViewChild('board', {static: false}) public  boardElementRef: ElementRef;
  @ViewChild('boardWrapper', {static: false}) public boardWrapperElementRef: ElementRef;
  boardContext: CanvasRenderingContext2D;
  private board: HTMLCanvasElement;

  constructor() { }

  onMouseMove(event: MouseEvent) {
    const rect = this.board.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.y < rect.top || event.y > rect.bottom) {return; }
    const tempNode = new GraphNode();
    tempNode.x = event.clientX - rect.left;
    tempNode.y = event.clientY - rect.top;
    this.nodes.forEach(node => {
      if (node.persistVisualProperties) {return; }
      if (this.getDistanceOfNodes(node, tempNode) <= node.radius) {
        node.backgroudColor = 'white';
        node.color = 'black';
      } else {
          node.resetVisualProperties();
      }
    });
    this.drawBoard();
  }

  onMouseClick(event: MouseEvent) {
    const rect = this.board.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.y < rect.top || event.y > rect.bottom) {return; }
    const tempNode = new GraphNode();
    tempNode.x = event.clientX - rect.left;
    tempNode.y = event.clientY - rect.top;
    this.nodes.forEach(node => {
      node.resetMarkerProperties();
      node.resetVisualProperties();
      if (this.getDistanceOfNodes(node, tempNode) <= node.radius) {
        node.backgroudColor = 'white';
        node.color = 'black';
        this.nodeSelected.emit(node);
        node.persistVisualProperties = true;
      }
    });
    this.drawBoard();
  }

  adjustBoardParams() {
    const boardWrapper: Element = this.boardWrapperElementRef.nativeElement;
    this.board.width = boardWrapper.clientWidth;
    this.board.height = boardWrapper.clientHeight;
  }

  drawNodes() {
    this.nodes.forEach(node => {
      if (node.visited) {
        node.visitedAnimationNextFrame();
      }
      this.boardContext.beginPath();
      this.boardContext.strokeStyle = node.borderColor;
      this.boardContext.fillStyle = node.backgroudColor;
      this.boardContext.shadowBlur = node.shadowBlur;
      this.boardContext.shadowColor = node.shodowColor;
      this.boardContext.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      this.boardContext.stroke();
      this.boardContext.fill();
      this.boardContext.fillStyle = node.color;
      this.boardContext.font = node.font;
      this.boardContext.fillText(node.value.toString(), node.x - node.radius / 2 + 3, node.y + 4);
      this.boardContext.closePath();
    });
  }

  drawEdges() {
    this.nodes.forEach(node1 => {
      node1.edges.forEach( edge => {
        this.boardContext.beginPath();
        this.boardContext.shadowBlur = 3;
        this.boardContext.strokeStyle = edge.color;
        this.boardContext.moveTo(node1.x , node1.y);
        this.boardContext.lineTo(edge.node.x, edge.node.y);
        this.boardContext.stroke();
        this.boardContext.closePath();

        if (edge.isDirected) {
          const theta = Math.atan(Math.abs(node1.y - edge.node.y) / Math.abs(node1.x - edge.node.x));
          const alpha = Math.PI / 9;
          const sideLen = 8;
          const xDirection = node1.x <  edge.node.x ? 1 : -1;
          const yDirection = node1.y <  edge.node.y ? 1 : -1;
          const x  = edge.node.x - xDirection * edge.node.radius * Math.cos(theta);
          const y  = edge.node.y - yDirection * edge.node.radius * Math.sin(theta);
          this.boardContext.beginPath();
          this.boardContext.moveTo(x, y);
          this.boardContext.fillStyle = edge.arrowColor;
          this.boardContext.lineTo(x - xDirection * sideLen * Math.cos((theta - alpha)), y - yDirection * sideLen * Math.sin((theta - alpha)));
          this.boardContext.lineTo(x + xDirection * sideLen * Math.sin(alpha - Math.PI / 2 + theta), y  - yDirection * sideLen * Math.cos(alpha - Math.PI / 2 + theta));
          this.boardContext.stroke();
          this.boardContext.lineTo(x, y);
          this.boardContext.fill();
          this.boardContext.stroke();
          this.boardContext.closePath();
        }
      });
    });
  }

  drawBoard() {
    this.boardContext.clearRect(0, 0, this.board.width, this.board.height);
    this.drawEdges();
    this.drawNodes();
  }

  getDistanceOfNodes(node1: GraphNode, node2: GraphNode): number {
    return Math.sqrt(Math.pow( node1.x - node2.x , 2) + Math.pow( node1.y - node2.y , 2));
  }


  initBoard() {
    this.board = this.boardElementRef.nativeElement;
    this.boardContext = this.board.getContext('2d');
    this.adjustBoardParams();
    this.drawBoard();
  }

  ngAfterViewInit() {
    this.initBoard();
    this.graphReady.emit(this.board);
  }

  ngOnInit() {

  }
}
