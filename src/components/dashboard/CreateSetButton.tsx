import React from "react";
import { useNavigate } from "@/components/hooks/useNavigate";

interface Props {
  onCreate: () => void;
}




const CreateSetButton: React.FC<Props> = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
      onClick={() => navigate("/sets/new")}
      aria-label="Utwórz nowy zestaw fiszek"
    >
      + Utwórz zestaw
    </button>
  );
};

export default CreateSetButton;
