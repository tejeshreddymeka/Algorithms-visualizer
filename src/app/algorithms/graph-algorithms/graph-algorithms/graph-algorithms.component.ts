import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { GraphComponent } from 'src/app/shared/components/graph/graph.component';
import { HighlightService } from 'src/app/services/highlight.service';
import { Util } from 'src/app/shared/util';
import { GraphNode, GraphEdge} from 'src/app/models/graph';
import { NotificationService } from 'src/app/services/notification.service';
import { async } from '@angular/core/testing';
import { GraphAlgorithms } from './graph-algorithms-code';
import { GraphAlgorithmsRoutingModule } from '../graph-algorithms-routing.module';

@Component({
  selector: 'app-graph-algorithms',
  templateUrl: './graph-algorithms.component.html',
  styleUrls: ['./graph-algorithms.component.sass']
})
export class GraphAlgorithmsComponent implements OnInit, AfterViewInit {
  algorithms: any = [];
  algorithmNames: string[] = [ 'BFS', 'DFS'];
  selectedAlgorithm: string = this.algorithmNames[0];
  samplesCount = 70;
  maxSamplesCount = 350;
  minValue = 1;
  maxValue = 150;
  values: number[] = [];
  speed = 700;
  maxSpeed = 3000;
  visualizing = false;
  customPanelOpened = false;
  customValue: number = null;
  codePanelOpened = false;

  minNodesDistance = 17;
  selectedNode: GraphNode;
  isDirected = 0;
  isCyclic = 1;
  isConnected = 0;

  algorithmCode = '';
  algorithmExplanation = '';
  graphAlgorithms: GraphAlgorithms = new GraphAlgorithms();

  board: HTMLCanvasElement;

  @ViewChild('graph', {static: false}) graph: GraphComponent;
  constructor(
    private highlightService: HighlightService,
    private notificationService: NotificationService
  ) {
    this.algorithms = {
      BFS: {name: 'BFS', run: () => this.bfs(), code: this.graphAlgorithms.bfsCode, explanation: this.graphAlgorithms.bfsExplanation},
      DFS: {name: 'DFS', run: () => this.dfs(), code: this.graphAlgorithms.dfsCode, explanation: this.graphAlgorithms.dfsExplanation},
    };
   }

  @HostListener('click', ['$event'])
  onMouseClick(event: MouseEvent) {
    if (!this.visualizing) {
      this.graph.onMouseClick(event);
    }
  }

  @HostListener('mousemove', ['$event'] )
  onMouseMove(event: MouseEvent) {
    if (!this.visualizing) {
      this.graph.onMouseMove(event);
    }
  }

  @HostListener('window:resize', ['$event']) onWindowResize(event) {
    this.graph.adjustBoardParams();
    this.randomize();
    this.graph.drawBoard();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.randomize();
  }

  onGraphReady($event: HTMLCanvasElement) {
    this.board = $event;
    this.randomize();
  }

  onNodeSelected($event: GraphNode) {
    this.selectedNode = $event;
  }

  onRadioButtonChange(target: string) {
    switch (target) {
      case 'isDirected':
        this.setRandomEdges();
        break;
    }
    this.graph.drawBoard();
  }

  updateSpeed(event) {
    this.speed = event.value;
  }

  updateSamplesCount(event) {
    this.customPanelOpened = false;
    this.samplesCount = event.value;
    this.randomize();
  }

  updateMaxValue(event) {
    this.customPanelOpened = false;
    this.maxValue = event.value;
    this.randomize();
  }

  addCustomValue() {
    if (this.customValue === null || this.customValue <= 0 || this.customValue > 999) {return; }
    const node = new GraphNode();
    node.value = this.customValue;
    node.radius = node.value.toString().length * 12;
    let iterations = 1;
    do {
      node.x = Math.floor(Math.random() * (this.board.width - 20 - 2 * node.radius)) + node.radius + 10;
      node.y = Math.floor(Math.random() * (this.board.height - 20 - 2 * node.radius)) + node.radius + 10;
      if ( iterations++ > 1000) {break; }  // to avoid infinite loop
    }while (this.graph.nodes.some(node1 => this.doesNodesAreTooCloser(node1, node)));
    if (iterations < 1000) {
      this.graph.nodes.push(node);
    } else {
      this.notificationService.messages.push('Node can\'t be add as area is full');
    }
    this.customValue = null;
    this.graph.drawBoard();
  }

