'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' || type === 'radio' ? checked : value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await login({
                email: formData.email,
                password: formData.password,
            });

            // Redirect to feed page on successful login
            router.push('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        console.log('Google sign-in');
        // Add Google OAuth logic here
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
        // Add forgot password logic here
    };

    return (
        <section className="_social_login_wrapper _layout_main_wrapper">
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
            <div className="_social_login_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_login_left">
                                <div className="_social_login_left_image">
                                    <img src="/assets/images/login.png" alt="Image" className="_left_img" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_login_content">
                                <div className="_social_login_left_logo _mar_b28">
                                    <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
                                </div>
                                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                                <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
                                <button
                                    type="button"
                                    className="_social_login_content_btn _mar_b40"
                                    onClick={handleGoogleSignIn}
                                >
                                    <img src="/assets/images/google.svg" alt="Image" className="_google_img" />
                                    <span>Or sign-in with google</span>
                                </button>
                                <div className="_social_login_content_bottom_txt _mar_b40">
                                    <span>Or</span>
                                </div>
                                <div className="_social_login_form">
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control _social_login_input"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control _social_login_input"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                                            <div className="form-check _social_login_form_check">
                                                <input
                                                    className="form-check-input _social_login_form_check_input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    checked={formData.rememberMe}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                                                />
                                                <label className="form-check-label _social_login_form_check_label" htmlFor="flexRadioDefault2">
                                                    Remember me
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                                            <div className="_social_login_form_left">
                                                <p
                                                    className="_social_login_form_left_para"
                                                    onClick={handleForgotPassword}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    Forgot password?
                                                </p>
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
                                            <div className="_social_login_form_btn _mar_t40 _mar_b60">
                                                <button
                                                    type="button"
                                                    className="_social_login_form_btn_link _btn1"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Logging in...' : 'Login now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                        <div className="_social_login_bottom_txt">
                                            <p className="_social_login_bottom_txt_para">
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