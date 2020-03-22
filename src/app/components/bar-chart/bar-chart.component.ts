import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'node_modules/chart.js'; 
import { IntractionService } from '../../services/intraction.service'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() chartId: string;
  @Input() chartWidth: string;
  @Input() chartHeight: string;

  chart: any;
  chartData: Object;

  constructor(private intraction: IntractionService) { 
    this.chartId = Math.round(10000* Math.random()).toString();
    this.chartWidth = "700";
    this.chartHeight = "400";
  };

  ngOnInit(): void  {
    this.intraction.getChartData.subscribe(data => {
      this.chartData = data;
      if(this.chart) this.chart.destroy();
      this.chart = this.renderChart( this.chartId, this.chartData, "Name of the chart")
    })
  };

 
  ngAfterViewInit(): void {
    if(this.chart) this.chart.destroy();
    this.chart = this.renderChart( this.chartId, this.chartData, "Name of the chart")
  }

  renderChart(id: string, chartData: Object, title: String): void{
    return new Chart(id, {
      type: 'bar',
      data: {
        labels: ["0-19", "20-44", "45-54", "55-64", "65-74", "75-84", ">=85"],
        datasets: [
          {
            label: "No. of cases",
            backgroundColor: ["#ffcc00", "#ffcc00", "#ffcc00", "#ffcc00","#ffcc00", "#ffcc00", "#ffcc00"],
            data: chartData['cases_data']
          },
          {
            label: "Hospitalizations",
            backgroundColor: [ "#5cb85c", "#5cb85c", "#5cb85c", "#5cb85c", "#5cb85c", "#5cb85c","#5cb85c" ],
            data: chartData['hospitalizations_data']
          },
          {
            label: "ICU admissions",
            backgroundColor: ["#5eafef", "#5eafef", "#5eafef", "#5eafef", "#5eafef", "#5eafef", "#5eafef"],
            data: chartData['icus_data']
          },
          {
            label: "Case-fatality",
            backgroundColor: ["#ff5252", "#ff5252", "#ff5252", "#ff5252", "#ff5252", "#ff5252", "#ff5252"],
            data: chartData['deaths_data']
          }
        ]
      },
      options: {
        legend: { 
          display: true,
          labels:{
            fontSize: 15,
            fontStyle: 'bold',
            padding: 10 
          }
        },
        title: {
          display: true,
          text: title  //'Predicted world population (millions) in 2050'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Age group (yrs)',
              fontSize: 15,
              fontStyle: 'bold',
              padding: 20
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'No. of cases, hospitalizations, ICU admissions, case-fatality',
              fontSize: 15,
              fontStyle: 'bold',
              padding: 20
            }
          }]
        }     
      }
  });
  }



}