  scrollToElement(elementTag: string) {
    document.querySelector(elementTag).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  removeCustomValue() {
    if (this.customValue === null || this.customValue <= 0 || this.customValue > 999) {return; }
    const index = this.graph.nodes.findIndex((node) => node.value === this.customValue);
    if (index >= 0) {
      this.graph.nodes.splice(index, 1);
    }
    this.graph.drawBoard();
  }

  toggleCustomPanel() {
    this.customPanelOpened = !this.customPanelOpened;
    this.graph.nodes = [];
    this.graph.boardContext.clearRect(0, 0, this.board.width, this.board.height);
    if (!this.customPanelOpened) {
      this.randomize();
    }
  }

  toggleCodePanel() {
    this.codePanelOpened = !this.codePanelOpened;
    this.algorithmCode = this.highlightService.highlightCode(this.algorithms[this.selectedAlgorithm].code, 'cpp');
    this.algorithmExplanation = this.algorithms[this.selectedAlgorithm].explanation;
  }


  doesNodesAreTooCloser(node1: GraphNode, node2: GraphNode): boolean {
    const distance: number = this.graph.getDistanceOfNodes(node1, node2);
    return distance < node1.radius + node2.radius + this.minNodesDistance ? true : false;
  }

  setRandomEdges() {
    const k = this.samplesCount <= 3 ? this.samplesCount - 1 : 3;

    this.graph.nodes.forEach(node => node.edges = []);

    this.graph.nodes.forEach(node => {
      this.getNearestKNodes(node, this.graph.nodes, k).forEach(nearNode => {
        if (Math.floor(Math.random() * 2) === 1 && this.samplesCount >= 3) { return; }
        const edge = new GraphEdge(nearNode);
        edge.isDirected = (this.isDirected === 1);
        if (!node.doesEdgeExists(edge)) {
          if (!this.isDirected) {
            const backwardEdge = new GraphEdge(node);
            backwardEdge.isDirected = this.isDirected === 1;
            if (!nearNode.doesEdgeExists(backwardEdge)) {
              nearNode.edges.push(backwardEdge);
            }
          }
          node.edges.push(edge);
        }
      });
    });
  }

  getRandomNodes() {
    const nodes: GraphNode[] = [];
    for (let rep = 1; rep <= this.samplesCount; rep++) {
      let iterations = 1;
      const node: GraphNode = new GraphNode();
      do {
        node.value = Math.floor(Math.random() * (this.maxValue - this.minValue + 1)) + this.minValue;
        node.radius = node.value.toString().length * 12;
        node.x = Math.floor(Math.random() * (this.board.width - 20 - 2 * node.radius)) + node.radius + 10;
        node.y = Math.floor(Math.random() * (this.board.height - 20 - 2 * node.radius)) + node.radius + 10;
        if ( iterations++ > 1000) {break; }  // to avoid infinite loop
      }while (nodes.some(node1 => this.doesNodesAreTooCloser(node1, node)));
      if (iterations < 1000) {
        nodes.push(node);
      } else {
        this.samplesCount = nodes.length;
      }
    }
    return nodes;
  }

  randomize() {
    this.selectedNode = null;
    this.customPanelOpened = false;
    this.graph.nodes = this.getRandomNodes();
    this.setRandomEdges();
    this.graph.drawBoard();
  }

  getNearestKNodes(node: GraphNode, Nodes: GraphNode[], k: number) {
    if (k >= Nodes.length) { return []; }
    const nodes = Nodes.slice(0);
    nodes.sort((node1, node2) => this.graph.getDistanceOfNodes(node, node1) > this.graph.getDistanceOfNodes(node, node2) ? 1 : -1);
    return nodes.slice(1, k + 1);
  }

  resetNodes() {
    this.graph.nodes.forEach(node => {
      node.resetMarkerProperties();
      node.resetVisualProperties();
    });
  }

  async eachStep() {
    if (!this.visualizing) {return false; }
    // this.graph.nodes = this.nodes;
    this.graph.drawBoard();
    await Util.delay(this.maxSpeed - this.speed);
    return true;
  }

  async toggleVisualize() {
    if (this.visualizing) {
      this.visualizing = false;
      return;
    }
    await this.algorithms[this.selectedAlgorithm].run();
  }

  async bfs() {
    this.resetNodes();
    if (!this.selectedNode) {
      this.notificationService.addMesage('Select any node as root');
      return;
    }
    this.visualizing = true;
    const queue: GraphNode[] = [];
    this.selectedNode.visited = true;
    this.selectedNode.isRoot = true;
    this.selectedNode.persistVisualProperties = true;
    queue.push(this.selectedNode);

    if (! await this.eachStep()) {return; }

    let curLevelNodeCount = 1;
    let nextLevelNodeCount = 0;

    while (queue.length !== 0) {
      while (curLevelNodeCount !== 0) {
        const node = queue.shift();
        node.persistVisualProperties = true;
        node.edges.forEach(edge => {
          if (!edge.node.visited) {
            edge.node.visited = true;
            queue.push(edge.node);
            nextLevelNodeCount++;
          }
        });
        curLevelNodeCount--;
      }
      if (! await this.eachStep()) {return; }
      curLevelNodeCount = nextLevelNodeCount;
      nextLevelNodeCount = 0;
    }

    this.visualizing = false;
  }

  async dfs() {
    this.resetNodes();
    if (!this.selectedNode) {
      this.notificationService.addMesage('Select any node as root');
      return;
    }

    this.visualizing = true;
    this.selectedNode.isRoot = true;
    await this.dfsUtil(this.selectedNode);
    this.visualizing = false;
  }

  async dfsUtil(node: GraphNode) {
    node.visited = true;
    node.persistVisualProperties = true;
    if (! await this.eachStep()) {return false; }
    for (const edge of node.edges) {
      if (edge.node.visited) {continue; }
      if (! await this.dfsUtil(edge.node)) { return false; }
    }
    return true;
  }
}
