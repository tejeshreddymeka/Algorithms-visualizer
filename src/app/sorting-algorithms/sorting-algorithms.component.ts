import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HistogramComponent } from '../shared/components/histogram/histogram.component';
import { BoardColoringParams } from '../models/board-coloring-params';

@Component({
  selector: 'app-sorting-algorithms',
  templateUrl: './sorting-algorithms.component.html',
  styleUrls: ['./sorting-algorithms.component.sass']
})

export class SortingAlgorithmsComponent implements OnInit, AfterViewInit {
  algorithms: any[] = [{name:'Bubble Sort', run: () => this.bubbleSort(this.values)},
                     {name:'Quick Sort', run: () => this.quickSort(this.values)},
                     {name: 'Merge Sort', run: () => this.mergeSort(this.values)}];
  seletectedAlgorithm:string = this.algorithms[0].name;
  samplesCount:number = 20;
  maxSamplesCount:number = 30;
  minValue:number = 1;
  maxValue:number = 100; 
  values:number[] = [];
  speed : number = 700; 
  maxSpeed: number = 1500;
  visualizing:boolean = false;
  customPanelOpened:boolean = false;
  customValue:number = null;

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
    this.histogram.adjustBoardParams();
    this.histogram.drawBoard();
    this.customValue = null;
  }

  removeCustomValue(){
    if(this.customValue === null || this.customValue <= 0 || this.customValue > 999)return;
    var index = this.values.findIndex((value) => value===this.customValue);
    if(index >= 0)
      this.values.splice(index,1);
    this.histogram.drawBoard();
  }
  
  toggleCustomPanel(){
    this.customPanelOpened = !this.customPanelOpened;
    this.values = []
    this.histogram.boardContext.clearRect(0,0,this.board.width,this.board.height);
  }

  delay(ms : number)
  {
    return new Promise(resolve => setTimeout(resolve, ms)); 
  }

  randomize(){
    this.customPanelOpened = false;
    this.values = [];
    for(let rep=1;rep<=this.samplesCount;rep++)
    {
      this.values.push(Math.floor(Math.random()*(this.maxValue - this.minValue +1) + this.minValue));
    }
    this.histogram.values = this.values;
    this.histogram.adjustBoardParams();
    this.histogram.drawBoard();
  }

  shuffleValues(){
    var newValues = [];
    for(let ind=0;ind<this.values.length;ind++)
    {
      let curValue: number;
      do{
        curValue = Math.floor(Math.random() * (this.values.length));
      }while(newValues.findIndex(value => value===curValue)!==-1);
      newValues.push(curValue);
    }
    for(let ind=0;ind<this.values.length;ind++)
    {
      newValues[ind] = this.values[newValues[ind]];
    }
    this.values = newValues;
    this.histogram.values = this.values;
    this.histogram.drawBoard();
  }

  async eachStep(array:number[], params: BoardColoringParams){
    if(!this.visualizing)return false;
    this.values = array;
    this.histogram.drawBoard(params);
    await this.delay(this.maxSpeed - this.speed);
    return true;
  }

  async toggleVisualize(){
    if(this.visualizing)
    {
      this.visualizing = false;
      return;
    }
    console.log(this.seletectedAlgorithm);
    var func = this.algorithms.find((algorithm: any) => algorithm.name === this.seletectedAlgorithm);
    console.log(func);
    func.run();
  }

  // bubble Sort
  async bubbleSort(array: number[]){
    this.visualizing = true;
    for(let ind1=0;ind1<array.length;ind1++)
    {
      for(let ind2=0; ind2<array.length - ind1 - 1; ind2++){
        var params:BoardColoringParams = new BoardColoringParams();
        params.cmpInd1 = ind2;
        params.cmpInd2 = ind2+1;
        params.swapped = false;
        if(! await this.eachStep(array,params))return;
        if( array[ind2] > array[ind2+1])
        {
          array[ind2+1] = [array[ind2],array[ind2] = array[ind2+1]][0];
          params.swapped = true;
          if(! await this.eachStep(array,params))return;
        }
      }
    }
    this.visualizing = false;
  }
  // bubble sort end

  //quick sort code begin
  async quickSort(items:number[])
  {
    this.visualizing = true;
    await this.quickSortUtil(items,0,items.length-1);
    this.visualizing = false;
  }

  async quickSortUtil(items:number[], left:number, right:number) 
  {
    var index;
    if(left < right)
    {
      index = await this.partition(items, left, right);
      await this.quickSortUtil(items, left, index - 1);
      await this.quickSortUtil(items, index+1, right);
    }
    return items;
  }

  async partition(items:number[], left:number, right:number) 
  {
    var pivot   = items[right], 
        i       = left-1, 
        j       = left, 
        pivotInd = right;

    var params:BoardColoringParams = new BoardColoringParams();
    params.pivotInd = pivotInd;
    params.leftBoundary = left;params.rightBoundary = right;
    for (j = left; j <= right - 1; j++)
    {
      params.cmpInd1 = i+1;params.cmpInd2 = j;params.swapped = false;
      if(! await this.eachStep(items,params))return;
      if (items[j] < pivot)
      {
        i++;
        items[i] = [items[j], items[j] = items[i]][0];

        params.cmpInd1 = i;params.cmpInd2 = j;params.swapped = true;
        if(! await this.eachStep(items,params))return;
      }
    }
    items[i+1] = [items[pivotInd], items[pivotInd] = items[i+1]][0];

    params.cmpInd1 = i+1; params.cmpInd2 = pivotInd; params.swapped = false;
    if(! await this.eachStep(items,params))return;
    params.swapped = true;
    if(! await this.eachStep(items,params))return;
    return i+1;
  }
  //quick sort end

  //merge sort
  async mergeSort(array:number[])
  {
    this.visualizing = true;
    await this.mergeSortUtil(array,0, this.values.length-1);
    this.visualizing = false;
  }

  async mergeSortUtil(arr:number[], l:number, r:number) 
  { 
    if(!this.visualizing)return arr;
    if (l < r) 
    { 
      let m = Math.floor(l+(r-l)/2); 

      let params:BoardColoringParams = new BoardColoringParams();
      params.swapped = false;
      params.leftBoundary = l;
      params.rightBoundary = m;
      params.leftBoundary2 = m+1;
      params.rightBoundary2 = r;
      if(! await this.eachStep(arr,params))return arr;

      arr = await this.mergeSortUtil(arr, l, m); 
      arr = await this.mergeSortUtil(arr, m+1, r); 
      return await this.merge(arr, l, m, r); 
    } 
    return arr;
  } 
  
  async merge(arr:number[], l:number, m:number, r:number) 
  { 
    if(!this.visualizing)return;
    let i, j, k; 
    let n1 = m - l + 1; 
    let n2 =  r - m; 
    let L:number[] = [];
    let R:number[] = []; 
  
    for (i = 0; i < n1; i++) 
      L.push(arr[l + i]); 
    for (j = 0; j < n2; j++) 
      R.push(arr[m + 1+ j]); 
    
    let params:BoardColoringParams = new BoardColoringParams();
    params.swapped = false;
    params.leftBoundary = l;
    params.rightBoundary = m;
    params.leftBoundary2 = m+1;
    params.rightBoundary2 = r;
    i = 0; // Initial index of first subarray 
    j = 0; // Initial index of second subarray 
    k = l; // Initial index of merged subarray 
    while (i < n1 && j < n2) 
    { 
      params.cmpInd1 = l+i;
      params.cmpInd2 = m+1+j;
      params.pivotInd = k;
      if(! await this.eachStep(arr,params))return;
      if (L[i] <= R[j]) 
      { 
        arr[k] = L[i]; i++; 
        if(! await this.eachStep(arr,params))return;
        params.cmpInd1 = l+i;
      } 
      else
      { 
        arr[k] = R[j]; j++; 
        if(! await this.eachStep(arr,params))return;
        params.cmpInd2 = m+1+j;
      } 
      k++; 
    } 
    while (i < n1) 
    { 
      arr[k] = L[i]; i++; k++; 
      if(! await this.eachStep(arr,params))return;
      params.cmpInd1 = l+i;
    } 
    while (j < n2) 
    { 
      arr[k] = R[j]; j++; k++; 
      if(! await this.eachStep(arr,params))return;
      params.cmpInd2 = m+1+j;
    } 
    return arr;
  } 
    
  //merge sort end
}