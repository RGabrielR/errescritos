import { useState } from 'react';

const PasswordPrompt: React.FC<{ onSubmit: (credential: string) => void }> = ({ onSubmit }) => {
  const [credential, setCredential] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = () => {
    if (credential) {
      onSubmit(credential);
      setIsOpen(false);
    }
  };

  return isOpen ? (
    <div className="fixed z-30 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-black">Por favor, ingresa el código:</h2>
        <input
          type="password"
          className="border border-gray-300 p-2 rounded w-full mb-4"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  ) : null;
};

export default PasswordPrompt;
