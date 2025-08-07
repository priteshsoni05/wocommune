export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md p-4">
        <h1 className="text-2xl font-bold">Check Your Email 📩</h1>
        <p className="text-muted-foreground">
          We've sent a confirmation link to your email. Please verify your account to complete the signup process.
        </p>
        <p className="text-sm">If you didn't receive the email, check your spam folder or try signing up again with a different address.</p>
      </div>
    </div>
  );
}