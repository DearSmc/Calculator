const SIGN = ["+", "-", "*", "/"];
const TEMPATE_VARIABLE = {
    history : [],
    equation : [],
    input : "",
    displayInput : "",
    displayEquation : "",
}
let v = [{}];

$(document).ready(function () {

    const container = document.getElementById('main-container');
    
    container.addEventListener('click', (event) => {
    let eventObj = event.composedPath();
    const target = eventObj[0]; // Get the actual target of the event
    
    let instanceId = 0;
    for(let i=0; i< event.composedPath().length;i++)
    {
        if(eventObj[i].localName === "calculator-jquery")
        {
            instanceId = Number(eventObj[i].attributes['instance-id'].value);
            break;
        }
    }
                
    // console.log(eventObj,instanceId)
    
    if (target.tagName === 'BUTTON') {
        handleButtonClick(instanceId,target.value)
    }
    });
});

function handleButtonClick(insId,val){
    console.log(`instance ${insId} was clicked`); 
   
    if (isNumeric(val) || val === "." || val === "*-1") {
      if (val === "*-1") {
        let temp = v[insId].input || v[insId].equation[0] || "0";

        if (v[insId].input !== "") {
          v[insId].input = (Number(v[insId].input) * -1).toString();
        }
        else if(v[insId].equation[0] !== undefined)
        {        
          if(isNumeric(v[insId].equation[v[insId].equation.length - 1])){// end with equals;
            v[insId].input = (Number(v[insId].equation[0]) * -1).toString();
            v[insId].equation = [];
          }
          else { // end with sign
            v[insId].input = v[insId].equation[0];
          }
        }
        else v[insId].input ="0"
        
        v[insId].displayEquation = v[insId].equation.join(" ")+" negative(" + temp +")"
        
      } else if (val === ".") {
        v[insId].input = v[insId].input + val;
      } else {
            if(v[insId].equation.length === 1)    v[insId].equation.pop();
            v[insId].input = Number(v[insId].input + val).toString();
        }

      v[insId].displayInput = v[insId].input;

    } else if (["%", "^2", "1/", "sqrt"].includes(val)) {
      if (v[insId].input === "") {
        // case 4 after del c ce
        if (v[insId].equation.some((char) => SIGN.includes(char))) {
          if (isNumeric(v[insId].equation[v[insId].equation.length - 1])) {
            //case 1 after equals;
            v[insId].input = v[insId].equation[0];
            v[insId].equation = [];
          } else {
            // case 2 end with sign;
            v[insId].input = v[insId].equation[0];
          }
        } 
        // spacial case - spacial sign then equal then spacial sogn again
        else if(v[insId].equation[0] !== undefined) v[insId].input = v[insId].equation.pop();
        // case 3 first time;
        else v[insId].input = "0";
      }

      switch (val) {
        case "%":
        case "^2":
          v[insId].input += val;
          break;
        case "1/":
          v[insId].input = val + v[insId].input;
          break;
        case "sqrt":
          v[insId].input = val + "(" + v[insId].input + ")";
          break;
      }

      v[insId].displayEquation = v[insId].equation.join(" ") + " " + v[insId].input;

      v[insId].input = math.evaluate(v[insId].input).toString();

      
      v[insId].displayInput = Number(v[insId].input);
    } else if (SIGN.includes(val)) {
      // incase a+b+c+d...
      if (v[insId].equation.some((char) => SIGN.includes(char))) {
          if (v[insId].input !== "") {
          v[insId].equation.push(v[insId].input);
          addHistory(insId);
          let result = math.evaluate(v[insId].equation.join("")).toString();
          v[insId].equation = [result];
        } else {
          while (v[insId].equation.some((char) => SIGN.includes(char))) {
            v[insId].equation.pop();
          }
        }
      } else {
        if(v[insId].input.length !== 0)  
            v[insId].equation.push(v[insId].input) 
        else if(v[insId].equation.length === 0 )
            v[insId].equation.push(0);
      }

      v[insId].input = "";
      v[insId].equation.push(val);

      v[insId].displayEquation = v[insId].equation.join(" ");
    } else if (val === "del" || val === "c" || val === "ce") {
      switch (val) {
        case "del":
          if(isNumeric(v[insId].equation[v[insId].equation.length-1]))
          {
            v[insId].input = v[insId].equation[0];
            v[insId].equation = [];
            v[insId].displayEquation = "";
          }
          else if (v[insId].input.length > 1) v[insId].input = v[insId].input.slice(0, v[insId].input.length - 1);
          else if (SIGN.includes(v[insId].equation[v[insId].equation.length-1]) && v[insId].input === "") break;
          else v[insId].input = "0";
          v[insId].displayInput = Number(v[insId].input).toString() || "0";
          break;
        case "ce":
          if(!isNumeric(v[insId].equation[v[insId].equation.length-1]))
          {
            v[insId].input = "";
            v[insId].displayInput = "0";
            break;
          }
        case "c":
          v[insId].input = "";
          v[insId].equation = [];

          v[insId].displayEquation = "";
          v[insId].displayInput = "0";
          break;
      }
    } else if (val === "=") {
    // console.log("equation",v[insId].equation,"input",v[insId].input);

      if (v[insId].input !== "") v[insId].equation.push(v[insId].input);
      addHistory(insId);
      let result = math.evaluate(v[insId].equation.join("")).toString();

      v[insId].displayInput = result;
      v[insId].displayEquation = v[insId].equation.join(" ") + " =";

      v[insId].equation[0] = result;
      v[insId].input = "";
    }

    refreshDisplay(insId,v[insId].displayEquation,v[insId].displayInput);

}

