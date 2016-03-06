// Blockly.JavaScript['controls_whileUntil'] = function(block) {

//     var until = block.getFieldValue('MODE') == 'UNTIL';
//     var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
//         until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
//         Blockly.JavaScript.ORDER_NONE) || 'false';
//     var branch = Blockly.JavaScript.statementToCode(block, 'DO');
//     branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
//     if (until) {
//         argument0 = '!' + argument0;
//     }
//     var cod = "setTimeout(function(){if (" + argument0 + ") {\n" + branch + "\nsetTimeout(arguments.callee,0)\n}\n},0);";
//     return cod;
// }

Blockly.JavaScript['math_arithmetic'] = function(block) {
    // Basic arithmetic operators, and power.
    var OPERATORS = {
        'ADD': ['plus', Blockly.JavaScript.ORDER_ADDITION],
        'MINUS': ['minus', Blockly.JavaScript.ORDER_SUBTRACTION],
        'MULTIPLY': ['times', Blockly.JavaScript.ORDER_MULTIPLICATION],
        'DIVIDE': ['quotient', Blockly.JavaScript.ORDER_DIVISION],
        'POWER': ['power', Blockly.JavaScript.ORDER_COMMA] // Handle power separately.
    };
    var tuple = OPERATORS[block.getFieldValue('OP')];
    var operator = tuple[0];
    var order = tuple[1];
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';

    var code = operator + "(" + argument0 + "," + argument1 + ")";
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['variables_get'] = function(block) {
    // Variable getter.
    var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    code = "GET('blockly_var_" + code + "')";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['variables_set'] = function(block) {
    // Variable setter.
    var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'SET("blockly_var_' + varName + '",' + argument0 + ');\n';
    // return varName + ' = ' + argument0 + ';\n';
};

// Incrémentation :
Blockly.JavaScript['math_change'] = function(block) {
    // Add to a variable in place.
    var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
        Blockly.JavaScript.ORDER_ADDITION) || '0';
    var varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'INC("blockly_var_' + varName + '",' + argument0 + ');\n';
};

Blockly.JavaScript['controls_for'] = function(block) {
    var variable0 = "blockly_var_" + Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var increment = Blockly.JavaScript.valueToCode(block, 'BY',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
    var code = 'SET("' + variable0 + '",' + argument0 + ');\n'
    code += 'while(GET("' + variable0 + '")<=' + argument1 + '){\n';
    code += branch;
    code += 'INC("' + variable0 + '",' + increment + ');\n'
    code += '};\n';
    return code;
};


Blockly.JavaScript['controls_repeat_ext'] = function(block) {
    // Repeat n times.
    if (block.getField('TIMES')) {
        // Internal number.
        var repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
        // External number.
        var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
            Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    }
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
    var loopVar = 'blockly_var_' + Blockly.JavaScript.variableDB_.getDistinctName(
        'count', Blockly.Variables.NAME_TYPE);

    var code = 'SET("' + loopVar + '",1);\n'
    code += 'while(GET("' + loopVar + '")<=' + repeats + '){\n';
    code += branch;
    code += 'INC("' + loopVar + '",1);\n'
    code += '};\n';
    return code;
};