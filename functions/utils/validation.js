const yup = require("yup");

const ERR_MSG_EMPTY_FIELD = "Should not be empty";
const ERR_MSG_INVALID_EMAIL = "Should be a valid email";
const ERR_MSG_PASSWORD_CONFIRM = "Passwords don't match";

const signUp = yup.object().shape({
  handle: yup.string().required(ERR_MSG_EMPTY_FIELD),
  email: yup
    .string()
    .email(ERR_MSG_INVALID_EMAIL)
    .required(ERR_MSG_EMPTY_FIELD),
  password: yup.string().required(ERR_MSG_EMPTY_FIELD),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], ERR_MSG_PASSWORD_CONFIRM)
});

const logIn = yup.object().shape({
  email: yup
    .string()
    .email(ERR_MSG_INVALID_EMAIL)
    .required(ERR_MSG_EMPTY_FIELD),
  password: yup.string().required(ERR_MSG_EMPTY_FIELD)
});

const validate = (object, schema) => {
  try {
    schema.validateSync(object, { abortEarly: false });
    return null;
  } catch (error) {
    const { path, message } = error.inner[0];
    return { [path]: message };
  }
};

module.exports = {
  schemas: {
    signUp,
    logIn
  },
  validate
};
