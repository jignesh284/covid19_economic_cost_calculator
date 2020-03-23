import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class IntractionService {
  modelsData = {
    'US_CDC' :{
      cases: [ 5, 28.8, 17.5, 17.5, 16.7, 8.6, 5.9 ],
      hospitalizations: [ 0.4, 18.3, 15.1, 16.1, 22.2, 15.4, 12.6 ],
      icus: [ 0, 4.2, 10.4, 11.2, 18.8, 31, 29 ],
      deaths: [ 0, 0.2, 0.8, 2.6, 4.9, 10.5, 27.3 ],
    }, 
    'KOREA_CDC':{
      cases: [ 5, 28.8, 17.5, 17.5, 16.7, 8.6, 5.9 ],
      hospitalizations: [ 0.4, 18.3, 15.1, 16.1, 22.2, 15.4, 12.6 ],
      icus: [ 0, 4.2, 10.4, 11.2, 18.8, 31, 29 ],
      deaths: [ 0, 0.2, 0.8, 2.6, 4.9, 10.5, 27.3 ],
    },
    'CUSTOM': {
      cases: [ 1, 2, 3, 4, 5, 6, 7 ],
      hospitalizations: [ 10, 20, 20, 25, 6, 14, 5 ],
      icus: [ 10, 20, 20, 25, 6, 14, 5 ],
      deaths: [ 10, 20, 20, 25, 6, 14, 5 ],
    },
  };

  private chartData = new BehaviorSubject<Object>({
    cases_data: [ 5, 29, 18, 18, 17, 7, 6 ],
    hospitalizations_data: [ 0, 18, 15, 16, 22, 15, 13 ], 
    icus_data: [ 0, 4, 10, 11, 19, 31, 29 ],
    deaths_data: [ 0, 0, 1, 3, 5, 10, 27 ]
  });

  private model = new BehaviorSubject<string>("US_CDC");
   
  private normalData = new BehaviorSubject<Object>({
    label: [],
    line1: [],
    line2: [],
    line3: [],
    line4: [],
    line5: [],
  })

  private tableData = new BehaviorSubject<Array<Object>>([
    {"category": "Numbers of cases", 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, "total": 0},
    {"category": "Numbers of hospitalizations", 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, "total": 0},
    {"category": "Numbers of ICU admissions", 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, "total": 0},
    {"category": "Numbers of fatality", 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, "total": 0},
    {"category": "Total", 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, "total": 0},
  ])

  private noCases = new BehaviorSubject<number>(100);
  private noDays = new BehaviorSubject<number>(10);
  // getNoCases = this.noCases.asObservable();  
  getChartData = this.chartData.asObservable();
  getNormalData = this.normalData.asObservable();
  getTableData = this.tableData.asObservable();
  private noICU: number; 
  private noHos: number; 

  constructor() { }

  updateNoCases(noCases: number) {
    this.noCases.next(noCases);
    this.updateChartData(noCases, this.model.getValue());
    this.updateTableData(this.chartData.getValue());
    this.updateNormalDistribution( noCases, this.noDays.getValue(), this.noICU, this.noHos );
  }

  updateDays(noDays: number) {
    this.noDays.next(noDays);
    this.updateNormalDistribution( this.noCases.getValue(), noDays, this.noICU, this.noHos );
  }

  updateChartData(noCases: number, model: string){
    let cases: Array<number> = this.modelsData[model]['cases'];
    let hospitalizations: Array<number> = this.modelsData[model]['hospitalizations'];
    let icus: Array<number> = this.modelsData[model]['icus'] ;
    let deaths: Array<number> = this.modelsData[model]['deaths'];

    let cases_data: Array<number> = []; 
    let hospitalizations_data: Array<number> = []; 
    let icus_data: Array<number> = []; 
    let deaths_data: Array<number> = []; 
    this.noICU = 0;
    this.noHos = 0;
    for(let i=0; i< cases.length; i++) {
      let val:number = Math.round( cases[i]* noCases / 100 );
      let hos:number = Math.round( val* hospitalizations[i] / 100 );
      let icu:number = Math.round( val* icus[i] / 100 );
      let dth:number = Math.round( val* deaths[i] / 100 );
      
      this.noHos += hos;
      this.noICU += icu;
      cases_data.push( val );
      hospitalizations_data.push(hos);
      icus_data.push(icu);
      deaths_data.push(dth);
      this.chartData.next({cases_data, hospitalizations_data, icus_data, deaths_data} );
    }
  }

  updateNormalDistribution( noCases: number, noDays: number, noICU: number, noHos: number) {
    // alert(` noCases: ${noCases}, noDays: ${noDays} `)
    const pi = 3.14;
    let mean = noDays;
    let sd = noDays/3;
    let caseAmp = noCases/( sd * Math.sqrt(2*Math.PI) );
    let hosAmp = noHos/( sd * Math.sqrt(2*Math.PI) );
    let icuAmp = noICU/( sd * Math.sqrt(2*Math.PI) );

    let line1 = [];
    let line2 = [];
    let line3 = [];
    let line4 = [];
    let line5 = [];
    let label = [];

    var nbiter=500;
    for(var i=0;i<=nbiter;i++)
    {
      label[i]= i*1;
      line1[i]= this.gaussFunction(label[i], caseAmp, sd, mean);
      line2[i]= this.gaussFunction(label[i], hosAmp , sd, mean );
      line3[i]= this.gaussFunction(label[i], icuAmp , sd, mean );
      line4[i]= 10000;
      line5[i]= 1000;
    }  
    this.normalData.next({ label , line1, line2, line3, line4, line5 });
  }

  updateModel(model: string) {
    this.model.next(model);
    this.updateChartData(this.noCases.getValue(), model);
    this.updateTableData(this.chartData.getValue());
    this.updateNormalDistribution(this.noCases.getValue(), this.noDays.getValue(), this.noICU, this.noHos);
  }

  updateTableData(chartData) {
    let data = this.tableData.getValue();
    let rates = [100, 1000, 30000, 1000000 ]
    let key = ["cases_data", "hospitalizations_data", "icus_data", "deaths_data" ];
    for(let i=0; i<7; i++) {
      data[4][i] = 0;
    }
    for(let i=0; i<4; i++) {
      let totalCol = 0;

      for(let j=0; j<7; j++) {
          let value = chartData[key[i]][j]*rates[i];
          totalCol += value;
          data[i][j] = this.formatNumbers(value);
          data[4][j] += value;
      }
      data[i]["total"] = this.formatNumbers(totalCol);
    }

    let total = 0;
    for(let i=0; i<7; i++) {
        total += data[4][i];
        data[4][i] = this.formatNumbers(data[4][i]);
    }
    data[4]["total"] = this.formatNumbers(total); 
    
    this.tableData.next(data);
  }
  
  // EXTRA FUNCTIONS
  gaussFunction(x, amplitude, sd, mean) {
    return amplitude * Math.exp(-0.5 * ( Math.pow( (x- mean)/sd, 2 ) ));
  }

  formatNumbers(x) {
    let val ="";
    
      if( x>=1000000000){
        x = Math.round(x /1000000000);
        return this.getCommas(x)+ "B"
      } 
      if(x>=1000000){
        x = Math.round(x /1000000);
        return this.getCommas(x)+ "M"
      }
      return this.getCommas(x);
  }

  getCommas(x){
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
  }
}
