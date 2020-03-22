import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'node_modules/chart.js'; 
import { IntractionService } from '../../services/intraction.service'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() chartId: string;
  @Input() chartWidth: string;
  @Input() chartHeight: string;

  chart: any;
  chartData: Object;
  constructor(private intraction: IntractionService  ) { 
    this.chartId = Math.round(10000* Math.random()).toString();
    this.chartWidth = "700";
    this.chartHeight = "400";
  }

  ngOnInit(): void {
    this.intraction.getNormalData.subscribe(data => {
      this.chartData = data;
      if(this.chart) this.chart.destroy();
      this.chart = this.renderChart( this.chartId, this.chartData, "Name of the chart")
    })
  }

  ngAfterViewInit(): void {
    if(this.chart) this.chart.destroy();
    this.chart = this.renderChart( this.chartId, this.chartData, "Name of the chart")
  }

  renderChart(id: string, chartData: Object, title: String): void{
    console.log("ID ::" +id )
    return new Chart(id, {
      type: 'line',
      data: {
        labels: this.chartData['label'],
       datasets: [{ 
          data: this.chartData['line1'],
          label: "Distribution",
          borderColor: "#ffcc00",
          fill: false
        }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Distribution of cases'
        },
        legend: { 
          display: true,
          labels:{
            fontSize: 15,
            fontStyle: 'bold',
            padding: 10 
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of Days',
              fontSize: 15,
              fontStyle: 'bold',
              padding: 20
            },
            ticks: {
              beginAtZero: false,
              stepSize: 20,
              // stepSize: 50,
              // max: 500,
              // min: 0,
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of cases',
              fontSize: 15,
              fontStyle: 'bold',
              padding: 20
            },
            ticks: {
              
              // max: 500000,
              // min: 0
            }
          }]
        }     
      }
  });
  }

}
