export const useNavigate = () => {
  const navigate = (path: string) => {
    // Use the current origin (protocol + hostname + port)
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}${path}`;
  };

  return navigate;
};
