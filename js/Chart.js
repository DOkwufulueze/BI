class Chart {
  constructor(referencingObject) {
    this._referencingObject = referencingObject;
    this._DateManager = new DateManager();
    this._xAxis = '';
    this._yAxis = '';
    this._valueline = '';
    this._svg = '';
    this._xField = null;
    this._yField = null;
    this._data = null;
  }

  _setUpChartSpace() {
    this._xField = this._referencingObject._xField;
    this._yField = this._referencingObject._yField;
    this._data = this._referencingObject._data;
    const margin = {top: 30, right: 20, bottom: 30, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 470 - margin.top - margin.bottom;
    const x = d3.scale.linear().range([0, width]);
    const y = d3.scale.linear().range([height, 0]);
    this._useChartVariables(x, y, width, height, margin);
  }

  _useChartVariables(x, y, width, height, margin) {
    this._makeXAxis(x);
    this._makeYAxis(y);
    this._makeValueLine(x, y);
    this._makeSVG(width, height, margin);
    this._getData(x, y, width, height, margin);
  }

  _makeXAxis(x) {
    this._xAxis = d3
      .svg
      .axis()
      .scale(x)
      .orient("bottom")
      .ticks(5);
    }

  _makeYAxis(y) {
    this._yAxis = d3
      .svg
      .axis()
      .scale(y)
      .orient("left")
      .ticks(5);
  }

  _makeValueLine(x, y) {
    this._valueline = d3
      .svg.line()
      .x((d) => { 
        return x(this._DateManager._isInputAMonth(d[this._xField]) ? this._DateManager._getMonthNumber(d[this._xField]) : d[this._xField]); 
      })
      .y((d) => {
        return y(this._DateManager._isInputAMonth(d[this._yField]) ? this._DateManager._getMonthNumber(d[this._yField]) : d[this._yField]);
      });
  }

  _makeSVG(width, height, margin) {
    this._svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr({"transform": "translate(" + margin.left + "," + margin.top + ")",});
  }

  _getData(x, y, width, height, margin) {
    this._titleTheSVG(width, margin);

    // Scale the range of the data
    x.domain([0, d3.max(this._data, (d) => {
      return this._DateManager._isInputAMonth(d[this._xField]) ? this._DateManager._getMonthNumber(d[this._xField]) : d[this._xField];
    })]);
    y.domain([
      d3.min(this._data, (d) => {
        return this._DateManager._isInputAMonth(d[this._yField]) ? this._DateManager._getMonthNumber(d[this._yField]) : d[this._yField];
      }), d3.max(this._data, (d) => {
        return this._DateManager._isInputAMonth(d[this._yField]) ? this._DateManager._getMonthNumber(d[this._yField]) : d[this._yField];
      })
    ]);
    this._plotChart(height);
  }

  _plotChart(height) {
    this._svg.append("path")
    .attr("class", "line")
    .attr("d", this._valueline(this._data));
    this._svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(this._xAxis);
    this._svg.append("g")
    .attr("class", "y axis")
    .call(this._yAxis);
  }

  _titleTheSVG(width, margin) {
    this._svg.append("text")
    .attr({
      "x": (width / 2),
      "y": 0 - (margin.top / 2),
      "text-anchor": "middle",
    })
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text(`${this._yField} vs ${this._xField}`);
  }
}