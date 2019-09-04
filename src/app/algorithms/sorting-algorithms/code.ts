export class SortingAlgorithms{

  bubbleSortCode: string = `
  // C++ program for implementation of Bubble sort 
  #include <bits/stdc++.h> 
  using namespace std; 
  
  void swap(int *xp, int *yp) 
  { 
    int temp = *xp; 
    *xp = *yp; 
    *yp = temp; 
  } 
  
  // A function to implement bubble sort 
  void bubbleSort(int arr[], int n) 
  { 
    int i, j; 
    for (i = 0; i < n-1; i++)	 
    
    // Last i elements are already in place 
    for (j = 0; j < n-i-1; j++) 
      if (arr[j] > arr[j+1]) 
        swap(&arr[j], &arr[j+1]); 
  } 
  
  /* Function to print an array */
  void printArray(int arr[], int size) 
  { 
    int i; 
    for (i = 0; i < size; i++) 
      cout << arr[i] << " "; 
    cout << endl; 
  } 
  
  // Driver code 
  int main() 
  { 
    int arr[] = {64, 34, 25, 12, 22, 11, 90}; 
    int n = sizeof(arr)/sizeof(arr[0]); 
    bubbleSort(arr, n); 
    cout<<"Sorted array: \\n"; 
    printArray(arr, n); 
    return 0; 
  } 
  `;

  insertionSort:string = `
  // C++ program for insertion sort 
  #include <bits/stdc++.h> 
  using namespace std; 
  
  /* Function to sort an array using insertion sort*/
  void insertionSort(int arr[], int n) 
  { 
    int i, key, j; 
    for (i = 1; i < n; i++) 
    { 
      key = arr[i]; 
      j = i - 1; 
  
      /* Move elements of arr[0..i-1], that are 
      greater than key, to one position ahead 
      of their current position */
      while (j >= 0 && arr[j] > key) 
      { 
        arr[j + 1] = arr[j]; 
        j = j - 1; 
      } 
      arr[j + 1] = key; 
    } 
  } 
  
  // A utility function to print an array of size n 
  void printArray(int arr[], int n) 
  { 
    int i; 
    for (i = 0; i < n; i++) 
      cout << arr[i] << " "; 
    cout << endl; 
  } 
  
  /* Driver code */
  int main() 
  { 
    int arr[] = { 12, 11, 13, 5, 6 }; 
    int n = sizeof(arr) / sizeof(arr[0]); 
  
    insertionSort(arr, n); 
    printArray(arr, n); 
  
    return 0; 
  } 
  `;
  
  quickSort: string = `
  /* C++ implementation of QuickSort */
  #include <bits/stdc++.h> 
  using namespace std; 
  
  // A utility function to swap two elements 
  void swap(int* a, int* b) 
  { 
    int t = *a; 
    *a = *b; 
    *b = t; 
  } 
  
  /* This function takes last element as pivot, places 
  the pivot element at its correct position in sorted 
  array, and places all smaller (smaller than pivot) 
  to left of pivot and all greater elements to right 
  of pivot */
  int partition (int arr[], int low, int high) 
  { 
    int pivot = arr[high]; // pivot 
    int i = (low - 1); // Index of smaller element 
  
    for (int j = low; j <= high - 1; j++) 
    { 
      // If current element is smaller than the pivot 
      if (arr[j] < pivot) 
      { 
        i++; // increment index of smaller element 
        swap(&arr[i], &arr[j]); 
      } 
    } 
    swap(&arr[i + 1], &arr[high]); 
    return (i + 1); 
  } 
  
  /* The main function that implements QuickSort 
  arr[] --> Array to be sorted, 
  low --> Starting index, 
  high --> Ending index */
  void quickSort(int arr[], int low, int high) 
  { 
    if (low < high) 
    { 
      /* pi is partitioning index, arr[p] is now 
      at right place */
      int pi = partition(arr, low, high); 
  
      // Separately sort elements before 
      // partition and after partition 
      quickSort(arr, low, pi - 1); 
      quickSort(arr, pi + 1, high); 
    } 
  } 
  
  /* Function to print an array */
  void printArray(int arr[], int size) 
  { 
    int i; 
    for (i = 0; i < size; i++) 
      cout << arr[i] << " "; 
    cout << endl; 
  } 
  
  // Driver Code 
  int main() 
  { 
    int arr[] = {10, 7, 8, 9, 1, 5}; 
    int n = sizeof(arr) / sizeof(arr[0]); 
    quickSort(arr, 0, n - 1); 
    cout << "Sorted array: \\n"; 
    printArray(arr, n); 
    return 0; 
  } 
  `;

  mergeSort: string = `
  #include<stdlib.h> 
  #include<stdio.h> 
  
  // Merges two subarrays of arr[]. 
  // First subarray is arr[l..m] 
  // Second subarray is arr[m+1..r] 
  void merge(int arr[], int l, int m, int r) 
  { 
    int i, j, k; 
    int n1 = m - l + 1; 
    int n2 = r - m; 
  
    /* create temp arrays */
    int L[n1], R[n2]; 
  
    /* Copy data to temp arrays L[] and R[] */
    for (i = 0; i < n1; i++) 
      L[i] = arr[l + i]; 
    for (j = 0; j < n2; j++) 
      R[j] = arr[m + 1+ j]; 
  
    /* Merge the temp arrays back into arr[l..r]*/
    i = 0; // Initial index of first subarray 
    j = 0; // Initial index of second subarray 
    k = l; // Initial index of merged subarray 
    while (i < n1 && j < n2) 
    { 
      if (L[i] <= R[j]) 
      { 
        arr[k] = L[i]; 
        i++; 
      } 
      else
      { 
        arr[k] = R[j]; 
        j++; 
      } 
      k++; 
    } 
  
    /* Copy the remaining elements of L[], if there 
    are any */
    while (i < n1) 
    { 
      arr[k] = L[i]; 
      i++; 
      k++; 
    } 
  
    /* Copy the remaining elements of R[], if there 
    are any */
    while (j < n2) 
    { 
      arr[k] = R[j]; 
      j++; 
      k++; 
    } 
  } 
  
  /* l is for left index and r is right index of the 
  sub-array of arr to be sorted */
  void mergeSort(int arr[], int l, int r) 
  { 
    if (l < r) 
    { 
      // Same as (l+r)/2, but avoids overflow for 
      // large l and h 
      int m = l+(r-l)/2; 
  
      // Sort first and second halves 
      mergeSort(arr, l, m); 
      mergeSort(arr, m+1, r); 
  
      merge(arr, l, m, r); 
    } 
  } 
  
  /* UTILITY FUNCTIONS */
  /* Function to print an array */
  void printArray(int A[], int size) 
  { 
    int i; 
    for (i=0; i < size; i++) 
      printf("%d ", A[i]); 
    printf("\\n"); 
  } 
  
  /* Driver program to test above functions */
  int main() 
  { 
    int arr[] = {12, 11, 13, 5, 6, 7}; 
    int arr_size = sizeof(arr)/sizeof(arr[0]); 
  
    printf("Given array is \\n"); 
    printArray(arr, arr_size); 
  
    mergeSort(arr, 0, arr_size - 1); 
  
    printf("\\nSorted array is \\n"); 
    printArray(arr, arr_size); 
    return 0; 
  } 
  `;
}