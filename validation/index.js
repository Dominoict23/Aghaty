const yup = require("yup");

const loginValidation = yup.object().shape({
  mobile: yup.string().required(), // TODO: set length  15
  password: yup.string().required().length(4), //TODO: max 16 min 8
});

// const validateTeacher = yup.object().shape({
//   email: yup.string().required().email(),
// });

// const validateStudent = yup.object().shape({
//   email: yup.string().required().email(),
//   name: yup.string().required(),
//   location: yup.string().required(),
// });

// const validateAdminSignUp = yup.object().shape({
//   name: yup.string().required(),
//   email: yup.string().required().email(),
//   password: yup.string().required().length(4),
// });

// const validateParentSignUp = yup.object().shape({
//   name: yup.string().required(),
//   email: yup.string().required().email(),
//   password: yup.string().required().length(4),
// });

module.exports = {
  loginValidation,
  //   validateTeacher,
  //   validateAdminSignUp,
  //   validateParentSignUp,
  //   validateStudent,
};
