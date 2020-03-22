import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { IntractionService } from '../../services/intraction.service';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})

export class SliderComponent implements OnInit {
  @Input() sliderName: string;
  @Input() tickInterval:number;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() inputValue: number;

  constructor( private elem: ElementRef, private intraction: IntractionService) {
    this.inputValue = 0;
    this.sliderName = "";
   }

  ngOnInit(): void {
    this.inputValue = this.min;
  }

  ngAfterViewInit(): void {
    this.onInputChange({value: this.min});
  }

  formatLabel(value: number) {
    if (value >= 1000 && value < 100000) {
      return Math.round(value / 1000) + 'k';
    } else if( value > 100000) {
      return (Math.round(value / 100000)/10) + 'M';
    }
    return value;
  }

  onInputChange(event: any) {
    this.inputValue = event.value;
    this.update(this.inputValue);
  }

  update(value) {
    switch(this.elem.nativeElement.id) {
      case "cases":
        this.intraction.updateNoCases(value);
        break;
      case "normalDist":
        this.intraction.updateDays(value);
        break;
    }
  }

  textChanged(event) {
    this.inputValue = event.target.value;
    this.update(this.inputValue);
  }
}
