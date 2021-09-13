/* eslint-disable react/forbid-prop-types */
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Textarea,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import { FiMapPin } from 'react-icons/fi';
import PropTypes from 'prop-types';

const CFiMapPin = chakra(FiMapPin);

const OriginForm = ({ register, errors }) => {
  const validCities = [
    {
      id: 1,
      name: 'Ciudad de Córdoba',
    },
    {
      id: 2,
      name: 'Rio Primero',
    },
    {
      id: 3,
      name: 'Villa Carlos Paz',
    },
  ];

  return (
    <Stack
      direction="column"
      paddingY={3}
      paddingX={6}
      marginBottom={2}
    >
      <Heading color="gray.500" fontSize={[20, 22, 25]}>
        Dirección de entrega
      </Heading>
      <FormControl
        isInvalid={Boolean(errors?.originStreet?.message)}
        errortext={errors?.originStreet?.message}
        isRequired
      >
        <FormLabel>Calle</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="gray.300">
            <CFiMapPin color="gray.500" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="25 de mayo"
            {...register('originStreet')}
          />
        </InputGroup>
        <FormErrorMessage>
          {errors?.originStreet?.message
            ? errors?.originStreet?.message
            : false}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={Boolean(errors?.originNumber?.message)}
        errortext={errors?.originNumber?.message}
        isRequired
      >
        <FormLabel>Numero</FormLabel>
        <Input
          type="number"
          placeholder="998"
          {...register('originNumber')}
        />
        <FormErrorMessage>
          {errors?.originNumber?.message
            ? errors?.originNumber?.message
            : false}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={Boolean(errors?.originCity?.message)}
        errortext={errors?.originCity?.message}
        isRequired
      >
        <FormLabel>Ciudad</FormLabel>
        <Select
          placeholder="Elija una ciudad"
          {...register('originCity')}
        >
          {validCities.map((city) => (
            <option key={city.id}>{city.name}</option>
          ))}
        </Select>
        <FormErrorMessage>
          {errors?.originCity?.message
            ? errors?.originCity?.message
            : false}
        </FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Referencia</FormLabel>
        <Textarea
          placeholder="Tocar timbre!"
          size="md"
          resize="none"
          {...register('originReference')}
        />
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <FormHelperText>máx 280 caracteres</FormHelperText>
        </Stack>
      </FormControl>
    </Stack>
  );
};

OriginForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default OriginForm;
