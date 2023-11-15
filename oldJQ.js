const SIGN = ["+", "-", "*", "/"];

class CalculatorModel {
    constructor() {
        this.history = [];
        this.equation = [];
        this.input = "";
        this.displayInput = "";
        this.displayEquation = "";
    }

    addToHistory() {
        const result = math.evaluate(this.equation.join("")).toString();
        const temp = this.equation.concat([result]);
        this.history.push(temp);
    }

    handleButtonClick(val) {
        // Implement logic for button clicks
        // Update model properties accordingly
        this.refreshDisplay();
    }

    refreshDisplay() {
        // Update display properties based on the model's state
        this.displayEquation = this.equation.join(" ");
        this.displayInput = this.input !== "" ? this.input : "0";
    }
}

class CalculatorView {
    constructor(elementId, model) {
        this.element = document.getElementById(elementId);
        this.model = model;

        // Set up event listeners
        this.element.addEventListener("click", this.handleButtonClick.bind(this));
    }

    handleButtonClick(event) {
        const target = event.target;
        const value = target.value;
        this.model.handleButtonClick(value);
    }

    refreshDisplay() {
        // Update DOM elements based on the model's properties
        this.element.querySelector("#equation").textContent =
            this.model.displayEquation;
        this.element.querySelector("#displayVal").textContent =
            this.model.displayInput;
    }
}

class CalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
}

// Helper
function isNumeric(str) {
    return !isNaN(Number(str));
}

function getElementByIdAndInsId(instanceId, elementId) {
    const instance = document.querySelector(
        `calculator-jquery[instance-id="${instanceId}"]`
    );
    const element = instance.shadowRoot.querySelector("#" + elementId); // Assuming the element is inside the shadow DOM
    return element;
}

function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(deepClone);
    }

    const clonedObject = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObject[key] = deepClone(obj[key]);
        }
    }
    return clonedObject;
}

class MyCustomElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        // Create a <style> element for the shadow DOM
        const style = document.createElement("style");
        style.textContent = `@import 'style.css';`;
        // Define the template
        const template = document.getElementById("calculator-jquery");
        const clone = document.importNode(template.content, true);
        shadow.appendChild(style);
        shadow.appendChild(clone);

        const copiedObject = deepClone(TEMPLATE_VARIABLE);
        v.push(copiedObject);
    }
}

customElements.define("calculator-jquery", MyCustomElement);

// Initialization
document.addEventListener("DOMContentLoaded", function () {
    const calculatorModel = new CalculatorModel();
    const calculatorView = new CalculatorView("main-container", calculatorModel);
    const calculatorController = new CalculatorController(
        calculatorModel,
        calculatorView
    );

    const container = document.getElementById("main-container");

    if (container) {

        container.addEventListener("click", (event) => {
            let eventObj = event.composedPath();
            const target = eventObj[0]; // Get the actual target of the event
            let instanceId = 0;

            for (let i = 0; i < event.composedPath().length; i++) {

                if (eventObj[i].localName === "calculator-jquery") {
                    instanceId = Number(eventObj[i].attributes["instance-id"].value);
                    break;
                }
            }

            if (target.tagName === "BUTTON") {
                handleButtonClick(instanceId, target.value);
            }
        });
    }

    $("#addJQCalculator").on("click", function () {
        count += 1;

        const instance = document.createElement("calculator-jquery");
        instance.setAttribute("instance-id", count);
        container.append(instance);
    });
});

