import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class IntractionService {
  private chartData = new BehaviorSubject<Object>({
    cases_data: [ 5, 29, 18, 18, 17, 7, 6 ],
    hospitalizations_data: [ 0, 18, 15, 16, 22, 15, 13 ], 
    icus_data: [ 0, 4, 10, 11, 19, 31, 29 ],
    deaths_data: [ 0, 0, 1, 3, 5, 10, 27 ]
  });
   
  private normalData = new BehaviorSubject<Object>({
    label: [],
    line1: [],
  })

  private noCases = new BehaviorSubject<number>(100);
  private noDays = new BehaviorSubject<number>(10);
  // getNoCases = this.noCases.asObservable();  
  getChartData = this.chartData.asObservable();
  getNormalData = this.normalData.asObservable();

  constructor() { }

  updateNoCases(noCases: number) {
    this.noCases.next(noCases);
    this.updateChartData(noCases);
    this.updateNormalDistribution( noCases, this.noDays.getValue() );
  }

  updateDays(noDays: number) {
    this.noDays.next(noDays);
    this.updateNormalDistribution( this.noCases.getValue(), noDays );
  }

  updateChartData(noCases: number){
    let cases: Array<number> = [ 5, 28.8, 17.5, 17.5, 16.7, 8.6, 5.9 ];
    let hospitalizations: Array<number> = [ 0.4, 18.3, 15.1, 16.1, 22.2, 15.4, 12.6 ];
    let icus: Array<number> = [ 0, 4.2, 10.4, 11.2, 18.8, 31, 29 ];
    let deaths: Array<number> = [ 0, 0.2, 0.8, 2.6, 4.9, 10.5, 27.3 ];

    let cases_data: Array<number> = []; 
    let hospitalizations_data: Array<number> = []; 
    let icus_data: Array<number> = []; 
    let deaths_data: Array<number> = []; 

    for(let i=0; i< cases.length; i++) {
      let val:number = Math.round( cases[i]* noCases / 100 );
      let hos:number = Math.round( val* hospitalizations[i] / 100 );
      let icu:number = Math.round( val* icus[i] / 100 );
      let dth:number = Math.round( val* deaths[i] / 100 );

      cases_data.push( val );
      hospitalizations_data.push(hos);
      icus_data.push(icu);
      deaths_data.push(dth);
      this.chartData.next({cases_data, hospitalizations_data, icus_data, deaths_data} );
    }
  }

  updateNormalDistribution( noCases: number, noDays: number) {
    // alert(` noCases: ${noCases}, noDays: ${noDays} `)
    const pi = 3.14;
    let mean = noDays;
    let sd = noDays/3;
    let amplitude = noCases/( sd * Math.sqrt(2*Math.PI) );

    let line1 = [];
    let label = [];

    var nbiter=500;
    for(var i=0;i<=nbiter;i++)
    {
      label[i]= i;
      line1[i]= amplitude * Math.exp(-0.5 * ( Math.pow( (label[i]- mean)/sd, 2 ) ));
    }  
    console.log({ label , line1 });
    this.normalData.next({ label , line1 });
  }

}
