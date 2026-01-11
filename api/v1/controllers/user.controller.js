import { asyncHandler } from "../../../utils/asyncHandler.js";
import User from "../../../database/models/user.model.js";
import { ApiError } from "../../../utils/apiErrors.js";
import { uploadFileOnCloudinary } from "../../../utils/cloudinary.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { generateAccessAndRefreshToken } from "../../../utils/jwt.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, age, isActive, password } = req.body;

  console.log(req.body);

  if ([name, email].some((field) => field?.trim() === "")) {
    throw new ApiError(404, "all field is required");
  }

  const userExist = await User.findOne({
    $or: [{ email }, { name }],
  });

  console.log("--------->", userExist);

  if (userExist) {
    console.log("user hega h");

    throw new ApiError(404, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
  const coverImagePath = req.files?.cover?.[0]?.path || null;

  // if (!avatarLocalPath) {
  //   throw new ApiError(404, "avatar image is required");
  // }

  const avatar = avatarLocalPath
    ? await uploadFileOnCloudinary(avatarLocalPath)
    : null;
  const cover = coverImagePath
    ? await uploadFileOnCloudinary(coverImagePath)
    : null;

  const user = await User.create({
    name: name.toLowerCase(),
    email,
    // age,
    password,
    avatarImage: avatar?.url || "no given image",
    coverImage: cover?.url || "no given image",
    isActive,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while creating user");
  }

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  console.log("body??", req.body);

  if (!email && !name) {
    throw new ApiError(404, "Email and username is required");
  }

  if ([email, name].some((f) => f?.trim() === "")) {
    throw new ApiError(404, "all field is required");
  }

  const userExist = await User.findOne({ $or: [{ email }, { name }] });

  if (!userExist) {
    throw new ApiError(404, "User does not exist with email or name");
  }

  console.log("userr ||",userExist);
  

  const isPasswordValid = await userExist.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Password doest not match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExist._id
  );

  const loggedInUser = await User.findById(userExist._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully.."
      )
    );
});

export { registerUser, loginUser };

// export default for man chaha naam
//  export is curly braces {} for same naam
