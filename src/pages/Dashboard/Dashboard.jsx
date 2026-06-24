import React from "react";
import styles from "./Dashboard.module.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const dashboardData = {
    pendingOrders: 18,
    processedOrders: 42,
    pendingMessages: 7,
    balance: 125000,
  };
  const salesData = [
    { month: "Jan", sales: 40 },
    { month: "Feb", sales: 60 },
    { month: "Mar", sales: 80 },
    { month: "Apr", sales: 55 },
    { month: "May", sales: 90 },
    { month: "Jun", sales: 70 },
  ];

  return (
    <div className={styles.dashboard}>
      {/* <h1 className={styles.title}>Dashboard</h1> */}

      <div className={styles.cardGrid}>
        {/* Card 1 - Graph */}
        <div className={`${styles.card} ${styles.graphCard}`}>
          <h3>Sales Overview</h3>

          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Card 2 - Orders */}
        <div className={styles.card}>
          <h3>Orders</h3>

          <div className={styles.statBox}>
            <span>Pending</span>
            <strong>{dashboardData.pendingOrders}</strong>
          </div>

          <div className={styles.statBox}>
            <span>Processed</span>
            <strong>{dashboardData.processedOrders}</strong>
          </div>
        </div>

        {/* Card 3 - Messages */}
        <div className={styles.card}>
          <h3>Messages</h3>

          <div className={styles.bigNumber}>
            {dashboardData.pendingMessages}
          </div>

          <p>Pending Messages</p>
        </div>

        {/* Card 4 - Balance */}
        <div className={styles.card}>
          <h3>Payment Balance</h3>

          <div className={styles.balance}>
            ₹ {dashboardData.balance.toLocaleString()}
          </div>

          <p>Available Balance</p>
        </div>
      </div>
    </div >
  );
}