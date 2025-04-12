import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import { identityTypes } from "../../constants/mockData";

const TestFormControls = ({ onSubmitSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
      onSubmitSuccess();
      reset();
    }, 1500);
  };
  
  return (
    <Card title="Form Controls">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            className={`w-full p-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter full name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="your@email.com"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Identity Type
          </label>
          <select
            className={`w-full p-2 border rounded-md ${errors.type ? "border-red-500" : "border-gray-300"}`}
            {...register("type", { required: "Type is required" })}
          >
            <option value="">Select type...</option>
            {identityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Document
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    {...register("document")}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit Form"}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button 
            type="button" 
            variant="danger" 
            onClick={onError}
          >
            Test Error
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TestFormControls;