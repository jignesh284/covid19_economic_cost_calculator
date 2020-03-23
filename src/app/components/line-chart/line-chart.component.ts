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
    console.log("ID ::" +id );
    // .colors {
    //   color: #ffcc00; /* cases */
    //   color: #5cb85c; /* hos */
    //   color: #5eafef; /* icu */
    //   color: #ff5252; /* death */
    // }
    let datasets= [];
    let colors = ["#ffcc00","#5cb85c","#5eafef", "#5cb85c", "#5eafef" ] 
    let label = ["Distribution of Cases", "Distribution of hospitalizations", "Distribution of ICU admissions", "Base for hospitalizations", "Base for ICU admissions" ];
    for(let i=0; i<5; i++) {
      let key="line"+(i+1);
      let data;
      if(i<3) {
        data = { 
          data: this.chartData[key],
          label: label[i],
          borderColor: colors[i],
          fill: false,
          showLine: true,
          pointRadius: 1,
          pointHoverRadius: 2,
        }
      } else {
        data = { 
          data: this.chartData[key],
          label: label[i],
          borderColor: colors[i],
          fill: false,
          borderStyle:'dash',
          showLine: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth : 2,
          borderDash : [10,10],
        }
      }
      datasets.push( data)
    }

    

    

    return new Chart(id, {
      type: 'line',
      data: {
        labels: this.chartData['label'],
        datasets: datasets
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
              labelString: 'No. of cases, hospitalizations, ICU admissions',
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
