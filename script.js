$(document).ready(function () {
  let History = [];
  let equation = [];
  let displayVal = 0;

  function isNumeric(str) {
    return !isNaN(Number(str));
  }

  $("button").click(function () {
    var val = $(this).val();
    if (isNumeric(val) && equation.length > 0) {
      let last = equation.pop();
      if (isNumeric(last)) {
        last = last * 10 + Number(val);
        equation.push(last);
      }
      else
        equation.push(val)
    } else if(equation.length > 0)
    {

    }
    else equation.push(val);

    displayVal = equation.join(" ");
    document.getElementById("displayVal").innerHTML = displayVal;
  });
});
