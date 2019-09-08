import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GraphComponent } from 'src/app/shared/components/graph/graph.component';
import { HighlightService } from 'src/app/services/highlight.service';
import { Util } from 'src/app/shared/util';
import { GraphNode, GraphEdge} from 'src/app/models/graph';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-graph-algorithms',
  templateUrl: './graph-algorithms.component.html',
  styleUrls: ['./graph-algorithms.component.sass']
})
export class GraphAlgorithmsComponent implements OnInit {
  algorithms: any = [];
  algorithmNames: string[] = [
    'BFS',
  ];
  selectedAlgorithm:string = this.algorithmNames[0];
  samplesCount:number = 50;
  maxSamplesCount:number = 200;
  minValue:number = 1;
  maxValue:number = 100; 
  values:number[] = [];
  speed : number = 700; 
  maxSpeed: number = 1500;
  visualizing:boolean = false;
  customPanelOpened:boolean = false;
  customValue:number = null;
  codePanelOpened:boolean = false;

  nodes:GraphNode[] = [];
  minNodesDistance:number = 20;
  selectedNode: GraphNode;

  algorithmCode:string = '';
  algorithmExplanation:string = '';

  board: HTMLCanvasElement;

  @ViewChild("graph", {static: false}) graph: GraphComponent;
  constructor(
    private highlightService:HighlightService,
    private notificationService: NotificationService
  ) {
    this.algorithms = {
      'BFS': {name: 'BFS', run: () => this.bfs(), code: 'test bfs code', explanation: 'test bfs'}
    };
   }

  @HostListener('window:resize', ['$event']) onWindowResize(event){
    this.graph.adjustBoardParams();
    this.randomize();
    this.graph.drawBoard();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.randomize();
  }

  onGraphReady($event: HTMLCanvasElement)
  {
    this.board = $event;
    this.randomize();
  }

  onNodeSelected($event: GraphNode)
  {
    this.selectedNode = $event;
  }

  updateSpeed(event){
    this.speed = event.value;
  }

  updateSamplesCount(event){
    this.customPanelOpened = false;
    this.samplesCount = event.value;
    this.randomize();
  }

  updateMaxValue(event){
    this.customPanelOpened = false;
    this.maxValue = event.value;
    this.randomize();
  }

  addCustomValue(){
    if(this.customValue === null || this.customValue <= 0 || this.customValue > 999)return;
    this.values.push(this.customValue);
    this.customValue = null;
  }

  removeCustomValue(){
  }
  
  toggleCustomPanel(){
    this.customPanelOpened = !this.customPanelOpened;

    if(!this.customPanelOpened)
      this.randomize();
  }

  toggleCodePanel(){
    this.codePanelOpened = !this.codePanelOpened;
    this.algorithmCode = this.highlightService.highlightCode(this.algorithms[this.selectedAlgorithm].code, 'cpp');
    this.algorithmExplanation = this.algorithms[this.selectedAlgorithm].explanation;
  }

  
  doesNodesAreTooCloser(node1: GraphNode, node2: GraphNode): boolean
  {
    let distance:number = this.graph.getDistanceOfNodes(node1, node2);
    return distance < node1.radius + node2.radius + this.minNodesDistance ? true : false;
  }

  randomize(){
    this.selectedNode = null;
    this.customPanelOpened = false;
    this.nodes = [];

    //adding random nodes begin
    for(let rep=1;rep<=this.samplesCount;rep++)
    {
      let iterations = 1;
      let node:GraphNode = new GraphNode();
      do
      {
        node.value = Math.floor(Math.random()*(this.maxValue - this.minValue + 1)) + this.minValue;
        node.radius = node.value.toString().length * 12; 
        node.x = Math.floor(Math.random()*(this.board.width - 20 - 2*node.radius)) + node.radius + 10;
        node.y = Math.floor(Math.random()*(this.board.height - 20 - 2*node.radius)) + node.radius + 10;
        if( iterations++ > 1000)break;  // to avoid infinite loop
      }while(this.nodes.some(node1 => this.doesNodesAreTooCloser(node1, node)))
      if(iterations < 1000)
      {
        this.nodes.push(node);
      }
      else{
        this.samplesCount = this.nodes.length;
      }
    }
    this.graph.nodes = this.nodes;
    //adding random nodes end

    //adding random edges begin
    let k = this.samplesCount <= 3 ? this.samplesCount - 1 : 3;
    this.nodes.forEach(node => {
      this.getNearestKNodes(node, this.nodes, k).forEach(near_node => {
        if(Math.floor(Math.random()*2) === 1 && this.samplesCount >= 3) return;
        let edge = new GraphEdge();
        edge.node = near_node;
        node.edges.push(edge);
      });
    });
    //adding random edges end

    this.graph.drawBoard();
  }

  getNearestKNodes(node: GraphNode, _nodes: GraphNode[], k:number){
    if(k >= _nodes.length) return [];
    let nodes = _nodes.slice(0);
    nodes.sort((node1,node2) => this.graph.getDistanceOfNodes(node,node1) > this.graph.getDistanceOfNodes(node,node2) ? 1 : -1);
    return nodes.slice(1,k+1);
  }


  shuffleValues(){
  }

  async eachStep(){
    if(!this.visualizing)return false;
    //this.graph.nodes = this.nodes;
    this.graph.drawBoard();
    await Util.delay(this.maxSpeed - this.speed);
    return true;
  }

  async toggleVisualize(){
    if(this.visualizing)
    {
      this.visualizing = false;
      return;
    }
    this.algorithms[this.selectedAlgorithm].run();
  }

  async bfs(){
    this.visualizing = true;
    if(!this.selectedNode)
    {
      this.notificationService.addMesage("Select any node as root");
      return;
    }
    let queue: GraphNode[] = [];
    this.selectedNode.visited = true;
    queue.push(this.selectedNode);

    while(queue.length != 0)
    {
      let node = queue.shift();
      node.backgroudColor = "white";
      node.color = "black";
      if(! await this.eachStep())break;;
      node.edges.forEach(edge => {
        if(!edge.node.visited)
        {
          edge.node.visited = true;
          queue.push(edge.node);
        }
      });
    }

    this.visualizing = false;
  }

}
