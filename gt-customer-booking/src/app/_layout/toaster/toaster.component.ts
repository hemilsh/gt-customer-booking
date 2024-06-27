import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Toast } from './toast.interface';

@Component({
  selector: 'app-toaster',
  template: `
    <div class="toast toast-{{toast.type}}" 
      [style.bottom.px]="i*100">
      <h6 class="toast-heading">{{toast.title}}</h6>
      <p>{{toast.body}}</p>
      <a class="close" (click)="remove.emit(i)">&times;</a>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      right: 0;
      width: 300px;
      height: 80px;
      padding: .75rem 1.25rem;
      margin-top: 1rem;
      border: 1px solid transparent;
      border-radius: .25rem;
      animation: move 2s both;
    }

    .toast-success {
      color: #fff;
      background-color: #51A351;
      border-color: #51A351;
    }

    .toast-error {
      color: #FFF;
      background-color: #BD362F;
      border-color: #BD362F;
    }

    .toast-warning {
      color: #856404;
      background-color: #fff3cd;
      border-color: #ffeeba;
    }

    .close {
      position: absolute;
      top: 7px;
      right: 10px;
      font-size: 1.5em;
      cursor: pointer;
      color:#fff;
      opacity:1;
    }

    .toast-heading {
      margin-top: 10px;
    }

    @keyframes move {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
  `]
})
export class ToasterComponent {
  @Input() toast: Toast;
  @Input() i: number;
  @Output() remove = new EventEmitter<number>();
  extraBottom = 0;

  constructor() {
  }
  setExtarBottom(body) {
    if (body.length > 90) {
      return 10
    }
    else if (body.length > 45) {
      return 10
    }
  }
}