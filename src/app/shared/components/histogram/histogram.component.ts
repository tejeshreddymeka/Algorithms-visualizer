import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { BoardColoringParams } from 'src/app/models/board-coloring-params';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.sass']
})
export class HistogramComponent implements OnInit, AfterViewInit {

  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() values: number[];
  @Output() historgramReady = new EventEmitter<HTMLCanvasElement>();

  @ViewChild('board', {static: false}) public  boardElementRef: ElementRef;
  @ViewChild('boardWrapper', {static: false}) public boardWrapperElementRef: ElementRef;
  boardContext: CanvasRenderingContext2D;
  private board: HTMLCanvasElement;

  boardColoringParams: BoardColoringParams = new BoardColoringParams();

  private initX: number;
  private initY: number;
  private barWidth: number;
  private barUnitLength: number;
  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.initBoard();
  }

  ngAfterViewInit() {
    this.initBoard();
    this.historgramReady.emit(this.board);
  }

  adjustBoardParams() {
    const boardWrapper: Element = this.boardWrapperElementRef.nativeElement;
    this.board.width = boardWrapper.clientWidth;
    this.board.height = boardWrapper.clientHeight;
    this.barWidth = (this.board.width - 2 * (this.values.length + 2)) / this.values.length;
    this.barUnitLength = (this.board.height - 50) / Math.max(...this.values);
    this.barWidth = Math.min(this.barWidth, 10);
    this.initX = (this.board.width - 2 * this.values.length - this.barWidth * this.values.length) / 2 + 2;
    this.initY = 40;
  }

  initBoard() {
    this.board = this.boardElementRef.nativeElement;
    this.boardContext = this.board.getContext('2d');
    this.adjustBoardParams();
    this.drawBoard();
  }

  drawBoard(params: BoardColoringParams = new BoardColoringParams()) {
    this.boardColoringParams = params;
    this.boardContext.clearRect(0, 0, this.board.width, this.board.height);
    let x = this.initX , y = this.initY;
    for (let ind = 0; ind < this.values.length; ind++) {
      this.boardContext.rotate(-Math.PI / 2);
      this.boardContext.textAlign = 'center';
      if ((params.ind1 !== null && params.ind1 === ind) || (params.ind2 !== null && params.ind2 === ind)) {
        if (params.swapped) {
          this.boardContext.fillStyle = '#990000';
        } else if (params.ind1 === ind) {
          this.boardContext.fillStyle = '#232442';
 } else if (params.ind2 === ind) {
          this.boardContext.fillStyle = '#1b4a96';
 }
        this.boardContext.font = 'bold 10pt Courier';
      } else {
        this.boardContext.fillStyle = 'black';
        this.boardContext.font = 'normal 8pt Courier';
      }
      this.boardContext.fillText(this.values[ind].toString(), -15, x + 8);
      this.boardContext.rotate(Math.PI / 2);
      if ((params.ind1 !== null && params.ind1 === ind) || (params.ind2 !== null && params.ind2 === ind)) {
        if (params.swapped) {
          this.boardContext.fillStyle = '#990000';
        } else if (params.ind1 === ind) {
          this.boardContext.fillStyle = '#23216d';
 } else if (params.ind2 === ind) {
          this.boardContext.fillStyle = '#143873';
 }
      } else {
        this.boardContext.fillStyle = 'grey';
      }
      const barHeight = this.values[ind] * this.barUnitLength;
      if (params.ind3 !== null && params.ind3 === ind) {
        this.boardContext.fillStyle = 'black';
      }
      this.boardContext.fillRect(x, y, this.barWidth, barHeight);

      if (params.leftBoundary === ind || params.rightBoundary === ind) {
          this.boardContext.beginPath();
          this.boardContext.moveTo( x, y - 14);
          this.boardContext.lineTo( x + this.barWidth, y - 14);
          this.boardContext.lineTo( (2 * x + this.barWidth) / 2, y - 2);
          this.boardContext.lineTo( x, y - 14);
          this.boardContext.closePath();
          if (params.leftBoundary === ind) {
            this.boardContext.fillStyle = 'green';
          } else if (params.rightBoundary === ind) {
            this.boardContext.fillStyle = 'red';
 }
          this.boardContext.fill();
      }
      if (params.leftBoundary2 === ind || params.rightBoundary2 === ind) {
          this.boardContext.beginPath();
          this.boardContext.moveTo( x, y - 14);
          this.boardContext.lineTo( x + this.barWidth, y - 14);
          this.boardContext.lineTo( (2 * x + this.barWidth) / 2, y - 2);
          this.boardContext.lineTo( x, y - 14);
          this.boardContext.closePath();
          if (params.leftBoundary2 === ind) {
            this.boardContext.fillStyle = 'blue';
          } else if (params.rightBoundary2 === ind) {
            this.boardContext.fillStyle = 'orange';
 }
          this.boardContext.fill();
      }
      x += this.barWidth + 2;
    }
  }
}
