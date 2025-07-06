import { useState } from "react";
import { z } from "zod";

type FormErrors = Record<string, string | undefined>;

export default function (
  callback: () => Promise<void>,
  initialState: Record<string, string> = {}
) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const clear = () => {
    setValues(initialState);
    setErrors({});
  };

  const validate = (schema: z.ZodType<any>) => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });

        setErrors(newErrors);
      }

      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    await callback().finally(() => setIsLoading(false));
  };

  return {
    onChange,
    onSubmit,
    clear,
    setValues,
    isLoading,
    values,
    errors,
    setErrors,
    validate,
  };
}
