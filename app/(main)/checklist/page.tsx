"use client";

import { updateUserInformation } from "@/components/tambo/tools/app/user";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import Link from "next/link";

const Checklist = () => {
  const { data, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const items = [
    {
      title: "What should we call you?",
      description: "Tell us your name",
      isset: !!data?.user.name,
      value: data?.user.name ?? "",
      field: "name",
      inputType: "text",
      placeholder: "Enter your name",
      fn: async function (value: string) {
        return await updateUserInformation({ name: value });
      },
    },
    {
      title: "How old are you?",
      description: "This helps us customize response for your age group",
      isset: !!data?.user.age,
      value: data?.user.age ?? "",
      field: "age",
      inputType: "number",
      placeholder: "Enter your age",
      fn: async function (value: string) {
        return await updateUserInformation({ age: Number(value) });
      },
    },
    {
      title: "What is your level of experience in web3?",
      description: "This helps us tailor the responses to your knowledge level",
      isset: !!data?.user.experience,
      value: data?.user.experience ?? "",
      field: "experience",
      inputType: "select",
      placeholder: "Select your experience level",
      options: [
        { value: "BEGINNER", label: "Beginner - New to web3" },
        { value: "INTERMEDIATE", label: "Intermediate - Some experience" },
        { value: "ADVANCED", label: "Advanced - Very experienced" },
      ],
      fn: async function (value: string) {
        return await updateUserInformation({ experience: value as any });
      },
    },
  ];

  const isCompleted = items.every((item) => item.isset);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const index = formData.get("index");
    const item = items[Number(index)];
    const value = formData.get(item.field);

    try {
      const user = await item.fn(value as string);

      await update({ ...data?.user, ...user });
      toast.success(`${item.field} saved!`);
    } catch (e: any) {
      toast.error(e.message || "Unable to complete request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-4 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl mb-5">
          A few more things to <br />
          Get you started
        </h1>

        {isCompleted ? (
          <div className="py-5">
            <Button
              size={"lg"}
              className="bg-black text-white hover:bg-black hover:text-white"
            >
              <Link href={"/chat"}>Get chatty!</Link>
              <IconArrowRight />
            </Button>
          </div>
        ) : (
          <div>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              {items.map((item, idx) => (
                <AccordionItem key={item.field} value={`item-${idx + 1}`}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <h3 className="text-md">{item.title}</h3>
                      {item.isset ? (
                        <IconCheck size={18} className="stroke-green-500" />
                      ) : null}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <form action="#" onSubmit={onSubmit}>
                      <p className="mb-4">{item.description}</p>

                      <input type="hidden" name="index" value={String(idx)} />
                      <div className="flex w-full max-w-sm items-center gap-2">
                        {item.inputType == "select" ? (
                          <Select
                            defaultValue={item.value}
                            required
                            name={item.field}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={item.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectGroup>
                                <SelectLabel>Experience Level</SelectLabel>
                                {item.options?.map(({ label, value }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={item.inputType}
                            name={item.field}
                            id={item.field}
                            defaultValue={item.value}
                            placeholder={item.placeholder}
                            required
                          />
                        )}
                        <Button
                          type="submit"
                          variant="outline"
                          className="bg-black text-white hover:bg-black hover:text-white"
                          disabled={isLoading}
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklist;
