import * as instituteService from "../services/institute.service.js";

export const listInstitutesController = async (req, res, next) => {
  try {
    const institutes = await instituteService.listInstitutes();
    res.status(200).json({
      success: true,
      data: institutes,
    });
  } catch (error) {
    next(error);
  }
};

export const createInstituteController = async (req, res, next) => {
  try {
    const institute = await instituteService.createInstitute(
      req.body,
      req.user,
    );

    res.status(201).json({
      success: true,
      message: "Institute created successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};
