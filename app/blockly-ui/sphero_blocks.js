

  //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#92mhew

Blockly.Blocks['sphero_turn'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("turn")
        .appendField(new Blockly.FieldDropdown([["right", "right"], ["left", "left"]]), "direction");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['sphero_turn'] = function(block) {
  var direction = block.getFieldValue('direction');
  // TODO: Assemble JavaScript into code variable.
  var code = 'ball.turn(\'' + direction + '\'); \n';
  return code;
};


//https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8kpubs

Blockly.Blocks['sphero_roll'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("roll");
    this.appendValueInput("steps")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("steps")
        .appendField(new Blockly.FieldDropdown([["forward", "forward"], ["backward", "backward"], ["", ""]]), "direction");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['sphero_roll'] = function(block) {
  var steps = Blockly.JavaScript.valueToCode(
      block, 'steps', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var direction = block.getFieldValue('direction');
  // TODO: Assemble JavaScript into code variable.
  var code = 'ball.roll(' + steps + ', \'' + direction + '\'); \n';
  return code;
};

//https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4dmg2h

Blockly.Blocks['sphero_set_color'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("set color");
    this.appendValueInput("color");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['sphero_set_color'] = function(block) {
  var angle_color = block.getFieldValue('color');
  var color = Blockly.JavaScript.valueToCode(
      block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'color = ' + color + ';\n' +
      'ball.setColor(color);\n';
  return code;
};

Blockly.Blocks['sphero_color_variable'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("color");
    this.setOutput(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['sphero_color_variable'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'color';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};



