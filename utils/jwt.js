import User from "../database/models/user.model.js";
import { ApiError } from "./apiErrors.js";

export const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new ApiError(404, "user did not find");
    }

    console.log("token user", user);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("jwt error", error.message);
    // throw error

    throw new ApiError(500, "something went wrong while generate token");
  }
};
