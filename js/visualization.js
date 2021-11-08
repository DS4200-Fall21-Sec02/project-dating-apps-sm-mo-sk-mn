// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
d3.csv("data/Copy of Online Dating responses - Form Responses 1.csv").then((data) => {

  console.log(data.slice(0, 11));

});