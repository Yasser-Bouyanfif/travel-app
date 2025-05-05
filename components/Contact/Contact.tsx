"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const ContactPage = () => {
  const session = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });

  const [redInputs, setRedInputs] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  useEffect(() => {
    const user = session?.data?.user;
    if (user) {
      setFormData({
        ...formData,
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (redInputs[name as keyof typeof redInputs]) {
      setRedInputs((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newRedInputs = {
      name: !formData.name,
      email: !formData.email,
      subject: !formData.subject,
      message: !formData.message,
    };

    if (Object.values(newRedInputs).some(Boolean)) {
      toast.error("Please fill in all the required fields.");
      setRedInputs(newRedInputs);
      return;
    }

    if (!formData.consent) {
      toast.error("Please check this box to proceed");
      return;
    }

    const loadingToast = toast.loading("Email sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      if (res.ok) {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          consent: false,
        });
        toast.success("Your message has been sent successfully.");
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We typically respond within 24 hours
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm ${redInputs.name ? "border-red-500" : ""}`}
                minLength={2}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm ${redInputs.email ? "border-red-500" : ""}`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm ${redInputs.subject ? "border-red-500" : ""}`}
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  Select a subject
                </option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales Inquiry</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm ${redInputs.message ? "border-red-500" : ""}`}
                placeholder="Please describe your request in detail..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                checked={formData.consent}
                onChange={handleChange}
              />
              <label
                htmlFor="consent"
                className="ml-2 block text-sm text-gray-700"
              >
                I consent to having my data used to contact me
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                                 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                                 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>You can also reach us directly at:</p>
          <p className="mt-1 text-blue-600 font-medium">yasser@travelapp.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
