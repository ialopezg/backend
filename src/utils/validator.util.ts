import {
  validateOrReject,
  ValidationError,
  ValidatorOptions,
} from 'class-validator';

export const validate = async (
  data: any,
  target: any,
  options?: ValidatorOptions,
): Promise<{ [key: string]: Record<string, string> }> => {
  options = options || {
    whitelist: true,
    validationError: { target: false },
    stopAtFirstError: false,
  };

  try {
    const objDto = new target();
    Object.keys(data).forEach((key: string) => {
      objDto[key] = data[key];
    });

    await validateOrReject(objDto, options);
  } catch (error) {
    const validationErrors = error as ValidationError[];
    const errorsList: Record<string, string> = validationErrors.reduce(
      (prevError, currError) => {
        const property = currError.property;
        const message = Object.values(currError.constraints!)[0];
        return { ...prevError, [property]: message };
      },
      {},
    );

    return { errors: errorsList };
  }
};
