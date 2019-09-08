import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  messages: string[] = [];
  constructor() { }

  addMesage(message: string)
  {
    this.messages.push(message);
  }

  popMessage()
  {
    this.messages.splice(0,1);
  }
}
