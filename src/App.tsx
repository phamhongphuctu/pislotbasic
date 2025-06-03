import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState<string>("...");

  useEffect(() => {
    const Pi = (window as any).Pi;
    if (!Pi || !Pi.init || !Pi.authenticate) {
      alert("❌ Pi SDK chưa sẵn sàng. Hãy mở trong Pi Browser.");
      return;
    }

    Pi.init({ version: "2.0", sandbox: false })
      .then(() => {
        console.log("✅ Pi.init xong");
        return Pi.authenticate(["username"]);
      })
      .then((user: any) => {
        console.log("✅ Đăng nhập Pi thành công:", user);
        setUsername(user.username || "anonymous");
      })
      .catch((err: any) => {
        console.error("❌ Lỗi Pi SDK:", err);
      });
  }, []);

  const testPayment = () => {
    const Pi = (window as any).Pi;
    if (!Pi || !Pi.createPayment) {
      alert("❌ Pi SDK chưa sẵn sàng!");
      return;
    }

    Pi.createPayment(
      {
        amount: 0.01,
        memo: "Test Pi payment",
        metadata: { type: "test" },
      },
      {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("✅ Chờ xác nhận từ server:", paymentId);
          Pi.approvePayment(paymentId); // ✅ Không có backend nên duyệt luôn
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("✅ Giao dịch thành công:", paymentId, txid);
          Pi.completePayment(paymentId);
        },
        onCancel: (paymentId: string) => {
          console.log("❌ Giao dịch bị hủy:", paymentId);
        },
        onError: (error: any, paymentId: string) => {
          console.error("❌ Lỗi khi thanh toán:", error);
        },
      }
    );
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p>👤 Người dùng: {username}</p>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <button
        onClick={testPayment}
        style={{ marginTop: "20px", padding: "10px", background: "yellow" }}
      >
        🚀 Test Thanh Toán Pi
      </button>
    </>
  );
}

export default App;
