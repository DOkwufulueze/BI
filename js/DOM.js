class DOM {
  constructor(referencingObject) {
    this._referencingObject = referencingObject;
  }

  _create(className, html, tagName) {
    return $(`<${tagName} />`, {
      'class': className,
      'html': html,
    });
  }

  _returnPageLook() {
    const $tableDiv = this._create('table', '', 'div');
    $tableDiv.attr({'id': 'table',});
    const $chartDiv = this._create('chart', '', 'div');
    $chartDiv.attr({'id': 'chart',});
    const $top = this._create('top', '', 'div');
    const $bottom = this._create('bottom', '', 'div');
    const $wrapper = this._create('wrapper', '', 'div');
    const $optionDropDown = this._create('dropdown', '', 'select');
    const $whereOption = this._create('', 'WHERE', 'option');
    $whereOption.attr('value', 'WHERE');
    const $groupByOption = this._create('', 'GROUP BY', 'option');
    $groupByOption.attr('value', 'GROUP BY');
    const $whereAndGroupByOption = this._create('', 'WHERE and GROUP BY', 'option');
    $whereAndGroupByOption.attr('value', 'WHERE and GROUP BY');
    const $empty = this._create('', 'Select Query Option', 'option');
    $empty.attr('value', '');
    const $fieldsDiv = this._create('fieldsDiv', '', 'div');
    const $xFieldsDiv = this._create('xFieldsDiv', '', 'div');
    const $yFieldsDiv = this._create('yFieldsDiv', '', 'div');;
    const $fieldsDivDescription = this._create('fieldsDivDescription', '', 'div');
    const $xFieldsDivDescription = this._create('xFieldsDivDescription', 'X-Axis Field', 'div');
    const $yFieldsDivDescription = this._create('yFieldsDivDescription', 'Y-Axis Field', 'div');
    const $variablesButton = this._create('variablesButton', 'Use Selected Variables', 'button');
    $variablesButton.data({'methodName': '_useAppropriateOption', 'parameters': ['']})
    $wrapper
      .append(
        $top
          .append($tableDiv)
          .append($chartDiv)
      )
      .append(
        $bottom
          .append(
            $optionDropDown
              .append($empty)
              .append($groupByOption)
              .append($whereOption)
              .append($whereAndGroupByOption)
          )
          .append(
            $fieldsDivDescription
              .append($xFieldsDivDescription)
              .append($yFieldsDivDescription)
          )
          .append(
            $fieldsDiv
              .append($xFieldsDiv)
              .append($yFieldsDiv)
          )
      )
      .append($variablesButton);

    this._setUpDropdownEventListener($optionDropDown);
    return $wrapper;
  }

  _setUpDropdownEventListener(optionDropDown) {
    optionDropDown.on('change', () => {
      this._referencingObject._useAppropriateOption(optionDropDown.val());
    });
  }
}