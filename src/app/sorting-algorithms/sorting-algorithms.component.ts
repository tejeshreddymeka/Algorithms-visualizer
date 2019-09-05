import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HistogramComponent } from '../shared/components/histogram/histogram.component';
import { BoardColoringParams } from '../models/board-coloring-params';
import { SortingAlgorithms } from '../algorithms/sorting-algorithms/code';
import { HighlightService } from '../services/highlight.service';

@Component({
  selector: 'app-sorting-algorithms',
  templateUrl: './sorting-algorithms.component.html',
  styleUrls: ['./sorting-algorithms.component.sass']
})

export class SortingAlgorithmsComponent implements OnInit, AfterViewInit {
  algorithms: any = [];
  algorithmNames: string[] = [
    'Bubble Sort',
    'Insertion Sort',
    'Quick Sort',
    'Merge Sort',
    'Heap Sort',
    'Selection Sort',
  ];
  selectedAlgorithm:string = this.algorithmNames[0];
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
  codePanelOpened:boolean = false;

  board: HTMLCanvasElement;

  sortingAlgorithms:SortingAlgorithms = new SortingAlgorithms();
  algorithmCode:string = '';
  algorithmExplanation:string = '';

  @ViewChild("histogram", {static: false}) histogram : HistogramComponent;
  constructor(
    private highlightService:HighlightService
  ) {
    this.algorithms = {
      'Bubble Sort': {name: 'Bubble Sort', run: () => this.bubbleSort(this.values), code: this.sortingAlgorithms.bubbleSortCode, explanation: this.sortingAlgorithms.bubbleSortExplanation},
      'Insertion Sort': {name: 'Insertion Sort', run: () => this.insertionSort(this.values), code: this.sortingAlgorithms.insertionSortCode, explanation: this.sortingAlgorithms.insertionSortExplanation},
      'Quick Sort': {name: 'Quick Sort', run: () => this.quickSort(this.values), code: this.sortingAlgorithms.quickSortCode, explanation: this.sortingAlgorithms.quickSortExplanation},
      'Merge Sort': {name: 'Merge Sort', run: () => this.mergeSort(this.values), code: this.sortingAlgorithms.mergeSortCode, explanation: this.sortingAlgorithms.mergeSortExplanation},
      'Heap Sort': {name: 'Heap Sort', run: () => this.heapSort(this.values), code: this.sortingAlgorithms.heapSortCode, explanation: this.sortingAlgorithms.heapSortExplanation},
      'Selection Sort': {name: 'Selection Sort', run: () => this.selectionSort(this.values), code: this.sortingAlgorithms.selectionSortCode, explanation: this.sortingAlgorithms.selectionSortExplanation},
    };
   }

  ngOnInit() {
    for(let rep=1;rep<=this.samplesCount;rep++)
    {
      this.values.push(Math.floor(Math.random()*(this.maxValue - this.minValue +1) + this.minValue));
    }
  }

  ngAfterViewInit() {
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
    if(!this.customPanelOpened)
      this.randomize();
  }

  toggleCodePanel(){
    this.codePanelOpened = !this.codePanelOpened;
    this.algorithmCode = this.highlightService.highlightCode(this.algorithms[this.selectedAlgorithm].code, 'cpp');
    this.algorithmExplanation = this.algorithms[this.selectedAlgorithm].explanation;
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
    this.algorithms[this.selectedAlgorithm].run();
  }

  // bubble Sort
  async bubbleSort(array: number[]){
    this.visualizing = true;
    for(let ind1=0;ind1<array.length;ind1++)
    {
      let swapped:boolean = false;
      for(let ind2=0; ind2<array.length - ind1 - 1; ind2++){
        var params:BoardColoringParams = new BoardColoringParams();
        params.cmpInd1 = ind2;
        params.cmpInd2 = ind2+1;
        params.swapped = false;
        if(! await this.eachStep(array,params))return;
        if( array[ind2] > array[ind2+1])
        {
          swapped = true;
          array[ind2+1] = [array[ind2],array[ind2] = array[ind2+1]][0];
          params.swapped = true;
          if(! await this.eachStep(array,params))return;
        }
      }
      if(!swapped)break;
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
        if(i!==j)
        {
          params.cmpInd1 = i;params.cmpInd2 = j;params.swapped = true;
          if(! await this.eachStep(items,params))return;
        }
      }
    }

    items[i+1] = [items[pivotInd], items[pivotInd] = items[i+1]][0];

