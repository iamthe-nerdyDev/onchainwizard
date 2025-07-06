"use client";

import useForm from "@/hooks/useForm";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Checklist = () => {
  const { data, update } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: data?.user?.name || "",
    age: data?.user?.age || "",
    experience: data?.user?.experience || "",
  });

  const items = [
    {
      title: "What should we call you?",
      description: "Tell us your name so we can personalize your experience",
      isset: !!data?.user.name,
      value: data?.user.name ?? "",
      type: "form",
      field: "name",
      inputType: "text",
      placeholder: "Enter your name",
    },
    {
      title: "How old are you?",
      description: "This helps us customize content for your age group",
      isset: !!data?.user.age,
      value: data?.user.age ?? "",
      type: "form",
      field: "age",
      inputType: "number",
      placeholder: "Enter your age",
    },
    {
      title: "What is your level of experience in web3?",
      description: "This helps us tailor the content to your knowledge level",
      isset: !!data?.user.experience,
      value: data?.user.experience ?? "",
      type: "form",
      field: "experience",
      inputType: "select",
      options: [
        { value: "", label: "Select your experience level" },
        { value: "BEGINNER", label: "Beginner - New to web3" },
        { value: "INTERMEDIATE", label: "Intermediate - Some experience" },
        { value: "ADVANCED", label: "Advanced - Very experienced" },
      ],
    },
    {
      title: "Create a wallet",
      description: "To sign transactions",
      isset: !!data?.user.wallet,
      value: data?.user.wallet,
      type: "action",
      action: "createWallet",
    },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const currentItem = items[currentStep];

    if (currentItem.type === "form" && currentItem.field) {
      const response = await fetch("/api/user", {
        method: "PUT",
        body: JSON.stringify({
          [currentItem.field]: formData[currentItem.field],
        }),
      });

      const { success, message, data: user } = await response.json();
      if (!response.ok || !success) {
        toast.error(message || "Unable to complete request");
      }

      await update({ ...data, user });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const createWallet = async () => {
    try {
      // Here you would implement your wallet creation logic
      // For now, we'll just simulate it
      console.log("Creating wallet...");

      // Simulate wallet creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update session to mark wallet as created
      await update({
        ...data,
        user: {
          ...data?.user,
          wallet: "wallet_created",
        },
      });

      // Move to next step or complete
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  const goToStep = (index: number) => setCurrentStep(index);
  const getStepStatus = (index: number) => {
    if (items[index].isset) return "completed";
    if (index === currentStep) return "current";
    if (index < currentStep) return "available";
    return "locked";
  };

  const isCompleted = items.every((item) => item.isset);

  return (
    <div className="container mx-auto">
      <div className="p-4 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
          A few more things to <br />
          Get you started
        </h1>

        {isCompleted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🎉 All set! You're ready to go!
            </h2>
            <p className="text-green-700">
              You've completed all the setup steps. Welcome to your web3
              journey!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(items.filter((item) => item.isset).length / items.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Step Navigation */}
            <div className="flex space-x-4 mb-8">
              {items.map((item, index) => {
                const status = getStepStatus(index);
                return (
                  <button
                    key={index}
                    onClick={() => status !== "locked" && goToStep(index)}
                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                      status === "completed"
                        ? "bg-green-100 border-green-300 text-green-800"
                        : status === "current"
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : status === "available"
                            ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                            : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={status === "locked"}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xs">
                        {status === "completed" ? "✓" : index + 1}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Current Step Content */}
            {currentStep < items.length && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {items[currentStep].title}
                  </h2>
                  <p className="text-gray-600">
                    {items[currentStep].description}
                  </p>
                </div>

                {items[currentStep].type === "form" && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {items[currentStep].inputType === "select" ? (
                      <select
                        value={formData[items[currentStep].field]}
                        onChange={(e) =>
                          handleChange(
                            items[currentStep].field!,
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {(items[currentStep].options || []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={items[currentStep].inputType}
                        value={formData[items[currentStep].field!]}
                        onChange={(e) =>
                          handleChange(
                            items[currentStep].field!,
                            e.target.value
                          )
                        }
                        placeholder={items[currentStep].placeholder}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min={
                          items[currentStep].inputType === "number"
                            ? "1"
                            : undefined
                        }
                      />
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </form>
                )}

                {items[currentStep].type === "action" && (
                  <div className="space-y-4">
                    <button
                      onClick={createWallet}
                      className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create My Wallet
                    </button>
                    <p className="text-sm text-gray-500 text-center">
                      This will create a secure wallet for your web3
                      transactions
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklist;
