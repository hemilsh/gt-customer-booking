import { Injectable } from '@angular/core';  
  
@Injectable()  
export class SharedService {  
  
  private data = false;  
  
 setOption(option, value) {      
    this.data = value;  
  }  
  
  getOption() {  
    return this.data;  
  }  
}   