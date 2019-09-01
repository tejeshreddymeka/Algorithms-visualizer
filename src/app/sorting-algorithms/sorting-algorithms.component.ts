import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HistogramComponent } from '../shared/components/histogram/histogram.component';

@Component({
  selector: 'app-sorting-algorithms',
  templateUrl: './sorting-algorithms.component.html',
  styleUrls: ['./sorting-algorithms.component.sass']
})
export class SortingAlgorithmsComponent implements OnInit, AfterViewInit {

  algorithms: string[] = ['Bubble Sort','Quick Sort','Merge Sort'];
  seletectedAlgorithm:string = this.algorithms[0];
  samplesCount:number = 20;
  maxSamplesCount:number = 30;
  minValue:number = 1;
  maxValue:number = 100; 
  values:number[] = [];
  speed : number = 700; 
  maxSpeed: number = 1500;

  board: HTMLCanvasElement;

  @ViewChild("histogram", {static: false}) histogram : HistogramComponent;
  constructor() { }

  ngOnInit() {
    for(let rep=1;rep<=this.samplesCount;rep++)
    {
      this.values.push(Math.floor(Math.random()*(this.maxValue - this.minValue +1) + this.minValue));
    }
  }

  ngAfterViewInit(){
  }

  onHistogramReady($event: HTMLCanvasElement)
  {
    this.board = $event;
    let minBarWidth = 7;
    this.maxSamplesCount = Math.ceil((this.board.width -4)/(minBarWidth + 2));
  }

  updateSpeed(event){
    this.speed = event.value;
  }

  updateSamplesCount(event){
    this.samplesCount = event.value;
    this.randomize();
  }

  delay(ms : number)
  {
    return new Promise(resolve => setTimeout(resolve, ms)); 
  }

  randomize(){
    this.values = [];
    for(let rep=1;rep<=this.samplesCount;rep++)
    {
      this.values.push(Math.floor(Math.random()*(this.maxValue - this.minValue +1) + this.minValue));
    }
    this.histogram.values = this.values;
    this.histogram.adjustBoardParams();
    this.histogram.drawBoard();
  }

  eachStep(ind2:number, array:number[], swapped:boolean){
    this.values = array;
    this.histogram.drawBoard(ind2,ind2+1,swapped);
  }

  visualize(){
    this.bubbleSort(this.values);
  }

  async bubbleSort(array: number[]){
    for(let ind1=0;ind1<array.length;ind1++)
    {
      for(let ind2=0; ind2<array.length - ind1 - 1; ind2++){
        this.eachStep(ind2,array,false);
        await this.delay(this.maxSpeed - this.speed);
        if( array[ind2] > array[ind2+1])
        {
          array[ind2+1] = [array[ind2],array[ind2] = array[ind2+1]][0];
          this.eachStep(ind2,array,true);
          await this.delay(this.maxSpeed - this.speed);
        }
      }
    }
  }
}