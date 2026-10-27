import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login, type LoginData } from "../api/authService";
import { getErrorMessage } from "../api/client";
import ErrorMessage from "../components/ErrorMessage";
import { useAppDispatch } from "../store/store";
import { setUser } from "../store/authSlice";
import { setToken } from "../utils/tokenStorage";

const demoAccounts = [
  { label: "משתמש לדוגמה", email: "noa@example.com", password: "User1234!" },
  { label: "מנהל", email: "admin@example.com", password: "Admin1234!" },
];

function LoginPage() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginData>();

  function fillDemo(account: (typeof demoAccounts)[number]) {
    setValue("email", account.email);
    setValue("password", account.password);
    clearErrors();
  }

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => login(data.email, data.password),
    onSuccess: (data) => {
      setToken(data.token);
      dispatch(setUser(data.user));
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>התחברות</h1>

      <div>
        <label>מילוי מהיר</label>
        {demoAccounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => fillDemo(account)}
          >
            {account.label}
          </button>
        ))}
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
          {...register("password", { required: "יש להזין סיסמה" })}
        />
        <ErrorMessage message={errors.password?.message} />
      </div>

      {loginMutation.isError && (
        <ErrorMessage message={getErrorMessage(loginMutation.error)} />
      )}

      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "מתחבר..." : "התחבר"}
      </button>
    </form>
  );
}

export default LoginPage;
