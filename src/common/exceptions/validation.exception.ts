import { PreconditionFailedException } from 'custom-error-service';

export class ValidationException extends PreconditionFailedException {
  constructor(errors?: { [key: string]: string }) {
    super('Validation Error', { details: errors });
  }
}