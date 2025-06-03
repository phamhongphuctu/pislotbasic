import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // ✅ Hàm test thanh toán
  const testPayment = () => {
    const Pi = (window as any).Pi;
    if (!Pi || !Pi.createPayment) {
      alert("❌ SDK chưa sẵn sàng hoặc không chạy trong Pi Browser.");
      return;
    }

    Pi.createPayment(
      {
        amount: 0.01, // test 0.01 Pi
        memo: "test payment",
        metadata: { type: "test" },
      },
      {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("✅ Chờ xác nhận từ server:", paymentId);
          Pi.approvePayment(paymentId); // test: approve ngay (client-only)
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("✅ Giao dịch hoàn tất:", paymentId, txid);
          Pi.completePayment(paymentId);
        },
        onCancel: (paymentId: string) => {
          console.log("❌ Người dùng hủy giao dịch:", paymentId);
        },
        onError: (error: any, paymentId: string) => {
          console.error("❌ Lỗi khi thanh toán:", error);
        }
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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        {/* ✅ Nút test Pi SDK */}
        <button onClick={testPayment} style={{ marginTop: "20px" }}>
          🚀 Test Thanh Toán Pi
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
