export function length(str: string): number {
    let count = 0;
    for (const _ of str) {
        count++;
    }
    return count;
}

export function sta(str: string): string[] {
    return [...str];
  }

export function trim(str: string): string {
    let start = 0;
    let _end = length(str) - 1;
  
    // Find the start index of the first non-space character
    while (start < _end && sta(str)[start] === ' ') {
      start++;
    }
  
    // Find the end index of the last non-space character
    while (start < _end && sta(str)[_end] === ' ') {
        _end--;
    }
  
    return substring(str ,start, _end + 1);
  }
  
 export function substring(str: string, start: number, _end?: number): string {
    if (start < 0) {
      start = length(str) + start; 
    }
  
    if (_end === undefined) {
        _end = length(str);
    } else if (_end < 0) {
        _end = length(str) + _end;
    }
  
    if (start < 0 || start > length(str) || _end < 0 || _end > length(str)) {
      throw print("Invalid start or end index");
    }
  
    let result = "";
    for (let i = start; i < _end; i++) {
      result += sta(str)[i];
    }
  
    return result;
  }
  

  export function arrayLength(arr: any[]): number {
    let count = 0;
    for (const _ of arr) {
      count++;
    }
    return count;
  }