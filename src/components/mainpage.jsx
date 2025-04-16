import React from "react";

const Mainpage = () => {
    return(
        <div style={{ padding: '20px', fontFamily: "'Segoe UI', sans-serif" }}>
            <h1>Welcome to the Main Page</h1>
            <p>This is a protected route, only accessible if you are logged in.</p>
            <p>Here you can add your main application content.</p>
        </div>
    )
}
export default Mainpage;