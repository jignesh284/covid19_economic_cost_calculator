import {Component, OnInit, Input} from '@angular/core';
import { IntractionService } from '../../services/intraction.service'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() title: string;
  displayedColumns: string[] = ["category", "0", "1", "2", "3", "4", "5", "6", "total"];
  dataSource: Array<Object>;

  constructor(private intraction: IntractionService) {
    this.title="";
  }

  ngOnInit(): void {
    this.intraction.getTableData.subscribe(data => {
      this.dataSource = data;
    });
  }

}
