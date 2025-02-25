import { useState, useEffect } from "react";
import { FaReact } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import $ from "jquery";
import "jquery-validation";
import './App.css';

export default function Form() {
    const [values, setValues] = useState({
        firstname: '',
        cookie: false,
        address: '',
        zipcode: '',
        state: '',
        username: '',
        gender: '',
        email: '',
        accept: false,
        cond: false,
    });

    const [validations, setValidations] = useState({
        firstname: '',
        address: '',
        zipcode: '',
        state: '',
        username: '',
        gender: '',
        email: '',
        accept: '',
        cond: '',
    });

    useEffect(() => {

        // Obtener el valor de la cookie
        const firstNameCookie = Cookies.get('firstname');
        if (firstNameCookie) {
            setValues((prevValues) => ({
                ...prevValues,
                firstname: firstNameCookie,
            }));
        }

        // function 'lettersonly'
        $.validator.addMethod("lettersonly", function (value, element) {
            return this.optional(element) || /^[a-zA-Z]+$/.test(value);
        }, "Please enter only letters.");

        // function 'alphanumeric'
        $.validator.addMethod("alphanumeric", function (value, element) {
            return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
        }, "Please enter only letters and numbers.");

        // jQuery Validation
        $('#myForm').validate({
            rules: {
                firstname: {
                    required: true,
                    lettersonly: true,
                },
                address: {
                    required: true,
                    alphanumeric: true,
                },
                zipcode: {
                    required: true,
                    digits: true,
                },
                state: {
                    required: true,
                },
                username: {
                    required: true,
                    minlength: 6,
                    maxlength: 8,
                },
                gender: {
                    required: true,
                },
                email: {
                    required: true,
                    email: true,
                },
                accept: {
                    required: true,
                },
            },
            messages: {
                firstname: {
                    required: "Firstname is required",
                    lettersonly: "Please enter only letters for your name",
                },
                address: {
                    required: "Address is required",
                    alphanumeric: "Numbers and Letters Only for Address",
                },
                zipcode: {
                    required: "Zipcode is required",
                    digits: "Please enter a valid zip code",
                },
                state: {
                    required: "Please Choose a State",
                },
                username: {
                    required: "Username is required",
                    minlength: "Please enter at least 6 characters",
                    maxlength: "Please enter no more than 8 characters",
                },
                gender: {
                    required: "Please select a gender",
                },
                email: {
                    required: "Email is required",
                    email: "Please enter a valid email address",
                },
                accept: {
                    required: "You must accept the terms and conditions",
                },
            },
            //poner icono de error con bootstrap
            highlight: function (element) {
                $(element).addClass('is-invalid');
            },
            //quitar icono de error
            unhighlight: function (element) {
                $(element).removeClass('is-invalid');
            },

            // function to put the errors
            errorPlacement: function (error, element) {
                if (element.attr("type") === "radio") {
                    error.appendTo(element.closest("div").prev(".errorMsg"));
                } else {
                    const errorSpan = element.next(".errorMsg");
                    if (errorSpan.length) {
                        errorSpan.html(error.text());
                    } else {
                        error.insertAfter(element);
                    }
                }
            }
        });
    }, []);


    const validaAll = (e) => {
        e.preventDefault();

        const { firstname, cookie, address, zipcode, state, username, gender, email, accept, cond } = values;
        const validations = { firstname: '', address: '', zipcode: '', state: '', username: '', gender: '', email: '', accept: '', cond: '' };
        let isValid = true;

        function isAlphanumeric(value) {
            var alphaExp = /^[0-9a-zA-Z]+$/;
            return value.match(alphaExp);
        }

        function isAlphabet(value) {
            var alphaExp = /^[a-zA-Z]+$/;
            return value.match(alphaExp);
        }

        function isNumeric(value) {
            var numericExpression = /^[0-9]+$/;
            return value.match(numericExpression);
        }

        function madeSelection(value) {
            return value !== '';
        }

        function lengthRestriction(value) {
            return value.length >= 6 && value.length <= 8;
        }

        function emailValidator(value) {
            var emailExp = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
            return value.match(emailExp);
        }

        //firstname
        if (!firstname) {
            validations.firstname = 'Firstname is required';
            isValid = false;
        } else {
            if (!isAlphabet(firstname)) {
                validations.firstname = 'Please enter only letters for your name';
                isValid = false;
            }
        }

        //cookie
        if (cookie) {
            setCookie('firstname', firstname, 30)
        }

        //address
        if (!address) {
            validations.address = 'Address is required';
            isValid = false;
        } else {
            if (!isAlphanumeric(address)) {
                validations.address = 'Numbers and Letters Only for Address';
                isValid = false;
            }
        }

        //zipcode
        if (!zipcode) {
            validations.zipcode = 'Zipcode is required';
            isValid = false;
        } else {
            if (!isNumeric(zipcode)) {
                validations.zipcode = 'Please enter a valid zip code';
                isValid = false;
            }
        }

        //state
        if (!madeSelection(state)) {
            validations.state = 'Please Choose a State';
            isValid = false;
        }

        //username
        if (!username) {
            validations.username = 'Username is required';
            isValid = false;
        } else {
            if (!lengthRestriction(username)) {
                validations.username = 'Please enter between 6 and 8 characters';
                isValid = false;
            }
        }

        //gender
        if (!gender) {
            validations.gender = 'Please select a gender';
            isValid = false;
        }

        // email
        if (!email) {
            validations.email = 'Email is required';
            isValid = false;
        } else {
            if (!emailValidator(email)) {
                validations.email = 'Please enter a valid email address';
                isValid = false;
            }
        }

        //checkbox
        if (!accept) {
            validations.accept = 'You must accept the terms and conditions';
            isValid = false;
        }

        if (!isValid) {
            setValidations(validations)
        }

        return isValid

    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues({
            ...values,
            [name]: type === 'checkbox' ? checked : value
        });
    }

    //cookie
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="card p-4" >
                <div className="d-flex justify-content-center align-items-center mb-2">
                    <FaReact className="img-fluid" />
                </div>
                <h1 className="text-center mb-4">
                    Formulary React</h1>
                <form id="myForm" action="" className="needs-validation" noValidate onSubmit={validaAll}>
                    <div className="mb-3">
                        <label htmlFor="firstname" className="form-label">Firstname</label>
                        <input type="text" name="firstname" value={values.firstname} onChange={handleChange} className="form-control" />
                        <span className="errorMsg text-danger"></span>
                    </div>

                    <div className="mb-3 form-check">
                        <label htmlFor="cookie" className="form-check-label">Remember me?</label>
                        <input type="checkbox" name="cookie" id="cookie" checked={values.cookie} onChange={handleChange} className="form-check-input" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" name="address" value={values.address} onChange={handleChange} className="form-control" />
                        <span className="errorMsg text-danger"></span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="zipcode" className="form-label">Zip Code</label>
                        <input type="text" name="zipcode" value={values.zipcode} onChange={handleChange} className="form-control" />
                        <span className="errorMsg text-danger"></span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="state" className="form-label">Select State:</label>
                        <select name="state" value={values.state} onChange={handleChange} className="form-select">
                            <option value="" disabled>Please Choose</option>
                            <option>AL</option>
                            <option>CA</option>
                            <option>TX</option>
                            <option>WI</option>
                        </select>
                        <span className="errorMsg text-danger"></span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username (6-8 characters)</label>
                        <input type="text" name="username" value={values.username} onChange={handleChange} className="form-control" />
                        <span className="errorMsg text-danger"></span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender:</label>
                        <span className="errorMsg text-danger d-block mt-1"></span>
                        <div>
                            <label className="me-3">
                                <input type="radio" name="gender" value="female" checked={values.gender === 'female'} onChange={handleChange} className="me-1" /> Female
                            </label>
                            <label>
                                <input type="radio" name="gender" value="male" checked={values.gender === 'male'} onChange={handleChange} className="me-1" /> Male
                            </label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" name="email" value={values.email} onChange={handleChange} className="form-control" />
                        <span className="errorMsg text-danger"></span>
                    </div>

                    <div className="mb-3 form-check">
                        <label htmlFor="accept" className="form-check-label">Accept terms and conditions</label>
                        <input type="checkbox" name="accept" id="accept" checked={values.accept} onChange={handleChange} className="form-check-input" />
                        <span className="errorMsg text-danger d-block mt-1"></span>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary w-100">Check Form</button>
                    </div>
                </form>
            </div>
        </div>

    )
}