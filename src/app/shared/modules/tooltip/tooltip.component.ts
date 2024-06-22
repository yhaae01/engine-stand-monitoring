import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  animations: [
    trigger('showHide', [
      state(
        'show',
        style({
          opacity: 1,
          scale: 1,
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
          scale: 0,
        })
      ),
      transition('show => hide', [animate('0.1s')]),
      transition('hide => show', [animate('0.1s')]),
    ]),
  ],
})
export class TooltipComponent implements OnInit {

  tooltip: string = '';
  isTooltipShow: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
