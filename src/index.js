const http = require("http");
const fs = require("fs");
const { interpret, State } = require("xstate");
const orderMachine = require("./orderMachine");

const service = interpret(orderMachine)
  .onTransition((state) => {
    if (state.changed) {
      console.log("State transitionn: %s", state.value);
      persistState(state);
    }
  })
  .start(getOrderState());

service.send("APPROVE");

console.log(service.state.value);

//create a server object:
http
  .createServer(function (req, res) {
    res.write("Hello World!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080

function getOrderState() {
  try {
    const stateDefinition = JSON.parse(fs.readFileSync("order-machine.state"));
    const orderState = State.create(stateDefinition);
    return orderState;
  } catch {
    return undefined;
  }
}

function persistState(state) {
  const stateAsString = JSON.stringify(state);
  fs.writeFileSync("order-machine.state", stateAsString);
}
