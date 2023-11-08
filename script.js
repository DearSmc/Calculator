let History = [];
let equation = [];
let input = "";
let displayInput = "";
let displayEquation = "";
const SIGN = ["+", "-", "*", "/"];

$(document).ready(function () {

  $("button").click(function () {
    var val = $(this).val();
    if (isNumeric(val) || val === "." || val === "*-1") {
      if (val === "*-1") {
        let temp = input || equation[0] || "0";

        if (input !== "") {
          input = (Number(input) * -1).toString();
        }
        else if(equation[0] !== undefined)
        {        
          if(isNumeric(equation[equation.length - 1])){// end with equals;
            input = (Number(equation[0]) * -1).toString();
            equation = [];
          }
          else { // end with sign
            input = equation[0];
          }
        }
        else input ="0"
        
        displayEquation = equation.join(" ")+" negative(" + temp +")"
        
      } else if (val === ".") {
        input = input + val;
      } else input = Number(input + val).toString();

      displayInput = input;
    } else if (["%", "^2", "1/", "sqrt"].includes(val)) {
      if (input === "") {
        // case 4 after del c ce
        if (equation.some((char) => SIGN.includes(char))) {
          if (isNumeric(equation[equation.length - 1])) {
            //case 1 after equals;
            input = equation[0];
            equation = [];
          } else {
            // case 2 end with sign;
            input = equation[0];
          }
        } // case 3 first time;
        else input = "0";
      }

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

      displayEquation = equation.join(" ") + " " + input;

      input = math.evaluate(input).toString();

      // equation.push(input);
      // input = "";
      displayInput = Number(input);
    } else if (SIGN.includes(val)) {
      console.log("equation",equation,"input",input);
      // incase a+b+c+d...
      if (equation.some((char) => SIGN.includes(char))) {
          if (input !== "") {
          equation.push(input);
          addHistory();
          let result = math.evaluate(equation.join("")).toString();
          equation = [result];
        } else {
          console.log("in");
          while (equation.some((char) => SIGN.includes(char))) {
            equation.pop();
          }
        }
      } else {
        input.length !== 0 ? equation.push(input) : equation.push(0);
      }

      input = "";
      equation.push(val);

      displayEquation = equation.join(" ");
    } else if (val === "del" || val === "c" || val === "ce") {
      switch (val) {
        case "del":
          console.log(equation,input);
          if(isNumeric(equation[equation.length-1]))
          {
            input = equation[0];
            equation = [];
            displayEquation = "";
          }
          else if (input.length > 1) input = input.slice(0, input.length - 1);
          else if (SIGN.includes(equation[equation.length-1]) && input === "") break;
          else input = "0";
          displayInput = Number(input).toString() || "0";
          break;
        case "ce":
          if(!isNumeric(equation[equation.length-1]))
          {
            input = "";
            displayInput = "0";
            break;
          }
        case "c":
          input = "";
          equation = [];

          displayEquation = "";
          displayInput = "0";
          break;
      }
    } else if (val === "=") {
    //  console.log("equation",equation);

      if (input !== "") equation.push(input);
      addHistory();
      let result = math.evaluate(equation.join("")).toString();

      displayInput = result;
      displayEquation = equation.join(" ") + " =";

      equation[0] = result;
      input = "";
    }

    refreshDisplay(displayEquation,displayInput);

  });

});

function refreshDisplay(equation,input) {
  document.getElementById("equation").innerHTML = equation;
  document.getElementById("displayVal").innerHTML = input;
}
// call before calculate!!
function addHistory() {

  let result = math.evaluate(equation.join("")).toString();
  let temp = equation.concat([result]);
  History.push(temp);

  let spanEquationEl = document.createElement("span");
  spanEquationEl.classList.add("historyEquation");
  spanEquationEl.innerHTML = equation.join(" ")+" =";

  let spanResultEl = document.createElement("span");
  spanResultEl.classList.add("historyResult");
  spanResultEl.innerHTML = result;

  let li =  document.createElement("li");
  li.id = `Card-${History.length}`;
  li.classList.add("card");
  li.appendChild(spanEquationEl);
  li.appendChild(spanResultEl);

  li.addEventListener('click',function() {
    const id = this.id;
    let num = Number(id.slice(id.indexOf("-")+1))-1;
   
    equation = History[num];
    input = equation.pop();
    displayEquation = equation.join(" ");
    displayInput = input;
    refreshDisplay(displayEquation,displayInput);
    
    equation[0] = input;
    input = "";
  })

  const parentElement = document.getElementById("historyList");
  const firstChild = parentElement.firstChild; // Get the current first child
  parentElement.insertBefore(li, firstChild)
  
}

function isNumeric(str) {
  return !isNaN(Number(str));
}
