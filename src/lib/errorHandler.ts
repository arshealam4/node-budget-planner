import responseHandler from "./responseHandler";

// middleware to handle errors
class errorHandler {
  constructor() {}

  routeNotFound = (req, res) => {
    return responseHandler.makeResponse(res, false, 404, "route not found", []);
  };
}

export default new errorHandler();
