import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  register as registerUser,
  type RegisterData,
} from "../api/authService";
import { getErrorMessage, getFieldErrors } from "../api/client";
import ErrorMessage from "../components/ErrorMessage";
import { useAppDispatch } from "../store/store";
import { setUser } from "../store/authSlice";
import { setToken } from "../utils/tokenStorage";
function RegisterPage() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterData>();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) =>
      registerUser(data.name, data.email, data.password),
    onSuccess: (data) => {
      setToken(data.token);
      dispatch(setUser(data.user));
    },
    onError: (error) => {
      const fieldErrors = getFieldErrors(error);
      for (const field of ["name", "email", "password"] as const) {
        if (fieldErrors[field]) {
          setError(field, { message: fieldErrors[field] });
        }
      }
    },
  });

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>הרשמה</h1>
      <div>
        <label htmlFor="name">שם</label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "יש להזין שם",
          })}
        />
        <ErrorMessage message={errors.name?.message} />
      </div>
      <div>
        <label htmlFor="email">מייל</label>
        <input
          id="email"
          type="email"
          dir="ltr"
          {...register("email", {
            required: "יש להזין מייל",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "כתובת מייל לא תקינה",
            },
          })}
        />
        <ErrorMessage message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="password">סיסמה</label>
        <input
          id="password"
          type="password"
          dir="ltr"
          {...register("password", {
            required: "יש להזין סיסמה",
            minLength: { value: 8, message: "לפחות 8 תווים" },
            maxLength: { value: 72, message: "עד 72 תווים" },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)/,
              message: "צריך לפחות אות באנגלית וספרה",
            },
          })}
        />
        <ErrorMessage message={errors.password?.message} />
      </div>

      {registerMutation.isError && !Object.keys(errors).length && (
        <ErrorMessage message={getErrorMessage(registerMutation.error)} />
      )}

      <button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "נרשם..." : "הרשם"}
      </button>
    </form>
  );
}

export default RegisterPage;
