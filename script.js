$(document).ready(function () {
  let History = [];
  let equation = {
    a: null,
    sign: null,
  };
  let input = "";
  let displayInput = "";
  let displayEquation = "";
  let didSolved = true;

  $("button").click(function () {
    var val = $(this).val();
    if (isNumeric(val) || val === "." || val === "*-1") {
      input = val === "*-1" ? (Number(input) * -1).toString() : input + val;
      displayInput = input;
    } else if (val === "%" || val === "^2" || val === "1/" || val === "sqrt") {
      switch (val) {
        case "%":
        case "^2":
          input += val;
          break;
        case "1/":
          input = val + input;
          break;
        case "sqrt":
          input = val + "(" + input + ")";
          break;
      }

      displayEquation = equation.a ? equation.a + equation.sign + input : input;

      input = math.evaluate(input);
      equation.a = equation.a || input;

      displayInput = equation.a;
    } else if (val === "+" || val === "*" || val === "/" || val === "-") {
      // ["+","-","*","/"].include(val)
      if (!didSolved) {
        let temp = equation.a + equation.sign + input;
        let result = math.evaluate(temp).toString();

        equation.a = result;

        displayEquation = result + val;
        didSolved = true;
      }
      equation.a = input || 0;
      equation.sign = val;
      input = "";


      displayEquation = equation.a + equation.sign;
    } else if (val === "del" || val === "c" || val === "ce") {
      switch (val) {
        case "del":
          if (input.length > 1) input.slice(-1);
          else input = "";
          displayInput = input || "0";
          break;
        case "c":
          input = "";
          equation.a = null;
          equation.sign = null;

          displayEquation = "";
          displayInput = "0";
          break;
        case "ce":
          input = "";
          displayInput = "0";
          break;
      }
    } else if (val === "=") {
      let temp = equation.a + equation.sign + input;
      let result = math.evaluate(temp).toString();

      equation.a = result;
      didSolved = true;

      displayInput = result;
      displayEquation = temp + "=";
    }

    document.getElementById("equation").innerHTML = displayEquation;
    document.getElementById("displayVal").innerHTML = displayInput;
  });
});

function isNumeric(str) {
  return !isNaN(Number(str));
}

function solve() {
  let temp = equation.a + equation.sign + input;
  let result = math.evaluate(temp).toString();

  equation.a = result;

  displayInput = result;
  displayEquation = temp + "=";
}
