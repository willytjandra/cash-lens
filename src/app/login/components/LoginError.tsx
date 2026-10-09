type LoginErrorProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const LoginError = async ({ searchParams }: LoginErrorProps) => {
  const { error } = await searchParams;

  if (!error) {
    return null;
  }

  return <p className="mt-4 text-sm text-red-600">{error}</p>;
};

export default LoginError;
