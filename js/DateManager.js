class DateManager {
  constructor() {
    this._monthArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  }

  _isInputAMonth(input) {
    if (input) {
      return (this._monthArray.indexOf(input.toLowerCase()) >= 0 && this._monthArray.indexOf(input) <= 11) ? true : false;
    } else {
      return null;
    }
  }

  _getMonthNumber(input) {
    return input ? (this._monthArray.indexOf(input.toLowerCase()) + 1) : null;
  }
}