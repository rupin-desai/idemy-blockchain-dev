import React, { useState } from "react";
import { Button, Input, Select, Textarea } from "../../ui";
import apiClient from "../../services/api.service";

const TestNewIdentity = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [identity, setIdentity] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    contactInfo: {
      email: "",
      phone: "",
    },
    studentInfo: {
      studentId: "",
      department: "cs",
      type: "undergraduate",
    },
    walletAddress: "", // This will be generated by the blockchain service if empty
  });

  const handleInputChange = (section, field, value) => {
    setIdentity((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Creating student identity:", identity);
      
      // Call directly to blockchain route instead of using mock data
      const response = await fetch("/api/blockchain/identity/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("idemy_auth_token")}`
        },
        body: JSON.stringify(identity)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create identity");
      }
      
      console.log("Identity created:", data);
      setSuccess(true);
      
      // Reset form after success
      setIdentity({
        personalInfo: { firstName: "", lastName: "", dateOfBirth