    params.cmpInd1 = i+1; params.cmpInd2 = pivotInd; params.swapped = false;
    if(! await this.eachStep(items,params))return;
    if(i+1 !== pivotInd)
    {
      params.swapped = true;
      if(! await this.eachStep(items,params))return;
    }
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

  //Insertion sort
  async insertionSort(array:number[])
  {
    this.visualizing = true;
    let params:BoardColoringParams = new BoardColoringParams();
    let key:number;
    for(let ind1 = 0;ind1<array.length; ++ind1)
    {
      if(!this.visualizing)return;
      key = array[ind1];
      let ind2 = ind1 - 1;
      params.cmpInd1 = ind2;
      params.cmpInd2 = ind2+1;
      params.swapped = false;
      if(! await this.eachStep(array,params))return;
      while(ind2>=0 && array[ind2] > key)
      {

        if(!this.visualizing)return;
        array[ind2+1] = array[ind2];
        array[ind2] = key;

        params.swapped = true;
        if(! await this.eachStep(array,params))return;

        ind2--;

        params.cmpInd1 = ind2;
        params.cmpInd2 = ind2+1;
        params.swapped = false;
        if(! await this.eachStep(array,params))return;
      }
      //array[ind2+1] = key;
    }
    this.visualizing = false;
  }
  //Insertion sort end

  //Selection sort
async selectionSort(arr:number[]) 
{ 
  let params:BoardColoringParams = new BoardColoringParams();
  params.swapped = false;
  this.visualizing = true;
	for (let i = 0; i < arr.length-1; i++) 
	{ 
    let min_idx = i; 
    params.cmpInd1 = i;
    params.pivotInd = min_idx;
    for (let j = i+1; j < arr.length; j++) 
    {
      if (arr[j] < arr[min_idx]) 
        min_idx = j; 
      params.pivotInd = min_idx;
      params.cmpInd2 = j;
      if(! await this.eachStep(arr,params))return;
    }
    if(arr[i]!=arr[min_idx])
    {
      arr[i] = [arr[min_idx], arr[min_idx] = arr[i]][0];
      params.swapped = true;
      params.pivotInd = null;
      params.cmpInd2 = min_idx;
      if(! await this.eachStep(arr,params))return;
      params.swapped = false;
    }
	} 
  this.visualizing = false;
} 
  //Selection sort end

  //Heap sort
  async heapify(arr:number[], n:number, i:number) 
  { 
    let params:BoardColoringParams = new BoardColoringParams();

    let largest:number = i; // Initialize largest as root 
    let l:number = 2*i + 1; // left = 2*i + 1 
    let r:number = 2*i + 2; // right = 2*i + 2 
  
    params.pivotInd = largest;
    params.cmpInd1 = l;
    params.cmpInd2 = r;
    if(l < n && r < n)
      if(! await this.eachStep(arr,params)) return false; 
    // If left child is larger than root 
    if (l < n && arr[l] > arr[largest]) 
      largest = l; 
    
    // If right child is larger than largest so far 
    if (r < n && arr[r] > arr[largest]) 
      largest = r; 
  
    // If largest is not root 
    if (largest != i) 
    { 
      arr[i] = [arr[largest], arr[largest] = arr[i]][0];
      
      params.pivotInd = null;
      params.cmpInd1 = i;
      params.cmpInd2 = largest;
      params.swapped = true;
      if(! await this.eachStep(arr,params)) return false; 
      params.swapped = false;

      // Recursively heapify the affected sub-tree 
      if(! await this.heapify(arr, n, largest)) return false; 
    } 
    return true;
  } 
  
  // main function to do heap sort 
  async heapSort(arr:number[]) 
  { 
    let n:number = arr.length;
    let params:BoardColoringParams = new BoardColoringParams();
    this.visualizing = true;
    // Build heap (rearrange array) 
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) 
    {
      if(! await this.heapify(arr, n, i)) return; 
    }

    // One by one extract an element from heap 
    for (let i=n-1; i>=0; i--) 
    { 
      params.cmpInd1 = 0;
      params.cmpInd2 = i;
      if(! await this.eachStep(arr,params))return;
      // Move current root to end 
      arr[i] = [arr[0], arr[0] = arr[i]][0];
      
      params.cmpInd1 = 0;
      params.cmpInd2 = i;
      params.swapped = true;
      if(! await this.eachStep(arr,params))return;
      params.swapped = false;

      // call max heapify on the reduced heap 
      if(! await this.heapify(arr, i, 0)) return; 
    } 
    this.visualizing = false;
  } 

  //Heap sort end
}