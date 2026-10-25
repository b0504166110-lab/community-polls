function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p style={{ color: 'red', margin: '4px 0' }}>{message}</p>;
}

export default ErrorMessage;
