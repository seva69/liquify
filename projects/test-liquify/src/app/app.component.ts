import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import Stats from 'stats.js';
import { TestFunctionSources } from 'projects/test-liquify/test-function-sources';
import { DefaultFunctionSources } from 'projects/liquify/src/lib/defaults/function.sources.default';
import { FunctionOverrideInterface } from 'projects/liquify/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test-liquify';
  fakeURL = ['ws://localhost:9875/'];
  width = 600;
  height = 300;
  avgFps = [0];
  count = [0];
  avgTenSec = 0;
  n = 1;
  rows = 1;
  cols = 1;
  latency = [];
  testFunctionSources: FunctionOverrideInterface = new DefaultFunctionSources();
  useWorker = true;
  dataSetIDs = ['0'];
  chartType = 'line';
  xAxisType = 'time';
  yAxisType = 'linear';

  @ViewChild('containerDiv') containerDiv;
  @ViewChild('rows') rowsInput;
  @ViewChild('cols') colsInput;
  @ViewChild('number') nInput;
  constructor(private changeDetRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.updateSize();
    let stats: Stats;
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    const beginTime = performance.now();
    const count = this.count;
    console.log(stats);
    const fps = this.avgFps;
    function animate() {
      count[0]++;
      fps[0] = count[0] / (performance.now() - beginTime) * 1000 ;
      stats.begin();
      // monitored code goes here
      stats.end();
      requestAnimationFrame( animate );
    }
    requestAnimationFrame( animate );
  }

  measureTenSec() {
    const beginTime = performance.now();
    const beginCount = this.count[0];
    console.log('measure began');
    setTimeout(() => {
      console.log('this.avgTenSec');
      this.avgTenSec = (this.count[0] - beginCount) / (performance.now() - beginTime) * 1000 ;
      console.log(this.avgTenSec);
    }, 10000);
  }

  addChart() {
    this.n++;
  }

  latencyHandler(latency, index) {
    this.latency[index] = Math.round(latency / 1000);
    this.changeDetRef.detectChanges();
  }

  updateSize() {
    this.width = window.innerWidth / this.cols - 20;
    this.height = window.innerHeight / this.rows - 20;
  }

  applyLayout() {
    this.n = this.nInput.nativeElement.value;
    this.rows = this.rowsInput.nativeElement.value;
    this.cols = this.colsInput.nativeElement.value;
    this.updateSize();
  }

  switchWorker() {
    this.useWorker = !this.useWorker;
  }

  changeChartType() {
    if (this.chartType === 'line') {
      this.chartType = 'bar';
    } else if (this.chartType === 'bar') {
      this.chartType = 'bubble';
    } else {
      this.chartType = 'line';
    }
  }

  changeXAxisType() {
    if (this.xAxisType === 'time') {
      this.xAxisType = 'linear';
    } else if (this.xAxisType === 'linear') {
      this.xAxisType = 'logarithmic';
    } else {
      this.xAxisType = 'time';
    }
  }

  changeYAxisType() {
    if (this.yAxisType === 'linear') {
      this.yAxisType = 'logarithmic';
    } else {
      this.yAxisType = 'linear';
    }
  }

  changeFunctionSource(){
    if (this.testFunctionSources instanceof DefaultFunctionSources) {
      this.testFunctionSources = new TestFunctionSources();
      this.dataSetIDs = this.fakeURL;
    } else {
      this.testFunctionSources = new DefaultFunctionSources();
      this.dataSetIDs = ['0'];
    }
  }
}
