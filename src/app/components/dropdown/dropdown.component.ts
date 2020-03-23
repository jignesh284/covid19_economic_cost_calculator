import { Component, OnInit } from '@angular/core';
import { IntractionService } from '../../services/intraction.service'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  options: Array<Object> = [
    {value: 'US_CDC', viewValue: 'US CDC'},
    {value: 'KOREA_CDC', viewValue: 'Korea CDC'},
    {value: 'CUSTOM', viewValue: 'Create custom numbers'},
  ];
  selected: string;

  constructor( private intraction: IntractionService) {
   
  }

  ngOnInit(): void {
    this.selected = 'US_CDC';
  }
  
  valueChanged() {
    this.intraction.updateModel(this.selected);
  }

}
