import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState<string>("...");

  useEffect(() => {
    const Pi = (window as any).Pi;
    if (!Pi?.init || !Pi?.authenticate) {
      alert("❌ Pi SDK chưa sẵn sàng. Hãy mở trong Pi Browser.");
      return;
    }

    Pi.init({ version: "2.0", sandbox: true }) // ✅ Sửa chỗ này
      .then(() => {
        console.log("✅ Pi.init hoàn tất");
        return Pi.authenticate(['username']); // đảm bảo đúng chữ 'username'

      })
      .then((user: any) => {
        console.log("✅ Đăng nhập thành công:", user);
        setUsername(user.username || "anonymous");
      })
      .catch((err: any) => {
        console.error("❌ Lỗi khi gọi Pi SDK:", err);
      });
  }, []);

  const testPayment = () => {
    const Pi = (window as any).Pi;
    if (!Pi?.createPayment) {
      alert("❌ Pi SDK chưa sẵn sàng!");
      return;
    }

    Pi.createPayment(
      {
        amount: 0.01,
        memo: "Test Pi payment",
        metadata: { type: "test" }
      },
      {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("🟡 Chờ duyệt từ server:", paymentId);
          Pi.approvePayment(paymentId); // ✅ Test client-only
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("✅ Giao dịch thành công:", paymentId, txid);
          Pi.completePayment(paymentId);
        },
        onCancel: (paymentId: string) => {
          console.warn("❌ Giao dịch bị huỷ:", paymentId);
        },
        onError: (error: any) => {
          console.error("❌ Lỗi thanh toán:", error);
        }
      }
    );
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      <p>👤 Người dùng: {username}</p>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <button
        onClick={testPayment}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#ff0",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        🚀 Test Thanh Toán Pi
      </button>
    </>
  );
}

export default App;

