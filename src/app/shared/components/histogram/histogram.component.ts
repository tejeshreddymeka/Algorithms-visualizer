import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.sass']
})
export class HistogramComponent implements OnInit, AfterViewInit {

  @Input() minValue:number;
  @Input() maxValue:number; 
  @Input() values:number[];
  @Output() historgramReady = new EventEmitter<HTMLCanvasElement>();

  @ViewChild("board", {static: false}) public  boardElementRef: ElementRef;
  @ViewChild("boardWrapper", {static: false}) public boardWrapperElementRef: ElementRef;
  private boardContext: CanvasRenderingContext2D;
  private board: HTMLCanvasElement;

  private initX: number;
  private initY: number;
  private barWidth: number;
  private barUnitLength: number;

  private cmpInd1 = -1;
  private cmpInd2 = -1;
  private swapped:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event){
    this.initBoard();
  }

  ngAfterViewInit(){
    this.initBoard();
    this.historgramReady.emit(this.board);
  }

  adjustBoardParams(){
    const boardWrapper: Element = this.boardWrapperElementRef.nativeElement;
    this.board.width = boardWrapper.clientWidth - 18;
    this.board.height = boardWrapper.clientHeight;
    this.barWidth = (this.board.width - 2*this.values.length)/this.values.length;
    this.barUnitLength = (this.board.height - 30)/Math.max(...this.values);
    this.barWidth = Math.min(this.barWidth,10);
    this.initX = (this.board.width - 2 * this.values.length - this.barWidth * this.values.length)/2 + 2;
    this.initY = 20;
  }

  initBoard(){
    this.board = this.boardElementRef.nativeElement;
    this.boardContext = this.board.getContext('2d');
    this.adjustBoardParams();
    this.drawBoard(); 
  }

  drawBoard(ind1:number = null, ind2:number = null, swapped:boolean = false){
    if(ind1!==null && ind2!==null)
    {
      this.cmpInd1 = ind1;
      this.cmpInd2 = ind2;
      this.swapped = swapped;
    }

    this.boardContext.clearRect(0,0,this.board.width, this.board.height);
    let x = this.initX , y = this.initY;
    for(let ind=0;ind<this.values.length; ind++)
    {

      this.boardContext.rotate(-Math.PI/2);
      this.boardContext.textAlign = "center";
      if((ind1!==null && ind1===ind) || (ind2!==null && ind2===ind))
      {
        if(swapped)
        {
          this.boardContext.fillStyle = "#990000";
        }
        else
        {
          this.boardContext.fillStyle = "#232442";
        }
        this.boardContext.font = "bold 10pt Courier";
      }
      else{
        this.boardContext.fillStyle = "black";
        this.boardContext.font = "normal 8pt Courier";
      }
      this.boardContext.fillText(this.values[ind].toString(),-9,x+8);
      this.boardContext.rotate(Math.PI/2);
      if((ind1!==null && ind1===ind) || (ind2!==null && ind2===ind))
      {
        if(swapped)
        {
          this.boardContext.fillStyle = "#990000";
        }
        else
        {
          this.boardContext.fillStyle = "#232442";
        }
      }
      else
      {
        this.boardContext.fillStyle = "grey";
      }
      this.boardContext.fillRect(x,y,this.barWidth, this.values[ind]*this.barUnitLength);
      x += this.barWidth + 2 
    }
  }
}
