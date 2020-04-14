import * as config from "config";
import models from "../lib/maindb";
const budgetModel = models.model("budget");
import * as polyfill from "babel-polyfill";
import * as moment from "moment";
import responseHandler from "../lib/responseHandler";

class budgetController {
  constructor() {}

  // add budget/expenses
  public add = async (req, res, next) => {
    const amount = req.body.amount;
    const type = req.body.type;
    const date = moment(req.body.date).format("YYYY-MM-DD"); // convert date format using moment
    const purpose = req.body.purpose;
    const description = req.body.description;

    console.log("date", date);

    // if data is invalid
    if (!amount || !date) {
      return responseHandler.makeResponse(
        res,
        false,
        400,
        "invalid input parameters!",
        []
      );
    }
    try {
      const budgetObj = new budgetModel({
        amount,
        type,
        date,
        description,
        purpose,
      });
      // save data to db
      const result = await budgetObj.save();
      return responseHandler.makeResponse(
        res,
        true,
        201,
        `${type} successfully added!`,
        result
      );
    } catch (err) {
      console.log(err);
      return responseHandler.makeResponse(
        res,
        false,
        500,
        "internel server error!",
        []
      );
    }
  };

  // update budget/expenses
  public update = async (req, res, next) => {
    const id = req.params.id;

    // if data is invalid
    if (!req.body.amount || !req.body.date) {
      return responseHandler.makeResponse(
        res,
        false,
        400,
        "invalid input parameters",
        []
      );
    }

    try {
      const record = await budgetModel.findOne({ _id: id });
      // if id is wrong
      if (!record) {
        return responseHandler.makeResponse(
          res,
          false,
          200,
          `${req.body.type} doesn't exist!`,
          []
        );
      }

      // update data based on id
      let updateRecord = await budgetModel.findOneAndUpdate(
        { _id: id },
        req.body
      );

      if (updateRecord) {
        return responseHandler.makeResponse(
          res,
          true,
          200,
          `${req.body.type} successfully updated!`,
          []
        );
      }
    } catch (err) {
      console.log(err, "errr");
      return responseHandler.makeResponse(
        res,
        false,
        500,
        "internel server error",
        []
      );
    }
  };

  // delete budget/expenses
  public delete = async (req, res, next) => {
    const _id = req.params.id;

    // if input is invalid
    if (!_id) {
      return responseHandler.makeResponse(
        res,
        false,
        400,
        "invalid input parameters",
        []
      );
    }

    try {
      // find record based on id
      const record = await budgetModel.findOne({ _id });
      // if record not found
      if (!record) {
        return responseHandler.makeResponse(
          res,
          false,
          200,
          "record doesn't exist!",
          []
        );
      }

      // delete record
      let deleteRecord = await budgetModel.findByIdAndRemove(_id);

      if (deleteRecord) {
        return responseHandler.makeResponse(
          res,
          true,
          200,
          `${deleteRecord.type} successfully deleted!`,
          []
        );
      }
    } catch (err) {
      return responseHandler.makeResponse(
        res,
        false,
        500,
        "internel server error",
        []
      );
    }
  };

  // get single budget/expenses based on id
  public get = async (req, res, next) => {
    const id = req.params.id;

    // if id is invalid
    if (!id) {
      return responseHandler.makeResponse(
        res,
        false,
        400,
        "invalid input parameters",
        []
      );
    }

    try {
      // get record based on id
      const record = await budgetModel.findOne({ _id: id });
      // if record not found
      if (!record) {
        return responseHandler.makeResponse(
          res,
          false,
          200,
          "record doesn't exist!",
          []
        );
      }
      return responseHandler.makeResponse(res, true, 200, "success", record);
    } catch (err) {
      return responseHandler.makeResponse(
        res,
        false,
        500,
        "internel server error",
        []
      );
    }
  };

  // get all budget/expenses only for current month
  public getAll = async (req, res, next) => {
    const startDate = moment().startOf("month").format(); // get start date of current month
    const endDate = moment().endOf("month").format(); // get end date of current month

    // pageNo, limit, skip for pagination
    const pageNo = parseInt(req.params.pageNo);
    const limit = parseInt(req.params.limit);
    const skip = limit * (pageNo - 1);

    // if we have limit && pageNo, will get current month data with pagination
    if (limit && pageNo) {
      const record = await budgetModel
        .find({
          date: {
            $gt: startDate,
            $lt: endDate,
          },
        })
        .skip(skip)
        .limit(limit);

      // get all budget/expenses and totals
      const result = this.getTotal(record);
      return responseHandler.makeResponse(res, true, 200, "success", result);
    } else {
      try {
        // get current month(start to end) records
        const record = await budgetModel.find({
          date: {
            $gt: startDate,
            $lt: endDate,
          },
        });
        const result = this.getTotal(record);
        return responseHandler.makeResponse(res, true, 200, "success", result);
      } catch (err) {
        console.log(err);
        return responseHandler.makeResponse(res, false, 500, "failed", []);
      }
    }
  };

  // calculate all budget/expenses and totals
  getTotal = (record) => {
    let totalBudget = 0;
    let remainingBudget = 0;
    let totalExpenses = 0;
    if (record.length === 0) {
      return [{ totalBudget, remainingBudget, totalExpenses, record }];
    }
    record.map((r) => {
      if (r.type === "budget") {
        totalBudget += r.amount;
      }
      if (r.type === "expenses") {
        totalExpenses += r.amount;
      }
    });
    return [
      {
        totalBudget,
        remainingBudget: totalBudget - totalExpenses,
        totalExpenses,
        record,
      },
    ];
  };
}

export default new budgetController();
