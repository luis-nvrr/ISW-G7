/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import valid from 'card-validator';
import { addHours, isBefore } from 'date-fns';

const checkIfFilesAreTooBig = (file) => {
  if (file === null || file === undefined) {
    return true;
  }

  if (file.length === 0) {
    return true;
  }

  const size = file[0].size / 1024 / 1024;
  if (size < 5) {
    return true;
  }

  return false;
};

const checkIfFilesAreCorrectType = (file) => {
  if (file === null || file === undefined) {
    return true;
  }

  if (file.length === 0) {
    return true;
  }

  if (['image/jpeg'].includes(file[0].type)) {
    return true;
  }

  return false;
};

function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: msg,
    params: {
      reference: ref.path,
    },
    test(value) {
      return value === this.resolve(ref);
    },
  });
}

yup.addMethod(yup.string, 'equalTo', equalTo);

const schema = yup.object().shape({
  product: yup
    .string()
    .min(5, 'El mínimo es 5 caracteres')
    .max(280, 'El máximo es de 280 caracteres')
    .required(),
  image: yup
    .mixed()
    .test('file-format', 'El formato soportado es .jpg', (value) =>
      checkIfFilesAreCorrectType(value),
    )
    .test('file-size', 'El tamaño máximo es 5MB', (value) =>
      checkIfFilesAreTooBig(value),
    ),
  originStreet: yup
    .string()
    .min(5, 'El mínimo es 3 caracteres')
    .max(280, 'El máximo es de 280 caracteres')
    .required(),
  originNumber: yup
    .number()
    .typeError('Debe especificar un número')
    .positive('El número tiene que ser positivo')
    .required(),
  originCity: yup
    .string()
    .max(
      280,
      'La ciudad debe tener una longitud máxima de 280 caracteres',
    )
    .required('La ciudad es requerida'),
  originReference: yup.string().max(280),
  destinationStreet: yup
    .string()
    .min(3, 'El mínimo es 3 caracteres')
    .max(280, 'El máximo es de 280 caracteres')
    .required('La ciudad es requerida'),
  destinationNumber: yup
    .number()
    .typeError('Debe especificar un número')
    .positive('El número tiene que ser positivo')
    .required('El número es requerido'),
  destinationCity: yup
    .string()
    .max(280, 'El máximo es de 280 caracteres')
    .equalTo(
      yup.ref('originCity'),
      'La ciudad del comercio debe ser la misma que la de entrega',
    )
    .required('La ciudad es requerida'),
  destinationReference: yup
    .string()
    .max(280, 'El máximo es de 280 caracteres'),
  paymentMethod: yup
    .string()
    .max(280, 'El máximo es de 280 caracteres')
    .required('El método de pago es requerido'),
  paymentAmount: yup
    .number()
    .nullable()
    .when('paymentMethod', {
      is: 'efectivo',
      then: yup
        .number()
        .typeError('Debe ingresar un monto válido')
        .nullable()
        .positive('El monto debe ser positivo')
        .required('Debe ingresar un monto'),
    }),
  cardNumber: yup.string().when('paymentMethod', {
    is: 'visa',
    then: yup
      .string()
      .test(
        'test-number', // This is used internally by yup
        'El número de tarjeta no es válido', // Validation message
        (value) => {
          const number = valid.number(value);
          if (!number.card) return false;
          return number.card.type === 'visa' && number.isValid;
        },
      )
      .required(),
  }),
  cardOwner: yup.string().when('paymentMethod', {
    is: 'visa',
    then: yup.string().max(100).required('El titular es requerido'),
  }),
  expirationDate: yup
    .string()
    .nullable()
    .when('paymentMethod', {
      is: 'visa',
      then: yup
        .string()
        .nullable()
        .required('La fecha de vencimiento es requerida'),
    }),
  cvc: yup.string().when('paymentMethod', {
    is: 'visa',
    then: yup
      .string()
      .test(
        'test-cvv',
        'El CVC ingresado no es válido',
        (value) => valid.cvv(value).isValid,
      )
      .required(),
  }),
  shippingMethod: yup.string().max(280).required(),
  shippingDate: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: 'programado',
      then: yup
        .string()
        .nullable()
        .max(280)
        .test(
          'hour-test',
          `Puede programar entregas a partir de las ${addHours(
            new Date(),
            1,
          ).getHours()}:${new Date().getMinutes()}`,
          (value) =>
            !isBefore(new Date(value), addHours(new Date(), 1)),
        )
        .required(),
    }),
});

export default schema;