function refreshDisplay(instanceId,equation,input) {
    const ele = getElementByIdAndInsId(instanceId,"equation");
    ele.innerHTML = equation;
    getElementByIdAndInsId(instanceId,"displayVal").innerHTML = input;
}
// call before calculate!!
function addHistory(insId) {

  const result = math.evaluate(v[insId].equation.join("")).toString();
  const temp = v[insId].equation.concat([result]);
  v[insId].history.push(temp);

  const spanEquationEl = document.createElement("span");
  spanEquationEl.classList.add("historyEquation");
  spanEquationEl.innerHTML = v[insId].equation.join(" ")+" =";

  const spanResultEl = document.createElement("span");
  spanResultEl.classList.add("historyResult");
  spanResultEl.innerHTML = result;

  let li =  document.createElement("li");
  li.id = `Card-${v[insId].history.length}`;
  li.classList.add("card");
  li.appendChild(spanEquationEl);
  li.appendChild(spanResultEl);

  li.addEventListener('click',function() {
    const id = this.id;
    const num = Number(id.slice(id.indexOf("-")+1))-1;
   
    v[insId].equation = v[insId].history[num];
    v[insId].input = v[insId].equation.pop();
    v[insId].displayEquation = v[insId].equation.join(" ");
    v[insId].displayInput = v[insId].input;
    refreshDisplay(insId,v[insId].displayEquation,v[insId].displayInput);
    
    v[insId].equation[0] = v[insId].input;
    v[insId].input = "";
  })

  const parentElement = getElementByIdAndInsId(insId,"historyList");
  const firstChild = parentElement.firstChild; // Get the current first child
  parentElement.insertBefore(li, firstChild)
  
}

function isNumeric(str) {
  return !isNaN(Number(str));
}

function getElementByIdAndInsId(instanceId,elementId){
    const instance = document.querySelector(`calculator-jquery[instance-id="${instanceId}"]`);
    const element = instance.shadowRoot.querySelector("#"+elementId); // Assuming the element is inside the shadow DOM
    return element;
}

class MyCustomElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    // Get the instance ID
    // const instanceId = this.getAttribute('instance-id'); 

    // Create a <style> element for the shadow DOM
    const style = document.createElement('style');
    style.textContent = `@import 'style.css';`;
    // Define the template
    const template = document.getElementById('calculator-jquery');
    const clone = document.importNode(template.content, true);
    shadow.appendChild(style);
    shadow.appendChild(clone);

    v.push({...TEMPATE_VARIABLE});
    }
}

customElements.define('calculator-jquery', MyCustomElement);
