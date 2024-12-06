import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios'; 
import { JOB_API_END_POINT, PAYMENT_API_END_POINT, USER_API_END_POINT } from "../../utils/constant";
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// Stripe public key
const stripePromise = loadStripe('pk_test_51QKd8GP5mvchvauDx6uFRBJGYjVDkWOTLHhDxYwpCiJ1ywK47aRCAmROLPRQUnx6uKRUSMhpP8QXhjQbxLTPdaGY00lGyWhHEc'); 

const PostJob = () => {
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        qualification: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        companyId: '',
    });
    const [user, setUser] = useState({ email: '', contact: '' });
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [showPlanPopup, setShowPlanPopup] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector((store) => store.company);

    const stripe = useStripe();
    const elements = useElements();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handlePlanChange = (e) => {
        setSelectedPlan(e.target.value);
    };

    const handlePaymentAndPostJob = async () => {
        try {
            const token = localStorage.getItem("token");

            const paymentRes = await axios.post(
                `${PAYMENT_API_END_POINT}/create-order`,
                { planType: selectedPlan },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (paymentRes.data.success) {
                const { clientSecret } = paymentRes.data;

                if (!clientSecret) {
                    throw new Error("clientSecret is missing in the response.");
                }    
                if (!stripe || !elements) {
                    toast.error("Stripe has not loaded yet.");
                    return;
                }

                const cardElement = elements.getElement(CardElement);

                if (!cardElement) {
                    toast.error("CardElement is not available.");
                    return;
                }

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            email: user.email,
                            phone: user.contact,
                        },
                    },
                });

                if (error) {
                    toast.error(error.message);
                } else if (paymentIntent.status === 'succeeded') {
                    toast.success("Payment verified successfully. Posting job...");
                    submitJobAfterPayment(paymentIntent.id);  
                } else {
                    toast.error("Payment verification failed. Please try again.");
                }
            } else {
                throw new Error(paymentRes.data.message || "Failed to create payment order.");
            }
        } catch (error) {
            toast.error(error.message || "Error initiating payment.");
        }
    };

    const submitJobAfterPayment = async (paymentIntentId) => {
        try {
            const token = localStorage.getItem("token");

            const verifyRes = await axios.post(
                `${PAYMENT_API_END_POINT}/verify-payment`,
                { paymentIntentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
                const res = await axios.post(
                    `${JOB_API_END_POINT}/post`,
                    input,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data.success) {
                    toast.success("Job posted successfully.");
                    navigate("/admin/jobs");
                } else {
                    toast.error("Failed to post the job.");
                }
            } else {
                toast.error("Payment verification failed.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error posting job.");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${JOB_API_END_POINT}/post`,
                input,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                toast.success("Job posted successfully.");
                navigate("/admin/jobs");
            }
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.message === "No active payment plan found. Please subscribe to a plan to post jobs."
            ) {
                toast.info("No active payment plan found. Please choose a plan.");
                setTimeout(() => {
                    setShowPlanPopup(true);
                }, 2000);
            } else {
                toast.error(error.response?.data?.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companies.length > 0) {
            setInput((prevState) => ({
                ...prevState,
                companyId: companies[0]._id
            }));
        }
        fetchUserData();
    }, [companies]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${USER_API_END_POINT}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { email, phoneNumber } = res.data;
            setUser({
                email: email || '',
                contact: phoneNumber || '',
            });
        } catch (error) {
            toast.error("Failed to fetch user data.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center md:w-screen my-5 mx-4">
                <div className="relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-2 right-2"
                    >
                        <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                    </button>
                    <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Skills Required</Label>
                                <Input
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Qualification Required</Label>
                                <Input
                                    type="text"
                                    name="qualification"
                                    value={input.qualification}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Salary (in LPA)</Label>
                                <Input
                                    type="number"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                    min="1"
                                    max="60"
                                />
                            </div>
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Location</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Job Type</Label>
                                <Input
                                    type="text"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Experience Level (in years)</Label>
                                <Input
                                    type="number"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>No of Position</Label>
                                <Input
                                    type="number"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            {companies.length > 0 && (
                                <div className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                    <Label>Company Name</Label>
                                    <Input
                                        type="text"
                                        name="companyId"
                                        value={companies[0].name}
                                        readOnly
                                        className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                    />
                                </div>
                            )}
                            <div className='col-span-2 text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                <Label>Description</Label>
                                <textarea
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:outline-none"
                                    placeholder="Enter the job description"
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Posting..." : "Post Job"}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Plan selection popup */}
            {showPlanPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Select a Plan</h2>
                        <select value={selectedPlan} onChange={handlePlanChange} className="mb-4">
                            <option value="basic">Basic (Can post 1 job per payment)</option>
                            <option value="standard">Standard (Can post 3 jobs)</option>
                            <option value="premium">Premium (Can post unlimited jobs for 1 month)</option>
                        </select>

                        <CardElement className="my-2 p-2 border rounded" />
                        <div className="flex justify-between mt-4">
                            <Button onClick={() => setShowPlanPopup(false)}>Cancel</Button>
                            <Button onClick={handlePaymentAndPostJob}>Proceed to Payment</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostJob;
