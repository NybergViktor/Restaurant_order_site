import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  min?: number;
  max?: number;
  enum?: string[];
  pattern?: RegExp;
}

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`Field '${rule.field}' is required`);
        continue;
      }

      // Skip further validation if field is not present and not required
      if (value === undefined || value === null) {
        continue;
      }

      // Type validation
      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`Field '${rule.field}' must be a string`);
      } else if (rule.type === 'number' && typeof value !== 'number') {
        errors.push(`Field '${rule.field}' must be a number`);
      } else if (rule.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Field '${rule.field}' must be a boolean`);
      } else if (rule.type === 'array' && !Array.isArray(value)) {
        errors.push(`Field '${rule.field}' must be an array`);
      } else if (rule.type === 'object' && typeof value !== 'object') {
        errors.push(`Field '${rule.field}' must be an object`);
      }

      // String-specific validations
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.min !== undefined && value.length < rule.min) {
          errors.push(`Field '${rule.field}' must be at least ${rule.min} characters`);
        }
        if (rule.max !== undefined && value.length > rule.max) {
          errors.push(`Field '${rule.field}' must be at most ${rule.max} characters`);
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`Field '${rule.field}' has invalid format`);
        }
      }

      // Number-specific validations
      if (rule.type === 'number' && typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`Field '${rule.field}' must be at least ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`Field '${rule.field}' must be at most ${rule.max}`);
        }
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`Field '${rule.field}' must be one of: ${rule.enum.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ 
        success: false,
        errors 
      });
      return;
    }

    next();
  };
};
