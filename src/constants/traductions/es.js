const es = {
  message: {
    error_unexpected: "Ha ocurrido un error inesperado",
    success: "Solicitud Exitosa!",
    create_user: { success: "Estamos alegres que te hayas unido!" },
    user_information: { invalid_token: "Tu sesión ha expirado " },
    authorization_incorrect: "Inicia sesión para continuar.",
    pay: {
      amount_is_too_much: "The amount to pay exceeds your available balance",
    },
    delete_movement: {
      can_not_remove:
        "No puedes eliminar este movimiento porque quedaria tu saldo negativo",
    },
  },
};

module.exports = es;
