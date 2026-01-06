import { asyncHandler } from "../../../utils/asyncHandler.js";

const registerUser = asyncHandler (async (req, res) => {


  res.status(201).json({
    message: "ok",
  });
});

export { registerUser };


// export default for man chaha naam
//  export is curly braces {} for same naam