'use strict'

class BI {
  constructor(body, fileName) {
    this._DOM = new DOM(this);
    this._Chart = new Chart(this);
    this._$body = body;
    this._fileName = fileName;
    this._xField = 'COST';
    this._yField = 'RETURNS';
    this._xFieldArray = [];
    this._yFieldArray = [];
    this._data = {};
    this._$xFieldsDiv = null;
    this._$yFieldsDiv = null;
    this._cache = null;
    this._init();
  }

  _init() {
    this._appendDOM();
    this._addEventListener();
    this._fillTable('');
  }

  _appendDOM() {
    this._$body.append(this._DOM._returnPageLook());
  }

  _addEventListener() {
    this._$body.on('click', (eventObject) => {
      const $target = $(eventObject.target);
      if ($target.data('methodName')) {
        const methodName = this[$target.data('methodName')];
        const parameters = $target.data('parameters') ? $target.data('parameters') : null;
        if(typeof methodName === 'function') {
          parameters ? methodName.apply(this, parameters) : methodName.apply(this);
        }
      }
    });
  }

  _useAppropriateOption(value) {
    if (value) {
      //Todo: send option to Rails server but do the below for now
      this._useValue(value);
    } else {
      $('div#table').html('');
      $('div#chart').html('');
      this._xField = this._$xFieldsDiv.find('input[name="xRadio"]:checked').length ? this._$xFieldsDiv.find('input[name="xRadio"]:checked').next('label').text() : 'COST';
      this._yField = this._$yFieldsDiv.find('input[name="yRadio"]:checked').length ? this._$yFieldsDiv.find('input[name="yRadio"]:checked').next('label').text() : 'RETURNS';
      this._fillTable('');
    }
  }

  _useValue(value) {
    $('div#table').html('');
    $('div#chart').html('');
    this._xField = this._$xFieldsDiv.find('input[name="xRadio"]:checked').length ? this._$xFieldsDiv.find('input[name="xRadio"]:checked').next('label').text() : 'COST';
    this._yField = this._$yFieldsDiv.find('input[name="yRadio"]:checked').length ? this._$yFieldsDiv.find('input[name="yRadio"]:checked').next('label').text() : 'RETURNS';
    this._fillTable('');
  }

  _fillTable(method) {
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: this._fileName,
      success: (returnedObject) => {
        this._data = returnedObject;
        if (method) {
          //Todo: use the method in the Rails app.
        } else {
          this._setRadioButtonsDiv();
          this._loopThroughReturnedObject(returnedObject);
          this._resetRadioButtons();
          this._Chart._setUpChartSpace();
          this._cache = true;
        }
      }
    });
  }

  _setRadioButtonsDiv() {
    this._$xFieldsDiv = $('div.xFieldsDiv').html('');
    this._$yFieldsDiv = $('div.yFieldsDiv').html('');
  }

  _resetRadioButtons() {
    this._$xFieldsDiv.find('input').attr({'type': 'radio', 'name': 'xRadio',});
    this._$yFieldsDiv.find('input').attr({'type': 'radio', 'name': 'yRadio',});
  }

  _loopThroughReturnedObject(returnedObject) {
    let i = 0;
    let header = 0;
    Object.keys(returnedObject).forEach((key) => {
      let className = (i % 2 === 0) ? 'row row-even' : 'row row-odd';
      const $row = this._DOM._create(className, '', 'div');

      //returnedObject is an object of arrays
      let keyObject = returnedObject[key];
      this._xFieldArray.push(keyObject[this._xField]);
      this._yFieldArray.push(keyObject[this._yField]);
      const rowSize = `${130 * Object.keys(keyObject).length}`;
      $row.css('width', rowSize);
      this._loopThroughInnerObject($row, header, keyObject);
      header = 1;
      i += 1;
      $('div#table').append($row);
    })
  }

  _loopThroughInnerObject($row, header, keyObject) {
    let $column = null;
    let j = 0;
    Object.keys(keyObject).forEach((item) => {
      if (header === 0) {
        $column = this._DOM._create('column bold', item, 'div');
        this._$xFieldsDiv.append(this._DOM._create('xRadio', '', 'input').attr('id', `xRadio${j}`)).append(this._DOM._create('label', item, 'label').attr('for', `xRadio${j}`)).append('<br />');                
        this._$yFieldsDiv.append(this._DOM._create('yRadio', '', 'input').attr('id', `yRadio${j}`)).append(this._DOM._create('label', item, 'label').attr('for', `yRadio${j}`)).append('<br />');
        j += 1;
      } else {
        $column = this._DOM._create('column normal', keyObject[item], 'div');
      }
       
      $row.append($column);
    })
  }
}

$(() => {
  const $body = $('body');
  const fileName = 'json/file.json';
  new BI($body, fileName);
});

