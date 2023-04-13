const en = {
  message: {
    error_unexpected: "An unexpected error has occurred",
    success: "Request Successful!",
    create_user: { success: "We're glad you joined!" },
    user_information: { invalid_token: "Your session has expired " },
    authorization_incorrect: "Login to continue.",
    pay: {
      amount_is_too_much: "The amount to pay exceeds your available balance",
    },
    delete_movement: {
      can_not_remove:
        "You cannot delete this movement because your negative balance would remain",
    },
  },
};

module.exports = en;
