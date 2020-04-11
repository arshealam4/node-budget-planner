class responseHandler {
  constructor() {}

  // middleware to make general response for all API calls
  public makeResponse = (res, status, code, msg, result) => {
    res.status(code).send({
      status,
      code,
      msg,
      result: result ? result : [],
    });
  };
}

export default new responseHandler();
