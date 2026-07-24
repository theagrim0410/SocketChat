import React from "react";
import "./Error.css";
import { IoWarningOutline } from "react-icons/io5";
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
            <IoWarningOutline size={80} color="#ff4d4f" />
          <h1> Page Can't Load</h1>
          <p>Something went wrong.</p>
          <div className="error-actions">
          <button className="reload-btn" onClick={() => window.location.reload()}>
            Reload
          </button>
          <button className="reload-btn" onClick={() => window.location.href = "/"}>
            Go to Home
          </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;