import React, { useEffect, useState } from "react";
import {
  getPlans,
  addPlan,
  updatePlan,
  deletePlan,
} from "../../services/subscriptionPlanService";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminSubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    pricing: "",
    deliveryFrequency: "",
    updateId: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAllPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (error) {
        console.error("Error loading plans", error);
      }
    };

    fetchAllPlans();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updatePlan(formData.updateId, {
          name: formData.name,
          description: formData.description,
          duration: formData.duration,
          pricing: formData.pricing,
          deliveryFrequency: formData.deliveryFrequency,
        });
        setIsEditing(false);
      } else {
        await addPlan({
          name: formData.name,
          description: formData.description,
          duration: formData.duration,
          pricing: formData.pricing,
          deliveryFrequency: formData.deliveryFrequency,
        });
      }
      setFormData({
        name: "",
        description: "",
        duration: "",
        pricing: "",
        deliveryFrequency: "",
        updateId: null,
      });
      const updatedPlans = await getPlans();
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      duration: plan.duration,
      pricing: plan.pricing,
      deliveryFrequency: plan.deliveryFrequency,
      updateId: plan._id,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      const updatedPlans = await getPlans();
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error deleting plan", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Subscription Plans Report", 14, 22);
    doc.autoTable({
      head: [
        ["Name", "Description", "Duration", "Pricing", "Delivery Frequency"],
      ],
      body: plans.map((plan) => [
        plan.name,
        plan.description,
        plan.duration,
        plan.pricing,
        plan.deliveryFrequency,
      ]),
      startY: 30,
    });
    doc.save("subscription-plans-report.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <button
          onClick={generateReport}
          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Generate Report
        </button>
      </div>

      <form className="max-w-sm mx-auto mb-8" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Plan Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter plan name"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter plan description"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="duration"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Duration
          </label>
          <input
            type="text"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter duration"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="pricing"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Pricing
          </label>
          <input
            type="text"
            id="pricing"
            value={formData.pricing}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter pricing"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="deliveryFrequency"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Delivery Frequency
          </label>
          <input
            type="text"
            id="deliveryFrequency"
            value={formData.deliveryFrequency}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter delivery frequency"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {isEditing ? "Update Plan" : "Add Plan"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Pricing</th>
              <th className="px-6 py-3">Delivery Frequency</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan._id}
                className="bg-white border-b"
              >
                <td className="px-6 py-4">{plan.name}</td>
                <td className="px-6 py-4">{plan.description}</td>
                <td className="px-6 py-4">{plan.duration}</td>
                <td className="px-6 py-4">{plan.pricing}</td>
                <td className="px-6 py-4">{plan.deliveryFrequency}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscriptionPlans;
