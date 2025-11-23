'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';

export default function Registration() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
        agreeToTerms: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('Please agree to terms & conditions');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await register({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
            });

            // Redirect to feed page on successful registration
            router.push('/');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        console.log('Register with Google');
        // Add Google OAuth logic here
    };

    return (
        <section className="_social_registration_wrapper _layout_main_wrapper">
            <div className="_shape_one">
                <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
            </div>
            <div className="_shape_two">
                <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_shape_three">
                <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_social_registration_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_registration_right">
                                <div className="_social_registration_right_image">
                                    <img src="/assets/images/registration.png" alt="Image" />
                                </div>
                                <div className="_social_registration_right_image_dark">
                                    <img src="/assets/images/registration1.png" alt="Image" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_registration_content">
                                <div className="_social_registration_right_logo _mar_b28">
                                    <img src="/assets/images/logo.svg" alt="Image" className="_right_logo" />
                                </div>
                                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
                                <button
                                    type="button"
                                    className="_social_registration_content_btn _mar_b40"
                                    onClick={handleGoogleRegister}
                                >
                                    <img src="/assets/images/google.svg" alt="Image" className="_google_img" />
                                    <span>Register with google</span>
                                </button>
                                <div className="_social_registration_content_bottom_txt _mar_b40">
                                    <span>Or</span>
                                </div>
                                <div className="_social_registration_form">
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">First Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control _social_registration_input"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your first name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control _social_registration_input"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your last name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control _social_registration_input"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control _social_registration_input"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your password"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Repeat Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control _social_registration_input"
                                                    name="repeatPassword"
                                                    value={formData.repeatPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Repeat your password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                                            <div className="form-check _social_registration_form_check">
                                                <input
                                                    className="form-check-input _social_registration_form_check_input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    checked={formData.agreeToTerms}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                                                />
                                                <label className="form-check-label _social_registration_form_check_label" htmlFor="flexRadioDefault2">
                                                    I agree to terms & conditions
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                                            {error && (
                                                <div className="alert alert-danger _mar_b20" role="alert">
                                                    {error}
                                                </div>
                                            )}
                                            <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                                                <button
                                                    type="button"
                                                    className="_social_registration_form_btn_link _btn1"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Registering...' : 'Register now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                        <div className="_social_registration_bottom_txt">
                                            <p className="_social_registration_bottom_txt_para">
                                                Dont have an account? <a href="#0">Create New Account</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}