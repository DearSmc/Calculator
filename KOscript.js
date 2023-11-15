function HistoryItem(model, equation) {
  this.model = model;
  this.equation = equation;

  this.historyEquation = this.equation().join(" ") + " =";
  this.historyResult = math.evaluate(this.equation().join("")).toString();

  this.handleHistoryClick = function () {
    this.model.equation(this.equation());
    this.model.input(this.historyResult);
    this.model.displayEquation(this.equation().join(" "));
    this.model.displayInput(this.historyResult);

    this.model.equation.splice(0, 1, this.historyResult);
    this.model.input("");
  }.bind(this);
}

function ItemViewModel() {
  this.history = ko.observableArray([]);
  this.equation = ko.observableArray([]);
  this.input = ko.observable("");
  this.displayInput = ko.observable("");
  this.displayEquation = ko.observable("");
  this.eqLastIdx = ko.computed(function () {
    return this.equation().length - 1;
  }, this);

    this.handleNumberClick = function (val) {

    if (val === "*-1") {
        let temp = this.input() || this.equation()[0] || "0";

        if (this.input() !== "") {
            this.input((Number(this.input()) * -1).toString());
        }
        else if (this.equation()[0] !== undefined) {

            if (isNumeric(this.equation()[this.eqLastIdx()])) {
                // end with equals;
                this.input((Number(this.equation()[0]) * -1).toString());
                this.equation.removeAll();
            }
            else {
                // end with sign
                this.input(this.equation()[0]);
            }
        }
        else {
            this.input("0");
        }
        this.displayEquation(this.equation().join(" ") + " negative(" + temp + ")");
    }
    else if (val === ".") {
      this.input(this.input() + val);
    }
    else {

        if (this.eqLastIdx() === 0) {
            this.equation.pop();
        }
        this.input(Number(this.input() + val).toString());
    }

    this.displayInput(this.input());
  }.bind(this);

  // ---------------------------------------------------

 this.handleSignClick = function (val) {

     if (this.equation().some((char) => SIGN.includes(char))) {

      if (this.input() !== "") {
        this.equation.push(this.input());
        this.history.unshift(new HistoryItem(this, this.equation));
        let result = math.evaluate(this.equation().join("")).toString();
        this.equation([result]);
      }
      else {

        while (this.equation().some((char) => SIGN.includes(char))) {
          this.equation.pop();
        }
      }
     } else {

         if (this.input().length !== 0)
         {
             this.equation.push(this.input());
         }
         else if (this.eqLastIdx() === -1)
         {
             this.equation.push(0);
         }
    }
    this.input("");
    this.equation.push(val);
    this.displayEquation(this.equation().join(" "));
  }.bind(this);

  this.handleSpacialSignClick = function (val) {

  if (this.input() === "") {
      // case 4 after del c ce
      if (this.equation().some((char) => SIGN.includes(char)))
      {   // case 2 end with sign;
          this.input(this.equation()[0]);

          if (isNumeric(this.equation()[this.eqLastIdx()])) {
              //case 1 after equals;
              this.equation.removeAll();
          }
      }
      // spacial case - spacial sign then equal then spacial sogn again
      else if (this.equation()[0] !== undefined)
      {
          this.input(this.equation.pop());
      }
      // case 3 first time;
      else
      {
          this.input("0");
      }
    }
    // console.log("input", this.input());

    switch (val) {
      case "%":
      case "^2":
        this.input(this.input() + val);
        break;
      case "1/":
        this.input(val + this.input());
        break;
      case "sqrt":
        this.input(val + "(" + this.input() + ")");
        break;
    }

    this.displayEquation(this.equation().join(" ") + " " + this.input());
    this.input(math.evaluate(this.input()).toString());
    this.displayInput(Number(this.input()));
  }.bind(this);

  // ---------------------------------------------------

  this.handleEqualClick = function () {

      if (this.input() !== "")
      {
          this.equation.push(this.input());
      }
      this.history.unshift(new HistoryItem(this, this.equation));
      let result = math.evaluate(this.equation().join("")).toString();

      this.displayInput(result);
      this.displayEquation(this.equation().join(" ") + " =");
      this.equation.splice(0, 1, result);
      this.input("");
  };

  // ----------------------------------------------------

  this.clear = function () {
    this.equation.removeAll();
    this.input("");
    this.displayInput("");
    this.displayEquation("");
  }.bind(this);

    this.del = function () {

        if (isNumeric(this.equation()[this.eqLastIdx()])) {
            // case and with =
            this.input(this.equation()[0]);
            this.equation.removeAll();
            this.displayEquation("");
        }
        else if (this.input().length > 1) {
            // TODO: fixbug
            // - case after user spacial sign and then click del
            //   Result not suppose to be delete
            // if(this.displayEquation() === "")

            this.input(this.input().slice(0, this.input().length - 1));
        }
        else if (
            SIGN.includes(this.equation()[this.eqLastIdx()]) &&
            this.input() === ""
        ) {
            return;
        }
        else {
            this.input("0");
        }
    this.displayInput(Number(this.input()).toString() || "0");
  }.bind(this);

    this.ce = function () {

        if (!isNumeric(this.equation()[this.eqLastIdx()])) {
            this.input("");
            this.displayInput("0");
        }
        else {
            this.clear();
        }
  }.bind(this);
}

function MainViewModel() {
  this.items = ko.observableArray([]);
}

var mainViewModel = new MainViewModel();
ko.applyBindings(mainViewModel, document.getElementById("ko-container"));
//var mainViewModel = ko.dataFor(document.getElementById("KO-container"));

function addItem() {
  mainViewModel.items.push(new ItemViewModel());
}
