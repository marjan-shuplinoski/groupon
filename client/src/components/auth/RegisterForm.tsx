import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { 
  RegisterFormData, 
  MerchantRegisterData, 
  UserRegisterData 
} from '../../types/auth';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'merchant';
  businessName?: string;
  businessAddress?: string;
  phone?: string;
  businessDescription?: string;
  website?: string;
}

const validationSchema = (isMerchant: boolean) => {
  const baseSchema = {
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  };

  if (isMerchant) {
    return Yup.object().shape({
      ...baseSchema,
      businessName: Yup.string().required('Business name is required'),
      businessAddress: Yup.string().required('Business address is required'),
      phone: Yup.string().required('Phone number is required'),
      businessDescription: Yup.string(),
      website: Yup.string().url('Must be a valid URL'),
    });
  }

  return Yup.object().shape(baseSchema);
};

interface RegisterFormProps {
  onSubmit: (values: RegisterFormData) => void;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const [isMerchant, setIsMerchant] = useState(false);

  const initialValues: FormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    businessName: '',
    businessAddress: '',
    phone: '',
    businessDescription: '',
    website: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema(isMerchant)}
      onSubmit={(values: FormValues, { setSubmitting }) => {
        try {
          // Exclude confirmPassword from the submitted values
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { confirmPassword, ...submitValues } = values;
          
          if (isMerchant) {
            // For merchant registration, include all merchant fields
            const merchantData: MerchantRegisterData & { repeatPassword: string } = {
              name: submitValues.name,
              email: submitValues.email,
              password: submitValues.password,
              role: 'merchant',
              businessName: submitValues.businessName || '',
              businessAddress: submitValues.businessAddress || '',
              phone: submitValues.phone || '',
              businessDescription: submitValues.businessDescription,
              website: submitValues.website,
              repeatPassword: submitValues.password,
            };
            onSubmit(merchantData);
          } else {
            // For regular user registration, only include basic fields
            const userData: UserRegisterData & { repeatPassword: string } = {
              name: submitValues.name,
              email: submitValues.email,
              password: submitValues.password,
              role: 'user',
              repeatPassword: submitValues.password,
            };
            onSubmit(userData);
          }
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="needs-validation" noValidate>
          {/* Role Toggle */}
          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="isMerchant"
              checked={isMerchant}
              onChange={() => setIsMerchant(!isMerchant)}
            />
            <label className="form-check-label fw-bold" htmlFor="isMerchant">
              Register as a Merchant
            </label>
          </div>

          {/* Basic Fields */}
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <Field
                type="text"
                name="name"
                id="name"
                className={`form-control border-2 ${errors.name && touched.name ? 'is-invalid border-danger' : 'border-primary'}`}
                placeholder="John Doe"
              />
              <ErrorMessage name="name" component="div" className="invalid-feedback" />
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email *</label>
              <Field
                type="email"
                name="email"
                id="email"
                className={`form-control border-2 ${errors.email && touched.email ? 'is-invalid border-danger' : 'border-primary'}`}
                placeholder="john@example.com"
              />
              <ErrorMessage name="email" component="div" className="invalid-feedback" />
            </div>

            <div className="col-md-6">
              <label htmlFor="password" className="form-label">Password *</label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`form-control border-2 ${errors.password && touched.password ? 'is-invalid border-danger' : 'border-primary'}`}
                placeholder="At least 6 characters"
              />
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
            </div>

            <div className="col-md-6">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`form-control border-2 ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid border-danger' : 'border-primary'}`}
                placeholder="Retype your password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
            </div>
          </div>

          {/* Merchant Fields */}
          {isMerchant && (
            <div className="mt-4">
              <h3 className="mb-4">Create your account</h3>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="businessName" className="form-label">Business Name *</label>
                  <Field
                    type="text"
                    name="businessName"
                    id="businessName"
                    className={`form-control border-2 ${errors.businessName && touched.businessName ? 'is-invalid border-danger' : 'border-primary'}`}
                    placeholder="Your Business Name"
                  />
                  <ErrorMessage name="businessName" component="div" className="invalid-feedback" />
                </div>

                <div className="col-12">
                  <label htmlFor="businessAddress" className="form-label">Business Address *</label>
                  <Field
                    as="textarea"
                    name="businessAddress"
                    id="businessAddress"
                    rows={2}
                    className={`form-control border-2 ${errors.businessAddress && touched.businessAddress ? 'is-invalid border-danger' : 'border-primary'}`}
                    placeholder="123 Business St, City, Country"
                  />
                  <ErrorMessage name="businessAddress" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">Phone Number *</label>
                  <Field
                    type="tel"
                    name="phone"
                    id="phone"
                    className={`form-control border-2 ${errors.phone && touched.phone ? 'is-invalid border-danger' : 'border-primary'}`}
                    placeholder="+1 (555) 123-4567"
                  />
                  <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-6">
                  <label htmlFor="website" className="form-label">Website</label>
                  <Field
                    type="url"
                    name="website"
                    id="website"
                    className={`form-control border-2 ${errors.website && touched.website ? 'is-invalid border-danger' : 'border-primary'}`}
                    placeholder="https://example.com"
                  />
                  <ErrorMessage name="website" component="div" className="invalid-feedback" />
                </div>

                <div className="col-12">
                  <label htmlFor="businessDescription" className="form-label">Business Description</label>
                  <Field
                    as="textarea"
                    name="businessDescription"
                    id="businessDescription"
                    rows={3}
                    className={`form-control border-2 ${errors.businessDescription && touched.businessDescription ? 'is-invalid border-danger' : 'border-primary'}`}
                    placeholder="Tell us about your business..."
                  />
                  <ErrorMessage name="businessDescription" component="div" className="invalid-feedback" />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isMerchant ? 'Creating Merchant Account...' : 'Creating Account...'}
                </>
              ) : (
                isMerchant ? 'Sign Up as Merchant' : 'Sign Up'
              )}
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="form-text mt-3">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
