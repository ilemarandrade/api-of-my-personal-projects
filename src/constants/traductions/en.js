const en = {
  message: {
    error_unexpected: "An unexpected error has occurred",
    success: "Request Successful!",
    create_user: { success: "We're glad you joined!" },
    user_information: { invalid_token: "Your session has expired " },
    authorization_incorrect: "Login to continue.",
    pay: {
      amount_is_too_much: "Spend amount exceeds your available balance",
    },
    delete_movement: {
      can_not_remove:
        "You cannot delete this movement because your negative balance would remain",
    },
    login: {
      wrong_data: "Email or password was not correct",
    },
    sign_up: {
      user_exist:
        "There is already an account associated with this email or document",
    },
    forgot_password: {
      check_your_email:
        "Check your email to continue with the password recovery process",
      title_email: "Password recovery instructions",
      success_update_password: "Password updated successfully",
      passwords_do_not_match: "Passwords do not match",
    },
  },
};

module.exports = en;
